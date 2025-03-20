---
layout: default
title: Performance testing best practices
nav_order: 160
parent: Optimizing benchmarks
grand_parent: User guide
---

# Performance testing best practices for OpenSearch Benchmark

When conducting performance testing with OpenSearch Benchmark, it's crucial to follow best practices to ensure accurate, reliable, and meaningful results. These practices help in creating realistic test scenarios, minimizing external factors that could skew results, and generating comparable and reproducible benchmarks. By adhering to these guidelines, you can gain valuable insights into your cluster's performance, including identifying bottlenecks and making informed decisions about cluster configuration and optimization.

## Environment setup

Performance testing requires careful attention to the testing environment. A properly configured environment is crucial for obtaining reliable and reproducible results.

When setting up your testing environment, it's essential to use hardware that closely matches your production environment. Using development or underpowered hardware will not provide meaningful results that can translate to production performance.

For best results, make sure that your cluster or test machine fulfills the following recommended minimum requirements:

- CPU: 8+ cores
- RAM: 32GB+
- Storage: SSD/NVMe
- Network: 10Gbps


It's recommended to provision a test cluster and configure its settings to reflect what you are most likely to deploy in production. Local machines often have limited hardware, and local development libraries can conflict with the workload's library, preventing the Benchmark test from running effectively.


## Test configuration

Proper test configuration includes setting appropriate parameters for your test scenarios and ensuring your cluster is configured optimally.

### Basic setup

The following example shows a basic benchmark configuration file. This configuration includes essential parameters such as warmup time, test duration, and the number of clients:

```json
{
  "name": "my-benchmark",
  "description": "Basic performance test",
  "test_procedures": [
    {
      "operation": {
        "warmup-time-period": 300,
        "time-period": 3600,
        "clients": 8
      }
    }
  ]
}
```

### Cluster settings

Your OpenSearch cluster settings should be optimized for your specific use case, such as the following index settings:

```json
{
  "index_settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "refresh_interval": "30s"
  }
}
```

These settings offer ample storage space for your documents and test results with 3 shards and 1 replica per index.


## Running tests

Running benchmark tests involves not just running the benchmark but also monitoring the system during the test and ensuring consistent conditions across test runs.

While you can run a basic test, you can customize your test run with additional Benchmark command options. The following example runs a `geonames` workload test that targets a specific host, and outputs the test results as a `csv`:

```bash
opensearch-benchmark run \
  --workload=geonames \
  --target-hosts=localhost:9200 \
  --pipeline=benchmark-only \
  --test-procedure=default \
  --report-format=csv \
  --report-file=benchmark-results.csv
```

### Monitoring during tests

During test execution, it's essential to monitor various system metrics to ensure the test is running correctly and to identify any potential bottlenecks. The following commands help you monitor different aspects of system performance:

```bash
# Monitor system resources
vmstat 1

# Monitor OpenSearch metrics
curl localhost:9200/_cat/nodes?v

# Monitor cluster health
curl localhost:9200/_cluster/health?pretty
```

## Metrics collection

Collecting and storing appropriate metrics is crucial for analyzing test results and making informed decisions about performance optimizations.

### Essential metrics

Configure your benchmark to collect comprehensive metrics. The following configuration example shows how to set up metrics collection with file storage:

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

### Sample metrics to track

Here's a comprehensive list of metrics that should be tracked during performance testing. The following Python structure can be used as a template for your metrics collection strategy:

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

### Metrics calculation

OpenSearch Benchmark calculates metrics differently from traditional client-server systems. For detailed information on how metrics are calculated, see [Differences between OpenSearch Benchmark and a traditional client server system](https://opensearch.org/docs/latest/benchmark/user-guide/concepts/#differences-between-opensearch-benchmark-and-a-traditional-client-server-system).

## Integration with OpenSearch Dashboards

To integrate OpenSearch Benchmark results with OpenSearch Dashboards, you can perform one of the following:

1. Configure OpenSearch Benchmark to store results in OpenSearch.
2. Create index patterns in OpenSearch Dashboards for the benchmark results.
3. Create visualizations and dashboards to analyze the benchmark data.


## Common pitfalls

When conducting performance tests with OpenSearch Benchmark, it's important to be aware of common pitfalls that can lead to inaccurate or misleading results.

### Warmup intervals

Proper warmup is crucial for accurate performance testing. Without an adequate warmup period, your test results may be skewed by initial system instabilities or caching effects.

Don't run tests without a warmup period

Instead, always include an adequate warmup period in your tests. This allows the system to reach a steady state before measurements begin. The following example gives a `geonames` run a warmup period of `300s`.

```python
# DO: Include adequate warmup
opensearch-benchmark run --workload=geonames --warmup-time-period=300
```

The appropriate warmup time can vary depending on your specific workload and system configuration. Start with at least 5 minutes (300 seconds) and adjust as needed based on your observations.

### Compare results from different environments

One of the most common mistakes in performance testing is comparing results from different environments. Results obtained from a laptop or development machine are not comparable to those from a production server due to differences in hardware, network conditions, and other environmental factors.

Instead, make that all comparisons are made within the same or identical environments. If you need to compare different configurations, make sure to change only one variable at a time while keeping the environment consistent.

### Document environment details

Proper documentation of your test environment is crucial for reproducibility and accurate analysis. Without detailed environment information, it becomes difficult to interpret results or reproduce tests in the future.

Don't omit environment details from your test reports:

Instead, always document comprehensive details about your test environment. This should include hardware specifications, software versions, and any relevant configuration settings. as shown in the following example:

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

By documenting these details, you ensure that your test results can be properly interpreted and that the tests can be reproduced if necessary.

### Troubleshooting with logs

When encountering issues or unexpected results, OpenSearch Benchmark logs can provide valuable insights. Here's how to effectively use logs for troubleshooting:

1. Navigate to the log file: The main log file is typically located at `~/.benchmark/logs/benchmark.log`.

2. Look for error messages. Search for lines containing "ERROR" or "WARNING" to identify potential issues.

3. Check for performance bottlenecks. Look for entries that indicate slow operations or resource constraints.

4. Review configuration details, such as logs. Logs often include information about the test configuration, which can help verify that your intended settings were applied correctly.

5. Pay attention to the duration of different phases of the benchmark, including warmup and measurement periods.

By carefully reviewing these logs, you can often identify the root cause of performance issues or unexpected benchmark results.

## Security considerations

Security should never be an afterthought in performance testing. It's important to include security configurations that match your production environment to get realistic performance measurements.

### SSL configuration

Here's an example of how to configure SSL for secure communications during benchmark testing:

```yaml
security:
  ssl: true
  verification_mode: full
  certificate_authorities:
    - /path/to/ca.crt
  client_certificate: /path/to/client.crt
  client_key: /path/to/client.key
```

### Authentication setup

When testing with authentication enabled, ensure your benchmark includes the appropriate authentication headers:

```python
headers = {
    'Authorization': 'Basic {}'.format(
        base64.b64encode(
            '{}:{}'.format(username, password).encode()
        ).decode()
    )
}
```

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

## Amazon OpenSearch Serverless considerations

When testing with Amazon OpenSearch Serverless, be aware that not all test procedures may be supported. Always check the README of the workload you're using to see if it's compatible with AOSS. If compatibility information is not provided, you may need to test the procedures individually to determine which ones are supported.