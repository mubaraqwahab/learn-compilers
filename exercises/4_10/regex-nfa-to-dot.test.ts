import { expect, test } from "vitest";
import { regexNFAToDot } from "./regex-nfa-to-dot.js";

expect.addSnapshotSerializer({
  test(val) {
    return typeof val === "string" && val.startsWith("digraph");
  },
  serialize(val) {
    // Return the DOT string as is so that I can copy
    // the DOT lang output from the snapshot file and
    // use it where I want without modifying it further.
    return val;
  },
});

test("can convert a simple regex to DOT lang", () => {
  expect(regexNFAToDot(`a`)).toMatchSnapshot();
});

test("can convert a concat to DOT lang", () => {
  expect(regexNFAToDot(`ab`)).toMatchSnapshot();
});

test("can convert a union to DOT lang", () => {
  expect(regexNFAToDot(`a|b`)).toMatchSnapshot();
});

test("can convert a kleene closure to DOT lang", () => {
  expect(regexNFAToDot(`a*`)).toMatchSnapshot();
});

test("can convert a complex regex to DOT lang", () => {
  expect(regexNFAToDot(`(ab|c)*abb`)).toMatchSnapshot();
});
