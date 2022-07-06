import { expect, test } from "vitest";
import { REParser } from "./re-parser.js";

const { parse } = new REParser();

test("can parse an empty regex", () => {
  expect(parse("")).toBe(true);
});

test("can parse a one-letter regex", () => {
  expect(parse("a")).toBe(true);
});

test("can parse a union", () => {
  expect(parse("a|b")).toBe(true);
  // expect(parse("|")).toBe(true);
});

test("can parse a concat", () => {
  expect(parse("ab")).toBe(true);
});

test("can parse a kleene closure", () => {
  expect(parse("a*")).toBe(true);
  // This is an invalid regex in JS btw:
  // expect(parse("*")).toBe(true);
});

test("can parse a group", () => {
  expect(parse("(a)")).toBe(true);
  expect(parse("()")).toBe(true);
});

test("can parse a complex regex", () => {
  expect(parse("a(b*c|d)e")).toBe(true);
});
