#include <iostream>
#include <fstream>
#include <string>
#include "json-scanner.h"

using namespace std;
using namespace json;


int main()
{
  ifstream is("test.json");
  if (is.is_open()) {
    auto s = new Scanner(is);
    Token tok;
    while ((tok = s->next_token()) != Token::eof) {
      cout << tok_as_string(tok) << endl;
    }
    is.close();
  }

  return 0;
}
