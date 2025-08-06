---
layout: default
title: Term vectors
parent: Document APIs
nav_order: 32
---

# Term Vectors API

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
| `index` | **Required** | String | The name of the index containing the document. |
| `id` | _Optional_ | String | The unique identifier of the document. |

<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `field_statistics` | Boolean | If `true`, the response includes the document count, sum of document frequencies, and sum of total term frequencies. *(Default: `true`)* |
| `fields` | List or String | A comma-separated list or a wildcard expression specifying the fields to include in the statistics. Used as the default list unless a specific field list is provided in the `completion_fields` or `fielddata_fields` parameters. |
| `offsets` | Boolean | If `true`, the response includes term offsets. *(Default: `true`)* |
| `payloads` | Boolean | If `true`, the response includes term payloads. *(Default: `true`)* |
| `positions` | Boolean | If `true`, the response includes term positions. *(Default: `true`)* |
| `preference` | String | Specifies the node or shard on which the operation should be performed. See [preference query parameter]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#the-preference-query-parameter) for a list of available options. By default the requests are routed randomly to available shard copies (primary or replica), with no guarantee of consistency across repeated queries. |
| `realtime` | Boolean | If `true`, the request is real time as opposed to near real time. *(Default: `true`)* |
| `routing` | List or String | A custom value used to route operations to a specific shard. |
| `term_statistics` | Boolean | If `true`, the response includes term frequency and document frequency. *(Default: `false`)* |
| `version` | Integer | If `true`, returns the document version as part of a hit. |
| `version_type` | String | The specific version type. <br> Valid values are: <br> - `external`: The version number must be greater than the current version. <br> - `external_gte`: The version number must be greater than or equal to the current version. <br> - `force`: The version number is forced to be the given value. <br> - `internal`: The version number is managed internally by OpenSearch. |

## Request body fields

The following table lists the fields that can be specified in the request body.

| Field | Data type | Description |
| `doc` | Object | A document to analyze. If provided, the API does not retrieve an existing document from the index but uses the provided content. |
| `fields` | Array of strings | A list of field names for which to return term vectors. |
| `offsets` | Boolean | If `true`, the response includes character offsets for each term. *(Default: `true`)* |
| `payloads` | Boolean | If `true`, the response includes payloads for each term. *(Default: `true`)* |
| `positions` | Boolean | If `true`, the response includes token positions. *(Default: `true`)* |
| `field_statistics` | Boolean | If `true`, the response includes statistics such as document count, sum of document frequencies, and sum of total term frequencies. *(Default: `true`)* |
| `term_statistics` | Boolean | If `true`, the response includes term frequency and document frequency. *(Default: `false`)* |
| `routing` | String | A custom routing value used to identify the shard. Required if custom routing was used during indexing. |
| `version` | Integer | The specific version of the document to retrieve. |
| `version_type` | String | The type of versioning to use. Valid values: `internal`, `external`, `external_gte`, `force`. |
| `filter`| Object | Allows filtering of tokens returned in the response (for example, by frequency or position). See [Filtering terms]({{site.url}}{{site.baseurl}}/api-reference/document-apis/termvector/#filtering-terms) for available options. |
| `per_field_analyzer` | Object | Specifies a custom analyzer to use per field. Format: `{ "field_name": "analyzer_name" }`. | 
| `preference` | String | Specifies shard or node routing preferences. See [preference query parameter]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#the-preference-query-parameter).|

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

Create an index:

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

Index the document:

```json
POST /my-index/_doc/1
{
  "text": "OpenSearch is a search engine."
}
```
{% include copy-curl.html %}

### Example request

Retrieve the term vectors:

```json
GET /my-index/_termvectors/1
{
  "fields": ["text"],
  "term_statistics": true
}
```
{% include copy-curl.html %}

Alternatively, you can provide `fields` and `term_statistics` as query parameters:

```json
GET /my-index/_termvectors/1?fields=text&term_statistics=true
```
{% include copy-curl.html %}

### Example response

The response displays term vector information:

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

The following table lists all response body fields.

| Field | Data type | Description |
| `term_vectors` | Object | Contains term vector data for each specified field. |
| `term_vectors.text` | Object | Contains term vector details for the `text` field. |
| `term_vectors.text.field_statistics` | Object | Contains statistics for the entire field. Present only if `field_statistics` is `true`. |
| `term_vectors.text.field_statistics.doc_count` | Integer | The number of documents that contain at least one term in the specified field. |
| `term_vectors.text.field_statistics.sum_doc_freq` | Integer | The sum of document frequencies for all terms in the field. |
| `term_vectors.text.field_statistics.sum_ttf` | Integer | The sum of total term frequencies (including repetitions) for all terms in the field. |
| `term_vectors.text.terms` | Object | A map, in which each key is a term and each value contains details about that term. |
| `term_vectors.text.terms.<term>.term_freq` | Integer | The number of times the term appears in the document. |
| `term_vectors.text.terms.<term>.doc_freq` | Integer | The number of documents containing the term. Present only if `term_statistics` is `true`. |
| `term_vectors.text.terms.<term>.ttf` | Integer | The total term frequency across all documents. Present only if `term_statistics` is `true`. |
| `term_vectors.text.terms.<term>.tokens` | Array | A list of token objects providing information about individual term instances. |
| `term_vectors.text.terms.<term>.tokens[].position` | Integer | The position of the token within the text. Present only if `positions` is `true`. |
| `term_vectors.text.terms.<term>.tokens[].start_offset` | Integer | The start character offset of the token. Present only if `offsets` is `true`. |
| `term_vectors.text.terms.<term>.tokens[].end_offset` | Integer | The end character offset of the token. Present only if `offsets` is `true`. |
| `term_vectors.text.terms.<term>.tokens[].payload` | String (Base64) | Optional payload data associated with the token. Present only if `payloads` is `true` and available. |
