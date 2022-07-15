import { expect, test } from "vitest";
import { lexer } from "./grammar-lexer.js";

type TokenName =
  | "WhitespaceNoNewline"
  | "Newline"
  | "Nonterminal"
  | "EpsilonKeyword"
  | "Terminal"
  | "Regex"
  | "ProductionOperator"
  | "ChoiceOperator"
  | "Comment"
  | "DefSeparator";

const t = (type: TokenName, image: string) => {
  return expect.objectContaining({
    image,
    tokenType: expect.objectContaining({
      name: type,
    }),
  });
};

test.skip("can lex a simple grammar", () => {
  const grammar = String.raw`
# Lexical definition
integer -> "[0-9]+"
additiveOp -> "\+|-" # escape a regex metachar
---
# Syntax definition
Expression -> Term RestExpression
RestExpression -> additiveOp Term RestExpression | eps
Term -> integer
  `;
  const { tokens, errors } = lexer.tokenize(grammar);

  expect(errors).toEqual([]);
  expect(tokens).toEqual(
    expect.arrayContaining([
      t("Comment", "# Lexical definition"),
      t("Terminal", "integer"),
      t("ProductionOperator", "->"),
      t("Terminal", "additiveOp"),
      t("Newline", "\n"),
      t("Regex", '"\\+|-"'),
      t("Comment", "# escape a regex metachar"),
      t("DefSeparator", "---"),
      t("Nonterminal", "Expression"),
      t("ChoiceOperator", "|"),
      t("Terminal", "eps"),
    ])
  );
});
