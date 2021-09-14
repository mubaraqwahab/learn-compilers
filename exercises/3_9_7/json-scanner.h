#ifndef JSON_SCANNER_H
#define JSON_SCANNER_H

#include <iostream>
#include <deque>

enum class TokenType {
  lbracket,
  lcurly,
  rbracket,
  rcurly,
  colon,
  comma,
  string,
  number,
  boolean,
  null
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
  number_exponent
};

class JSONScanner
{
public:
  JSONScanner(std::istream& is);
  TokenType next_token();

private:
  std::istream input_stream;
  State state;
  std::deque<TokenType> available_tokens;
  void get_state_handler();
  char next_char();
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

#endif /* JSON_SCANNER_H */
