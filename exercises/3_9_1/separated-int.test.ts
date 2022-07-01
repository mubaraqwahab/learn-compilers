// 3.9.1 (b)
// Regex for integers where every 3 digits are separated by commas.

import { test, expect } from "vitest";

const sepIntPattern = /^[0-9]{1,3}(,[0-9]{3})*$/;

test("matches separated ints", () => {
  const sepInts = ["78", "1,092", "00,000", "692,098,000"];
  sepInts.forEach((int) => expect(int).toMatch(sepIntPattern));
});

test("doesn't match non-separated ints", () => {
  const nonSepInts = ["78,", "10,92", "692098000"];
  nonSepInts.forEach((int) => expect(int).not.toMatch(sepIntPattern));
});
