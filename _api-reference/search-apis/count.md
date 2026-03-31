---
layout: default
title: Count
parent: Search APIs
nav_order: 35
redirect_from:
 - /opensearch/rest-api/count/
 - /api-reference/count/
---

# Count API
**Introduced 1.0**
{: .label .label-purple }

The Count API returns the count of documents that match a query. You can use it to retrieve the document count of an index, a data stream, or a cluster. Common use cases include:

- Retrieving the total number of documents in an index or data stream without retrieving the actual documents.
- Verifying that data has been indexed correctly by counting documents that match specific criteria.
- Monitoring data growth over time by tracking document counts across different time periods.
- Validating query results before running expensive search operations by first retrieving how many documents match.

The Count API is more efficient than using the Search API with `size: 0` when you only need the document count because it is optimized specifically for counting operations. To improve performance, OpenSearch distributes the count query across all shards in parallel. Each shard processes the request using one of its available replicas, allowing horizontal scaling as the number of replicas increases.

Alternatively, you can use the [CAT Indices API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-indices/) or the [CAT Count API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-count/) to retrieve the number of documents in each index or data stream.
{: .note }

<!-- spec_insert_start
api: count
component: endpoints
-->
## Endpoints
```json
GET  /_count
POST /_count
GET  /{index}/_count
POST /{index}/_count
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: count
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | List or String | A comma-separated list of data streams, indexes, and aliases to search. Supports wildcards (`*`). To search all data streams and indexes, omit this parameter or use `*` or `_all`. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: count
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `allow_no_indices` | Boolean | If `false`, the request returns an error if any wildcard expression, index alias, or `_all` value targets only missing or closed indexes. This behavior applies even if the request targets other open indexes. | N/A |
| `analyze_wildcard` | Boolean | If `true`, wildcard and prefix queries are analyzed. This parameter can only be used when the `q` query string parameter is specified. | `false` |
| `analyzer` | String | Analyzer to use for the query string. This parameter can only be used when the `q` query string parameter is specified. | N/A |
| `default_operator` | String | The default operator for query string query: `AND` or `OR`. This parameter can only be used when the `q` query string parameter is specified. <br> Valid values are: `and`, `AND`, `or`, and `OR`. | N/A |
| `df` | String | Field to use as default where no field prefix is given in the query string. This parameter can only be used when the `q` query string parameter is specified. | N/A |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `ignore_throttled` | Boolean | If `true`, concrete, expanded or aliased indexes are ignored when frozen. | N/A |
| `ignore_unavailable` | Boolean | If `false`, the request returns an error if it targets a missing or closed index. | N/A |
| `lenient` | Boolean | If `true`, format-based query failures (such as providing text to a numeric field) in the query string will be ignored. | N/A |
| `min_score` | Float | Sets the minimum `_score` value that documents must have to be included in the result. | N/A |
| `preference` | String | Specifies the node or shard the operation should be performed on. Random by default. | `random` |
| `q` | String | Query in the Lucene query string syntax. | N/A |
| `routing` | List or String | A custom value used to route operations to a specific shard. | N/A |
| `terminate_after` | Integer | Maximum number of documents to collect for each shard. If a query reaches this limit, OpenSearch terminates the query early. OpenSearch collects documents before sorting. | N/A |

<!-- spec_insert_end -->

## Request body fields

The request body is optional. You can use it to restrict the results using a query defined with Query DSL.

Field | Data type | Description
:--- | :--- | :---
`query` | Object | The query used to filter documents. If not specified, the `match_all` query is used to count all documents in the target. For more information about OpenSearch queries, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

## Example: Counting all documents in a cluster

The following example request returns the total count of all documents across the entire cluster:

<!-- spec_insert_start
component: example_code
rest: GET /_count
-->
{% capture step1_rest %}
GET /_count
{% endcapture %}

{% capture step1_python %}


response = client.count(
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Counting all documents in several indexes

The following example request returns the total count of all documents in the `movies` and `tv_shows` indexes:

<!-- spec_insert_start
component: example_code
rest: GET /movies,tv_shows/_count
-->
{% capture step1_rest %}
GET /movies,tv_shows/_count
{% endcapture %}

{% capture step1_python %}


response = client.count(
  index = "movies,tv_shows",
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Counting documents that match a query

The following example request counts documents in the `movies` index in which the `genre` field is `drama`:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_count
body: |
{
  "query": {
    "term": {
      "genre": "drama"
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_count
{
  "query": {
    "term": {
      "genre": "drama"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.count(
  index = "movies",
  body =   {
    "query": {
      "term": {
        "genre": "drama"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Counting documents using a query string

The following example request uses the `q` query parameter to count documents where the `genre` field is `drama`:

<!-- spec_insert_start
component: example_code
rest: GET /movies/_count?q=genre:drama
-->
{% capture step1_rest %}
GET /movies/_count?q=genre:drama
{% endcapture %}

{% capture step1_python %}


response = client.count(
  index = "movies",
  params = { "q": "genre:drama" },
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Counting documents with early termination

The following example request uses the `terminate_after` parameter to stop counting after finding three matching documents:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_count?terminate_after=3
body: |
{
  "query": {
    "match_all": {}
  }
}
-->
{% capture step1_rest %}
POST /movies/_count?terminate_after=3
{
  "query": {
    "match_all": {}
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.count(
  index = "movies",
  params = { "terminate_after": "3" },
  body =   {
    "query": {
      "match_all": {}
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following example response shows the document count and shard information:

```json
{
  "count" : 7,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  }
}
```

When using the `terminate_after` parameter, the response includes a `terminated_early` field:

```json
{
  "terminated_early" : true,
  "count" : 7,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  }
}
```

## Response fields

The Count API response contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`count` | Integer | The total number of documents matching the query. If a query is not provided, this represents all documents in the specified target.
`_shards` | Object | Contains information about the shards involved in the count operation.
`_shards.total` | Integer | The total number of shards queried for the count operation.
`_shards.successful` | Integer | The number of shards that successfully executed the count operation.
`_shards.skipped` | Integer | The number of shards that were skipped during the count operation. Shards may be skipped if they do not contain any documents matching the query.
`_shards.failed` | Integer | The number of shards that failed to execute the count operation. If this value is greater than 0, check your cluster health and shard allocation.
`terminated_early` | Boolean | Appears only when the `terminate_after` query parameter is used. When `true`, indicates that the count operation was terminated before all matching documents were counted.
