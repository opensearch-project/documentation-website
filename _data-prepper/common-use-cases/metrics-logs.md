---
layout: default
title: Deriving metrics from logs
parent: Common use cases
nav_order: 15
canonical_url: https://docs.opensearch.org/latest/data-prepper/common-use-cases/metrics-logs/
---

# Deriving metrics from logs

You can use Data Prepper to derive metrics from logs. 

The following example pipeline receives incoming logs using the [`http` source plugin]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/http-source) and the [`grok` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/grok/). It then uses the [`aggregate` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/aggregate/) to extract the metric bytes aggregated during a 30-second window and derives histograms from the results.

This pipeline writes data to two different OpenSearch indexes:

- `logs`: This index stores the original, un-aggregated log events after being processed by the `grok` processor.
- `histogram_metrics`: This index stores the derived histogram metrics extracted from the log events using the `aggregate` processor.

The pipeline contains two sub-pipelines:

- `apache-log-pipeline-with-metrics`: Receives logs through an HTTP client like FluentBit, using `grok` to extract important values from the logs by matching the value in the log key against the [Apache Common Log Format](https://httpd.apache.org/docs/2.4/logs.html#accesslog). It then forwards the grokked logs to two destinations:

 - An OpenSearch index named `logs` to store the original log events.
 - The `log-to-metrics-pipeline` for further aggregation and metric derivation.

- `log-to-metrics-pipeline`: Receives the grokked logs from the `apache-log-pipeline-with-metrics` pipeline, aggregates the logs, and derives histogram metrics of bytes based on the values in the `clientip` and `request` keys. Finally, it sends the derived histogram metrics to an OpenSearch index named `histogram_metrics`.
  
#### Example pipeline

```json
apache-log-pipeline-with-metrics:
  source:
    http:
      # Provide the path for ingestion. ${pipelineName} will be replaced with pipeline name configured for this pipeline.
      # In this case it would be "/apache-log-pipeline-with-metrics/logs". This will be the FluentBit output URI value.
      path: "/${pipelineName}/logs"
  processor:
    - grok:
        match:
          log: [ "%{COMMONAPACHELOG_DATATYPED}" ]
  sink:
    - opensearch:
        ...
        index: "logs"
    - pipeline:
        name: "log-to-metrics-pipeline"
        
log-to-metrics-pipeline:
  source:
    pipeline:
      name: "apache-log-pipeline-with-metrics"
  processor:
    - aggregate:
        # Specify the required identification keys
        identification_keys: ["clientip", "request"]
        action:
          histogram:
            # Specify the appropriate values for each of the following fields
            key: "bytes"
            record_minmax: true
            units: "bytes"
            buckets: [0, 25000000, 50000000, 75000000, 100000000]
        # Pick the required aggregation period
        group_duration: "30s"
  sink:
    - opensearch:
        ...
        index: "histogram_metrics"
```
{% include copy-curl.html %}
