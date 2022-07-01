// 3.9.1 (a)
// Regex for English days of the week

import {
  test,
  assertEachMatch,
  assertEachDoesNotMatch,
} from "../utils/test.js";

const dayPattern = /^(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day$/;

test("matches a day", () => {
  assertEachMatch(
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
  );
});

test("doesn't match a non-day", () => {
  assertEachDoesNotMatch(["Moonday", "Fryday"], dayPattern);
});
