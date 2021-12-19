#include "json-scanner.h"
#include <iostream>
#include <string>
#include <stdexcept>

using namespace std;

namespace json
{

// for debugging
string tok_as_string(TokenType tok)
{
  switch (tok) {
  case TokenType::lbracket:
    return "lbracket";
  case TokenType::lcurly:
    return "lcurly";
  case TokenType::rbracket:
    return "rbracket";
  case TokenType::rcurly:
    return "rcurly";
  case TokenType::colon:
    return "colon";
  case TokenType::comma:
    return "comma";
  case TokenType::string:
    return "string";
  case TokenType::number:
    return "number";
  case TokenType::boolean:
    return "boolean";
  case TokenType::null:
  // return "null";
  default:
    throw std::invalid_argument("Unknown token type");
  }
}

Scanner::Scanner(istream& is) : input_stream(is.rdbuf())
{
  // Initial state
  state = State::value;
}

TokenType Scanner::next_token()
{
  while (available_tokens.size() == 0) {
    get_state_handler();
  }

  auto token = available_tokens.front();
  available_tokens.pop_front();
  return token;
}

char Scanner::next_char()
{
  char c;
  input_stream >> c;
  return c;
}

void Scanner::get_state_handler()
{
  switch (state) {
  case State::value:
    value_handler();
    break;
  case State::string:
    string_handler();
    break;
  case State::string_escape:
    string_escape_handler();
    break;
  case State::literal_name:
    literal_name_handler();
    break;
  case State::number_start:
    number_start_handler();
    break;
  case State::number_int:
    number_int_handler();
    break;
  case State::number_after_int:
    number_after_int_handler();
    break;
  case State::number_fraction_start:
    number_fraction_start_handler();
    break;
  case State::number_fraction:
    number_fraction_handler();
    break;
  case State::number_exponent_sign:
    number_exponent_sign_handler();
    break;
  case State::number_exponent_start:
    number_exponent_start_handler();
    break;
  case State::number_exponent:
    number_exponent_handler();
    break;
  default:
    throw;
  }
}

void Scanner::value_handler()
{
  char c = next_char();
  if (c == '{') {
    available_tokens.push_back(TokenType::lcurly);
  } else if (c == '[') {
    available_tokens.push_back(TokenType::lbracket);
  } else if (c == '}') {
    available_tokens.push_back(TokenType::rcurly);
  } else if (c == ']') {
    available_tokens.push_back(TokenType::rbracket);
  } else if (c == ':') {
    available_tokens.push_back(TokenType::colon);
  } else if (c == ',') {
    available_tokens.push_back(TokenType::comma);
  } else if (c == '"') {
    //
  } else if (c == '-') {
  } else if (c >= '0' && c <= '9') {
  } else if (c >= 'a' && c <= 'z') {
  } else if (isspace(c)) {
  }
  /* else if end of file */
  else {
  }
}

void Scanner::string_handler() {}

void Scanner::string_escape_handler() {}

void Scanner::literal_name_handler() {}

void Scanner::number_start_handler() {}

void Scanner::number_int_handler() {}

void Scanner::number_after_int_handler() {}

void Scanner::number_fraction_start_handler() {}

void Scanner::number_fraction_handler() {}

void Scanner::number_exponent_sign_handler() {}

void Scanner::number_exponent_start_handler() {}

void Scanner::number_exponent_handler() {}

}
