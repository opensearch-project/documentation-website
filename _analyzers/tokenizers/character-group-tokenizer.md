---
layout: default
title: Character group tokenizer
parent: Tokenizers
nav_order: 20
has_children: false
has_toc: false
---

# Character group tokenizer

The character group tokenizer is designed to segment text into tokens based on the presence of specific characters. This tokenizer is ideal for scenarios where a straightforward tokenization approach is required, avoiding the complexity and overhead associated with pattern-based tokenizers.

The character group tokenizer accepts the following parameters:
1. `tokenize_on_chars`: Specifies a set of characters on which the text should be tokenized. When any character from this set is encountered, a new token is created. For example, single characters `(e.g., -, @)` and character classes such as `whitespace`, `letter`, `digit`, `punctuation`, and `symbol`.
4. `max_token_length`: This parameter defines the maximum length allowed for a token. If a token exceeds this specified length, it will be split at intervals defined by `max_token_length`. The default value is `255`.

## Example of the character group tokenizer

We can tokenize the on characters such as `whitespace`, `-` and `:`.

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

By analyzing the text "Fast-cars: drive fast!", we can see the specified characters have been removed: 

```
Fast cars drive fast
```
