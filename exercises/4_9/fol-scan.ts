export const createToken = {
  boolean(value: boolean, index: number): Token {
    return { type: "boolean", value, index, image: value ? "T" : "F" };
  },
  andOp(index: number): Token {
    return { type: "andOp", index, image: "&" };
  },
  orOp(index: number): Token {
    return { type: "orOp", index, image: "|" };
  },
  impliesOp(index: number): Token {
    return { type: "impliesOp", index, image: "->" };
  },
  notOp(index: number): Token {
    return { type: "notOp", index, image: "!" };
  },
  groupStart(index: number): Token {
    return { type: "groupStart", index, image: "(" };
  },
  groupEnd(index: number): Token {
    return { type: "groupEnd", index, image: ")" };
  },
  eof(index: number): Token {
    return { type: "eof", index };
  },
};

const t = createToken;

export function scan(src: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  for (; index < src.length; index++) {
    const char = src[index];
    if (char === "T") {
      tokens.push(t.boolean(true, index));
    } else if (char === "F") {
      tokens.push(t.boolean(false, index));
    } else if (char === "&") {
      tokens.push(t.andOp(index));
    } else if (char === "|") {
      tokens.push(t.orOp(index));
    } else if (char === "-" && src[index + 1] === ">") {
      tokens.push(t.impliesOp(index));
      index++; // skip the '>'
    } else if (char === "!") {
      tokens.push(t.notOp(index));
    } else if (char === "(") {
      tokens.push(t.groupStart(index));
    } else if (char === ")") {
      tokens.push(t.groupEnd(index));
    } else if (char === " ") {
      // noop
    } else {
      throw new SyntaxError(
        `Invalid char ${JSON.stringify(char)} at index ${index}:\n` +
          `    ${src}\n` +
          `    ${"^".padStart(index + 1)}`
      );
    }
  }

  tokens.push(t.eof(index));

  return tokens;
}

export type Token = BooleanToken | OperatorToken | EOFToken;

interface BooleanToken extends IToken {
  type: "boolean";
  value: boolean;
  image: string;
}

interface OperatorToken extends IToken {
  type: "andOp" | "orOp" | "impliesOp" | "notOp" | "groupStart" | "groupEnd";
  image: string;
}

interface EOFToken extends IToken {
  type: "eof";
}

interface IToken {
  type: string;
  index: number;
}
