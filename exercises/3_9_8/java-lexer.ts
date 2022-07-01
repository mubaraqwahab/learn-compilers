import { createToken, Lexer } from "chevrotain";
import keywords from "./keywords.js";

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const Comment = createToken({
  name: "Comment",
  pattern: /\/\/.*|\/\*(.|\n|\r\n?)*\*\//,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
});

// TODO: punctuators

export const lexer = new Lexer([WhiteSpace, ...keywords, Identifier, Comment]);
