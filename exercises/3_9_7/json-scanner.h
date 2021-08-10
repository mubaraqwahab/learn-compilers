#ifndef JSON_SCANNER_H
#define JSON_SCANNER_H

class JSONScanner
{
public:
  next_token();
private:
  _state;
  _token_buff;
}

#endif /* JSON_SCANNER_H */
