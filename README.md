# core-hours-overlap-check

Computes the working time a team spread over time zones really shares, day by day, and lists the days when it falls short of what the team agreed. It reads a team file with each person's time zone and working hours in local time, turns every shift into moments of UTC with the Intl API of Node, and compares them for every day of a range you give. It finds the weeks when one country has moved its clocks and another has not yet, the days off and holidays of the team file, and plain gaps in the working hours, and it says which of these is the reason for each day.

Clock changes are where a schedule that looks fine on paper breaks. RFC 3339 puts it this way: "Because the daylight saving rules for local time zones are so convoluted and can change based on local law at unpredictable times, true interoperability is best achieved by using Coordinated Universal Time (UTC)." The tool does every comparison in UTC and shows the moments behind each number with `--explain`.

- **Three kinds of rule.** Every two people share at least N minutes a day (`pairOverlap`), every person shares at least N minutes with an anchor person or anchor group (`anchorOverlap`), or everyone works a fixed core window in one zone (`coreWindow`). The numbers come from the team file only; the tool has no threshold of its own.
- **Real time zones, no copy of the database.** Time zones are IANA names such as `Europe/Berlin`, checked with `Intl.DateTimeFormat` and `Intl.supportedValuesOf('timeZone')`. An unknown name or a bare UTC offset stops the run. Local times that do not exist, or exist twice, on the day the clocks move are handled by one written rule.
- **A reason for every short day.** A day off, a holiday, a clock change (the same check meets the rule when every zone of the check is on its standard time), or the working hours themselves.
- **Split shifts, days off and holidays.** A day can hold several shifts; days off and holidays are dates, or days counted from the first day of the range.
- **The same file gives the same report.** The tool reads no clock: the first day of the range is always given with `--from`. It does not depend on the time zone or the locale of the machine.
- **Names only.** People are named by a display name; a name that holds an `@` is refused, because no email address is needed.
- Reports as text, Markdown and JSON, with an exit code for a pipeline: `0` every check meets the rules, `1` a check on some day is short of its rule, `2` usage or input error.
- Plain JavaScript, no dependencies.

```
npm test
```

```
tests 139
pass 137
fail 0
skipped 2
```

These are the summary lines that `npm test` prints at the end on Windows. The skipped tests are the ones that need a symbolic link or a device (a link to `/dev/zero` named as the team file, and a link to a regular file); they are guarded with `process.platform`, run on Linux and macOS, and none of them asserts a line or a column. `npm run test:coverage` runs the same tests with coverage; their time limits are four times wider when coverage is on. One test runs the whole example under other time zones and locales in child processes and compares the reports. The tests find the days on which zones move their clocks by asking Intl, so no test holds the date of a clock change.

## Quick start

Requires Node 22 or newer. There is nothing to install.

```
git clone https://github.com/INNERLUXES/core-hours-overlap-check.git
cd core-hours-overlap-check
node bin/core-hours-overlap-check.js --team examples/team.json --from 20514 --days 35 --day-labels offset
```

Or without a clone, on your own team file:

```
npx --yes github:INNERLUXES/core-hours-overlap-check --team team.json --from YYYY-MM-DD --days 28
```

`examples/team.json` holds a made-up product team of four in four time zones: Anke in Berlin, who is the anchor, Ben in New York with a lunch break, Caio in Sao Paulo, where the clocks do not move, and Dina in Lisbon, with one day off. The team agreed that everyone shares four hours a day with Anke and works 16:30-17:30 Berlin time. The range starts on a Monday shortly before New York moves its clocks forward; Berlin and Lisbon follow three weeks later. `20514` is that Monday written as a day number, whole days since the Unix epoch, so the command holds no date; `--day-labels offset` writes each day as its distance from the first day.

## Usage

```
core-hours-overlap-check --team <file> --from <day> --days <n> [options]
```

```
--team <file>             the team file (JSON): people, time zones, working hours, days off, holidays, rules;
                          required
--from <day>              the first day of the range: a date YYYY-MM-DD, or a day number (whole days since the
                          Unix epoch); required, because the tool reads no clock
--days <n>                the number of days of the range, 1 to 1000; required
--day-labels <kind>       date (YYYY-MM-DD) or offset (day 0 is the first day of the range) (default: date)
--format <name>           text, markdown or json (default: text)
--explain                 show the moments in UTC behind each number, and the sentences the rules rest on
--out <file>              write the report to this file instead of the screen
--help                    show the usage
--version                 show the version
```

The report of the example starts with what was read and the counts:

```
core-hours-overlap-check: examples/team.json (Example product team)
range: 35 days, day 0 (Mon) to day 34 (Sun); days counted in Europe/Berlin
people: 4 people in 4 time zones
  Anke  Europe/Berlin      mon-fri 09:00-17:30
  Ben   America/New_York   mon-fri 07:30-12:00, 13:00-16:00
  Caio  America/Sao_Paulo  mon-fri 08:30-11:30, 12:30-17:30
  Dina  Europe/Lisbon      mon-fri 09:00-13:00, 14:00-18:00
rules: anchor-overlap: everyone shares at least 240 minutes a day with Anke (days of Europe/Berlin)
       core-window: everyone works 16:30-17:30 Europe/Berlin in full on mon-fri
clock changes: America/New_York from UTC-05:00 to UTC-04:00 on day 6 (Sun); Europe/Berlin from UTC+01:00 to UTC+02:00 on day 27 (Sun); Europe/Lisbon from UTC+00:00 to UTC+01:00 on day 27 (Sun)
absences: Dina day off on day 15 (Tue); Spring holiday for Anke and Dina on day 32 (Fri)
results: 175 checks on 25 days: 144 met, 31 short on 20 days
```

Then it lists every check that is short, day by day, with its reasons. Day 15 has two of the three kinds:

```
  day 15 (Tue)
    anchor-overlap  Dina with Anke: 0 minutes, 240 needed
                    Dina has a day off on day 15 (Tue)
    core-window     Ben: 30 minutes, 60 needed
                    clock change: America/New_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes
    core-window     Dina: 0 minutes, 60 needed
                    Dina has a day off on day 15 (Tue)
```

And it ends with every day and every number, a star after each check that is short:

```
Every day (shared minutes; * short of the rule)

  day 0 (Mon)   anchor-overlap Ben 240, Caio 240, Dina 390; core-window Anke 60, Ben 60, Caio 60, Dina 60
  day 1 (Tue)   anchor-overlap Ben 240, Caio 240, Dina 390; core-window Anke 60, Ben 60, Caio 60, Dina 60
  day 2 (Wed)   anchor-overlap Ben 240, Caio 240, Dina 390; core-window Anke 60, Ben 60, Caio 60, Dina 60
  day 3 (Thu)   anchor-overlap Ben 240, Caio 240, Dina 390; core-window Anke 60, Ben 60, Caio 60, Dina 60
  day 4 (Fri)   anchor-overlap Ben 240, Caio 240, Dina 390; core-window Anke 60, Ben 60, Caio 60, Dina 60
  day 5 (Sat)   no check
  day 6 (Sun)   no check
  day 7 (Mon)   anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 8 (Tue)   anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 9 (Wed)   anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 10 (Thu)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 11 (Fri)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 12 (Sat)  no check
  day 13 (Sun)  no check
  day 14 (Mon)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 15 (Tue)  anchor-overlap Ben 270, Caio 240, Dina 0*; core-window Anke 60, Ben 30*, Caio 60, Dina 0*
  day 16 (Wed)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 17 (Thu)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 18 (Fri)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 19 (Sat)  no check
  day 20 (Sun)  no check
  day 21 (Mon)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 22 (Tue)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 23 (Wed)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 24 (Thu)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 25 (Fri)  anchor-overlap Ben 270, Caio 240, Dina 390; core-window Anke 60, Ben 30*, Caio 60, Dina 60
  day 26 (Sat)  no check
  day 27 (Sun)  no check
  day 28 (Mon)  anchor-overlap Ben 240, Caio 180*, Dina 390; core-window Anke 60, Ben 60, Caio 0*, Dina 60
  day 29 (Tue)  anchor-overlap Ben 240, Caio 180*, Dina 390; core-window Anke 60, Ben 60, Caio 0*, Dina 60
  day 30 (Wed)  anchor-overlap Ben 240, Caio 180*, Dina 390; core-window Anke 60, Ben 60, Caio 0*, Dina 60
  day 31 (Thu)  anchor-overlap Ben 240, Caio 180*, Dina 390; core-window Anke 60, Ben 60, Caio 0*, Dina 60
  day 32 (Fri)  anchor-overlap Ben 0*, Caio 0*, Dina 0*; core-window Anke 0*, Ben 60, Caio 0*, Dina 0*
  day 33 (Sat)  no check
  day 34 (Sun)  no check
```

The exit code is `1`. In the first week every check is met. From day 7 to day 25 New York is an hour closer to Berlin: Ben shares more time with Anke, but his lunch break now falls in the second half of the Berlin window. From day 28 Berlin is on summer time and Sao Paulo is not: Caio shares an hour less with Anke and is at lunch during the window. Day 15 is Dina's day off, and day 32 the holiday of Anke and Dina. `--explain` shows the moments behind each number; for Ben on day 7:

```
    core-window Ben: 30 minutes, 60 needed, short
      window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z
      Ben (America/New_York, UTC-04:00): 15:30Z-16:00Z
      shared: 15:30Z-16:00Z = 30 minutes
```

[examples/output](examples/output) holds the report as text, with `--explain`, as Markdown and as JSON. `npm run example` runs the example again, checks it against this README, and writes those files; CI fails when they change.

## What it checks

| Rule | Key | A check is short when |
| --- | --- | --- |
| `pair-overlap` | `rules.pairOverlap` | two people share fewer than `minMinutes` of working time on a calendar day of `dayZone` on which both are scheduled |
| `anchor-overlap` | `rules.anchorOverlap` | a person who is not an anchor shares fewer than `minMinutes` with the anchors, taken together, on a calendar day of `dayZone` on which both sides are scheduled |
| `core-window` | `rules.coreWindow` | a person does not work the whole window from `start` to `end` in `zone`, on a day of the week in `days` |

A check runs only on a day when everyone it compares is scheduled to work within its window, before days off and holidays are taken out: a weekend gives no check, and a day off gives a check that is short, with the day off as its reason. The core window is the exception: it runs for everyone on every day it names, because everyone must cover it. [docs/method.md](docs/method.md) gives every step.

## How the time is counted

Each shift is written in local time and turned into a moment of UTC with the offset that the zone has at that moment, read from `Intl.DateTimeFormat(...).formatToParts`. The shared time of a check is the overlap of those moments, cut to the window of the check: the calendar day of `dayZone` for the two overlap rules, and the window itself for `core-window`. A day of `dayZone` lasts 23 or 25 hours on the days its clocks move, and a shift on such a night is an hour shorter or longer than its clock times say.

Two local times need a rule of their own:

| Local time | Example | Read as |
| --- | --- | --- |
| skipped when the clocks move forward | 02:30 on the night Berlin moves from UTC+01:00 to UTC+02:00 | the same time on the clock before the change: 01:30Z, which is 03:30 on the new clock |
| repeated when the clocks move back | 02:30 on the night Berlin moves from UTC+02:00 to UTC+01:00 | the first of the two: 00:30Z |

A shift with such a time gets a note in the report. Why a short check is short:

| Reason | When |
| --- | --- |
| day off, holiday | a person of the check has one on a local day whose shift falls inside the window of the check |
| clock change | the check meets the rule when every zone of the check is put on its lowest offset of the half year on each side (its standard time), and a zone of the check is ahead of that offset on the day |
| the working hours | none of the above |

## The team file

[docs/inputs.md](docs/inputs.md) has every key. The team file of the example is [examples/team.json](examples/team.json):

```json
{
  "name": "Example product team",
  "dayZone": "Europe/Berlin",
  "people": [
    {
      "name": "Anke",
      "zone": "Europe/Berlin",
      "hours": { "mon-fri": ["09:00-17:30"] }
    },
    {
      "name": "Ben",
      "zone": "America/New_York",
      "hours": { "mon-fri": ["07:30-12:00", "13:00-16:00"] }
    },
    {
      "name": "Caio",
      "zone": "America/Sao_Paulo",
      "hours": { "mon-fri": ["08:30-11:30", "12:30-17:30"] }
    },
    {
      "name": "Dina",
      "zone": "Europe/Lisbon",
      "hours": { "mon-fri": ["09:00-13:00", "14:00-18:00"] },
      "daysOff": [15]
    }
  ],
  "holidays": [
    { "name": "Spring holiday", "days": [32], "people": ["Anke", "Dina"] }
  ],
  "rules": {
    "anchorOverlap": { "anchor": ["Anke"], "minMinutes": 240 },
    "coreWindow": { "zone": "Europe/Berlin", "start": "16:30", "end": "17:30", "days": ["mon-fri"] }
  }
}
```

`people` and one rule are needed, and `dayZone` with `pairOverlap` or `anchorOverlap`. Hours are keyed by a day of the week (`mon` to `sun`) or a range such as `mon-fri`; a shift across midnight is written as two shifts, one ending at `24:00`. A key the tool does not know stops the run, with its line and a suggestion. There are no defaults that change a result.

## Dates

The tool reads no clock. The first day of the range is always given with `--from`, as a date `YYYY-MM-DD` or as a day number, and the length with `--days`. A day off or a holiday is a date, or a whole number of days from the first day of the range (`0` is the first day). With `--day-labels offset` the reports write each day as `day 7 (Mon)` and each moment outside its own day as `day 8 00:30Z`, so a report holds no date at all. The example uses both, so no file of the repository holds a date; [the decision](docs/decisions/0001-read-no-clock-and-keep-dates-out-of-the-repository.md) explains why.

## Privacy

The team file holds display names, time zones and working hours, and the days off of each person. It needs no email address, and a name that holds an `@` is refused. Days off are shown as days off, with no reason given. The tool writes nothing to disk except the report that `--out` names, and refuses an `--out` path that is the team file. [docs/secure-defaults.md](docs/secure-defaults.md) explains the defaults and what to think about before a report is posted; [docs/threat-model.md](docs/threat-model.md) lists the risks and their controls.

## Formats

- `text`: for a terminal: what was read, the clock changes and absences in the range, the counts, every check that is short with its reasons, every day with every number, the notes and the result. With `--explain` also the moments in UTC behind each number and the sentences the rules rest on.
- `markdown`: the same for a ticket or a job summary, with the people, the short checks and every day as tables. Pipes, square brackets, backticks, asterisks, underscores, line breaks and angle brackets from the input are escaped, and a cell that starts with `=`, `+`, `-` or `@` gets a leading apostrophe.
- `json`: the whole report: the team, the range, the people, the rules, the clock changes, the absences, the totals, every short check, every day with every check, the notes and the verdict.

## Exit codes

`0`: every check on every day meets the rules. `1`: at least one check is short. `2`: a usage or input error: an option missing or given twice, an unknown option, a team file that cannot be read, a key the tool does not know or named twice, an unknown time zone or a UTC offset, a shift that ends before it starts or overlaps another, a rule with no number, a range past the last day the tool reads, more checks than the limit, or a range in which no check runs. With exit code `2` the tool gives no verdict and prints the problems on standard error.

## Architecture

Plain ES modules in `src/`, with no dependencies.

| File | Job |
| --- | --- |
| `src/cli.js` | the command line, the usage and the exit codes |
| `src/check.js` | reads the team file, runs the checks and builds the report |
| `src/config.js` | validates the team file against the known keys and builds its normal form |
| `src/zones.js` | time zone names, offsets from Intl, local times to UTC with the rule for skipped and repeated times, clock changes |
| `src/overlap.js` | the working time of each person in a window, the checks of each rule, and the reasons |
| `src/intervals.js` | lists of moments: join, overlap, cut, length |
| `src/days.js` | days and dates without a clock, and the labels |
| `src/rules.js` | the three rules and the reasons, with the sentences they rest on |
| `src/json.js` | the strict JSON reader |
| `src/files.js` | bounded reading of the team file, and the one write of `--out` |
| `src/report.js`, `src/text.js`, `src/size.js` | the reports, the cleaning of text from the input, number formats |
| `src/data.js` | the sentences the tool rests on, compared with the saved pages in `research/sources` |
| `tools/check.mjs`, `tools/example.mjs` | the repository checks, and the example with its real output |

## Where the facts come from

| Fact | Source |
| --- | --- |
| How Intl resolves a time zone name, refuses an unknown one and lists the primary names | ECMA-402, the ECMAScript Internationalization API Specification, https://tc39.es/ecma402/ |
| What the time zone database holds and what a time zone name is | IANA, https://www.iana.org/time-zones and https://www.iana.org/time-zones/theory |
| Comparing in UTC, and the form of a date | RFC 3339, https://www.rfc-editor.org/rfc/rfc3339.txt |
| Repeated names in a JSON object | RFC 8259, https://www.rfc-editor.org/rfc/rfc8259 |

[docs/rules-and-sources.md](docs/rules-and-sources.md) lists every quoted sentence with the saved page it comes from.

## Limits

The tool compares the working hours it is given. It cannot see meetings, people who work outside their hours, sick days that are not in the file, or whether shared time is used. The offsets come from the time zone data of the Node that runs it, so a Node with older data gives other results for a zone whose rules changed. "Standard time" is the lowest offset of a zone within half a year on each side of a day, which is not right for a zone that changed its offset for good within that time. [docs/limits.md](docs/limits.md) lists these, with the size limits.

## Background

Teams that add engineers from nearby countries usually plan around a few shared hours a day, and those hours move whenever two of the countries change their clocks on different weekends. How such teams are put together is described on the page [Nearshore Staff Augmentation Services](https://innerluxes.dev/software-development/nearshore/staff-augmentation).

## License

MIT
