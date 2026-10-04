# 1. Read no clock, and keep dates out of the repository

## Status

Accepted.

## Context

The check is about days: which days of a range give the team enough shared time. The obvious range is the next few weeks, counted from today, read from the clock of the machine.

A clock makes the same team file give a different report from one day to the next. A pipeline that passes on Monday can fail on Tuesday with nothing changed, only because the range now reaches the week of a clock change, and a report saved in a ticket can no longer be reproduced. A test that reads the clock passes in one month and fails in another.

Time zones make this worse. Intl reads the time zone of the machine when it is not given one, and ECMA-402 says so in the steps of CreateDateTimeFormat: "If timeZone is undefined, then Set timeZone to SystemTimeZoneIdentifier()." `formatToParts` reads the clock when it is not given a moment: "If date is undefined, then Let x be ! Call(%Date.now%, undefined)."

The repository itself has a second constraint: no file may hold a date or a number that reads like a year. That covers the team file of the example, the saved example reports and every test. A check of clock changes needs real days, because clock changes happen on real days; an example with real dates would break the rule, and one with made-up dates would still hold year-like numbers.

## Decision

1. The tool reads no clock and no random number. The range is given on the command line, with `--from` and `--days`, both required. `test/repo.test.js` looks for `Date.now(`, `new Date()`, `Math.random`, `getTimezoneOffset` and the locale date functions in `src` and fails if one appears.
2. Every Intl call gets a time zone, a moment and the locale `en-US`, and `Intl.DateTimeFormat` is used in `src/zones.js` only. `test/repo.test.js` checks both.
3. `--from` takes a date `YYYY-MM-DD` or a day number, the whole days since the Unix epoch. A date is turned into a day number with `Date.UTC`, which does not depend on the time zone or the locale.
4. A day off or a holiday in the team file is a date, or a whole number of days from the first day of the range. The example uses numbers, so the team file of the example holds no date.
5. With `--day-labels offset` the reports write each day as its distance from the first day of the range (`day 15 (Tue)`) and a moment on another day as `day 16 00:30Z`, and the JSON report leaves out every date. The default stays `date`, because a team reading its own report wants dates.
6. The example runs with `--from 20514` (a Monday, written as a day number) and `--day-labels offset`. `tools/example.mjs` writes its reports to `examples/output`, and neither the command in the README nor any saved report holds a date.
7. The tests build dates at run time from day numbers with `isoDay()` of `test/helpers.js`, and find the days on which a zone moves its clocks by asking Intl with `changeDay()`, so no test holds a date. `npm run check` and `test/repo.test.js` look for year-like numbers in every file.

## Consequences

- The same team file and arguments give the same report on every machine and on every day, for as long as the time zone data of Node gives the same offsets for those days. For days in the past that data rarely changes; for days in the future it can, and docs/limits.md says so.
- A pipeline that wants to check the coming weeks writes the date of the run into the command itself, for example as `--from` computed by the pipeline. The choice of the days is visible in the command.
- The example checks real clock changes: the day number of its first day is fixed, and the days on which New York, Berlin and Lisbon move their clocks are those of the time zone data.
- A team file with days written as numbers moves with `--from`; one with dates stays fixed. Both forms can be mixed.
