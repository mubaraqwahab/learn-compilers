// @ts-check

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
function test(desc, fn) {
  try {
    fn()
    console.log(`✔ ${desc}`)
  } catch (e) {
    console.log(`❌ ${desc}\n${e.message}`)
  }
}

export default test
