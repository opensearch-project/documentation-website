---
layout: default
title: operations
parent: Workload reference
grand_parent: OpenSearch Benchmark Reference
nav_order: 100
canonical_url: https://docs.opensearch.org/latest/benchmark/reference/workloads/operations/
---

<!-- vale off -->
# operations
<!-- vale on -->

The `operations` element contains a list of all available operations for specifying a schedule.

<!-- vale off -->
## bulk
<!-- vale on -->

The `bulk` operation type allows you to run [bulk](/api-reference/document-apis/bulk/) requests as a task. 

### Usage

The following example shows a `bulk` operation type with a `bulk-size` of `5000` documents:

```yml
{
  "name": "index-append",
  "operation-type": "bulk",
  "bulk-size": 5000
}
```

### Split documents among clients

When you have multiple `clients`, OpenSearch Benchmark splits each document based on the set number of clients. Having multiple `clients` parallelizes the bulk index operations but doesn't preserve the ingestion order of each document. For example, if `clients` is set to `2`, one client indexes the document starting from the beginning, while the other client indexes the document starting from the middle.

If there are multiple documents or corpora, OpenSearch Benchmark attempts to index all documents in parallel in two ways:

1. Each client starts at a different point in the corpus. For example, in a workload with 2 corpora and 5 clients, clients 1, 3, and 5 begin with the first corpus, whereas clients 2 and 4 start with the second corpus.
2. Each client is assigned to multiple documents. Client 1 starts with the first split of the first document of the first corpus. Then it moves to the first split of the first document of the second corpus, and so on.

### Configuration options

Use the following options to customize the `bulk` operation.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`bulk-size` | Yes | Number | Specifies the number of documents to be ingested in the bulk request.
`ingest-percentage` | No | Range [0, 100] | Defines the portion of the document corpus to be indexed. Valid values are numbers between 0 and 100.
`corpora` | No | List | Defines which document corpus names should be targeted by the bulk operation. Only needed if the `corpora` section contains more than one document corpus and you don’t want to index all of them during the bulk request.
`indices` | No | List | Defines which indexes should be used in the bulk index operation. OpenSearch Benchmark only selects document files that have a matching `target-index`.
`batch-size` | No | Number | Defines how many documents OpenSearch Benchmark reads simultaneously. This is an expert setting and is only meant to avoid accidental bottlenecks for very small bulk sizes. If you want to benchmark with a `bulk-size` of `1`, you should set a higher `batch-size`.
`pipeline` | No | String | Defines which existing ingest pipeline to use.
`conflicts` | No | String | Defines the type of index `conflicts` to simulate. If not specified, none are simulated. Valid values are ‘sequential’, which replaces a document ID with a sequentially increasing document ID, and ‘random’, which replaces a document ID with a random document ID.
`conflict-probability` | No | Percentage | Defines how many of the documents are replaced when a conflict exists. Combining `conflicts=sequential` and `conflict-probability=0` makes OpenSearch Benchmark generate the index ID itself instead of using OpenSearch's automatic ID generation. Valid values are numbers between 0 and 100. Default is `25%`.
`on-conflict` | No | String |  Determines whether OpenSearch should use the action `index` or `update` index for ID conflicts. Default is `index`, which creates a new index during ID conflicts.
`recency` | No | Number | Uses a number between 0 and 1 to indicate recency. A recency closer to `1` biases conflicting IDs toward more recent IDs. A recency closer to 0 considers all IDs for ID conflicts. 
`detailed-results` | No | Boolean | Records more detailed [metadata](#metadata) for bulk requests. As OpenSearch Benchmark analyzes the corresponding bulk response in more detail, additional overhead may be incurred, which can skew measurement results. This property must be set to `true` so that OpenSearch Benchmark logs individual bulk request failures.
`timeout` | No | Duration | Defines the amount of time (in minutes) that OpenSearch waits per action until completing the processing of the following operations: automatic index creation, dynamic mapping updates, and waiting for active shards. Default is `1m`.
`refresh` | No | String | Controls OpenSearch refresh behavior for bulk requests that use the `refresh` bulk API query parameter. Valid values are `true`, which refreshes target shards in the background; `wait_for`, which blocks bulk requests until affected shards have been refreshed; and `false`, which uses the default refresh behavior. 

### Metadata

The `bulk` operation always returns the following metadata:

- `index`: The name of the affected index. If an index cannot be derived, it returns `null`.
- `weight`: An operation-agnostic representation of the bulk size, denoted by `units`.
- `unit`: The unit used to interpret `weight`.
- `success`: A Boolean indicating whether the `bulk` request succeeded.
- `success-count`: The number of successfully processed bulk items for the request. This value is determined when there are errors or when the `bulk-size` has been specified in the documents.
- `error-count`: The number of failed bulk items for the request.
- `took`: The value of the `took` property in the bulk response.

If `detailed-results` is `true`, the following metadata is returned:

- `ops`: A nested document with the operation name as its key, such as `index`, `update`, or `delete`, and various counts as values. `item-count` contains the total number of items for this key. Additionally, OpenSearch Benchmark returns a separate counter for each result, for example, a result for the number of created items or the number of deleted items.
- `shards_histogram`: An array of hashes, each of which has two keys. The `item-count` key contains the number of items to which a shard distribution applies. The `shards` key contains a hash with the actual distribution of `total`, `successful`, and `failed` shards.
- `bulk-request-size-bytes`: The total size of the bulk request body, in bytes.
- `total-document-size-bytes`: The total size of all documents within the bulk request body, in bytes.

<!-- vale off -->
## create-index
<!-- vale on -->

The `create-index` operation runs the [Create Index API](/api-reference/index-apis/create-index/). It supports the following two modes of index creation:

- Creating all indexes specified in the workloads `indices` section
- Creating one specific index defined within the operation itself

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

The following example creates a new index with all index settings specified in the operation body:

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

### Configuration options

Use the following options when creating all indexes from the `indices` section of a workload.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`settings` | No | Array |  Specifies additional index settings to be merged with the index settings specified in the `indices` section of the workload.
`request-params` | No | List of settings | Contains any request parameters allowed by the Create Index API. OpenSearch Benchmark does not attempt to serialize the parameters and passes them in their current state. 

Use the following options when creating a single index in the operation.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The index name.
`body` | No | Request body | The request body for the Create Index API. For more information, see [Create Index API](/api-reference/index-apis/create-index/).
`request-params` | No | List of settings | Contains any request parameters allowed by the Create Index API. OpenSearch Benchmark does not attempt to serialize the parameters and passes them in their current state. 

### Metadata

The `create-index` operation returns the following metadata:

`weight`: The number of indexes created by the operation.
`unit`: Always `ops`, indicating the number of operations inside the workload.
`success`: A Boolean indicating whether the operation has succeeded.

<!-- vale off -->
## delete-index
<!-- vale on -->

The `delete-index` operation runs the [Delete Index API](api-reference/index-apis/delete-index/). Like with the [`create-index`](#create-index) operation, you can delete all indexes found in the `indices` section of the workload or delete one or more indexes based on the string passed in the `index` setting.

### Usage

The following example deletes all indexes found in the `indices` section of the workload:

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

### Configuration options

Use the following options when deleting all indexes indicated in the `indices` section of the workload.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`only-if-exists` | No | Boolean | Decides whether an existing index should be deleted. Default is `true`.
`request-params` | No | List of settings | Contains any request parameters allowed by the Create Index API. OpenSearch Benchmark does not attempt to serialize the parameters and passes them in their current state. 

Use the following options if you want to delete one or more indexes based on the pattern indicated in the `index` option.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The index or indexes that you want to delete. 
`only-if-exists` | No | Boolean | Decides whether an index should be deleted when the index exists. Default is `true`.
`request-params` | No | List of settings | Contains any request parameters allowed by the Create Index API. OpenSearch Benchmark does not attempt to serialize the parameters and passes them in their current state. 

### Metadata

The `delete-index` operation returns the following metadata:

`weight`: The number of indexes created by the operation.
`unit`: Always `ops`, for the number of operations inside the workload.
`success`: A Boolean indicating whether the operation has succeeded.

<!-- vale off -->
## cluster-health
<!-- vale on -->

The `cluster-health` operation runs the [Cluster Health API](api-reference/cluster-api/cluster-health/), which checks the cluster health status and returns the expected status according to the parameters set for `request-params`. If an unexpected cluster health status is returned, the operation reports a failure. You can use the `--on-error` option in the OpenSearch Benchmark `execute-test` command to control how OpenSearch Benchmark behaves when the health check fails.


### Usage

The following example creates a `cluster-health` operation that checks for a `green` health status on any `log-*` indexes:

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

### Configuration options

Use the following options with the `cluster-health` operation.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The index or indexes you want to assess. 
`request-params` | No | List of settings | Contains any request parameters allowed by the Cluster Health API. OpenSearch Benchmark does not attempt to serialize the parameters and passes them in their current state. 

### Metadata

The `cluster-health` operation returns the following metadata:

`weight`: The number of indexes the `cluster-health` operation assesses. Alwasys `1`, since the operation runs once per index.
`unit`: Always `ops`, for the number of operations inside the workload.
`success`: A Boolean indicating whether the operation has succeeded.
- `cluster-status`: The current cluster status.
- `relocating-shards`: The number of shards currently relocating to a different node.

<!-- vale off -->
## refresh
<!-- vale on -->

The `refresh` operation runs the Refresh API. The `operation` returns no metadata.

### Usage

The following example refreshes all `logs-*` indexes:

```yml
{
 "name": "refresh",
 "operation-type": "refresh",
 "index": "logs-*"
}
```

### Configuration options

The `refresh` operation uses the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | No | String | The names of the indexes or data streams to refresh.

<!-- vale off -->
## search
<!-- vale on -->

The `search` operation runs the [Search API](/api-reference/search/), which you can use to run queries in OpenSearch Benchmark indexes.

### Usage

The following example runs a `match_all` query inside the `search` operation:

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

### Configuration options

The `search` operation uses the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | No | String | The indexes or data streams targeted by the query. This option is needed only when the `indices` section contains two or more indexes. Otherwise, OpenSearch Benchmark automatically derives the index or data stream to use. Specify `"index": "_all"` to query against all indexes in the workload.
`cache` | No | Boolean | Specifies whether to use the query request cache. OpenSearch Benchmark defines no value. The default depends on the benchmark candidate settings and the OpenSearch version.
`request-params` | No | List of settings | Contains any request parameters allowed by the Search API.
`body` | Yes | Request body | Indicates which query and query parameters to use.
`detailed-results` | No | Boolean | Records more detailed metadata about queries. When set to `true`, additional overhead may be incurred, which can skew measurement results. This option does not work with `scroll` queries.
`results-per-page` | No | Integer | Specifies the number of documents to retrieve per page. This maps to the Search API `size` parameter and can be used for scroll and non-scroll searches. Default is `10`.

### Metadata

The following metadata is always returned:

- `weight`: The “weight” of an operation. Always `1` for regular queries and the number of retrieved pages for scroll queries.
- `unit`: The unit used to interpret weight, which is `ops` for regular queries and `pages` for scroll queries.
- `success`: A Boolean indicating whether the query has succeeded.

If `detailed-results` is set to `true`, the following metadata is also returned:

- `hits`: The total number of hits for the query.
- `hits_relation`: Whether the number of hits is accurate (eq) or a lower bound of the actual hit count (gte).
- `timed_out`: Whether the query has timed out. For scroll queries, this flag is `true` if the flag was `true` for any of the queries issued.
 - `took`: The value of the `took` property in the query response. For scroll queries, the value is the sum of all `took` values in all query responses.


