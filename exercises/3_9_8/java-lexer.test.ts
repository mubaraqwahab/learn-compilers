import { test } from "../utils/test.js";
import { lexer } from "./java-lexer.js";

test("can lex a simple Java program", () => {
  const src = `
    package program;
    class Program {
      public static void main(String[] args) {
        int num = 10;
        System.out.println("Hello, world");
      }
    }
  `;

  const { tokens, errors } = lexer.tokenize(src);
  console.log(
    tokens.map((token) => `${token.tokenType.name} (${token.image})`)
  );

  if (errors.length) {
    throw new Error(JSON.stringify(errors, null, 2));
  }
});
