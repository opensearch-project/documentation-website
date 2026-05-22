---
layout: default
title: Explain
parent: Search APIs
nav_order: 40
redirect_from:
 - /opensearch/rest-api/explain/
 - /api-reference/explain/
---

# Explain API
**Introduced 1.0**
{: .label .label-purple }

The Explain API returns detailed information about why a specific document matches or does not match a query. This API helps you understand how OpenSearch calculates the relevance score (`_score`) for each search result, making it an essential tool for debugging search relevance issues and optimizing queries.

OpenSearch uses a probabilistic ranking framework called [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) to calculate relevance scores. Okapi BM25 is based on the original [term frequency/inverse document frequency (TF/IDF)](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/package-summary.html#scoring) framework used by Apache Lucene.

Using the Explain API is expensive in terms of both resources and time. For production clusters, we recommend using it sparingly for the purpose of troubleshooting.
{: .warning }

## Limitations

The Explain API does not support the `search_pipeline` parameter. Sending a request with an inline or named search pipeline results in a `parsing_exception` error. This applies to all query types.

To use search pipeline processors with `explain`, provide the `explain=true` query parameter to the [Search API]({{site.url}}{{site.baseurl}}/api-reference/search/). For more information about using `explain` with hybrid queries, see [Hybrid search explain]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/explain/).

<!-- spec_insert_start
api: explain
component: endpoints
-->
## Endpoints
```json
GET  /{index}/_explain/{id}
POST /{index}/_explain/{id}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The document ID. |
| `index` | **Required** | String | The index to search. Only a single index name can be specified. |

## Query parameters

You must specify the index and document ID. All other parameters are optional.

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
`analyzer` | String | The analyzer to use for the `q` query string. Only valid when `q` is used. | No
`analyze_wildcard` | Boolean | Whether to analyze wildcard and prefix queries in the `q` string. Only valid when `q` is used. Default is `false`. | No
`default_operator` | String | The default Boolean operator (`AND` or `OR`) for the `q` query string. Only valid when `q` is used. Default is `OR`.  | No
`df` | String | The default field to search if no field is specified in the `q` string. Only valid when `q` is used. | No
`lenient` | Boolean | Specifies whether OpenSearch should ignore format-based query failures (for example, querying a text field for an integer). Default is `false`. | No
`preference` | String | Specifies a preference of which shard to retrieve results from. Available options are `_local`, which tells the operation to retrieve results from a locally allocated shard replica, and a custom string value assigned to a specific shard replica. By default, OpenSearch executes the explain operation on random shards. | No
`q` | String | A query string in [Lucene syntax]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/#query-string-syntax). When used, you can configure query behavior using the `analyzer`, `analyze_wildcard`, `default_operator`, `df`, and `stored_fields` parameters. | No
`stored_fields` | String | A comma-separated list of stored fields to return. If omitted, only `_source` is returned. | No
`routing` | String | A value used to route the operation to a specific shard. | No
`_source` | String | Whether to include the `_source` field in the response body. Valid values are `true` (include full `_source`), `false` (exclude `_source`), or a comma-separated list of source fields to include in the query response. By default, when not specified, the `_source` field is not returned in the Explain API response. | No
`_source_excludes` | String | A comma-separated list of source fields to exclude in the query response. | No
`_source_includes` | String | A comma-separated list of source fields to include in the query response. | No

## Request body fields

The request body contains the query to explain against the specified document. The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`query` | Object | The query to execute against the document. Uses the same query syntax as the [Search API]({{site.url}}{{site.baseurl}}/api-reference/search/). For more information about query types, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

## Example: Explaining a match query

The following example explains why document `1` in the `products` index matches a query for the term "computer" in the `name` field:

<!-- spec_insert_start
component: example_code
rest: POST /products/_explain/1
body: |
{
  "query": {
    "match": {
      "name": "computer"
    }
  }
}
-->
{% capture step1_rest %}
POST /products/_explain/1
{
  "query": {
    "match": {
      "name": "computer"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.explain(
  id = "1",
  index = "products",
  body =   {
    "query": {
      "match": {
        "name": "computer"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The Explain API returns a response that includes whether the document matched the query and a detailed breakdown of the score calculation. The explanation includes the BM25 scoring formula components: term frequency (`tf`), inverse document frequency (`idf`), and field length normalization:

<details markdown="block">
  <summary>
    Response for explaining a match query
  </summary>
  {: .text-delta}

```json
{
  "_index": "products",
  "_id": "1",
  "matched": true,
  "explanation": {
    "value": 0.31506687,
    "description": "weight(name:computer in 0) [PerFieldSimilarity], result of:",
    "details": [
      {
        "value": 0.31506687,
        "description": "score(freq=1.0), computed as boost * idf * tf from:",
        "details": [
          {
            "value": 0.6931472,
            "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
            "details": [
              {
                "value": 2,
                "description": "n, number of documents containing term",
                "details": []
              },
              {
                "value": 4,
                "description": "N, total number of documents with field",
                "details": []
              }
            ]
          },
          {
            "value": 0.45454544,
            "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
            "details": [
              {
                "value": 1.0,
                "description": "freq, occurrences of term within document",
                "details": []
              },
              {
                "value": 1.2,
                "description": "k1, term saturation parameter",
                "details": []
              },
              {
                "value": 0.75,
                "description": "b, length normalization parameter",
                "details": []
              },
              {
                "value": 2.0,
                "description": "dl, length of field",
                "details": []
              },
              {
                "value": 2.0,
                "description": "avgdl, average length of field",
                "details": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

</details>

## Example: Using the query string parameter

You can use the `q` parameter to specify a query using Lucene query string syntax instead of providing a request body. The following example explains why document `1` matches the query string "name:laptop":

<!-- spec_insert_start
component: example_code
rest: GET /products/_explain/1?q=name:laptop
-->
{% capture step1_rest %}
GET /products/_explain/1?q=name:laptop
{% endcapture %}

{% capture step1_python %}


response = client.explain(
  id = "1",
  index = "products",
  params = { "q": "name:laptop" },
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Response body fields

The response contains detailed information about whether the document matched the query and how the relevance score was calculated. The following table lists the response body fields.

Field | Data type | Description
:--- | :--- | :---
`_index` | String | The name of the index containing the document.
`_id` | String | The document ID.
`matched` | Boolean | Whether the document matches the query. If `true`, the document is a match and has a relevance score. If `false`, the document does not match the query.
`explanation` | Object | The explanation of the score calculation. Contains the following nested fields: `value` (the calculated score or score component), `description` (a human-readable description of the calculation), and `details` (an array of sub-explanations for nested calculations).
`explanation.value` | Float | The numeric result of the score calculation. For the top-level explanation, this is the final relevance score. For nested explanations, this represents intermediate calculation values.
`explanation.description` | String | A description of the calculation being performed. For BM25 scoring, this typically describes the scoring formula components, such as term frequency (`tf`), inverse document frequency (`idf`), and normalization factors.
`explanation.details` | Array of objects | An array of nested explanation objects that break down the score calculation into component parts. Each detail object has the same structure as the explanation object (with `value`, `description`, and `details` fields).
`get` | Object | The document metadata and source data. Only included when the `_source` or `stored_fields` parameters are used. Contains fields such as `_seq_no`, `_primary_term`, `found`, and `_source`.
`get._source` | Object | The document's original JSON content. Only included when the `_source` parameter is specified.

## BM25 scoring components

The explanation details include the following BM25 scoring components.

Field | Description
:--- | :---
`idf` | The inverse document frequency. Measures how rare or common a term is across all documents in the index. Calculated as `log(1 + (N - n + 0.5) / (n + 0.5))`, where `N` is the total number of documents with the field and `n` is the number of documents containing the term. Rarer terms have higher IDF values and contribute more to the relevance score.
`tf` | The term frequency. Measures how often the term appears in the document field. Calculated as `freq / (freq + k1 * (1 - b + b * dl / avgdl))`, where `freq` is the number of times the term appears, `k1` is the term saturation parameter (default 1.2), `b` is the length normalization parameter (default 0.75), `dl` is the field length, and `avgdl` is the average field length across all documents. More frequent terms contribute more to the relevance score, but with diminishing returns.
`k1` | The term saturation parameter. Controls how quickly the score increases as term frequency increases. The default value is 1.2. Lower values cause the score to saturate more quickly, while higher values allow term frequency to have a greater impact on the score.
`b` | The length normalization parameter. Controls how much field length affects the score. The default value is 0.75. A value of 0 disables length normalization, while a value of 1 fully normalizes by field length. Shorter fields with matching terms typically receive higher scores.
`dl` | The document field length. The number of tokens in the field for this specific document.
`avgdl` | The average document field length. The average number of tokens in the field across all documents in the index.
`boost` | The query boost value. A multiplier applied to the score. The default boost is 1.0 when not explicitly specified in the query.

The final relevance score is calculated by multiplying these components together: `score = boost * idf * tf`. The values are calculated and stored at index time when a document is added or updated and may have small inaccuracies based on shard-level statistics.