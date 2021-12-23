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
    eof,
  };

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
    number_exponent,
  };



  class Scanner
  {
  public:
    Scanner(std::istream& is);
    Token next_token();

  private:
    std::istream _input_stream;
    State _state;
    std::deque<Token> _available_tokens;
    std::string _buffer;

    char _next_char();
    void _reconsume_in_state(State s);
    void _emit(Token token);

    // Handlers
    void _handle_current_state();
    void _handle_value_state();
    void _handle_string_state();
    void _handle_string_escape_state();
    void _handle_literal_name_state();
    void _handle_number_start_state();
    void _handle_number_int_state();
    void _handle_number_after_int_state();
    void _handle_number_fraction_start_state();
    void _handle_number_fraction_state();
    void _handle_number_exponent_sign_state();
    void _handle_number_exponent_start_state();
    void _handle_number_exponent_state();
  };

  // for debugging
  std::string token_as_string(Token token);
  std::string state_as_string(State state);
}

#endif /* JSON_SCANNER_H */
