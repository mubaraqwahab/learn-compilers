import { test, expect } from "vitest";
import { lexer } from "./java-lexer.js";

test("can lex a simple Java program", () => {
  const src = String.raw`
    package program;
    class MyProgram {
      /* Execution starts here. */
      public static void main(String[] args) {
        int $num_ = 10;
        // Print to screen
        System.out.println("Hello,\nworld");
      }
    }
  `;

  const { tokens, errors } = lexer.tokenize(src);

  const actualImages = tokens.map((token) => token.image);

  const expectedImages = [
    "package",
    "program",
    ";",
    "class",
    "MyProgram",
    "{",
    "/* Execution starts here. */",
    "public",
    "static",
    "void",
    "main",
    "(",
    "String",
    "[",
    "]",
    "args",
    ")",
    "{",
    "int",
    "$num_",
    "=",
    "10",
    ";",
    "// Print to screen",
    "System",
    ".",
    "out",
    ".",
    "println",
    "(",
    '"Hello,\\nworld"',
    ")",
    ";",
    "}",
    "}",
  ];

  expect(actualImages).toEqual(expectedImages);
  expect(errors).toEqual([]);
});
