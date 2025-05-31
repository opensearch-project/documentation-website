---
layout: default
title: Multi-get termvectors
parent: Document APIs
nav_order: 33
---

# Multi-get termvectors

The `_mtermvectors` API retrieves term vector information for multiple documents in one request. Term vectors provide detailed information about the terms (words) in a document, including term frequency, positions, offsets, and payloads. This can be useful for applications such as relevance scoring, highlighting, or similarity calculations.

<!-- spec_insert_start
api: mtermvectors
component: endpoints
-->
## Endpoints
```json
GET  /_mtermvectors
POST /_mtermvectors
GET  /{index}/_mtermvectors
POST /{index}/_mtermvectors
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: mtermvectors
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | Name of the index that contains the documents. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: mtermvectors
component: query_parameters
columns: Parameter, Data type, Description
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `field_statistics` | Boolean | If `true`, the response includes the document count, sum of document frequencies, and sum of total term frequencies. _(Default: `true`)_ |
| `fields` | List or String | Comma-separated list or wildcard expressions of fields to include in the statistics. Used as the default list unless a specific field list is provided in the `completion_fields` or `fielddata_fields` parameters. |
| `ids` | List | A comma-separated list of documents ids. You must define ids as parameter or set "ids" or "docs" in the request body |
| `offsets` | Boolean | If `true`, the response includes term offsets. _(Default: `true`)_ |
| `payloads` | Boolean | If `true`, the response includes term payloads. _(Default: `true`)_ |
| `positions` | Boolean | If `true`, the response includes term positions. _(Default: `true`)_ |
| `preference` | String | Specifies the node or shard the operation should be performed on. Random by default. _(Default: `random`)_ |
| `realtime` | Boolean | If `true`, the request is real-time as opposed to near-real-time. _(Default: `true`)_ |
| `routing` | List or String | Custom value used to route operations to a specific shard. |
| `term_statistics` | Boolean | If `true`, the response includes term frequency and document frequency. _(Default: `false`)_ |
| `version` | Integer | If `true`, returns the document version as part of a hit. |
| `version_type` | String | Specific version type. <br> Valid values are: <br> - `external`: The version number must be higher than the current version. <br> - `external_gte`: The version number must be higher than or equal to the current version. <br> - `force`: The version number is forced to be the given value. <br> - `internal`: The version number is managed internally by OpenSearch. |

<!-- spec_insert_end -->

## Example

```json
POST /_mtermvectors
{
  "docs": [
    {
      "_index": "my-index",
      "_id": "1",
      "fields": ["text"]
    },
    {
      "_index": "my-index",
      "_id": "2",
      "fields": ["text"]
    }
  ]
}
```
{% include copy-curl.html %}


## Example

Create an index with term vectors enabled:

```json
PUT /my-index
{
  "mappings": {
    "properties": {
      "text": {
        "type": "text",
        "term_vector": "with_positions_offsets_payloads"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index first document:

```json
POST /my-index/_doc/1
{
  "text": "OpenSearch is a search engine."
}
```
{% include copy-curl.html %}

Index second document:

```json
POST /my-index/_doc/2
{
  "text": "OpenSearch provides powerful features."
}
```
{% include copy-curl.html %}

### Example request

Get term vectors for multiple documents.

```json
POST /_mtermvectors
{
  "docs": [
    {
      "_index": "my-index",
      "_id": "1",
      "fields": ["text"]
    },
    {
      "_index": "my-index",
      "_id": "2",
      "fields": ["text"]
    }
  ]
}
```
{% include copy-curl.html %}

## Example response

The response displays term vector information for the two documents.

```json
{
  "docs": [
    {
      "_index": "my-index",
      "_id": "1",
      "_version": 1,
      "found": true,
      "took": 10,
      "term_vectors": {
        "text": {
          "field_statistics": {
            "sum_doc_freq": 9,
            "doc_count": 2,
            "sum_ttf": 9
          },
          "terms": {
            "a": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 2,
                  "start_offset": 14,
                  "end_offset": 15
                }
              ]
            },
            "engine": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 4,
                  "start_offset": 23,
                  "end_offset": 29
                }
              ]
            },
            "is": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 1,
                  "start_offset": 11,
                  "end_offset": 13
                }
              ]
            },
            "opensearch": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 0,
                  "start_offset": 0,
                  "end_offset": 10
                }
              ]
            },
            "search": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 3,
                  "start_offset": 16,
                  "end_offset": 22
                }
              ]
            }
          }
        }
      }
    },
    {
      "_index": "my-index",
      "_id": "2",
      "_version": 1,
      "found": true,
      "took": 0,
      "term_vectors": {
        "text": {
          "field_statistics": {
            "sum_doc_freq": 9,
            "doc_count": 2,
            "sum_ttf": 9
          },
          "terms": {
            "features": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 3,
                  "start_offset": 29,
                  "end_offset": 37
                }
              ]
            },
            "opensearch": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 0,
                  "start_offset": 0,
                  "end_offset": 10
                }
              ]
            },
            "powerful": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 2,
                  "start_offset": 20,
                  "end_offset": 28
                }
              ]
            },
            "provides": {
              "term_freq": 1,
              "tokens": [
                {
                  "position": 1,
                  "start_offset": 11,
                  "end_offset": 19
                }
              ]
            }
          }
        }
      }
    }
  ]
}
```

## Response body fields

| Field | Data type | Description |
| -------- | --------- | ----------- |
| `docs` | Array | List of document term vector responses. |
| `term_vectors` | Object | Contains term vector data per field. |
| `field_statistics` | Object | Statistics such as `doc_count`, `sum_doc_freq`, and `sum_ttf`. |
| `terms` | Object | Map of terms and their frequencies. |
| `tokens` | Array | Details for each token, such as `position`, `start_offset`, and `end_offset`. |
