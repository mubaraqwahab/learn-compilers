#include <iostream>
#include "json-scanner.h"

using namespace std;

int main()
{
  cout << "Hello, world!" << endl;

  // file
  auto s = new json::Scanner(cin);

  if (s->next_token() == json::TokenType::lcurly) {
    cout << "works" << endl;
  }

  return 0;
}
