import type { CstNode, ICstVisitor, IToken } from "chevrotain";

export interface GrammarCstNode extends CstNode {
  name: "Grammar";
  children: GrammarCstChildren;
}

export type GrammarCstChildren = {
  Newline?: IToken[];
  LexicalDef: LexicalDefCstNode[];
  DefSeparator: IToken[];
  SyntaxDef: SyntaxDefCstNode[];
};

export interface LexicalDefCstNode extends CstNode {
  name: "LexicalDef";
  children: LexicalDefCstChildren;
}

export type LexicalDefCstChildren = {
  Comment?: IToken[];
  Newline?: IToken[];
  LexicalRule: LexicalRuleCstNode[];
};

export interface LexicalRuleCstNode extends CstNode {
  name: "LexicalRule";
  children: LexicalRuleCstChildren;
}

export type LexicalRuleCstChildren = {
  Terminal: IToken[];
  ProductionOperator: IToken[];
  Regex: IToken[];
  OptionalCommentThenNewlines: OptionalCommentThenNewlinesCstNode[];
};

export interface SyntaxDefCstNode extends CstNode {
  name: "SyntaxDef";
  children: SyntaxDefCstChildren;
}

export type SyntaxDefCstChildren = {
  CommentThenNewlines?: CommentThenNewlinesCstNode[];
  SyntaxRule: SyntaxRuleCstNode[];
};

export interface SyntaxRuleCstNode extends CstNode {
  name: "SyntaxRule";
  children: SyntaxRuleCstChildren;
}

export type SyntaxRuleCstChildren = {
  Nonterminal: IToken[];
  ProductionOperator: IToken[];
  Choices: ChoicesCstNode[];
  OptionalCommentThenNewlines: OptionalCommentThenNewlinesCstNode[];
};

export interface ChoicesCstNode extends CstNode {
  name: "Choices";
  children: ChoicesCstChildren;
}

export type ChoicesCstChildren = {
  Sentential: SententialCstNode[];
  ChoiceOperator?: IToken[];
};

export interface SententialCstNode extends CstNode {
  name: "Sentential";
  children: SententialCstChildren;
}

export type SententialCstChildren = {
  Nonterminal?: IToken[];
  Terminal?: IToken[];
};

export interface CommentThenNewlinesCstNode extends CstNode {
  name: "CommentThenNewlines";
  children: CommentThenNewlinesCstChildren;
}

export type CommentThenNewlinesCstChildren = {
  Comment: IToken[];
  Newline: IToken[];
};

export interface OptionalCommentThenNewlinesCstNode extends CstNode {
  name: "OptionalCommentThenNewlines";
  children: OptionalCommentThenNewlinesCstChildren;
}

export type OptionalCommentThenNewlinesCstChildren = {
  Comment?: IToken[];
  Newline: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT> {
  Grammar(children: GrammarCstChildren, param?: IN): OUT;
  LexicalDef(children: LexicalDefCstChildren, param?: IN): OUT;
  LexicalRule(children: LexicalRuleCstChildren, param?: IN): OUT;
  SyntaxDef(children: SyntaxDefCstChildren, param?: IN): OUT;
  SyntaxRule(children: SyntaxRuleCstChildren, param?: IN): OUT;
  Choices(children: ChoicesCstChildren, param?: IN): OUT;
  Sentential(children: SententialCstChildren, param?: IN): OUT;
  CommentThenNewlines(
    children: CommentThenNewlinesCstChildren,
    param?: IN
  ): OUT;
  OptionalCommentThenNewlines(
    children: OptionalCommentThenNewlinesCstChildren,
    param?: IN
  ): OUT;
}
