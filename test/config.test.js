import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG_LIMITS, ConfigError, HOLIDAY_KEYS, KEYS, PERSON_KEYS, RULE_IDS, clockText, readClock, readConfig, readWeekdays, validateConfig } from '../src/index.js';
import { BASE_TEAM, DAY0, isoDay, lineOf, person, teamOf, teamText, teamWith } from './helpers.js';

const problemsOf = (object) => {
  try {
    teamOf(object);
  } catch (error) {
    assert.ok(error instanceof ConfigError, error.message);
    return error.problems.map((p) => p.text);
  }
  throw new Error('the team file was accepted');
};
const refused = (object, pattern) => {
  const problems = problemsOf(object);
  assert.ok(problems.some((p) => pattern.test(p)), `${pattern}\n${problems.join('\n')}`);
};

test('config: the base team is read into its normal form', () => {
  const c = teamOf(BASE_TEAM);
  assert.equal(c.name, 'Test team');
  assert.equal(c.dayZone, 'Europe/Berlin');
  assert.deepEqual(c.people.map((p) => [p.name, p.zone]), [['Ana', 'Europe/Berlin'], ['Bo', 'Europe/London']]);
  assert.deepEqual(c.people[0].week, [[], [[540, 1020]], [[540, 1020]], [[540, 1020]], [[540, 1020]], [[540, 1020]], []]);
  assert.deepEqual(c.rules, [{ id: 'pair-overlap', key: 'pairOverlap', minMinutes: 240 }]);
  assert.deepEqual(RULE_IDS, { pairOverlap: 'pair-overlap', anchorOverlap: 'anchor-overlap', coreWindow: 'core-window' });
});

test('config: working hours by day and by range, with split shifts sorted, and 24:00 as the end of a day', () => {
  const c = teamOf(teamWith({ people: [person('Ana', 'Europe/Berlin', { 'mon-wed': ['13:00-17:00', '08:00-12:00'], thu: ['22:00-24:00'], fri: ['00:00-06:00'], 'sat-sun': ['10:00-11:00'] }), person('Bo', 'UTC')] }));
  const week = c.people[0].week;
  assert.deepEqual(week[1], [[480, 720], [780, 1020]]);
  assert.deepEqual(week[3], [[480, 720], [780, 1020]]);
  assert.deepEqual(week[4], [[1320, 1440]]);
  assert.deepEqual(week[5], [[0, 360]]);
  assert.deepEqual(week[6], [[600, 660]]);
  assert.deepEqual(week[0], [[600, 660]]);
});

test('config: a shift that ends before it starts, crosses midnight, overlaps another, or is not HH:MM-HH:MM is refused', () => {
  const hours = (h) => teamWith({ people: [person('Ana', 'Europe/Berlin', h), person('Bo', 'UTC')] });
  refused(hours({ mon: ['22:00-02:00'] }), /ends before it starts; a shift across midnight is written as two shifts/);
  refused(hours({ mon: ['09:00-09:00'] }), /ends before it starts/);
  refused(hours({ mon: ['09:00-12:00', '11:30-15:00'] }), /the shifts 09:00-12:00 and 11:30-15:00 overlap/);
  refused(hours({ mon: ['24:00-24:00'] }), /is not a shift from 00:00 to 24:00/);
  refused(hours({ mon: ['09:00-24:30'] }), /ends after 24:00/);
  refused(hours({ mon: ['9:00-17:00'] }), /is not a shift written HH:MM-HH:MM/);
  refused(hours({ mon: ['09:00 - 17:00'] }), /is not a shift written HH:MM-HH:MM/);
  refused(hours({ mon: ['09:60-17:00'] }), /is not a shift from 00:00 to 24:00/);
  refused(hours({ mon: [540] }), /must be a shift written HH:MM-HH:MM, not a number/);
  refused(hours({ mon: [] }), /is an empty list; leave the key out instead/);
  refused(hours({ mon: Array.from({ length: CONFIG_LIMITS.maxShifts + 1 }, (_, i) => `${String(i).padStart(2, '0')}:00-${String(i).padStart(2, '0')}:30`) }), /holds more than 6 shifts/);
  // Touching shifts are fine and stay two shifts in the file; the reports join them.
  assert.ok(teamOf(hours({ mon: ['09:00-12:00', '12:00-13:00'] })));
});

test('config: days of the week are mon to sun, a range runs forward within the week, and a day is named once', () => {
  assert.deepEqual(readWeekdays('mon-fri'), [1, 2, 3, 4, 5]);
  assert.deepEqual(readWeekdays('sat-sun'), [6, 0]);
  assert.deepEqual(readWeekdays('sun'), [0]);
  for (const bad of ['fri-mon', 'mon-mon', 'Monday', 'MON', 'mon-', 'mon-tue-wed', '', 'weekdays']) assert.equal(readWeekdays(bad), null, bad);
  const hours = (h) => teamWith({ people: [person('Ana', 'Europe/Berlin', h), person('Bo', 'UTC')] });
  refused(hours({ 'fri-mon': ['09:00-17:00'] }), /is not a day of the week: write mon, tue, wed, thu, fri, sat, sun or a range such as mon-fri/);
  refused(hours({ 'mon-fri': ['09:00-17:00'], wed: ['10:00-11:00'] }), /names wed again/);
  refused(hours({}), /names no working day/);
  refused(hours(['mon']), /must be an object from a day of the week/);
});

test('config: times of day', () => {
  assert.equal(readClock('00:00'), 0);
  assert.equal(readClock('16:30'), 990);
  assert.equal(readClock('24:00'), 1440);
  for (const bad of ['24:01', '25:00', '7:00', '07:5', '07:60', '', 'noon']) assert.equal(readClock(bad), null, bad);
  assert.equal(clockText(990), '16:30');
  assert.equal(clockText(1440), '24:00');
});

test('config: people are named by a display name only, unique without case, with no @ and no control character', () => {
  refused(teamWith({ people: [person('ana@example.com', 'UTC'), person('Bo', 'UTC')] }), /holds an @; give a display name only, the tool needs no email address/);
  refused(teamWith({ people: [person('Ana', 'UTC'), person('ANA', 'UTC')] }), /ANA is the name of another person \(names are compared without case\)/);
  refused(teamWith({ people: [person(' Ana', 'UTC'), person('Bo', 'UTC')] }), /starts or ends with white space/);
  refused(teamWith({ people: [person('A\u001bna', 'UTC'), person('Bo', 'UTC')] }), /no control character/);
  refused(teamWith({ people: [person('A'.repeat(CONFIG_LIMITS.maxName + 1), 'UTC'), person('Bo', 'UTC')] }), /at most 60 characters/);
  refused(teamWith({ people: [{ zone: 'UTC', hours: { mon: ['09:00-10:00'] } }, person('Bo', 'UTC')] }), /people\[0\]\.name: is needed: the display name of the person/);
  refused(teamWith({ people: [{ name: 'Ana', hours: { mon: ['09:00-10:00'] } }, person('Bo', 'UTC')] }), /people\[0\]\.zone: is needed: the time zone of the person/);
  refused(teamWith({ people: [{ name: 'Ana', zone: 'UTC' }, person('Bo', 'UTC')] }), /people\[0\]\.hours: is needed: the working hours of the person/);
  refused(teamWith({ people: [] }), /people: is an empty list/);
  refused(teamWith({ people: Array.from({ length: CONFIG_LIMITS.maxPeople + 1 }, (_, i) => person(`P${i}`, 'UTC')) }), /holds more than 100 people/);
  refused(teamWith({ people: ['Ana', 'Bo'] }), /people\[0\]: must be an object, not a string/);
});

test('config: an unknown time zone, a UTC offset or a misspelt name fails closed with the reason', () => {
  refused(teamWith({ people: [person('Ana', 'Europe/Berlinn'), person('Bo', 'UTC')] }), /people\[0\]\.zone: Europe\/Berlinn is not a time zone that the Intl API of this Node knows/);
  refused(teamWith({ people: [person('Ana', '+01:00'), person('Bo', 'UTC')] }), /\+01:00 is a UTC offset, not a time zone name/);
  refused(teamWith({ dayZone: 'CET CEST' }), /dayZone: CET CEST is not written as a time zone name/);
  refused(teamWith({ dayZone: 60 }), /dayZone: must be a time zone name such as Europe\/Berlin, not a number/);
});

test('config: days off and holidays are dates or days from the first day of the range, named once', () => {
  const c = teamOf(teamWith({
    people: [person('Ana', 'Europe/Berlin', undefined, { daysOff: [3, isoDay(DAY0 + 9)] }), person('Bo', 'UTC')],
    holidays: [{ name: 'Spring holiday', days: [4, -2], people: ['ana', 'Bo'] }]
  }));
  assert.deepEqual(c.people[0].daysOff, [{ kind: 'offset', offset: 3 }, { kind: 'date', day: DAY0 + 9 }]);
  assert.deepEqual(c.holidays, [{ name: 'Spring holiday', days: [{ kind: 'offset', offset: 4 }, { kind: 'offset', offset: -2 }], people: ['Ana', 'Bo'] }]);
  refused(teamWith({ people: [person('Ana', 'UTC', undefined, { daysOff: [3, 3] }), person('Bo', 'UTC')] }), /daysOff\[1\]: is named twice/);
  refused(teamWith({ people: [person('Ana', 'UTC', undefined, { daysOff: ['next friday'] }), person('Bo', 'UTC')] }), /is not a day: write a date YYYY-MM-DD, or a whole number of days from the first day of the range/);
  refused(teamWith({ people: [person('Ana', 'UTC', undefined, { daysOff: [1.5] }), person('Bo', 'UTC')] }), /1\.5 is not a day/);
  refused(teamWith({ holidays: [{ name: 'Spring holiday', days: [4], people: ['Cy'] }] }), /holidays\[0\]\.people\[0\]: Cy is not a person of the team/);
  refused(teamWith({ holidays: [{ name: 'Spring holiday', days: [4] }] }), /holidays\[0\]\.people: is needed: the people who have the holiday/);
  refused(teamWith({ holidays: [{ days: [4], people: ['Ana'] }] }), /holidays\[0\]\.name: is needed/);
  refused(teamWith({ holidays: [{ name: 'X', people: ['Ana'] }] }), /holidays\[0\]\.days: is needed/);
  refused(teamWith({ holidays: [{ name: 'X', days: [4], people: ['Ana'], country: 'DE' }] }), /holidays\[0\]\.country: unknown key; the keys here are name, days, people/);
});

test('config: every rule states its numbers; there is no default threshold', () => {
  refused(teamWith({ rules: undefined }), /rules: is needed: at least one rule; a check with no rule would always pass/);
  refused(teamWith({ rules: {} }), /rules: states no rule/);
  refused(teamWith({ rules: { pairOverlap: {} } }), /rules\.pairOverlap\.minMinutes: is needed: the shared minutes a day the rule asks for/);
  refused(teamWith({ rules: { pairOverlap: { minMinutes: 0 } } }), /0 is not a whole number of minutes from 1 to 1440/);
  refused(teamWith({ rules: { pairOverlap: { minMinutes: 1441 } } }), /1441 is not a whole number of minutes from 1 to 1440/);
  refused(teamWith({ rules: { pairOverlap: { minMinutes: 90.5 } } }), /90\.5 is not a whole number of minutes/);
  refused(teamWith({ rules: { pairOverlap: { minMinutes: '120' } } }), /must be a whole number of minutes, not a string/);
  refused(teamWith({ rules: { anchorOverlap: { minMinutes: 60 } } }), /rules\.anchorOverlap\.anchor: is needed/);
  refused(teamWith({ rules: { anchorOverlap: { anchor: ['Cy'], minMinutes: 60 } } }), /anchor\[0\]: Cy is not a person of the team/);
  refused(teamWith({ rules: { anchorOverlap: { anchor: ['Ana', 'Bo'], minMinutes: 60 } } }), /names every person; leave one person at least to compare with the anchor/);
  refused(teamWith({ rules: { coreWindow: { zone: 'UTC', start: '15:00', days: ['mon'] } } }), /rules\.coreWindow\.end: is needed/);
  refused(teamWith({ rules: { coreWindow: { zone: 'UTC', start: '15:00', end: '14:00', days: ['mon'] } } }), /must be after the start; a window across midnight is not supported/);
  refused(teamWith({ rules: { coreWindow: { zone: 'UTC', start: '3pm', end: '16:00', days: ['mon'] } } }), /3pm is not a time of day written HH:MM/);
  refused(teamWith({ rules: { coreWindow: { zone: 'UTC', start: '15:00', end: '16:00', days: ['mon-fri', 'wed'] } } }), /names a day of the week twice/);
  refused(teamWith({ dayZone: undefined }), /dayZone: is needed with pairOverlap and anchorOverlap/);
  refused(teamWith({ people: [person('Ana', 'UTC')] }), /rules\.pairOverlap: needs two people at least/);
  // The core window alone needs no dayZone and works for one person.
  const c = teamOf(teamWith({ dayZone: undefined, people: [person('Ana', 'UTC')], rules: { coreWindow: { zone: 'Europe/Berlin', start: '16:30', end: '17:30', days: ['sat-sun', 'mon-fri'] } } }));
  assert.deepEqual(c.rules, [{ id: 'core-window', key: 'coreWindow', zone: 'Europe/Berlin', start: 990, end: 1050, days: [0, 1, 2, 3, 4, 5, 6] }]);
  assert.equal(c.dayZone, null);
});

test('config: an unknown key is an error with a suggestion and its line, and a key named twice is refused', () => {
  const text = teamText(teamWith({ rules: { pairOverlap: { minMinute: 240 } } }));
  const problems = (() => {
    try {
      readConfig(text, 'team.json');
    } catch (error) {
      return error.problems.map((p) => p.text);
    }
    return [];
  })();
  assert.deepEqual(problems, [`team.json:${lineOf(text, '"minMinute"')}: rules.pairOverlap.minMinute: unknown key; did you mean minMinutes?`]);
  refused(teamWith({ dayzone: 'UTC' }), /dayzone: unknown key; did you mean dayZone\?/);
  refused(teamWith({ people: [person('Ana', 'UTC', undefined, { email: 'x' }), person('Bo', 'UTC')] }), /people\[0\]\.email: unknown key; the keys here are name, zone, hours, daysOff/);
  assert.throws(() => readConfig('{"name": "a", "name": "b"}', 'team.json'), (e) => e instanceof ConfigError && /team\.json: line 1, column 15: the name "name" appears twice in one object; RFC 8259 says the behavior of software that receives such an object is unpredictable/.test(e.message));
  assert.throws(() => readConfig('{"people": [}', 'team.json'), /team\.json: line 1, column 13/);
  assert.throws(() => readConfig('[]', 'team.json'), /the team file must be one JSON object, not an array/);
  assert.throws(() => validateConfig(null), /must be one JSON object, not null/);
});

test('config: the key lists name every key the reader knows', () => {
  assert.deepEqual(Object.keys(KEYS), ['name', 'dayZone', 'people', 'holidays', 'rules']);
  assert.deepEqual(Object.keys(KEYS.rules), ['pairOverlap', 'anchorOverlap', 'coreWindow']);
  assert.deepEqual(Object.keys(PERSON_KEYS), ['name', 'zone', 'hours', 'daysOff']);
  assert.deepEqual(Object.keys(HOLIDAY_KEYS), ['name', 'days', 'people']);
});
