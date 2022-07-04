import { test, expect } from "vitest";
import { scan, createToken as t, type Token } from "./json-scanner.js";

test("can scan empty JSON", () => {
  expect(scan(``)).toMatchObject([t.eof]);
});

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

  expect(scan(`.12`)).toMatchObject([t.error, t.number, t.eof]);

  expect(scan(`-.65`)).toMatchObject([t.error, t.error, t.number, t.eof]);

  expect(scan(`+10.33`)).toMatchObject([t.error, t.number, t.eof]);

  expect(scan(`-5.9e4.0`)).toMatchObject([t.number, t.error, t.number, t.eof]);

  expect(scan(`1.e2`)).toMatchObject([
    t.number,
    t.error,
    t.error,
    t.number,
    t.eof,
  ]);

  expect(scan(`7E.31`)).toMatchObject([
    t.number,
    t.error,
    t.error,
    t.number,
    t.eof,
  ]);
});

test("can scan a literal word (boolean/null)", () => {
  expect(scan(`true`)).toMatchObject([t.boolean, t.eof]);
  expect(scan(`false`)).toMatchObject([t.boolean, t.eof]);
  expect(scan(`null`)).toMatchObject([t.null, t.eof]);
});

test("errs on an invalid literal word", () => {
  expect(scan(`truee`)).toMatchObject([t.error, t.eof]);
  expect(scan(`dfalse`)).toMatchObject([t.error, t.eof]);
  expect(scan(`none`)).toMatchObject([t.error, t.eof]);
});

test("ignores whitespace", () => {
  expect(scan(`   \n"hi" \t\r\n`)).toMatchObject([t.string, t.eof]);
});

test("can scan an array", () => {
  expect(scan(`[]`)).toMatchObject([t.lbracket, t.rbracket, t.eof]);

  expect(scan(`[1]`)).toMatchObject([t.lbracket, t.number, t.rbracket, t.eof]);

  expect(scan(`["hi", null, 34e3]`)).toMatchObject([
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
  expect(scan(`{}`)).toMatchObject([t.lcurly, t.rcurly, t.eof]);

  expect(scan(`{"key1": "value", "key3": []}`)).toMatchObject([
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

test("errs on early eof", () => {
  // TODO: what's the output?
  expect(scan(`"hi`)).toMatchObject([t.error, t.error, t.eof]);
});
