// Lists of moments in time: [start, end) pairs in milliseconds of UTC, kept sorted with no two pairs that touch or
// overlap. Every list a function returns has that normal form.

// The normal form of a list of pairs: empty pairs left out, sorted, touching and overlapping pairs joined.
export function normalize(list) {
  const sorted = list.filter(([a, b]) => b > a).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const out = [];
  for (const [a, b] of sorted) {
    const last = out.at(-1);
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  return out;
}

export const union = (...lists) => normalize(lists.flat().map(([a, b]) => [a, b]));

// The moments in both lists, in one pass over each.
export function intersect(x, y) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < x.length && j < y.length) {
    const a = Math.max(x[i][0], y[j][0]);
    const b = Math.min(x[i][1], y[j][1]);
    if (b > a) out.push([a, b]);
    if (x[i][1] < y[j][1]) i += 1;
    else j += 1;
  }
  return out;
}

// The part of a list between two moments.
export const clip = (list, from, to) => intersect(list, to > from ? [[from, to]] : []);

// The length of a list in milliseconds.
export const total = (list) => list.reduce((sum, [a, b]) => sum + (b - a), 0);

// The length of a list in whole minutes, rounded down.
export const minutesOf = (list) => Math.floor(total(list) / 60000);
