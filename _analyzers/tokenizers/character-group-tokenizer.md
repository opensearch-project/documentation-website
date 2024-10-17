---
layout: default
title: Character group tokenizer
parent: Tokenizers
nav_order: 20
has_children: false
has_toc: false
---

# Character group tokenizer

The character group tokenizer is a simple text segmentation tool that splits text into tokens based on the presence of specific characters. This tokenizer is ideal for scenarios where a simple tokenization method is required, avoiding the complexity and overhead associated with pattern-based tokenizers.

The character group tokenizer accepts the following parameters:

1. `tokenize_on_chars`: Specifies a set of characters on which the text should be tokenized. The tokenizer creates a new token upon encountering any character from the specified set, for example, single characters `(e.g., -, @)` and character classes such as `whitespace`, `letter`, `digit`, `punctuation`, and `symbol`.
2. `max_token_length`: Defines the token's maximum length. If the token exceeds the specified length, then the tokenizer splits a token at intervals defined by the parameter. Default is `255`.

## Example: Using the character group tokenizer

To tokenize the on characters such as `whitespace`, `-` and `:`, see the following example request:

```json
POST _analyze
{
  "tokenizer": {
    "type": "char_group",
    "tokenize_on_chars": [
      "whitespace",
      "-",
      ":"
    ]
  },
  "text": "Fast-cars: drive fast!"
}
```
{% include copy-curl.html %}

The following response shows that the specified characters have been removed: 

```
Fast cars drive fast
```
