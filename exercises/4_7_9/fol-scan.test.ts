import { expect, test } from "vitest";
import { createToken as t, scan } from "./fol-scan.js";

test("can scan a boolean value", () => {
  expect(scan("T")).toMatchObject([t.boolean(true), t.eof()]);
  expect(scan("F")).toMatchObject([t.boolean(false), t.eof()]);
});

test("can scan simple operations", () => {
  expect(scan("!F")).toMatchObject([t.notOp(), t.boolean(false), t.eof()]);

  expect(scan("T & F")).toMatchObject([
    t.boolean(true),
    t.andOp(),
    t.boolean(false),
    t.eof(),
  ]);

  expect(scan("T | F")).toMatchObject([
    t.boolean(true),
    t.orOp(),
    t.boolean(false),
    t.eof(),
  ]);

  expect(scan("T -> F")).toMatchObject([
    t.boolean(true),
    t.impliesOp(),
    t.boolean(false),
    t.eof(),
  ]);
});

test("can scan complex operations", () => {
  expect(scan("F & T | !T")).toMatchObject([
    t.boolean(false),
    t.andOp(),
    t.boolean(true),
    t.orOp(),
    t.notOp(),
    t.boolean(true),
    t.eof(),
  ]);

  expect(scan("!(F -> F) -> T")).toMatchObject([
    t.notOp(),
    t.groupStart(),
    t.boolean(false),
    t.impliesOp(),
    t.boolean(false),
    t.groupEnd(),
    t.impliesOp(),
    t.boolean(true),
    t.eof(),
  ]);
});

test("errs on an invalid input", () => {
  expect(() => scan(`True`)).toThrowError(/invalid.*index.*1/i);
  expect(() => scan(`T and F`)).toThrowError(/invalid.*index.*2/i);
  expect(() => scan(`(T | F)\nF`)).toThrowError(/invalid.*index.*7/i);
});
