# Inputs

The tool reads one file, the team file, and the range of days from the command line. This document lists every key of the team file, what it may hold, and what is refused.

## The command line

| Option | Holds |
| --- | --- |
| `--team <file>` | the team file, JSON in UTF-8, at most 1 MB |
| `--from <day>` | the first day of the range: a date `YYYY-MM-DD` that is a real calendar day, or a day number, the whole days since the Unix epoch; required |
| `--days <n>` | the number of days of the range, a whole number from 1 to 1,000; required |
| `--day-labels <kind>` | `date` or `offset`; how the reports write a day (docs/method.md, Labels) |
| `--format <name>` | `text`, `markdown` or `json` |
| `--explain` | adds the moments in UTC behind each number, and the sentences the rules rest on |
| `--out <file>` | writes the report to this file; a path that is the team file is refused |

A day number is useful in a script: the number of whole days since the epoch is the time in seconds divided by 86,400, rounded down.

## The team file

The file is one JSON object, read by a strict reader: no comments, no trailing comma, no key named twice in one object. RFC 8259 says of such an object: "When the names within an object are not unique, the behavior of software that receives such an object is unpredictable." A key the tool does not know stops the run with its line and the nearest known key. Every problem of the file is listed, the first twenty and a count of the rest.

### Top level

| Key | Holds | Needed |
| --- | --- | --- |
| `name` | a name for the team, shown in the reports | no |
| `dayZone` | the time zone whose calendar days the overlap rules count in, such as `Europe/Berlin` | with `pairOverlap` or `anchorOverlap` |
| `people` | the list of people, 1 to 100 | yes |
| `holidays` | the list of holidays, up to 500 | no |
| `rules` | the rules, at least one | yes |

### `people[]`

| Key | Holds | Needed |
| --- | --- | --- |
| `name` | a display name, at most 60 characters, unique without case, with no `@`, no control character, no direction control or line separator, and no white space at either end | yes |
| `zone` | the time zone of the person, an IANA name such as `America/New_York` (docs/method.md, Time zone names) | yes |
| `hours` | the working hours in local time: an object from a day of the week, or a range of days, to a list of shifts | yes |
| `daysOff` | the days off of the person: dates `YYYY-MM-DD`, or whole numbers of days from the first day of the range, each once, up to 1,000 | no |

The keys of `hours` are `mon`, `tue`, `wed`, `thu`, `fri`, `sat` and `sun`, or a range such as `mon-fri` or `sat-sun` that runs forward from Monday to Sunday; a range that wraps, such as `fri-mon`, is refused. Each day is named once. A day that is not named has no working hours.

A shift is `HH:MM-HH:MM`, from `00:00` to `24:00`, ending after it starts. Two or more shifts on one day are a split shift, up to six; they may touch but not overlap. A shift across midnight is written as two shifts, one ending at `24:00` and one starting at `00:00` on the next day.

### `holidays[]`

| Key | Holds | Needed |
| --- | --- | --- |
| `name` | the name of the holiday, shown in the reasons | yes |
| `days` | its days: dates or whole numbers of days from the first day of the range, each once | yes |
| `people` | the people who have it, by name (compared without case) | yes |

A holiday is a local day of each of its people, in the person's own zone, exactly like a day off.

### Days as numbers

A day of `daysOff` or `holidays[].days` written as a number counts from the first day of the range given with `--from`: `0` is the first day, `15` the sixteenth, `-1` the day before the range. It is a whole number from -3,660 to 3,660. A team file written this way holds no date, and moves with `--from`; a team file with dates stays fixed. Days outside the range are counted in a note.

### `rules`

| Key | Holds |
| --- | --- |
| `rules.pairOverlap` | the rule `pair-overlap` |
| `rules.pairOverlap.minMinutes` | the shared minutes every two people need on each day both work, 1 to 1,440 |
| `rules.anchorOverlap` | the rule `anchor-overlap` |
| `rules.anchorOverlap.anchor` | the anchor people, by name; at least one person must be left to compare |
| `rules.anchorOverlap.minMinutes` | the shared minutes every other person needs with the anchors, 1 to 1,440 |
| `rules.coreWindow` | the rule `core-window` |
| `rules.coreWindow.zone` | the time zone of the window |
| `rules.coreWindow.start` | the start of the window, `HH:MM` |
| `rules.coreWindow.end` | the end of the window, `HH:MM` up to `24:00`, after the start |
| `rules.coreWindow.days` | the days of the week the window applies to, as in `hours`: `["mon-fri"]` |

Each rule that is stated needs all its keys. There is no default for any number, and a file that states no rule is refused, because a check with no rule would always pass. `pairOverlap` needs two people at least.

## What is refused

- a file that is not UTF-8 text, that holds a null byte, or that is larger than 1 MB;
- JSON that RFC 8259 does not allow, a key named twice in one object, values nested more than 32 deep, more than 100,000 values or a string longer than 4,096 characters;
- an unknown key, a missing key, a value of the wrong kind;
- a time zone name that is not written as a name, a UTC offset, a name Intl does not know, or a name whose primary name `Intl.supportedValuesOf('timeZone')` does not list;
- a shift that is not `HH:MM-HH:MM`, ends before it starts or after `24:00`, or overlaps another shift of the day;
- a day that is neither a real date nor a whole number of days within the limit, or a day named twice in one list;
- a holiday or an anchor that names a person who is not in the team;
- a range that ends after the last day of the four-digit years, a team and range that give more than 200,000 checks, and a range in which no check runs.

With any of these the run stops with exit code `2`, no verdict and the problems on standard error.
