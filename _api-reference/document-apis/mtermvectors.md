---
layout: default
title: Multi term vectors
parent: Document APIs
nav_order: 33
---

# Multi Term Vectors API

The `_mtermvectors` API retrieves term vector information for multiple documents in one request. Term vectors provide detailed information about the terms (words) in a document, including term frequency, positions, offsets, and payloads. This can be useful for applications such as relevance scoring, highlighting, or similarity calculations. For more information, see [Term vector parameter]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/#term-vector-parameter).

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
| `index` | String | The name of the index that contains the document. |

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
| `fields` | List or String | A comma-separated list or a wildcard expression specifying the fields to include in the statistics. Used as the default list unless a specific field list is provided in the `completion_fields` or `fielddata_fields` parameters. |
| `ids` | List | A comma-separated list of documents IDs. You must provide either the `docs` field in the request body or specify `ids` as a query parameter or in the request body. |
| `offsets` | Boolean | If `true`, the response includes term offsets. _(Default: `true`)_ |
| `payloads` | Boolean | If `true`, the response includes term payloads. _(Default: `true`)_ |
| `positions` | Boolean | If `true`, the response includes term positions. _(Default: `true`)_ |
| `preference` | String | Specifies the node or shard on which the operation should be performed.  See [preference query parameter]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#the-preference-query-parameter) for a list of available options.  By default the requests are routed randomly to available shard copies (primary or replica), with no guarantee of consistency across repeated queries. |
| `realtime` | Boolean | If `true`, the request is real time as opposed to near real time. _(Default: `true`)_ |
| `routing` | List or String | A custom value used to route operations to a specific shard. |
| `term_statistics` | Boolean | If `true`, the response includes term frequency and document frequency. _(Default: `false`)_ |
| `version` | Integer | If `true`, returns the document version as part of a hit. |
| `version_type` | String | The specific version type. <br> Valid values are: <br> - `external`: The version number must be greater than the current version. <br> - `external_gte`: The version number must be greater than or equal to the current version. <br> - `force`: The version number is forced to be the given value. <br> - `internal`: The version number is managed internally by OpenSearch. |

<!-- spec_insert_end -->

## Request body fields

The following table lists the fields that can be specified in the request body.

| Field | Data type | Description |
| `docs` | Array | An array of document specifications. |
| `ids` | Array of strings | A list of document IDs to retrieve. Use only when all documents share the same index specified in the request path or query. |
| `fields` | Array of strings | A list of field names for which to return term vectors. |
| `offsets` | Boolean | If `true`, the response includes character offsets for each term. *(Default: `true`)* |
| `payloads` | Boolean | If `true`, the response includes payloads for each term. *(Default: `true`)* |
| `positions` | Boolean | If `true`, the response includes token positions. *(Default: `true`)* |
| `field_statistics` | Boolean | If `true`, the response includes statistics such as document count, sum of document frequencies, and sum of total term frequencies. *(Default: `true`)* |
| `term_statistics` | Boolean | If `true`, the response includes term frequency and document frequency. *(Default: `false`)* |
| `routing` | String | A custom routing value used to identify the shard. Required if custom routing was used during indexing. |
| `version` | Integer | The specific version of the document to retrieve. |
| `version_type` | String | The type of versioning to use. Valid values: `internal`, `external`, `external_gte`. |
| `filter` | Object | Filters tokens returned in the response (for example, by frequency or position). For supported fields, see [Filtering terms]({{site.url}}{{site.baseurl}}/api-reference/document-apis/mtermvectors/#filtering-terms). |
| `per_field_analyzer` | Object | Specifies a custom analyzer to use per field. Format: `{ "field_name": "analyzer_name" }`. |

## Filtering terms

The `filter` object in the request body allows you to filter the tokens to include in the term vector response. The `filter` object supports the following fields.

| Field | Data type | Description |
| `max_num_terms` | Integer | The maximum number of terms to return. |
| `min_term_freq` | Integer | The minimum term frequency in the document required for a term to be included. |
| `max_term_freq` | Integer | The maximum term frequency in the document required for a term to be included. |
| `min_doc_freq` | Integer | The minimum document frequency across the index required for a term to be included. |
| `max_doc_freq` | Integer | The maximum document frequency across the index required for a term to be included. |
| `min_word_length` | Integer | The minimum length of the term to be included. |
| `max_word_length` | Integer | The maximum length of the term to be included. |

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

Index the first document:

```json
POST /my-index/_doc/1
{
  "text": "OpenSearch is a search engine."
}
```
{% include copy-curl.html %}

Index the second document:

```json
POST /my-index/_doc/2
{
  "text": "OpenSearch provides powerful features."
}
```
{% include copy-curl.html %}

### Example request

Get term vectors for multiple documents:

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

Alternatively, you can specify both `ids` and `fields` as query parameters:

```json
GET /my-index/_mtermvectors?ids=1,2&fields=text
```
{% include copy-curl.html %}

You can also provide document IDs in the `ids` array instead of specifying `docs`:

```json
GET /my-index/_mtermvectors?fields=text
{ 
  "ids": [
     "1", "2"
  ]
}
```
{% include copy-curl.html %}

## Example response

The response contains term vector information for the two documents:

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

The following table lists all response body fields.

| Field | Data type | Description |
| -------- | --------- | ----------- |
| `docs` | Array | A list of requested documents containing term vectors. |

Each element of the `docs` array contains the following fields.

| Field | Data type | Description |
| -------- | --------- | ----------- |
| `term_vectors` | Object | Contains term vector data for each field. |
| `term_vectors.<field>.field_statistics` | Object | Contains statistics about the field. |
| `term_vectors.<field>.field_statistics.doc_count` | Integer | The number of documents that contain at least one term in the specified field. |
| `term_vectors.<field>.field_statistics.sum_doc_freq` | Integer | The sum of document frequencies for all terms in the field. |
| `term_vectors.<field>.field_statistics.sum_ttf` | Integer | The sum of total term frequencies for all terms in the field. |
| `term_vectors.<field>.terms` | Object | A map of terms in the field, in which each term includes its frequency (`term_freq`) and associated token information. |
| `term_vectors.<field>.terms.<term>.tokens` | Array | An array of token objects for each term, including the token's `position` in the text and its character offsets (`start_offset` and `end_offset`). |
