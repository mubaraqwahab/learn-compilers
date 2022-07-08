import { type Node, parse } from "./regex-parser.js";

/** Convert a regular expression to an NFA. */
export function regexToNFA(regex: string): NFA {
  const ast = parse(regex);
  return nodeToNFA(ast);
}

export interface NFA {
  // No need for an explicit initial state;
  // the initial state will always be 's0'
  final: NFAState;
  /**
   * A set of transition tuples.
   *
   * This property is a *set* and not an *array*
   * because the order of the tuples don't matter.
   */
  transitions: Set<Transition>;
}

/**
 * A tuple `[S1, char, S2]` denotes a transition
 * from state `S1` to state `S2` through `char`.
 */
type Transition = [NFAState, string, NFAState];

type NFAState = `s${number}`;

/**
 * Convert a regular expression AST node to an NFA
 * using the McNaughton-Yamada-Thompson algorithm.
 *
 * Note that the set of transitions in the resulting NFA has
 * a deterministic order. This is only important for testing!
 */
function nodeToNFA(node: Node): NFA {
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

      // The first right state intersects the last left state.
      const rightOffset = id(leftNFA.final);
      const shiftRightState = (state: NFAState) => shift(state, rightOffset);

      shiftTransitions(rightNFA.transitions, transitions, shiftRightState);

      return {
        final: shiftRightState(rightNFA.final),
        transitions,
      };
    }

    case "Union": {
      const leftNFA = nodeToNFA(node.left);
      const rightNFA = nodeToNFA(node.right);

      const transitions = new Set<Transition>();

      const leftOffset = 1;
      const shiftLeftState = (state: NFAState) => shift(state, leftOffset);

      transitions.add(["s0", "", shiftLeftState("s0")]);
      shiftTransitions(leftNFA.transitions, transitions, shiftLeftState);

      const rightOffset = id(shiftLeftState(leftNFA.final)) + 1;
      const shiftRightState = (state: NFAState) => shift(state, rightOffset);

      transitions.add(["s0", "", shiftRightState("s0")]);
      shiftTransitions(rightNFA.transitions, transitions, shiftRightState);

      const newLeftFinal = shiftLeftState(leftNFA.final);
      const newRightFinal = shiftRightState(rightNFA.final);
      const final = nextByID(newRightFinal);

      transitions.add([newLeftFinal, "", final]);
      transitions.add([newRightFinal, "", final]);

      return { final, transitions };
    }

    case "Kleene": {
      const argNFA = nodeToNFA(node.argument);
      const transitions: NFA["transitions"] = new Set([["s0", "", "s1"]]);

      const shiftArgState = (state: NFAState) => shift(state, 1);

      shiftTransitions(argNFA.transitions, transitions, shiftArgState);

      const newArgFinal = shiftArgState(argNFA.final);
      const final = nextByID(newArgFinal);

      transitions.add([newArgFinal, "", "s1"]);
      transitions.add([newArgFinal, "", final]);
      transitions.add(["s0", "", final]);

      return { final, transitions };
    }

    case "RegEx": {
      return nodeToNFA(node.body);
    }
  }
}

/**
 * Shift each transition in `srcSet` and copy the result into `destSet`.
 *
 * To shift a transition `[S1, char, S2]` is to create a new
 * transition `[S1prime, char, S2prime]` such that these hold:
 *  * `S1prime === shiftState(S1)`
 *  * `S2prime === shiftState(S2)`
 */
function shiftTransitions(
  srcSet: Set<Transition>,
  destSet: Set<Transition>,
  shiftState: (state: NFAState) => NFAState
) {
  srcSet.forEach(([from, char, to]) => {
    const newFrom = shiftState(from);
    const newTo = shiftState(to);
    destSet.add([newFrom, char, newTo]);
  });
}

/**
 * Get the id of a given NFA state.
 * @example
 * id("s1") === 1
 */
function id(state: NFAState): number {
  return +state.slice(1);
}

/**
 * Shift an NFA state by a given offset.
 * @example
 * shift("s1", 2) === "s3"
 */
function shift(state: NFAState, offset: number): NFAState {
  const stateId = id(state);
  const newId = stateId + offset;
  return `s${newId}`;
}

/**
 * Get the next state (in ID order) after a given state.
 * @example
 * next("s1") === "s2"
 */
function nextByID(state: NFAState): NFAState {
  return shift(state, 1);
}
