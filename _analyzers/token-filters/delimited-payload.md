---
layout: default
title: Delimited payload
parent: Token filters
nav_order: 90
---

# Delimited payload token filter

The `delimited_payload` token filter is used to parse tokens containing payloads during the analysis process. For example, the string `red|1.5 fast|2.0 car|1.0` is parsed into the tokens `red` (with a payload of `1.5`), `fast` (with a payload of `2.0`), and `car` (with a payload of `1.0`). This is particularly useful when your tokens include additional associated data (like weights, scores, or other numeric values) that you can use for scoring or custom query logic. The filter can handle different types of payloads, including integers, floats, and strings, and attach payloads (extra metadata) to tokens.

When analyzing text, the `delimited_payload` token filter parses each token, extracts the payload, and attaches it to the token. This payload can later be used in queries to influence scoring, boosting, or other custom behaviors.

Payloads are stored as Base64-encoded strings. By default, payloads are not returned in the query response along with the tokens. To return the payloads, you must configure additional parameters. For more information, see [Example with a stored payload]({{site.url}}{{site.baseurl}}/analyzers/token-filters/delimited-payload/#example-without-a-stored-payload).

## Parameters

The `delimited_payload` token filter has two parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`encoding` | Optional | String | Specifies the data type of the payload attached to the tokens. This determines how the payload data is interpreted during analysis and querying.<br>Valid values are:<br><br>- `float`: The payload is interpreted as a 32-bit floating-point number using IEEE 754 format (for example, `2.5` in `car|2.5`).<br>- `identity`: The payload is interpreted as a sequence of characters (for example, in `user|admin`, `admin` is interpreted as a string).<br>- `int`: The payload is interpreted as a 32-bit integer (for example, `1` in `priority|1`).<br> Default is `float`.
`delimiter` | Optional | String | Specifies the character that separates the token from its payload in the input text. Default is the pipe character (`|`).

## Example without a stored payload

The following example request creates a new index named `my_index` and configures an analyzer with a `delimited_payload` filter:

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

## Example with a stored payload

To configure the payload to be returned in the response, create an index that stores term vectors and set `term_vector` to `with_positions_payloads` or `with_positions_offsets_payloads` in the index mappings. For example, the following index is configured to store term vectors:

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

You can index a document into this index using the following request:

```json
PUT /visible_payloads/_doc/1
{
  "text": "red|1.5 fast|2.0 car|1.0"
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /visible_payloads/_termvectors/1
{
  "fields": ["text"]
}
```
{% include copy-curl.html %}

The response contains the generated tokens, which include payloads:

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
