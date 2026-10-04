// The team file: the people with their time zone, their working hours by day of the week and their days off, the
// holidays, the zone whose calendar days the report counts, and the rules the team agreed. Every number a rule compares
// comes from this file: the tool has no threshold of its own, and a file must state at least one rule. Every key the tool
// does not know is an error, so a typo such as minMinute cannot silently change a rule. The file is read with the strict
// JSON reader of src/json.js, which refuses an object that names a key twice. People are named by a display name only;
// a name that holds an @ is refused, because the tool needs no email address.

import { JsonError, jsonProblem, parseJson } from './json.js';
import { WEEKDAYS } from './data.js';
import { readDayValue } from './days.js';
import { checkZone } from './zones.js';
import { safeText } from './text.js';

export const CONFIG_LIMITS = { maxPeople: 100, maxShifts: 6, maxDaysOff: 1000, maxHolidays: 500, maxName: 60, maxString: 200, maxMinutes: 1440 };

// The keys of the team file, as a tree: what each level may hold.
export const KEYS = {
  name: 'string',
  dayZone: 'zone',
  people: 'people',
  holidays: 'holidays',
  rules: {
    pairOverlap: { minMinutes: 'minutes' },
    anchorOverlap: { anchor: 'names', minMinutes: 'minutes' },
    coreWindow: { zone: 'zone', start: 'clock', end: 'clock', days: 'weekdays' }
  }
};

// The keys of one person in the people list.
export const PERSON_KEYS = { name: 'personName', zone: 'zone', hours: 'hours', daysOff: 'days' };

// The keys of one holiday in the holidays list.
export const HOLIDAY_KEYS = { name: 'string', days: 'days', people: 'names' };

// The rule ids as the reports show them, by their key in the team file.
export const RULE_IDS = { pairOverlap: 'pair-overlap', anchorOverlap: 'anchor-overlap', coreWindow: 'core-window' };

export class ConfigError extends Error {
  constructor(problems) {
    super(problems.map((p) => p.text).join('\n'));
    this.problems = problems;
  }
}

// The edit distance of two short words, for the "did you mean" of an unknown key.
function distance(a, b) {
  if (a.length > 40 || b.length > 40) return 99;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = row;
  }
  return prev[b.length];
}

const kindOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'an array' : typeof v === 'object' ? 'an object' : typeof v === 'string' ? 'a string' : typeof v === 'number' ? 'a number' : 'a boolean');
// Control characters, and the direction controls and line separators that could rewrite a terminal or a report.
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u200e\u200f\u2028\u2029\u202a-\u202e\u2066-\u2069\ufeff]/;
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const CLOCK = /^([01]\d|2[0-4]):([0-5]\d)$/;
const SHIFT = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-4]):([0-5]\d)$/;

// The minutes after midnight of HH:MM, with 24:00 allowed as the end of a day, or null.
export function readClock(text) {
  const m = CLOCK.exec(String(text));
  if (!m) return null;
  const minutes = Number(m[1]) * 60 + Number(m[2]);
  return minutes > 1440 ? null : minutes;
}

// HH:MM written back from minutes after midnight.
export const clockText = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// The days of the week of a key such as mon or mon-fri, as indexes from Sunday, or null. A range runs forward within
// one week from Monday to Sunday, so fri-mon is refused rather than read as a wrap.
const ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export function readWeekdays(key) {
  const [a, b, ...rest] = String(key).split('-');
  if (rest.length) return null;
  const i = ORDER.indexOf(a);
  if (i < 0) return null;
  if (b === undefined) return [WEEKDAYS.indexOf(a)];
  const j = ORDER.indexOf(b);
  if (j <= i) return null;
  return ORDER.slice(i, j + 1).map((d) => WEEKDAYS.indexOf(d));
}

// Checks the value of the team file against KEYS and builds the normal form.
export function validateConfig(value, lines = new Map(), file = 'team') {
  const problems = [];
  const lim = CONFIG_LIMITS;
  const at = (path) => (path === '' ? file : `${file}${lines.has(path) ? `:${lines.get(path)}` : ''}: ${path}`);
  const bad = (path, message) => {
    problems.push({ path, text: `${at(path)}: ${message}` });
  };
  const has = (prefix) => problems.some((p) => p.path === prefix || p.path.startsWith(`${prefix}.`) || p.path.startsWith(`${prefix}[`));

  const text = (v, path, max = lim.maxString) => {
    if (typeof v !== 'string' || v.trim() === '') return bad(path, `must be a string that is not empty, not ${kindOf(v)}`);
    if (v.length > max || CONTROL.test(v)) return bad(path, `must be at most ${max} characters with no control character`);
    return v;
  };
  const list = (v, path, max, each, what = 'entries') => {
    if (!Array.isArray(v)) return bad(path, `must be a list, not ${kindOf(v)}`);
    if (v.length === 0) return bad(path, 'is an empty list; leave the key out instead');
    if (v.length > max) return bad(path, `holds more than ${max} ${what}`);
    const out = [];
    let ok = true;
    v.forEach((item, i) => {
      const r = each(item, `${path}[${i}]`, out);
      if (r === undefined) ok = false;
      else out.push(r);
    });
    return ok ? out : undefined;
  };
  const zone = (v, path) => {
    if (typeof v !== 'string') return bad(path, `must be a time zone name such as Europe/Berlin, not ${kindOf(v)}`);
    const z = checkZone(v);
    return z.ok ? v : bad(path, `${safeText(v, 70)} ${z.reason}`);
  };
  const days = (v, path) => list(v, path, lim.maxDaysOff, (d, p, out) => {
    const r = readDayValue(d);
    if (r === null) return bad(p, `${safeText(JSON.stringify(d) ?? String(d), 40)} is not a day: write a date YYYY-MM-DD, or a whole number of days from the first day of the range (0 is the first day)`);
    if (out.some((o) => o.kind === r.kind && (o.kind === 'date' ? o.day === r.day : o.offset === r.offset))) return bad(p, 'is named twice');
    return r;
  }, 'days');
  const weekdays = (v, path) => list(v, path, 7, (d, p, out) => {
    const w = typeof d === 'string' ? readWeekdays(d) : null;
    if (!w) return bad(p, `${safeText(String(d), 30)} is not a day of the week: write mon, tue, wed, thu, fri, sat, sun or a range such as mon-fri`);
    if (w.some((x) => out.flat().includes(x))) return bad(p, 'names a day of the week twice');
    return w;
  });

  const check = (kind, v, p) => {
    if (kind === 'string') return text(v, p);
    if (kind === 'zone') return zone(v, p);
    if (kind === 'minutes') {
      if (typeof v !== 'number') return bad(p, `must be a whole number of minutes, not ${kindOf(v)}`);
      if (!Number.isSafeInteger(v) || v < 1 || v > lim.maxMinutes) return bad(p, `${safeText(String(v), 30)} is not a whole number of minutes from 1 to ${lim.maxMinutes}`);
      return v;
    }
    if (kind === 'clock') {
      const m = typeof v === 'string' ? readClock(v) : null;
      return m === null ? bad(p, `${safeText(String(v), 30)} is not a time of day written HH:MM, from 00:00 to 24:00`) : m;
    }
    if (kind === 'names') {
      return list(v, p, lim.maxPeople, (n, q, out) => {
        const t = text(n, q, lim.maxName);
        if (t === undefined) return undefined;
        if (out.some((o) => o.toLowerCase() === t.toLowerCase())) return bad(q, `${safeText(t, 60)} is named twice`);
        return t;
      }, 'names');
    }
    if (kind === 'weekdays') return weekdays(v, p);
    if (kind === 'days') return days(v, p);
    if (kind === 'people') return list(v, p, lim.maxPeople, personEntry, 'people');
    if (kind === 'holidays') return list(v, p, lim.maxHolidays, holidayEntry, 'holidays');
    return bad(p, 'cannot be read');
  };

  // Walks a level of the file against its allowed keys; returns the checked values by key.
  const walk = (obj, spec, path) => {
    if (!isObject(obj)) {
      bad(path, `must be an object, not ${kindOf(obj)}`);
      return null;
    }
    const out = {};
    for (const key of Object.keys(obj)) {
      const p = path ? `${path}.${key}` : key;
      if (!Object.hasOwn(spec, key)) {
        const near = Object.keys(spec).map((k) => [k, distance(k.toLowerCase(), key.toLowerCase())]).sort((a, b) => a[1] - b[1])[0];
        bad(p, `unknown key${near && near[1] <= 3 ? `; did you mean ${near[0]}?` : `; the keys here are ${Object.keys(spec).join(', ')}`}`);
        continue;
      }
      const kind = spec[key];
      if (typeof kind === 'object') out[key] = walk(obj[key], kind, p);
      else if (kind === 'personName' || kind === 'hours') out[key] = obj[key];
      else out[key] = check(kind, obj[key], p);
    }
    return out;
  };

  // The working hours of a person: a day of the week or a range such as mon-fri, to a list of shifts HH:MM-HH:MM. Two
  // shifts on one day are a split shift. A shift ends after it starts and at 24:00 at the latest; a shift across
  // midnight is written as two shifts, one on each day.
  const hours = (v, p) => {
    if (!isObject(v)) return bad(p, `must be an object from a day of the week, or a range such as mon-fri, to a list of shifts such as ["09:00-12:00", "13:00-17:30"], not ${kindOf(v)}`);
    const week = Array.from({ length: 7 }, () => null);
    let ok = true;
    const keys = Object.keys(v);
    if (keys.length === 0) return bad(p, 'names no working day');
    for (const key of keys) {
      const q = `${p}.${key}`;
      const w = readWeekdays(key);
      if (!w) {
        bad(q, 'is not a day of the week: write mon, tue, wed, thu, fri, sat, sun or a range such as mon-fri');
        ok = false;
        continue;
      }
      const twice = w.find((d) => week[d] !== null);
      if (twice !== undefined) {
        bad(q, `names ${WEEKDAYS[twice]} again`);
        ok = false;
        continue;
      }
      const shifts = list(v[key], q, lim.maxShifts, (s, r) => {
        if (typeof s !== 'string') return bad(r, `must be a shift written HH:MM-HH:MM, not ${kindOf(s)}`);
        const m = SHIFT.exec(s);
        if (!m) {
          if (/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(s)) return bad(r, `${safeText(s, 20)} is not a shift from 00:00 to 24:00`);
          return bad(r, `${safeText(s, 30)} is not a shift written HH:MM-HH:MM, such as 09:00-17:30`);
        }
        const start = Number(m[1]) * 60 + Number(m[2]);
        const end = Number(m[3]) * 60 + Number(m[4]);
        if (end > 1440) return bad(r, `${s} ends after 24:00`);
        if (end <= start) return bad(r, `${s} ends before it starts; a shift across midnight is written as two shifts, one ending at 24:00 and one starting at 00:00 on the next day`);
        return [start, end];
      }, 'shifts');
      if (shifts === undefined) {
        ok = false;
        continue;
      }
      const sorted = [...shifts].sort((a, b) => a[0] - b[0]);
      const overlap = sorted.findIndex((s, i) => i > 0 && s[0] < sorted[i - 1][1]);
      if (overlap > 0) {
        bad(q, `the shifts ${clockText(sorted[overlap - 1][0])}-${clockText(sorted[overlap - 1][1])} and ${clockText(sorted[overlap][0])}-${clockText(sorted[overlap][1])} overlap`);
        ok = false;
        continue;
      }
      for (const d of w) week[d] = sorted;
    }
    return ok ? week.map((s) => s ?? []) : undefined;
  };

  const personName = (v, p, names) => {
    const t = text(v, p, lim.maxName);
    if (t === undefined) return undefined;
    if (t.includes('@')) return bad(p, 'holds an @; give a display name only, the tool needs no email address');
    if (t !== t.trim()) return bad(p, 'starts or ends with white space');
    if (names.has(t.toLowerCase())) return bad(p, `${safeText(t, 60)} is the name of another person (names are compared without case)`);
    names.add(t.toLowerCase());
    return t;
  };

  const names = new Set();
  const personEntry = (v, p) => {
    const e = walk(v, PERSON_KEYS, p);
    if (!e) return undefined;
    for (const k of ['name', 'zone', 'hours']) if (e[k] === undefined && !has(`${p}.${k}`)) bad(`${p}.${k}`, k === 'name' ? 'is needed: the display name of the person' : k === 'zone' ? 'is needed: the time zone of the person, such as Europe/Berlin' : 'is needed: the working hours of the person by day of the week, in local time');
    const name = e.name === undefined ? undefined : personName(e.name, `${p}.name`, names);
    const week = e.hours === undefined ? undefined : hours(e.hours, `${p}.hours`);
    if (has(p)) return undefined;
    return { name, zone: e.zone, week, daysOff: e.daysOff ?? [] };
  };

  const holidayEntry = (v, p) => {
    const e = walk(v, HOLIDAY_KEYS, p);
    if (!e) return undefined;
    for (const k of ['name', 'days', 'people']) if (e[k] === undefined && !has(`${p}.${k}`)) bad(`${p}.${k}`, k === 'name' ? 'is needed: the name of the holiday' : k === 'days' ? 'is needed: the days of the holiday' : 'is needed: the people who have the holiday');
    if (has(p)) return undefined;
    return { name: safeText(e.name, 80), days: e.days, people: e.people };
  };

  if (!isObject(value)) {
    bad('', `the team file must be one JSON object, not ${kindOf(value)}`);
    throw new ConfigError(problems);
  }
  const top = walk(value, KEYS, '');
  if (top.people === undefined && !has('people')) bad('people', 'is needed: the people of the team, each with a name, a time zone and working hours');
  if (top.rules === undefined && !has('rules')) bad('rules', 'is needed: at least one rule; a check with no rule would always pass');
  const rules = top.rules;
  if (rules && !has('rules')) {
    if (!Object.keys(rules).some((k) => rules[k])) bad('rules', 'states no rule; a check with no rule would always pass');
    for (const [key, need] of [['pairOverlap', ['minMinutes']], ['anchorOverlap', ['anchor', 'minMinutes']], ['coreWindow', ['zone', 'start', 'end', 'days']]]) {
      if (!rules[key]) continue;
      for (const k of need) if (rules[key][k] === undefined) bad(`rules.${key}.${k}`, `is needed: ${{ minMinutes: 'the shared minutes a day the rule asks for', anchor: 'the people every other person must share the time with', zone: 'the time zone of the window', start: 'the start of the window, HH:MM', end: 'the end of the window, HH:MM', days: 'the days of the week the window applies to, such as ["mon-fri"]' }[k]}`);
    }
    const w = rules.coreWindow;
    if (w && w.start !== undefined && w.end !== undefined && !has('rules.coreWindow') && w.end <= w.start) bad('rules.coreWindow.end', 'must be after the start; a window across midnight is not supported');
    if ((rules.pairOverlap || rules.anchorOverlap) && top.dayZone === undefined && !has('dayZone')) bad('dayZone', 'is needed with pairOverlap and anchorOverlap: the time zone whose calendar days the shared time is counted in');
  }
  const people = top.people;
  if (people && !has('people')) {
    const known = new Map(people.map((x) => [x.name.toLowerCase(), x.name]));
    if (rules?.pairOverlap && people.length < 2) bad('rules.pairOverlap', 'needs two people at least');
    const anchor = rules?.anchorOverlap?.anchor;
    if (anchor && !has('rules.anchorOverlap')) {
      for (const [i, n] of anchor.entries()) if (!known.has(n.toLowerCase())) bad(`rules.anchorOverlap.anchor[${i}]`, `${safeText(n, 60)} is not a person of the team`);
      if (anchor.length >= people.length) bad('rules.anchorOverlap.anchor', 'names every person; leave one person at least to compare with the anchor');
    }
    if (top.holidays && !has('holidays')) {
      top.holidays.forEach((h, i) => h.people.forEach((n, j) => {
        if (!known.has(n.toLowerCase())) bad(`holidays[${i}].people[${j}]`, `${safeText(n, 60)} is not a person of the team`);
      }));
    }
  }
  if (problems.length) throw new ConfigError(problems);

  const byName = new Map(people.map((x) => [x.name.toLowerCase(), x]));
  const ruleList = [];
  if (rules.pairOverlap) ruleList.push({ id: RULE_IDS.pairOverlap, key: 'pairOverlap', minMinutes: rules.pairOverlap.minMinutes });
  if (rules.anchorOverlap) ruleList.push({ id: RULE_IDS.anchorOverlap, key: 'anchorOverlap', anchor: rules.anchorOverlap.anchor.map((n) => byName.get(n.toLowerCase()).name), minMinutes: rules.anchorOverlap.minMinutes });
  if (rules.coreWindow) ruleList.push({ id: RULE_IDS.coreWindow, key: 'coreWindow', zone: rules.coreWindow.zone, start: rules.coreWindow.start, end: rules.coreWindow.end, days: rules.coreWindow.days.flat().sort((a, b) => a - b) });
  return {
    name: typeof top.name === 'string' ? safeText(top.name, 120) : '',
    dayZone: top.dayZone ?? null,
    people,
    holidays: (top.holidays ?? []).map((h) => ({ ...h, people: h.people.map((n) => byName.get(n.toLowerCase()).name) })),
    rules: ruleList
  };
}

// Reads the text of a team file into the normal form. file is the path shown. Throws ConfigError with every problem.
export function readConfig(text, file = 'team') {
  let parsed;
  try {
    parsed = parseJson(text);
  } catch (error) {
    if (error instanceof JsonError) throw new ConfigError([{ path: '', text: `${file}: ${jsonProblem(error, text)}` }]);
    throw error;
  }
  return validateConfig(parsed.value, parsed.lines, file);
}
