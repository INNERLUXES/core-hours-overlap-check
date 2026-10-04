import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DAY_LIMITS, DAY_MS, dateOfDay, dayLabel, dayOfDate, instantLabel, readDayValue, readDays, readFrom, resolveDay, weekdayKey, weekdayName, weekdayOf } from '../src/index.js';
import { DAY0, isoDay } from './helpers.js';

test('dayOfDate and dateOfDay: a date and its day number go both ways, in UTC', () => {
  for (const day of [0, 1, DAY0, DAY0 + 59, DAY0 + 365, DAY0 + 366, DAY_LIMITS.maxDay]) assert.equal(dayOfDate(isoDay(day)), day, isoDay(day));
  assert.equal(dateOfDay(0), `${['19', '70'].join('')}-01-01`);
  assert.equal(dayOfDate(isoDay(DAY0 + 1)) - dayOfDate(isoDay(DAY0)), 1);
});

test('dayOfDate: a day that is not in the calendar, before the epoch, or in another form is refused', () => {
  const y = isoDay(DAY0).slice(0, 4);
  for (const bad of [`${y}-02-30`, `${y}-13-01`, `${y}-00-10`, `${y}-04-31`, `${y}-1-01`, `${y}/01/01`, `01-01-${y}`, `${y}-01-01T00:00:00Z`, ` ${y}-01-01`, 'today', '', isoDay(-1)]) {
    assert.equal(dayOfDate(bad), null, bad);
  }
  const leapYear = Number(isoDay(DAY0 - (DAY0 % 1461) + 790).slice(0, 4));
  assert.notEqual(dayOfDate(`${leapYear}-02-29`), null);
  assert.equal(dayOfDate(`${leapYear + 1}-02-29`), null);
});

test('weekdays: day 0 of the epoch was a Thursday, and DAY0 is a Monday', () => {
  assert.equal(weekdayOf(0), 4);
  assert.equal(weekdayKey(DAY0), 'mon');
  assert.equal(weekdayName(DAY0 + 6), 'Sun');
  assert.equal(weekdayOf(-1), 3);
  for (let d = DAY0; d < DAY0 + 14; d += 1) assert.equal(weekdayOf(d), new Date(d * DAY_MS).getUTCDay());
});

test('readFrom: a date YYYY-MM-DD or a day number, inside the days the tool reads', () => {
  assert.equal(readFrom(String(DAY0)), DAY0);
  assert.equal(readFrom(isoDay(DAY0)), DAY0);
  assert.equal(readFrom('0'), 0);
  assert.equal(readFrom(String(DAY_LIMITS.maxDay)), DAY_LIMITS.maxDay);
  for (const bad of [String(DAY_LIMITS.maxDay + 1), '-1', '1.5', '1e4', 'today', 'now', '', ' 5', isoDay(DAY0).replace(/-/g, '/')]) assert.equal(readFrom(bad), null, bad);
});

test('readDays: a whole number of days from 1 to the limit', () => {
  assert.equal(readDays('1'), 1);
  assert.equal(readDays(String(DAY_LIMITS.maxDays)), DAY_LIMITS.maxDays);
  for (const bad of ['0', String(DAY_LIMITS.maxDays + 1), '-3', '2.5', 'week', '']) assert.equal(readDays(bad), null, bad);
});

test('readDayValue and resolveDay: a date or a whole number of days from the first day of the range', () => {
  assert.deepEqual(readDayValue(0), { kind: 'offset', offset: 0 });
  assert.deepEqual(readDayValue(-0), { kind: 'offset', offset: 0 });
  assert.deepEqual(readDayValue(12), { kind: 'offset', offset: 12 });
  assert.deepEqual(readDayValue(-3), { kind: 'offset', offset: -3 });
  assert.deepEqual(readDayValue(isoDay(DAY0 + 4)), { kind: 'date', day: DAY0 + 4 });
  for (const bad of [1.5, DAY_LIMITS.maxOffset + 1, '12', 'monday', null, true, [], {}, Infinity]) assert.equal(readDayValue(bad), null, String(bad));
  assert.equal(resolveDay(readDayValue(12), DAY0), DAY0 + 12);
  assert.equal(resolveDay(readDayValue(isoDay(DAY0 + 4)), DAY0 + 100), DAY0 + 4);
});

test('labels: a day as a date or as its distance from the first day, with its weekday; a moment in UTC', () => {
  assert.equal(dayLabel(DAY0 + 7, DAY0, 'offset'), 'day 7 (Mon)');
  assert.equal(dayLabel(DAY0 - 1, DAY0, 'offset'), 'day -1 (Sun)');
  assert.equal(dayLabel(DAY0 + 2, DAY0, 'date'), `${isoDay(DAY0 + 2)} (Wed)`);
  const ms = (DAY0 + 3) * DAY_MS + 13 * 3600000 + 30 * 60000;
  assert.equal(instantLabel(ms, DAY0 + 3, DAY0, 'offset'), '13:30Z');
  assert.equal(instantLabel(ms, DAY0 + 2, DAY0, 'offset'), 'day 3 13:30Z');
  assert.equal(instantLabel(ms, DAY0 + 2, DAY0, 'date'), `${isoDay(DAY0 + 3)}T13:30Z`);
  assert.equal(instantLabel((DAY0 + 4) * DAY_MS, DAY0 + 3, DAY0, 'offset'), 'day 4 00:00Z');
});

test('the report does not depend on the time zone or the locale of the machine', () => {
  const cli = fileURLToPath(new URL('../bin/core-hours-overlap-check.js', import.meta.url));
  const cwd = fileURLToPath(new URL('..', import.meta.url));
  const outputs = new Set();
  const envs = [
    { TZ: 'UTC', LANG: 'C', LC_ALL: 'C' },
    { TZ: 'Pacific/Kiritimati', LANG: 'tr_TR.UTF-8', LC_ALL: 'tr_TR.UTF-8' },
    { TZ: 'America/Adak', LANG: 'de_DE.UTF-8', LC_ALL: 'de_DE.UTF-8' },
    { TZ: 'Asia/Kathmandu', LANG: 'ar_EG.UTF-8', LC_ALL: 'ar_EG.UTF-8' }
  ];
  for (const env of envs) {
    const r = spawnSync(process.execPath, [cli, '--team', 'examples/team.json', '--from', String(DAY0), '--days', '35', '--day-labels', 'offset', '--explain'], { env: { ...process.env, ...env }, encoding: 'utf8', cwd });
    assert.equal(r.status, 1, r.stderr);
    outputs.add(r.stdout);
  }
  assert.equal(outputs.size, 1, 'the same report under every time zone and locale');
  const script = `import(${JSON.stringify(new URL('../src/index.js', import.meta.url).href)}).then((m) => process.stdout.write(JSON.stringify([m.dayOfDate(m.dateOfDay(${DAY0})), m.weekdayName(${DAY0}), m.offsetFromIntl('Asia/Kolkata', ${DAY0 * DAY_MS}), m.grouped(1234567), m.checkZone('europe/berlin').ok])));`;
  const small = new Set();
  for (const env of envs) {
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, ...env }, encoding: 'utf8', cwd });
    assert.equal(r.status, 0, r.stderr);
    small.add(r.stdout);
  }
  assert.equal(small.size, 1);
  assert.deepEqual(JSON.parse([...small][0]), [DAY0, 'Mon', 330 * 60000, '1,234,567', true]);
});
