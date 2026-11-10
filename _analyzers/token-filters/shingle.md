---
layout: default
title: Shingle
parent: Token filters
nav_order: 370
---

# Shingle token filter

The `shingle` token filter is used to generate word n-grams, or _shingles_, from input text. For example, for the string `slow green turtle`, the `shingle` filter creates the following one- and two-word shingles: `slow`, `slow green`, `green`, `green turtle`, and `turtle`.

This token filter is often used in conjunction with other filters to enhance search accuracy by indexing phrases rather than individual tokens. For more information, see [Phrase suggester]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/did-you-mean/#phrase-suggester).

To accelerate phrase queries such as [`match_phrase`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/), set the [`index_phrases`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-phrases/) mapping parameter on the `text` field. OpenSearch then indexes two-word shingles in a separate subfield and uses them to run phrase queries, so you don't need a custom analyzer containing a `shingle` filter.
{: .tip}

## Parameters

The `shingle` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`min_shingle_size` | Optional | Integer | The minimum number of tokens to concatenate. Default is `2`.
`max_shingle_size` | Optional | Integer | The maximum number of tokens to concatenate. The difference between `max_shingle_size` and `min_shingle_size`, plus 1 if `output_unigrams` is `true`, cannot exceed the [`index.max_shingle_diff`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-settings) index setting (default `3`). With the default settings, `max_shingle_size` can therefore exceed `min_shingle_size` by at most 2. Default is `2`.
`output_unigrams` | Optional | Boolean | Whether to include unigrams (individual tokens) as output. Default is `true`.
`output_unigrams_if_no_shingles` | Optional | Boolean | Whether to output unigrams if no shingles are generated. Default is `false`.
`token_separator` | Optional | String |  A separator used to concatenate tokens into a shingle. Default is a space (`" "`).
`filler_token` | Optional | String | A token inserted into empty positions or gaps between tokens. Gaps occur when a preceding filter, such as [`stop`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stop/), removes a token. The filler token appears only within shingles and is never emitted as a separate token. For example, if `on` is a stopword and `filler_token` is `+`, the text `tent on sale` produces the tokens `tent`, `tent +`, `+ sale`, and `sale`. Default is an underscore (`_`).

If `output_unigrams` and `output_unigrams_if_no_shingles` are both set to `true`, `output_unigrams_if_no_shingles` is ignored.
{: .note}

## Example

The following example request creates a new index named `my-shingle-index` and configures an analyzer with a `shingle` filter:

```json
PUT /my-shingle-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_shingle_filter": {
          "type": "shingle",
          "min_shingle_size": 2,
          "max_shingle_size": 2,
          "output_unigrams": true
        }
      },
      "analyzer": {
        "my_shingle_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_shingle_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /my-shingle-index/_analyze
{
  "analyzer": "my_shingle_analyzer",
  "text": "slow green turtle"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "slow",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "slow green",
      "start_offset": 0,
      "end_offset": 10,
      "type": "shingle",
      "position": 0,
      "positionLength": 2
    },
    {
      "token": "green",
      "start_offset": 5,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "green turtle",
      "start_offset": 5,
      "end_offset": 17,
      "type": "shingle",
      "position": 1,
      "positionLength": 2
    },
    {
      "token": "turtle",
      "start_offset": 11,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```