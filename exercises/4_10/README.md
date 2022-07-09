# Regex NFA to DOT

The regex grammar I came up with, in LL(1):

```
RE -> Union eof
Union -> Concat RestUnion
RestUnion -> "|" Concat RestUnion | ε
Concat -> Kleene RestConcat
RestConcat -> Kleene RestConcat | ε
Kleene -> Factor RestKleene
RestKleene -> "*" RestKleene | ε
Factor -> NonMetaChar | "(" Union ")"
NonMetaChar -> any character except "|", "*", "(", or ")"
```

The grammar doesn't allow empty regexes (or subregexes). For example, these regex strings are invalid:

* `""` (empty)
* `"|"` (empty left and/or right of union)
* `"*"` (empty left of kleene closure)

I tried but couldn't write the grammar in LL(1) to permit these string. (I did find a non-LL(1) regex grammar online, but I still couldn't put it in LL(1) form.)

**Random note:** The third case above is an invalid regex according to JavaScript. (Try `new RegExp("*")` and you'll get an error.) I don't know why.

Anyway, I split my solution for this exercise into three steps:

* Parse a regex string into an AST. (The trickiest part because of the grammar issue I mentioned above.)
* Convert the AST to an NFA. (The fun part 😁)
* Serialize the NFA in [Graphviz DOT language](https://graphviz.gitlab.io/documentation/). (The unexpectedly easy part!)

I didn't use a lexer for this exercise because the tokens are single characters; I just consumed them directly in the parser.
