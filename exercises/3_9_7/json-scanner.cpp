#include "json-scanner.h"
#include <iostream>

using namespace std;

// Define JSONScanner here
JSONScanner::JSONScanner(istream& is): input_stream(is.rdbuf())
{
}

TokenType JSONScanner::next_token()
{
  return TokenType::rbracket;
}