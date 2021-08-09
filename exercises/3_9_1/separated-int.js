// @ts-check

// 3.9.1 (b)
// Regex for integers where every 3 digits are separated by commas.

import test from "../utils/test.js"
import { assertEachMatches, assertEachDoesNotMatch } from "../utils/assert.js"

const sepIntPattern = /^[0-9]{1,3}(,[0-9]{3})*$/

test("matches separated ints", () => {
  assertEachMatches(["78", "1,092", "00,000", "692,098,000"], sepIntPattern)
})

test("doesn't match non-separated ints", () => {
  assertEachDoesNotMatch(["78", "10,92", "692098000"], sepIntPattern)
})
