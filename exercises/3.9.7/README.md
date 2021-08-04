# JSON Scanner

See [ECMA-404](https://datatracker.ietf.org/doc/html/rfc8259#ref-ECMA-404) and [RFC8259](https://datatracker.ietf.org/doc/html/rfc8259) for JSON specifications.

This 'hand-made' scanner works as a state machine and it's described here.

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
* **Number:** ??
* **ASCII lowercase character:** Reconsume the current character in the [literal state](#literal-state-todo-rename).

### String state

Consume the next input character.

* **`\` backslash:** Switch to the [string escape state](#string-escape-state).
* **`"` quotation mark:** Emit the current string token. Switch to the [data state](#data-state).
* **Whitespace character, except space:** Emit error?
* **Anything else:** Append the current character to the value of the current string token.

### String escape state

Consume the next input character.

* **`\` backslash or `"` quotation mark:** Append the current character to the value of the current string token.
* **`n` ASCII lowercase n:** Append a `\n` linefeed character to the value of the current string token.
* **What else??**
* **Anything else:** Append a `\` backslash and the current input character to the value of the current string token.

### Literal state (TODO: rename?)

Accept true, false, null. Otherwise, emit error