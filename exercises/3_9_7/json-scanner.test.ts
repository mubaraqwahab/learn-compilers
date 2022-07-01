import * as assert from "node:assert/strict";
import { test, expect } from "vitest";
import { assertEachDeepEqual } from "../utils/test.js";
import { scan, createToken as t, type Token } from "./json-scanner.js";

test("can scan a plain/escaped string", () => {
  const jsons = [
    `""`,
    `"hello"`,
    `"Some\\nescaped JSON \\"string\\""`,
    // with punctuators:
    `"[{}],:"`,
    // looks like other literals:
    `"true"`,
    `"null"`,
    `"200"`,
  ];
  const eachExpected: Token[] = [t.string, t.eof];

  jsons.forEach((json) => expect(scan(json)).toMatchObject(eachExpected));
});

test("can scan a punctuated string", () => {});

test("errs on an invalid string", () => {
  const json = `'j'`;
  const expected: Token[] = [t.error, t.error, t.error, t.eof];
  expect(scan(json)).toMatchObject(expected);
});

test("can scan a number", () => {
  const jsons = [`2`, `-65`, `10.33`, `-5.9e4`, `7E-31`];
  const eachExpected: Token[] = [t.number, t.eof];

  jsons.forEach((json) => expect(scan(json)).toMatchObject(eachExpected));
});

test("errs on an invalid number", () => {
  expect(scan(`2.`)).toMatchObject([t.number, t.error, t.eof]);

  assert.deepEqual(scan(`.12`), [t.error, t.number, t.eof]);

  assert.deepEqual(scan(`-.65`), [t.error, t.error, t.number, t.eof]);

  assert.deepEqual(scan(`+10.33`), [t.error, t.number, t.eof]);

  assert.deepEqual(scan(`-5.9e4.0`), [t.number, t.error, t.number, t.eof]);

  assert.deepEqual(scan(`1.e2`), [t.number, t.error, t.error, t.number, t.eof]);

  assert.deepEqual(scan(`7E.31`), [
    t.number,
    t.error,
    t.error,
    t.number,
    t.eof,
  ]);
});

test("can scan a literal word (boolean/null)", () => {
  assert.deepEqual(scan(`true`), [t.boolean, t.eof]);
  assert.deepEqual(scan(`false`), [t.boolean, t.eof]);
  assert.deepEqual(scan(`null`), [t.null, t.eof]);
});

test("errs on an invalid literal word", () => {
  assert.deepEqual(scan(`truee`), [t.error, t.eof]);
  assert.deepEqual(scan(`dfalse`), [t.error, t.eof]);
  assert.deepEqual(scan(`none`), [t.error, t.eof]);
});

test("can scan an array", () => {
  assert.deepEqual(scan(`[]`), [t.lbracket, t.rbracket, t.eof]);

  assert.deepEqual(scan(`[1]`), [t.lbracket, t.number, t.rbracket, t.eof]);

  assert.deepEqual(scan(`["hi", null, 34e3]`), [
    t.lbracket,
    t.string,
    t.comma,
    t.null,
    t.comma,
    t.number,
    t.rbracket,
    t.eof,
  ]);
});

test("can scan an object", () => {
  assert.deepEqual(scan(`{}`), [t.lcurly, t.rcurly, t.eof]);

  assert.deepEqual(scan(`{"key1": "value", "key3": []}`), [
    t.lcurly,
    t.string,
    t.colon,
    t.string,
    t.comma,
    t.string,
    t.colon,
    t.lbracket,
    t.rbracket,
    t.rcurly,
    t.eof,
  ]);
});
