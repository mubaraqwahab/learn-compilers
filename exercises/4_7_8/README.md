# JSON Parser

See [ECMA-404](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/) and [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) for JSON specifications.

TODO: Dump your LL(1) grammar here (nonterminals capitalised, terminals lowercased):

```
JSON -> ε | Value
Value -> number | string | boolean | null | Array | Object
Array -> lbracket Elements rbracket
Elements -> ε | NonEmptyElements
NonEmptyElements -> Value RightElements
RightElements -> ε | comma NonEmptyElements
Object -> lcurly Entries rcurly
Entries -> ε | NonEmptyEntries
NonEmptyEntries -> Entry RightEntries
RightEntries -> ε | comma NonEmptyEntries
Entry -> string colon Value
```

TODO: Dump FOLLOW sets of all rules <code>A &rarr; &epsilon;</code> (and why!)

```
FOLLOW(JSON) = { eof }
FOLLOW(Elements) = { rbracket }
FOLLOW(RightElements) = { rbracket }
FOLLOW(Entries) = { rcurly }
FOLLOW(RightEntries) = { rcurly }
```

TODO: JSON is quite simple to parse.
