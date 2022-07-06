# First-Order-Logic Parser

```
FOL -> Impl eof
Impl -> Impl "->" Disj | Disj
Disj -> Disj "|" Conj | Conj
Conj -> Conj "&" Term | Term
Term -> "!" Term | Factor
Factor -> "T" | "F" | "(" Impl ")"
```

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
