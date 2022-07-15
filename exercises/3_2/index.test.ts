// Ch 3 ex 2
// Regex for a string containing any number of X
// and single pairs of < > and { } which may be nested
// but not interleaved.

import { rx } from "verbose-regexp";
import { expect, test } from "vitest";

const pattern = rx`
  ^(
    X
    |\{(X|<X*>)*\} // Any number of Xs or < then Xs then > in {}
    |<(X|\{X*\})*> // Any number of Xs or { then Xs then } in <>
  )*$
`;

/^(X*|\{X*<X*>|\{X*\})$/;

test("matches the pattern", () => {
  const strings = ["XXX<XX{X}XXX>X", "X{X}X<X>X{X}X<X>X", "XXX"];
  for (const s of strings) {
    expect(s).toMatch(pattern);
  }
});

test("doesn't match the pattern", () => {
  const strings = ["XXX<X<XX>>XX", "XX<XX{XX>XX}XX"];
  for (const s of strings) {
    expect(s).not.toMatch(pattern);
  }
});
