#ifndef JSON_SCANNER_H
#define JSON_SCANNER_H

#include <string>
#include <iostream>

class JSONScanner
{
public:
  JSONScanner(std::istream input_stream);
  std::string nextToken();
};

#endif /* JSON_SCANNER_H */
