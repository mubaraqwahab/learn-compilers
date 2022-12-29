import { CstParser } from "chevrotain";
import { tokens, tokensDict as t } from "./algebra-lexer.js";

export class AlgebraParser extends CstParser {
  constructor() {
    super(tokens, {
      maxLookahead: 1,
    });

    this.performSelfAnalysis();
  }

  /**
   * ```
   * program -> expression Semi
   * ```
   */
  program = this.RULE("program", () => {
    this.SUBRULE(this.expression);
    this.CONSUME(t.Semi);
  });

  /**
   * ```
   * expression -> term ((PlusOp | MinusOp) term)*
   * ```
   */
  expression = this.RULE("expression", () => {
    this.SUBRULE(this.term);
    this.AT_LEAST_ONE(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.PlusOp) },
        { ALT: () => this.CONSUME(t.MinusOp) },
      ]);
      this.SUBRULE2(this.term);
    });
  });

  /**
   * ```
   * term -> factor ((MulOp | DivOp) factor)*
   * ```
   */
  term = this.RULE("term", () => {
    this.SUBRULE(this.factor);
    this.AT_LEAST_ONE(() => {
      this.OR([
        { ALT: () => this.CONSUME(t.MulOp) },
        { ALT: () => this.CONSUME(t.DivOp) },
      ]);
      this.SUBRULE2(this.factor);
    });
  });

  /**
   * ```
   * factor -> MinusOp factor | LParen expression RParen | Int
   * ```
   */
  factor = this.RULE("factor", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(t.MinusOp);
          this.SUBRULE(this.factor);
        },
      },
      {
        ALT: () => {
          this.CONSUME(t.LParen);
          this.SUBRULE(this.expression);
          this.CONSUME(t.RParen);
        },
      },
      {
        ALT: () => {
          this.CONSUME(t.Int);
        },
      },
    ]);
  });
}

export const parser = new AlgebraParser();
