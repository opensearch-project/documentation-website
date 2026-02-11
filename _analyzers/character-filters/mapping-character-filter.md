---
layout: default
title: Mapping
parent: Character filters
nav_order: 120
canonical_url: https://docs.opensearch.org/latest/analyzers/character-filters/mapping-character-filter/
---

# Mapping character filter

The `mapping` character filter accepts a map of key-value pairs for character replacement. Whenever the filter encounters a string of characters matching a key, it replaces them with the corresponding value. Replacement values can be empty strings.

The filter applies greedy matching, meaning that the longest matching pattern is matched. 

The `mapping` character filter helps in scenarios where specific text replacements are required before tokenization.

## Example 

The following request configures a `mapping` character filter that converts Roman numerals (such as I, II, or III) into their corresponding Arabic numerals (1, 2, and 3): 

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
{% include copy-curl.html %}

The response contains a token where Roman numerals have been replaced with Arabic numerals:

```json
{
  "tokens": [
    {
      "token": "1 have 3 apples and 4 oranges",
      "start_offset": 0,
      "end_offset": 32,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Parameters

You can use either of the following parameters to configure the key-value map.

| Parameter       | Required/Optional | Data type | Description    |
|:---|:---|:---|:---|
| `mappings`       | Optional          | Array      | An array of key-value pairs in the format `key => value`. Each key found in the input text will be replaced with its corresponding value. |
| `mappings_path`  | Optional          | String     | The path to a UTF-8 encoded file containing key-value mappings. Each mapping should appear on a new line in the format `key => value`. The path can be absolute or relative to the OpenSearch configuration directory. |

### Using a custom mapping character filter

You can create a custom mapping character filter by defining your own set of mappings. The following request creates a custom character filter that replaces common abbreviations in a text:

```json
PUT /test-index
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
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
GET /text-index/_analyze
{
  "tokenizer": "keyword",
  "char_filter": [ "custom_abbr_filter" ],
  "text": "FYI, updates to the workout schedule are posted. IDK when it takes effect, but we have some details. BTW, the finalized schedule will be released Monday."
}
```
{% include copy-curl.html %}

The response shows that the abbreviations were replaced:

```json
{
  "tokens": [
    {
      "token": "For your information, updates to the workout schedule are posted. I don't know when it takes effect, but we have some details. By the way, the finalized schedule will be released Monday.",
      "start_offset": 0,
      "end_offset": 153,
      "type": "word",
      "position": 0
    }
  ]
}
```
