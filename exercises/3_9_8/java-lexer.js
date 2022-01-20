// @ts-check

import chevrotain from "chevrotain"
import keywords from "./keywords.js"

const { createToken } = chevrotain

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: chevrotain.Lexer.SKIPPED,
})

const Comment = createToken({
  name: "Comment",
  pattern: /\/\/.*|\/\*(.|\n|\r\n?)*\*\//,
})

const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
})

const lexer = new chevrotain.Lexer([
  WhiteSpace,
  ...keywords,
  Identifier,
  Comment,
])

const { tokens, errors } = lexer.tokenize(
  'int main() { int thisNum = 2; System.out.println("Hello, world"); }'
)

console.log(tokens.map((token) => `${token.tokenType.name} (${token.image})`))
// console.log(errors)
