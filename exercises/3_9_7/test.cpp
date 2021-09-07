#include <iostream>
#include "json-scanner.h"

using namespace std;

int main()
{
  cout << "Hello, world!" << endl;

  // file
  auto s = new JSONScanner(cin);
  // s.nextToken() // token

  if (s.next_token() == = TokenType::rbracket) {
    cout << "works"
  }

  return 0;
}
