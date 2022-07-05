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
