---
layout: default
title: N-gram
parent: Tokenizers
nav_order: 80
---

# N-gram tokenizer

The `ngram` tokenizer split text into overlapping n-grams (sequences of characters) of a specified length. This tokenizer is particularly useful when you want to perform partial word matching or autocomplete search functionality, as it generates substrings (character n-grams) of the original input text.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with `ngram` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_ngram_tokenizer": {
          "type": "ngram",
          "min_gram": 3,
          "max_gram": 4,
          "token_chars": ["letter", "digit"]
        }
      },
      "analyzer": {
        "my_ngram_analyzer": {
          "type": "custom",
          "tokenizer": "my_ngram_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_ngram_analyzer",
  "text": "OpenSearch"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "Sea","start_offset": 0,"end_offset": 3,"type": "word","position": 0},
    {"token": "Sear","start_offset": 0,"end_offset": 4,"type": "word","position": 1},
    {"token": "ear","start_offset": 1,"end_offset": 4,"type": "word","position": 2},
    {"token": "earc","start_offset": 1,"end_offset": 5,"type": "word","position": 3},
    {"token": "arc","start_offset": 2,"end_offset": 5,"type": "word","position": 4},
    {"token": "arch","start_offset": 2,"end_offset": 6,"type": "word","position": 5},
    {"token": "rch","start_offset": 3,"end_offset": 6,"type": "word","position": 6}
  ]
}
```

## Configuration

The `ngram` tokenizer can be configured with the following parameters:

- `min_gram`: minimum length of n-grams. Default is `1`. (Integer, _Optional_)
- `max_gram`: maximum length of n-grams. Default is `2`. (Integer, _Optional_)
- `token_chars`: character classes to be included in tokenization. The following are the possible options:
  - `letter`
  - `digit`
  - `whitespace`
  - `punctuation`
  - `symbol`
  - `custom` (Parameter `custom_token_chars` needs to also be configured in this case)
  Default is empty list (`[]`) which retains all the characters (List of strings, _Optional_)
- `custom_token_chars`: custom characters that will be included as part of the tokens. (String, _Optional_)

### Maximum difference between `min_gram` and `max_gram`

The maximum difference between `min_gram` and `max_gram` is configured using index level setting `index.max_ngram_diff` and defaults to `1`.

The following example creates index with custom `index.max_ngram_diff` setting: 

```json
PUT /my-index
{
  "settings": {
    "index.max_ngram_diff": 2, 
    "analysis": {
      "tokenizer": {
        "my_ngram_tokenizer": {
          "type": "ngram",
          "min_gram": 3,
          "max_gram": 5,
          "token_chars": ["letter", "digit"]
        }
      },
      "analyzer": {
        "my_ngram_analyzer": {
          "type": "custom",
          "tokenizer": "my_ngram_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
