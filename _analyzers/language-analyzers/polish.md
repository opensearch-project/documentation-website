---
layout: default
title: Polish
nav_order: 255
parent: Language analyzers
grand_parent: Analyzers
---

# Polish analyzer

The Polish language analyzer (`polish`) provides analysis for Polish text. This analyzer is part of the `analysis-stempel` plugin that must be installed before use.

## Installing the plugin

Before you can use the Polish analyzer, you must install the `analysis-stempel` plugin by running the following command:

```bash
./bin/opensearch-plugin install analysis-stempel
```
{% include copy.html %}

For more information, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/): Complete list of available OpenSearch plugins.

## Using the Polish analyzer

To use the Polish analyzer when you map an index, specify the `polish` value in the analyzer field:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "polish"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuring a custom Polish analyzer

You can configure a custom Polish analyzer by creating a custom analyzer that uses the Polish stemmer token filter. The default Polish analyzer applies the following analysis chain:

1. **Tokenizer**: `standard`
2. **Token filters**:
   - `lowercase`
   - `polish_stop` (removes Polish stop words)
   - `polish_stem` (applies Polish stemming)

### Example: Custom Polish analyzer

```json
PUT my-polish-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_polish": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "polish_stop",
            "polish_stem"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "custom_polish"
      },
      "content": {
        "type": "text",
        "analyzer": "polish"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Polish token filters

The `analysis-stempel` plugin provides the following token filters for Polish language processing.

### `polish_stop` token filter

Removes common Polish stop words from the token stream.

### `polish_stem` token filter

Applies Polish-specific stemming rules to reduce words to their root forms using the Stempel stemming algorithm.

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST _analyze
{
  "analyzer": "polish",
  "text": "Jestem programistą w Polsce i pracuję z OpenSearch"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "jest", "start_offset": 0, "end_offset": 6, "type": "<ALPHANUM>", "position": 0},
    {"token": "prograć", "start_offset": 7, "end_offset": 18, "type": "<ALPHANUM>", "position": 1},
    {"token": "polsce", "start_offset": 21, "end_offset": 27, "type": "<ALPHANUM>", "position": 3},
    {"token": "pracować", "start_offset": 30, "end_offset": 37, "type": "<ALPHANUM>", "position": 5},
    {"token": "opensearch", "start_offset": 40, "end_offset": 50, "type": "<ALPHANUM>", "position": 7}
  ]
}
```