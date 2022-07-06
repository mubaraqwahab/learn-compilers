# First-Order-Logic Parser

The grammar for the simple logic expressions follows (terminals are in lowercase or enclosed in quotes):

```
FOL -> Impl eof
Impl -> Impl "->" Disj | Disj
Disj -> Disj "|" Conj | Conj
Conj -> Conj "&" Term | Term
Term -> "!" Term | Factor
Factor -> "T" | "F" | "(" Impl ")"
```

**Note:** FOL stands for first-order logic, Impl stands for implication, Disj stands for disjunction, and Conj stands for conjunction.

Here's the grammar rewritten in LL(1) form:

```
FOL -> Impl eof
Impl -> Disj RImpl
RImpl -> "->" Disj RImpl | eps
Disj -> Conj RDisj
RDisj ->  "|" Conj RDisj | eps
Conj -> Term RConj
RConj -> "&" Term RConj | eps
Term -> "!" Term | Factor
Factor -> "T" | "F" | "(" Impl ")"
```

Writing the recursive descent parser to evaluate a logic expression was tricky due to tokens like RImpl that only represent a partial (i.e. not standalone) part of an expression. Alhamdulillah, however, I found an excellent article to help me with this issue: [Creating a Recursive Descent Parser](https://kentdlee.github.io/Pages/_build/html/_static/papers/ll1.html).

The gist of the solution is quoted here (emphasis mine) (the article builds an AST, but it's still very much applicable to my problem):

> 1. Construct a function for each non-terminal. Each of these functions should return a node in the abstract syntax tree.
> 2. <b>Depending on your grammar, some non-terminal functions may require an input parameter of an abstract syntax tree (ast) to be able to complete a partial ast that is recognized by the non-terminal function.</b>
> 3. Each non-terminal function should call a function to get the next token as needed. If the next token is not needed, the non-terminal function should call another function to put back the token. Your parser (if it is based on an LL(1) grammar, should never have to get or put back more than one token at a time.
> 4. The body of each non-terminal function should be be a series of if statements that choose which production right-handside to expand depending on the value of the next token.

**Random thought:** I wonder why the book says "first-order logic" instead of "propositional logic" when there are no quantifiers (i.e. &forall;, &exist;) in the expressions it specifies. (See: [first-order logic](https://en.wikipedia.org/wiki/First-order_logic); [propositional logic](https://en.wikipedia.org/wiki/Propositional_logic).)