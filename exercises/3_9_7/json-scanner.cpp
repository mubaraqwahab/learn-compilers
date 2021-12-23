#include <iostream>
#include <string>
#include <stdexcept>
#include <cstdio>
#include "json-scanner.h"

using namespace std;

namespace json
{
  Scanner::Scanner(istream& is) : _input_stream(is.rdbuf())
  {
    // Initial state
    _state = State::value;
  }

  Token Scanner::next_token()
  {
    while (_available_tokens.size() == 0) {
      _handle_current_state();
    }

    auto token = _available_tokens.front();
    _available_tokens.pop_front();
    return token;
  }

  char Scanner::_next_char()
  {
    return _input_stream.get();
  }

  void Scanner::_reconsume_in_state(State s)
  {
    _input_stream.unget();
    _state = s;
  }

  void Scanner::_emit(Token token)
  {
    _available_tokens.push_back(token);
  }

  void Scanner::_handle_current_state()
  {
    switch (_state) {
    case State::value:
      _handle_value_state();
      break;
    case State::string:
      _handle_string_state();
      break;
    case State::string_escape:
      _handle_string_escape_state();
      break;
    case State::literal_name:
      _handle_literal_name_state();
      break;
    case State::number_start:
      _handle_number_start_state();
      break;
    case State::number_int:
      _handle_number_int_state();
      break;
    case State::number_after_int:
      _handle_number_after_int_state();
      break;
    case State::number_fraction_start:
      _handle_number_fraction_start_state();
      break;
    case State::number_fraction:
      _handle_number_fraction_state();
      break;
    case State::number_exponent_sign:
      _handle_number_exponent_sign_state();
      break;
    case State::number_exponent_start:
      _handle_number_exponent_start_state();
      break;
    case State::number_exponent:
      _handle_number_exponent_state();
      break;
    default:
      throw invalid_argument("Unknown state: " + static_cast<int>(_state));
    }
  }

  void Scanner::_handle_value_state()
  {
    char c = _next_char();
    if (c == '{') {
      _emit(Token::lcurly);
    } else if (c == '[') {
      _emit(Token::lbracket);
    } else if (c == '}') {
      _emit(Token::rcurly);
    } else if (c == ']') {
      _emit(Token::rbracket);
    } else if (c == ':') {
      _emit(Token::colon);
    } else if (c == ',') {
      _emit(Token::comma);
    } else if (c == '"') {
      _state = State::string;
    } else if (c == '-') {
      _state = State::number_start;
    } else if (isdigit(c)) {
      _reconsume_in_state(State::number_start);
    } else if (islower(c)) {
      _buffer = c;
      _state = State::literal_name;
    } else if (isspace(c)) {
      // noop
    } else if (c == EOF) {
      _emit(Token::eof);
    } else {
      _emit(Token::error);
    }
  }

  void Scanner::_handle_string_state()
  {
    char c = _next_char();
    if (c == '"') {
      _emit(Token::string);
      _state = State::value;
    } else if (c == '\\') {
      _state = State::string_escape;
    } else {
      // noop
    }
  }

  void Scanner::_handle_string_escape_state()
  {
    _next_char();
    _state = State::string;
  }

  void Scanner::_handle_literal_name_state()
  {
    char c = _next_char();
    if (islower(c)) {
      _buffer += c;
    } else {
      if (_buffer == "true" || _buffer == "false") {
        _emit(Token::boolean);
      } else if (_buffer == "null") {
        _emit(Token::null);
      } else {
        _emit(Token::error);
      }
      _reconsume_in_state(State::value);
    }
  }

  void Scanner::_handle_number_start_state()
  {
    char c = _next_char();
    if (c == '0') {
      _state = State::number_after_int;
    } else if (isdigit(c)) {
      _state = State::number_int;
    } else {
      _emit(Token::error);
      _state = State::value;
    }
  }

  void Scanner::_handle_number_int_state()
  {
    char c = _next_char();
    if (isdigit(c)) {
      // noop
    } else {
      _reconsume_in_state(State::number_after_int);
    }
  }

  void Scanner::_handle_number_after_int_state()
  {
    char c = _next_char();
    if (c == '.') {
      _state = State::number_fraction_start;
    } else if (c == 'e' || c == 'E') {
      _state = State::number_exponent_sign;
    } else {
      _emit(Token::number);
      _reconsume_in_state(State::value);
    }
  }

  void Scanner::_handle_number_fraction_start_state()
  {
    char c = _next_char();
    if (isdigit(c)) {
      _state = State::number_fraction;
    } else {
      _emit(Token::error);
      _state = State::value;
    }
  }

  void Scanner::_handle_number_fraction_state()
  {
    char c = _next_char();
    if (isdigit(c)) {
      // noop
    } else if (c == 'e' || c == 'E') {
      _state = State::number_exponent_sign;
    } else {
      _emit(Token::number);
      _reconsume_in_state(State::value);
    }
  }

  void Scanner::_handle_number_exponent_sign_state()
  {
    char c = _next_char();
    if (c == '+' || c == '-') {
      _state = State::number_exponent_start;
    } else {
      _reconsume_in_state(State::number_exponent_start);
    }
  }

  void Scanner::_handle_number_exponent_start_state()
  {
    char c = _next_char();
    if (isdigit(c)) {
      _state = State::number_exponent;
    } else {
      _emit(Token::error);
      _state = State::value;
    }
  }

  void Scanner::_handle_number_exponent_state()
  {
    char c = _next_char();
    if (isdigit(c)) {
      // noop
    } else {
      _emit(Token::number);
      _reconsume_in_state(State::value);
    }
  }

  // for debugging

  string token_as_string(Token token)
  {
    switch (token) {
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
      throw std::invalid_argument("Unknown token");
    }
  }

  std::string state_as_string(State state)
  {
    switch (state) {
    case State::value:
      return "value";
    case State::string:
      return "string";
    case State::string_escape:
      return "string_escape";
    case State::literal_name:
      return "literal_name";
    case State::number_start:
      return "number_start";
    case State::number_int:
      return "number_int";
    case State::number_after_int:
      return "number_after_int";
    case State::number_fraction_start:
      return "number_fraction_start";
    case State::number_fraction:
      return "number_fraction";
    case State::number_exponent_sign:
      return "number_exponent_sign";
    case State::number_exponent_start:
      return "number_exponent_start";
    case State::number_exponent:
      return "number_exponent";
    default:
      throw std::invalid_argument("Unknown state");
    }
  }
}
