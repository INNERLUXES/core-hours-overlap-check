# Changes

## 1.0.0

First release.

- Computes the working time a team spread over time zones really shares, day by day, from a team file with each person's time zone, working hours by day of the week in local time (split shifts allowed), days off and holidays, and lists every day on which a check falls short of the rules the team agreed.
- Three rules, each run only when the team file states it, with every number from the team file: `pair-overlap` (every two people share at least `minMinutes` on each calendar day of `dayZone`), `anchor-overlap` (every other person shares at least `minMinutes` with an anchor person or group), and `core-window` (everyone works a fixed window in one zone on the days it names).
- A reason for every short check: a day off, a holiday, a clock change (the check meets the rule with every zone of the check on its standard time), or the working hours themselves. The report lists the clock changes of every zone in the range.
- Time zone math with the Intl API of Node only, with no copy of the time zone database. Time zone names are checked with `Intl.DateTimeFormat` and `Intl.supportedValuesOf('timeZone')`; an unknown name or a UTC offset stops the run. A local time that the clocks skip is read on the clock before the change, and one they pass twice as the first of the two, with a note in the report.
- The tool reads no clock: the range is given with `--from` (a date or a day number) and `--days`. Days off and holidays are dates or days from the first day of the range. `--day-labels offset` writes each day as its distance from the first day, so a report holds no date. The same file gives the same report under every time zone and locale of the machine.
- Reports as text, Markdown and JSON, with every day and every number; `--explain` shows the moments in UTC behind each number and the sentences the rules rest on. Markdown cells are escaped and guarded against spreadsheet formulas. `--out` writes the report to a file and refuses the team file as its path. Exit code `0` when every check meets the rules, `1` when one is short, `2` for a usage or input error, with no verdict.
- Names only: a name that holds an `@` is refused. A strict JSON reader that refuses a repeated key, and limits on the file, the people, the shifts, the days off, the holidays, the range and the number of checks.
- Every quoted sentence comes from ECMA-402, the IANA time zone pages, RFC 3339 and RFC 8259, saved in `research/sources`; a test compares `src/data.js` and the documents with the saved text.
- Release packages come with a CycloneDX SBOM, SHA-256 checksums and a build provenance attestation, after the SSDF gate of the repository.
