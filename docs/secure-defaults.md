# Secure defaults

The default run is the safe run. Nothing in the first two sections needs a flag, and none of it can be switched off. The rest of the document is about what the tool cannot do for you: where the team file comes from, where a report goes, and who may change the team file.

## How the tool behaves by default

- **No clock, no machine settings.** The tool reads no clock: the first day of the range is always given with `--from`. It passes a time zone and a moment to every Intl call, so the zone and the locale of the machine never enter a result. A test runs the example under four time zones and locales and compares the reports.
- **No threshold of its own.** Every number a rule compares comes from the team file. A rule the file does not state is not run, a file with no rule is refused, and a rule that is stated needs every one of its numbers.
- **Unknown keys are errors.** A key the tool does not know stops the run, with its line and a suggestion, so a typo cannot switch a rule off. A key named twice stops the run.
- **Fail closed on time zones.** A name that Intl does not know, a name whose primary name `Intl.supportedValuesOf('timeZone')` does not list, and a bare UTC offset stop the run. The tool never falls back to UTC or to the zone of the machine.
- **Fail closed on hours.** A shift that ends before it starts, crosses midnight in one piece or overlaps another stops the run. A range in which no check runs gives no verdict instead of a pass.
- **Bounded work.** The team file, the people, the shifts, the days off, the holidays, the range and the number of checks have limits (docs/limits.md); the offsets of a zone are read once a day and kept, so the work grows with the days and the checks, not with the calls to Intl.
- **No regular expression from the input.** No pattern is built from the team file.
- **No prototype tricks.** JSON objects are built with own properties, people are kept in maps and lists, so a name such as `__proto__` is just a name.
- **Clean output.** Names and holidays with control characters, direction controls or line separators are refused; every text from the file is cleaned and capped before it reaches a report or an error message. Markdown cells escape pipes, backslashes, square brackets, backticks, asterisks, underscores, line breaks and `<`, `>` and `&`, and a cell that starts with `=`, `+`, `-`, `@`, a tab or a carriage return gets a leading apostrophe, so a table pasted into a spreadsheet is not read as a formula.
- **No network, no programs.** The tool opens no network connection, refuses an argument that looks like an address, starts no program and evaluates nothing it reads.
- **No dependencies.** Node 22 or newer and nothing else.

## Personal data

The team file says where people live, by their time zone, when they work and when they are away. That is personal data, and the tool keeps it small:

- **Names only.** People are named by a display name. A name that holds an `@` is refused, because the tool needs no email address. A first name or a role is enough.
- **No reason for an absence.** A day off is a day off. The file has no field for why, and the reports say nothing more.
- **Only what the rules need.** The reports show the names, the zones, the hours and the days that matter to a rule, and nothing else is read.
- **Nothing is written to disk but the report that `--out` names.** The tool keeps no cache, no history and no temporary file. With `--out` the file is created for its owner only where the system has file permissions, and the team file itself is refused as an `--out` path.

Before you run it and post a report:

- Keep the team file where the team can read it and agree with it; it describes their working days.
- Post the report where the team reads it. A short day names a person and, with a day off or a holiday, says that they were away.
- Prefer `--day-labels offset` for a report that is kept a long time or shared widely: it says what happened on which day of the range without fixing the dates.

## The pipeline

- **Pin Node.** The offsets come from the time zone data built into Node. A pipeline that runs the check on a fixed Node version gives the same report for the same file; a new Node can change the results for a zone whose rules changed.
- **Give `--from` from the pipeline.** The tool reads no clock; the pipeline decides which days are checked and writes them in the command.
- **Review the team file.** Whoever can change the team file can change the rules and the hours. Keep it under review like code.

## Secure development

The repository follows the practices of NIST SP 800-218, the Secure Software Development Framework: every change goes through review with CODEOWNERS, CI runs the tests on three systems and two Node versions, CodeQL scans the code, Dependabot watches the pinned actions, every action is pinned to a commit, and a release is packed only after the SSDF check of the repository passes, with a CycloneDX SBOM, SHA-256 checksums and a build provenance attestation.
