---
layout: default
title: Count
nav_order: 21
redirect_from:
 - /opensearch/rest-api/count/
---

# Count
**Introduced 1.0**
{: .label .label-purple }

The count API gives you quick access to the number of documents that match a query.
You can also use it to check the document count of an index, data stream, or cluster.

## Example

To see the number of documents that match a query:

```json
GET opensearch_dashboards_sample_data_logs/_count
{
  "query": {
    "term": {
      "response": "200"
    }
  }
}
```
{% include copy-curl.html %}

The following call to the search API produces equivalent results:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "query": {
    "term": {
      "response": "200"
    }
  },
  "size": 0,
  "track_total_hits": true
}
```
{% include copy-curl.html %}

To see the number of documents in an index:

```json
GET opensearch_dashboards_sample_data_logs/_count
```
{% include copy-curl.html %}

To check for the number of documents in a [data stream]({{site.url}}{{site.baseurl}}/opensearch/data-streams/), replace the index name with the data stream name.

To see the number of documents in your cluster:

```json
GET _count
```
{% include copy-curl.html %}

Alternatively, you could use the [cat indexes]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-indices/) and [cat count]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-count/) APIs to see the number of documents per index or data stream.
{: .note }


## Path and HTTP methods

```
GET <target>/_count/<id>
POST <target>/_count/<id>
```


## URL parameters

All count parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | If false, the request returns an error if any wildcard expression or index alias targets any closed or missing indexes. Default is false.
`analyzer` | String | The analyzer to use in the query string.
`analyze_wildcard` | Boolean | Specifies whether to analyze wildcard and prefix queries. Default is false.
`default_operator` | String | Indicates whether the default operator for a string query should be AND or OR. Default is OR.
`df` | String | The default field in case a field prefix is not provided in the query string.
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
`ignore_unavailable` | Boolean | Specifies whether to include missing or closed indexes in the response. Default is false.
`lenient` | Boolean | Specifies whether OpenSearch should accept requests if queries have format errors (for example, querying a text field for an integer). Default is false.
`min_score` | Float |	Include only documents with a minimum `_score` value in the result.
`routing` | String | Value used to route the operation to a specific shard.
`preference` | String | Specifies which shard or node OpenSearch should perform the count operation on.
`terminate_after` | Integer | The maximum number of documents OpenSearch should process before terminating the request.

## Response

```json
{
  "count" : 14074,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  }
}
```
