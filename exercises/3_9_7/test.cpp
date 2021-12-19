#include <iostream>
#include <string>
#include "json-scanner.h"

using namespace std;
using namespace json;


int main()
{
  cout << "Hello, world!" << endl;

  // file
  auto s = new Scanner(cin);
  auto tok = s->next_token();
  cout << tok_as_string(tok) << endl;

  return 0;
}
