---
layout: default
title: Common operations
nav_order: 16
grand_parent: User guide
parent: Understanding workloads
---

# Common operations

[Test procedures]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/anatomy-of-a-workload#_operations-and-_test-procedures) use a variety of operations, found inside the `operations` directory of a workload. This page details the most common operations found inside OpenSearch Benchmark workloads.

- [Common operations](#common-operations)
  - [bulk](#bulk)
  - [create-index](#create-index)
  - [delete-index](#delete-index)
  - [cluster-health](#cluster-health)
  - [refresh](#refresh)
  - [search](#search)

<!-- vale off -->
## bulk
<!-- vale on -->

The `bulk` operation type allows you to run [bulk](/api-reference/document-apis/bulk/) requests as a task.

The following example shows a `bulk` operation type with a `bulk-size` of `5000` documents:

```yml
{
  "name": "index-append",
  "operation-type": "bulk",
  "bulk-size": 5000
}
```


<!-- vale off -->
## create-index
<!-- vale on -->

The `create-index` operation runs the [Create Index API](/api-reference/index-apis/create-index/). It supports the following two modes of index creation:

- Creating all indexes specified in the workloads `indices` section
- Creating one specific index defined within the operation itself

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



<!-- vale off -->
## delete-index
<!-- vale on -->

The `delete-index` operation runs the [Delete Index API](api-reference/index-apis/delete-index/). Like with the [`create-index`](#create-index) operation, you can delete all indexes found in the `indices` section of the workload or delete one or more indexes based on the string passed in the `index` setting.

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

<!-- vale off -->
## cluster-health
<!-- vale on -->

The `cluster-health` operation runs the [Cluster Health API](api-reference/cluster-api/cluster-health/), which checks the cluster health status and returns the expected status according to the parameters set for `request-params`. If an unexpected cluster health status is returned, the operation reports a failure. You can use the `--on-error` option in the OpenSearch Benchmark `run` command to control how OpenSearch Benchmark behaves when the health check fails.

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

<!-- vale off -->
## refresh
<!-- vale on -->

The `refresh` operation runs the Refresh API. The `operation` returns no metadata.


The following example refreshes all `logs-*` indexes:

```yml
{
 "name": "refresh",
 "operation-type": "refresh",
 "index": "logs-*"
}
```


<!-- vale off -->
## search
<!-- vale on -->

The `search` operation runs the [Search API](/api-reference/search/), which you can use to run queries in OpenSearch Benchmark indexes.

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
