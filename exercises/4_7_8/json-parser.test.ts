import { test, expect } from "vitest";
import { parse } from "./json-parser.js";

test("can parse empty JSON", () => {
  expect(parse(``)).toEqual(true);
});

test("can parse a number", () => {
  expect(parse("23")).toEqual(true);
  expect(parse("-15e12")).toEqual(true);
  expect(parse("5.2e+12")).toEqual(true);
});

test("can parse a string", () => {
  expect(parse(`"hi"`)).toEqual(true);
  expect(parse(`"\\"double quoted\\""`)).toEqual(true);
});

test("can parse a boolean", () => {
  expect(parse(`true`)).toEqual(true);
  expect(parse(`false`)).toEqual(true);
});

test("can parse a null", () => {
  expect(parse(`null`)).toEqual(true);
});

test("can parse an array", () => {
  expect(parse(`[]`)).toEqual(true);
  expect(parse(`[0]`)).toEqual(true);
  expect(parse(`[1, 4e5, -6.7]`)).toEqual(true);
  expect(parse(`["hi", false, null]`)).toEqual(true);
});

test("can parse an object", () => {
  expect(parse(`{ }`)).toEqual(true);
  expect(parse(`{ "key": "value" }`)).toEqual(true);
  expect(
    parse(`{
      "key": "value",
      "empty": null,
      "nums": [11, 22, 33],
      "nested": { "key2": true }
    }`)
  ).toEqual(true);
});

test("fails on an invalid object key", () => {
  // single-quoted key
  expect(parse(`{ 'prop': 123 }`)).toEqual(false);
  // non-string keys
  expect(parse(`{ null: 123 }`)).toEqual(false);
  expect(parse(`{ prop: "value" }`)).toEqual(false);
});

test("fails on trailing comma", () => {
  expect(parse(`[12,]`)).toEqual(false);
  expect(parse(`{"key": "hi",}`)).toEqual(false);
});

test("fails on missing/misplaced punctuators", () => {
  // missing comma after 12
  expect(parse(`[12 23, 34]`)).toEqual(false);
  // colon within array
  expect(parse(`[12: 23, 34]`)).toEqual(false);
  // dangling rbracket
  expect(parse(`][12]`)).toEqual(false);
  // missing colon
  expect(parse(`{"key" "value", "key2": 123}`)).toEqual(false);
  // missing colon and value
  expect(parse(`{"key"}`)).toEqual(false);
  // dangling lcurly
  expect(parse(`{"key"`)).toEqual(false);
  // consecutive lcurlies
  expect(parse(`{{ "key": "value"}`)).toEqual(false);
  // dangling rcurly
  expect(parse(`{ "key": "value" }}`)).toEqual(false);
});

test("fails on multiple values", () => {
  expect(parse(`{} [] 123 "hi" true null`));
});
