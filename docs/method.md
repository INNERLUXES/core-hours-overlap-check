# Method

This document says how every number of a report is made, step by step, and where the tool makes a choice that no source makes for it.

## Time zone names

A time zone is written as an IANA name. The IANA page on the theory of the database says: "Each timezone has a name that uniquely identifies the timezone." and "Names normally have the format AREA/LOCATION, where AREA is a continent or ocean, and LOCATION is a specific location within the area." It also says: "The database defines each timezone name to be a zone, or a link to a zone."

The tool checks a name in three steps and stops the run at the first that fails:

1. **Written as a name.** Letters, digits, `_`, `+` and `-`, parts joined by `/`, starting with a letter, at most 64 characters. A UTC offset such as `+01:00` is refused with its own message. ECMA-402 accepts an offset as a time zone, but an offset never moves with the clocks, so a person in a zone that changes its clocks would be checked against the wrong hours for half the year. This is the tool's own choice.
2. **Known to Intl.** `new Intl.DateTimeFormat('en-US', { timeZone })` must accept the name. In the steps of CreateDateTimeFormat in ECMA-402: "If timeZoneIdentifierRecord is empty, throw a RangeError exception." A name Intl does not know stops the run. Intl compares names without case, as GetAvailableNamedTimeZoneIdentifier does, so `europe/berlin` is accepted; the reports show the name as the team file writes it.
3. **Listed by the engine.** Where `Intl.supportedValuesOf` exists, the primary name the name resolves to (`resolvedOptions().timeZone`) must be in `Intl.supportedValuesOf('timeZone')`. ECMA-402 builds that list from the primary names only, so a link such as `Asia/Kolkata` is checked by the primary name the engine gives it. `UTC` is accepted even where the list leaves it out, because ECMA-402 says: "For historical reasons, "UTC" must be a primary time zone identifier."

## Offsets

The UTC offset of a zone at a moment comes from `Intl.DateTimeFormat` with the zone, the locale `en-US`, a 24-hour clock and the fields year to second: `formatToParts` gives the local date and time of the moment; read back as if it were UTC, minus the moment, it is the offset. The tool always passes a zone and a moment. ECMA-402 reads the machine's zone when none is given ("If timeZone is undefined, then Set timeZone to SystemTimeZoneIdentifier().") and the clock when no moment is given ("If date is undefined, then Let x be ! Call(%Date.now%, undefined)."), and either would make the report depend on the machine.

For a run, each zone's offset is read once a day from half a year before the range to half a year after it, and every change between two readings is narrowed down to the second. Offsets inside that span come from this list; a moment outside it is read from Intl again.

## Local times to UTC

A shift is written in local time. The tool turns a local time into a moment with the offsets one day before and one day after it:

- when exactly one of the two offsets gives back the same local time, that moment is used;
- when both do, the local time happens twice (the clocks moved back); the tool takes **the first** of the two moments;
- when neither does, the local time is skipped (the clocks moved forward); the tool reads it **on the clock before the change**, which gives a moment later by the length of the gap: 02:30 on the night Berlin moves from UTC+01:00 to UTC+02:00 is read as 01:30Z, which is 03:30 on the new clock.

This rule is the tool's own choice, made so that a shift that starts or ends in a skipped hour keeps the part that exists and a shift in a repeated hour starts as early as it can. A shift that has such a time gets a note in the report. The rule assumes that a zone moves its clocks at most once within a day on either side of a local time.

## The working time of a person in a window

For a window of two moments, the tool looks at the person's local days that the window touches, and one day on each side. For each of those days it takes the shifts of its day of the week, turns their start and end into moments, and keeps the part inside the window. That is the scheduled time. A local day that is a day off or a holiday of the person adds its part to the scheduled time but not to the actual time, and becomes an absence of the check. Days off and holidays are local days of the person, in the person's own zone.

## The checks

| Rule | Who is compared | Window of a check | Runs when | Needs |
| --- | --- | --- | --- | --- |
| `pair-overlap` | every two people | the calendar day of `dayZone` | both are scheduled within the window | `minMinutes` of actual time shared |
| `anchor-overlap` | every person who is not an anchor, with the anchors taken together | the calendar day of `dayZone` | the person and at least one anchor are scheduled within the window | `minMinutes` of actual time shared |
| `core-window` | every person | from `start` to `end` in `zone`, on the calendar day | the day of the week is in `days` | the whole window |

A calendar day of a zone runs from its local midnight to the next one, so it lasts 23 or 25 hours on the days the zone moves its clocks. A window whose start or end is a skipped or repeated local time follows the rule above.

### `pair-overlap`

For each day and each two people scheduled within the calendar day of `dayZone`, the shared time is the overlap of their actual times. The check is short when the shared time is less than `minMinutes`. With many people the checks grow with the square of the team; the run stops with no verdict when the team and the range give more than 200,000 checks.

### `anchor-overlap`

The anchors are one person or several. Their actual times are joined into one list, and each other person is compared with it. A team of anchors covers the day together: the time a person shares with any anchor counts. Anchors are not compared with each other.

### `core-window`

Everyone must work the whole window. The window runs on the days of the week in `days`, for every person, also on a day the person does not usually work, because the team agreed that everyone covers it; such a check is short with the reason that the person has no working hours in the window. A window on the night the clocks move is shorter or longer by the gap, and the check needs the window as it really is.

## Reasons

A check that is short gets every reason that applies, in this order:

1. **Day off** and **holiday**: an absence of a person of the check on a local day whose shift falls inside the window of the check.
2. **Clock change**: the zones of the check are the zone of the window (`dayZone` or the zone of the core window) and the zones of the people compared. For each, the tool takes its lowest offset within half a year on each side of the middle of the window and calls it its standard time. When at least one zone is ahead of its standard time on the day, the check is measured again with every zone of the check fixed at its standard time. If it then meets the rule, the reason names each zone that is ahead, with both offsets, and gives the shared time on standard time. This is the tool's own definition. The IANA theory page warns: "It does not always make sense to talk about a timezone's "base offset", which is not necessarily a single number." For the zones that move their clocks twice a year the lowest offset is the standard time; docs/limits.md lists the cases where it is not.
3. **The working hours**, when neither applies: the hours of the people do not share enough time. For the core window, a person with no scheduled time in the window is named.

The reason "clock change" therefore covers both cases that matter: the weeks when one zone has moved its clocks and another has not yet, and the months when a zone that moves its clocks is on summer time and a zone that does not move them is not. When both zones of a check are on summer time, moving both back gives the same overlap, and the reason is not given.

## Clock changes in the range

For each zone of the team, the tool compares the offset at local noon of every day of the range with the offset at local noon of the day before. A difference is a clock change on that day, reported with both offsets.

## Labels

A day is labelled with its date `YYYY-MM-DD`, the full-date form of RFC 3339 (`full-date = date-fullyear "-" date-month "-" date-mday`), or with `--day-labels offset` as its distance from the first day of the range, followed by its day of the week. A moment is written in UTC as `HH:MMZ`, after the use of `Z` in RFC 3339 (`time-offset = "Z" / time-numoffset`), on the day of its check, and with its date or `day N` before it on any other day. Minutes are whole minutes, rounded down; a check compares the exact milliseconds.

## Verdict

The run passes when every check on every day meets its rule. It fails when one check is short. A range in which no check runs gives no verdict, because a check with nothing to compare would always pass.
