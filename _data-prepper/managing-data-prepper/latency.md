---
layout: default
title: Pipeline latency tuning guide
parent: Managing OpenSearch Data Prepper
nav_order: 45
---

# Pipeline latency tuning guide

This section provides the most effective configurations for reducing end-to-end latency and contains ready-to-use examples.

There are the following latency types:

- **Ingest latency**: The amount of time from the moment the source receives data until the sink sends it to OpenSearch or another destination.
- **Searchable latency**: The amount of time until data becomes visible in OpenSearch search results. This is capped by the index's `refresh_interval`.

## Low-latency configuration

The following table lists configurations that can be adjusted to improve latency.

Component | Setting | Why it matters | Low‑latency starting point | Trade‑offs
:--- | :--- | :--- | :--- | :---
**Pipeline loop** | `workers` in each pipeline | Increasing parallelism reduces queueing in CPU- or I/O-bound pipelines. | Typically set to the number of CPU cores; increase if sinks are I/O bound. | Higher CPU usage and more concurrent requests to sinks.

**Pipeline loop** | `delay` | The pause between buffer reads. | `0`--`10ms` to pull data as soon as possible. | Lower delays reduce latency but increase polling overhead, context switches, and CPU activations. Adjust to balance latency and CPU usage.

**Bounded blocking buffer** | `batch_size` | Determines how many records are processed per batch; smaller batches flush sooner. | 64--256 | Smaller batches reduce throughput and increase the number of requests.

**Peer Forwarder** | `batch_size`, `request_timeout` | Batch size and request timeouts impact hop-to-hop latency. | Keep `batch_size` moderate, for example, 48--128. | Too small a `batch_size` reduces throughput, and a `request_timeout` that is too short can cause retries or timeouts under load.
**Peer Forwarder** | `forwarder` [configuration]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/peer-forwarder/#configuration) | Limits queueing before forwarding. | Use low timeouts, e.g., 50–200 ms. | Shorter timeouts increase in-flight requests and connections, adding CPU, memory, TLS handshake, and context-switch overhead. Longer timeouts can cause queue buildup and higher tail latency.
**Aggregate processors** | `group_duration` | Determines how long events wait for the aggregation window to close. | Prefer removing aggregation; if needed, keep the window short, for example, `5s`. | Smaller windows can break grouping semantics.
**OpenSearch sink** | `bulk_size` (MiB) | Determines the size of bulk requests; smaller bulks flush sooner. | 1--5 MiB | Very small `bulk_size` increases the number of bulk requests, adds HTTP/TLS overhead, causes more threadpool contention, produces smaller Lucene batches, and lowers throughput. Very large `bulk_size` increases time to fill a batch, can cause bigger retries, memory spikes, and higher p95/p99 latency.
**OpenSearch sink** | `index.refresh_interval` | Controls how frequently indexed data becomes searchable. | `1s` (default) | Lower values increase segment churn and indexing overhead.

The Delay processor adds latency by design. Avoid it in low‑latency pipelines.
{: note}

## Low‑latency configuration examples

The following are low-latency configuration examples.

The following are low-latency configuration examples.

### Logs: Prioritize sub‑second ingest

```yaml
logs-low-latency:
  workers: 4
  delay: 0
  source:
    http:
      port: 2021
      path: /logs
      ssl: true
      sslKeyCertChainFile: certs/dp.crt
      sslKeyFile: certs/dp.key
  buffer:
    bounded_blocking:
      buffer_size: 4096
      batch_size: 128
  processor: []   # keep light, avoid heavy aggregation
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index_type: log-analytics
        bulk_size: 1         # MiB; smaller -> lower latency, lower throughput
        max_retries: 8
```
{% include copy.html %}

### Traces with peer forwarding minimizing cross‑node wait

Create the following `data-prepper-config.yaml` file:

```yaml

ssl: true
serverPort: 4900
keyStoreFilePath: certs/dp1-admin.p12   # or .jks
keyStorePassword: changeit
privateKeyPassword: changeit

# Or disable ssl on top-level admin/metrics server
#ssl: false
#serverPort: 4900

authentication:
  http_basic:
    username: myuser
    password: "mys3cr3t"
  # or disable http_basic authentication
  #unauthenticated:
  
peer_forwarder:

  ssl: true
  ssl_certificate_file: certs/dp1-peer.crt
  ssl_key_file: certs/dp1-peer.key
  authentication:
    mutual_tls: {}
  port: 4994 # Default
  # choose one discovery mode
  # Discovery mode: dns
  discovery_mode: dns
  domain_name: data-prepper.your-domain.local

  # discovery_mode: static
  #port: 4994
  #static_endpoints: ["dp1", "dp2"]

  # lower batching/wait
  batch_size: 96
  request_timeout: 1000   # ms
```
{% include copy.html %}

Create the following `pipelines.yml` file:

```yaml
traces-low-latency:
  workers: 4
  delay: 0
  source:
    otel_trace_source:
      port: 21890
      ssl: true
      sslKeyCertChainFile: certs/dp.crt
      sslKeyFile: certs/dp.key
  buffer:
    bounded_blocking:
      buffer_size: 4096
      batch_size: 96
  processor:
    - trace_peer_forwarder: {}
  sink:
    - pipeline:
        name: raw-trace-pipeline   # feed the next pipeline

raw-trace-pipeline:
  source:
    pipeline:
      name: traces-low-latency     # consumes from above
  processor:
    - otel_traces:
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_password
        index_type: trace-analytics-raw
```
{% include copy.html %}
{% include copy.html %}
