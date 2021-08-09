// @ts-check

// Console color codes (see https://stackoverflow.com/a/41407246/12695621)
const color = {
  reset: "\x1b[0m",
  fgGreen: "\x1b[32m",
  fgRed: "\x1b[31m",
}

/**
 * Create a test.
 * The test fails if `fn` throws, but passes otherwise.
 * @param {string} desc - A description for the test.
 * @param {() => void} fn
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
 * // ❌ 2 plus 2 is 5
 * // wrong! 2 + 2 isn't 5
 */
async function test(desc, fn) {
  try {
    await fn()
    console.log(`${color.fgGreen}✔${color.reset} ${desc}`)
  } catch (e) {
    console.log(typeof e.stack)
    console.log(`${color.fgRed}✖${color.reset} ${desc}\n${e}`)
  }
}

export default test
