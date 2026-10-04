import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAY_MS, OVERLAP_LIMITS, REASONS, RULES, checksOf, coreWindowOf, dayWindow, evaluate, makeClock, measure, preparePeople, reasonsOf, ruleById, total, workIn } from '../src/index.js';
import { DAY0, changeDay, checksOf as allChecks, isoDay, mondayFrom, person, reportOf, run, filesWith, teamOf, teamWith, ARGS } from './helpers.js';

const H = 3600000;
const pairTeam = (min, bo = { 'mon-fri': ['09:00-17:00'] }) => teamWith({ people: [person('Ana', 'Europe/Berlin'), person('Bo', 'Europe/London', bo)], rules: { pairOverlap: { minMinutes: min } } });

test('pair-overlap: Berlin and London an hour apart share seven hours; the rule is met at 420 minutes and short at 421', async () => {
  const met = await reportOf(pairTeam(420));
  assert.equal(met.code, 0);
  assert.deepEqual(allChecks(met).map((c) => [c.day, c.who, c.minutes, c.met]), [0, 1, 2, 3, 4].map((d) => [d, 'Ana and Bo', 420, true]));
  assert.deepEqual(met.days.filter((d) => !d.checks.length).map((d) => d.day), [5, 6], 'no check on the weekend: nobody is scheduled');
  const short = await reportOf(pairTeam(421));
  assert.equal(short.code, 1);
  assert.equal(short.failures.length, 5);
  assert.deepEqual(short.failures[0].reasons, [{ kind: 'hours', text: 'the working hours share 420 of 421 minutes' }]);
  assert.equal(short.verdict.text, 'FAIL - 5 of 5 checks on 5 days are short of the rules');
});

test('split shifts: the lunch break of one person is not shared time', async () => {
  const r = await reportOf(pairTeam(360, { 'mon-fri': ['09:00-12:00', '13:00-17:00'] }));
  assert.equal(r.code, 0);
  assert.equal(allChecks(r)[0].minutes, 360);
  const both = await reportOf(teamWith({ people: [person('Ana', 'Europe/Berlin', { 'mon-fri': ['09:00-13:00', '14:00-18:00'] }), person('Bo', 'Europe/London', { 'mon-fri': ['09:00-12:00', '13:00-17:00'] })], rules: { pairOverlap: { minMinutes: 1 } } }));
  // Ana works 08:00-12:00Z and 13:00-17:00Z, Bo 09:00-12:00Z and 13:00-17:00Z: 3 + 4 hours.
  assert.equal(allChecks(both)[0].minutes, 420);
});

test('pair-overlap: every two people, and only on days when both are scheduled', async () => {
  const r = await reportOf(teamWith({ people: [person('Ana', 'Europe/Berlin'), person('Bo', 'Europe/London'), person('Cy', 'UTC', { sat: ['10:00-14:00'] })], rules: { pairOverlap: { minMinutes: 60 } } }));
  assert.equal(r.code, 0);
  assert.deepEqual([...new Set(allChecks(r).map((c) => c.who))], ['Ana and Bo']);
  assert.equal(r.totals.checks, 5);
});

test('anchor-overlap: each other person with the anchors taken together', async () => {
  const people = [person('Ana', 'Europe/Berlin', { 'mon-fri': ['09:00-13:00'] }), person('Bo', 'Europe/London', { 'mon-fri': ['13:00-17:00'] }), person('Cy', 'UTC', { 'mon-fri': ['10:00-15:00'] })];
  const two = await reportOf(teamWith({ people, rules: { anchorOverlap: { anchor: ['Ana', 'Bo'], minMinutes: 240 } } }));
  assert.equal(two.code, 0);
  assert.deepEqual(two.days[0].checks.map((c) => [c.who, c.short, c.minutes]), [['Cy with Ana and Bo', 'Cy', 240]]);
  const one = await reportOf(teamWith({ people, rules: { anchorOverlap: { anchor: ['Ana'], minMinutes: 121 } } }));
  assert.deepEqual(one.days[0].checks.map((c) => [c.who, c.minutes, c.met]), [['Bo with Ana', 0, false], ['Cy with Ana', 120, false]]);
  assert.equal(one.days[0].checks[0].reasons[0].text, 'the working hours share 0 of 121 minutes');
  const atLimit = await reportOf(teamWith({ people, rules: { anchorOverlap: { anchor: ['Ana'], minMinutes: 120 } } }));
  assert.deepEqual(atLimit.days[0].checks.map((c) => c.met), [false, true]);
});

test('core-window: everyone works the whole window on the days it names; part of it is short', async () => {
  const people = [person('Ana', 'Europe/Berlin'), person('Cy', 'UTC', { 'mon-fri': ['10:00-15:30'] }), person('Dee', 'UTC', { 'mon-thu': ['14:00-18:00'] })];
  const r = await reportOf(teamWith({ dayZone: undefined, people, rules: { coreWindow: { zone: 'UTC', start: '15:00', end: '16:00', days: ['mon-fri'] } } }));
  assert.equal(r.code, 1);
  const mon = r.days[0].checks.map((c) => [c.who, c.minutes, c.need, c.met]);
  assert.deepEqual(mon, [['Ana', 60, 60, true], ['Cy', 30, 60, false], ['Dee', 60, 60, true]]);
  assert.deepEqual(r.days[0].checks[1].reasons, [{ kind: 'hours', text: 'the working hours cover 30 of the 60 minutes of the window' }]);
  const fri = r.days[4].checks.find((c) => c.who === 'Dee');
  assert.deepEqual(fri.reasons, [{ kind: 'hours', text: 'Dee has no working hours in the window; the working hours cover 0 of the 60 minutes of the window' }]);
  assert.deepEqual(r.days.filter((d) => !d.checks.length).map((d) => d.day), [5, 6], 'no window on the weekend');
  const sat = await reportOf(teamWith({ dayZone: undefined, people, rules: { coreWindow: { zone: 'UTC', start: '15:00', end: '16:00', days: ['sat'] } } }));
  assert.deepEqual(sat.days[5].checks.map((c) => c.met), [false, false, false], 'a window on a day nobody works fails for everyone');
});

test('days off and holidays: a check inside them is short, with the person, the holiday and the day', async () => {
  const team = teamWith({
    people: [person('Ana', 'Europe/Berlin'), person('Bo', 'Europe/London', undefined, { daysOff: [2, 40] })],
    holidays: [{ name: 'Founders day', days: [isoDay(DAY0 + 3)], people: ['Ana'] }],
    rules: { pairOverlap: { minMinutes: 60 } }
  });
  const r = await reportOf(team);
  assert.equal(r.code, 1);
  assert.deepEqual(r.failures.map((f) => [f.day, f.reasons.map((x) => x.text)]), [[2, [`Bo has a day off on ${isoDay(DAY0 + 2)} (Wed)`]], [3, [`Founders day for Ana on ${isoDay(DAY0 + 3)} (Thu)`]]]);
  assert.deepEqual(r.failures.map((f) => f.minutes), [0, 0]);
  assert.deepEqual(r.absences.map((a) => a.text), [`Bo day off on ${isoDay(DAY0 + 2)} (Wed)`, `Founders day for Ana on ${isoDay(DAY0 + 3)} (Thu)`]);
  assert.deepEqual(r.notes, ['1 day off or holiday of the team file falls outside the range']);
  const offset = await reportOf(team, DAY0, 7, ['--day-labels', 'offset']);
  assert.equal(offset.failures[0].reasons[0].text, 'Bo has a day off on day 2 (Wed)');
});

// The week after one zone moved its clocks forward and before the other did: found with Intl, never written as a date.
function springGap() {
  const ny = changeDay('America/New_York', DAY0 - 120, 1);
  const berlin = changeDay('Europe/Berlin', ny.day, 1);
  const monday = mondayFrom(ny.day);
  assert.ok(berlin.day > monday + 4, 'Europe/Berlin moves its clocks after New York, with a working week between');
  return { ny, berlin, monday };
}

test('clock changes: in the weeks when New York has moved its clocks and Berlin has not, a late Berlin window loses half an hour', async () => {
  const { monday } = springGap();
  const team = teamWith({
    dayZone: undefined,
    people: [person('Anke', 'Europe/Berlin', { 'mon-fri': ['09:00-17:30'] }), person('Ben', 'America/New_York', { 'mon-fri': ['07:30-12:00', '13:00-16:00'] })],
    rules: { coreWindow: { zone: 'Europe/Berlin', start: '16:30', end: '17:30', days: ['mon-fri'] } }
  });
  const before = await reportOf(team, monday - 7, 5);
  assert.equal(before.code, 0, 'the week before the first change meets the rule');
  const gap = await reportOf(team, monday, 5, ['--day-labels', 'offset']);
  assert.equal(gap.code, 1);
  assert.equal(gap.failures.length, 5);
  assert.deepEqual(gap.failures.map((f) => f.who), ['Ben', 'Ben', 'Ben', 'Ben', 'Ben']);
  assert.equal(gap.failures[0].minutes, 30);
  assert.deepEqual(gap.failures[0].reasons, [{ kind: 'clock-change', text: 'clock change: America/New_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes' }]);
});

test('clock changes: after Berlin moves its clocks, a colleague in Sao Paulo, where the clocks stay, shares an hour less', async () => {
  const { berlin } = springGap();
  const monday = mondayFrom(berlin.day);
  const team = teamWith({
    people: [person('Anke', 'Europe/Berlin', { 'mon-fri': ['09:00-17:30'] }), person('Caio', 'America/Sao_Paulo', { 'mon-fri': ['08:30-11:30', '12:30-17:30'] })],
    rules: { anchorOverlap: { anchor: ['Anke'], minMinutes: 240 } }
  });
  assert.equal((await reportOf(team, monday - 7, 5)).code, 0);
  const after = await reportOf(team, monday, 5, ['--day-labels', 'offset']);
  assert.deepEqual(after.failures.map((f) => [f.who, f.minutes]), Array.from({ length: 5 }, () => ['Caio with Anke', 180]));
  assert.equal(after.failures[0].reasons[0].text, 'clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would share 240 of 240 minutes');
  assert.deepEqual(after.clockChanges, []);
  const around = await reportOf(team, monday - 7, 14, ['--day-labels', 'offset']);
  assert.deepEqual(around.clockChanges, [{ zone: 'Europe/Berlin', label: `day ${berlin.day - monday + 7} (Sun)`, before: 'UTC+01:00', after: 'UTC+02:00' }]);
});

test('clock changes: a shift on the day the clocks move forward is an hour shorter, and one that starts in the gap is noted', async () => {
  const forward = changeDay('Europe/Berlin', DAY0, 1);
  const team = (shift) => teamWith({ dayZone: undefined, people: [person('Ana', 'Europe/Berlin', { sun: [shift] })], rules: { coreWindow: { zone: 'Europe/Berlin', start: '00:00', end: '24:00', days: ['sun'] } } });
  const plain = await reportOf(team('01:00-04:00'), forward.day, 1, ['--day-labels', 'offset']);
  assert.deepEqual([plain.days[0].checks[0].minutes, plain.days[0].checks[0].need], [120, 1380], 'three hours on the clock are two hours of time, in a day of 23 hours');
  assert.deepEqual(plain.notes, []);
  const inGap = await reportOf(team('02:30-05:00'), forward.day, 1, ['--day-labels', 'offset']);
  assert.equal(inGap.days[0].checks[0].minutes, 90);
  assert.deepEqual(inGap.notes, ['Europe/Berlin: 02:30 on day 0 (Sun) does not exist, the clocks skip it; the shift of Ana is read at 02:30 on the clock before the change, which is later by the length of the gap']);
});

test('clock changes: a shift on the day the clocks move back is an hour longer, and one that starts in the repeated hour starts at the first', async () => {
  const back = changeDay('Europe/Berlin', DAY0, -1);
  const team = (shift) => teamWith({ dayZone: undefined, people: [person('Ana', 'Europe/Berlin', { sun: [shift] })], rules: { coreWindow: { zone: 'Europe/Berlin', start: '00:00', end: '24:00', days: ['sun'] } } });
  const plain = await reportOf(team('01:00-04:00'), back.day, 1, ['--day-labels', 'offset']);
  assert.deepEqual([plain.days[0].checks[0].minutes, plain.days[0].checks[0].need], [240, 1500]);
  const twice = await reportOf(team('02:30-03:30'), back.day, 1, ['--day-labels', 'offset']);
  assert.equal(twice.days[0].checks[0].minutes, 120);
  assert.deepEqual(twice.notes, ['Europe/Berlin: 02:30 on day 0 (Sun) happens twice, the clocks pass it again; the shift of Ana is read at the first of the two']);
});

test('the day of dayZone is 23 or 25 hours long on the days its clocks move, and a day off on a neighbour day stays out', () => {
  const forward = changeDay('Europe/Berlin', DAY0, 1);
  const back = changeDay('Europe/Berlin', DAY0, -1);
  const clock = makeClock(['Europe/Berlin'], forward.day - 2, back.day + 2);
  const len = (day) => {
    const [a, b] = dayWindow(clock, 'Europe/Berlin', day);
    return (b - a) / H;
  };
  assert.deepEqual([len(forward.day - 1), len(forward.day), len(back.day), len(back.day + 1)], [24, 23, 25, 24]);
  const c = teamOf(teamWith({ people: [person('Ana', 'Asia/Tokyo', { 'mon-fri': ['07:00-10:00'] }, { daysOff: [1] }), person('Bo', 'Europe/London')] }));
  const [ana] = preparePeople(c, DAY0);
  const clk = makeClock(['Asia/Tokyo', 'Europe/Berlin'], DAY0, DAY0 + 3);
  // The Berlin Monday (23:00Z to 23:00Z) holds two hours of the Tokyo Monday shift (22:00Z to 01:00Z) and one hour of
  // the Tokyo Tuesday shift, which is a day off.
  const [from, to] = dayWindow(clk, 'Europe/Berlin', DAY0);
  const w = workIn(ana, from, to, clk);
  assert.equal(total(w.scheduled), 3 * H);
  assert.equal(total(w.actual), 2 * H, 'the hour of the Tuesday shift stays out');
  assert.deepEqual(w.absences.map((a) => [a.day - DAY0, a.kind]), [[1, 'day-off']]);
});

test('measure, reasonsOf and checksOf: the parts behind a report', () => {
  const c = teamOf(teamWith({ rules: { pairOverlap: { minMinutes: 421 }, coreWindow: { zone: 'UTC', start: '09:00', end: '10:00', days: ['mon'] } } }));
  const people = preparePeople(c, DAY0);
  const checks = c.rules.flatMap((r) => checksOf(r, people, c.dayZone));
  assert.deepEqual(checks.map((x) => [x.rule.id, x.who, x.short]), [['pair-overlap', 'Ana and Bo', 'Ana+Bo'], ['core-window', 'Ana', 'Ana'], ['core-window', 'Bo', 'Bo']]);
  const clock = makeClock(['Europe/Berlin', 'Europe/London', 'UTC'], DAY0, DAY0 + 1);
  const m = measure(checks[0], DAY0, clock);
  assert.equal(m.expected, true);
  assert.deepEqual([m.minutes, m.need, m.met], [420, 421, false]);
  assert.deepEqual(reasonsOf(checks[0], DAY0, m, clock), [{ kind: 'hours' }]);
  assert.deepEqual(coreWindowOf(clock, checks[1].rule, DAY0), [DAY0 * DAY_MS + 9 * H, DAY0 * DAY_MS + 10 * H]);
  assert.equal(measure(checks[1], DAY0 + 1, clock).expected, false, 'the window runs on Mondays only');
  const result = evaluate(c, people, DAY0, 2, clock);
  assert.deepEqual(result.days.map((d) => d.results.length), [3, 1]);
  assert.equal(OVERLAP_LIMITS.maxChecks, 200000);
  assert.throws(() => evaluate(c, people, DAY0, 100000, clock), (e) => e.input && /give up to 300,000 checks, more than 200,000/.test(e.message));
});

test('rules and reasons: each has an id, a title and the sentences it rests on', () => {
  assert.deepEqual(RULES.map((r) => [r.id, r.key]), [['pair-overlap', 'pairOverlap'], ['anchor-overlap', 'anchorOverlap'], ['core-window', 'coreWindow']]);
  assert.deepEqual(REASONS.map((r) => r.kind), ['day-off', 'holiday', 'clock-change', 'hours']);
  assert.equal(ruleById('core-window').key, 'coreWindow');
  assert.equal(ruleById('nope'), undefined);
});

test('a range in which no check runs gives no verdict, and so does a range past the last day the tool reads', async () => {
  const weekend = await run(filesWith(), ['--team', 'team.json', '--from', String(DAY0 + 5), '--days', '2']);
  assert.equal(weekend.code, 2);
  assert.match(weekend.err, /no check ran in the 2 days of the range: on no day is everyone a rule compares scheduled to work/);
  const late = await run(filesWith(), ['--team', 'team.json', '--from', '2932890', '--days', '30']);
  assert.equal(late.code, 2);
  assert.match(late.err, /the range ends after .* the last day the tool reads/);
  assert.equal((await run(filesWith(), ARGS)).code, 0);
});
