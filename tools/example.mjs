// Runs the example of the README, checks that it reports what the README shows, and writes the reports of the made-up
// team to examples/output. CI runs it and then fails if those files changed, so the example output in the repository is
// always the real output.
//
// The range starts on a day number, not on a date, and the reports label the days by their distance from the first day
// (--day-labels offset), so neither the command nor the reports hold a date: docs/decisions/0001 explains why.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../src/index.js';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');

// The first day of the example range as a day number (whole days since the Unix epoch): a Monday shortly before one
// country moves its clocks forward, three weeks before the other two do.
export const EXAMPLE_FROM = 20514;
export const EXAMPLE_DAYS = 35;

// The arguments of the example; every path is relative to the root of the repository.
export const ARGS = ['--team', 'examples/team.json', '--from', String(EXAMPLE_FROM), '--days', String(EXAMPLE_DAYS), '--day-labels', 'offset'];

// Runs the tool on files of the repository; the paths shown in the report are relative to the root of the repository.
async function run(argv) {
  let out = '';
  const code = await main(argv, { out: (t) => { out += t; }, err: (t) => process.stderr.write(t) }, undefined, root);
  return { code, out };
}

const problems = [];
function expect(name, result, code, expected, unwanted) {
  const missing = expected.filter((e) => !result.out.includes(e));
  const wrong = unwanted.filter((e) => result.out.includes(e));
  if (result.code !== code || missing.length || wrong.length) {
    problems.push(`${name}: unexpected report (exit code ${result.code}, expected ${code}; missing: ${missing.join(' / ') || 'none'}; should not appear: ${wrong.join(' / ') || 'none'})`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const full = await run(ARGS);
  process.stdout.write(full.out);
  expect('example team', full, 1, [
    'clock changes: America/New_York from UTC-05:00 to UTC-04:00 on day 6 (Sun); Europe/Berlin from UTC+01:00 to UTC+02:00 on day 27 (Sun); Europe/Lisbon from UTC+00:00 to UTC+01:00 on day 27 (Sun)',
    'results: 175 checks on 25 days: 144 met, 31 short on 20 days',
    'core-window     Ben: 30 minutes, 60 needed',
    'clock change: America/New_York is at UTC-04:00, ahead of its standard UTC-05:00',
    'clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00',
    'Dina has a day off on day 15 (Tue)',
    'Spring holiday for Anke on day 32 (Fri)',
    'day 4 (Fri)   anchor-overlap Ben 240, Caio 240, Dina 390; core-window Anke 60, Ben 60, Caio 60, Dina 60',
    'RESULT: FAIL - 31 of 175 checks on 20 days are short of the rules'
  ], ['RESULT: PASS', 'day 5 (Sat)   anchor-overlap']);

  // The first week, before any clock change, meets every rule.
  const firstWeek = await run(['--team', 'examples/team.json', '--from', String(EXAMPLE_FROM), '--days', '7', '--day-labels', 'offset']);
  expect('first week', firstWeek, 0, ['RESULT: PASS - all 35 checks on 5 days meet the rules'], ['FAIL']);

  // The README shows the head of the report, the days around the day off, and the table of every day.
  const readme = (await readFile(resolve(root, 'README.md'), 'utf8')).split('\r\n').join('\n');
  const lines = full.out.split('\n');
  const head = lines.slice(0, lines.indexOf('')).join('\n');
  if (!readme.includes(head)) problems.push('README: the head of the sample output differs from a real run');
  const at15 = lines.indexOf('  day 15 (Tue)');
  const day15 = lines.slice(at15, lines.indexOf('', at15)).join('\n');
  if (at15 < 0 || !readme.includes(day15)) problems.push('README: the sample of day 15 differs from a real run');
  const every = lines.indexOf('Every day (shared minutes; * short of the rule)');
  const table = lines.slice(every, lines.indexOf('', every + 2)).join('\n');
  if (every < 0 || !readme.includes(table)) problems.push('README: the table of every day differs from a real run');
  if (!readme.includes(`node bin/core-hours-overlap-check.js ${ARGS.join(' ')}`)) problems.push('README: the command of the example differs from tools/example.mjs');

  await mkdir(resolve(root, 'examples/output'), { recursive: true });
  await writeFile(resolve(root, 'examples/output/team.txt'), full.out);
  const explain = await run([...ARGS, '--explain']);
  if (explain.code !== 1) problems.push(`explain: exit code ${explain.code}, expected 1`);
  const explainLines = explain.out.split('\n');
  const ben = explainLines.findIndex((l) => l === '    core-window Ben: 30 minutes, 60 needed, short');
  if (ben < 0 || !readme.includes(explainLines.slice(ben, ben + 4).join('\n'))) problems.push('README: the --explain sample of Ben differs from a real run');
  await writeFile(resolve(root, 'examples/output/team-explain.txt'), explain.out);
  for (const [format, name] of [['markdown', 'team.md'], ['json', 'team.json']]) {
    const r = await run([...ARGS, '--format', format, '--explain']);
    if (r.code !== 1) problems.push(`${format}: exit code ${r.code}, expected 1`);
    await writeFile(resolve(root, 'examples/output', name), r.out);
  }

  if (problems.length) {
    for (const p of problems) console.error(`example: ${p}`);
    process.exit(1);
  }
}
