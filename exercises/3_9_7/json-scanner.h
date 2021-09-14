#ifndef JSON_SCANNER_H
#define JSON_SCANNER_H

#include <string>
#include <iostream>

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

class JSONScanner
{
public:
  JSONScanner(std::istream& is);
  TokenType next_token();
private:
  std::istream input_stream;
};

#endif /* JSON_SCANNER_H */
