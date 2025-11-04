---
layout: default
title: Pipeline latency tuning guide
parent: Managing OpenSearch Data Prepper
nav_order: 45
---

# Pipeline latency tuning guide

This section collects the most impactful configuration for reducing end‑to‑end latency and provides copy‑paste examples. 

“Latency” can mean:

- **Ingest latency**: The time it takes from the source receiving data until the sink sends it to OpenSearch, or another destination.
- **Searchable latency**: The time it takes until data becomes visible in OpenSearch search results. This is capped by the index’s `refresh_interval`.

## Low Latency configuration

The following table lists configuration that can be tweaked to improve latency.

Component | Setting | Why it matters | Low‑latency starting point | Trade‑offs
:--- | :--- | :--- | :--- | :---
**Pipeline loop** | `workers` in each pipeline | More parallelism reduces queueing in CPU/IO bound pipelines. | The number of CPU cores, increase if sinks are I/O bound. | Higher CPU, more concurrent requests to sinks.
**Pipeline loop** | `delay` | Sleep between buffer reads. | `0`–`10ms` to pull as soon as possible. | Lower delays increase polling overhead, increasing context switches and CPU wakeups. Tune to balance latency and CPU.
**Bounded blocking buffer** | `batch_size` | Smaller batches flush sooner. | 64–256 | Smaller batches decrease throughput and increase request rate.
**Peer Forwarder** | `batch_size`, `request_timeout` | The batch sizing and timeouts affect hop‑to‑hop delay. | Keep `batch_size` modest for example 48–128. | Too small `batch_size` reduces throughput. `request_timeout` too low increases retries/timeouts under load.
**Peer Forwarder** | `forwarder` [configuration]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/peer-forwarder/#configuration) | Caps queueing before forwarding. | Use low timeouts for example 50–200 ms. | Shorter timeouts can increase in-flight requests/connections, adding CPU, memory, TLS handshakes, and context-switch overhead. Too long causes queue build-up and higher tail latency.
**Aggregate processors** | `group_duration` | The events wait for the window to close. | Prefer removing aggregation. If required, keep the window minimal, for example `5s`. | Smaller windows may break grouping semantics.
**OpenSearch sink** | `bulk_size` (MiB) | Smaller bulks flush sooner. | 1–5 MiB | Very small `bulk_size` leads to more bulk requests for the same data, extra HTTP/TLS overhead, more threadpool contention, smaller Lucene batches, lower throughput. Very large leads to longer time to fill a batch, bigger retries, and memory spikes,and higher p95/p99.
**OpenSearch side** | `index.refresh_interval` | Controls when data becomes searchable. | `1s` (default). | Lower refresh increases segment churn and indexing cost.

The Delay processor adds latency by design. Avoid it in low‑latency pipelines.
{: note}

## Low‑latency configuration examples

### Logs: prioritize sub‑second ingest

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

Create `pipelines.yml` as follows:

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
