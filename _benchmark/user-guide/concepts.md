---
layout: default
title: Concepts
nav_order: 3
parent: User guide
---

# Concepts

Before using OpenSearch Benchmark, familiarize yourself with the following concepts.

## Core concepts and definitions

- **Workload**: The description of one or more benchmarking scenarios that use a specific document corpus to perform a benchmark against your cluster. The document corpus contains any indexes, data files, and operations invoked when the workflow runs. You can list the available workloads by using `opensearch-benchmark list workloads` or view any included workloads in the [OpenSearch Benchmark Workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). For more information about the elements of a workload, see [Anatomy of a workload](#anatomy-of-a-workload). For information about building a custom workload, see [Creating custom workloads]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/).

- **Pipeline**: A series of steps occurring before and after a workload is run that determines benchmark results. OpenSearch Benchmark supports three pipelines:
  - `from-sources`: Builds and provisions OpenSearch, runs a benchmark, and then publishes the results.
  - `from-distribution`: Downloads an OpenSearch distribution, provisions it, runs a benchmark, and then publishes the results.
  - `benchmark-only`: The default pipeline. Assumes an already running OpenSearch instance, runs a benchmark on that instance, and then publishes the results.

- **Test**: A single invocation of the OpenSearch Benchmark binary.

A workload is a specification of one or more benchmarking scenarios. A workload typically includes the following:

- One or more data streams that are ingested into indexes.
- A set of queries and operations that are invoked as part of the benchmark.

## Anatomy of a workload

The following example workload shows all of the essential elements needed to create a `workload.json` file. You can run this workload in your own benchmark configuration to understand how all of the elements work together:

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

A workload usually includes the following elements:

- [indices]({{site.url}}{{site.baseurl}}/benchmark/workloads/indices/): Defines the relevant indexes and index templates used for the workload.
- [corpora]({{site.url}}{{site.baseurl}}/benchmark/workloads/corpora/): Defines all document corpora used for the workload.
- `schedule`: Defines operations and the order in which the operations run inline. Alternatively, you can use `operations` to group operations and the `test_procedures` parameter to specify the order of operations.
- `operations`: **Optional**. Describes which operations are available for the workload and how they are parameterized.

### Indices

To create an index, specify its `name`. To add definitions to your index, use the `body` option and point it to the JSON file containing the index definitions. For more information, see [indices]({{site.url}}{{site.baseurl}}/benchmark/workloads/indices/).

### Corpora

The `corpora` element requires the name of the index containing the document corpus, for example, `movies`, and a list of parameters that define the document corpora. This list includes the following parameters:

-  `source-file`: The file name that contains the workload's corresponding documents. When using OpenSearch Benchmark locally, documents are contained in a JSON file. When providing a `base_url`, use a compressed file format: `.zip`, `.bz2`, `.gz`, `.tar`, `.tar.gz`, `.tgz`, or `.tar.bz2`. The compressed file must have one JSON file containing the name.
-  `document-count`: The number of documents in the `source-file`, which determines which client indexes correlate to which parts of the document corpus. Each N client receives an Nth of the document corpus. When using a source that contains a document with a parent-child relationship, specify the number of parent documents.
- `uncompressed-bytes`: The size, in bytes, of the source file after decompression, indicating how much disk space the decompressed source file needs.
- `compressed-bytes`: The size, in bytes, of the source file before decompression. This can help you assess the amount of time needed for the cluster to ingest documents.

### Operations

The `operations` element lists the OpenSearch API operations performed by the workload. For example, you can set an operation to `create-index`, an index in the test cluster to which OpenSearch Benchmark can write documents. Operations are usually listed inside of `schedule`.

### Schedule

The `schedule` element contains a list of actions and operations that are run by the workload. Operations run according to the order in which they appear in the `schedule`. The following example illustrates a `schedule` with multiple operations, each defined by its `operation-type`:

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

According to this schedule, the actions will run in the following order:

1. The `create-index` operation creates an index. The index remains empty until the `bulk` operation adds documents with benchmarked data.
2. The `cluster-health` operation assesses the health of the cluster before running the workload. In this example, the workload waits until the status of the cluster's health is `green`.
   - The `bulk` operation runs the `bulk` API to index `5000` documents simultaneously.
   - Before benchmarking, the workload waits until the specified `warmup-time-period` passes. In this example, the warmup period is `120` seconds.
5. The `clients` field defines the number of clients that will run the remaining actions in the schedule concurrently.
6. The `search` runs a `match_all` query to match all documents after they have been indexed by the `bulk` API using the 8 clients specified.
   - The `iterations` field indicates the number of times each client runs the `search` operation. The report generated by the benchmark automatically adjusts the percentile numbers based on this number. To generate a precise percentile, the benchmark needs to run at least 1,000 iterations.
   - Lastly, the `target-throughput` field defines the number of requests per second each client performs, which, when set, can help reduce the latency of the benchmark. For example, a `target-throughput` of 100 requests divided by 8 clients means that each client will issue 12 requests per second.
