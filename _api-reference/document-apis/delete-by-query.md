---
layout: default
title: Delete by query
parent: Document APIs
nav_order: 50
redirect_from:
 - /opensearch/rest-api/document-apis/delete-by-query/
---

# Delete by Query API
**Introduced 1.0**
{: .label .label-purple}

The Delete by Query API removes all documents from an index that match a specified query. Instead of deleting documents one by one, this API allows you to delete multiple documents in a single request based on search criteria.

Use this API in the following scenarios:

- Removing outdated data from time-series indexes based on date ranges or other criteria.
- Cleaning up test data or invalid documents that match specific patterns.
- Implementing data retention policies by deleting documents that exceed a certain age.
- Removing sensitive information across multiple documents identified by a query.

When you submit a delete by query request, OpenSearch takes a snapshot of the index at the start of the operation and deletes matching documents using internal versioning. The operation performs multiple search requests sequentially to find all matching documents, then executes bulk delete requests for each batch. If a document changes between when the snapshot is taken and when the delete operation processes it, a version conflict occurs and the delete fails for that document unless you set the `conflicts` parameter to `proceed`. Successfully deleted documents are not rolled back even if later operations in the batch fail.

OpenSearch retries rejected search or bulk requests up to 10 times with exponential backoff. If the maximum retry limit is reached, the operation halts and returns all failed requests in the response.

**Note:** OpenSearch cannot delete documents with version `0` using this API. The internal versioning system requires that version numbers are greater than 0 in order to track and process delete operations correctly.
{: .note}

<!-- spec_insert_start
api: delete_by_query
component: endpoints
-->
## Endpoints
```json
POST /{index}/_delete_by_query
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: delete_by_query
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | List or String | A comma-separated list of data streams, indexes, and aliases to search. Supports wildcards (`*`). To search all data streams or indexes, omit this parameter or use `*` or `_all`. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: delete_by_query
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `_source` | Boolean or List or String | Set to `true` or `false` to return the `_source` field or not, or a list of fields to return. | N/A |
| `_source_excludes` | List | List of fields to exclude from the returned `_source` field. | N/A |
| `_source_includes` | List | List of fields to extract and return from the `_source` field. | N/A |
| `allow_no_indices` | Boolean | If `false`, the request returns an error if any wildcard expression, index alias, or `_all` value targets only missing or closed indexes. This behavior applies even if the request targets other open indexes. For example, a request targeting `foo*,bar*` returns an error if an index starts with `foo` but no index starts with `bar`. | N/A |
| `analyze_wildcard` | Boolean | If `true`, wildcard and prefix queries are analyzed. | `false` |
| `analyzer` | String | Analyzer to use for the query string. | N/A |
| `conflicts` | String | What to do if delete by query hits version conflicts: `abort` or `proceed`. <br> Valid values are: <br> - `abort`: Abort the operation on version conflicts. <br> - `proceed`: Proceed with the operation on version conflicts. | N/A |
| `default_operator` | String | The default operator for query string query: `AND` or `OR`. <br> Valid values are: `and`, `AND`, `or`, and `OR`. | N/A |
| `df` | String | Field to use as default where no field prefix is given in the query string. | N/A |
| `expand_wildcards` | List or String | Type of index that wildcard patterns can match. If the request can target data streams, this argument determines whether wildcard expressions match hidden data streams. Supports comma-separated values, such as `open,hidden`. Valid values are: `all`, `open`, `closed`, `hidden`, `none`. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `from` | Integer | Starting offset. | `0` |
| `ignore_unavailable` | Boolean | If `false`, the request returns an error if it targets a missing or closed index. | N/A |
| `lenient` | Boolean | If `true`, format-based query failures (such as providing text to a numeric field) in the query string will be ignored. | N/A |
| `max_docs` | Integer | Maximum number of documents to process. Defaults to all documents. | N/A |
| `preference` | String | Specifies the node or shard the operation should be performed on. Random by default. | `random` |
| `q` | String | Query in the Lucene query string syntax. | N/A |
| `refresh` | Boolean or String | If `true`, OpenSearch refreshes all shards involved in the delete by query after the request completes. <br> Valid values are: <br> - `false`: Do not refresh the affected shards. <br> - `true`: Refresh the affected shards immediately. <br> - `wait_for`: Wait for the changes to become visible before replying. | N/A |
| `request_cache` | Boolean | If `true`, the request cache is used for this request. Defaults to the index-level setting. | N/A |
| `requests_per_second` | Float | The throttle for this request in sub-requests per second. | `0` |
| `routing` | List or String | A custom value used to route operations to a specific shard. | N/A |
| `scroll` | String | Period to retain the search context for scrolling. | N/A |
| `scroll_size` | Integer | Size of the scroll request that powers the operation. | `100` |
| `search_timeout` | String | Explicit timeout for each search request. Defaults to no timeout. | N/A |
| `search_type` | String | The type of the search operation. Available options: `query_then_fetch`, `dfs_query_then_fetch`. <br> Valid values are: <br> - `dfs_query_then_fetch`: Documents are scored using global term and document frequencies across all shards. This is usually slower but more accurate. <br> - `query_then_fetch`: Documents are scored using local term and document frequencies for the shard. This is usually faster but less accurate. | N/A |
| `size` | Integer | Deprecated, use `max_docs` instead. | N/A |
| `slices` | Integer or String | The number of slices this task should be divided into. <br> Valid values are: <br> - `auto`: Automatically determine the number of slices. | N/A |
| `sort` | List | A comma-separated list of <field>:<direction> pairs. | N/A |
| `stats` | List | Specific `tag` of the request for logging and statistical purposes. | N/A |
| `terminate_after` | Integer | Maximum number of documents to collect for each shard. If a query reaches this limit, OpenSearch terminates the query early. OpenSearch collects documents before sorting. Use with caution. OpenSearch applies this parameter to each shard handling the request. When possible, let OpenSearch perform early termination automatically. Avoid specifying this parameter for requests that target data streams with backing indexes across multiple data tiers. | N/A |
| `timeout` | String | Period each deletion request waits for active shards. | N/A |
| `version` | Boolean | If `true`, returns the document version as part of a hit. | N/A |
| `wait_for_active_shards` | Integer or String or NULL or String | The number of shard copies that must be active before proceeding with the operation. Set to all or any positive integer up to the total number of shards in the index (`number_of_replicas+1`). <br> Valid values are: <br> - `all`: Wait for all shards to be active. | N/A |
| `wait_for_completion` | Boolean | If `true`, the request blocks until the operation is complete. | `true` |

<!-- spec_insert_end -->


## Request body fields

The request body is optional but typically includes a query to specify which documents to delete.

Field | Data type | Description
:--- | :--- | :---
`query` | Object | The query used to select documents for deletion. If not specified, the operation deletes all documents in the target index. For more information about query types, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).
`slice` | Object | Manually specify slice ID and maximum slices for parallel processing. Contains `id` (integer, slice number) and `max` (integer, total number of slices). Optional.
`max_docs` | Integer | Maximum number of documents to process. Optional.

## Refreshing shards

Specifying the `refresh` parameter refreshes all shards involved in the delete by query operation after the request completes. This behavior differs from the Delete Document API's `refresh` parameter, which only refreshes the shard that received the delete request. The Delete by Query API does not support the `wait_for` value for the `refresh` parameter.

## Running delete by query asynchronously

To run a delete by query operation asynchronously, set the `wait_for_completion` query parameter to `false`. OpenSearch performs preflight checks, launches the request, and returns a task ID that you can use to monitor progress or cancel the operation. When running asynchronously, OpenSearch creates a record of the task as a document at `.tasks/task/${taskId}`. After the task completes, delete the task document to allow OpenSearch to reclaim the space.

## Waiting for active shards

The `wait_for_active_shards` parameter controls how many shard copies must be active before processing the request. The `timeout` parameter controls how long each write request waits for unavailable shards to become available. These parameters work the same way as in the Bulk API. Because Delete by Query uses scrolled searches, you can specify the `scroll` parameter to control how long the search context remains active. The default scroll time is 5 minutes.

## Throttling delete requests

To control the rate at which delete by query issues batches of delete operations, set `requests_per_second` to any positive decimal number. This pads each batch with a wait time to throttle the rate. Set `requests_per_second` to `-1` to disable throttling.

Throttling uses wait time between batches so that internal scroll requests can be given a timeout that accounts for request padding. The padding time is the difference between the batch size divided by `requests_per_second` and the time spent writing. By default, the batch size is 1,000, so if `requests_per_second` is set to 500:

```
target_time = 1,000 / 500 per second = 2 seconds
wait_time = target_time - write_time = 2 seconds - 0.5 seconds = 1.5 seconds
```

Because each batch is issued as a single bulk request, large batch sizes cause OpenSearch to create many requests and then wait before starting the next batch. This creates uneven processing patterns with periods of high activity followed by idle waiting.

## Slicing for parallel processing

You can use slicing to run delete operations in parallel across multiple threads. This approach divides the delete operation into independent segments, improving performance for large-scale deletions.

Setting `slices` to `auto` allows OpenSearch to choose a reasonable number for most indexes. When using automatic slicing or tuning it manually, consider these factors:

- Optimal query performance occurs when you match the slice count to your shard count. However, for indexes with many shards (500 or more), use fewer slices to avoid performance degradation from excessive parallelization overhead. Setting slices higher than the number of shards generally does not improve efficiency and adds overhead.
- Delete performance scales linearly across available resources with the number of slices.
- Whether query or delete performance dominates runtime depends on the documents being deleted and available cluster resources.

## Example: Deleting documents matching a query

The following example request deletes all documents from the `movies` index where the `year` field is less than 2000:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query
body: |
{
  "query": {
    "range": {
      "year": {
        "lt": 2000
      }
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query
{
  "query": {
    "range": {
      "year": {
        "lt": 2000
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  body =   {
    "query": {
      "range": {
        "year": {
          "lt": 2000
        }
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Deleting with conflicts set to proceed

The following example request deletes documents matching the query and continues processing even when version conflicts occur:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query?conflicts=proceed
body: |
{
  "query": {
    "match": {
      "status": "archived"
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query?conflicts=proceed
{
  "query": {
    "match": {
      "status": "archived"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  params = { "conflicts": "proceed" },
  body =   {
    "query": {
      "match": {
        "status": "archived"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Deleting from multiple indexes

The following example request deletes documents from multiple indexes that match the query:

<!-- spec_insert_start
component: example_code
rest: POST /movies,tv-shows/_delete_by_query
body: |
{
  "query": {
    "match_all": {}
  }
}
-->
{% capture step1_rest %}
POST /movies,tv-shows/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies,tv-shows",
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

## Example: Using routing for targeted deletion

The following example request limits the delete operation to shards with a specific routing value:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query?routing=user123
body: |
{
  "query": {
    "term": {
      "user_id": "user123"
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query?routing=user123
{
  "query": {
    "term": {
      "user_id": "user123"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  params = { "routing": "user123" },
  body =   {
    "query": {
      "term": {
        "user_id": "user123"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Using scroll_size to control batch size

The following example request uses a custom scroll batch size of 5,000 documents:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query?scroll_size=5000
body: |
{
  "query": {
    "term": {
      "genre": "documentary"
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query?scroll_size=5000
{
  "query": {
    "term": {
      "genre": "documentary"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  params = { "scroll_size": "5000" },
  body =   {
    "query": {
      "term": {
        "genre": "documentary"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Manual slicing for parallel processing

The following example requests manually divide the delete operation into two slices for parallel processing:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query
body: |
{
  "slice": {
    "id": 0,
    "max": 2
  },
  "query": {
    "range": {
      "rating": {
        "lt": 5
      }
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query
{
  "slice": {
    "id": 0,
    "max": 2
  },
  "query": {
    "range": {
      "rating": {
        "lt": 5
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  body =   {
    "slice": {
      "id": 0,
      "max": 2
    },
    "query": {
      "range": {
        "rating": {
          "lt": 5
        }
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

In a separate request, process the second slice:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query
body: |
{
  "slice": {
    "id": 1,
    "max": 2
  },
  "query": {
    "range": {
      "rating": {
        "lt": 5
      }
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query
{
  "slice": {
    "id": 1,
    "max": 2
  },
  "query": {
    "range": {
      "rating": {
        "lt": 5
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  body =   {
    "slice": {
      "id": 1,
      "max": 2
    },
    "query": {
      "range": {
        "rating": {
          "lt": 5
        }
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Automatic slicing

The following example request uses automatic slicing to parallelize the delete operation across 5 slices:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query?slices=5&refresh=true
body: |
{
  "query": {
    "range": {
      "views": {
        "lt": 100
      }
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query?slices=5&refresh=true
{
  "query": {
    "range": {
      "views": {
        "lt": 100
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  params = { "slices": "5", "refresh": "true" },
  body =   {
    "query": {
      "range": {
        "views": {
          "lt": 100
        }
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To allow OpenSearch to automatically determine the optimal number of slices, use `slices=auto`:

<!-- spec_insert_start
component: example_code
rest: POST /movies/_delete_by_query?slices=auto
body: |
{
  "query": {
    "match": {
      "category": "test"
    }
  }
}
-->
{% capture step1_rest %}
POST /movies/_delete_by_query?slices=auto
{
  "query": {
    "match": {
      "category": "test"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.delete_by_query(
  index = "movies",
  params = { "slices": "auto" },
  body =   {
    "query": {
      "match": {
        "category": "test"
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

The following example response shows a successful delete by query operation that deleted 8 documents:

```json
{
  "took": 88,
  "timed_out": false,
  "total": 8,
  "deleted": 8,
  "batches": 1,
  "version_conflicts": 0,
  "noops": 0,
  "retries": {
    "bulk": 0,
    "search": 0
  },
  "throttled_millis": 0,
  "requests_per_second": -1.0,
  "throttled_until_millis": 0,
  "failures": []
}
```

When using manual slicing, the response includes a `slice_id` field indicating which slice was processed:

```json
{
  "took": 13,
  "timed_out": false,
  "slice_id": 0,
  "total": 9,
  "deleted": 9,
  "batches": 1,
  "version_conflicts": 0,
  "noops": 0,
  "retries": {
    "bulk": 0,
    "search": 0
  },
  "throttled_millis": 0,
  "requests_per_second": -1.0,
  "throttled_until_millis": 0,
  "failures": []
}
```

When using automatic slicing with a specific number of slices, the response includes a `slices` array showing the results for each slice:

```json
{
  "took": 52,
  "timed_out": false,
  "total": 9,
  "deleted": 9,
  "batches": 4,
  "version_conflicts": 0,
  "noops": 0,
  "retries": {
    "bulk": 0,
    "search": 0
  },
  "throttled_millis": 0,
  "requests_per_second": -1.0,
  "throttled_until_millis": 0,
  "slices": [
    {
      "slice_id": 0,
      "total": 3,
      "deleted": 3,
      "batches": 1,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": -1.0,
      "throttled_until_millis": 0
    },
    {
      "slice_id": 1,
      "total": 2,
      "deleted": 2,
      "batches": 1,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": -1.0,
      "throttled_until_millis": 0
    },
    {
      "slice_id": 2,
      "total": 0,
      "deleted": 0,
      "batches": 0,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": -1.0,
      "throttled_until_millis": 0
    },
    {
      "slice_id": 3,
      "total": 1,
      "deleted": 1,
      "batches": 1,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": -1.0,
      "throttled_until_millis": 0
    },
    {
      "slice_id": 4,
      "total": 3,
      "deleted": 3,
      "batches": 1,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": -1.0,
      "throttled_until_millis": 0
    }
  ],
  "failures": []
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`took` | Integer | The amount of time from the start to the end of the entire operation, in milliseconds.
`timed_out` | Boolean | Whether any of the requests executed during the delete by query operation timed out. When set to `true`, successfully completed deletions still stick and are not rolled back.
`total` | Integer | The total number of documents that were successfully processed.
`deleted` | Integer | The number of documents that were successfully deleted.
`batches` | Integer | The number of scroll batches processed by the delete by query operation.
`version_conflicts` | Integer | The number of version conflicts encountered by the delete by query operation. Occurs when a document changes between the time the snapshot is taken and when the delete operation is processed.
`noops` | Integer | The number of no-operation requests. This field always returns 0 for delete by query. It exists to maintain response structure consistency with Update by Query and Reindex APIs.
`retries` | Object | The number of retries attempted by the delete by query operation. Contains `bulk` (number of bulk action retries) and `search` (number of search action retries).
`throttled_millis` | Integer | The amount of time the request was throttled to conform to `requests_per_second`, in milliseconds.
`requests_per_second` | Float | The number of requests per second effectively executed during the delete by query operation.
`throttled_until_millis` | Integer | The amount of time until the next throttled request will be executed, in milliseconds. Always equals 0 in a completed delete by query response. This field has meaning only when using the Tasks API to monitor an ongoing operation, where it indicates the next time a throttled request will execute.
`slice_id` | Integer | The slice number for this response. Only present when using manual slicing. Indicates which slice of the operation this response represents.
`slices` | Array | An array of slice results when using automatic slicing with a specific number. Each element contains the same response fields as the main response, showing the results for that individual slice.
`failures` | Array | An array of failures if any unrecoverable errors occurred during the operation. If this array is not empty, the request aborted because of those failures. Delete by query is implemented using batches, and any failure causes the entire process to abort, but all failures in the current batch are collected in this array. You can use the `conflicts` parameter set to `proceed` to prevent the operation from aborting on version conflicts.

## Managing delete by query tasks

When you run a delete by query operation asynchronously by setting `wait_for_completion=false`, OpenSearch returns a task ID that you can use to monitor, modify, or cancel the operation.

### Getting the status of a delete by query operation

To get the status of a delete by query operation, use the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/):

```json
GET _tasks?detailed=true&actions=*/delete/byquery
```

The response includes the status of all running delete by query operations. To get the status of a specific task, use the task ID:

```json
GET _tasks/<task_id>
```

The response contains detailed information about the operation's progress:

```json
{
  "nodes": {
    "node_id": {
      "tasks": {
        "task_id": {
          "status": {
            "total": 1000,
            "updated": 0,
            "created": 0,
            "deleted": 450,
            "batches": 5,
            "version_conflicts": 0,
            "noops": 0,
            "retries": 0,
            "throttled_millis": 0
          }
        }
      }
    }
  }
}
```

The `total` field represents the total number of operations that the delete by query operation expects to perform. You can estimate progress by comparing the `deleted` field to the `total` field. The operation is complete when `deleted` equals `total`.

### Changing throttling for a running operation

To change the throttling of a running delete by query operation, use the Rethrottle API with the task ID:

```json
POST _delete_by_query/<task_id>/_rethrottle?requests_per_second=100
```

Set `requests_per_second` to any positive decimal value or `-1` to disable throttling. Rethrottling that speeds up the operation takes effect immediately. Rethrottling that slows down the operation takes effect after completing the current batch to prevent scroll timeouts.

### Canceling a delete by query operation

To cancel a running delete by query operation, use the task cancel API:

```json
POST _tasks/<task_id>/_cancel
```

Cancellation should happen quickly but might take a few seconds. The Tasks API continues to list the delete by query task until it checks that it has been canceled and terminates itself. When you cancel a delete by query operation with slices, OpenSearch cancels each sub-request.
