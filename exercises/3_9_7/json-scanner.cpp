#include "json-scanner.h"
#include <iostream>
#include <string>
#include <stdexcept>

using namespace std;

namespace json
{
  // for debugging
  string tok_as_string(Token tok)
  {
    switch (tok) {
    case Token::lbracket:
      return "lbracket";
    case Token::lcurly:
      return "lcurly";
    case Token::rbracket:
      return "rbracket";
    case Token::rcurly:
      return "rcurly";
    case Token::colon:
      return "colon";
    case Token::comma:
      return "comma";
    case Token::string:
      return "string";
    case Token::number:
      return "number";
    case Token::boolean:
      return "boolean";
    case Token::null:
      return "null";
    case Token::eof:
      return "eof";
    default:
      throw std::invalid_argument("Unknown token type");
    }
  }

  Scanner::Scanner(istream& is) : input_stream(is.rdbuf())
  {
    // Initial state
    state = State::value;
  }

  Token Scanner::next_token()
  {
    while (available_tokens.size() == 0) {
      handle_current_state();
    }

    auto token = available_tokens.front();
    available_tokens.pop_front();
    return token;
  }

  char Scanner::next_char()
  {
    char c;
    input_stream.get(c);
    return c;
  }

  void Scanner::handle_current_state()
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
      available_tokens.push_back(Token::lcurly);
    } else if (c == '[') {
      available_tokens.push_back(Token::lbracket);
    } else if (c == '}') {
      available_tokens.push_back(Token::rcurly);
    } else if (c == ']') {
      available_tokens.push_back(Token::rbracket);
    } else if (c == ':') {
      available_tokens.push_back(Token::colon);
    } else if (c == ',') {
      available_tokens.push_back(Token::comma);
    } else if (c == '"') {
      state = State::string;
    } else if (c == '-') {
    } else if (c >= '0' && c <= '9') {
    } else if (c >= 'a' && c <= 'z') {
    } else if (isspace(c)) {
      // noop
    }
    /* else if end of file */
    else {
      available_tokens.push_back(Token::eof);
    }
  }

  void Scanner::string_handler()
  {
    char c = next_char();
    if (c == '"') {
      available_tokens.push_back(Token::string);
      state = State::value;
    } else if (c == '\\') {
      state = State::string_escape;
    } else {
      // noop
    }
  }

  void Scanner::string_escape_handler()
  {
    next_char();
    state = State::string;
  }

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
