// @ts-check

import { match, doesNotMatch } from "assert"

/**
 * Assert that each string in `strings` matches the given regex pattern.
 * @param {Array<string>} strings
 * @param {RegExp} pattern
 */
function assertEachMatches(strings, pattern) {
  strings.forEach((s) => {
    match(s, pattern, `"${s}" doesn't match pattern ${pattern}.`)
  })
}

/**
 * Assert that each string in `strings` doesn't match the given regex pattern.
 * @param {Array<string>} strings
 * @param {RegExp} pattern
 */
function assertEachDoesNotMatch(strings, pattern) {
  strings.forEach((s) => {
    doesNotMatch(s, pattern, `Matches: ${s}`)
  })
}

export { assertEachMatches, assertEachDoesNotMatch }
