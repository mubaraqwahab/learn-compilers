#include <iostream>
#include "json-scanner.h"

using namespace std;

int main()
{
  cout << "Hello, world!" << endl;

  // file
  auto s = new JSONScanner(cin);

  if (s->next_token() == TokenType::lcurly) {
    cout << "works" << endl;
  }

  return 0;
}
