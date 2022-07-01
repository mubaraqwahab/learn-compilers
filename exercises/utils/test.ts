import * as assert from "node:assert/strict";

/**
 * Assert that each string in `strings` matches the given regex pattern.
 */
export function assertEachMatch(strings: string[], pattern: RegExp) {
  strings.forEach((s) => {
    assert.match(s, pattern, `"${s}" doesn't match pattern ${pattern}.`);
  });
}

/**
 * Assert that each string in `strings` doesn't match the given regex pattern.
 */
export function assertEachDoesNotMatch(strings: string[], pattern: RegExp) {
  strings.forEach((s) => {
    assert.doesNotMatch(s, pattern, `Matches: ${s}`);
  });
}

export function assertEachDeepEqual<T>(
  array: unknown[],
  eachExpected: T
): asserts array is T[] {
  for (const actual of array) {
    assert.deepEqual(actual, eachExpected);
  }
}

// Console color codes (see https://stackoverflow.com/a/41407246/12695621)
const color = {
  reset: "\x1b[0m",
  fgGreen: "\x1b[32m",
  fgRed: "\x1b[31m",
};

/**
 * Create a test.
 * The test fails if `fn` throws, but passes otherwise.
 *
 * @example
 * test("2 plus 2 is 4", () => {
 *   assert(2 + 2 === 4, "wrong! 2 + 2 isn't 4")
 * })
 * // ✔ 2 plus 2 is 4
 *
 * test("2 plus 2 is 5", () => {
 *   assert(2 + 2 === 5, "wrong! 2 + 2 isn't 5")
 * })
 * // ✖ 2 plus 2 is 5
 * // AssertionError [ERR_ASSERTION]: wrong! 2 + 2 isn't 5
 */
export async function test(desc: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`${color.fgGreen}✔${color.reset} ${desc}`);
  } catch (e) {
    tsAssertIsError(e);
    console.error(`${color.fgRed}✖${color.reset} ${desc}\n${e.stack}\n`);
    // if (e instanceof Error) {
    //   console.error("\n", e.stack, "\n");
    // }
  }
}

function tsAssertIsError(obj: unknown): asserts obj is Error {}
