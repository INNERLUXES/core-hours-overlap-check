// Command line: core-hours-overlap-check --team <file> --from <day> --days <n> [options]

import { readFileSync } from 'node:fs';
import { InputError, checkPaths } from './check.js';
import { writeReport } from './files.js';
import { toText, toMarkdown, toJson } from './report.js';
import { RULES } from './rules.js';
import { DAY_LIMITS, readDays, readFrom } from './days.js';
import { safeText } from './text.js';

export const VERSION = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

const FORMATS = { text: toText, markdown: toMarkdown, json: toJson };
const LABELS = ['date', 'offset'];

export const USAGE = `Usage: core-hours-overlap-check --team <file> --from <day> --days <n> [options]

Computes the working time a team spread over time zones really shares, day by day, and lists the days when it falls
short of what the team agreed: the weeks when one country has changed its clocks and another has not yet, the days
off and the holidays of the team file, and plain gaps in the working hours. Time zones come from the Intl API of
Node; the tool carries no copy of the time zone database. It reads no clock, opens no network connection and writes
nothing to disk but the file --out names. People are named by a display name only.

Options:
  --team <file>             the team file (JSON): people, time zones, working hours, days off, holidays, rules;
                            required
  --from <day>              the first day of the range: a date YYYY-MM-DD, or a day number (whole days since the
                            Unix epoch); required, because the tool reads no clock
  --days <n>                the number of days of the range, 1 to ${DAY_LIMITS.maxDays}; required
  --day-labels <kind>       date (YYYY-MM-DD) or offset (day 0 is the first day of the range) (default: date)
  --format <name>           text, markdown or json (default: text)
  --explain                 show the moments in UTC behind each number, and the sentences the rules rest on
  --out <file>              write the report to this file instead of the screen
  --help                    show this text
  --version                 show the version

Rules: ${RULES.map((r) => `${r.id} (rules.${r.key})`).join(', ')}.

Exit codes: 0 every check meets the rules, 1 a check on some day is short of its rule, 2 usage or input error.
`;

const isUrl = (f) => /^[a-z][a-z0-9+.-]*:\/\//i.test(f);

export function parseArgs(argv) {
  const o = { team: null, from: null, days: null, labels: null, format: null, explain: false, out: null, help: false, version: false };
  const once = (name, current, value) => {
    if (current !== null) throw new Error(`${name} was given twice`);
    return value;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => {
      const v = argv[i + 1];
      if (v === undefined || (v.startsWith('--') && v.length > 2)) throw new Error(`${a} needs a value`);
      if (v === '-') throw new Error('reading from standard input is not supported; give a file');
      i += 1;
      return v;
    };
    if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--version' || a === '-v') o.version = true;
    else if (a === '--explain') o.explain = true;
    else if (a === '--team') o.team = once(a, o.team, next());
    else if (a === '--from') o.from = once(a, o.from, next());
    else if (a === '--days') o.days = once(a, o.days, next());
    else if (a === '--day-labels') o.labels = once(a, o.labels, next());
    else if (a === '--format') o.format = once(a, o.format, next());
    else if (a === '--out') o.out = once(a, o.out, next());
    else if (a === '-') throw new Error('reading from standard input is not supported; give a file');
    else if (a.startsWith('-')) throw new Error(`unknown argument ${a}`);
    else throw new Error(`unexpected argument ${a}; give the team file with --team ${a}`);
  }
  if (!o.help && !o.version) {
    if (!o.team) throw new Error('give the team file with --team <file>');
    if (o.from === null) throw new Error('give the first day with --from YYYY-MM-DD or a day number; the tool reads no clock');
    if (o.days === null) throw new Error('give the number of days with --days <n>');
    for (const p of [o.team, o.out].filter(Boolean)) if (isUrl(p)) throw new Error('give a local path; the tool never fetches a URL');
    const from = readFrom(o.from);
    if (from === null) throw new Error(`--from ${o.from} is not a date written YYYY-MM-DD or a day number from 0 to ${DAY_LIMITS.maxDay}`);
    o.from = from;
    const days = readDays(o.days);
    if (days === null) throw new Error(`--days ${o.days} is not a whole number from 1 to ${DAY_LIMITS.maxDays}`);
    o.days = days;
    o.labels ??= 'date';
    if (!LABELS.includes(o.labels)) throw new Error(`unknown day labels ${o.labels} (date or offset)`);
    o.format ??= 'text';
    if (!Object.hasOwn(FORMATS, o.format)) throw new Error(`unknown format ${o.format} (text, markdown or json)`);
  }
  return o;
}

const clean = (text) => safeText(text, 1500);

// Exit code: 0 every check meets the rules, 1 a check is short of its rule, 2 usage or input error.
export async function main(argv, io = { out: (t) => process.stdout.write(t), err: (t) => process.stderr.write(t) }, limits = undefined, base = process.cwd()) {
  let o;
  try {
    o = parseArgs(argv);
  } catch (error) {
    io.err(`core-hours-overlap-check: ${clean(error.message)}\n\n${USAGE}`);
    return 2;
  }
  if (o.help) {
    io.out(USAGE);
    return 0;
  }
  if (o.version) {
    io.out(`${VERSION}\n`);
    return 0;
  }
  let report;
  try {
    report = await checkPaths({ team: o.team, from: o.from, count: o.days, labels: o.labels, version: VERSION, limits, base });
  } catch (error) {
    if (error instanceof InputError) io.err(`core-hours-overlap-check: no verdict, the input has ${error.problems.length === 1 ? 'a problem' : `${error.problems.length} problems`}:\n${error.problems.map((p) => `  ${clean(p)}`).join('\n')}\n`);
    else io.err(`core-hours-overlap-check: ${clean(error.message)}\n`);
    return 2;
  }
  const text = FORMATS[o.format](report, { explain: o.explain });
  if (o.out) {
    try {
      const shown = await writeReport(o.out, text, base, [o.team]);
      io.err(`core-hours-overlap-check: the report is in ${clean(shown)}; ${report.verdict.text}\n`);
    } catch (error) {
      io.err(`core-hours-overlap-check: ${clean(error.message)}\n`);
      return 2;
    }
  } else io.out(text);
  return report.verdict.pass ? 0 : 1;
}
