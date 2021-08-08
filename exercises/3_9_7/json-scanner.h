#ifndef JSON_SCANNER_H
#define JSON_SCANNER_H

class JSONScanner {
  _next_tokens_buff;
  _current_buff;
  state;
  next_token();
  prepend_token(int& token);
}

#endif /* JSON_SCANNER_H */