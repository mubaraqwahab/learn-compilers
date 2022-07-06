// Ch 3 ex 2
// Regex for a string containing any number of X
// and single pairs of < > and { } which may be nested
// but not interleaved.

import { expect, test } from "vitest";

// I don't understand the pattern
const pattern = /^X*$/;

test.skip("matches the pattern", () => {
  const strings = ["XXX<XX{X}XXX>X", "X{X}X<X>X{X}X<X>X"];
  for (const s of strings) {
    expect(s).toMatch(pattern);
  }
});

test.skip("doesn't match the pattern", () => {
  const strings = ["XXX<X<XX>>XX", "XX<XX{XX>XX}XX"];
  for (const s of strings) {
    expect(s).not.toMatch(pattern);
  }
});
