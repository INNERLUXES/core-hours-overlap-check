import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { USAGE, VERSION, buildReport, guardFormula, hoursText, mdCell, parseArgs, reasonText, ruleText, toJson, toMarkdown, toText } from '../src/index.js';
import { ARGS, BASE_TEAM, DAY0, cli, filesWith, isoDay, person, run, teamOf, teamText, teamWith, withFiles } from './helpers.js';

const YEAR = /\b(?:19|20)\d{2}\b/;
const report = (team = BASE_TEAM, from = DAY0, count = 7, labels = 'offset') => buildReport({ text: teamText(team), file: 'team.json', from, count, labels, version: VERSION });

test('cli: --help and --version', async () => {
  for (const flag of ['--help', '-h']) {
    const r = await cli([flag]);
    assert.equal(r.code, 0);
    assert.equal(r.out, USAGE);
  }
  const v = await cli(['--version']);
  assert.equal(v.code, 0);
  assert.equal(v.out, `${VERSION}\n`);
  assert.equal(VERSION, '1.0.0');
  for (const s of ['--team <file>', '--from <day>', '--days <n>', '--day-labels <kind>', '--format <name>', '--explain', '--out <file>', 'pair-overlap (rules.pairOverlap)', 'Exit codes: 0 every check meets the rules, 1 a check on some day is short of its rule, 2 usage or input error.']) assert.ok(USAGE.includes(s), s);
});

test('cli: --from and --days are required, because the tool reads no clock', async () => {
  const cases = [
    [[], /give the team file with --team <file>/],
    [['--team', 'team.json'], /give the first day with --from YYYY-MM-DD or a day number; the tool reads no clock/],
    [['--team', 'team.json', '--from', String(DAY0)], /give the number of days with --days <n>/],
    [['--team', 'team.json', '--from', 'today', '--days', '7'], /--from today is not a date written YYYY-MM-DD or a day number/],
    [['--team', 'team.json', '--from', String(DAY0), '--days', '0'], /--days 0 is not a whole number from 1 to 1000/],
    [['--team', 'team.json', '--from', String(DAY0), '--days', '1001'], /--days 1001 is not a whole number/],
    [[...ARGS, '--day-labels', 'weeks'], /unknown day labels weeks \(date or offset\)/],
    [[...ARGS, '--format', 'html'], /unknown format html \(text, markdown or json\)/],
    [[...ARGS, '--team', 'b.json'], /--team was given twice/],
    [[...ARGS, '--from'], /--from needs a value/],
    [[...ARGS, '--out', '--explain'], /--out needs a value/],
    [[...ARGS, '--verbose'], /unknown argument --verbose/],
    [['team.json'], /unexpected argument team\.json; give the team file with --team team\.json/],
    [['--team', '-'], /reading from standard input is not supported/],
    [['-'], /reading from standard input is not supported/],
    [['--team', 'https://example.com/team.json', '--from', String(DAY0), '--days', '7'], /give a local path; the tool never fetches a URL/]
  ];
  for (const [argv, pattern] of cases) {
    const r = await cli(argv);
    assert.equal(r.code, 2, argv.join(' '));
    assert.match(r.err, pattern, argv.join(' '));
    assert.ok(r.err.includes('Usage: core-hours-overlap-check'), 'the usage follows a usage error');
    assert.equal(r.out, '');
  }
  assert.deepEqual(parseArgs(ARGS), { team: 'team.json', from: DAY0, days: 7, labels: 'date', format: 'text', explain: false, out: null, help: false, version: false });
  assert.equal(parseArgs(['--team', 't', '--from', isoDay(DAY0), '--days', '3']).from, DAY0);
});

test('exit codes: 0 when every check meets the rules, 1 when one is short, 2 for an input problem with no verdict', async () => {
  const pass = await run(filesWith(), ARGS);
  assert.equal(pass.code, 0, pass.err);
  assert.match(pass.out, /RESULT: PASS - all 5 checks on 5 days meet the rules\n$/);
  const fail = await run(filesWith(teamWith({ rules: { pairOverlap: { minMinutes: 421 } } })), ARGS);
  assert.equal(fail.code, 1);
  assert.match(fail.out, /RESULT: FAIL - 5 of 5 checks on 5 days are short of the rules\n$/);
  const missing = await run({}, ARGS);
  assert.equal(missing.code, 2);
  assert.equal(missing.err, 'core-hours-overlap-check: no verdict, the input has a problem:\n  team.json: no such file\n');
  const bad = await run({ 'team.json': '{"people": [], "rules": {}, "colour": 1}' }, ARGS);
  assert.equal(bad.code, 2);
  assert.equal(bad.err, [
    'core-hours-overlap-check: no verdict, the input has 3 problems:',
    '  team.json:1: people: is an empty list; leave the key out instead',
    '  team.json:1: colour: unknown key; the keys here are name, dayZone, people, holidays, rules',
    '  team.json:1: rules: states no rule; a check with no rule would always pass',
    ''
  ].join('\n'));
  assert.equal(bad.out, '');
});

test('text report: what was read, the checks that are short with their reasons, every day, and the result', () => {
  const team = teamWith({ people: [person('Ana', 'Europe/Berlin'), person('Bo', 'Europe/London', { 'mon-fri': ['09:00-12:00', '13:00-17:00'] }, { daysOff: [1] })], rules: { pairOverlap: { minMinutes: 360 } } });
  const text = toText(report(team));
  const lines = text.split('\n');
  assert.equal(lines[0], 'core-hours-overlap-check: team.json (Test team)');
  assert.equal(lines[1], 'range: 7 days, day 0 (Mon) to day 6 (Sun); days counted in Europe/Berlin');
  assert.equal(lines[2], 'people: 2 people in 2 time zones');
  assert.equal(lines[3], '  Ana  Europe/Berlin  mon-fri 09:00-17:00');
  assert.equal(lines[4], '  Bo   Europe/London  mon-fri 09:00-12:00, 13:00-17:00');
  assert.equal(lines[5], 'rules: pair-overlap: every two people share at least 360 minutes a day (days of Europe/Berlin)');
  assert.equal(lines[6], 'clock changes: none in the range');
  assert.equal(lines[7], 'absences: Bo day off on day 1 (Tue)');
  assert.equal(lines[8], 'results: 5 checks on 5 days: 4 met, 1 short on 1 day');
  assert.ok(text.includes('Short of the rules (1)\n\n  day 1 (Tue)\n    pair-overlap  Ana and Bo: 0 minutes, 360 needed\n                  Bo has a day off on day 1 (Tue)\n'));
  assert.ok(text.includes('  day 0 (Mon)  pair-overlap Ana+Bo 360\n  day 1 (Tue)  pair-overlap Ana+Bo 0*\n'));
  assert.ok(text.includes('  day 5 (Sat)  no check\n'));
  assert.ok(text.endsWith('RESULT: FAIL - 1 of 5 checks on 1 day is short of the rules\n'));
  assert.ok(!text.includes('Basis'), 'the sentences show with --explain only');
});

test('--explain: the UTC moments behind each number, the day window, and the sentences the rules rest on', () => {
  const text = toText(report(), { explain: true });
  assert.ok(text.includes([
    '    pair-overlap Ana and Bo: 420 minutes, 240 needed',
    '      day of Europe/Berlin (UTC+01:00): day -1 23:00Z-23:00Z',
    '      Ana (Europe/Berlin, UTC+01:00): 08:00Z-16:00Z',
    '      Bo (Europe/London, UTC+00:00): 09:00Z-17:00Z',
    '      shared: 09:00Z-16:00Z = 420 minutes'
  ].join('\n')));
  assert.match(text, /Basis\n\n {2}"Because the daylight saving rules for local time zones are so convoluted/);
  const dated = toText(report(BASE_TEAM, DAY0, 1, 'date'), { explain: true });
  assert.ok(dated.includes(`day of Europe/Berlin (UTC+01:00): ${isoDay(DAY0 - 1)}T23:00Z-23:00Z`));
});

test('day labels: offset labels keep every report free of dates; date labels show them', () => {
  for (const [format, fn] of [['text', toText], ['markdown', toMarkdown], ['json', toJson]]) {
    const r = report(teamWith({ holidays: [{ name: 'Founders day', days: [isoDay(DAY0 + 2)], people: ['Ana'] }] }));
    const out = fn(r, { explain: true });
    assert.doesNotMatch(out, YEAR, format);
    assert.ok(out.includes('day 2 (Wed)'), format);
  }
  const dated = toJson(report(BASE_TEAM, DAY0, 7, 'date'));
  const json = JSON.parse(dated);
  assert.equal(json.range.from, isoDay(DAY0));
  assert.equal(json.days[0].date, isoDay(DAY0));
  assert.equal(json.days[0].label, `${isoDay(DAY0)} (Mon)`);
});

test('Markdown report: tables of the checks that are short and of every day, escaped, with formulas guarded', () => {
  const team = teamWith({ people: [person('=HYPERLINK(1)', 'Europe/Berlin'), person('Bo|<b>*x*', 'Europe/London', undefined, { daysOff: [0] })], rules: { pairOverlap: { minMinutes: 60 } } });
  const md = toMarkdown(report(team), { explain: true });
  assert.ok(md.startsWith('## core-hours-overlap-check: FAIL - 1 of 5 checks on 1 day is short of the rules\n'));
  assert.ok(md.includes("| '=HYPERLINK(1) | Europe/Berlin | mon-fri 09:00-17:00 |"));
  assert.ok(md.includes('Bo\\|&lt;b&gt;\\*x\\*'));
  assert.ok(md.includes('| Day | pair-overlap =HYPERLINK(1)+Bo\\|&lt;b&gt;\\*x\\* |'));
  assert.ok(md.includes('| day 0 (Mon) | **0\\*** |'));
  assert.ok(md.includes('| day 5 (Sat) | - |'));
  assert.ok(md.includes('### The moments behind each number'));
  assert.ok(md.includes('### Basis'));
  assert.equal(guardFormula('+1'), "'+1");
  assert.equal(guardFormula('a'), 'a');
  assert.equal(mdCell('a|b\nc'), 'a\\|b c');
  assert.equal(mdCell('@x'), "'@x");
});

test('JSON report: the whole report, the explain lines and the sentences only with --explain', () => {
  const r = report(teamWith({ rules: { pairOverlap: { minMinutes: 421 } } }));
  const plain = JSON.parse(toJson(r));
  assert.equal(plain.tool, 'core-hours-overlap-check');
  assert.equal(plain.version, VERSION);
  assert.deepEqual(plain.totals, { days: 7, daysWithChecks: 5, checks: 5, met: 0, short: 5, shortDays: 5 });
  assert.equal(plain.days[0].checks[0].explain, undefined);
  assert.equal(plain.basis, undefined);
  assert.equal(plain.verdict.pass, false);
  assert.deepEqual(plain.failures[0], { label: 'day 0 (Mon)', day: 0, rule: 'pair-overlap', who: 'Ana and Bo', short: 'Ana+Bo', minutes: 420, need: 421, met: false, reasons: [{ kind: 'hours', text: 'the working hours share 420 of 421 minutes' }] });
  const full = JSON.parse(toJson(r, { explain: true }));
  assert.ok(full.days[0].checks[0].explain.length >= 4);
  assert.deepEqual(full.basis.map((b) => b.key), ['rfcUtc', 'tzUpdated']);
});

test('texts: hours, rules and reasons as the reports write them', () => {
  const c = teamOf(teamWith({ people: [person('Ana', 'UTC', { 'mon-wed': ['09:00-12:00', '13:00-17:00'], thu: ['09:00-12:00', '13:00-17:00'], sat: ['10:00-11:00'] }), person('Bo', 'UTC')] }));
  assert.equal(hoursText(c.people[0].week), 'mon-thu 09:00-12:00, 13:00-17:00; sat 10:00-11:00');
  assert.equal(ruleText({ key: 'coreWindow', zone: 'UTC', start: 540, end: 600, days: [1, 2, 3, 5, 0] }), 'everyone works 09:00-10:00 UTC in full on mon-wed, fri, sun');
  assert.equal(ruleText({ key: 'anchorOverlap', anchor: ['Ana', 'Bo'], minMinutes: 1 }, 'UTC'), 'everyone shares at least 1 minute a day with Ana and Bo (days of UTC)');
  const check = { rule: { key: 'pairOverlap' } };
  assert.equal(reasonText({ kind: 'hours', notWorking: ['Ana', 'Bo'] }, check, { minutes: 0, need: 60 }, String), 'Ana and Bo have no working hours in the window; the working hours share 0 of 60 minutes');
});

test('--out: the report goes to the file and the verdict to standard error; an input is never overwritten', async () => {
  await withFiles(filesWith(), async (dir) => {
    const r = await cli([...ARGS, '--out', 'report.md', '--format', 'markdown'], dir);
    assert.equal(r.code, 0);
    assert.equal(r.out, '');
    assert.equal(r.err, 'core-hours-overlap-check: the report is in report.md; PASS - all 5 checks on 5 days meet the rules\n');
    assert.match(await readFile(resolve(dir, 'report.md'), 'utf8'), /^## core-hours-overlap-check: PASS/);
    const same = await cli([...ARGS, '--out', './team.json'], dir);
    assert.equal(same.code, 2);
    assert.match(same.err, /team\.json: is one of the inputs; give --out another file/);
    assert.equal(await readFile(resolve(dir, 'team.json'), 'utf8'), teamText(BASE_TEAM));
    const nowhere = await cli([...ARGS, '--out', 'missing/report.txt'], dir);
    assert.equal(nowhere.code, 2);
    assert.match(nowhere.err, /cannot be written/);
    assert.deepEqual((await readdir(dir)).sort(), ['report.md', 'team.json'], 'nothing else is written');
  });
});

test('a run leaves the folder as it was', async () => {
  await withFiles(filesWith(), async (dir) => {
    const before = await readdir(dir);
    for (const format of ['text', 'markdown', 'json']) assert.equal((await cli([...ARGS, '--format', format, '--explain'], dir)).code, 0);
    assert.deepEqual(await readdir(dir), before);
  });
});
