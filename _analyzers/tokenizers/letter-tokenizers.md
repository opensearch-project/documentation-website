---
layout: default
title: Letter Tokenizer
parent: Tokenizers
nav_order: 60
---

# Letter tokenizer

The `letter` tokenizer splits text into words when it finds any character that isn't a letter. It works well for many European languages but struggles with some Asian languages where words aren’t separated by spaces.


## Example 

Let's use the `letter` tokenizer to process text by breaking it into individual terms whenever it encounters non-letter characters.


```json
POST _analyze
{
  "tokenizer": "letter",
  "text": "Cats 4EVER love chasing butterflies and rainbows!"
}

```
{% include copy-curl.html %}

Analyzing the text "Cats 4EVER love chasing butterflies and rainbows!" with the `letter` tokenizer produces the output: 

```
"Cats", "EVER", "love", "chasing", "butterflies", "and", "rainbows"
```

## Configuration

The letter tokenizer does not have any customizable settings.
