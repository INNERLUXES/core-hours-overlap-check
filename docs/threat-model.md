# Threat model

## What the tool touches

- It reads the team file named on the command line. Nothing else is opened.
- It asks the Intl API of Node for time zone offsets, always with a time zone and a moment.
- It writes the report to the screen, or to the one file `--out` names. It writes nothing else.
- It opens no network connection, evaluates nothing it reads, starts no program and reads no clock.

## What the input may hold

The team file is often kept in a repository and changed by many people: each person may edit their own hours, days off and name. A name is text that anyone with write access chose.

Through the team file, a person can try to:

- move the verdict: a key named twice, an unknown key that looks like a known one, a rule with a missing number, a time zone written as an offset so that it never moves with the clocks, a shift across midnight that would be read as a negative one, a day off written in a form that could be read two ways;
- hide a short day: a range in which no check runs, so that the run passes with nothing checked;
- exhaust the memory or the time: a file of megabytes, JSON nested very deep, a hundred people over a thousand days with the pair rule, thousands of days off;
- rewrite the terminal or break a report: control characters, ANSI escapes, direction controls and line separators in a name or a holiday, and pipes, brackets and angle brackets that a Markdown table would render;
- run a formula: a name that starts with `=`, `+`, `-` or `@`, which a spreadsheet would run when a Markdown table of the report is pasted into it;
- change how objects behave: a name or a key such as `__proto__`, `constructor` or `toString`;
- leak personal data: an email address as a name, a reason for an absence in a holiday name, a report posted where more people read it than the team.

## What could go wrong, and what stops it

| Risk | Control |
| --- | --- |
| A key named twice or an unknown key moves the verdict | The JSON reader refuses a repeated key, as RFC 8259 says the behavior of software that receives one is unpredictable; an unknown key stops the run with its line |
| A rule runs with a number nobody chose | Every rule needs all its numbers; there are no defaults; a file with no rule is refused |
| An unknown zone, or an offset, is read as something else | A name must be written as a name, be known to Intl and have a primary name that `Intl.supportedValuesOf('timeZone')` lists; an offset is refused; there is no fallback to UTC or to the machine |
| A skipped or repeated local time is read two ways | One written rule (docs/method.md), with a note in the report for every shift it touches; tests cover both nights |
| The report changes with the clock, the time zone or the locale of the machine | `--from` is required; every Intl call gets a zone, a moment and the locale `en-US`; a test compares the reports under four time zones and locales; `test/repo.test.js` looks for clock reads in `src` |
| A run passes with nothing checked | A range in which no check runs gives no verdict, exit code `2` |
| The memory or the time is exhausted | The team file has a size limit checked on the open file before it is read; people, shifts, days off, holidays, days and checks are capped, and a run over the cap of checks stops before it starts; offsets are read once a day and kept. Tests check the time, with limits that widen under coverage only |
| A pattern from the input is slow | No regular expression is built from the team file; a test looks for `new RegExp` in src |
| Text from the input rewrites the terminal or breaks a Markdown table | Names with control, direction or line separator characters are refused; every text goes through `safeText`, and Markdown cells escape the characters a table, a link or HTML needs. Tests put ANSI escapes and direction controls in names and holidays |
| A cell is run as a formula | A Markdown cell that starts with `=`, `+`, `-`, `@`, a tab or a carriage return gets a leading apostrophe. A test puts `=HYPERLINK(...)` in a name |
| `__proto__` changes how objects behave | The JSON reader defines own properties; people are kept in lists and maps. A test uses `__proto__`, `constructor` and `toString` as names and keys |
| A device or a link to one named as the team file hangs the tool | The file is opened once, and its type and size are taken from the open handle: a device or a pipe is refused as not a regular file |
| Personal data leaks through a report | Names only, an `@` in a name is refused, absences carry no reason; the reports show only what a rule needs (docs/secure-defaults.md) |
| A report overwrites the team file, or the tool leaves files behind | Only `--out` writes, and the team file is refused as its path; there is no cache or temporary file. A test checks that a run leaves the folder as it was |

## Out of scope

Whether the hours in the team file are true, the time zone data of the Node that runs the tool (docs/limits.md), who may change the team file in your repository, where your pipeline keeps the reports, and the law that applies to the personal data in them.
