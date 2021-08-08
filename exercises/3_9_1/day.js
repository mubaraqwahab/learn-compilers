// @ts-check

// 3.9.1 (a)
// Regex for English days of the week

const test = require("../utils/test")
const { assertEachMatches, assertEachDoesNotMatch } = require("../utils/assert")

const dayPattern = /^(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day$/

test("matches a day", () => {
  assertEachMatches(
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    dayPattern
  )
})

test("doesn't match a non-day", () => {
  assertEachDoesNotMatch(["Moonday", "Fryday"], dayPattern)
})
