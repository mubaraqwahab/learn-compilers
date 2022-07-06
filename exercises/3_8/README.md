# Java Lexer

See the [specification of the lexical structure of Java (SE 18)](https://docs.oracle.com/javase/specs/jls/se18/html/jls-3.html).

I implemented the lexer in TypeScript using Chevrotain, a parser building toolkit, instead of Flex (and C) as suggested in the textbook. I did this to avoid using C 😅.

Anyway, the lexer here only recognises a (small?) subset of Java. For example, it doesn't recognise floating point literals, non-decimal integer literals, character literals, etc.
