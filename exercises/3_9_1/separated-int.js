// @ts-check

// 3.9.1 (b)
// Regex for integers where every 3 digits are separated by commas.

const test = require("../utils/test")
const { assertEachMatches, assertEachDoesNotMatch } = require("../utils/assert")

const sepIntPattern = /^[0-9]{1,3}(,[0-9]{3})*$/

test("matches separated ints", () => {
  assertEachMatches(["78", "1,092", "00,000", "692,098,000"], sepIntPattern)
})

test("doesn't match non-separated ints", () => {
  assertEachDoesNotMatch(["78,", "10,92", "692098000"], sepIntPattern)
})
