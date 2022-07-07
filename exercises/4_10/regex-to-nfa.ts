import { Node, parse } from "./regex-parser.js";

/**
 * Convert a regular expression to an NFA
 * using the McNaughton-Yamada-Thompson algorithm.
 */
export function regexToNFA(regex: string) {
  const ast = parse(regex);
  throw new Error("not implemented!");

  // Visit each node
  // TODO: learn visitor pattern!
  // TODO: generate unique state names
}

interface NFA {
  initial: string;
  final: string;
  states:
    | {
        [state: string]: {
          [char: string]: string;
        };
      }
    | [string, string, string];
}

function play() {
  let nfa: NFA;

  // r = a
  nfa = {
    initial: "s1",
    final: "s2",
    states: {
      s1: { a: "s2" },
      s2: {},
    },
  };

  // r = b
  nfa = {
    initial: "s3",
    final: "s4",
    states: {
      s3: { b: "s4" },
      s4: {},
    },
  };

  // r = ab
  nfa = {
    initial: "s1",
    final: "s4",
    states: {
      s1: { a: "s2" },
      s2: { b: "s4" },
      s4: {},
    },
  };

  // r = a|b
  nfa = {
    initial: "s0",
    final: "",
    states: {
      // TODO: What's the best way to write this that allows duped keys?
      // Consider: [['s0', '', 's1'], ['s0', '', 's3'], ...]
      // Should you omit the tuple for the final state if it's empty?
      s0: { "": "s1", "": "s3" },
      s1: { a: "s2" },
      s2: { "": "s5" },
      s3: { b: "s4" },
      s4: { "": "s5" },
      s5: {},
    },
  };
}
