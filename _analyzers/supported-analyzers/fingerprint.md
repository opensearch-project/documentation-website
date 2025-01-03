---
layout: default
title: Fingerprint analyzer
parent: Analyzers
nav_order: 60
---

# Fingerprint analyzer

The `fingerprint` analyzer creates a text fingerprint. The analyzer sorts and deduplicates the terms (tokens) generated from the input and then concatenates them using a separator. It is commonly used for data deduplication because it produces the same output for similar inputs containing the same words, regardless of word order.

The `fingerprint` analyzer comprises the following components:

- Standard tokenizer
- Lowercase token filter
- ASCII folding token filter
- Stop token filter
- Fingerprint token filter

## Parameters

The `fingerprint` analyzer can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`separator` | Optional | String | Specifies the character used to concatenate the terms after they have been tokenized, sorted, and deduplicated. Default is an empty space (` `).
`max_output_size` | Optional | Integer | Defines the maximum size of the output token. If the concatenated fingerprint exceeds this size, it will be truncated. Default is `255`.
`stopwords` | Optional | String or list of strings | A custom or predefined list of stopwords. Default is `_none_`.
`stopwords_path` | Optional | String | The path (absolute or relative to the config directory) to the file containing a list of stopwords.


## Example

Use the following command to create an index named `my_custom_fingerprint_index` with a `fingerprint` analyzer:

```json
PUT /my_custom_fingerprint_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_fingerprint_analyzer": {
          "type": "fingerprint",
          "separator": "-",
          "max_output_size": 50,
          "stopwords": ["to", "the", "over", "and"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "my_custom_fingerprint_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /my_custom_fingerprint_index/_analyze
{
  "analyzer": "my_custom_fingerprint_analyzer",
  "text": "The slow turtle swims over to the dog"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "dog-slow-swims-turtle",
      "start_offset": 0,
      "end_offset": 37,
      "type": "fingerprint",
      "position": 0
    }
  ]
}
```

## Further customization

If further customization is needed, you can define an analyzer with additional `fingerprint` analyzer components:

```json
PUT /custom_fingerprint_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_fingerprint": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "asciifolding",
            "fingerprint"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
