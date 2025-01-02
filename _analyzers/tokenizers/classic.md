---
layout: default
title: Classic
parent: Tokenizers
nav_order: 35

---

# Classic tokenizer

The `classic` tokenizer parses English text, applying grammatical rules to break the text into tokens. It includes specific logic to handle patterns such as:

- acronyms 
- email addresses
- domain names
- certain types of punctuation

This tokenizer works best with the English language. It may not produce optimal results for other languages, especially those with different grammatical structures.
{: .note}

The `classic` tokenizer parses text as follows:

- **Punctuation**: Splits text at most punctuation marks and removes punctuation characters. Dots that aren't followed by spaces are treated as part of the token.
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
  "text": "Visit us at example.com or email info@example.com. Call department's phone number 1-800-555-1234. P.S. 你好."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Visit",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "us",
      "start_offset": 6,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "at",
      "start_offset": 9,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "example.com",
      "start_offset": 12,
      "end_offset": 23,
      "type": "<HOST>",
      "position": 3
    },
    {
      "token": "or",
      "start_offset": 24,
      "end_offset": 26,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "email",
      "start_offset": 27,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "info@example.com",
      "start_offset": 33,
      "end_offset": 49,
      "type": "<EMAIL>",
      "position": 6
    },
    {
      "token": "Call",
      "start_offset": 51,
      "end_offset": 55,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "department's",
      "start_offset": 56,
      "end_offset": 68,
      "type": "<APOSTROPHE>",
      "position": 8
    },
    {
      "token": "phone",
      "start_offset": 69,
      "end_offset": 74,
      "type": "<ALPHANUM>",
      "position": 9
    },
    {
      "token": "number",
      "start_offset": 75,
      "end_offset": 81,
      "type": "<ALPHANUM>",
      "position": 10
    },
    {
      "token": "1-800-555-1234",
      "start_offset": 82,
      "end_offset": 96,
      "type": "<NUM>",
      "position": 11
    },
    {
      "token": "P.S.",
      "start_offset": 98,
      "end_offset": 102,
      "type": "<ACRONYM>",
      "position": 12
    },
    {
      "token": "你",
      "start_offset": 103,
      "end_offset": 104,
      "type": "<CJ>",
      "position": 13
    },
    {
      "token": "好",
      "start_offset": 104,
      "end_offset": 105,
      "type": "<CJ>",
      "position": 14
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
| `<COMPANY>`   | Tokens representing company names, typically identified by terms like "Inc.", "Ltd.", or "Co.". If these tokens aren’t produced automatically, you may need custom configurations or filters.  | 
| `<EMAIL>`     | Tokens that match email addresses, containing an `@` symbol and a domain (for example,`support@widgets.co` or `info@example.com`). |
| `<HOST>`      | Tokens matching website or host names, often containing `www.` or a domain suffix like `.com` (for example, `www.example.com` or `example.org`).  |
| `<NUM>`       | Purely numeric tokens or numeric-like sequences (for example, `1-800`, `12345`, or `3.14`).     |
| `<CJ>`        | Tokens representing Chinese or Japanese characters.   |
| `<ACRONYM_DEP>` | Deprecated acronym handling (for example, acronyms with different parsing rules in older versions). Rarely used and primarily for backward compatibility with legacy tokenizer rules. | 
