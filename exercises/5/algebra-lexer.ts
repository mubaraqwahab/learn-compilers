import { createToken, Lexer, type TokenType } from "chevrotain";

type Pattern = string | RegExp;

function createTokensDict<TokenName extends string>(
  obj: Record<TokenName, Pattern>
) {
  const tokensDict = {} as Record<TokenName, TokenType>;
  const entries = Object.entries(obj) as Array<[TokenName, Pattern]>;
  for (const [name, pattern] of entries) {
    tokensDict[name] = createToken({ name, pattern });
  }
  return tokensDict;
}

export const tokensDict = createTokensDict({
  Whitespace: /\s+/,
  Int: /[0-9]+/,
  PlusOp: /\+/,
  MinusOp: /-/,
  MulOp: /\*/,
  DivOp: /\//,
  LParen: /\(/,
  RParen: /\)/,
  Semi: /;/,
});

export const tokens = Object.values(tokensDict);

export const lexer = new Lexer(tokens);
