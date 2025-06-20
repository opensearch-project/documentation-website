---
layout: default
title: Performance testing best practices
nav_order: 160
parent: Optimizing benchmarks
grand_parent: User guide
---

# Performance testing best practices

When conducting performance testing using OpenSearch Benchmark, it's crucial to follow some key best practices to ensure accurate, reliable, and meaningful results. These practices help in creating realistic test scenarios, minimizing external factors that could skew results, and generating comparable and reproducible benchmarks. By adhering to these guidelines, you can gain valuable insights into your cluster's performance, including identifying bottlenecks and making informed decisions about cluster configuration and optimization.

## Environment setup

Performance testing requires careful attention to the testing environment. A properly configured environment is vital to obtaining reliable and reproducible results.

When setting up your testing environment, it's essential to use hardware that closely matches your production environment. Using development or underpowered hardware will not provide meaningful results that are translatable to production performance. Local machines often have limited hardware, and local development libraries can conflict with the workload's library, preventing the benchmark test from running effectively.

For the best results, make sure that your load generation host or machine running OpenSearch Benchmark follows the minimum hardware requirements:

- CPU: 8+ cores
- RAM: 32+ GB
- Storage: Solid-state drive (SSD)/NVMe
- Network: 10 Gbps


We recommend provisioning a test cluster and configuring its settings to reflect what you are most likely to deploy in production.


## Test configuration

Proper test configuration includes setting appropriate parameters for your test scenarios and ensuring that your cluster is configured optimally.

### Basic setup

The following example shows a basic benchmark configuration file. This configuration includes essential parameters such as warmup time, test duration, and the number of clients:

```json
     {
      "name": "my-benchmark-test-procedure",
      "description": "This test procedure runs term query against a cluster. It includes a 300-second warm-up, followed by a 3600-second benchmark using 8 concurrent clients.",
      "schedule": [
        {
          "operation": "term",
          "warmup-time=period": 300,
          "time-period": 3600,
          "clients": 8
        }
      ]
    }
```
{% include copy.html %}

### Index settings

Your OpenSearch index settings should be optimized for your specific use case. Try to set the number of shards per index to match your production cluster. However, if you're a developer who wants to focus on a single shard's performance and limit the variables impacting performance, use a single primary shard, as shown in the following example `index_settings`: 

```json
{
  "index_settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "refresh_interval": "30s"
  }
}
```

These settings offer ample storage space for your documents and test results, with 3 shards and 1 replica per index.


## Running tests

Running benchmark tests involves monitoring the system during the test and ensuring consistent conditions across test runs.

While you can run a basic test, you can also customize your test run with additional [benchmark command options]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/index/). The following example runs a `geonames` workload test that targets a specific host and outputs the test results as a `csv`, which can be used for further analysis of the benchmark's metrics:

```bash
opensearch-benchmark run \
  --workload=geonames \
  --target-hosts=localhost:9200 \
  --pipeline=benchmark-only \
  --test-procedure=default \
  --report-format=csv \
  --report-file=benchmark-results.csv
```
{% include copy.html %}

### Monitoring during tests

During test execution, it's essential to monitor various system metrics to ensure that the test is running correctly and to identify any potential bottlenecks. The following commands help you monitor different aspects of system performance:

```bash
# Monitor system resources
vmstat 1

# Monitor OpenSearch metrics
curl localhost:9200/_cat/nodes?v
curl localhost:9200/_cat/indices?v

# Monitor cluster health
curl localhost:9200/_cluster/health?pretty
```
{% include copy.html %}

## Collecting metrics

Collecting and storing appropriate metrics is important for analyzing test results and making informed decisions about performance optimizations.

### Essential metrics

Configure your benchmark to collect comprehensive metrics. The following example configuration shows you how to set up metric collection with file storage:

```json
{
  "metrics": {
    "store_metrics": true,
    "detailed": true,
    "metrics_store": {
      "type": "file",
      "location": "/path/to/metrics"
    }
  }
}
```
{% include copy.html %}

### Sample metrics to track

The following Python structure can be used as a template and includes a list of metrics that should be tracked during performance testing:

```python
metrics_to_track = {
    'latency': {
        'mean': 'ms',
        'median': 'ms',
        'p95': 'ms',
        'p99': 'ms'
    },
    'throughput': {
        'ops/sec': 'count',
        'mb/sec': 'bytes'
    },
    'system': {
        'cpu_usage': '%',
        'memory_used': 'bytes',
        'disk_io': 'iops'
    }
}
```
{% include copy.html %}

### Calculating metrics

OpenSearch Benchmark calculates metrics differently than traditional client-server systems. For detailed information about how metrics are calculated, see [Differences between OpenSearch Benchmark and a traditional client-server system]({{site.url}}{{site.baseurl}}/benchmark/user-guide/concepts/#differences-between-opensearch-benchmark-and-a-traditional-client-server-system).

## Integration with OpenSearch Dashboards

To integrate OpenSearch Benchmark results with OpenSearch Dashboards, use the following steps:

1. [Configure OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/user-guide/install-and-configure/configuring-benchmark/) to store results in OpenSearch.
2. Create index patterns in OpenSearch Dashboards for the benchmark results.
3. Create visualizations and dashboards to analyze the benchmark data.


## Common pitfalls

When conducting performance tests using OpenSearch Benchmark, it's important to be aware of some common pitfalls that can lead to inaccurate or misleading results.

### Warmup intervals

Proper warmup is critical to accurate performance testing. Without an adequate warmup period, your test results may be skewed by initial system instabilities or caching effects.

Don't run tests without a warmup period.

Instead, always include an adequate warmup period in your tests. This allows the system to reach a steady state before measurements begin. In the following example, a `geonames` run is given a warmup period of `300s`:

```python
opensearch-benchmark execute-test --workload=geonames --workload-params="warmup_time_period:300"
```

The appropriate warmup period can vary depending on your specific workload and system configuration. Start with at least 5 minutes (300 seconds) and adjust as needed based on your observations.

### Comparing results from different environments

One of the most common mistakes in performance testing is comparing results from different environments. Results obtained from a laptop or development machine are not comparable to those from a production server due to differences in hardware, network conditions, and other environmental factors.

Instead, ensure that all comparisons are made using the same or identical environments. If you need to compare different configurations, make sure to change only one variable at a time while keeping the environment consistent.

### Documenting your test environment

Proper documentation of your test environment is crucial for reproducibility and accurate analysis. Without detailed environment information, it becomes difficult to interpret results or reproduce tests in the future.

Don't omit environment details from your test reports.

Instead, always comprehensively document the details of your test environment. This should include hardware specifications, software versions, and any relevant configuration settings. The following example shows you how to add environment details when running OpenSearch Benchmark with a Python script: 

```python
# DO: Document environment details
def run_benchmark():
    environment = {
        'hardware': 'AWS m5.2xlarge',
        'os': 'Ubuntu 20.04',
        'kernel': '5.4.0-1018-aws',
        'opensearch': '2.0.0',
        'java': 'OpenJDK 11.0.11',
        'benchmark_version': '1.0.0'
    }
    results = opensearch_benchmark.run()
    return {'environment': environment, 'results': results}
```
{% include copy.html %}

By documenting these details, you ensure that your test results can be properly interpreted and that the tests can be reproduced if necessary.

### Troubleshooting with logs

When encountering issues or unexpected results, OpenSearch Benchmark logs can provide valuable insights. Here's how to effectively use logs for troubleshooting:

1. Navigate to the log file. The main log file is typically located at `~/.osb/logs/benchmark.log`.

2. Look for error messages. Search for lines containing "ERROR" or "WARNING" to identify potential issues.

3. Check for performance bottlenecks. Look for entries that indicate slow operations or resource constraints.

4. Review configuration details, such as logs. Logs often include information about the test configuration, which can help verify that your intended settings were applied correctly.

5. Pay attention to the duration of different phases of the benchmark, including warmup and measurement periods.

By carefully reviewing these logs, you can often identify the root cause of performance issues or unexpected benchmark results. If you encounter a log error that you do not recognize, submit an issue to the [OpenSearch Benchmark repository](https://github.com/opensearch-project/opensearch-benchmark). 

## Security considerations

In most cases, a basic authentication protocol should be sufficient for testing. However, you can use SSL for secure communication during benchmark testing, as shown in the following example `opensearch.yml` configuration:

```yaml
security:
  ssl: true
  verification_mode: full
  certificate_authorities:
    - /path/to/ca.crt
  client_certificate: /path/to/client.crt
  client_key: /path/to/client.key
```
{% include copy.html %}

## Maintenance

Regular maintenance of your benchmark environment and tools is essential for consistent and reliable testing over time.

Keep your benchmark tools and workloads up to date with the following commands:

```bash
# Update OpenSearch Benchmark
pip install --upgrade opensearch-benchmark

# Update workloads
opensearch-benchmark update-workload geonames

# Clean old data
opensearch-benchmark clean
```
{% include copy.html %}

## Amazon OpenSearch Serverless considerations

When testing using Amazon OpenSearch Serverless, be aware that not all test procedures may be supported. Always check the `README.md` file of the [workload](https://github.com/opensearch-project/opensearch-benchmark-workloads) you're using to confirm whether it's compatible with OpenSearch Serverless. If compatibility information is not provided, you may need to test the procedures individually to determine which ones are supported.
