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
    while (true) {
      auto tok = s->next_token();
      cout << static_cast<int>(tok) << ": " << tok_as_string(tok) << endl;
      // cout << tok_as_string(tok) << endl;
      if (tok == Token::eof) {
        break;
      }
    }
  }

  return 0;
}
