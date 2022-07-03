const EOF = "";

const chars = ["a", "b", "c", "d", "e", "f"] as const;

// Modify the grammar and parse table so that char is a nonterminal

const grammar: Grammar = {
  start: "Re",
  rules: {
    Re: [["Union"], []],
    Union: [["Concat", "Runion"]],
    Runion: [["|", "Concat", "Runion"], []],
    Concat: [["Kleene", "Rconcat"]],
    Rconcat: [["Concat"], []],
    Kleene: [["Unit", "Star"]],
    Star: [["*"], []],
    Unit: [["Group"], ...chars.map((c) => [c])],
    Group: [["(", "Re", ")"]],
  },
};

function charsNum(num: number, seq = false) {
  // const entries = chars.map((c, i) => [c, i + num] as const);
  const entries = chars.map((c, i) => {
    if (seq) {
      return [c, i + num] as const;
    } else {
      return [c, num] as const;
    }
  });
  return Object.fromEntries(entries) as Record<typeof chars[number], number>;
}

const parseTable: ParseTable = {
  Re: {
    "(": 0,
    ...charsNum(0),
    ")": 1,
    $: 1,
  },
  Union: {
    "(": 0,
    ...charsNum(0),
  },
  Runion: {
    ")": 1,
    "|": 0,
    $: 1,
  },
  Concat: {
    "(": 0,
    ...charsNum(0),
  },
  Rconcat: {
    "(": 0,
    ...charsNum(0),
    ")": 1,
    "|": 1,
    $: 1,
  },
  Kleene: {
    "(": 0,
    ...charsNum(0),
  },
  Star: {
    "(": 1,
    ...charsNum(1),
    ")": 1,
    "|": 1,
    "*": 0,
    $: 1,
  },
  Unit: {
    "(": 0,
    ...charsNum(1, true),
  },
  Group: {
    "(": 0,
  },
};

type ParseTable = {
  [n in NonTerminal]: {
    [t in Terminal | "$"]?: number;
  };
};

type Grammar = {
  start: NonTerminal;
  rules: {
    [k in NonTerminal]: Array<Sentential>;
  };
};

const terminals = ["|", "*", "(", ")", ...chars] as const;

type Sentential = Array<Terminal | NonTerminal>;

type Terminal = "|" | "*" | "(" | ")" | "a" | "b" | "c" | "d" | "e" | "f";

type NonTerminal =
  | "Re"
  | "Union"
  | "Runion"
  | "Concat"
  | "Rconcat"
  | "Kleene"
  | "Star"
  | "Unit"
  | "Group";

console.table(grammar.rules);

export class REParser {
  #src!: string;
  #index!: number;
  #stack!: Array<Terminal | NonTerminal | "$">;

  #nextChar(): string {
    return this.#src[this.#index++] ?? EOF;
  }

  #init(src: string) {
    this.#src = src + "$";
    this.#index = 0;
    this.#stack = ["$", "Re"];
  }

  /**
   *
   * This is intentionally an arrow function
   * so that it has a static `this` binding.
   */
  parse = (src: string): boolean => {
    this.#init(src);
    const stack = this.#stack;
    let c = this.#nextChar();

    while (stack.length > 0) {
      const top = stack.at(-1)!;
      if (top === c) {
        stack.pop();
        c = this.#nextChar();
      } else if (top.length === 1) {
        this.err();
      } else if (c in parseTable[top as NonTerminal]) {
        stack.pop();
        // @ts-ignore
        const ruleIndex = parseTable[top][c] as number;
        const rule = grammar.rules[top as NonTerminal][ruleIndex]!;
        stack.push(...rule.slice().reverse());
      } else {
        this.err();
      }
    }

    return true;
  };

  err(): never {
    throw new Error(
      `Parse error\nStack:${JSON.stringify(
        this.#stack.slice().reverse(),
        null,
        2
      )}\nInput:${this.#src}\nIndex:${this.#index}`
    );
  }
}
