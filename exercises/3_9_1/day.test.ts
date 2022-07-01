// 3.9.1 (a)
// Regex for English days of the week

import { test, expect } from "vitest";

const dayPattern = /^(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day$/;

test("matches a day", () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (const day of days) {
    expect(day).toMatch(dayPattern);
  }
});

test("doesn't match a non-day", () => {
  const nonDays = ["Moonday", "Fryday"];
  for (const nonDay of nonDays) {
    expect(nonDay).not.toMatch(dayPattern);
  }
});
