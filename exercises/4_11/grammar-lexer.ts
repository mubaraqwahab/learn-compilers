import { createToken, Lexer } from "chevrotain";
import { rx } from "verbose-regexp";

export const tokensDict = {
  WhitespaceNoNewline: createToken({
    name: "WhitespaceNoNewline",
    pattern: /( |\t)+/,
    group: Lexer.SKIPPED,
  }),

  Newline: createToken({
    name: "Newline",
    pattern: /\r\n?|\n/,
  }),

  Nonterminal: createToken({
    name: "Nonterminal",
    pattern: /[A-Z][A-Za-z0-9]*/,
  }),

  Terminal: createToken({
    name: "Terminal",
    pattern: /[a-z][A-Za-z0-9]*/,
  }),

  Regex: createToken({
    name: "Regex",
    pattern: rx`
      "(
        \\. // escape sequences
        |
        [^"\\] // any char except " or \
      )*"
    `,
  }),

  DefSeparator: createToken({
    name: "DefSeparator",
    pattern: "---",
  }),

  ProductionOperator: createToken({
    name: "ProductionOperator",
    pattern: "->",
  }),

  ChoiceOperator: createToken({
    name: "ChoiceOperator",
    pattern: "|",
  }),

  Comment: createToken({
    name: "Comment",
    pattern: /#.*/,
  }),
};

const t = tokensDict;

export const allTokens = [
  t.WhitespaceNoNewline,
  t.Newline,
  t.Nonterminal,
  t.Terminal,
  t.Regex,
  t.ProductionOperator,
  t.ChoiceOperator,
  t.Comment,
  t.DefSeparator,
];

export const lexer = new Lexer(allTokens);
