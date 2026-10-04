# Contributing

Every change goes through a pull request and is reviewed before it is merged. The pipeline runs the tests on Linux, Windows and macOS with Node 22 and 24, the tests with coverage, the repository checks, CodeQL, and a secure development check of the repository itself.

Commit messages in this repository follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`, with `!` for a breaking change.

## Changing a rule or a reason

1. Describe the change in docs/method.md first: what the rule checks, in which window, when a check runs, and what it can and cannot see. Where the tool makes its own choice, say so and say why.
2. The tool has no threshold of its own, and a change must not add one. Every number a rule compares must come from the team file.
3. A run must never pass with nothing checked, and an input that cannot be read stops the run with exit code `2`.
4. Add a test with the team written inline (`person()`, `teamWith()` and `reportOf()` in test/helpers.js build them), small enough that the result can be worked out by hand, with a near miss on each side of the limit.
5. A rule id, once released, keeps its meaning: pipelines and other tools read it from the JSON report.

## Changing the time zone math

1. Intl is the only source of offsets. Never add a copy of the time zone database, a table of offsets or a rule of a country.
2. Every Intl call passes a time zone, a moment and the locale `en-US`, and `Intl.DateTimeFormat` stays in src/zones.js. ECMA-402 reads the zone of the machine without a time zone, and the clock without a moment.
3. Time zones fail closed. A name that Intl does not know, a primary name that `Intl.supportedValuesOf('timeZone')` does not list, and a UTC offset stop the run; there is no fallback.
4. The rule for local times that the clocks skip or repeat is written in docs/method.md; a change to it changes that text and the tests of both nights.
5. A test that needs a clock change finds its day with `changeDay()` of test/helpers.js, by asking Intl, and never holds the date of a clock change. `test/days.test.js` runs the example under other time zones and locales in child processes.

## Changing the team file

1. A new key is added to `KEYS`, `PERSON_KEYS` or `HOLIDAY_KEYS` in src/config.js, documented in docs/inputs.md, and tested with a good value and a bad one. Every key the tool does not know stays an error, and an object that names a key twice stays refused.
2. A number is a whole number, checked for its range.
3. People stay named by a display name. Never add a field for an email address or for the reason of an absence.

## Changing a reader

1. The tool reads; it never runs. A reader must not fetch anything a file names, follow anything but own properties, or build a pattern from the input.
2. Keep the work bounded: the limits of docs/limits.md, and a hostile test with a large input and a time check.
3. A time check in a test widens under coverage: read `process.env.NODE_V8_COVERAGE`, which the test runner sets only when coverage is on, and allow four times the time. Never read the flags of the process for this, because they hold the coverage flags of the runner in every run. Run `npm run test:coverage` before you open the pull request.
4. A team file written with LF and with CRLF line ends must give the same report. The example input is stored as written (`.gitattributes`), and a test reads it both ways.
5. Paths are opened with `path.resolve`. Paths shown in a report are relative, with forward slashes.

## Tests that depend on the system

A test that depends on the operating system (a symbolic link, a device) is guarded with `process.platform`, says why in its `t.skip`, and asserts no line or column of its own: a line or column is asserted only in a test that runs on every system, and is worked out there with `lineOf()` of test/helpers.js or from the text itself, never written by hand. `test/repo.test.js` fails when a guarded test asserts a line or a column. Every other test builds its paths with `resolve()` from names with forward slashes.

A test never reads the clock and never holds a date: it builds a date from a day number with `isoDay()` of test/helpers.js.

## Personal data

Never commit a real team file, even as a fixture. Examples and tests use made-up first names.

## Rules for the code

- No runtime dependencies. Node 22 or newer and nothing else.
- The tool reads the team file it is given and writes only to the screen or to the file `--out` names. It opens no network connection, runs no program and reads no clock.
- Text from the input goes through `safeText` before it reaches a report, a note or an error message.
- Source files stay ASCII; write any other character as a Unicode escape, or build it from its code point.
- Never commit a real secret, even as a fixture. `npm run check` fails on anything that looks like a credential.
- No file carries a date, and no file holds a number that reads like a year. Version numbers (Node 22, 1.0.0), the numbers of a standard (RFC 3339, ECMA-402) and day numbers such as 20514 are fine.

## Before you open the pull request

```
npm test
npm run test:coverage
npm run check
npm run example
```
