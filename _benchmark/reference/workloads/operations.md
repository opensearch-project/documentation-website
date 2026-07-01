---
layout: default
title: operations
parent: Workload reference
grand_parent: Reference
nav_order: 100
---

<!-- vale off -->
# operations
<!-- vale on -->

The `operations` element contains a list of all available operations for specifying a schedule.

<!-- vale off -->
## bulk
<!-- vale on -->

The `bulk` operation type allows you to run [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) requests as a task.

### Usage

The following example shows a `bulk` operation type with a `bulk-size` of `5000` documents:

```yml
{
  "name": "index-append",
  "operation-type": "bulk",
  "bulk-size": 5000
}
```
{% include copy.html %}

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
`refresh` | No | String | Controls OpenSearch refresh behavior for bulk requests that use the `refresh` Bulk API query parameter. Valid values are `true`, which refreshes target shards in the background; `wait_for`, which blocks bulk requests until affected shards have been refreshed; and `false`, which uses the default refresh behavior.

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

The `create-index` operation runs the [Create Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/). It supports the following two index creation modes:

- Creating all indexes specified in the workload's `indices` section
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
{% include copy.html %}

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
{% include copy.html %}

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
`body` | No | Request body | The request body for the Create Index API. For more information, see [Create Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).
`request-params` | No | List of settings | Contains any request parameters allowed by the Create Index API. OpenSearch Benchmark does not attempt to serialize the parameters and passes them in their current state.

### Metadata

The `create-index` operation returns the following metadata:

- `weight`: The number of indexes created by the operation.
- `unit`: Always `ops`, indicating the number of operations inside the workload.
- `success`: A Boolean indicating whether the operation has succeeded.

<!-- vale off -->
## delete-index
<!-- vale on -->

The `delete-index` operation runs the [Delete Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index/). As with the [`create-index`](#create-index) operation, you can delete all indexes found in the `indices` section of the workload or delete one or more indexes based on the string passed in the `index` setting.

### Usage

The following example deletes all indexes found in the `indices` section of the workload:

```yml
{
  "name": "delete-all-indices",
  "operation-type": "delete-index"
}
```
{% include copy.html %}

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
{% include copy.html %}

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

- `weight`: The number of indexes created by the operation.
- `unit`: Always `ops`, for the number of operations inside the workload.
- `success`: A Boolean indicating whether the operation has succeeded.

<!-- vale off -->
## cluster-health
<!-- vale on -->

The `cluster-health` operation runs the [Cluster Health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/), which checks the cluster health status and returns the expected status according to the parameters set for `request-params`. If an unexpected cluster health status is returned, then the operation reports a failure. You can use the `--on-error` option in the OpenSearch Benchmark `run` command to control how OpenSearch Benchmark behaves when the health check fails.


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
{% include copy.html %}

### Configuration options

Use the following options with the `cluster-health` operation.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The index or indexes you want to assess.
`request-params` | No | List of settings | Contains any request parameters allowed by the Cluster Health API. OpenSearch Benchmark does not attempt to serialize the parameters and passes them in their current state.

### Metadata

The `cluster-health` operation returns the following metadata:

- `weight`: The number of indexes the `cluster-health` operation assesses. Always `1`, since the operation runs once per index.
- `unit`: Always `ops`, for the number of operations inside the workload.
- `success`: A Boolean indicating whether the operation has succeeded.
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
{% include copy.html %}

### Configuration options

The `refresh` operation uses the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | No | String | The names of the indexes or data streams to refresh.

<!-- vale off -->
## search
<!-- vale on -->

The `search` operation runs the [Search API]({{site.url}}{{site.baseurl}}/api-reference/search/), which you can use to run queries in OpenSearch Benchmark indexes.

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
{% include copy.html %}

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
- `hits_relation`: Whether the number of hits is accurate (`eq`) or a lower bound of the actual hit count (`gte`).
- `timed_out`: Whether the query has timed out. For scroll queries, this flag is `true` if the flag was `true` for any of the queries issued.
 - `took`: The value of the `took` property in the query response. For scroll queries, the value is the sum of all `took` values in all query responses.

<!-- vale off -->
## paginated-search
<!-- vale on -->

The `paginated-search` operation runs a sequence of paginated search requests using the [`search_after`]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-search_after-parameter) parameter. It accepts the same options as `search` plus `pages`, which controls how many pages to retrieve.

### Configuration options

In addition to the options listed under [`search`](#search):

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`pages` | Yes | Integer | The maximum number of pages to retrieve. If the query returns fewer matching results than the requested number of pages, the operation terminates early.

### Metadata

In addition to the metadata returned by `search`:

- `pages`: The total number of pages retrieved.

<!-- vale off -->
## scroll-search
<!-- vale on -->

The `scroll-search` operation runs a [scroll search]({{site.url}}{{site.baseurl}}/api-reference/scroll/). It accepts the same options as `search` plus `pages`, which controls how many scroll pages to fetch.

### Configuration options

In addition to the options listed under [`search`](#search):

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`pages` | Yes | Integer | The maximum number of scroll pages to retrieve. If the scroll exhausts before this number is reached, the operation terminates early.

### Metadata

In addition to the metadata returned by `search`:

- `pages`: The total number of scroll pages retrieved.

<!-- vale off -->
## force-merge
<!-- vale on -->

The `force-merge` operation runs the [Force Merge API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/).

### Usage

```yml
{
  "name": "force-merge",
  "operation-type": "force-merge",
  "index": "_all",
  "request-params": {
    "max_num_segments": 1
  }
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | No | String | The index or indexes to force merge. If omitted, the call falls through to the underlying client's default behavior, which targets all indexes.
`max-num-segments` | No | Integer | The target number of segments per shard. Passed as `max_num_segments` to the Force Merge API.
`mode` | No | String | Set to `polling` to issue the force merge asynchronously and poll the Tasks API until it completes. When omitted, the call waits synchronously and may time out on large indexes.
`poll-period` | Conditional | Number | Required when `mode` is `polling`: the time in seconds between status polls. The operation raises an error if `mode: polling` is set without this value.
`request-params` | No | Object | Additional request parameters passed to the Force Merge API.

This is an administrative operation. Metrics are not reported by default. Reporting can be forced by setting `include-in-reporting` to `true`.

<!-- vale off -->
## index-stats
<!-- vale on -->

The `index-stats` operation runs the [Index Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/).

### Usage

```yml
{
  "name": "index-stats",
  "operation-type": "index-stats",
  "index": "_all",
  "condition": {
    "path": "_all.total.merges.current",
    "expected-value": 0
  },
  "retry-until-success": true
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | No | String | The index or indexes to retrieve statistics for. Default is `_all`.
`condition` | No | Object | A condition to check in the response. Contains `path` (dot-notation path in the response) and `expected-value`.
`request-params` | No | Object | Request parameters passed to the Stats API.

<!-- vale off -->
## node-stats
<!-- vale on -->

The `node-stats` operation runs the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/).

### Usage

```yml
{
  "name": "node-stats",
  "operation-type": "node-stats"
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`request-timeout` | No | Number | Client-side timeout (in seconds) for the Nodes Stats request.

<!-- vale off -->
## vector-search
<!-- vale on -->

The `vector-search` operation runs k-NN vector search queries and optionally computes recall metrics by comparing results against ground truth neighbors.

### Usage

```yml
{
  "name": "knn-search",
  "operation-type": "vector-search",
  "index": "vectors",
  "k": 100,
  "body": {
    "query": {
      "knn": {
        "embedding": {
          "vector": [0.1, 0.2, 0.3],
          "k": 100
        }
      }
    }
  }
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The target index. Required: omitting it causes the underlying `search` runner to error out.
`body` | Yes | Object | The search request body containing the k-NN query.
`k` | No | Integer | The number of nearest neighbors to retrieve. Used for recall calculation.
`detailed-results` | No | Boolean | Whether to record detailed metadata.
`calculate-recall` | No | Boolean | Whether to compute recall@k and recall@1 against ground truth neighbors. Default is `true`.
`neighbors` | No | Array | The ground truth neighbor IDs for recall calculation. Typically provided by the workload at runtime.

### Metadata

- `weight`: Always `1`.
- `unit`: Always `ops`.
- `success`: Whether the search succeeded.
- `recall@k`: Recall at k (if ground truth neighbors are provided).
- `recall@1`: Recall at 1 (if ground truth neighbors are provided).

<!-- vale off -->
## bulk-vector-data-set
<!-- vale on -->

The `bulk-vector-data-set` operation bulk-indexes vector data from HDF5 or BigANN dataset files. Supports individual document retry on partial failures.

### Usage

```yml
{
  "name": "bulk-vectors",
  "operation-type": "bulk-vector-data-set",
  "bulk-size": 500,
  "index": "vectors"
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`bulk-size` | No | Integer | Number of documents per bulk request.
`index` | No | String | The target index.
`retries` | No | Integer | Number of retry attempts after the initial request fails. Default is `0` (no retries). Each failed document is resubmitted on retry; connection timeouts also trigger a retry.
`retry-wait-period` | No | Number | Initial wait period between retries in seconds. Default is `0.5`.
`retry-max-wait-period` | No | Number | Maximum wait period between retries in seconds (exponential backoff is capped at this value). Default is `60`.
`detailed-results` | No | Boolean | Records detailed per-document success/failure metadata. Default is `true`.
`action-metadata-present` | No | Boolean | Whether the bulk body includes action metadata lines. Default is `true`.
`unit` | No | String | Unit reported for `weight`. Default is `docs`.

<!-- vale off -->
## put-pipeline
<!-- vale on -->

The `put-pipeline` operation creates or updates an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/).

### Usage

```yml
{
  "name": "define-pipeline",
  "operation-type": "put-pipeline",
  "id": "my-pipeline",
  "body": {
    "description": "My ingest pipeline",
    "processors": [
      {
        "set": {
          "field": "ingest_time",
          "value": {% raw %}"{{_ingest.timestamp}}"{% endraw %}
        }
      }
    ]
  }
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`id` | Yes | String | The pipeline ID.
`body` | Yes | Object | The pipeline definition.

This is an administrative operation. Metrics are not reported by default.

<!-- vale off -->
## delete-pipeline
<!-- vale on -->

The `delete-pipeline` operation deletes an ingest pipeline.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`id` | Yes | String | The pipeline ID to delete.

This is an administrative operation. Metrics are not reported by default.

<!-- vale off -->
## create-search-pipeline
<!-- vale on -->

The `create-search-pipeline` operation creates a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`id` | Yes | String | The search pipeline ID.
`body` | Yes | Object | The search pipeline definition.

This is an administrative operation. Metrics are not reported by default.

<!-- vale off -->
## update-concurrent-segment-search-settings
<!-- vale on -->

The `update-concurrent-segment-search-settings` operation toggles the [concurrent segment search]({{site.url}}{{site.baseurl}}/search-plugins/concurrent-segment-search/) cluster setting and, optionally, the maximum slice count. It updates `search.concurrent_segment_search.enabled` (and `search.concurrent.max_slice_count` when provided) as persistent cluster settings.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`enable` | No | Boolean | Whether concurrent segment search is enabled. Default is `false`.
`max_slice_count` | No | Integer | Maximum number of slices per shard. If omitted, the setting is left unchanged.

<!-- vale off -->
## put-settings
<!-- vale on -->

The `put-settings` operation updates [cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/).

### Usage

```yml
{
  "name": "increase-watermarks",
  "operation-type": "put-settings",
  "body": {
    "transient": {
      "cluster.routing.allocation.disk.watermark.low": "95%"
    }
  }
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`body` | Yes | Object | The cluster settings to apply.

This is an administrative operation. Metrics are not reported by default.

<!-- vale off -->
## create-data-stream
<!-- vale on -->

The `create-data-stream` operation creates one or more [data streams]({{site.url}}{{site.baseurl}}/opensearch/data-streams/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`data-streams` | Yes | List | A list of data stream names to create.
`request-params` | Yes | Object | Request parameters forwarded to the Create Data Stream API. Pass an empty object (`{}`) if none are needed.

<!-- vale off -->
## delete-data-stream
<!-- vale on -->

The `delete-data-stream` operation deletes one or more data streams.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`data-streams` | Yes | List | A list of data stream names to delete.
`only-if-exists` | Yes | Boolean | If `true`, only delete data streams that exist; if `false`, attempt to delete each one and ignore HTTP 404 responses.
`request-params` | Yes | Object | Request parameters forwarded to the Delete Data Stream API. Pass an empty object (`{}`) if none are needed.

<!-- vale off -->
## create-composable-template
<!-- vale on -->

The `create-composable-template` operation creates one or more [composable index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`templates` | Yes | List | A list of `[template-name, body]` pairs to create.
`request-params` | Yes | Object | Request parameters forwarded to the API. Pass an empty object (`{}`) if none are needed.

<!-- vale off -->
## delete-composable-template
<!-- vale on -->

The `delete-composable-template` operation deletes one or more composable index templates and, optionally, the indexes they match.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`templates` | Yes | List | A list of `[template-name, delete-matching-indices, index-pattern]` triples. When `delete-matching-indices` is `true` and `index-pattern` is non-empty, indexes matching the pattern are also deleted.
`only-if-exists` | Yes | Boolean | If `true`, only delete templates that exist; if `false`, attempt to delete each one and ignore HTTP 404 responses.
`request-params` | Yes | Object | Request parameters forwarded to the API. Pass an empty object (`{}`) if none are needed.

<!-- vale off -->
## create-component-template
<!-- vale on -->

The `create-component-template` operation creates one or more [component templates]({{site.url}}{{site.baseurl}}/api-reference/index-apis/component-template/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`templates` | Yes | List | A list of `[template-name, body]` pairs to create.
`request-params` | Yes | Object | Request parameters forwarded to the API. Pass an empty object (`{}`) if none are needed.

<!-- vale off -->
## delete-component-template
<!-- vale on -->

The `delete-component-template` operation deletes one or more component templates.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`templates` | Yes | List | A list of component template names to delete.
`only-if-exists` | Yes | Boolean | If `true`, only delete templates that exist; if `false`, attempt to delete each one and ignore HTTP 404 responses.
`request-params` | Yes | Object | Request parameters forwarded to the API. Pass an empty object (`{}`) if none are needed.

<!-- vale off -->
## create-index-template
<!-- vale on -->

The `create-index-template` operation creates one or more legacy index templates.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`templates` | Yes | List | A list of `[template-name, body]` pairs to create.
`request-params` | No | Object | Additional request parameters.

<!-- vale off -->
## delete-index-template
<!-- vale on -->

The `delete-index-template` operation deletes one or more legacy index templates and, optionally, the indexes they match.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`templates` | Yes | List | A list of `[template-name, delete-matching-indices, index-pattern]` triples.
`only-if-exists` | No | Boolean | If `true`, only delete templates that exist. Default is `false`.
`request-params` | No | Object | Additional request parameters.

<!-- vale off -->
## shrink-index
<!-- vale on -->

The `shrink-index` operation uses the [Shrink Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shrink-index/) to reduce the number of primary shards in an index.

### Usage

```yml
{
  "name": "shrink-index",
  "operation-type": "shrink-index",
  "source-index": "my-index",
  "target-index": "my-index-shrunk",
  "target-body": {
    "settings": {
      "index.number_of_shards": 1,
      "index.codec": "best_compression"
    }
  }
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`source-index` | Yes | String | The source index (or wildcard pattern) to shrink.
`target-index` | Yes | String | The name for the shrunk index. When `source-index` matches multiple indexes, the matched suffix is appended to this name.
`target-body` | Yes | Object | Settings and mappings for the target index.
`shrink-node` | No | String | The node to allocate the source shards to before shrinking. If omitted, a random data node is chosen.

<!-- vale off -->
## create-snapshot-repository
<!-- vale on -->

The `create-snapshot-repository` operation creates a [snapshot repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`repository` | Yes | String | The repository name.
`body` | Yes | Object | The repository definition (type, settings).
`request-params` | No | Object | Additional request parameters.

<!-- vale off -->
## delete-snapshot-repository
<!-- vale on -->

The `delete-snapshot-repository` operation deletes a snapshot repository.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`repository` | Yes | String | The repository name to delete.

<!-- vale off -->
## create-snapshot
<!-- vale on -->

The `create-snapshot` operation creates a [snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`repository` | Yes | String | The repository name.
`snapshot` | Yes | String | The snapshot name.
`body` | Yes | Object | The snapshot definition.
`wait-for-completion` | No | Boolean | Whether to wait for the snapshot to complete before returning. Default is `false`. To benchmark snapshot duration accurately, leave this `false` and follow up with `wait-for-snapshot-create`.
`request-params` | No | Object | Additional request parameters.

<!-- vale off -->
## wait-for-snapshot-create
<!-- vale on -->

The `wait-for-snapshot-create` operation polls snapshot status until the snapshot reaches `SUCCESS`. If the snapshot ends in `FAILED`, the operation raises an assertion error. The reported metrics include snapshot size in bytes, throughput, and duration.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`repository` | Yes | String | The repository name.
`snapshot` | Yes | String | The snapshot name.
`completion-recheck-wait-period` | No | Number | Seconds between status polls. Default is `1`.

<!-- vale off -->
## restore-snapshot
<!-- vale on -->

The `restore-snapshot` operation restores a snapshot.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`repository` | Yes | String | The repository name.
`snapshot` | Yes | String | The snapshot name.
`body` | No | Object | The restore request body.
`wait-for-completion` | No | Boolean | Whether to wait for the restore to complete before returning. Default is `false`. Pair with `wait-for-recovery` to benchmark restore duration.
`request-params` | No | Object | Additional request parameters.

<!-- vale off -->
## wait-for-recovery
<!-- vale on -->

The `wait-for-recovery` operation waits until index recovery completes by polling the [Index Recovery API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/recover/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`index` | Yes | String | The index to monitor for recovery.
`completion-recheck-wait-period` | No | Number | Seconds between recovery polls. Default is `1`.

<!-- vale off -->
## submit-async-search
<!-- vale on -->

The `submit-async-search` operation submits an [asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/) request and stores the returned asynchronous search ID under the operation `name` so later operations in the same composite can fetch or delete it.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The operation name. Other operations refer to this name to look up the resulting asynchronous search ID.
`body` | Yes | Object | The search request body.
`index` | No | String | The target index.
`request-params` | No | Object | Additional request parameters forwarded to the Async Search API.

<!-- vale off -->
## get-async-search
<!-- vale on -->

The `get-async-search` operation retrieves results from one or more previously submitted asynchronous searches. The operation succeeds only when every referenced search has completed (`is_running: false`).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`retrieve-results-for` | Yes | String or List | The name of the `submit-async-search` operation (or a list of names) whose results should be retrieved.
`request-params` | No | Object | Additional request parameters forwarded to the Async Search Get API.

<!-- vale off -->
## delete-async-search
<!-- vale on -->

The `delete-async-search` operation deletes one or more asynchronous search results.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`delete-results-for` | Yes | String or List | The name of the `submit-async-search` operation (or a list of names) whose results should be deleted.

<!-- vale off -->
## create-point-in-time
<!-- vale on -->

The `create-point-in-time` operation creates a [Point in Time (PIT)]({{site.url}}{{site.baseurl}}/search-plugins/point-in-time/) for an index. The resulting PIT ID is stored under the operation `name`, so later operations in the same composite can reference it.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The operation name. Other operations refer to this name to reuse the resulting PIT ID.
`index` | Yes | String | The target index.
`keep-alive` | No | String | How long to keep the PIT alive (for example, `5m`). Default is `1m`.
`request-params` | No | Object | Additional request parameters forwarded to the Create PIT API.

<!-- vale off -->
## delete-point-in-time
<!-- vale on -->

The `delete-point-in-time` operation deletes one or more PITs. If `with-point-in-time-from` is set, only the PIT created by the named operation is deleted; otherwise, every PIT on the cluster is deleted.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`with-point-in-time-from` | No | String | The name of the `create-point-in-time` operation whose PIT to delete. If omitted, all PITs are deleted.
`request-params` | No | Object | Additional request parameters forwarded to the Delete PIT API.

<!-- vale off -->
## list-all-point-in-time
<!-- vale on -->

The `list-all-point-in-time` operation lists all active PITs on the cluster.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`request-params` | No | Object | Additional request parameters forwarded to the List PIT API.

<!-- vale off -->
## create-transform
<!-- vale on -->

The `create-transform` operation creates an [index transform]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`transform-id` | Yes | String | The transform ID.
`body` | Yes | Object | The transform definition.

<!-- vale off -->
## start-transform
<!-- vale on -->

The `start-transform` operation starts a previously created transform.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`transform-id` | Yes | String | The transform ID to start.
`timeout` | No | Number | Optional client-side timeout for the start request.

<!-- vale off -->
## wait-for-transform
<!-- vale on -->

The `wait-for-transform` operation polls the transform status until the transform reaches its next checkpoint (or stops, depending on options).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`transform-id` | Yes | String | The transform ID to monitor.
`force` | No | Boolean | Forcefully stop the transform when polling completes. Default is `false`.
`wait-for-checkpoint` | No | Boolean | Wait until all data has been processed through the next checkpoint. Default is `true`.
`wait-for-completion` | No | Boolean | Block until the transform has fully stopped. Default is `true`.
`transform-timeout` | No | Number | Overall transform runtime timeout in seconds. Default is `3600`.
`poll-interval` | No | Number | How often (in seconds) transform stats are polled. Default is `0.5`.

<!-- vale off -->
## delete-transform
<!-- vale on -->

The `delete-transform` operation deletes a previously created transform. Missing transforms (HTTP 404) are ignored so this operation is safe to use as a cleanup step.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`transform-id` | Yes | String | The transform ID to delete.
`force` | No | Boolean | If `true`, deletes the transform even if it is currently running. Default is `false`.

<!-- vale off -->
## train-knn-model
<!-- vale on -->

The `train-knn-model` operation trains a k-NN model using the [Train Model API]({{site.url}}{{site.baseurl}}/vector-search/api/knn/#train-a-model) and polls until training completes.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`body` | Yes | Object | The training request body. See the [Train Model API]({{site.url}}{{site.baseurl}}/vector-search/api/knn/#train-a-model) for body parameters.
`model_id` | Yes | String | The model ID to train.
`retries` | No | Integer | Maximum number of poll retries before giving up. Default is `1000`.
`poll_period` | No | Number | Seconds between status polls. Default is `0.5`.

<!-- vale off -->
## delete-knn-model
<!-- vale on -->

The `delete-knn-model` operation deletes a trained k-NN model.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`model_id` | Yes | String | The model ID to delete.
`ignore-if-model-does-not-exist` | No | Boolean | If `true`, treat a missing model (HTTP 404) as success. Default is `false`.

<!-- vale off -->
## register-ml-model
<!-- vale on -->

The `register-ml-model` operation registers a machine learning model using the [ML Commons API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/). The runner first searches for a model with a matching name; if one already exists, the existing model ID is reused. Otherwise it submits a new registration request and polls until it completes. The resulting model ID is written to `model_id.json` in the working directory so later operations can consume it.

You can supply the request body in one of two ways: by setting `model-config-file` to a path on disk, or by setting `model-name`, `model-version`, and `model-format` and letting OpenSearch Benchmark assemble the body for you.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`model-config-file` | No | String | Path to a JSON file containing the full registration body. If set, the other body fields are ignored.
`model-name` | No | String | The model name. Used to assemble the body when `model-config-file` is not set.
`model-version` | No | String | The model version.
`model-format` | No | String | The model format (for example, `TORCH_SCRIPT`).
`timeout` | No | Number | Maximum seconds to wait for the registration task to complete. Default is `120`.

<!-- vale off -->
## deploy-ml-model
<!-- vale on -->

The `deploy-ml-model` operation deploys (loads) a previously registered ML model. The model ID is read from `model_id.json` in the working directory (typically written by an earlier `register-ml-model` operation), so this operation takes no required parameters.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`timeout` | No | Number | Maximum seconds to wait for the deploy task to complete. Default is `120`.

<!-- vale off -->
## create-ml-connector
<!-- vale on -->

The `create-ml-connector` operation creates an [ML connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/) for remote model integration.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`body` | Yes | Object | The connector definition.

<!-- vale off -->
## delete-ml-connector
<!-- vale on -->

The `delete-ml-connector` operation looks up an ML connector by name and deletes it. If no connector matches the supplied name, the operation is a no-op.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`connector_name` | Yes | String | The connector name to look up and delete.

<!-- vale off -->
## register-remote-ml-model
<!-- vale on -->

The `register-remote-ml-model` operation registers a remote ML model backed by an [ML connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). It polls the registration task until it completes, then writes the resulting model ID to `model_id.json` in the working directory so later operations can consume it.

If `connector_id` is not set in the request body, OpenSearch Benchmark reads it from `connector_id.json` in the working directory (typically written by an earlier `create-ml-connector` operation).

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`body` | Yes | Object | The model registration request body. If `connector_id` is omitted, it is loaded from `connector_id.json`.

<!-- vale off -->
## delete-ml-model
<!-- vale on -->

The `delete-ml-model` operation looks up models by name, undeploys any that are currently deployed, and then deletes them. Multiple models with the same name (for example, across versions) are all deleted.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`model-name` | Yes | String | The model name to look up and delete.
`number-of-hits-to-return` | No | Integer | Maximum number of matching models to fetch from the search query. Default is `1000`.
`undeploy-timeout` | No | Number | Seconds to wait for each model to fully undeploy before deletion. Default is `10`.

<!-- vale off -->
## raw-request
<!-- vale on -->

The `raw-request` operation sends an arbitrary HTTP request to OpenSearch. Use this for operations not covered by a dedicated operation type.

### Usage

```yml
{
  "name": "check-shard-count",
  "operation-type": "raw-request",
  "method": "GET",
  "path": "/_cat/shards?v",
  "body": {}
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`method` | No | String | HTTP method (`GET`, `POST`, `PUT`, `DELETE`). Default is `GET`.
`path` | Yes | String | The URL path. Must begin with `/`.
`body` | No | Object | The request body.
`request-params` | No | Object | Query string parameters.
`headers` | No | Object | HTTP headers to include.
`ignore` | No | List | HTTP status codes to ignore (for example, `[404]`).

<!-- vale off -->
## sleep
<!-- vale on -->

The `sleep` operation pauses execution for a specified duration.

### Usage

```yml
{
  "name": "wait-before-search",
  "operation-type": "sleep",
  "duration": 30
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`duration` | Yes | Number | Sleep duration in seconds.

<!-- vale off -->
## composite
<!-- vale on -->

The `composite` operation executes a structured group of inner operations as a single measured unit, optionally with parallel sub-streams. This is useful when several requests need to share state (for example, creating a PIT, searching with it, and deleting it) or when you want to measure end-to-end timings across a small workflow.

Only a subset of operation types can appear inside `composite`: `create-point-in-time`, `delete-point-in-time`, `list-all-point-in-time`, `search`, `paginated-search`, `raw-request`, `sleep`, `submit-async-search`, `get-async-search`, and `delete-async-search`. Nested `stream` blocks run in parallel.

### Usage

```yml
{
  "name": "pit-search-workflow",
  "operation-type": "composite",
  "requests": [
    { "operation-type": "create-point-in-time", "name": "pit", "index": "my-index" },
    { "operation-type": "search", "body": { "query": { "match_all": {} } } },
    { "operation-type": "delete-point-in-time", "with-point-in-time-from": "pit" }
  ]
}
```
{% include copy.html %}

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`requests` | Yes | List | The list of inner operations or `stream` blocks to execute.
`max-connections` | No | Integer | Upper bound on the number of concurrent in-flight requests across the composite. Defaults to unbounded.

<!-- vale off -->
## produce-stream-message
<!-- vale on -->

The `produce-stream-message` operation publishes messages to a configured `message-producer` (for example, a Kafka producer) for streaming ingestion benchmarks. The `body` is split on newlines, and each non-metadata line is sent as an individual message. Producers are configured at the workload or cluster level — the runner itself takes only the producer reference and the message payload.

### Configuration options

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`message-producer` | Yes | Producer | The producer instance (resolved by the workload at runtime) used to send messages.
`body` | Yes | String or Bytes | The newline-delimited message payload. Index-metadata lines (`{"index": {"_index": ...}}`) are skipped.

<!-- vale off -->
## proto-bulk
<!-- vale on -->

The `proto-bulk` operation sends bulk index requests using the gRPC transport instead of HTTP REST. Requires gRPC to be enabled on the target cluster.

### Configuration options

Same as `bulk`, but uses gRPC serialization (Protocol Buffers) instead of JSON over HTTP. Use `--grpc-target-hosts` to specify the gRPC endpoint.

<!-- vale off -->
## proto-search
<!-- vale on -->

The `proto-search` operation sends search requests using gRPC transport.

### Configuration options

Same as `search`, but uses gRPC. Use `--grpc-target-hosts` to specify the gRPC endpoint.

<!-- vale off -->
## proto-vector-search
<!-- vale on -->

The `proto-vector-search` operation sends vector search requests using gRPC transport.

### Configuration options

Same as `vector-search`, but uses gRPC. Use `--grpc-target-hosts` to specify the gRPC endpoint.

<!-- vale off -->
## proto-bulk-vector-data-set
<!-- vale on -->

The `proto-bulk-vector-data-set` operation bulk-indexes vector data sets using the gRPC transport. It is the gRPC counterpart to `bulk-vector-data-set`.

### Configuration options

Same as `bulk-vector-data-set`, but uses gRPC serialization (Protocol Buffers) instead of JSON over HTTP. Use `--grpc-target-hosts` to specify the gRPC endpoint.
