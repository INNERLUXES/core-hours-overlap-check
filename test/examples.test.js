import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../src/index.js';
import { ARGS, EXAMPLE_DAYS, EXAMPLE_FROM } from '../tools/example.mjs';
import { DAY0 } from './helpers.js';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');

async function run(argv, base = root) {
  let out = '';
  let err = '';
  const code = await main(argv, { out: (t) => { out += t; }, err: (t) => { err += t; } }, undefined, base);
  return { code, out, err };
}

const saved = (name) => readFile(resolve(root, 'examples/output', name), 'utf8');

test('examples: the made-up team fails with the report that is saved in examples/output', async () => {
  const r = await run(ARGS);
  assert.equal(r.code, 1);
  assert.equal(r.err, '');
  assert.equal(r.out, await saved('team.txt'));
  assert.match(r.out, /results: 175 checks on 25 days: 144 met, 31 short on 20 days/);
  assert.match(r.out, /RESULT: FAIL - 31 of 175 checks on 20 days are short of the rules\n$/);
  assert.equal(EXAMPLE_FROM, DAY0);
  assert.equal(EXAMPLE_DAYS, 35);
});

test('examples: --explain, Markdown and JSON are the reports that are saved', async () => {
  assert.equal((await run([...ARGS, '--explain'])).out, await saved('team-explain.txt'));
  assert.equal((await run([...ARGS, '--format', 'markdown', '--explain'])).out, await saved('team.md'));
  assert.equal((await run([...ARGS, '--format', 'json', '--explain'])).out, await saved('team.json'));
});

test('examples: each check that is short, with the reason the README describes', async () => {
  const report = JSON.parse((await run([...ARGS, '--format', 'json'])).out);
  const byReason = {};
  for (const f of report.failures) for (const kind of new Set(f.reasons.map((r) => r.kind))) (byReason[kind] ??= []).push(`${f.day} ${f.rule} ${f.short}`);
  // Ben misses half of the Berlin window in the three weeks when New York has moved its clocks and Berlin has not.
  assert.deepEqual(byReason['clock-change'].filter((x) => x.endsWith('core-window Ben')).map((x) => Number(x.split(' ')[0])), [7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25]);
  // Caio shares an hour less with Anke once Berlin has moved its clocks, and Sao Paulo keeps its own.
  assert.deepEqual(byReason['clock-change'].filter((x) => x.includes('Caio')).map((x) => x.split(' ').slice(0, 2).join(' ')), ['28 anchor-overlap', '28 core-window', '29 anchor-overlap', '29 core-window', '30 anchor-overlap', '30 core-window', '31 anchor-overlap', '31 core-window', '32 core-window']);
  assert.deepEqual(byReason['day-off'], ['15 anchor-overlap Dina', '15 core-window Dina']);
  assert.deepEqual(byReason.holiday, ['32 anchor-overlap Ben', '32 anchor-overlap Caio', '32 anchor-overlap Dina', '32 core-window Anke', '32 core-window Dina']);
  assert.equal(byReason.hours, undefined, 'every short check has a reason other than the hours themselves');
  assert.deepEqual(report.clockChanges.map((c) => `${c.zone} ${c.label}`), ['America/New_York day 6 (Sun)', 'Europe/Berlin day 27 (Sun)', 'Europe/Lisbon day 27 (Sun)']);
});

test('examples: the first week, before any clock change, meets every rule', async () => {
  const r = await run(['--team', 'examples/team.json', '--from', String(EXAMPLE_FROM), '--days', '7']);
  assert.equal(r.code, 0);
  assert.match(r.out, /RESULT: PASS - all 35 checks on 5 days meet the rules/);
});

test('examples: the same team file written with CRLF line ends gives the same reports', async () => {
  const dir = await mkdtemp(resolve(tmpdir(), 'core-hours-overlap-check-crlf-'));
  try {
    await cp(resolve(root, 'examples'), resolve(dir, 'examples'), { recursive: true });
    const text = (await readFile(resolve(dir, 'examples/team.json'), 'utf8')).split('\r\n').join('\n');
    await writeFile(resolve(dir, 'examples/team.json'), text.split('\n').join('\r\n'));
    const r = await run([...ARGS, '--explain'], dir);
    assert.equal(r.code, 1);
    assert.equal(r.out, await saved('team-explain.txt'));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
