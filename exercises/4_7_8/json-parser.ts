import { scan, Token } from "../3_9_7/json-scanner.js";

/**
 * Validate a JSON string.
 */
export function parse(src: string): boolean {
  const parser = new JSONParser(src);
  return parser.parse();
}

/**
 * A recursive-descent parser to validate JSON.
 */
export class JSONParser {
  #tokens: Token[];
  #index = 0;

  constructor(src: string) {
    this.#tokens = scan(src);
  }

  /**
   * Get the next token without consuming it.
   */
  #peek(): Token {
    return this.#tokens[this.#index]!;
  }

  /**
   * Consume the next token.
   */
  #nextToken(): Token {
    const token = this.#peek();
    this.#index++;
    return token;
  }

  /**
   * Consume the next token and return true
   * if the token matches the given type.
   * Otherwise, return false.
   */
  #expect(type: Token["type"]): boolean {
    if (this.#peek().type === type) {
      this.#nextToken();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Similar to #expect, but doesn't consume the matching token.
   */
  #expectWithoutConsuming(type: Token["type"]): boolean {
    return this.#peek().type === type;
  }

  /**
   * Determine if the src string is valid JSON.
   */
  parse(): boolean {
    return this.#expect("eof") || (this.#parseValue() && this.#expect("eof"));
  }

  #parseValue(): boolean {
    return (
      this.#expect("number") ||
      this.#expect("string") ||
      this.#expect("boolean") ||
      this.#expect("null") ||
      this.#parseArray() ||
      this.#parseObject()
    );
  }

  #parseArray(): boolean {
    return (
      this.#expect("lbracket") &&
      this.#parseElements() &&
      this.#expect("rbracket")
    );
  }

  #parseElements(): boolean {
    return (
      this.#expectWithoutConsuming("rbracket") || this.#parseNonEmptyElements()
    );
  }

  #parseNonEmptyElements(): boolean {
    return this.#parseValue() && this.#parseRightElements();
  }

  #parseRightElements(): boolean {
    return (
      this.#expectWithoutConsuming("rbracket") ||
      (this.#expect("comma") && this.#parseNonEmptyElements())
    );
  }

  #parseObject(): boolean {
    return (
      this.#expect("lcurly") && this.#parseEntries() && this.#expect("rcurly")
    );
  }

  #parseEntries(): boolean {
    return (
      this.#expectWithoutConsuming("rcurly") || this.#parseNonEmptyEntries()
    );
  }

  #parseNonEmptyEntries(): boolean {
    return this.#parseEntry() && this.#parseRightEntries();
  }

  #parseRightEntries(): boolean {
    return (
      this.#expectWithoutConsuming("rcurly") ||
      (this.#expect("comma") && this.#parseNonEmptyEntries())
    );
  }

  #parseEntry(): boolean {
    return (
      this.#expect("string") && this.#expect("colon") && this.#parseValue()
    );
  }
}
