const EOF = "";

/**
 * Convenience method to get all the tokens in a source string.
 */
export function scan(src: string): Token[] {
  const scanner = new JSONScanner(src);
  const tokens: Token[] = [];
  while (true) {
    const token = scanner.nextToken();
    tokens.push(token);
    if (token.type === "eof") {
      break;
    }
  }
  return tokens;
}

export const createToken: CreateTokenT = {
  // The props could be methods, but typing `()` is tedious.
  lbracket: { type: "lbracket" },
  lcurly: { type: "lcurly" },
  rbracket: { type: "rbracket" },
  rcurly: { type: "rcurly" },
  colon: { type: "colon" },
  comma: { type: "comma" },
  string: { type: "string" },
  number: { type: "number" },
  boolean: { type: "boolean" },
  null: { type: "null" },
  error: { type: "error" },
  eof: { type: "eof" },
};

// Alias :)
const t = createToken;

export class JSONScanner {
  #src: string;
  #index = 0;
  #state: State = "value";
  #emittedTokens: Token[] = [];
  #buffer = "";

  constructor(src: string) {
    this.#src = src;
  }

  nextToken(): Token {
    while (this.#emittedTokens.length === 0) {
      this.#stateHandlers[this.#state]();
    }
    return this.#emittedTokens.shift()!;
  }

  #stateHandlers: Record<State, () => void> = {
    value: () => {
      const c = this.#nextChar();
      if (c === "{") {
        this.#emit({ type: "lcurly" });
      } else if (c === "[") {
        this.#emit({ type: "lbracket" });
      } else if (c === "}") {
        this.#emit({ type: "rcurly" });
      } else if (c === "]") {
        this.#emit({ type: "rbracket" });
      } else if (c === ":") {
        this.#emit({ type: "colon" });
      } else if (c === ",") {
        this.#emit({ type: "comma" });
      } else if (c === '"') {
        this.#state = "string";
      } else if (c === "-") {
        this.#state = "numberStart";
      } else if (isDigit(c)) {
        this.#reconsumeInState("numberStart");
      } else if (isLower(c)) {
        this.#buffer = c;
        this.#state = "literalName";
      } else if (isWhitespace(c)) {
        // noop
      } else if (c === EOF) {
        this.#emit({ type: "eof" });
      } else {
        this.#emit({ type: "error" });
      }
    },

    string: () => {
      const c = this.#nextChar();
      if (c === '"') {
        this.#emit({ type: "string" });
        this.#state = "value";
      } else if (c === "\\") {
        this.#state = "stringEscape";
      } else {
        // noop
      }
    },

    stringEscape: () => {
      this.#nextChar();
      this.#state = "string";
    },

    literalName: () => {
      const c = this.#nextChar();
      if (isLower(c)) {
        this.#buffer += c;
      } else {
        if (this.#buffer === "true" || this.#buffer === "false") {
          this.#emit({ type: "boolean" });
        } else if (this.#buffer === "null") {
          this.#emit({ type: "null" });
        } else {
          this.#emit({ type: "error" });
        }
        this.#reconsumeInState("value");
      }
    },

    numberStart: () => {
      const c = this.#nextChar();
      if (c === "0") {
        this.#state = "numberAfterInt";
      } else if (isDigit(c)) {
        this.#state = "numberInt";
      } else {
        this.#emit({ type: "error" });
        this.#reconsumeInState("value");
      }
    },

    numberInt: () => {
      const c = this.#nextChar();
      if (isDigit(c)) {
        // noop
      } else {
        this.#reconsumeInState("numberAfterInt");
      }
    },

    numberAfterInt: () => {
      const c = this.#nextChar();
      if (c === ".") {
        this.#state = "numberFractionStart";
      } else if (c === "e" || c === "E") {
        this.#state = "numberExponentSign";
      } else {
        this.#emit({ type: "number" });
        this.#reconsumeInState("value");
      }
    },

    numberFractionStart: () => {
      const c = this.#nextChar();
      if (isDigit(c)) {
        this.#state = "numberFraction";
      } else {
        this.#emit(
          { type: "number" }, // the int
          { type: "error" } // the dot
        );
        this.#reconsumeInState("value");
      }
    },

    numberFraction: () => {
      const c = this.#nextChar();
      if (isDigit(c)) {
        // noop
      } else if (c === "e" || c === "E") {
        this.#state = "numberExponentSign";
      } else {
        this.#emit({ type: "number" });
        this.#reconsumeInState("value");
      }
    },

    numberExponentSign: () => {
      const c = this.#nextChar();
      if (c === "+" || c === "-") {
        this.#state = "numberExponentSignedStart";
      } else {
        this.#reconsumeInState("numberExponentUnsignedStart");
      }
    },

    numberExponentSignedStart: () => {
      const c = this.#nextChar();
      if (isDigit(c)) {
        this.#state = "numberExponent";
      } else {
        this.#emit(
          { type: "number" }, // the int
          { type: "error" }, // the 'e'
          { type: "error" } // the sign
        );
        this.#reconsumeInState("value");
      }
    },

    numberExponentUnsignedStart: () => {
      const c = this.#nextChar();
      if (isDigit(c)) {
        this.#state = "numberExponent";
      } else {
        this.#emit(
          { type: "number" }, // the int
          { type: "error" } // the 'e'
        );
        this.#reconsumeInState("value");
      }
    },

    numberExponent: () => {
      const c = this.#nextChar();
      if (isDigit(c)) {
        // noop
      } else {
        this.#emit({ type: "number" });
        this.#reconsumeInState("value");
      }
    },
  };

  #nextChar(): string {
    return this.#src[this.#index++] ?? EOF;
  }

  #reconsumeInState(state: State) {
    this.#index--;
    this.#state = state;
  }

  #emit(...tokens: Token[]) {
    // token.end = this.#index;
    this.#emittedTokens.push(...tokens);
  }
}

function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function isLower(c: string): boolean {
  return c >= "a" && c <= "z";
}

function isWhitespace(c: string): boolean {
  return /^\s$/.test(c);
}

export interface Token {
  end?: number;
  type:
    | "lbracket"
    | "lcurly"
    | "rbracket"
    | "rcurly"
    | "colon"
    | "comma"
    | "string"
    | "number"
    | "boolean"
    | "null"
    | "error"
    | "eof";
}

type State =
  | "value"
  | "string"
  | "stringEscape"
  | "literalName"
  | "numberStart"
  | "numberInt"
  | "numberAfterInt"
  | "numberFractionStart"
  | "numberFraction"
  | "numberExponentSign"
  | "numberExponentSignedStart"
  | "numberExponentUnsignedStart"
  | "numberExponent";

type CreateTokenT = {
  [k in Token["type"]]: Token & { type: k };
};
