// Reads the team file, measures every check of every day, and builds the report that src/report.js writes as text,
// Markdown or JSON. The report holds labels, not raw day numbers: with --day-labels offset it holds no date at all.

import { readTextFile, FILE_LIMITS } from './files.js';
import { ConfigError, clockText, readConfig } from './config.js';
import { DAY_LIMITS, dateOfDay, dayLabel, instantLabel, resolveDay } from './days.js';
import { evaluate, preparePeople } from './overlap.js';
import { clockChanges, formatOffset, makeClock } from './zones.js';
import { FACTS, WEEKDAYS, factPage } from './data.js';
import { REASONS, RULES } from './rules.js';
import { listText, plural, grouped } from './size.js';
import { safeText } from './text.js';

export const LIMITS = { ...FILE_LIMITS };

// The most problems an error lists; the rest are counted.
export const MAX_PROBLEMS = 20;

// The first problems of a list, and a count of the rest.
export const capProblems = (problems) => (problems.length > MAX_PROBLEMS ? [...problems.slice(0, MAX_PROBLEMS), `and ${(problems.length - MAX_PROBLEMS).toLocaleString('en-US')} more`] : problems);

export class InputError extends Error {
  constructor(problems) {
    super(problems.join('\n'));
    this.problems = problems;
  }
}

const ORDER = [1, 2, 3, 4, 5, 6, 0];

// The weekly hours of a person as one line: runs of days with the same shifts, such as mon-fri 09:00-12:00, 13:00-17:30.
export function hoursText(week) {
  const parts = [];
  let i = 0;
  while (i < 7) {
    const shifts = week[ORDER[i]];
    let j = i;
    while (j + 1 < 7 && JSON.stringify(week[ORDER[j + 1]]) === JSON.stringify(shifts)) j += 1;
    if (shifts.length) parts.push(`${WEEKDAYS[ORDER[i]]}${j > i ? `-${WEEKDAYS[ORDER[j]]}` : ''} ${shifts.map(([a, b]) => `${clockText(a)}-${clockText(b)}`).join(', ')}`);
    i = j + 1;
  }
  return parts.join('; ');
}

const weekdaysText = (days) => {
  const set = new Set(days);
  const runs = [];
  let i = 0;
  while (i < 7) {
    if (!set.has(ORDER[i])) {
      i += 1;
      continue;
    }
    let j = i;
    while (j + 1 < 7 && set.has(ORDER[j + 1])) j += 1;
    runs.push(j > i ? `${WEEKDAYS[ORDER[i]]}-${WEEKDAYS[ORDER[j]]}` : WEEKDAYS[ORDER[i]]);
    i = j + 1;
  }
  return runs.join(', ');
};

// A rule as one sentence of the report.
export function ruleText(rule, dayZone) {
  if (rule.key === 'pairOverlap') return `every two people share at least ${plural(rule.minMinutes, 'minute')} a day (days of ${dayZone})`;
  if (rule.key === 'anchorOverlap') return `everyone shares at least ${plural(rule.minMinutes, 'minute')} a day with ${listText(rule.anchor, 10)} (days of ${dayZone})`;
  return `everyone works ${clockText(rule.start)}-${clockText(rule.end)} ${rule.zone} in full on ${weekdaysText(rule.days)}`;
}

// The text of a reason.
export function reasonText(r, check, m, label) {
  if (r.kind === 'day-off') return `${r.person} has a day off on ${label(r.day)}`;
  if (r.kind === 'holiday') return `${r.holiday} for ${r.person} on ${label(r.day)}`;
  if (r.kind === 'clock-change') {
    const zones = r.zones.map((z) => `${z.zone} is at ${formatOffset(z.offset)}, ahead of its standard ${formatOffset(z.standard)}`);
    return `clock change: ${zones.join('; ')}; with every zone of the check on standard time it would ${check.rule.key === 'coreWindow' ? 'cover' : 'share'} ${r.minutesOnStandardTime} of ${r.needOnStandardTime} minutes`;
  }
  const verb = check.rule.key === 'coreWindow' ? `the working hours cover ${m.minutes} of the ${m.need} minutes of the window` : `the working hours share ${m.minutes} of ${m.need} minutes`;
  return r.notWorking ? `${listText(r.notWorking, 10)} ${r.notWorking.length === 1 ? 'has' : 'have'} no working hours in the window; ${verb}` : verb;
}

const intervalsText = (list, home, from, labels) => (list.length ? list.map(([a, b]) => `${instantLabel(a, home, from, labels)}-${instantLabel(b, home, from, labels)}`).join(', ') : 'none');

// The UTC moments behind one number, for --explain.
function explainOf(check, m, day, from, labels, clock) {
  const middle = m.window[0] + Math.floor((m.window[1] - m.window[0]) / 2);
  const span = (list) => intervalsText(list, day, from, labels);
  const lines = [];
  if (check.rule.key === 'coreWindow') lines.push(`window ${clockText(check.rule.start)}-${clockText(check.rule.end)} ${check.rule.zone} (${formatOffset(clock.offsetAt(check.rule.zone, middle))}): ${span([m.window])}`);
  else lines.push(`day of ${check.frameZone} (${formatOffset(clock.offsetAt(check.frameZone, middle))}): ${span([m.window])}`);
  for (const s of m.sides) {
    const off = s.absences.length ? `; scheduled ${span(s.scheduled)}, taken out: ${s.absences.map((a) => (a.kind === 'day-off' ? 'day off' : a.name)).join(', ')}` : '';
    lines.push(`${s.name} (${s.zone}, ${formatOffset(clock.offsetAt(s.zone, middle))}): ${span(s.actual)}${off}`);
  }
  lines.push(`shared: ${span(m.shared)} = ${plural(m.minutes, 'minute')}`);
  return lines;
}

// Builds the report of a team file text. from is the day number of the first day, count the number of days.
export function buildReport({ text, file, from, count, labels = 'date', version = '', explain = true }) {
  let config;
  try {
    config = readConfig(text, file);
  } catch (error) {
    if (error instanceof ConfigError) throw new InputError(capProblems(error.problems.map((p) => p.text)));
    throw error;
  }
  const last = from + count - 1;
  if (last > DAY_LIMITS.maxDay) throw new InputError([`the range ends after ${dateOfDay(DAY_LIMITS.maxDay)}, the last day the tool reads`]);
  const people = preparePeople(config, from);
  const zones = [...new Set([...(config.dayZone ? [config.dayZone] : []), ...people.map((p) => p.zone), ...config.rules.filter((r) => r.zone).map((r) => r.zone)])];
  const clock = makeClock(zones, from, last);
  let result;
  try {
    result = evaluate(config, people, from, count, clock);
  } catch (error) {
    if (error.input) throw new InputError([error.message]);
    throw error;
  }
  const label = (day) => dayLabel(day, from, labels);
  const notes = [];

  const days = result.days.map(({ day, results }) => ({
    day: day - from,
    ...(labels === 'date' ? { date: dateOfDay(day) } : {}),
    label: label(day),
    checks: results.map(({ check, m, reasons }) => ({
      rule: check.rule.id,
      who: check.who,
      short: check.short,
      minutes: m.minutes,
      need: m.need,
      met: m.met,
      reasons: reasons.map((r) => ({ kind: r.kind, text: safeText(reasonText(r, check, m, label), 600) })),
      ...(explain ? { explain: explainOf(check, m, day, from, labels, clock).map((l) => safeText(l, 1200)) } : {})
    }))
  }));
  const checked = days.filter((d) => d.checks.length);
  if (!checked.length) throw new InputError([`no check ran in the ${plural(count, 'day')} of the range: on no day is everyone a rule compares scheduled to work; give another range or check the working hours`]);
  const failures = [];
  for (const d of days) for (const c of d.checks) if (!c.met) failures.push({ label: d.label, day: d.day, ...c });
  const failedDays = new Set(failures.map((f) => f.day)).size;
  const total = days.reduce((n, d) => n + d.checks.length, 0);

  const clockChangeList = [];
  for (const z of zones) for (const c of clockChanges(clock, z, from, last)) clockChangeList.push({ zone: z, day: c.day, label: label(c.day), before: formatOffset(c.before), after: formatOffset(c.after) });
  clockChangeList.sort((a, b) => a.day - b.day || (a.zone < b.zone ? -1 : a.zone > b.zone ? 1 : 0));

  const absences = [];
  let outside = 0;
  for (const p of config.people) {
    for (const d of p.daysOff) {
      const day = resolveDay(d, from);
      if (day < from || day > last) outside += 1;
      else absences.push({ kind: 'day-off', day, label: label(day), people: [p.name], text: `${p.name} day off on ${label(day)}` });
    }
  }
  for (const h of config.holidays) {
    for (const d of h.days) {
      const day = resolveDay(d, from);
      if (day < from || day > last) outside += 1;
      else absences.push({ kind: 'holiday', day, label: label(day), people: h.people, text: `${h.name} for ${listText(h.people, 10)} on ${label(day)}` });
    }
  }
  absences.sort((a, b) => a.day - b.day);
  if (outside) notes.push(`${plural(outside, 'day off or holiday', 'days off or holidays')} of the team file ${outside === 1 ? 'falls' : 'fall'} outside the range`);
  for (const o of result.odd) {
    const time = clockText(o.minute);
    notes.push(o.kind === 'gap'
      ? `${o.zone}: ${time} on ${label(o.day)} does not exist, the clocks skip it; the shift of ${o.person} is read at ${time} on the clock before the change, which is later by the length of the gap`
      : `${o.zone}: ${time} on ${label(o.day)} happens twice, the clocks pass it again; the shift of ${o.person} is read at the first of the two`);
  }

  const pass = failures.length === 0;
  const verdictText = pass
    ? `PASS - all ${plural(total, 'check')} on ${plural(checked.length, 'day')} meet the rules`
    : `FAIL - ${grouped(failures.length)} of ${plural(total, 'check')} on ${plural(failedDays, 'day')} ${failures.length === 1 ? 'is' : 'are'} short of the rules`;
  const usedReasons = new Set(failures.flatMap((f) => f.reasons.map((r) => r.kind)));
  const basis = [...new Set([...config.rules.flatMap((r) => RULES.find((x) => x.id === r.id).facts), ...REASONS.filter((r) => usedReasons.has(r.kind)).flatMap((r) => r.facts)])].map((k) => ({ key: k, text: FACTS[k].text, section: FACTS[k].section, page: factPage(k) }));

  return {
    tool: 'core-hours-overlap-check',
    version,
    team: { file, name: config.name },
    range: { labels, days: count, first: label(from), last: label(last), ...(labels === 'date' ? { from: dateOfDay(from) } : {}) },
    dayZone: config.dayZone,
    people: config.people.map((p) => ({ name: p.name, zone: p.zone, hours: hoursText(p.week) })),
    rules: config.rules.map((r) => ({ id: r.id, key: r.key, text: ruleText(r, config.dayZone) })),
    clockChanges: clockChangeList.map(({ day, ...c }) => c),
    absences: absences.map(({ day, ...a }) => a),
    totals: { days: count, daysWithChecks: checked.length, checks: total, met: total - failures.length, short: failures.length, shortDays: failedDays },
    failures: failures.map(({ explain: _, ...f }) => f),
    days,
    basis,
    notes,
    verdict: { pass, text: verdictText }
  };
}

// Reads the team file named on the command line and builds the report. Paths are relative to base.
export async function checkPaths({ team, from, count, labels, version, limits = {}, base = process.cwd() }) {
  const lim = { ...LIMITS, ...limits };
  let file;
  try {
    file = await readTextFile(team, base, lim.maxTeamBytes);
  } catch (error) {
    throw new InputError([error.message]);
  }
  return buildReport({ text: file.text, file: file.file, from, count, labels, version });
}

