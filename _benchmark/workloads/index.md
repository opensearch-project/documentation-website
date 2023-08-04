---
layout: default
title: Workload reference
nav_order: 60
has_children: true
---

# OpenSearch Benchmark workload reference

A workload is a specification of one or more benchmarking scenarios. A workload typically includes the following:

- One or more data streams that are ingested into indices.
- A set of queries and operations that are invoked as part of the benchmark.

## Anatomy of a workload

The following example workload shows all of the essential elements need to create a workload.json file. You can run this workload in your own benchmark configuration, in order to understand how all element coalesce together:

```json
{
  "description": "Tutorial benchmark for OpenSearch Benchmark",
  "indices": [
    {
      "name": "movies",
      "body": "index.json"
    }
  ],
  "corpora": [
    {
      "name": "movies",
      "documents": [
        {
          "source-file": "movies-documents.json",
          "document-count": 11658903, # Fetch document count from command line
          "uncompressed-bytes": 1544799789 # Fetch uncompressed bytes from command line
        }
      ]
    }
  ],
  "schedule": [
    {
      "operation": {
        "operation-type": "create-index"
      }
    },
    {
      "operation": {
        "operation-type": "cluster-health",
        "request-params": {
          "wait_for_status": "green"
        },
        "retry-until-success": true
      }
    },
    {
      "operation": {
        "operation-type": "bulk",
        "bulk-size": 5000
      },
      "warmup-time-period": 120,
      "clients": 8
    },
    {
      "operation": {
        "name": "query-match-all",
        "operation-type": "search",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "iterations": 1000,
      "target-throughput": 100
    }
  ]
}
```

A workload usually consists of the following elements:

- [indices]({{site.url}}{{site.baseurl}}/benchmark/workloads/indices/): Defines the relevant indices and index templates used for the workload.
- [corpora]({{site.url}}{{site.baseurl}}/benchmark/workloads/corpora/): Defines all documents corpora used for the workload.
- `schedule`: Defines in what order the workload performs an action. It can use either the `operations` element to define the operations or place the operations in line.
- `operations`: **Optional**. Describes which operations are available for this track and how they are parametrized. 

### Indices

To create an index, you need to specify the `name` of the index. If you want to add definitions for your index, use the `body` option and point it to the JSON file containing the index definitions.

### Corpora

The `corpora` element requires the name of the index containing the document corpus, for example, `movies`, and a list of parameters that define the document corpora, which includes:

-  `source-file`: The file name to corresponding documents. When using Benchmark locally, documents are contained in a JSON file. When providing a `base_url`, use a compressed file format; `.zip`, `.bz2`, `.gz,` `.tar`, `.tar.gz`, `.tgz` or `.tar.bz2`. The compressed file must contain one JSON file with the name. 
-  `document-count`  The number of documents in the `source-file` that determines which client indexes correlate to which part of the document corpus (each N client get on N-th of the document corpus). When using a source that contains a document with a parent-child relationship, specify the number of parent documents. 
- `uncompressed-bytes` The size in bytes of the source file after decompression, used to show you much disk space the decompressed source file needs. You can also indicate the number of `compressed-bytes`, the size of the source file before decompression, which can help you assess the time it'll take for the workload to ingest the documents

### Operations

The `operations` element lists the API OpenSearch operations performed by the workload For example, you can set an operation to `create-index`, which creates an index of Benchmarked data after the workload completes. Operations are usually listed inside of `schedule`.

### Schedule

The `schedule` element contains a list of actions and  operations run by the workload. Operations run according to the order in which they appear in the `schedule`. The following example illustrates a `schedule` with multiple operations, each defined by their `operation-type`. 

```json
  "schedule": [
    {
      "operation": {
        "operation-type": "create-index"
      }
    },
    {
      "operation": {
        "operation-type": "cluster-health",
        "request-params": {
          "wait_for_status": "green"
        },
        "retry-until-success": true
      }
    },
    {
      "operation": {
        "operation-type": "bulk",
        "bulk-size": 5000
      },
      "warmup-time-period": 120,
      "clients": 8
    },
    {
      "operation": {
        "name": "query-match-all",
        "operation-type": "search",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "iterations": 1000,
      "target-throughput": 100
    }
  ]
}
```

According to this schedule, each action will run in the following order.

1. The `create-index` operation creates an index with benchmarked data.
2. The `cluster-health` operation assess the health of the cluster before running the workload. In this example, the workload will wait until the status of cluster's health is `green`.
3. The `bulk` operation run the `bulk` API to index `500` documents at once.
4. Before benchmarking, the workload waits until the specified `warmup-time-period` passes. In this example, the warmup period if `120` seconds.
5. The `clients` options defines the number of clients that will run the remaining actions in the schedule concurrently.
6. The `search` runs a `match_all` query to find documents that match each other after they are indexed by the `bulk` API using the 8 clients specified.
7. The `iterations` options indicates the number of time each client runs the `search` operation. The report generated by the benchmark automatically adjusts the percentile numbers based on this number. To generate a precise percentile, the benchmark needs to run at least 1000 iteration.
8. Lastly, the `target-throughput` defines the number of requests per second each client performs, which when set can help reduce the latency of the benchmark. For example, a `target-throughput` of 100 requests divided by 8 clients means that each client will issue 12 requests per second.


## Workload examples

If you want to try certain workloads before creating your own, use the following examples.

### Running unthrottled

In the following example, OpenSearch Benchmark runs a bulk index operation unthrottled for one hour against the `movies` index:

```json
{
  "description": "Tutorial benchmark for OpenSearch Benchmark",
  "indices": [
    {
      "name": "movies",
      "body": "index.json"
    }
  ],
  "corpora": [
    {
      "name": "movies",
      "documents": [
        {
          "source-file": "movies-documents.json",
          "document-count": 11658903, # Fetch document count from command line
          "uncompressed-bytes": 1544799789 # Fetch uncompressed bytes from command line
        }
      ]
    }
  ],
  "schedule": [
  {
    "operation": "bulk",
    "warmup-time-period": 120,
    "time-period": 3600,
    "clients": 8
  }
]
}
```

### Workload with a single task

The following workload runs a benchmark with a single task, a `match_all` query. According to the `schedule`, the workload runs the `match_all` query at 10 operations per second with one client, uses 100 iterations to warmup, and the next 100 iterations to measure the benchmark:

```json
{
  "description": "Tutorial benchmark for OpenSearch Benchmark",
  "indices": [
    {
      "name": "movies",
      "body": "index.json"
    }
  ],
  "corpora": [
    {
      "name": "movies",
      "documents": [
        {
          "source-file": "movies-documents.json",
          "document-count": 11658903, # Fetch document count from command line
          "uncompressed-bytes": 1544799789 # Fetch uncompressed bytes from command line
        }
      ]
    }
  ],
{
  "schedule": [
    {
      "operation": {
        "operation-type": "search",
        "index": "_all",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "warmup-iterations": 100,
      "iterations": 100,
      "target-throughput": 10
    }
  ]
}
}
```

## Next steps

- For more information about configuring OpenSearch Benchmark, see [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/). 
- To show a list of prepackaged workloads for OpenSearch Benchmark, see the [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository. 