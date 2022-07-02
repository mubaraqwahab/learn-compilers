import { JSONScanner } from "../3_9_7/json-scanner.js";

export function parse(src: string): Node {
  const parser = new JSONParser(src);
  return parser.parse();
}

export class JSONParser {
  #scanner: JSONScanner;

  constructor(src: string) {
    this.#scanner = new JSONScanner(src);
  }

  parse(): Node {
    const token = this.#scanner.nextToken();
  }
}

export type Node = { type: "" };
