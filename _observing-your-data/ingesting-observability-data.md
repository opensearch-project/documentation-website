---
layout: default
title: Ingesting observability data
nav_order: 20
---

# Ingesting observability data

Before you can analyze observability data in OpenSearch Dashboards, your applications must send it to OpenSearch or to a backend that OpenSearch can query. Logs and traces are stored in OpenSearch indexes. Metrics are stored in Prometheus, which OpenSearch queries through a Prometheus data source, or stored in OpenSearch indexes.

The setups described in the documentation use the following components:

- Applications instrumented using [OpenTelemetry](https://opentelemetry.io/docs/) SDKs produce traces, metrics, and logs.
- Log collectors, such as [Fluent Bit](https://docs.fluentbit.io/manual/), read log files and send log lines.
- The [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) receives data from applications and routes it by type.
- [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) parses and enriches logs and traces and writes them to OpenSearch indexes.
- [Prometheus](https://prometheus.io/) stores metrics. OpenSearch queries Prometheus through a [Prometheus data source]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/), so the Prometheus server must be reachable from the OpenSearch nodes.

## Ingestion paths

The following table lists the typical paths that observability data takes to OpenSearch or Prometheus. Find the type of data that you want to ingest and then follow the setup instructions for its path.

| Data | Path | Setup |
|:---|:---|:---|
| Logs | Log collector or OpenTelemetry Collector → Data Prepper → OpenSearch index <br><br> OR <br><br> Log collector → OpenSearch index | [Getting started with log analytics]({{site.url}}{{site.baseurl}}/observing-your-data/log-ingestion/) (Fluent Bit tutorial) <br> [Ingesting log data into OpenSearch]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/ingesting-log-data/) <br> [Log analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/log-analytics/) <br> [OTel logs source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-logs-source/) <br> [Fluent Bit OpenSearch output](https://docs.fluentbit.io/manual/pipeline/outputs/opensearch) <br> [Logstash]({{site.url}}{{site.baseurl}}/tools/logstash/index/) |
| Traces | Instrumented application → OpenTelemetry Collector → Data Prepper → OpenSearch span and service map indexes | [Getting started with trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/getting-started/) (Jaeger HotROD tutorial) <br> [Trace analytics with Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/) <br> [OTel trace source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-trace-source/) |
| Metrics | Instrumented application → OpenTelemetry Collector → Prometheus <br><br> OR <br><br> Instrumented application → OpenTelemetry Collector → Data Prepper → OpenSearch index | [Connecting Prometheus to OpenSearch]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/) <br> [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/) <br> [OTel metrics source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-metrics-source/) |
| Logs, traces, and metrics for APM | Instrumented application → OpenTelemetry Collector → Data Prepper → OpenSearch indexes (logs and traces) and Prometheus (metrics) | [Configuring telemetry ingestion]({{site.url}}{{site.baseurl}}/observing-your-data/apm/configuring-telemetry-ingestion/) |
| Agent traces | Application instrumented using the OpenSearch generative AI observability SDK → OpenTelemetry Collector → Data Prepper → OpenSearch index | [Instrumenting your application]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/instrument/) |

Trace analytics and APM require the data that their Data Prepper pipelines create, so follow the setup instructions for the app that you plan to use.

## Related documentation

- To install preconfigured dashboards and visualizations for common data sources, see [Integrations]({{site.url}}{{site.baseurl}}/dashboards/integrations/index/).
- For the index naming conventions and field mappings that some classic observability apps require, see [Simple Schema for Observability]({{site.url}}{{site.baseurl}}/observing-your-data/ss4o/).
