import { createToken, Lexer } from "chevrotain";
import { rx } from "verbose-regexp";
import keywords from "./keywords.js";

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const Comment = createToken({
  name: "Comment",
  pattern: rx`
    \/\/.* // single-line comment
    |
    /\*(.|\n|\r\n?)*\*/ // multi-line comment
  `,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
});

const DecimalIntegerLiteral = createToken({
  name: "DecimalIntegerLiteral",
  pattern: /0|[1-9][0-9]*/,
});

const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: rx`
    "(
      \\[bstnfr"'\\] // escape sequences
      |
      [^"\\]* // any char except " or \
    )*"
  `,
});

const Separator = createToken({
  name: "Separator",
  pattern: /[\(\)\{\}\[\];,\.@]|\.{3}|::/,
});

const Operator = createToken({
  name: "Operator",
  pattern: rx`
    [=><!~\?:]
    |->|==|>=|<=|!=|&&|(\|\|)|(\+\+)|--
    |(\+|-|\*|/|&|(\|)|\^|%|<<|>>|>>>)=?
  `,
});

/*
=   >   <   !   ~   ?   :   ->
==  >=  <=  !=  &&  ||  ++  --
+   -   *   /   &   |   ^   %   <<   >>   >>>
+=  -=  *=  /=  &=  |=  ^=  %=  <<=  >>=  >>>=
*/

export const lexer = new Lexer([
  WhiteSpace,
  ...keywords,
  Identifier,
  DecimalIntegerLiteral,
  StringLiteral,
  Separator,
  Comment, // comment before ops to disambiguate "//"
  Operator,
]);
