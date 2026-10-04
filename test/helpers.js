// Shared test helpers: team files built inline, checked in memory or written into a temporary folder that is removed
// after the test. Paths are built with resolve() from forward-slash names, so the same test runs on Linux, macOS and
// Windows. The line a test expects is found with lineOf(), which counts lines the way the tool does, so a test never
// holds a line number worked out by hand for one system only. A date is built from a day number with isoDay(), so no
// test file holds a number that reads like a year, and no test reads the clock. A day on which a zone changes its
// clocks is found with changeDay(), by asking Intl, so no test holds the date of a clock change either.

import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { DAY_MS, dateOfDay, lineStarts, main, offsetFromIntl, positionOf, readConfig, weekdayOf } from '../src/index.js';

export async function withFiles(files, fn) {
  const dir = await mkdtemp(resolve(tmpdir(), 'core-hours-overlap-check-'));
  try {
    for (const [rel, content] of Object.entries(files)) {
      await mkdir(dirname(resolve(dir, rel)), { recursive: true });
      await writeFile(resolve(dir, rel), content);
    }
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// The line (from 1) of the n-th place where needle starts in text.
export function lineOf(text, needle, n = 1) {
  let at = -1;
  for (let i = 0; i < n; i += 1) {
    at = text.indexOf(needle, at + 1);
    if (at < 0) throw new Error(`${needle} is not in the text ${n} times`);
  }
  return positionOf(lineStarts(text), at).line;
}

// A Monday far from any edge of the calendar (the first day of the example range), and the date YYYY-MM-DD of a day
// number, in UTC.
export const DAY0 = 20514;
export const isoDay = (day) => dateOfDay(day);

// The first Monday on or after a day number.
export const mondayFrom = (day) => day + ((8 - weekdayOf(day)) % 7);

// The first day on or after start whose local noon in zone has another UTC offset than the local noon of the day before,
// and the two offsets in minutes: the day on which the zone moves its clocks. direction 1 finds a move forward, -1 a
// move back.
export function changeDay(zone, start, direction = 1) {
  const noon = (day) => offsetFromIntl(zone, day * DAY_MS + DAY_MS / 2 - offsetFromIntl(zone, day * DAY_MS + DAY_MS / 2));
  for (let day = start; day < start + 800; day += 1) {
    const before = noon(day - 1);
    const after = noon(day);
    if (after !== before && Math.sign(after - before) === direction) return { day, before: before / 60000, after: after / 60000 };
  }
  throw new Error(`${zone} moves its clocks in no day after ${start}`);
}

// A person of a team file.
export const person = (name, zone, hours = { 'mon-fri': ['09:00-17:00'] }, extra = {}) => ({ name, zone, hours, ...extra });

// The team that most tests use: two people an hour apart, a pair rule.
export const BASE_TEAM = {
  name: 'Test team',
  dayZone: 'Europe/Berlin',
  people: [person('Ana', 'Europe/Berlin'), person('Bo', 'Europe/London')],
  rules: { pairOverlap: { minMinutes: 240 } }
};

// A team object with some parts replaced; a part set to undefined is left out.
export function teamWith(parts = {}) {
  const c = { ...BASE_TEAM, ...parts };
  for (const k of Object.keys(c)) if (c[k] === undefined) delete c[k];
  return c;
}

// The normal form of a team written as an object, through the real reader.
export const teamOf = (object) => readConfig(JSON.stringify(object), 'team.json');

// A team file text for the command line tests.
export const teamText = (object) => `${JSON.stringify(object, null, 2)}\n`;

// Writes the files and runs the command line with these arguments (paths relative to the folder).
export async function run(files, args = [], limits) {
  return withFiles(files, async (dir) => {
    let out = '';
    let err = '';
    const code = await main(args, { out: (t) => { out += t; }, err: (t) => { err += t; } }, limits, dir);
    return { code, out, err, dir };
  });
}

// Runs the command line with exactly these arguments, in a folder.
export async function cli(argv, base) {
  let out = '';
  let err = '';
  const code = await main(argv, { out: (t) => { out += t; }, err: (t) => { err += t; } }, undefined, base);
  return { code, out, err };
}

// The arguments that most command line tests use: one week from DAY0, and the file they need.
export const ARGS = ['--team', 'team.json', '--from', String(DAY0), '--days', '7'];
export const filesWith = (team = BASE_TEAM, extra = {}) => ({ 'team.json': teamText(team), ...extra });

// Runs a team for a range and returns the JSON report.
export async function reportOf(team, from = DAY0, days = 7, extraArgs = []) {
  const r = await run(filesWith(team), ['--team', 'team.json', '--from', String(from), '--days', String(days), '--format', 'json', ...extraArgs]);
  if (r.code === 2) throw new Error(r.err);
  return { ...JSON.parse(r.out), code: r.code };
}

// The checks of a report in one list, with the day of each.
export const checksOf = (report) => report.days.flatMap((d) => d.checks.map((c) => ({ day: d.day, ...c })));
