import { expect, test } from "vitest";
import { createToken as t, scan } from "./fol-scan.js";

test("can scan a boolean value", () => {
  expect(scan("T")).toMatchObject([t.boolean(true, 0), t.eof(1)]);
  expect(scan("F")).toMatchObject([t.boolean(false, 0), t.eof(1)]);
});

test("can scan simple operations", () => {
  expect(scan("!F")).toMatchObject([t.notOp(0), t.boolean(false, 1), t.eof(2)]);

  expect(scan("T & F")).toMatchObject([
    t.boolean(true, 0),
    t.andOp(2),
    t.boolean(false, 4),
    t.eof(5),
  ]);

  expect(scan("T | F")).toMatchObject([
    t.boolean(true, 0),
    t.orOp(2),
    t.boolean(false, 4),
    t.eof(5),
  ]);

  expect(scan("T -> F")).toMatchObject([
    t.boolean(true, 0),
    t.impliesOp(2),
    t.boolean(false, 5),
    t.eof(6),
  ]);
});

test("can scan complex operations", () => {
  expect(scan("F & T | !T")).toMatchObject([
    t.boolean(false, 0),
    t.andOp(2),
    t.boolean(true, 4),
    t.orOp(6),
    t.notOp(8),
    t.boolean(true, 9),
    t.eof(10),
  ]);

  expect(scan("!(F -> F) -> T")).toMatchObject([
    t.notOp(0),
    t.groupStart(1),
    t.boolean(false, 2),
    t.impliesOp(4),
    t.boolean(false, 7),
    t.groupEnd(8),
    t.impliesOp(10),
    t.boolean(true, 13),
    t.eof(14),
  ]);
});

test("errs on an invalid input", () => {
  expect(() => scan(`True`)).toThrowError(/invalid.*index.*1/i);
  expect(() => scan(`T and F`)).toThrowError(/invalid.*index.*2/i);
  expect(() => scan(`(T | F)\nF`)).toThrowError(/invalid.*index.*7/i);
});
