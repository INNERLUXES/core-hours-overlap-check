// The shared working time of the team, day by day. For each day of the range and each rule, the working hours of the
// people concerned are turned into moments of UTC with the clock of src/zones.js, cut to the window of the check, and
// compared:
//   pair-overlap    every two people, within the calendar day of dayZone
//   anchor-overlap  every person who is not an anchor with the anchors together, within the calendar day of dayZone
//   core-window     every person with the window of the rule, on the days of the week the rule names
// A check runs only on a day when every person it compares is scheduled to work within its window, before days off
// and holidays are taken out; so a weekend gives no check, and a day off gives a check that fails with its reason. The
// core window is the exception: it runs for everyone on every day of the week it names, because everyone must cover it.
//
// A check that falls short gets its reasons: the days off and holidays inside its window, a clock change when the same
// check meets the rule with every zone of the check on its lowest offset of the year around the day (its standard time),
// and otherwise the working hours themselves. docs/method.md writes this out.

import { DAY_MS, resolveDay, weekdayOf } from './days.js';
import { clip, intersect, minutesOf, normalize, total, union } from './intervals.js';
import { fixedClock } from './zones.js';

export const OVERLAP_LIMITS = { maxChecks: 200000 };

// The people of the team with their days off and holidays as day numbers, for a range that starts on the day from.
export function preparePeople(config, from) {
  return config.people.map((p) => {
    const absences = new Map();
    const add = (day, why) => {
      if (!absences.has(day)) absences.set(day, []);
      absences.get(day).push(why);
    };
    for (const d of p.daysOff) add(resolveDay(d, from), { kind: 'day-off' });
    for (const h of config.holidays) if (h.people.includes(p.name)) for (const d of h.days) add(resolveDay(d, from), { kind: 'holiday', name: h.name });
    return { name: p.name, zone: p.zone, week: p.week, absences };
  });
}

// The local day of a moment in a zone.
const localDayOf = (clock, zone, ms) => Math.floor((ms + clock.offsetAt(zone, ms)) / DAY_MS);

// The working time of a person between two moments: the scheduled time from the weekly hours, the actual time with
// days off and holidays taken out, the absences that took time out, and the local times that fell in a gap or were
// repeated when the clocks changed.
export function workIn(person, from, to, clock) {
  const scheduled = [];
  const actual = [];
  const absences = [];
  const odd = [];
  const first = localDayOf(clock, person.zone, from) - 1;
  const last = localDayOf(clock, person.zone, to) + 1;
  for (let day = first; day <= last; day += 1) {
    const shifts = [];
    for (const [s, e] of person.week[weekdayOf(day)]) {
      const a = clock.toUtc(person.zone, day * DAY_MS + s * 60000);
      const b = clock.toUtc(person.zone, day * DAY_MS + e * 60000);
      shifts.push([a.utc, b.utc]);
      for (const [x, minute] of [[a, s], [b, e]]) if (x.kind !== 'normal' && x.utc >= from && x.utc <= to) odd.push({ person: person.name, zone: person.zone, day, minute, kind: x.kind });
    }
    const inside = clip(normalize(shifts), from, to);
    if (!inside.length) continue;
    scheduled.push(...inside);
    const why = person.absences.get(day);
    if (why) absences.push(...why.map((w) => ({ person: person.name, day, ...w })));
    else actual.push(...inside);
  }
  return { scheduled: normalize(scheduled), actual: normalize(actual), absences, odd };
}

// The calendar day of a zone as two moments.
export const dayWindow = (clock, zone, day) => [clock.toUtc(zone, day * DAY_MS).utc, clock.toUtc(zone, (day + 1) * DAY_MS).utc];

// The window of the core-window rule on a day, as two moments.
export const coreWindowOf = (clock, rule, day) => [clock.toUtc(rule.zone, day * DAY_MS + rule.start * 60000).utc, clock.toUtc(rule.zone, day * DAY_MS + rule.end * 60000).utc];

// The checks a rule makes on a day: who is compared, and the zone and window of the check. Returns a list of
// { rule, who, members, others, zones, window(clock) }: members are the people on one side, others on the other side
// (the anchors, the other person of a pair, or nobody for the core window).
export function checksOf(rule, people, dayZone) {
  if (rule.key === 'pairOverlap') {
    const out = [];
    for (let i = 0; i < people.length; i += 1) for (let j = i + 1; j < people.length; j += 1) out.push({ rule, who: `${people[i].name} and ${people[j].name}`, short: `${people[i].name}+${people[j].name}`, members: [people[i]], others: [people[j]], frameZone: dayZone });
    return out;
  }
  if (rule.key === 'anchorOverlap') {
    const anchors = people.filter((p) => rule.anchor.includes(p.name));
    return people.filter((p) => !rule.anchor.includes(p.name)).map((p) => ({ rule, who: `${p.name} with ${rule.anchor.join(' and ')}`, short: p.name, members: [p], others: anchors, frameZone: dayZone }));
  }
  return people.map((p) => ({ rule, who: p.name, short: p.name, members: [p], others: [], frameZone: rule.zone }));
}

// The zones whose offsets a check depends on.
export const zonesOfCheck = (c) => [...new Set([c.frameZone, ...c.members.map((p) => p.zone), ...c.others.map((p) => p.zone)])];

// Measures one check on one day with a clock. work(person, from, to) gives the working time of a person in a window;
// it is cached by the caller for the clock of the run.
export function measure(c, day, clock, work = (p, a, b) => workIn(p, a, b, clock)) {
  const window = c.rule.key === 'coreWindow' ? coreWindowOf(clock, c.rule, day) : dayWindow(clock, c.frameZone, day);
  const mine = c.members.map((p) => work(p, window[0], window[1]));
  const theirs = c.others.map((p) => work(p, window[0], window[1]));
  const side = (list, key) => union(...list.map((w) => w[key]));
  let shared;
  let expected;
  let needMs;
  if (c.rule.key === 'coreWindow') {
    const frame = window[1] > window[0] ? [window] : [];
    shared = intersect(side(mine, 'actual'), frame);
    needMs = total(frame);
    expected = c.rule.days.includes(weekdayOf(day));
  } else {
    shared = intersect(side(mine, 'actual'), side(theirs, 'actual'));
    needMs = c.rule.minMinutes * 60000;
    expected = total(side(mine, 'scheduled')) > 0 && total(side(theirs, 'scheduled')) > 0;
  }
  const sharedMs = total(shared);
  return {
    expected,
    window,
    shared,
    sharedMs,
    needMs,
    met: sharedMs >= needMs,
    minutes: minutesOf(shared),
    need: Math.floor(needMs / 60000),
    sides: [...c.members.map((p, i) => ({ name: p.name, zone: p.zone, ...mine[i] })), ...c.others.map((p, i) => ({ name: p.name, zone: p.zone, ...theirs[i] }))]
  };
}

// The reasons of a check that falls short. Every absence inside its window; a clock change when the check meets the rule
// with every zone of the check on its lowest offset of the year around the day; else the working hours.
export function reasonsOf(c, day, m, clock) {
  const reasons = [];
  const seen = new Set();
  for (const s of m.sides) {
    for (const a of s.absences) {
      const key = `${a.person}|${a.day}|${a.kind}|${a.name ?? ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      reasons.push({ kind: a.kind, person: a.person, day: a.day, ...(a.name ? { holiday: a.name } : {}) });
    }
  }
  const middle = m.window[0] + Math.floor((m.window[1] - m.window[0]) / 2);
  const zones = zonesOfCheck(c);
  const lowest = new Map(zones.map((z) => [z, clock.lowestOffset(z, middle)]));
  const moved = zones.filter((z) => clock.offsetAt(z, middle) > lowest.get(z));
  if (moved.length) {
    const standard = measure(c, day, fixedClock(lowest));
    if (standard.met) reasons.push({ kind: 'clock-change', zones: moved.map((z) => ({ zone: z, offset: clock.offsetAt(z, middle), standard: lowest.get(z) })), minutesOnStandardTime: standard.minutes, needOnStandardTime: standard.need });
  }
  if (!reasons.length) {
    const none = m.sides.filter((s) => total(s.scheduled) === 0).map((s) => s.name);
    reasons.push({ kind: 'hours', ...(none.length ? { notWorking: none } : {}) });
  }
  return reasons;
}

// Every check of every day of the range. Returns { days, odd }: each day with its checks, and the local times that fell
// in a gap or were repeated.
export function evaluate(config, people, from, count, clock) {
  const checks = config.rules.flatMap((r) => checksOf(r, people, config.dayZone));
  if (checks.length * count > OVERLAP_LIMITS.maxChecks) {
    throw Object.assign(new Error(`the team and the range give up to ${(checks.length * count).toLocaleString('en-US')} checks, more than ${OVERLAP_LIMITS.maxChecks.toLocaleString('en-US')}; give fewer days with --days or check part of the team`), { input: true });
  }
  const days = [];
  const odd = new Map();
  for (let day = from; day < from + count; day += 1) {
    const cache = new Map();
    const work = (p, a, b) => {
      const key = `${p.name}|${a}|${b}`;
      if (!cache.has(key)) cache.set(key, workIn(p, a, b, clock));
      return cache.get(key);
    };
    const results = [];
    for (const c of checks) {
      const m = measure(c, day, clock, work);
      if (!m.expected) continue;
      for (const s of m.sides) for (const o of s.odd) odd.set(`${o.zone}|${o.day}|${o.minute}|${o.kind}`, o);
      results.push({ check: c, m, reasons: m.met ? [] : reasonsOf(c, day, m, clock) });
    }
    days.push({ day, results });
  }
  return { days, odd: [...odd.values()].sort((a, b) => a.day - b.day || (a.zone < b.zone ? -1 : a.zone > b.zone ? 1 : 0) || a.minute - b.minute) };
}
