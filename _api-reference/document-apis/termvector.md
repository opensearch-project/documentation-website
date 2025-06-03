---
layout: default
title: Get termvectors
parent: Document APIs
nav_order: 32
---

# Get termvectors

The `_termvectors` API retrieves term vector information for a single document. Term vectors provide detailed information about the terms (words) in a document, including term frequency, positions, offsets, and payloads. This can be useful for applications such as relevance scoring, highlighting, or similarity calculations. For more information, see [Term vector parameter]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/#term-vector-parameter).

<!-- spec_insert_start
api: termvectors
component: endpoints
-->
## Endpoints
```json
GET  /{index}/_termvectors
POST /{index}/_termvectors
GET  /{index}/_termvectors/{id}
POST /{index}/_termvectors/{id}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: termvectors
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the index that contains the document. |
| `id` | _Optional_ | String | The unique identifier for a resource. |

<!-- spec_insert_end -->


<!-- spec_insert_start
api: termvectors
component: query_parameters
columns: Parameter, Data type, Description
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `field_statistics` | Boolean | If `true`, the response includes the document count, sum of document frequencies, and sum of total term frequencies. _(Default: `true`)_ |
| `fields` | List or String | Comma-separated list or wildcard expressions of fields to include in the statistics. Used as the default list unless a specific field list is provided in the `completion_fields` or `fielddata_fields` parameters. |
| `offsets` | Boolean | If `true`, the response includes term offsets. _(Default: `true`)_ |
| `payloads` | Boolean | If `true`, the response includes term payloads. _(Default: `true`)_ |
| `positions` | Boolean | If `true`, the response includes term positions. _(Default: `true`)_ |
| `preference` | String | Specifies the node or shard the operation should be performed on. Random by default. _(Default: `random`)_ |
| `realtime` | Boolean | If `true`, the request is real-time as opposed to near-real-time. _(Default: `true`)_ |
| `routing` | List or String | A custom value used to route operations to a specific shard. |
| `term_statistics` | Boolean | If `true`, the response includes term frequency and document frequency. _(Default: `false`)_ |
| `version` | Integer | If `true`, returns the document version as part of a hit. |
| `version_type` | String | Specific version type. <br> Valid values are: <br> - `external`: The version number must be greater than the current version. <br> - `external_gte`: The version number must be greater than or equal to the current version. <br> - `force`: The version number is forced to be the given value. <br> - `internal`: The version number is managed internally by OpenSearch. |

<!-- spec_insert_end -->

## Request body example

```json
{
  "fields": ["text"],
  "term_statistics": true
}
```

## Example

Create an index.

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

Index a document.

```json
POST /my-index/_doc/1
{
  "text": "OpenSearch is a search engine."
}
```
{% include copy-curl.html %}

### Example request

Retrieve term vectors.

```json
GET /my-index/_termvectors/1
{
  "fields": ["text"],
  "term_statistics": true
}
```
{% include copy-curl.html %}

### Example response

The response displays term vector information.

```json
{
  "_index": "my-index",
  "_id": "1",
  "_version": 1,
  "found": true,
  "took": 1,
  "term_vectors": {
    "text": {
      "field_statistics": {
        "sum_doc_freq": 5,
        "doc_count": 1,
        "sum_ttf": 5
      },
      "terms": {
        "a": {
          "doc_freq": 1,
          "ttf": 1,
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
          "doc_freq": 1,
          "ttf": 1,
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
          "doc_freq": 1,
          "ttf": 1,
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
          "doc_freq": 1,
          "ttf": 1,
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
          "doc_freq": 1,
          "ttf": 1,
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
}
```

## Response body fields

| Field | Data type | Description |
| -------- | --------- | ----------- |
| `term_vectors` | Object | Contains term vector data per field. |
| `field_statistics` | Object | Statistics such as `doc_count`, `sum_doc_freq`, and `sum_ttf`. |
| `terms` | Object | Map of terms and their frequencies. |
| `tokens` | Array | Details for each token, such as `position`, `start_offset`, and `end_offset`. |
