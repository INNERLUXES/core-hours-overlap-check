// Days. The tool reads no clock: the first day of the range is given on the command line with --from, either as a date
// YYYY-MM-DD or as a day number (whole days since the Unix epoch), and every day is a whole number. A date is turned
// into a day number with Date.UTC, which does not depend on the time zone or the locale of the machine. A day in the
// team file (a day off or a holiday) is either a date or a whole number of days from the first day of the range, so a
// team file can be written without a single date. docs/decisions/0001 explains the choice.

import { WEEKDAYS, WEEKDAY_NAMES } from './data.js';

export const DAY_MS = 86400000;

// The last day number the tool reads: the last day of the four-digit years.
export const DAY_LIMITS = { maxDay: 2932896, maxDays: 1000, maxOffset: 3660 };

// The day number (whole days since the Unix epoch, in UTC) of a date written YYYY-MM-DD, or null when it is not a real date
// or lies before the epoch.
export function dayOfDate(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text));
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  const day = ms / DAY_MS;
  return day < 0 ? null : day;
}

// The date YYYY-MM-DD of a day number, in UTC.
export const dateOfDay = (day) => new Date(day * DAY_MS).toISOString().slice(0, 10);

// The day of the week of a day number: 0 is Sunday. Day 0 of the epoch was a Thursday.
export const weekdayOf = (day) => (((day + 4) % 7) + 7) % 7;
export const weekdayKey = (day) => WEEKDAYS[weekdayOf(day)];
export const weekdayName = (day) => WEEKDAY_NAMES[weekdayOf(day)];

// The value of --from: a date YYYY-MM-DD or a day number. Returns the day number, or null.
export function readFrom(text) {
  const t = String(text);
  if (/^\d{1,7}$/.test(t)) {
    const day = Number(t);
    return day <= DAY_LIMITS.maxDay ? day : null;
  }
  const day = dayOfDate(t);
  return day !== null && day <= DAY_LIMITS.maxDay ? day : null;
}

// The value of --days: a whole number of days from 1 to the limit, or null.
export function readDays(text) {
  const t = String(text);
  if (!/^\d{1,5}$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 && n <= DAY_LIMITS.maxDays ? n : null;
}

// A day of the team file: a date YYYY-MM-DD, or a whole number of days from the first day of the range (0 is the first
// day). Returns { kind: 'date', day } or { kind: 'offset', offset }, or null for anything else.
export function readDayValue(value) {
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || Math.abs(value) > DAY_LIMITS.maxOffset) return null;
    return { kind: 'offset', offset: value === 0 ? 0 : value };
  }
  if (typeof value === 'string') {
    const day = dayOfDate(value);
    return day === null ? null : { kind: 'date', day };
  }
  return null;
}

// The day number of a day of the team file, for a range that starts on the day number from.
export const resolveDay = (value, from) => (value.kind === 'date' ? value.day : from + value.offset);

// How a day is shown: as a date with --day-labels date, or as its distance from the first day of the range with
// --day-labels offset, which keeps a report free of dates (docs/decisions/0001).
export function dayLabel(day, from, labels) {
  const base = labels === 'offset' ? `day ${day - from}` : dateOfDay(day);
  return `${base} (${weekdayName(day)})`;
}

// A moment as the reports show it, in UTC: HH:MMZ on the UTC day given as home, and with its day before it on any other
// UTC day (a date, or day N with --day-labels offset).
export function instantLabel(ms, home, from, labels) {
  const day = Math.floor(ms / DAY_MS);
  const minutes = Math.floor((ms - day * DAY_MS) / 60000);
  const hm = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}Z`;
  if (day === home) return hm;
  return labels === 'offset' ? `day ${day - from} ${hm}` : `${dateOfDay(day)}T${hm}`;
}
