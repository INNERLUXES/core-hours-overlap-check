// The three rules a team file can state, the reasons a check can fall short, and the sentences each rests on. The
// numbers of a rule (the minutes, the window, the days) come from the team file only.

export const RULES = [
  { id: 'pair-overlap', key: 'pairOverlap', title: 'every two people share at least minMinutes of working time on each calendar day of dayZone on which both are scheduled', facts: ['rfcUtc', 'tzUpdated'] },
  { id: 'anchor-overlap', key: 'anchorOverlap', title: 'every person who is not an anchor shares at least minMinutes of working time with the anchors, taken together, on each calendar day of dayZone on which both sides are scheduled', facts: ['rfcUtc', 'tzUpdated'] },
  { id: 'core-window', key: 'coreWindow', title: 'every person works the whole window from start to end in the zone of the window, on each day of the week the rule names', facts: ['rfcUtc', 'tzUpdated'] }
];

export const ruleById = (id) => RULES.find((r) => r.id === id);

// Why a check can fall short, in the order the reports list them.
export const REASONS = [
  { kind: 'day-off', title: 'a person of the check has a day off inside the window of the check', facts: [] },
  { kind: 'holiday', title: 'a person of the check has a holiday inside the window of the check', facts: [] },
  { kind: 'clock-change', title: 'the check meets the rule when every zone of the check is on its lowest offset of the year around the day, and a zone of the check is ahead of it', facts: ['tzBaseOffset', 'tzUpdated'] },
  { kind: 'hours', title: 'none of the above: the working hours do not share enough time', facts: [] }
];
