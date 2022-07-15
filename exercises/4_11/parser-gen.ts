import { buildGrammar } from "./grammar-builder.js";
import type { Grammar, Nonterminal, Sentential, Terminal } from "./types.js";

class Parser {
  #grammar: Grammar;
  #firstSets: Map<Nonterminal | Sentential, Set<Terminal>>;
  #followSets: Map<Nonterminal, Set<Terminal>>;
  #parseTable: Map<Nonterminal, Map<Terminal, Sentential>>;

  constructor(grammarText: string) {
    this.#grammar = buildGrammar(grammarText);

    this.#computeFirstSets();
  }

  get firstSets() {
    return this.#firstSets;
  }

  get followSets() {
    return this.#followSets;
  }

  get parseTable() {
    return this.#parseTable;
  }

  #computeFirstSets() {
    for (const [nonterminal, choices] of this.#grammar.rules) {
      this.#firstSets.set(nonterminal, new Set());
      for (const sentential of choices) {
        // this.#first.get(nonterminal)!.add()
      }
    }
  }

  #firstOf(key: Terminal | Nonterminal | Sentential): Set<Terminal> {
    const rules = this.#grammar.rules;
    const firstSets = this.#firstSets;

    function createIfNotInFirstSets(
      key: Nonterminal | Sentential
    ): Set<Terminal> {
      if (!firstSets.has(key)) {
        firstSets.set(key, new Set());
      }
      return firstSets.get(key)!;
    }

    if (isTerminal(key)) {
      return new Set([key]);
    }

    if (isNonterminal(key)) {
      const first = createIfNotInFirstSets(key);
      for (const sentential of rules.get(key)!) {
        for (const terminal of this.#firstOf(sentential)) {
          first.add(terminal);
        }
      }
      return first;
    }

    if (isSentential(key)) {
      const first = createIfNotInFirstSets(key);
      if (key.length === 0) {
        first.add("eps");
      } else {
        let i = 0;

        for (; i < key.length; i++) {
          const firstOfUnit = this.#firstOf(key[i]!);
          // Copy everything except eps
          for (const terminal of firstOfUnit) {
            if (terminal !== "eps") {
              first.add(terminal);
            }
          }
          // Stop if there's no epsilon
          if (!firstOfUnit.has("eps")) break;
        }

        // if (i === key.length){}
      }
    }

    throw new Error(`Invalid arg? ${key}`);
  }
}

function isTerminal(v: unknown): v is Terminal {
  return typeof v === "string" && v[0] === v[0]?.toLowerCase();
}

function isNonterminal(v: unknown): v is Nonterminal {
  return typeof v === "string" && v[0] === v[0]?.toUpperCase();
}

function isSentential(v: unknown): v is Sentential {
  return Array.isArray(v);
}
