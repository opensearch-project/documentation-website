---
layout: default
title: operations
parent: Workload reference
grand_parent: OpenSearch Benchmark Reference
nav_order: 110
---

# operations

The `operations` element contains a list of all operations that are available when specifying a schedule.

## bulk

The `bulk` operation type allows you run [bulk](/api-reference/document-apis/bulk/) requests as a task. 

### Usage

The following example shows a `bulk` operations with a `bulk-size` of 5000 documents.

```yml
{
  "name": "index-append",
  "operation-type": "bulk",
  "bulk-size": 5000
}
```

### Split documents among clients

With multiple `clients`, OpenSearch Benchmark splits each document based on the number of clients set. This ensures that the bulk index operations are efficiently parallelized but has the drawback that the ingestion is not done in the order of each document. For example, if `clients` is set to `2`, one client indexes the document starting from the beginning, while the other indexes starting from the middle.

Additionally, if there are multiple documents or corpora, OpenSearch Benchmark tries to index all documents in parallel in two ways:

1. Each client starts at a different point in the corpus. For example, in a track with 2 corpora and 5 clients, clients 1, 3, and 5 begin with the first corpus, whereas clients 2 and 4 start with the second corpus.
2. Each client is assigned to multiple documents. Client 1 starts with the first split of the first document of the first corpus. Then it will move on to the first split of the first document of the second corpus, and so on.

### Options

Use the following options to customize the bulk operation.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`bulk-size` | Yes | Number | Sets the number of documents ingested in the bulk requested.
`ingest-percentage` No | Range [0, 100] | Defines using a number between [0, 100], how much of document corpus will be indexed.
`corpora` | No | List | A list of document corpus names that should be targeted by the bulk operation. Only needed if the `corpora` section contains more than one document corpus and you don’t want to index all of them during the bulk request.
`indices` | No | List | A list of index names that defines which indexes should be used in the bulk index operation. OpenSearch Benchmark will only select document files that have a matching `target-index`.
`batch-size` | No | Number | Defines how many documents OpenSearch Benchmark reads at once. This is an expert setting and only meant to avoid accidental bottlenecks for very small bulk sizes. If you want to benchmark with a bulk-size of 1, you should set batch-size higher.
`pipeline` | No | String | Defines the name of an existing ingest pipeline that should be used.
`conflicts` | No | String | The type of index conflicts to simulate. If not specified, no conflicts will be simulated. Valid values are ‘sequential’, a document ID is replaced with with a sequentially increasing ID, and ‘random’, where a document ID is replaced with a random document ID.
`conflict-probability` | No | Percentage | A number between [0, 100] that defines how many of the documents be replaced when a conflict exists. Combining `conflicts=sequential` and `conflict-probability=0` makes OpenSearch Benchmark generate index ID by itself, instead of relying on OpenSearch’s automatic ID generation. Default is `25%`.
`on-conflict` | No | String |  Determines whether OpenSearch should use the action `index` or `update` index on ID conflicts. Default is `index`, which creates a new index during ID conflicts.
`recency` | No | Number | A number between [0,1] that indicates recency. Recency towards `1` bias conflicting IDs towards more recent IDs. Recency towards 0 considers all IDs for ID conflicts. 
`detailed-results` | No | Boolean | Records more detailed [meta-data](#meta-data) for bulk requests. As OpenSearch Benchmark analyzes the corresponding bulk response in more detail, this might incur additional overhead which can skew measurement results. This property must be set to true for individual bulk request failures to be logged by OpenSearch Benchmark.
`timeout` | No | Duration (In minutes) | Defines the time period that OpenSearch will wait per action until it has finished processing the following operations: automatic index creation, dynamic mapping updates, waiting for active shards. Defaults to `1m`.
`refresh` No | String | Controls OpenSearch's refresh behavior for bulk requests using the `refresh` bulk API query parameter. Valid values are `true`, where OpenSearch refreshes target shards in the background; `wait_for`, OpenSearch blocks bulk requests until affected shards have been refreshed; and `false`, where OpenSearch uses the default refresh behavior. 

### Meta-data

The `bulk` operations always returns the following meta-data:

- `index`: The name of the affected index. If an index cannot be derived, returns `null`.
- `weight`: An operation-agnostic representation of the bulk size denoted by `units`.
- `unit`: The unit in which to interpret `weight`.
- `success`: A Boolean indicating whether the `bulk` request succeeded.
- `success-count`: The number of successfully processed bulk items for this request. This value will only be determined in case of errors or if the `bulk-size` has been specified in the documents.
- `error-count`: The number of failed bulk items for this request.
- `took`: The value of the `took` property in the bulk response.

If `detailed-results` is `true` the following meta-data is also returned:

- `ops`: A nested document with the operation name as key, such as `index`, `update`, or `delete` and various counts as values. `item-count` contains the total number of items for this key. Additionally, OpenSearch Benchmark returns a separate counter for each result, for example, a result for the number of created items or the number of deleted items.
- `shards_histogram`: An array of hashes where each hash has two keys: `item-count` which contains the number of items to which a shard distribution applies, and `shards` contains another hash with the actual distribution of `total`, `successful`, and `failed` shards.
- `bulk-request-size-bytes`: The total size of the bulk requests body in bytes.
- `total-document-size-bytes`: The total size of all documents within the bulk request body in bytes.

## create-index

The `create-index` operation runs the [Create Index API](/api-reference/index-apis/create-index/). It supports the following two modes of index creation:

- Create all indexes specified in the workloads `indices` section.
- Creates one specific index defined in the operation itself.

### Usage

The following example creates all indexes defined in the `indices` section of the workload. It uses all of the index settings defined in the workload but overrides the number of shards:

```yml
{
  "name": "create-all-indices",
  "operation-type": "create-index",
  "settings": {
    "index.number_of_shards": 1
  },
  "request-params": {
    "wait_for_active_shards": "true"
  }
}
```

The next example creates a new index, with all index setting specified in the body of the operation:

```yml
{
  "name": "create-an-index",
  "operation-type": "create-index",
  "index": "people",
  "body": {
    "settings": {
      "index.number_of_shards": 0
    },
    "mappings": {
      "docs": {
        "properties": {
          "name": {
            "type": "text"
          }
        }
      }
    }
  }
}
```

### Options

Use the following options when creating all indexes from the `indices` section of a workload.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`settings` | No | Array |  Specifies additional index settings to be merged with the index settings specified in `indices` section of the workload.
`request-params` | No | List of settings | Contains any request parameters allowed by Create Index API. OpenSearch Benchmark will not attempt to serialize the parameters and pass them as is. 

Use the following options when creating a single index in the operation.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The name of the index.
`body` | No | Request body | The request body for the Create Index API. For more information, see [Create Index API](/api-reference/index-apis/create-index/)
`request-params` | No | List of settings | Contains any request parameters allowed by the Create Index API. OpenSearch Benchmark will not attempt to serialize the parameters and pass them as is. 

### Meta-data

The `create-index` operation returns the following meta-data:

`weight`: The number of indexes created by the operation.
`unit`: Always “ops”.
`success`: A Boolean indicating whether the operation has succeeded.

## delete-index

The `delete-index` runs the [Delete Index API](api-reference/index-apis/delete-index/). Like the [`create-index`](#create-index) operation, you can delete all indexes found in the `indices` section of the workload or you can delete one or more indexes based on string passed in the `index` setting.

### Usage

The following example deletes all indexes found in `indices` section of the workload:

```yml
{
  "name": "delete-all-indices",
  "operation-type": "delete-index"
}
```

The following example deletes all `logs_*` indexes:

```yml
{
  "name": "delete-logs",
  "operation-type": "delete-index",
  "index": "logs-*",
  "only-if-exists": false,
  "request-params": {
    "expand_wildcards": "all",
    "allow_no_indices": "true",
    "ignore_unavailable": "true"
  }
}
```

### Options

Use the following options when deleting all indexes indicated in the `indices` section of the workload.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`only-if-exists` | No | Boolean | Decides whether an index should only be deleted in the index exists. Default is `true`.
`request-params` | No | List of settings | Contains any request parameters allowed by the Create Index API. OpenSearch Benchmark will not attempt to serialize the parameters and pass them as is. 

Use the following options if you want to delete one or more indexes based on pattern indicated in the `index` option:

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The name of the index or indexes you want to delete. 
`only-if-exists` | No | Boolean | Decides whether an index should only be deleted in the index exists. Default is `true`.
`request-params` | No | List of settings | Contains any request parameters allowed by Create Index API. OpenSearch Benchmark will not attempt to serialize the parameters and pass them as is. 

### Meta-data

The `delete-index` operation returns the following meta-data.

`weight`: The number of indexes created by the operation.
`unit`: Always “ops”.
`success`: A Boolean indicating whether the operation has succeeded.

## cluster-health

The `cluster-health` operation runs the [Cluster Health API](api-reference/cluster-api/cluster-health/), which checks the cluster health status returns the expected status according the parameters set in the `request-params` option. If an unexpected cluster health status is returned, the operation reports a failure. You can use the `--on-error` option in the OpenSearch Benchmark `execute-test` command to control how OpenSearch Benchmark behaves when an the health check fails.


### Usage

The following example creates a `cluster-health` operation which checks for a `green` health status on the any `log-*` indexes:

```yml
{
  "name": "check-cluster-green",
  "operation-type": "cluster-health",
  "index": "logs-*",
  "request-params": {
    "wait_for_status": "green",
    "wait_for_no_relocating_shards": "true"
  },
  "retry-until-success": true
}

```

### Options

Use the following options with the `cluster-health` operation.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The name of the index or indexes you want to delete. 
`request-params` | No | List of settings | Contains any request parameters allowed by the Cluster Health API. OpenSearch Benchmark will not attempt to serialize the parameters and pass them as is. 

### Meta-data

The `cluster-health` operation returns the following meta-data.

- `weight`: Always 1.
- `unit`: Always “ops”.
- `success`: A Boolean which indicates whether the operation has succeeded.
- `cluster-status`: Current cluster status.
- `relocating-shards`: The number of shards currently relocating to a different node.

## refresh

The `refresh` operations runs the Refresh API. This `operation` returns no meta-data.

### Usage

The following example refreshes all `logs-*` indexes:

```yml
{
 "name": "refresh",
 "operation-type": "refresh",
 "index": "logs-*"
}
```

### Options

The `refresh` operation uses the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | No | String | The name of the index(es) or data streams to refresh.

## search

The `search` operation runs the [Search API](/api-reference/search/), which gives you the ability to run queries in OpenSearch Benchmark indexes.

### Usage

The follow example runs a `match_all` query inside the `search` operation:

```yml
{
  "name": "default",
  "operation-type": "search",
  "body": {
    "query": {
      "match_all": {}
    }
  },
  "request-params": {
    "_source_include": "some_field",
    "analyze_wildcard": "false"
  }
}
```

### Options

The `search` operation uses the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | No | String | The name of the index(es) or data streams that query targets. This options is only needed when the `indices` section contains more than one index. Otherwise, OpenSearch Benchmark automatically derives the index or data stream to use. To query against all indexes in the workload, specify `"index": "_all"`.
`cache` | No | Boolean | Whether to use the query request cache. OpenSearch Benchmark defines no value. The default depends on the benchmark candidate settings and OpenSearch version.
`request-params` | No | List of settings | Contains any request parameters allowed by the Search API.
`body` | Yes | Request body | The query body that indicates which query to use and the query parameters.
`detailed-results` | No | Boolean | Records more detailed meta-data about queries. When `true`, OpenSearch Benchmark might incur additional overhead to return the detailed results, which can skew measurement results. This option does not work with `scroll` queries.
`results-per-page` | No | Integer | The number of documents to retrieve per page. This maps to the Search API’s `size` parameter, and can be used for scroll and non-scroll searches. Default is 10.

### Meta-data

The following meta-data is always returned:
- `weight`:  The “weight” of an operation. Always `1` for regular queries and the number of retrieved pages for scroll queries.
- `unit`: The unit in which to interpret weight. Always “ops” for regular queries and “pages” for scroll queries.
- `success`: A Boolean indicating whether the query has succeeded.

If `detailed-results` is set to `true`, the following meta-data is also returned:
- `hits`: The total number of hits for this query.
- `hits_relation`: whether hits is accurate (eq) or a lower bound of the actual hit count (gte).
- `timed_out`: Whether the query has timed out. For scroll queries, this flag is true if the flag was true for any of the queries issued.

    took: Value of the the took property in the query response. For scroll queries, this value is the sum of all took values in query responses.


