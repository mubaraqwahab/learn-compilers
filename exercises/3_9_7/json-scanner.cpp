#include <iostream>
#include <string>
#include <stdexcept>
#include <cstdio>
#include "json-scanner.h"

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
    case Token::error:
      return "error";
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
    return input_stream.get();
  }

  void Scanner::reconsume_in_state(State s)
  {
    input_stream.unget();
    state = s;
  }

  void Scanner::emit(Token tok)
  {
    available_tokens.push_back(tok);
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
      emit(Token::lcurly);
    } else if (c == '[') {
      emit(Token::lbracket);
    } else if (c == '}') {
      emit(Token::rcurly);
    } else if (c == ']') {
      emit(Token::rbracket);
    } else if (c == ':') {
      emit(Token::colon);
    } else if (c == ',') {
      emit(Token::comma);
    } else if (c == '"') {
      state = State::string;
    } else if (c == '-') {
      state = State::number_start;
    } else if (c >= '0' && c <= '9') {
      reconsume_in_state(State::number_start);
    } else if (c >= 'a' && c <= 'z') {
    } else if (isspace(c)) {
      // noop
    } else if (c == EOF) {
      emit(Token::eof);
    } else {
      emit(Token::error);
    }
  }

  void Scanner::string_handler()
  {
    char c = next_char();
    if (c == '"') {
      emit(Token::string);
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

  void Scanner::number_start_handler()
  {
    char c = next_char();
    if (c == '0') {
      state = State::number_after_int;
    } else if (c >= '1' && c <= '9') {
      state = State::number_int;
    } else {
      emit(Token::error);
      state = State::value;
    }
  }

  void Scanner::number_int_handler()
  {
    char c = next_char();
    if (c >= '0' && c <= '9') {
      // noop
    } else {
      reconsume_in_state(State::number_after_int);
    }
  }

  void Scanner::number_after_int_handler()
  {
    char c = next_char();
    if (c == '.') {
      state = State::number_fraction_start;
    } else if (c == 'e' || c == 'E') {
      state = State::number_exponent_sign;
    } else {
      emit(Token::number);
      state = State::value;
    }
  }

  void Scanner::number_fraction_start_handler()
  {
    char c = next_char();
    if (c >= '0' && c <= '9') {
      state = State::number_fraction;
    } else {
      emit(Token::error);
      state = State::value;
    }
  }

  void Scanner::number_fraction_handler()
  {
    char c = next_char();
    if (c >= '0' && c <= '9') {
      // noop
    } else if (c == 'e' || c == 'E') {
      state = State::number_exponent_sign;
    } else {
      emit(Token::number);
      reconsume_in_state(State::value);
    }
  }

  void Scanner::number_exponent_sign_handler()
  {
    char c = next_char();
    if (c == '+' || c == '-') {
      state = State::number_exponent_start;
    } else {
      reconsume_in_state(State::number_exponent_start);
    }
  }

  void Scanner::number_exponent_start_handler()
  {
    char c = next_char();
    if (c >= '0' && c <= '9') {
      state = State::number_exponent;
    } else {
      emit(Token::error);
      state = State::value;
    }
  }

  void Scanner::number_exponent_handler()
  {
    char c = next_char();
    if (c >= '0' && c <= '9') {
      // noop
    } else {
      emit(Token::number);
      reconsume_in_state(State::value);
    }
  }

}
