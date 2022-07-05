export const createToken: Record<Token["type"], (value?: any) => Token> = {
  boolean(value: boolean) {
    return { type: "boolean", value };
  },
  andOp() {
    return { type: "andOp" };
  },
  orOp() {
    return { type: "orOp" };
  },
  impliesOp() {
    return { type: "impliesOp" };
  },
  notOp() {
    return { type: "notOp" };
  },
  groupStart() {
    return { type: "groupStart" };
  },
  groupEnd() {
    return { type: "groupEnd" };
  },
  eof() {
    return { type: "eof" };
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

export type Token =
  | { type: "boolean"; value: boolean }
  | { type: "andOp" }
  | { type: "orOp" }
  | { type: "impliesOp" }
  | { type: "notOp" }
  | { type: "groupStart" }
  | { type: "groupEnd" }
  | { type: "eof" };
