export const createToken: Record<Token["type"], (...args: any[]) => Token> = {
  boolean(value: boolean, index: number) {
    return { type: "boolean", value, index, image: value ? "T" : "F" };
  },
  andOp(index: number) {
    return { type: "andOp", index, image: "&" };
  },
  orOp(index: number) {
    return { type: "orOp", index, image: "|" };
  },
  impliesOp(index: number) {
    return { type: "impliesOp", index, image: "->" };
  },
  notOp(index: number) {
    return { type: "notOp", index, image: "!" };
  },
  groupStart(index: number) {
    return { type: "groupStart", index, image: "(" };
  },
  groupEnd(index: number) {
    return { type: "groupEnd", index, image: ")" };
  },
  eof(index: number) {
    return { type: "eof", index };
  },
};

const t = createToken;

export function scan(src: string): Token[] {
  const tokens: Token[] = [];

  for (let index = 0; index < src.length; index++) {
    const char = src[index];
    if (char === "T") {
      tokens.push(t.boolean(true));
    } else if (char === "F") {
      tokens.push(t.boolean(false));
    } else if (char === "&") {
      tokens.push(t.andOp());
    } else if (char === "|") {
      tokens.push(t.orOp());
    } else if (char === "-" && src[index + 1] === ">") {
      tokens.push(t.impliesOp());
      index++; // skip the '>'
    } else if (char === "!") {
      tokens.push(t.notOp());
    } else if (char === "(") {
      tokens.push(t.groupStart());
    } else if (char === ")") {
      tokens.push(t.groupEnd());
    } else if (char === " ") {
      // noop
    } else {
      throw new SyntaxError(
        `Invalid char ${JSON.stringify(char)} at index ${index}:
        ${src}
        ${"^".padStart(index + 1)}`
      );
    }
  }

  tokens.push(t.eof());

  return tokens;
}

export type Token = BooleanToken | OperatorToken | EOFToken;

interface BooleanToken extends IToken {
  type: "boolean";
  value: boolean;
};

interface OperatorToken extends IToken {
  type:
    | "andOp"
    | "orOp"
    | "impliesOp"
    | "notOp"
    | "groupStart"
    | "groupEnd";
}

interface EOFToken extends IToken = {
  type: "eof";
};

interface IToken {
  type: string;
  index: number;
  image: string;
}
