---
layout: default
title: Delimited payload
parent: Token filters
nav_order: 90
---

# Delimited payload token filter

The `delimited_payload` token filter in OpenSearch is used to parse and attach payloads (extra metadata) to tokens during the analysis process. This is particularly useful when you want to associate additional data (like weights, scores, or other numeric values) with tokens for use in scoring or custom query logic. The filter can handle different types of payloads, including integer, float, and strings. 

When analyzing text, `delimited_payload` token filter parses each token, extracts the payload, and attaches it to the token. This payload can later be used in queries to influence scoring, boosting, or other custom behaviors.

The payload is not returned in the query response by default, additional configuration is needed in order to be able to view the payload, see [Example with stored payload]({{site.url}}{{site.baseurl}}/analyzers/token-filters/delimited-payload/#example-with-stored-payload)

## Parameters

The `delimited_payload` token filter in OpenSearch has two _optional_ parameters:

1. `encoding`: specifies the data type of the payload attached to the tokens. This determines how the payload data is stored and interpreted during analysis and querying. There are three valid values:

    - `identity`: The payload is treated as a sequence of characters. For example: `"user|admin"` where "admin" is stored as a string.

    - `float`: The payload is interpreted as a 32-bit floating-point number using IEEE 754 format. For example: `"car|2.5"` would store 2.5 as a floating-point number.

    - `int`: The payload is interpreted as a 32-bit integer. For example: `"priority|1"` would store 1 as an integer.

2. `delimiter`: specifies character used to separate the token from its payload in the input text. By default, this is set to the pipe character (`|`).

## Example without stored payload

The following example request creates a new index named `my_index` and configures an analyzer with `delimited_payload` filter:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_payload_filter": {
          "type": "delimited_payload",
          "delimiter": "|",
          "encoding": "float"
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "whitespace",
          "filter": ["my_payload_filter"]
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
POST /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "red|1.5 fast|2.0 car|1.0"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "red",
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "fast",
      "start_offset": 8,
      "end_offset": 16,
      "type": "word",
      "position": 1
    },
    {
      "token": "car",
      "start_offset": 17,
      "end_offset": 24,
      "type": "word",
      "position": 2
    }
  ]
}
```

## Example with stored payload

You can configure the payload to be returned in the response by creating an index that stores vectors, using `term_vector` set to `with_positions_payloads` or `with_positions_offsets_payloads` in mappings of the index, see following example:

```json
PUT /visible_payloads
{
  "mappings": {
    "properties": {
      "text": {
        "type": "text",
        "term_vector": "with_positions_payloads",
        "analyzer": "custom_analyzer"
      }
    }
  },
  "settings": {
    "analysis": {
      "filter": {
        "my_payload_filter": {
          "type": "delimited_payload",
          "delimiter": "|",
          "encoding": "float"
        }
      },
      "analyzer": {
        "custom_analyzer": {
          "tokenizer": "whitespace",
          "filter": [ "my_payload_filter" ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

You can index a document into this index using following request:

```json
PUT /visible_payloads/_doc/1
{
  "text": "red|1.5 fast|2.0 car|1.0"
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
GET /visible_payloads/_termvectors/1
{
  "fields": ["text"]
}
```
{% include copy-curl.html %}

The response contains the generated tokens which include payload:

```json
{
  "_index": "visible_payloads",
  "_id": "1",
  "_version": 1,
  "found": true,
  "took": 3,
  "term_vectors": {
    "text": {
      "field_statistics": {
        "sum_doc_freq": 3,
        "doc_count": 1,
        "sum_ttf": 3
      },
      "terms": {
        "brown": {
          "term_freq": 1,
          "tokens": [
            {
              "position": 1,
              "start_offset": 10,
              "end_offset": 19,
              "payload": "QEAAAA=="
            }
          ]
        },
        "fox": {
          "term_freq": 1,
          "tokens": [
            {
              "position": 2,
              "start_offset": 20,
              "end_offset": 27,
              "payload": "P8AAAA=="
            }
          ]
        },
        "quick": {
          "term_freq": 1,
          "tokens": [
            {
              "position": 0,
              "start_offset": 0,
              "end_offset": 9,
              "payload": "QCAAAA=="
            }
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
