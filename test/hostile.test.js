import { test } from 'node:test';
import assert from 'node:assert/strict';
import { symlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { LIMITS, MAX_PROBLEMS, OVERLAP_LIMITS, parseJson, weekdayOf } from '../src/index.js';
import { ARGS, BASE_TEAM, DAY0, cli, filesWith, person, run, teamText, teamWith, withFiles } from './helpers.js';

// Hostile input: team files built to exhaust the memory or the time, to rewrite the terminal, to break a table, to be
// read as a formula, or to change how objects behave. Each test also checks the time, because work that grows faster
// than the input is a failure even when the answer is right. Tests that need a symbolic link or a device are guarded
// with process.platform, and none of them asserts a line or a column: those are asserted in the tests that run
// everywhere.

const LIMIT = { timeout: 180000 };
// Coverage counting slows every line of the tool several times over, so a run with --experimental-test-coverage gets a
// wider time limit. A plain `npm test` keeps the tight one, and that is the run that guards against slow growth.
// The runner sets NODE_V8_COVERAGE for its test processes only when coverage is on.
const COVERAGE = Boolean(process.env.NODE_V8_COVERAGE);
const fast = async (fn, ms = 5000) => {
  const limit = COVERAGE ? ms * 4 : ms;
  const start = Date.now();
  const result = await fn();
  assert.ok(Date.now() - start < limit, `took ${Date.now() - start} ms`);
  return result;
};

const ZONES = ['Europe/Berlin', 'America/New_York', 'America/Sao_Paulo', 'Asia/Kolkata', 'Australia/Sydney', 'Europe/Lisbon', 'Asia/Tokyo', 'America/Los_Angeles', 'Africa/Cairo', 'Pacific/Auckland'];

test('hostile: a hundred people in ten zones over a thousand days, nearly two hundred thousand checks, in seconds', LIMIT, async () => {
  const people = Array.from({ length: 100 }, (_, i) => person(`P${i}`, ZONES[i % 10], { 'mon-fri': ['08:00-12:00', '13:00-17:00'] }, { daysOff: [i, i + 7] }));
  const team = { dayZone: 'Europe/Berlin', people, rules: { anchorOverlap: { anchor: ['P0'], minMinutes: 60 }, coreWindow: { zone: 'UTC', start: '12:00', end: '13:00', days: ['mon-fri'] } } };
  const r = await fast(() => run(filesWith(team), ['--team', 'team.json', '--from', String(DAY0), '--days', '1000']), 30000);
  assert.equal(r.code, 1, r.err.slice(0, 500));
  const weekdays = Array.from({ length: 1000 }, (_, i) => weekdayOf(DAY0 + i)).filter((d) => d >= 1 && d <= 5).length;
  assert.ok(r.out.includes(` checks on ${weekdays} days: `), r.out.split('\n').find((l) => l.startsWith('results:')));
});

test('hostile: a team and a range over the cap of checks stop at once with no verdict', LIMIT, async () => {
  const people = Array.from({ length: 100 }, (_, i) => person(`P${i}`, ZONES[i % 10]));
  const r = await fast(() => run(filesWith({ dayZone: 'UTC', people, rules: { pairOverlap: { minMinutes: 60 } } }), ['--team', 'team.json', '--from', String(DAY0), '--days', '1000']), 5000);
  assert.equal(r.code, 2);
  assert.match(r.err, /the team and the range give up to 4,950,000 checks, more than 200,000; give fewer days with --days or check part of the team/);
  assert.equal(r.out, '');
  assert.equal(OVERLAP_LIMITS.maxChecks, 200000);
});

test('hostile: a team file over the size limit is refused before it is read, and JSON nested deep or very long in one pass', LIMIT, async () => {
  const big = await fast(() => run({ 'team.json': `{"name": "${'x'.repeat(2 * 1024 * 1024)}"}` }, ARGS));
  assert.equal(big.code, 2);
  assert.match(big.err, /team\.json: [\d,]+ bytes is over the 1 MB limit/);
  assert.equal(LIMITS.maxTeamBytes, 1024 * 1024);
  const small = await run(filesWith(), ARGS, { maxTeamBytes: 50 });
  assert.match(small.err, /team\.json: \d+ bytes is over the 50 byte limit/);
  for (const content of ['['.repeat(500000), `{"name": "${'x'.repeat(5000)}"}`, `{"people": [${'"a",'.repeat(100001)}"a"]}`]) {
    const r = await fast(() => run({ 'team.json': content }, ARGS));
    assert.equal(r.code, 2);
    assert.ok(r.err.length < 3000, 'the error stays short');
  }
  await fast(async () => assert.throws(() => parseJson(`[${'1,'.repeat(300000)}1]`), /more than 100000 values/));
});

test('hostile: a team file with a thousand days off and five hundred holidays is read and checked in seconds', LIMIT, async () => {
  const daysOff = Array.from({ length: 1000 }, (_, i) => i - 500);
  const holidays = Array.from({ length: 500 }, (_, i) => ({ name: `H${i}`, days: Array.from({ length: 50 }, (_, j) => (i * 50 + j) % 3000), people: ['Ana'] }));
  const team = teamWith({ people: [person('Ana', 'Europe/Berlin', undefined, { daysOff }), person('Bo', 'Europe/London')], holidays });
  const r = await fast(() => run(filesWith(team), ['--team', 'team.json', '--from', String(DAY0), '--days', '1000', '--format', 'json']), 15000);
  assert.equal(r.code, 1, r.err.slice(0, 300));
});

test('hostile: control, escape and direction characters in names are refused, and in holidays never reach the reports', async () => {
  const esc = String.fromCharCode(27);
  const rlo = String.fromCharCode(0x202e);
  const nel = String.fromCharCode(0x85);
  const ls = String.fromCharCode(0x2028);
  for (const c of [esc, rlo, nel, ls, String.fromCharCode(0x2066)]) {
    const refused = await run(filesWith(teamWith({ people: [person(`Ana${c}[31m`, 'UTC'), person('Bo', 'UTC')] })), ARGS);
    assert.equal(refused.code, 2);
    assert.ok(!refused.err.includes(c), String(c.charCodeAt(0)));
    assert.match(refused.err, /no control character/);
  }
  const team = teamWith({ people: [person('Ana', 'Europe/Berlin', undefined, { daysOff: [0] }), person('Bo', 'Europe/London')], holidays: [{ name: `Day${rlo}${ls}${esc}z`, days: [1], people: ['Ana'] }] });
  for (const format of ['text', 'markdown', 'json']) {
    const r = await run(filesWith(team), [...ARGS, '--format', format, '--explain', '--day-labels', 'offset']);
    assert.equal(r.code, 2, 'a holiday name is held to the same rule');
    for (const c of [esc, rlo, nel, ls]) assert.ok(!r.err.includes(c), `${format}: ${c.charCodeAt(0)}`);
  }
});

test('hostile: a team file with thousands of problems lists twenty and a count, quickly', LIMIT, async () => {
  const people = Array.from({ length: 100 }, (_, i) => person(`P${i}`, 'Mars/Base'));
  const r = await fast(() => run(filesWith(teamWith({ people })), ARGS));
  assert.equal(r.code, 2);
  assert.match(r.err, /the input has 21 problems:/);
  assert.ok(r.err.endsWith('\n  and 80 more\n'), r.err.slice(-200));
  assert.equal(MAX_PROBLEMS, 20);
});

test('hostile: __proto__, constructor and toString as names and keys are only data', async () => {
  const team = teamWith({ people: [person('__proto__', 'Europe/Berlin'), person('constructor', 'Europe/London'), person('toString', 'UTC')], holidays: [{ name: 'hasOwnProperty', days: [0], people: ['__proto__'] }], rules: { anchorOverlap: { anchor: ['__proto__'], minMinutes: 60 } } });
  const r = await run(filesWith(team), [...ARGS, '--format', 'json']);
  assert.equal(r.code, 1, r.err);
  const report = JSON.parse(r.out);
  assert.deepEqual(report.days[0].checks.map((c) => c.who), ['constructor with __proto__', 'toString with __proto__']);
  const keys = await run({ 'team.json': '{"__proto__": {"x": 1}, "people": [], "rules": {}}' }, ARGS);
  assert.equal(keys.code, 2);
  assert.match(keys.err, /__proto__: unknown key/);
  assert.equal({}.x, undefined);
  assert.equal(Object.getPrototypeOf({}), Object.prototype);
});

test('hostile: a device or a link to one is refused as not a regular file, with no line or column', LIMIT, async (t) => {
  if (process.platform === 'win32') {
    t.skip('Windows has no /dev/zero and needs extra rights to make a symbolic link');
    return;
  }
  const device = await fast(() => cli(['--team', '/dev/zero', '--from', String(DAY0), '--days', '7'], process.cwd()));
  assert.equal(device.code, 2);
  assert.match(device.err, /not a regular file/);
  await withFiles({}, async (dir) => {
    await symlink('/dev/zero', resolve(dir, 'team.json'));
    const r = await fast(() => cli(ARGS, dir));
    assert.equal(r.code, 2);
    assert.match(r.err, /team\.json: not a regular file/);
  });
});

test('hostile: a link to a regular team file named on the command line is read, because the person who runs the tool named it', async (t) => {
  if (process.platform === 'win32') {
    t.skip('Windows needs extra rights to make a symbolic link');
    return;
  }
  await withFiles({ 'real.json': teamText(BASE_TEAM) }, async (dir) => {
    await symlink(resolve(dir, 'real.json'), resolve(dir, 'team.json'));
    const r = await cli(ARGS, dir);
    assert.equal(r.code, 0);
    assert.match(r.out, /core-hours-overlap-check: team\.json/);
  });
});
