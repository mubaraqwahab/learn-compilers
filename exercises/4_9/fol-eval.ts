import { scan, type Token } from "./fol-scan.js";

/**
 * Evaluate a first-order-logic expression
 */
export function evaluate(src: string): boolean {
  const evaluator = new Evaluator(src);
  return evaluator.eval();
}

/**
 * A recursive descent parser to evaluate
 * a simple first-order-logic expression
 */
class Evaluator {
  #src: string;
  #index = 0;
  #tokens: Token[];

  constructor(src: string) {
    this.#src = src;
    this.#tokens = scan(src);
  }

  /**
   * Begin evaluation
   */
  eval(): boolean {
    const result = this.#evalImplication();
    this.#expect("eof");
    return result;
  }

  /**
   * Consume the next token if it matches the given type.
   * Otherwise, throw a syntax error.
   */
  #expect(type: Token["type"]): void {
    const next = this.#tokens[this.#index]!;
    if (next.type === type) {
      // consume
      this.#index++;
    } else {
      const found = next.type === "eof" ? "eof" : `'${next.image}'`;
      throw new SyntaxError(
        `Unexpected ${found}:\n` +
          `    ${this.#src}\n` +
          `    ${"^".padStart(next.index + 1)}`
      );
    }
  }

  #nextToken(): Token {
    return this.#tokens[this.#index++]!;
  }

  #retreat() {
    this.#index--;
  }

  #evalImplication(): boolean {
    const first = this.#evalDisjunction();
    return this.#evalRestImplication(first);
  }

  #evalRestImplication(first: boolean): boolean {
    const token = this.#nextToken();
    if (token.type === "impliesOp") {
      const second = this.#evalDisjunction();
      // (A -> B) equiv (not A or B)
      const result = !first || second;
      return this.#evalRestImplication(result);
    } else {
      this.#retreat();
      return first;
    }
  }

  #evalDisjunction(): boolean {
    const first = this.#evalConjunction();
    return this.#evalRestDisjunction(first);
  }

  #evalRestDisjunction(first: boolean): boolean {
    const token = this.#nextToken();
    if (token.type === "orOp") {
      const second = this.#evalConjunction();
      const result = first || second;
      return this.#evalRestDisjunction(result);
    } else {
      this.#retreat();
      return first;
    }
  }

  #evalConjunction(): boolean {
    const first = this.#evalTerm();
    return this.#evalRestConjunction(first);
  }

  #evalRestConjunction(first: boolean): boolean {
    const token = this.#nextToken();
    if (token.type === "andOp") {
      const second = this.#evalTerm();
      const result = first && second;
      return this.#evalRestConjunction(result);
    } else {
      this.#retreat();
      return first;
    }
  }

  #evalTerm(): boolean {
    const token = this.#nextToken();
    if (token.type === "notOp") {
      const term = this.#evalTerm();
      return !term;
    } else {
      this.#retreat();
      return this.#evalFactor();
    }
  }

  #evalFactor(): boolean {
    const token = this.#nextToken();
    if (token.type === "groupStart") {
      const result = this.#evalImplication();
      this.#expect("groupEnd");
      return result;
    } else if (token.type === "boolean") {
      return token.value;
    } else {
      const found = token.type === "eof" ? "eof" : `'${token.image}'`;
      throw new SyntaxError(
        `Expected a boolean or left bracket '(' but found ${found}:\n` +
          `    ${this.#src}\n` +
          `    ${"^".padStart(token.index + 1)}`
      );
    }
  }
}
