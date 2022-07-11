import { createToken, Lexer } from "chevrotain";
import { rx } from "verbose-regexp";

const WhitespaceNoNewline = createToken({
  name: "WhitespaceNoNewline",
  pattern: /( |\t)+/,
  group: Lexer.SKIPPED,
});

const Newline = createToken({
  name: "Newline",
  pattern: /\r\n?|\n/,
});

const Nonterminal = createToken({
  name: "Nonterminal",
  pattern: /[A-Z][A-Za-z0-9]*/,
});

const Terminal = createToken({
  name: "Terminal",
  pattern: /[a-z][a-z0-9_]*/,
});

const EpsilonKeyword = createToken({
  name: "EpsilonKeyword",
  pattern: /eps/,
  longer_alt: Terminal,
});

const Regex = createToken({
  name: "Regex",
  pattern: rx`
    "(
      \\. // escape sequences
      |
      [^"\\] // any char except " or \
    )*"
  `,
});

const DefSeparator = createToken({
  name: "DefSeparator",
  pattern: /---/,
});

const ProductionOperator = createToken({
  name: "ProductionOperator",
  pattern: /->/,
});

const ChoiceOperator = createToken({
  name: "ChoiceOperator",
  pattern: /\|/,
});

const Comment = createToken({
  name: "Comment",
  pattern: /#.*/,
});

export const lexer = new Lexer([
  WhitespaceNoNewline,
  Newline,
  Nonterminal,
  EpsilonKeyword, // this precedes Terminal
  Terminal,
  Regex,
  ProductionOperator,
  ChoiceOperator,
  Comment,
  DefSeparator,
]);
