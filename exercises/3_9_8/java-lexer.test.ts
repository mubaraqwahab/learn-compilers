import { test, expect } from "vitest";
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

  const { errors } = lexer.tokenize(src);
  expect(errors).toEqual([]);
});
