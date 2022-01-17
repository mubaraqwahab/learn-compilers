// @ts-check

// 3.9.2
// Regex for a string containing any number of X
// and single pairs of < > and { } which may be nested
// but not interleaved.

import test from "../utils/test.js"
import { assertEachMatches, assertEachDoesNotMatch } from "../utils/assert.js"

// I don't understand the pattern
const pattern = /^X*$/

test("matches the pattern", () => {
  assertEachMatches(["XXX<XX{X}XXX>X", "X{X}X<X>X{X}X<X>X"], pattern)
})

test("doesn't match the pattern", () => {
  assertEachDoesNotMatch(["XXX<X<XX>>XX", "XX<XX{XX>XX}XX"], pattern)
})
