---
layout: default
title: Classic
parent: Tokenizers
nav_order: 35

---

# Classic tokenizer

The `classic` tokenizer parses text, applying English language grammatical rules to break the text into tokens. It includes specific logic to handle patterns such as the following:

- Acronyms 
- Email addresses
- Domain names
- Certain types of punctuation

This tokenizer works best with the English language. It may not produce optimal results for other languages, especially those with different grammatical structures.
{: .note}

The `classic` tokenizer parses text as follows:

- **Punctuation**: Splits text on most punctuation marks and removes punctuation characters. Dots that aren't followed by spaces are treated as part of the token.
- **Hyphens**: Splits words at hyphens, except when a number is present. When a number is present in a token, the token is not split and is treated like a product number. 
- **Email**: Recognizes email addresses and hostnames and keeps them as single tokens.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `classic` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_classic_analyzer": {
          "type": "custom",
          "tokenizer": "classic"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_classic_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_classic_analyzer",
  "text": "For product AB3423, visit X&Y at example.com, email info@example.com, or call the operator's phone number 1-800-555-1234. P.S. 你好."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "For",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "product",
      "start_offset": 4,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "AB3423",
      "start_offset": 12,
      "end_offset": 18,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "visit",
      "start_offset": 20,
      "end_offset": 25,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "X&Y",
      "start_offset": 26,
      "end_offset": 29,
      "type": "<COMPANY>",
      "position": 4
    },
    {
      "token": "at",
      "start_offset": 30,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "example.com",
      "start_offset": 33,
      "end_offset": 44,
      "type": "<HOST>",
      "position": 6
    },
    {
      "token": "email",
      "start_offset": 46,
      "end_offset": 51,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "info@example.com",
      "start_offset": 52,
      "end_offset": 68,
      "type": "<EMAIL>",
      "position": 8
    },
    {
      "token": "or",
      "start_offset": 70,
      "end_offset": 72,
      "type": "<ALPHANUM>",
      "position": 9
    },
    {
      "token": "call",
      "start_offset": 73,
      "end_offset": 77,
      "type": "<ALPHANUM>",
      "position": 10
    },
    {
      "token": "the",
      "start_offset": 78,
      "end_offset": 81,
      "type": "<ALPHANUM>",
      "position": 11
    },
    {
      "token": "operator's",
      "start_offset": 82,
      "end_offset": 92,
      "type": "<APOSTROPHE>",
      "position": 12
    },
    {
      "token": "phone",
      "start_offset": 93,
      "end_offset": 98,
      "type": "<ALPHANUM>",
      "position": 13
    },
    {
      "token": "number",
      "start_offset": 99,
      "end_offset": 105,
      "type": "<ALPHANUM>",
      "position": 14
    },
    {
      "token": "1-800-555-1234",
      "start_offset": 106,
      "end_offset": 120,
      "type": "<NUM>",
      "position": 15
    },
    {
      "token": "P.S.",
      "start_offset": 122,
      "end_offset": 126,
      "type": "<ACRONYM>",
      "position": 16
    },
    {
      "token": "你",
      "start_offset": 127,
      "end_offset": 128,
      "type": "<CJ>",
      "position": 17
    },
    {
      "token": "好",
      "start_offset": 128,
      "end_offset": 129,
      "type": "<CJ>",
      "position": 18
    }
  ]
}
```

## Token types

The `classic` tokenizer produces the following token types.

| Token type    | Description  | 
| :--- | :--- | 
| `<ALPHANUM>`  | Alphanumeric tokens consisting of letters, numbers, or a combination of both.                     | 
| `<APOSTROPHE>`| Tokens containing an apostrophe, commonly used in possessives or contractions (for example, `John's`).   |
| `<ACRONYM>`   | Acronyms or abbreviations, often identified by a trailing period (for example, `P.S.` or `U.S.A.`).     |
| `<COMPANY>`   | Tokens representing company names (for example, `X&Y`). If these tokens aren't produced automatically, you may need custom configurations or filters.  | 
| `<EMAIL>`     | Tokens matching email addresses, containing an `@` symbol and a domain (for example,`support@widgets.co` or `info@example.com`). |
| `<HOST>`      | Tokens matching website or host names, often containing `www.` or a domain suffix like `.com` (for example, `www.example.com` or `example.org`).  |
| `<NUM>`       | Tokens containing only numbers or numeric-like sequences (for example, `1-800`, `12345`, or `3.14`).     |
| `<CJ>`        | Tokens representing Chinese or Japanese characters.   |
| `<ACRONYM_DEP>` | Deprecated acronym handling (for example, acronyms with different parsing rules in older versions). Rarely used---exists primarily for backward compatibility with legacy tokenizer rules. | 
