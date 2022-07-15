export interface Grammar {
  // A map, not a plain obj, because iteration order matters.
  tokens: Map<TokenType, RegExp>;
  startSymbol: Nonterminal;
  rules: Map<Nonterminal, Array<Sentential>>;
}

export type First = Map<Sentential, Set<Terminal>>;

export type Follow = Map<Nonterminal, Set<Terminal>>;

export type TokenType = string;

// TODO: Include epsilon and eof
export type Terminal = TokenType;

export type Nonterminal = string;

export type Sentential = Array<Nonterminal | TokenType>;
