---
layout: default
title: Simple Schema for Observability
nav_order: 120
---

# Simple Schema for Observability
Introduced 2.6
{: .label .label-purple }

OpenSearch 2.6 introduced a standardization for conforming to a common and unified observability schema: Simple Schema for Observability (SSFO). [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/index/) is a collection of plugins and applications that let you visualize data-driven events by using Piped Processing Language (PPL) to explore and query data stored in OpenSearch.

With the schema in place, Observability tools can ingest, automatically extract, and aggregate data and create custom dashboards, making it easier to understand the system at a higher level.

SSFO is inspired by both [OpenTelemetry](https://opentelemetry.io/docs/) and the Elastic Common Schema (ECS) and uses Amazon Elastic Container Service ([Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_cwe_events.html)) event logs and OpenTelemetry metadata.

Alerts will be supported in a future release.
{: .note }

## Use cases

Use cases for SSFO include:

* Ingesting observability data from different data types.
* Moving from proprietary configurations that are non-transferable to a consolidated, sharable observability solution that allows users to ingest and display an analysis of any type of telemetry data from any type of provider.

Data Prepper conforms to the SSFO schema for metrics and will gradually support traces and logs.

Data Prepper's [trace mapping]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/) currently provides `service-map` data in a different way than SSFO traces. To make the trace mapping compatible with Observability, it will be integrated with the SSFO traces schema and will introduce `service-map` as an enriched field.
{: .note }

## Traces and metrics

Schema definitions for traces and metrics are defined and supported by the Observability plugin.

These schema definitions include:

- The index structure (mapping).
- The [index naming conventions](https://github.com/opensearch-project/observability/issues/1405).
- A JSON schema for enforcement and validation of the structure.
- The [integration](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/3412) feature for adding preconfigured dashboards and assets.
