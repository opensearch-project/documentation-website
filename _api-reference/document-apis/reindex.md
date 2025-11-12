---
layout: default
title: Reindex documents
parent: Document APIs
nav_order: 60
redirect_from: 
  - /opensearch/reindex-data/
  - /opensearch/rest-api/document-apis/reindex/
---

# Reindex Documents API
**Introduced 1.0**
{: .label .label-purple}

The reindex document API operation lets you copy all or a subset of your data from a source index into a destination index.

Before using the reindex API, be aware of the following requirements and limitations:

- The reindex operation requires the `_source` field to be enabled for all documents in the source index. If `_source` is disabled, the operation will fail.
- You must create and configure the destination index before running the reindex operation. OpenSearch does not automatically copy settings, mappings, or shard configurations from the source index.
- Configure the appropriate number of shards, replicas, and field mappings for the destination index based on your requirements.
- For large reindex operations, consider temporarily disabling replicas on the destination index by setting `number_of_replicas` to `0`, then re-enabling them after completion.

Reindexing large datasets can be resource-intensive and may impact cluster performance. Monitor cluster health during reindex operations and consider using throttling parameters for production environments.
{: .warning }

## Endpoints

```json
POST /_reindex
```

## Query parameters

The following table lists the available query parameters. All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`refresh` | Boolean | If true, OpenSearch refreshes shards to make the reindex operation available to search results. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`.
`timeout` | Time unit | How long to wait for a response from the cluster. Default is `30s`.
`wait_for_active_shards` | String | The number of active shards that must be available before OpenSearch processes the reindex request. Default is `1` (only the primary shard). Set to `all` or a positive integer. Values greater than `1 require replicas. For example, if you specify a value of `3`, the index must have two replicas distributed across two additional nodes for the operation to succeed.
`wait_for_completion` | Boolean | If `false`, OpenSearch runs the reindex operation asynchronously, without waiting for it to complete. The request returns immediately, and the task continues in the background. You can monitor its progress using the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/). Default is `true`, which means the operation runs synchronously.
`requests_per_second` | Integer | Specifies the request’s throttling in sub-requests per second. Default is `-1`, which means no throttling.
`require_alias` | Boolean | Whether the destination index must be an index alias. Default is `false`.
`scroll` | Time unit | How long to keep the search context open. Default is `5m`.
`slices` | Integer | Number of slices for automatic slicing. OpenSearch automatically divides the reindex operation into this many parallel sub-tasks. Default is 1 (no slicing). Setting this parameter to `auto` tells OpenSearch to automatically determine the optimal number of slices.
`max_docs` | Integer | How many documents the update by query operation should process at most. Default is all documents.

## Request body fields

The following table lists all request body fields.

Field | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`source` | Object | Required | Information about the source index to copy data from. See [The `source` object](#the-source-object).
`dest` | Object | Required | Information about the destination index. See [The `dest` object](#the-dest-object).
`conflicts` | String | Optional | Indicates to OpenSearch what should happen if the Reindex operation runs into a version conflict. Valid options are `abort` and `proceed`. Default is `abort`.
`script` | Object | Optional | A script that OpenSearch uses to apply transformations to the data during the reindex operation. See [The `script` object](#the-script-object).

### The `source` object

The `source` object supports the following fields.

Field | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`index` | String | Required | The name of the source index to copy data from.
`query` | Object | Optional | The search query to use for the reindex operation.
`remote` | Object | Optional | Information about a remote OpenSearch cluster to copy data from.
`remote.host` | String | Required when `remote` is specified | The URL for the remote OpenSearch cluster that you want to index from.
`remote.username` | String | Optional | The username to use for authentication with the remote host.
`remote.password` | String | Optional | The password to use for authentication with the remote host.
`remote.socket_timeout` | String | Optional | The remote socket read timeout. Default is `30s`.
`remote.connect_timeout` | String | Optional | The remote connection timeout. Default is `30s`.
`size` | Integer | Optional | The number of documents to reindex.
`slice` | Object | Optional | Configuration for manual slicing. Must be an object with `id` (slice ID) and `max` (total number of slices) properties to manually specify which slice of the data to process. This enables parallel processing by running multiple reindex operations, each handling a different slice.
`_source` | Boolean or Array | Optional | Whether to reindex source fields. Specify a list of fields to reindex or true to reindex all fields. Default is `true`.
`sort` | Array | Optional | A comma-separated list of `<field>:<direction>` pairs to sort documents before reindexing. Use with `max_docs` to control which documents are reindexed.

### The `dest` object

The `dest` object supports the following fields.

Field | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`index` | String | Required | The name of the destination index.
`version_type` | String | Optional | The indexing operation's version type. Valid values are `internal`, `external`, `external_gt` (retrieve the document if the specified version number is greater than the document's current version), and `external_gte` (retrieve the document if the specified version number is greater or equal to than the document's current version).
`op_type` | String | Optional | Whether to copy over documents that are missing in the destination index. Valid values are `create` (ignore documents with the same ID from the source index) and `index` (copy everything from the source index).
`pipeline` | String | Optional | The ingest pipeline to use during reindexing.
`routing` | String | Optional | Controls how document routing is handled during reindexing. Valid values are `keep` (preserves existing routing, default), `discard` (removes routing), or `=<value>` (sets routing to specific value).

### The `script` object

The `script` object supports the following fields.

Field | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`source` | String | Required | The script source code as a string.
`lang` | String | Optional | The scripting language. Valid values are `painless`, `expression`, `mustache`, and `java`. Default is `painless`.

## Example request

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
   "source":{
      "index":"my-source-index"
   },
   "dest":{
      "index":"my-destination-index"
   }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "my-source-index"
  },
  "dest": {
    "index": "my-destination-index"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "my-source-index"
    },
    "dest": {
      "index": "my-destination-index"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
    "took": 28829,
    "timed_out": false,
    "total": 111396,
    "updated": 0,
    "created": 111396,
    "deleted": 0,
    "batches": 112,
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

## Response body fields

The following table lists all response body fields with detailed descriptions.

Field | Type | Description
:--- | :--- | :---
`took` | Integer | The total time in milliseconds required to complete the entire reindex operation, including all batch processing and network overhead.
`timed_out` | Boolean | Indicates whether any part of the reindex operation exceeded the configured timeout. If `true`, the operation may have been partially completed.
`total` | Integer | The total number of documents successfully processed during the reindex operation. This includes documents that were created, updated, or resulted in no-op operations.
`updated` | Integer | The number of documents that were updated in the destination index because a document with the same ID already existed.
`created` | Integer | The number of new documents created in the destination index. These are documents that didn't previously exist in the destination.
`deleted` | Integer | The number of documents deleted from the destination index. This occurs when scripts set `ctx.op = "delete"`.
`batches` | Integer | The number of scroll batches processed during the reindex operation. Each batch contains multiple documents as configured by the `size` parameter.
`version_conflicts` | Integer | The number of version conflicts encountered. Version conflicts occur when the destination document has a higher version than the source document (when using external versioning).
`noops` | Integer | The number of documents that were skipped during processing. This happens when scripts set `ctx.op = "noop"` or when no changes are needed.
`retries` | Object | Contains retry statistics with two fields: `bulk` (number of bulk operation retries) and `search` (number of search operation retries). Retries occur automatically when temporary failures are encountered.
`throttled_millis` | Integer | The total time in milliseconds that the operation was throttled to comply with the `requests_per_second` setting. Higher values indicate more throttling was applied.
`requests_per_second` | Float | The actual rate of requests executed per second during the operation. This may differ from the requested rate due to throttling adjustments and system performance.
`throttled_until_millis` | Integer | For asynchronous operations, this indicates the next time (in milliseconds since epoch) that throttled requests will be executed. Always `0` for completed operations.
`failures` | Array | An array of failure objects describing any unrecoverable errors encountered during the operation. Each failure includes details about the error type, cause, and affected document.

## Asynchronous reindex operations

For large datasets, you can run reindex operations asynchronously to avoid blocking your application. When you set `wait_for_completion=false`, OpenSearch immediately returns a task ID that you can use to monitor the operation's progress.

### Running reindex asynchronously

<!-- spec_insert_start
component: example_code
rest: POST /_reindex?wait_for_completion=false
body: |
{
  "source": {
    "index": "large-source-index"
  },
  "dest": {
    "index": "destination-index"
  }
}
-->
{% capture step1_rest %}
POST /_reindex?wait_for_completion=false
{
  "source": {
    "index": "large-source-index"
  },
  "dest": {
    "index": "destination-index"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  params = { "wait_for_completion": "false" },
  body =   {
    "source": {
      "index": "large-source-index"
    },
    "dest": {
      "index": "destination-index"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response includes a task ID:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:12345"
}
```

### Monitoring asynchronous operations

Use the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/) to check the status of your reindex operation:

```json
GET /_tasks/oTUltX4IQMOUUVeiohTt8A:12345
```

### Managing long-running tasks

You can manage long-running reindex tasks using these operations:

- Cancel a running reindex: `POST /_tasks/oTUltX4IQMOUUVeiohTt8A:12345/_cancel`
- List all reindex tasks: `GET /_tasks?actions=*reindex*`
- Task cleanup: OpenSearch automatically removes completed task documents, but you can manually delete them if needed for immediate cleanup.

## Script operations during reindexing

You can transform documents during the reindex process using scripts. You can modify document content, metadata, and control which documents are processed.

Scripts can modify the following document metadata fields:

- `ctx._id`: Change the document ID
- `ctx._index`: Route documents to different destination indexes
- `ctx._version`: Control document versioning
- `ctx._routing`: Set custom routing values

Set the `ctx.op` field to control what happens to each document:

- `ctx.op = "index"`: Index the document normally (default behavior)
- `ctx.op = "create"`: Only create the document if it doesn't exist
- `ctx.op = "noop"`: Skip the document (useful for conditional processing)
- `ctx.op = "delete"`: Delete the document from the destination index

### Script examples

The following are script examples for common operations during reindexing.

#### Transforming field values

Add or modify fields in documents during reindexing:

```json
{
  "script": {
    "source": "ctx._source.timestamp = System.currentTimeMillis(); ctx._source.status = 'migrated'"
  }
}
```

#### Conditional document processing

Skip documents based on conditions or apply different transformations:

```json
{
  "script": {
    "source": "if (ctx._source.category == 'archived') { ctx.op = 'noop' } else { ctx._source.migrated_at = new Date() }"
  }
}
```

#### Routing documents to different indexes

Dynamically route documents to different destination indexes based on document content:

```json
{
  "script": {
    "source": "ctx._index = 'products-' + ctx._source.category.toLowerCase()"
  }
}
```

## Routing during reindexing

By default, if the reindex operation encounters a document with routing, the routing is preserved unless changed by a script. You can control routing behavior using the `routing` parameter in the `dest` section:

- `keep`: Preserves the routing from the source document (default)
- `discard`: Removes routing from reindexed documents
- `=<text>`: Sets routing to the specified value for all reindexed documents

The following request sets a custom routing value for all reindexed documents:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "source"
  },
  "dest": {
    "index": "dest",
    "routing": "=company_a"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "source"
  },
  "dest": {
    "index": "dest",
    "routing": "=company_a"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "source"
    },
    "dest": {
      "index": "dest",
      "routing": "=company_a"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Examples

The following examples demonstrate various reindexing scenarios and use cases.

### Reindex with a query filter

Copy only documents that match specific criteria:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "orders",
    "query": {
      "range": {
        "order_date": {
          "gte": "2024-01-01",
          "lte": "2024-12-31"
        }
      }
    }
  },
  "dest": {
    "index": "orders-2024"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "orders",
    "query": {
      "range": {
        "order_date": {
          "gte": "2024-01-01",
          "lte": "2024-12-31"
        }
      }
    }
  },
  "dest": {
    "index": "orders-2024"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "orders",
      "query": {
        "range": {
          "order_date": {
            "gte": "2024-01-01",
            "lte": "2024-12-31"
          }
        }
      }
    },
    "dest": {
      "index": "orders-2024"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Reindex with field selection

Copy only specific fields from source documents:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "customer-data",
    "_source": ["customer_id", "name", "email", "created_date"]
  },
  "dest": {
    "index": "customers-minimal"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "customer-data",
    "_source": [
      "customer_id",
      "name",
      "email",
      "created_date"
    ]
  },
  "dest": {
    "index": "customers-minimal"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "customer-data",
      "_source": [
        "customer_id",
        "name",
        "email",
        "created_date"
      ]
    },
    "dest": {
      "index": "customers-minimal"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Combine multiple indexes

Merge documents from multiple source indexes:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": ["products-2023", "products-2024", "products-archive"]
  },
  "dest": {
    "index": "products-combined"
  },
  "script": {
    "source": "ctx._source.migration_date = new Date().getTime()"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": [
      "products-2023",
      "products-2024",
      "products-archive"
    ]
  },
  "dest": {
    "index": "products-combined"
  },
  "script": {
    "source": "ctx._source.migration_date = new Date().getTime()"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": [
        "products-2023",
        "products-2024",
        "products-archive"
      ]
    },
    "dest": {
      "index": "products-combined"
    },
    "script": {
      "source": "ctx._source.migration_date = new Date().getTime()"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Reindex with document transformation

Transform documents during reindexing using scripts:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "user-events"
  },
  "dest": {
    "index": "events-processed"
  },
  "script": {
    "source": "if (ctx._source.email != null) { ctx._source.email = ctx._source.email.toLowerCase(); } ctx._source.processed_at = System.currentTimeMillis(); if (ctx._source.user_id == null) { ctx.op = 'noop'; }"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "user-events"
  },
  "dest": {
    "index": "events-processed"
  },
  "script": {
    "source": "if (ctx._source.email != null) { ctx._source.email = ctx._source.email.toLowerCase(); } ctx._source.processed_at = System.currentTimeMillis(); if (ctx._source.user_id == null) { ctx.op = 'noop'; }"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "user-events"
    },
    "dest": {
      "index": "events-processed"
    },
    "script": {
      "source": "if (ctx._source.email != null) { ctx._source.email = ctx._source.email.toLowerCase(); } ctx._source.processed_at = System.currentTimeMillis(); if (ctx._source.user_id == null) { ctx.op = 'noop'; }"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Reindex from a remote cluster

Copy data from a remote OpenSearch cluster:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "remote": {
      "host": "https://remote-cluster.example.com:9200",
      "username": "reindex-user",
      "password": "secure-password"
    },
    "index": "remote-index",
    "size": 1000
  },
  "dest": {
    "index": "local-copy"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "remote": {
      "host": "https://remote-cluster.example.com:9200",
      "username": "reindex-user",
      "password": "secure-password"
    },
    "index": "remote-index",
    "size": 1000
  },
  "dest": {
    "index": "local-copy"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "remote": {
        "host": "https://remote-cluster.example.com:9200",
        "username": "reindex-user",
        "password": "secure-password"
      },
      "index": "remote-index",
      "size": 1000
    },
    "dest": {
      "index": "local-copy"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Reindex with an ingest pipeline

To transform data, process documents through an ingest pipeline during reindexing. First create the pipeline, then reference it in the reindex operation:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "raw-data"
  },
  "dest": {
    "index": "processed-data",
    "pipeline": "data-enrichment"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "raw-data"
  },
  "dest": {
    "index": "processed-data",
    "pipeline": "data-enrichment"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "raw-data"
    },
    "dest": {
      "index": "processed-data",
      "pipeline": "data-enrichment"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Before running the reindex operation, create the ingest pipeline. This example creates a pipeline that adds a `processed_at` timestamp and converts the `status` field to uppercase:

```json
PUT /_ingest/pipeline/data-enrichment
{
  "description": "Enriches documents during reindexing",
  "processors": [
    {
      "set": {
        "field": "processed_at",
        "value": "{{_ingest.timestamp}}"
      }
    },
    {
      "uppercase": {
        "field": "status"
      }
    }
  ]
}
```

### Reindex with throttling

Control the reindex rate to minimize cluster impact:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex?requests_per_second=500
body: |
{
  "source": {
    "index": "production-data"
  },
  "dest": {
    "index": "production-backup"
  }
}
-->
{% capture step1_rest %}
POST /_reindex?requests_per_second=500
{
  "source": {
    "index": "production-data"
  },
  "dest": {
    "index": "production-backup"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  params = { "requests_per_second": "500" },
  body =   {
    "source": {
      "index": "production-data"
    },
    "dest": {
      "index": "production-backup"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Extract sample data

Create a smaller dataset for testing:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "max_docs": 1000,
  "source": {
    "index": "production-logs",
    "query": {
      "function_score": {
        "random_score": {
          "seed": 42
        },
        "min_score": 0.8
      }
    }
  },
  "dest": {
    "index": "test-sample"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "max_docs": 1000,
  "source": {
    "index": "production-logs",
    "query": {
      "function_score": {
        "random_score": {
          "seed": 42
        },
        "min_score": 0.8
      }
    }
  },
  "dest": {
    "index": "test-sample"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "max_docs": 1000,
    "source": {
      "index": "production-logs",
      "query": {
        "function_score": {
          "random_score": {
            "seed": 42
          },
          "min_score": 0.8
        }
      }
    },
    "dest": {
      "index": "test-sample"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Reindex to change field names

Rename fields during reindexing using scripts:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "legacy-data"
  },
  "dest": {
    "index": "updated-data"
  },
  "script": {
    "source": "ctx._source.customer_name = ctx._source.remove('client_name'); ctx._source.order_total = ctx._source.remove('total_amount');"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "legacy-data"
  },
  "dest": {
    "index": "updated-data"
  },
  "script": {
    "source": "ctx._source.customer_name = ctx._source.remove('client_name'); ctx._source.order_total = ctx._source.remove('total_amount');"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "legacy-data"
    },
    "dest": {
      "index": "updated-data"
    },
    "script": {
      "source": "ctx._source.customer_name = ctx._source.remove('client_name'); ctx._source.order_total = ctx._source.remove('total_amount');"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

This script renames `client_name` to `customer_name` and `total_amount` to `order_total` during the reindex operation.

### Reindex daily indices

Consolidate multiple time-based indices into a single index:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": ["logs-2024-01-*", "logs-2024-02-*", "logs-2024-03-*"]
  },
  "dest": {
    "index": "logs-2024-q1"
  },
  "script": {
    "source": "ctx._source.quarter = 'Q1-2024'; ctx._source.consolidated_date = System.currentTimeMillis();"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": [
      "logs-2024-01-*",
      "logs-2024-02-*",
      "logs-2024-03-*"
    ]
  },
  "dest": {
    "index": "logs-2024-q1"
  },
  "script": {
    "source": "ctx._source.quarter = 'Q1-2024'; ctx._source.consolidated_date = System.currentTimeMillis();"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": [
        "logs-2024-01-*",
        "logs-2024-02-*",
        "logs-2024-03-*"
      ]
    },
    "dest": {
      "index": "logs-2024-q1"
    },
    "script": {
      "source": "ctx._source.quarter = 'Q1-2024'; ctx._source.consolidated_date = System.currentTimeMillis();"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

This example consolidates three months of daily log indices into a quarterly index while adding metadata about the consolidation.

## Performance optimization

Use the following techniques to optimize reindexing performance.

### Throttling and rate control

Control the reindex operation's impact on cluster performance using throttling:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex?requests_per_second=100
body: |
{
  "source": {"index": "source"},
  "dest": {"index": "dest"}
}
-->
{% capture step1_rest %}
POST /_reindex?requests_per_second=100
{
  "source": {
    "index": "source"
  },
  "dest": {
    "index": "dest"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  params = { "requests_per_second": "100" },
  body =   {
    "source": {
      "index": "source"
    },
    "dest": {
      "index": "dest"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

You can dynamically adjust throttling for running reindex operations:

```json
POST /_reindex/task_id/_rethrottle?requests_per_second=200
```

### Using slicing for parallel processing

Slicing divides a reindex operation into multiple parallel tasks to improve performance on large datasets.

#### Automatic slicing

To let OpenSearch determine the optimal number of slices, set the `slices` query parameter to `auto`:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex?slices=auto
body: |
{
  "source": {"index": "large-index"},
  "dest": {"index": "large-index-copy"}
}
-->
{% capture step1_rest %}
POST /_reindex?slices=auto
{
  "source": {
    "index": "large-index"
  },
  "dest": {
    "index": "large-index-copy"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  params = { "slices": "auto" },
  body =   {
    "source": {
      "index": "large-index"
    },
    "dest": {
      "index": "large-index-copy"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Manual slicing

For more control over parallelization, you can manually configure slices by specifying the slice ID and total number of slices in the request body. 

OpenSearch uses the `max` parameter to partition the dataset consistently across all slice requests. OpenSearch applies a hash function to each document using the `max` value to determine the slice the document belongs to. This ensures that:

- Documents are distributed evenly across all slices.
- Each document goes to exactly one slice (no duplicates or gaps).
- All parallel requests must use the same `max` value for consistency.

For example, with `max: 4`, you can run four separate requests in parallel:

- Request 1: `{"id": 0, "max": 4}` (processes slice `0`)
- Request 2: `{"id": 1, "max": 4}` (processes slice `1`)
- Request 3: `{"id": 2, "max": 4}` (processes slice `2`)
- Request 4: `{"id": 3, "max": 4}` (processes slice `3`)

The following request processes slice `0` out of 4 total slices:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "large-index",
    "slice": {"id": 0, "max": 4}
  },
  "dest": {"index": "large-index-copy"}
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "large-index",
    "slice": {
      "id": 0,
      "max": 4
    }
  },
  "dest": {
    "index": "large-index-copy"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "large-index",
      "slice": {
        "id": 0,
        "max": 4
      }
    },
    "dest": {
      "index": "large-index-copy"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Run multiple requests with different slice IDs (0-3) for parallel processing.

### Monitoring reindex operations

Use the following methods to monitor the progress and performance of your reindex operations.

#### Real-time monitoring

Monitor all active reindex operations in your cluster:

```json
GET /_tasks?actions=*reindex*&detailed=true
```

#### Check specific task progress

Check the progress of a specific reindex task using its task ID:

```json
GET /_tasks/oTUltX4IQMOUUVeiohTt8A:12345
```

#### Monitor cluster health during reindex

Monitor cluster performance and disk usage during reindex operations:

```json
GET /_cluster/health
GET /_nodes/stats/indices/store
```


## SSL configuration for a remote reindex

When reindexing from remote clusters over HTTPS, configure SSL settings in `opensearch.yml`.

### Certificate-based authentication

Configure SSL using individual certificate files:

```yaml
reindex.ssl.certificate_authorities: ["/path/to/ca-cert.pem"]
reindex.ssl.certificate: "/path/to/client-cert.pem"
reindex.ssl.key: "/path/to/client-key.pem"
reindex.ssl.verification_mode: full
```

### Keystore-based authentication

Configure SSL using keystore and truststore files:

```yaml
reindex.ssl.keystore.path: "/path/to/keystore.p12"
reindex.ssl.keystore.type: "PKCS12"
reindex.ssl.truststore.path: "/path/to/truststore.p12"
reindex.ssl.truststore.type: "PKCS12"
```

### SSL configuration options

The following table lists the available SSL configuration parameters.

Parameter | Description | Default
:--- | :--- | :---
`reindex.ssl.verification_mode` | Certificate verification level: `full`, `certificate`, or `none` | `full`
`reindex.ssl.certificate_authorities` | List of CA certificate file paths | None
`reindex.ssl.truststore.path` | Path to truststore file (JKS or PKCS12) | None
`reindex.ssl.keystore.path` | Path to keystore file for client authentication | None
`reindex.ssl.supported_protocols` | Supported TLS protocol versions | `TLSv1.3,TLSv1.2`

SSL settings must be configured in `opensearch.yml` and require a cluster restart. They cannot be set in the reindex request body.
{: .warning }

### Remote cluster allowlist

Configure allowed remote hosts in `opensearch.yml`:

```yaml
reindex.remote.allowlist: [
  "remote-cluster.example.com:9200",
  "backup-cluster.example.com:9200",
  "10.0.1.*:9200"
]
```

The allowlist supports:

- Explicit host:port combinations.
- Wildcard patterns for IP ranges.
- Multiple cluster endpoints.
