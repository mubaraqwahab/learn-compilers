#include <iostream>
#include <fstream>
#include <string>
#include "json-scanner.h"

using namespace std;
using namespace json;


int main()
{
  string INPUT_FILENAME = "example.json";
  string EXPECTED_RESULTS_FILENAME = "expected.txt";

  ifstream json_is(INPUT_FILENAME);
  ifstream expected_is(EXPECTED_RESULTS_FILENAME);

  if (!json_is || !expected_is) {
    cout << "Make sure these files exist: " << endl;
    cout << "  " << INPUT_FILENAME << endl;
    cout << "  " << EXPECTED_RESULTS_FILENAME << endl;
    return 1;
  }

  auto s = new Scanner(json_is);

  Token tok;
  int err_count = 0;
  while ((tok = s->next_token()) != Token::eof) {
    auto stringified = token_as_string(tok);

    string next_expected_tok;
    getline(expected_is, next_expected_tok);

    if (stringified != next_expected_tok) {
      err_count++;
      cout << "Error: expected token '" << next_expected_tok << "' but got '" <<
        stringified << "'." << endl;
    }
  }

  cout << "Found " << err_count << " errors while scanning." << endl;

  json_is.close();
  expected_is.close();

  return 0;
}
