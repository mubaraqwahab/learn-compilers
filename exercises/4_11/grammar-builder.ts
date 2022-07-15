import type { IToken } from "chevrotain";
import { parser, parse } from "./grammar-parser.js";
import type { Nonterminal, Sentential, TokenType, Grammar } from "./types.js";

const BaseGrammarCstVisitor = parser.getBaseCstVisitorConstructor();

/**
 * Unquote a quoted string.
 * @example
 * unquote('"hello"') === 'hello';
 * unquote("'hello'") === 'hello';
 */
function unquote(s: string): string {
  return s.slice(1, -1);
}

export class GrammarBuilder extends BaseGrammarCstVisitor {
  // implements ICstNodeVisitor<any, any>
  constructor() {
    super();
    this.validateVisitor();
  }

  Grammar(ctx): Grammar {
    const tokens = this.visit(ctx.LexicalDef) as Map<TokenType, RegExp>;
    const rules = this.visit(ctx.SyntaxDef) as Map<
      Nonterminal,
      Array<Sentential>
    >;

    const startSymbol = rules.keys().next().value as string;

    return {
      tokens,
      startSymbol,
      rules,
    };
  }

  LexicalDef(ctx) {
    const tokens = new Map<TokenType, RegExp>();

    for (const lexicalRule of ctx.LexicalRule) {
      const [tokenType, pattern] = this.visit(lexicalRule);
      tokens.set(tokenType, pattern);
    }

    return tokens;
  }

  LexicalRule(ctx) {
    const tokenType = ctx.Terminal[0].image;
    const rawPattern = unquote(ctx.Regex[0].image);
    const pattern = new RegExp(rawPattern);
    return [tokenType, pattern];
  }

  SyntaxDef(ctx) {
    const rules = new Map<Nonterminal, Array<Sentential>>();

    for (const syntaxRule of ctx.SyntaxRule) {
      const [head, choices] = this.visit(syntaxRule);
      if (rules.has(head)) {
        rules.get(head)!.push(...choices);
      } else {
        rules.set(head, choices);
      }
    }

    return rules;
  }

  SyntaxRule(ctx) {
    const head = ctx.Nonterminal[0].image;
    const choices = this.visit(ctx.Choices);
    return [head, choices];
  }

  Choices(ctx) {
    const choices = ctx.Sentential.map((sentential) => this.visit(sentential));
    return choices;
  }

  Sentential(ctx) {
    function filterNonEps(tokens: IToken[]) {
      return tokens.filter((token) => token.image !== "eps");
    }

    const nonterminals = filterNonEps(ctx.Nonterminal ?? []);
    const terminals = filterNonEps(ctx.Terminal ?? []);
    const sentential = mergeSortedTokens(nonterminals, terminals);

    return sentential;
  }

  CommentThenNewlines(ctx) {}

  OptionalCommentThenNewlines(ctx) {}
}

function mergeSortedTokens(
  arr1: Array<IToken>,
  arr2: Array<IToken>
): Array<string> {
  let i = 0;
  let j = 0;

  const merged: Array<string> = [];

  // Merge two sorted arrays, like the merge in merge sort.
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i]!.startOffset <= arr2[j]!.startOffset) {
      merged.push(arr1[i]!.image);
      i++;
    } else {
      merged.push(arr2[j]!.image);
      j++;
    }
  }
  if (i === arr1.length) {
    for (; j < arr2.length; j++) {
      merged.push(arr2[j]!.image);
    }
  } else {
    for (; i < arr1.length; i++) {
      merged.push(arr1[i]!.image);
    }
  }

  return merged;
}

export function buildGrammar(src: string) {
  const { cst, lexErrors, parseErrors } = parse(src);
  const builder = new GrammarBuilder();
  const grammar = builder.visit(cst);
  return grammar;
}
