import { CstParser, generateCstDts } from "chevrotain";
import { allTokens, lexer, tokensDict as t } from "./grammar-lexer.js";
import { writeFile } from "node:fs/promises";
import type { GrammarCstNode } from "./cst.js";

export class GrammarParser extends CstParser {
  constructor() {
    super(allTokens, {
      maxLookahead: 1,
    });

    this.performSelfAnalysis();
  }

  /**
   * ```
   * Grammar -> newline* LexicalDef defSeparator newline* SyntaxDef
   * ```
   */
  grammar = this.RULE("Grammar", () => {
    this.MANY(() => {
      this.CONSUME(t.Newline);
    });
    this.SUBRULE(this.#lexicalDef);
    this.CONSUME(t.DefSeparator);
    this.MANY1(() => {
      this.CONSUME1(t.Newline);
    });
    this.SUBRULE(this.#syntaxDef);
  });

  /**
   * ```
   * LexicalDef -> (CommentThenNewline* LexicalRule)+
   * ```
   */
  #lexicalDef = this.RULE("LexicalDef", () => {
    this.AT_LEAST_ONE(() => {
      this.MANY(() => {
        this.CONSUME(t.Comment);
        this.AT_LEAST_ONE1(() => {
          this.CONSUME(t.Newline);
        });
      });
      this.SUBRULE(this.#lexicalRule);
    });
  });

  /**
   * ```
   * LexicalRule -> terminal prodOp regex OptionalCommentThenNewlines
   * ```
   */
  #lexicalRule = this.RULE("LexicalRule", () => {
    this.CONSUME(t.Terminal);
    this.CONSUME(t.ProductionOperator);
    this.CONSUME(t.Regex);
    this.SUBRULE(this.#optionalCommentThenNewlines);
  });

  /**
   * ```
   * SyntaxDef -> (CommentThenNewline* SyntaxRule)+
   * ```
   */
  #syntaxDef = this.RULE("SyntaxDef", () => {
    this.AT_LEAST_ONE(() => {
      this.MANY(() => {
        this.SUBRULE(this.#commentThenNewlines);
      });
      this.SUBRULE(this.#syntaxRule);
    });
  });

  /**
   * ```
   * SyntaxRule -> nonterminal prodOp Choices OptionalCommentThenNewlines
   * ```
   */
  #syntaxRule = this.RULE("SyntaxRule", () => {
    this.CONSUME(t.Nonterminal);
    this.CONSUME(t.ProductionOperator);
    this.SUBRULE(this.#choices);
    this.SUBRULE(this.#optionalCommentThenNewlines);
  });

  /**
   * ```
   * Choices -> Sentential (choiceOp Sentential)*
   * ```
   */
  #choices = this.RULE("Choices", () => {
    this.SUBRULE(this.#sentential);
    this.MANY(() => {
      this.CONSUME(t.ChoiceOperator);
      this.SUBRULE1(this.#sentential);
    });
  });

  /**
   * ```
   * Sentential -> (nonterminal | terminal)+
   * ```
   */
  #sentential = this.RULE("Sentential", () => {
    this.AT_LEAST_ONE(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.Nonterminal) },
        { ALT: () => this.CONSUME(t.Terminal) },
      ]);
    });
  });

  /**
   * ```
   * CommentThenNewlines -> comment newline+
   * ```
   */
  #commentThenNewlines = this.RULE("CommentThenNewlines", () => {
    this.CONSUME(t.Comment);
    this.AT_LEAST_ONE(() => {
      this.CONSUME(t.Newline);
    });
  });

  /**
   * ```
   * OptionalCommentThenNewlines -> comment? newline+
   * ```
   */
  #optionalCommentThenNewlines = this.RULE(
    "OptionalCommentThenNewlines",
    () => {
      this.OPTION(() => {
        this.CONSUME(t.Comment);
      });
      this.AT_LEAST_ONE(() => {
        this.CONSUME(t.Newline);
      });
    }
  );
}

export const parser = new GrammarParser();

export const productions = parser.getGAstProductions();

export function parse(src: string) {
  const { tokens, errors: lexErrors } = lexer.tokenize(src);
  parser.input = tokens;

  const cst = parser.grammar() as GrammarCstNode;

  return {
    cst,
    lexErrors,
    parseErrors: parser.errors,
  };
}

function s(o: unknown, i = 2) {
  return JSON.stringify(o, null, i);
}

const src = String.raw`
# Lexical definition
integer -> "[0-9]+"
additiveOp -> "\+|-" # escape a regex metachar
---
# Syntax definition
Expression -> Term RestExpression
RestExpression -> eps | additiveOp Expression
Term -> integer
`;

// const { cst, lexErrors, parseErrors } = parse(src);

// console.log(s(cst, 0));

// if (lexErrors.length > 0) {
//   console.log(lexErrors);
// }

// if (parseErrors.length > 0) {
//   console.log(parseErrors);
// }

// const dts = generateCstDts(productions);
// writeFile("cst.ts", dts);
