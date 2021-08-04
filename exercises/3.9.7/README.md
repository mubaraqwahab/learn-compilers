# JSON Scanner

See [ECMA-404](https://datatracker.ietf.org/doc/html/rfc8259#ref-ECMA-404) and [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) for JSON specifications.

This 'hand-made' scanner works as a state machine and it's described here.

## Tokens

## State machine

The state machine starts in the [data state](#data-state).

### Data state

Consume the next input character.

* **Whitespace character:** Ignore.
* **`"` quotation mark:** Create an empty string token. Switch to the [string state](#string-state).
* **`[` left square bracket:** Emit a (what?) token.
* **`{` left curly bracket:** Emit a (what?) token.
* **`]` right square bracket:** Emit a (what?) token.
* **`}` right curly bracket:** Emit a (what?) token.
* **`:` colon:** Emit a (what?) token.
* **`,` comma:** Emit a (what?) token.
* **`-` minus:** Create a new number token and append a `-` minus to its value. Switch to the [number int start state](#number-int-start-state).
* **Digit:** Reconsume the current character in the [number int start state](#number-int-start-state).
* **ASCII lowercase character:** Reconsume the current character in the [literal state](#literal-state-todo-rename).

### Number int start state

Consume the next input character.

* **`0` zero:** Append the current input character to the value of the current number token. Switch to the [number int end state](#number-int-end-state).
* **Other digit:** Append the current character to the value of the current number token. Switch to the [number int digit state](#number-int-digit-state)
* **Anything else:** ??

### Number int digit state

Consume the next input character.

### Number int end state

Consume the next input character.

On `.`? Anything else?

### String state

Consume the next input character.

* **`\` backslash:** Switch to the [string escape state](#string-escape-state).
* **`"` quotation mark:** Emit the current string token. Switch to the [data state](#data-state).
* **Whitespace character, except space:** Emit error?
* **Anything else:** Append the current character to the value of the current string token.

### String escape state

Consume the next input character.

* **`\` backslash, or `/` solidus, or `"` quotation mark:** Append the current character to the value of the current string token.
* **`b` ASCII lowercase b:** Append a `\b` backspace character to the value of the current string token.
* **`f` ASCII lowercase f:** Append a `\f` form feed character to the value of the current string token.
* **`n` ASCII lowercase n:** Append a `\n` line feed character to the value of the current string token.
* **`r` ASCII lowercase r:** Append a `\r` carriage return character to the value of the current string token.
* **`t` ASCII lowercase t:** Append a `\t` tab character to the value of the current string token.
* **Anything else:** Append a `\` backslash and the current input character to the value of the current string token.

Switch to the [string state](#string-state).

### Literal state (TODO: rename?)

Accept true, false, null. Otherwise, emit error
