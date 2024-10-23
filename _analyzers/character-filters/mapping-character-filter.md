---
layout: default
title: Mapping Character Filter
parent: Character Filters
nav_order: 120
---

# Mapping character filter

The `mapping character filter` allows you to define a map of `keys` and `values` for character replacements. Whenever the filter encounters a string of characters matching a key, it replaces them with the corresponding value.

Matching is greedy, meaning that the longest matching pattern is prioritized. Replacements can also be empty strings if needed.

The mapping character filter helps in scenarios where specific text replacements are required before tokenization.

## Example of the mapping filter

The following example demonstrates a mapping filter that converts Roman numerals (I, II, III, IV, etc.) into their corresponding Arabic numerals (1, 2, 3, 4, etc.). 

```json
GET /_analyze
{
  "tokenizer": "keyword",
  "char_filter": [
    {
      "type": "mapping",
      "mappings": [
        "I => 1",
        "II => 2",
        "III => 3",
        "IV => 4",
        "V => 5"
      ]
    }
  ],
  "text": "I have III apples and IV oranges"
}
```

Using the mapping filter on the following text "I have III apples and IV oranges" with the mappings provided produces the response text:

```
I have 3 apples and 4 oranges
```

## Configuring the mapping filter

There are two ways to configure the mappings. 
1. `mappings`: Provide an array of key-value pairs in the form `key => value`. For every key found, the corresponding value will replace it in the input text.
2. `mappings_path`: Specify the path to a UTF-8 encoded file containing key-value mappings. Each mapping should be on a new line in the format `key => value`. The path can be absolute or relative to the OpenSearch configuration directory.

### Using a custom mapping character filter

You can create a custom mapping character filter by defining your own set of mappings. The following example demonstrates the creation of a custom character filter that replaces common abbreviations in a text.

```json
PUT /text-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_abbr_analyzer": {
          "tokenizer": "standard",
          "char_filter": [
            "custom_abbr_filter"
          ]
        }
      },
      "char_filter": {
        "custom_abbr_filter": {
          "type": "mapping",
          "mappings": [
            "BTW => By the way",
            "IDK => I don't know",
            "FYI => For your information"
          ]
        }
      }
    }
  }
}
```

We can use our custom analyzer with the mappings we have provided to analzw the text "FYI, updates to the workout schedule are posted. IDK when it takes effect, but we have some details. BTW, the finalized schedule will be released Monday."

```json
GET /text-index/_analyze
{
  "tokenizer": "keyword",
  "char_filter": [ "custom_abbr_filter" ],
  "text": "FYI, updates to the workout schedule are posted. IDK when it takes effect, but we have some details. BTW, the finalized schedule will be released Monday."
}
```

With the custom mappings we provided the text is mapped to the `key` `value` pairs we submitted, this results in the text being updated as the mappings specified and we get the following response:

```
For your information, updates to the workout schedule are posted. I don't know when it takes effect, but we have some details. By the way, the finalized schedule will be released Monday.
```
