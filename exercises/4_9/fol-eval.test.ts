import { expect, test } from "vitest";
import { evaluate } from "./fol-eval.js";

test("can evaluate FOL expressions", () => {
  expect(evaluate(`T`)).toEqual(true);
  expect(evaluate(`T & T | F`)).toEqual(true);
  expect(evaluate(`( F -> F ) -> T`)).toEqual(true);
  expect(evaluate(`F`)).toEqual(false);
  expect(evaluate(`! ( T | F )`)).toEqual(false);
  expect(evaluate(`( T -> F ) & T`)).toEqual(false);
});

test("errs on invalid expressions", () => {
  expect(() => evaluate(`T & `)).toThrow(/expected.*boolean.*\(.*found.*eof/i);
  expect(() => evaluate(`| F`)).toThrow(/expected.*boolean.*\(.*found.*\|/i);
  expect(() => evaluate(`() | F`)).toThrow(/expected.*boolean.*\(.*found.*\)/i);
  expect(() => evaluate(`F( | F`)).toThrow(/unexpected.*\(/i);
  expect(() => evaluate(`(T | F F`)).toThrow(/unexpected.*f/i);
});
