# JSON Scanner

See [ECMA-404](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/) and [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) for JSON specifications.

This hand-made scanner works as a state machine, as described below. This description is similar to (and based on) the one given in [the specification of the HTML tokenizer](https://html.spec.whatwg.org/#tokenization).

**Note:** The terms _scanner_, _lexer_, and _tokenizer_ are synonymous here.

## Known issues

* The JSON grammar disallows certain characters like slashes ("/" and "\\") and newlines ("\n" and "\r") within strings. (It only allows them when they are escaped.) This scanner _does_ allow them however. I didn't think of this until after almost completing the scanner.
* The scanner is somewhat error-tolerant (i.e., it returns error tokens instead of throwing exceptions on an invalid input). The way it handles error tokens is quite messy and inconsistent though. (Well, that's how it appears to me 🙂).

I wonder how standards committees verify the correctness of the grammars they specify. Especially grammars for large languages!

## Tokens

- left square bracket
- left curly bracket
- right square bracket
- right curly bracket
- colon
- comma
- string
- number
- boolean
- null
- eof (end of file)
- error

## State machine

The state machine starts in the value state.

### Value state

Consume the next input character:

- **{ left curly bracket**: emit a left curly bracket token.
- **[ left square bracket**: emit a left square bracket token.
- **} right curly bracket**: emit a right curly bracket token.
- **] right square bracket**: emit a right square bracket token.
- **colon:** emit a colon token.
- **comma:** emit a comma token.
- **" double quotes:** switch to the string state.
- **- minus:** switch to the number start state.
- **digit:** reconsume the current character in the number state.
- **lowercase character:** set the buffer to the current character. Switch to the literal name state.
- **whitespace character:** ignore.
- **eof:** emit an eof token.
- **anything else:** emit an error token.

### String state

Consume the next input character:

- **" double quote:** emit a string token. Switch to the value state.
- **\ backslash:** switch to the string escape state.
- **eof:** emit an error token. Reconsume the current character in the value state.
- **anything else:** do nothing.

### String escape state

Consume the next input character. Switch to the string state.

### Literal name state

Consume the next input character.

- **lowercase character:** append the current character to the buffer.
- **anything else:** if the string in the buffer is equal to "true" or "false", emit a boolean token. If the string is equal to "null", emit a null token. Otherwise, emit an error token. In any case, reconsume the current character in the value state.

**Note:** A buffer is technically not needed. This literal name state could instead be expanded into multiple states where each literal character causes a transition from one of the states to another (e.g. A --t--> B --r--> C --u--> D --e--> F, where the uppercase letters are states). However, that would be tedious.

### Number start state

Consume the next input character:

- **zero:** switch to the number after int state
- **any digit 1-9:** switch to the number int state
- **anything else:** emit an error token and switch to the value state.

### Number int state

Consume the next input character:

- **digit:** do nothing.
- **anything else:** reconsume the current character in the number after int state.

### Number after int state

Consume the next input character:

- **fullstop:** switch to the number fraction start state
- **lowercase or uppercase E:** switch to the number exponent sign state.
- **digit:** emit a number token and an error token. Reconsume the current character in the value state.
- **anything else:** emit a number token. Reconsume the current character in the value state.

### Number fraction start state

Consume the next input character:

- **digit:** switch to the number fraction state.
- **anything else:** emit a number token and an error token (for the erroneous dot), then reconsume in the value state.

### Number fraction state

Consume the next input character:

- **digit:** do nothing
- **lowercase or uppercase E:** switch to the number exponent sign state.
- **anything else:** emit a number token. Reconsume in the value state.

### Number exponent sign state

Consume the next input character:

- **plus or minus:** Switch to the number exponent signed start state.
- **anything else:** Reconsume in the number exponent unsigned start state.

### Number exponent signed start state

Consume the next input character:

- **digit:** switch to the number exponent state.
- **anything else:** emit a number token (for the int) and two error tokens (for the erroneous e and sign). Reconsume in the value state.

### Number exponent unsigned start state

Consume the next input character:

- **digit:** switch to the number exponent state.
- **anything else:** emit a number token and an error token, then reconsume in the value state.

### Number exponent state

Consume the next input character:

- **digit:** do nothing.
- **anything else:** emit a number token and reconsume in the value state.
