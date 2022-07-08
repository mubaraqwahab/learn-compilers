import { Node, parse } from "./regex-parser.js";

/**
 * Convert a regular expression to an NFA
 * using the McNaughton-Yamada-Thompson algorithm.
 */
export function regexToNFA(regex: string) {
  const ast = parse(regex);
  return nodeToNFA(ast);
}

/**
 * Convert a regular expression AST node to an NFA
 * using the McNaughton-Yamada-Thompson algorithm.
 */
function nodeToNFA(node: Node): NFA {
  // TODO: Refactor and cleanup!

  switch (node.type) {
    case "Literal": {
      const nfa: NFA = {
        final: "s1",
        transitions: new Set([["s0", node.value, "s1"]]),
      };
      return nfa;
    }

    case "Concat": {
      const leftNFA = nodeToNFA(node.left);
      const rightNFA = nodeToNFA(node.right);
      const transitions = new Set(leftNFA.transitions);

      const leftFinalId = id(leftNFA.final);
      const rightFinalId = id(rightNFA.final);

      rightNFA.transitions.forEach(([from, char, to]) => {
        const newFrom: NFAState = `s${id(from) + leftFinalId}`;
        const newTo: NFAState = `s${id(to) + leftFinalId}`;
        transitions.add([newFrom, char, newTo]);
      });

      const nfa: NFA = {
        final: `s${rightFinalId + leftFinalId}`,
        transitions,
      };

      return nfa;
    }

    case "Union": {
      const leftNFA = nodeToNFA(node.left);
      const rightNFA = nodeToNFA(node.right);

      const transitions: NFA["transitions"] = new Set([["s0", "", "s1"]]);

      leftNFA.transitions.forEach(([from, char, to]) => {
        const newFrom: NFAState = `s${id(from) + 1}`;
        const newTo: NFAState = `s${id(to) + 1}`;
        transitions.add([newFrom, char, newTo]);
      });

      const rightOffset = id(leftNFA.final) + 1 + 1;
      transitions.add(["s0", "", `s${rightOffset}`]);

      rightNFA.transitions.forEach(([from, char, to]) => {
        const newFrom: NFAState = `s${id(from) + rightOffset}`;
        const newTo: NFAState = `s${id(to) + rightOffset}`;
        transitions.add([newFrom, char, newTo]);
      });

      const final: NFAState = `s${id(rightNFA.final) + rightOffset + 1}`;

      const newLeftFinal: NFAState = `s${id(leftNFA.final) + 1}`;
      const newRightFinal: NFAState = `s${id(rightNFA.final) + rightOffset}`;
      transitions.add([newLeftFinal, "", final]);
      transitions.add([newRightFinal, "", final]);

      const nfa: NFA = { final, transitions };

      return nfa;
    }

    case "Kleene": {
      const argNFA = nodeToNFA(node.argument);
      const transitions: NFA["transitions"] = new Set([["s0", "", "s1"]]);

      argNFA.transitions.forEach(([from, char, to]) => {
        const newFrom: NFAState = `s${id(from) + 1}`;
        const newTo: NFAState = `s${id(to) + 1}`;
        transitions.add([newFrom, char, newTo]);
      });

      const newArgFinal: NFAState = `s${id(argNFA.final) + 1}`;
      const final: NFAState = `s${id(argNFA.final) + 2}`;
      transitions.add([newArgFinal, "", "s1"]);
      transitions.add([newArgFinal, "", final]);
      transitions.add(["s0", "", final]);

      const nfa: NFA = { final, transitions };
      return nfa;
    }

    case "RegEx": {
      return nodeToNFA(node.body);
    }
  }
}

/**
 * Get the id of a given NFA state.
 * @example
 * id("s1") === 1
 */
function id(state: NFAState): number {
  return +state.slice(1);
}

export interface NFA {
  // No need for an explicit initial state;
  // the initial state will always be 's0'
  final: NFAState;
  /**
   * An set of tuples [S1, char, S2] where each tuple
   * denotes a transition from state S1 to state S2 through char.
   * This property is a *set* not an *array* because the order of
   * the tuples don't matter.
   */
  transitions: Set<[NFAState, string, NFAState]>;
}

type NFAState = `s${number}`;
