---
layout: default
title: Metrics reference
nav_order: 25
has_children: true
parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/metrics/index/
---

# Metrics

After a workload completes, OpenSearch Benchmark stores all metric records within its metrics store. These metrics can be kept in memory or in an OpenSearch cluster. 

## Storing metrics

You can specify whether metrics are stored in memory or in a metrics store while running the benchmark by setting the [`datastore.type`](https://opensearch.org/docs/latest/benchmark/configuring-benchmark/#results_publishing) parameter in your `benchmark.ini` file. 

### In memory

If you want to store metrics in memory while running the benchmark, provide the following settings in the `results_publishing` section of `benchmark.ini`:

```ini
[results_publishing]
datastore.type = in-memory
datastore.host = <host-url>
datastore.port = <host-port>
datastore.secure = False
datastore.ssl.verification_mode = <ssl-verification-details>
datastore.user = <username>
datastore.password = <password>
```

### OpenSearch

If you want to store metrics in an external OpenSearch memory store while running the benchmark, provide the following settings in the `results_publishing` section of `benchmark.ini`:

```ini
[results_publishing]
datastore.type = opensearch
datastore.host = <opensearch endpoint>
datastore.port = 443
datastore.secure = true
datastore.ssl.verification_mode = none
datastore.user = <opensearch basic auth username>
datastore.password = <opensearch basic auth password>
datastore.number_of_replicas = 
datastore.number_of_shards = 
```
When neither `datastore.number_of_replicas` nor `datastore.number_of_shards` is provided, OpenSearch uses the default values: `0` for the number of replicas and `1` for the number of shards. If these settings are changed after the data store cluster is created, the new replica and shard settings will only apply when new results indexes are created at the end of the month. 

After you run OpenSearch Benchmark configured to use OpenSearch as a data store, OpenSearch Benchmark creates three indexes:

- `benchmark-metrics-YYYY-MM`: Holds granular metric and telemetry data.
- `benchmark-results-YYYY-MM`: Holds data based on final results.
- `benchmark-test-executions-YYYY-MM`: Holds data about `execution-ids`.

You can visualize data inside these indexes in OpenSearch Dashboards.


## Next steps

- For more information about how to design a metrics store, see [Metric records]({{site.url}}{{site.baseurl}}/benchmark/metrics/metric-records/).
- For more information about what metrics are stored, see [Metric keys]({{site.url}}{{site.baseurl}}/benchmark/metrics/metric-keys/).
