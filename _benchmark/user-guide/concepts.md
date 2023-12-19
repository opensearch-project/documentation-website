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

## Throughput and latency

At the end of each test, OSB produces a table that summarizes the throughput, service time, latency, and error rate for each task or OpenSearch operation that ran. While the definition for _throughput_ remains consistent with other client-server systems, the definitions for `service time` and `latency` differ from most client-server systems in the context of OSB.

### Service time

OSB does not have insight into how long OpenSearch takes to process a request, apart from extracting the `took` time for the request. In OpenSearch, **service time** tracks the durations between the point OpenSearch issues a requests and when OpenSearch receives the response.

OSB makes function calls to `opensearch-py`, a client for OpenSearch, to communicate with an OpenSearch cluster. OSB tracks the time between when the `opensearch-py` client sends the request and receives a response from the OpenSearch cluster and considers this to be the service time. Contrasting with the traditional definition of service time, OSB’s definition of service time includes overhead, such as network latency, load-balancer overhead, or deserialization/serialization. The following image illustrates how OpenSearch measure service time versus the traditional measurement. 

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/service-time.png" alt="">

### Latency

Target throughput is core to understanding OSB’s definition of **latency**. Target throughput is the rate at which OSB issues requests  and assumes the responses will come back instantaneously.  `target-throughput` is one of the common workload parameters that can be set for each test and is measured in operations per second.

OSB always issue requests one at a time for a single client thread, specified as `search-clients` in workload parameters. If `target-throughput` is set to `0`, OSB issues a request immediately after it receives the response from the previous request. If the `target-throughput` is not 0, OSB issues the next request to match the `target-throughput` set, assuming responses return instantaneously.

#### Example A

The following diagrams illustrate latency when responses come back to OSB in 200ms, `search-clients` is set to `1`. and the `target-throughput` is set to `1` operations per second. The first diagram illustrates the expected behavior with the the aforementioned settings. 

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-1.png" alt="">

However, when a request takes longer than 200ms, as shown in the following diagram when the response for a request returns in 1110ms instead of 400ms, OSB sends the next request that was supposed to occur in 4.00s at 4.10s. All subsequent requests attempt to resynchronize with the `target-throughput` setting.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-2.png" alt="">

When measuring latency, OSB looks all the requests performed. All have a latency of 200ms except for two, the request that lasted 1100ms and the following request which was supposed to start at 4:00s. This request was delayed by 100ms, denoted by the orange area in the following diagram, and had a response of 200ms. Therefore, when OSB calculates the latency by adding the delayed time with the response time, this scenario returns a latency of **300ms**.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-3.png" alt="">

#### Example B

In this example, OSB uses the following latency settings:

- Assumes a 200ms response time
- `search_clients` set to 1
- `target-throughput` set to 10 operations per second.

The following diagram shows the schedule built by OSB with the expected response time.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/b-latency-explanation-1.png" alt="">

However, if the assumptions is that all responses will take 200ms, 10 operations per second won't be possible. Therefore, the highest throughput OSB can reach is 5 operations per second, as should in the following diagram.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/b-latency-explanation-2.png" alt="">

OSB will not account for this, and continues to try to achieve the `target-throughput` of 10 operations per second. Because of this, delays for each request being to cascade, as illustrated in the following diagram.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/b-latency-explanation-3.png" alt="">

If we combine the service time with the delay for each operation, we’ll get the following latency measurements for each operation: 
- 200 ms for operation 1
- 300 ms for operation 2
- 400 ms for operation 3
- 500 ms for operation 4 
- 600 ms latency for operation 5. 

This latency cascade continues with each subsequent request, increasing latency times.

### Recommendation

As shown in the preceeding examples, make sure you are aware of the average service time of each task run and provide a target-throughput that is within reason. OSB’s latency is calculated based on the `target-throughput` set by the user. In other words, OSB’s latency could be redefined as "throughput-based latency".

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
