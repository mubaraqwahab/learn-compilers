#ifndef JSON_SCANNER_H
#define JSON_SCANNER_H

#include <iostream>
#include <deque>
#include <string>

namespace json
{
  enum class Token {
    lbracket,
    lcurly,
    rbracket,
    rcurly,
    colon,
    comma,
    string,
    number,
    boolean,
    null,
    error,
    eof
  };

  // for debugging
  std::string tok_as_string(Token tok);

  enum class State {
    value,
    string,
    string_escape,
    literal_name,
    number_start,
    number_int,
    number_after_int,
    number_fraction_start,
    number_fraction,
    number_exponent_sign,
    number_exponent_start,
    number_exponent
  };

  class Scanner
  {
  public:
    Scanner(std::istream& is);
    Token next_token();

  private:
    std::istream input_stream;
    State state;
    std::deque<Token> available_tokens;
    void handle_current_state();
    char next_char();
    void reconsume_in_state(State s);
    void emit(Token tok);
    // Handlers
    void value_handler();
    void string_handler();
    void string_escape_handler();
    void literal_name_handler();
    void number_start_handler();
    void number_int_handler();
    void number_after_int_handler();
    void number_fraction_start_handler();
    void number_fraction_handler();
    void number_exponent_sign_handler();
    void number_exponent_start_handler();
    void number_exponent_handler();
  };
}

#endif /* JSON_SCANNER_H */
