# Security

## Reporting a problem

Write to info@innerluxes.dev with the subject line "core-hours-overlap-check security", or use private vulnerability reporting on this repository. Please do not open a public issue for a vulnerability.

Include a small made-up team file that shows the problem, the command you ran, what you expected and what happened. Use made-up first names, never a real team file, and never a real key, token or password, even a revoked one.

## Scope

In scope:

- an input that makes the tool open a network connection, run a program, load a module or evaluate any part of a file
- an input that makes the tool write a file other than the one `--out` names, or write the report over the team file
- a time zone name that the tool accepts although Intl does not know it, or although `Intl.supportedValuesOf('timeZone')` does not list its primary name, a UTC offset that the tool accepts as a time zone, or a fallback to UTC or to the zone of the machine
- a shared time that is wrong for the offsets Intl gives, a local time that the clocks skip or repeat that is not read by the rule of docs/method.md, or a check that runs or does not run against that document
- a short check given no reason or the wrong one, or a run that passes with nothing checked
- an input that the tool fails to read and passes over without an error, such as an unknown key, a key named twice, a shift across midnight or a day in another form
- an input that makes the tool hang, take very long or use unbounded memory, such as a very large file, JSON nested very deep, very many people, days off or days
- text from an input that breaks a Markdown table, makes a link, is read as a formula when a table is pasted into a spreadsheet, rewrites the terminal through control or direction characters, or is shown unescaped in a report
- a name such as `__proto__` that changes how objects behave inside the tool
- a report that changes with the clock, the time zone or the locale of the machine
- a sentence in src/data.js that differs from the saved page in research/sources

Out of scope: whether the hours in a team file are true, the time zone data of the Node that runs the tool (docs/limits.md lists what the tool cannot see), who may change the team file in your repository, and where your pipeline keeps the reports.

Read [docs/threat-model.md](docs/threat-model.md) for the rest.
