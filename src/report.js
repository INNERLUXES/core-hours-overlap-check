// The three reports: text for a terminal, Markdown for a ticket or a job summary, and JSON for other tools. Every text
// from the input (a name, a holiday) was cleaned by safeText before it reached the report. The Markdown report also
// escapes each cell, so a value cannot break a table, make a link or be read as HTML, and a cell that starts with =, +,
// -, @, a tab or a carriage return gets a leading apostrophe, so a spreadsheet that the table is pasted into does not
// read it as a formula. The reports hold no clock time, and with --day-labels offset no date.

import { grouped, plural } from './size.js';

const FORMULA_START = new Set(['=', '+', '-', '@', '\t', '\r']);

// A cell that a spreadsheet would read as a formula, with a leading apostrophe.
export function guardFormula(t) {
  const s = String(t);
  return s.length && FORMULA_START.has(s[0]) ? `'${s}` : s;
}

export function mdCell(t) {
  return guardFormula(String(t))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/[[\]`*_]/g, (c) => `\\${c}`)
    .replace(/\r?\n|\r/g, ' ');
}

const head = (r) => `${r.team.file}${r.team.name ? ` (${r.team.name})` : ''}`;
const rangeLine = (r) => `${plural(r.range.days, 'day')}, ${r.range.first} to ${r.range.last}${r.dayZone ? `; days counted in ${r.dayZone}` : ''}`;
const resultsLine = (r) => `${plural(r.totals.checks, 'check')} on ${plural(r.totals.daysWithChecks, 'day')}: ${grouped(r.totals.met)} met, ${grouped(r.totals.short)} short${r.totals.short ? ` on ${plural(r.totals.shortDays, 'day')}` : ''}`;
const changeText = (c) => `${c.zone} from ${c.before} to ${c.after} on ${c.label}`;
const cellOf = (c) => `${c.minutes}${c.met ? '' : '*'}`;

// The checks of a day as one line: each rule with the shared minutes of each check, a star after a check that is short.
function dayLine(d) {
  const byRule = [];
  for (const c of d.checks) {
    let entry = byRule.find((e) => e.rule === c.rule);
    if (!entry) {
      entry = { rule: c.rule, cells: [] };
      byRule.push(entry);
    }
    entry.cells.push(`${c.short} ${cellOf(c)}`);
  }
  return byRule.length ? byRule.map((e) => `${e.rule} ${e.cells.join(', ')}`).join('; ') : 'no check';
}

// Pads the columns of a table of text to their widths.
function table(rows, indent = '  ') {
  const widths = rows[0].map((_, i) => Math.min(40, Math.max(...rows.map((row) => String(row[i]).length))));
  return rows.map((row) => `${indent}${row.map((cell, i) => (i === row.length - 1 ? String(cell) : String(cell).padEnd(widths[i]))).join('  ')}`.trimEnd());
}

export function toText(r, { explain = false } = {}) {
  const out = [];
  out.push(`core-hours-overlap-check: ${head(r)}`);
  out.push(`range: ${rangeLine(r)}`);
  out.push(`people: ${plural(r.people.length, 'person', 'people')} in ${plural(new Set(r.people.map((p) => p.zone)).size, 'time zone')}`);
  for (const line of table(r.people.map((p) => [p.name, p.zone, p.hours]), '  ')) out.push(line);
  r.rules.forEach((x, i) => out.push(`${i === 0 ? 'rules: ' : '       '}${x.id}: ${x.text}`));
  out.push(`clock changes: ${r.clockChanges.length ? r.clockChanges.map(changeText).join('; ') : 'none in the range'}`);
  out.push(`absences: ${r.absences.length ? r.absences.map((a) => a.text).join('; ') : 'none in the range'}`);
  out.push(`results: ${resultsLine(r)}`);
  out.push('', `Short of the rules (${grouped(r.failures.length)})`, '');
  if (!r.failures.length) out.push('  none', '');
  let lastDay = null;
  const width = Math.max(0, ...r.failures.map((f) => f.rule.length));
  for (const f of r.failures) {
    if (f.day !== lastDay) {
      if (lastDay !== null) out.push('');
      out.push(`  ${f.label}`);
      lastDay = f.day;
    }
    out.push(`    ${f.rule.padEnd(width)}  ${f.who}: ${f.minutes} minutes, ${f.need} needed`);
    for (const reason of f.reasons) out.push(`    ${' '.repeat(width)}  ${reason.text}`);
  }
  if (r.failures.length) out.push('');
  out.push('Every day (shared minutes; * short of the rule)', '');
  const labelWidth = Math.max(...r.days.map((d) => d.label.length));
  for (const d of r.days) {
    out.push(`  ${d.label.padEnd(labelWidth)}  ${dayLine(d)}`);
    if (explain) {
      for (const c of d.checks) {
        out.push(`    ${c.rule} ${c.who}: ${c.minutes} minutes, ${c.need} needed${c.met ? '' : ', short'}`);
        for (const l of c.explain) out.push(`      ${l}`);
      }
    }
  }
  out.push('');
  if (explain && r.basis.length) {
    out.push('Basis', '');
    for (const b of r.basis) out.push(`  "${b.text}" (${b.section}, ${b.page})`);
    out.push('');
  }
  for (const n of r.notes) out.push(`note: ${n}`);
  if (r.notes.length) out.push('');
  out.push(`RESULT: ${r.verdict.text}`);
  return `${out.join('\n')}\n`;
}

export function toMarkdown(r, { explain = false } = {}) {
  const lines = [`## core-hours-overlap-check: ${r.verdict.text}`, ''];
  lines.push(`- Team: ${mdCell(head(r))}`);
  lines.push(`- Range: ${mdCell(rangeLine(r))}`);
  for (const x of r.rules) lines.push(`- Rule ${x.id}: ${mdCell(x.text)}`);
  lines.push(`- Clock changes: ${r.clockChanges.length ? mdCell(r.clockChanges.map(changeText).join('; ')) : 'none in the range'}`);
  lines.push(`- Absences: ${r.absences.length ? mdCell(r.absences.map((a) => a.text).join('; ')) : 'none in the range'}`);
  lines.push(`- Results: ${mdCell(resultsLine(r))}`);
  lines.push('', '### People', '', '| Person | Time zone | Working hours (local time) |', '| --- | --- | --- |');
  for (const p of r.people) lines.push(`| ${mdCell(p.name)} | ${mdCell(p.zone)} | ${mdCell(p.hours)} |`);
  lines.push('', '### Short of the rules', '');
  if (r.failures.length) {
    lines.push('| Day | Rule | Who | Shared minutes | Needed | Reasons |', '| --- | --- | --- | --- | --- | --- |');
    for (const f of r.failures) lines.push(`| ${mdCell(f.label)} | ${f.rule} | ${mdCell(f.who)} | ${f.minutes} | ${f.need} | ${mdCell(f.reasons.map((x) => x.text).join('; '))} |`);
  } else lines.push('None.');
  const columns = [];
  for (const d of r.days) for (const c of d.checks) if (!columns.some((k) => k.rule === c.rule && k.short === c.short)) columns.push({ rule: c.rule, short: c.short });
  lines.push('', '### Every day', '', 'Shared minutes; a star marks a check that is short of its rule, and a dash a check that does not run that day.', '');
  lines.push(`| Day | ${columns.map((k) => mdCell(`${k.rule} ${k.short}`)).join(' | ')} |`, `| --- | ${columns.map(() => '---').join(' | ')} |`);
  for (const d of r.days) {
    const cells = columns.map((k) => {
      const c = d.checks.find((x) => x.rule === k.rule && x.short === k.short);
      return c ? (c.met ? String(c.minutes) : `**${c.minutes}\\***`) : '-';
    });
    lines.push(`| ${mdCell(d.label)} | ${cells.join(' | ')} |`);
  }
  if (explain) {
    lines.push('', '### The moments behind each number', '', 'All times are in UTC.');
    for (const d of r.days) {
      if (!d.checks.length) continue;
      lines.push('', `#### ${mdCell(d.label)}`, '');
      for (const c of d.checks) lines.push(`- ${c.rule} ${mdCell(c.who)}: ${c.minutes} minutes, ${c.need} needed${c.met ? '' : ', short'}. ${c.explain.map(mdCell).join('. ')}`);
    }
    if (r.basis.length) {
      lines.push('', '### Basis', '');
      for (const b of r.basis) lines.push(`- ${mdCell(`"${b.text}" (${b.section}, ${b.page})`)}`);
    }
  }
  if (r.notes.length) {
    lines.push('', '### Notes', '');
    for (const n of r.notes) lines.push(`- ${mdCell(n)}`);
  }
  return `${lines.join('\n')}\n`;
}

export function toJson(r, { explain = false } = {}) {
  const out = {
    ...r,
    basis: explain ? r.basis : undefined,
    days: r.days.map((d) => ({ ...d, checks: d.checks.map((c) => (explain ? c : { ...c, explain: undefined })) }))
  };
  return `${JSON.stringify(out, null, 2)}\n`;
}
