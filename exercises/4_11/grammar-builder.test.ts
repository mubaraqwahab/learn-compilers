import { expect, test } from "vitest";
import { buildGrammar } from "./grammar-builder.js";
import { Grammar } from "./types.js";

function map<K extends string, V>(o: Record<K, V>) {
  return new Map(Object.entries(o) as Array<[K, V]>);
}

test.skip("stub", () => {
  const src = String.raw`
# Lexical definition
integer -> "[0-9]+"
additiveOp -> "\+|-" # escape a regex metachar
groupStart -> "\("
groupEnd -> "\)"
---
# Syntax definition
Expression -> Term RestExpression
RestExpression -> eps | additiveOp Expression
Term -> integer
Term -> groupStart Expression groupEnd
  `;

  const grammar: Grammar = {
    tokens: map({
      integer: /[0-9]+/,
      additiveOp: /\+|-/,
      groupStart: /\(/,
      groupEnd: /\)/,
    }),
    startSymbol: "Expression",
    rules: map({
      Expression: [["Term", "RestExpression"]],
      RestExpression: [[], ["additiveOp", "Expression"]],
      Term: [["integer"], ["groupStart", "Expression", "groupEnd"]],
    }),
  };

  expect(buildGrammar(src)).toEqual(grammar);
});
