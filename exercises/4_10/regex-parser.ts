export function parse(src: string): RegexNode {
  return new Parser(src).parse();
}

class Parser {
  #src: string;
  #index = 0;

  constructor(src: string) {
    this.#src = src;
  }

  parse(): RegexNode {
    const body = this.#parseUnion();
    const ast = n.regex(body);
    this.#expect(EOF);
    return ast;
  }

  /** Consume and return the next char */
  #nextChar(): string {
    return this.#src[this.#index++] ?? EOF;
  }

  /** Unconsume the last consumed char */
  #retreat(): void {
    this.#index--;
  }

  /**
   * Consume the next char if it matches the given char.
   * Otherwise, throw a syntax error.
   */
  #expect(c: string): void {
    const char = this.#nextChar();
    if (char !== c) {
      this.#error();
    }
  }

  #error(): never {
    const char = this.#src[this.#index - 1];
    const found = char ? `${s(char)}` : "eof";
    throw new SyntaxError(
      `Unexpected ${found} at index ${this.#index - 1}:\n` +
        `    ${this.#src}\n` +
        `    ${"^".padStart(this.#index)}`
    );
  }

  #parseUnion(): Node {
    const first = this.#parseConcat();
    return this.#parseRestUnion(first);
  }

  #parseRestUnion(first: Node): Node {
    const char = this.#nextChar();
    if (char === "|") {
      const second = this.#parseConcat();
      const union = n.union(first, second);
      return this.#parseRestUnion(union);
    } else {
      this.#retreat();
      return first;
    }
  }

  #parseConcat(): Node {
    const first = this.#parseKleene();
    return this.#parseRestConcat(first);
  }

  #parseRestConcat(first: Node): Node {
    const char = this.#nextChar();
    // RestConcat -> epsilon
    // FOLLOW(RestConcat) = {'|', ')'}
    if ("|)".includes(char)) {
      this.#retreat();
      return first;
    } else {
      this.#retreat();
      const second = this.#parseKleene();
      const concat = n.concat(first, second);
      return this.#parseRestConcat(concat);
    }
  }

  #parseKleene(): Node {
    const argument = this.#parseFactor();
    return this.#parseRestKleene(argument);
  }

  #parseRestKleene(argument: Node): Node {
    const char = this.#nextChar();
    if (char === "*") {
      // Avoid nested kleene closures since r** === r*
      const kleene = argument.type === "Kleene" ? argument : n.kleene(argument);
      return this.#parseRestKleene(kleene);
    } else {
      this.#retreat();
      return argument;
    }
  }

  #parseFactor(): Node {
    const char = this.#nextChar();
    if (char === "(") {
      const union = this.#parseUnion();
      this.#expect(")");
      return union;
    }
    // Match a metacharacter (minus '(', which is handled above)
    else if ("|*)".includes(char)) {
      this.#error();
    }
    // Match a non-metacharacter
    else {
      const literal = n.literal(char);
      return literal;
    }
  }
}

const EOF = "";

export const createNode = {
  regex(body: Node): RegexNode {
    return { type: "RegEx", body };
  },
  union(left: Node, right: Node): UnionNode {
    return { type: "Union", left, right };
  },
  concat(left: Node, right: Node): ConcatNode {
    return { type: "Concat", left, right };
  },
  kleene(argument: Node): KleeneNode {
    return { type: "Kleene", argument };
  },
  literal(value: string): LiteralNode {
    return { type: "Literal", value };
  },
};

const n = createNode;
const s = (v: unknown) => JSON.stringify(v, null, 2);

export type Node =
  | RegexNode
  | UnionNode
  | ConcatNode
  | KleeneNode
  | LiteralNode;

interface RegexNode extends INode {
  type: "RegEx";
  body: Node;
}

interface UnionNode extends INode {
  type: "Union";
  left: Node;
  right: Node;
}

interface ConcatNode extends INode {
  type: "Concat";
  left: Node;
  right: Node;
}

interface KleeneNode extends INode {
  type: "Kleene";
  argument: Node;
}

interface LiteralNode extends INode {
  type: "Literal";
  value: string;
}

interface INode {
  type: string;
}
