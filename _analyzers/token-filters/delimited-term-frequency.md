---
layout: default
title: Delimited term frequency
parent: Token filters
nav_order: 100
---

# Delimited term frequency token filter

The `delimited_term_freq` token filter separates a token stream into tokens with corresponding term frequencies, based on a provided delimiter. A token consists of all characters before the delimiter, and a term frequency is the integer after the delimiter. For example, if the delimiter is `|`, then for the string `foo|5`, `foo` is the token and `5` is its term frequency. If there is no delimiter, the token filter does not modify the term frequency. 

You can either use a preconfigured `delimited_term_freq` token filter or create a custom one.

## Preconfigured `delimited_term_freq` token filter

The preconfigured `delimited_term_freq` token filter uses the `|` default delimiter. To analyze text with the preconfigured token filter, send the following request to the `_analyze` endpoint:

```json
POST /_analyze
{
  "text": "foo|100",
  "tokenizer": "keyword",
  "filter": ["delimited_term_freq"],
  "attributes": ["termFrequency"],
  "explain": true
}
```
{% include copy-curl.html %}

The `attributes` array specifies that you want to filter the output of the `explain` parameter to return only `termFrequency`. The response contains both the original token and the parsed output of the token filter that includes term frequency:

```json
{
  "detail": {
    "custom_analyzer": true,
    "charfilters": [],
    "tokenizer": {
      "name": "keyword",
      "tokens": [
        {
          "token": "foo|100",
          "start_offset": 0,
          "end_offset": 7,
          "type": "word",
          "position": 0,
          "termFrequency": 1
        }
      ]
    },
    "tokenfilters": [
      {
        "name": "delimited_term_freq",
        "tokens": [
          {
            "token": "foo",
            "start_offset": 0,
            "end_offset": 7,
            "type": "word",
            "position": 0,
            "termFrequency": 100
          }
        ]
      }
    ]
  }
}
```

## Custom `delimited_term_freq` token filter

To configure a custom `delimited_term_freq` token filter, first specify the delimiter in the mapping request, in this example, `^`:

```json
PUT /testindex
{
  "settings": {
    "analysis": {
      "filter": {
        "my_delimited_term_freq": {
          "type": "delimited_term_freq",
          "delimiter": "^"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Then analyze text with the custom token filter you created:

```json
POST /testindex/_analyze
{
  "text": "foo^3",
  "tokenizer": "keyword",
  "filter": ["my_delimited_term_freq"],
  "attributes": ["termFrequency"],
  "explain": true
}
```
{% include copy-curl.html %}

The response contains both the original token and the parsed version with the term frequency:

```json
{
  "detail": {
    "custom_analyzer": true,
    "charfilters": [],
    "tokenizer": {
      "name": "keyword",
      "tokens": [
        {
          "token": "foo|100",
          "start_offset": 0,
          "end_offset": 7,
          "type": "word",
          "position": 0,
          "termFrequency": 1
        }
      ]
    },
    "tokenfilters": [
      {
        "name": "delimited_term_freq",
        "tokens": [
          {
            "token": "foo",
            "start_offset": 0,
            "end_offset": 7,
            "type": "word",
            "position": 0,
            "termFrequency": 100
          }
        ]
      }
    ]
  }
}
```

## Parameters

The following table lists all parameters the `delimited_term_freq` supports.

Parameter | Required/Optional | Description
:--- | :--- | :---
`delimiter` | Optional | The delimiter used to separate tokens from term frequencies. Must be a single non-null character. Default is `|`.