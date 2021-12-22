#include <iostream>
#include <fstream>
#include <string>
#include "json-scanner.h"

using namespace std;
using namespace json;


int main()
{
  cout << "Type some JSON:" << endl;

  ifstream is("test.json");
  if (is.is_open()) {
    auto s = new Scanner(is);
    Token tok;
    while ((tok = s->next_token()) != Token::eof) {
      cout << tok_as_string(tok) << endl;
    }
  }

  return 0;
}
