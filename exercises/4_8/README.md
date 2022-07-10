# JSON Parser

See [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) for the JSON grammar specification.

The LL(1) grammar I managed to write follows. The nonterminals are capitalised while the terminals (tokens) are in lowercase. The terminal _&epsilon;_ represents the empty string.

```
JSON ⟶ ε | Value
Value ⟶ number | string | boolean | null | Array | Object
Array ⟶ lbracket Elements rbracket
Elements ⟶ ε | NonEmptyElements
NonEmptyElements ⟶ Value RightElements
RightElements ⟶ ε | comma NonEmptyElements
Object ⟶ lcurly Entries rcurly
Entries ⟶ ε | NonEmptyEntries
NonEmptyEntries ⟶ Entry RightEntries
RightEntries ⟶ ε | comma NonEmptyEntries
Entry ⟶ string colon Value
```

The grammar is simple and straightforward to parse using a recursive descent parser. Indeed, the parser implemented here is a recursive descent parser. However, it only validates if an input text conforms to the grammar; it doesn't produce an abstract syntax tree (AST) or some other structure.

I found the FOLLOW sets of rules of the form _A &xrarr; &epsilon;_ particularly important. They are given below, but they are quite obvious from the grammar:

```
FOLLOW(JSON) = { eof }
FOLLOW(Elements) = { rbracket }
FOLLOW(RightElements) = { rbracket }
FOLLOW(Entries) = { rcurly }
FOLLOW(RightEntries) = { rcurly }
```

**PS,** `eof` is the end-of-file token.
