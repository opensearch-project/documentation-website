---
layout: default
title: Character group
parent: Tokenizers
nav_order: 20
has_children: false
has_toc: false
---

# Character group tokenizer

The `char_group` tokenizer splits text into tokens using specific characters as delimiters. It is suitable for situations requiring straightforward tokenization, offering a simpler alternative to pattern-based tokenizers without the added complexity.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `char_group` tokenizer. The tokenizer splits text on white space, `-`, and `:` characters:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_char_group_tokenizer": {
          "type": "char_group",
          "tokenize_on_chars": [
            "whitespace",
            "-",
            ":"
          ]
        }
      },
      "analyzer": {
        "my_char_group_analyzer": {
          "type": "custom",
          "tokenizer": "my_char_group_tokenizer"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_char_group_analyzer"
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
  "analyzer": "my_char_group_analyzer",
  "text": "Fast-driving cars: they drive fast!"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Fast",
      "start_offset": 0,
      "end_offset": 4,
      "type": "word",
      "position": 0
    },
    {
      "token": "driving",
      "start_offset": 5,
      "end_offset": 12,
      "type": "word",
      "position": 1
    },
    {
      "token": "cars",
      "start_offset": 13,
      "end_offset": 17,
      "type": "word",
      "position": 2
    },
    {
      "token": "they",
      "start_offset": 19,
      "end_offset": 23,
      "type": "word",
      "position": 3
    },
    {
      "token": "drive",
      "start_offset": 24,
      "end_offset": 29,
      "type": "word",
      "position": 4
    },
    {
      "token": "fast!",
      "start_offset": 30,
      "end_offset": 35,
      "type": "word",
      "position": 5
    }
  ]
}
```

## Parameters

The `char_group` tokenizer can be configured with the following parameters.

| **Parameter**        | **Required/Optional** | **Data type** | **Description** |
| :--- |  :--- |  :--- |  :--- |  
| `tokenize_on_chars`   | Required              | Array         | Specifies a set of characters on which the text should be tokenized. You can specify single characters (for example, `-` or `@`), including escape characters (for example, `\n`), or character classes such as `whitespace`, `letter`, `digit`, `punctuation`, or `symbol`. |
| `max_token_length`    | Optional              | Integer       | Sets the maximum length of the produced token. If this length is exceeded, the token is split into multiple tokens at the length configured in `max_token_length`. Default is `255`.  |