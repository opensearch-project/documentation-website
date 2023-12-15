---
layout: default
title: Workload reference
nav_order: 60
parent: OpenSearch Benchmark Reference
has_children: true
redirect_from: /benchmark/workloads/index/
---

# OpenSearch Benchmark workload reference

A workload is a specification of one or more benchmarking scenarios. A workload typically includes the following:

- One or more data streams that are ingested into indices
- A set of queries and operations that are invoked as part of the benchmark

This section provides a list of options and examples you can use when customizing or using a workload.

For more information about what comprises a workload, see [Anatomy of a workload]({{site.url}}{{site.baseurl}}/benchmark/user-guide/concepts#anatomy-of-a-workload). 


## Workload examples

If you want to try certain workloads before creating your own, use the following examples.

### Running unthrottled

In the following example, OpenSearch Benchmark runs an unthrottled bulk index operation for 1 hour against the `movies` index:

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

The following workload runs a benchmark with a single task: a `match_all` query. Because no `clients` are indicated, only one client is used. According to the `schedule`, the workload runs the `match_all` query at 10 operations per second with 1 client, uses 100 iterations to warm up, and uses the next 100 iterations to measure the benchmark:

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
- For a list of prepackaged workloads for OpenSearch Benchmark, see the [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository. 
