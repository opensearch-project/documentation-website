---
layout: default
title: Ukrainian
nav_order: 340
parent: Language analyzers
grand_parent: Analyzers
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/ukrainian/
---

# Ukrainian analyzer

The Ukrainian language analyzer (`ukrainian`) provides analysis for Ukrainian text. This analyzer is part of the `analysis-ukrainian` plugin, which must be installed before use.

## Installing the plugin

Before you can use the Ukrainian analyzer, you must install the `analysis-ukrainian` plugin by running the following command:

```bash
./bin/opensearch-plugin install analysis-ukrainian
```
{% include copy.html %}

For more information, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/): Complete list of available OpenSearch plugins.

## Using the Ukrainian analyzer

To use the Ukrainian analyzer when you map an index, specify the `ukrainian` value in the analyzer field:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "ukrainian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Ukrainian language processing

The Ukrainian analyzer processes text using the following approach:

1. **Tokenization**: Splits text into individual words.
2. **Stop word removal**: Removes common Ukrainian stop words like "і", "в", "з", "для", "та", and so on.
3. **Morphological analysis**: Generates various word forms and stems for Ukrainian words.
4. **Case normalization**: Handles Ukrainian text appropriately.

The Ukrainian analyzer uses sophisticated morphological analysis that can generate multiple forms of words to improve search recall. Unlike some other language analyzers, the Ukrainian plugin does not expose individual token filters for custom configuration.

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST _analyze
{
  "analyzer": "ukrainian",
  "text": "Я програміст і працюю з OpenSearch в Україні"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "програміст", "start_offset": 2, "end_offset": 12, "type": "<ALPHANUM>", "position": 1},
    {"token": "працювати", "start_offset": 15, "end_offset": 21, "type": "<ALPHANUM>", "position": 3},
    {"token": "opensearch", "start_offset": 24, "end_offset": 34, "type": "<ALPHANUM>", "position": 5},
    {"token": "Україна", "start_offset": 37, "end_offset": 44, "type": "<ALPHANUM>", "position": 7}
  ]
}
```