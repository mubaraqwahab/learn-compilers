import { scan, type Token } from "./fol-scan.js";

/**
 * Evaluate a first-order-logic expression
 */
export function evaluate(src: string): boolean {
  const evaluator = new Evaluator(src);
  return evaluator.eval();
}

class Evaluator {
  #src: string;
  #index = 0;
  #tokens: Token[];

  constructor(src: string) {
    this.#src = src;
    this.#tokens = scan(src);
  }

  eval(): boolean {
    this.#index = 0;

    const result = this.#evalImplication();

    this.#expect("eof");

    return result;
  }

  #expect(type: Token["type"]): void {
    const next = this.#tokens[this.#index];
    if (next?.type === type) {
      // consume
      this.#index++;
    } else {
      throw new SyntaxError("bla bla");
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
    }
    this.#retreat();
    return first;
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
    }
    this.#retreat();
    return first;
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
    }
    this.#retreat();
    return first;
  }

  #evalTerm(): boolean {
    const token = this.#nextToken();
    if (token.type === "notOp") {
      const term = this.#evalTerm();
      return !term;
    }
    this.#retreat();
    return this.#evalFactor();
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
      throw new SyntaxError(
        `Expected a boolean or left bracket '(' but found '${image(token)}'`
      );
    }
  }
}

function image(token: Token): string {
  switch (token.type) {
    case "impliesOp":
      return "->";
    case "orOp":
      return "|";
    case "andOp":
      return "&";
    case "notOp":
      return "!";
    case "groupStart":
      return "(";
    case "groupEnd":
      return ")";
  }

  throw Error("TODO");
}
