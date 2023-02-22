---
layout: default
title: Simple Schema for Observability
nav_order: 120
---

# Simple Schema for Observability
Introduced 2.6
{: .label .label-purple }

OpenSearch 2.6 introduced a standardization for conforming to a common and unified observability schema: Simple Schema for Observability (SSO). [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/index/) is a collection of plugins and applications that let you visualize data-driven events by using Piped Processing Language (PPL) to explore and query data stored in OpenSearch.

With the schema in place, observability tools can ingest, automatically extract, and aggregate data and create custom dashboards, making it easier to understand the system at a higher level.

SSO is inspired by both [OpenTelemetry](https://opentelemetry.io/docs/) and the Elastic Common Schema (ECS) and uses a variety of events that ECS has to offer for logs with the OpenTelemetry metadata.

Alerts will be supported in a future release.
{: .note }

## Use cases

Use cases for SSO include:

* Ingesting observability data from different data types.
* Moving from proprietary configurations that are non-transferable to a consolidated, sharable observability solution that allows users to ingest and display an analysis of any type of telemetry data from any type of provider.
Data Prepper conforms to the SSO schema for metrics and will gradually support traces and logs.

[Data Prepper's]({{site.url}}{{site.baseurl}}/data-prepper/index/) existing trace mapping has enriched data in the form of serviceMap, which differs from SSO traces. This will consolidate with Observability by using the SSO traces schema and introduce serviceMap as an enriched, calculated field.
{: .note }

## Traces and metrics

Schema definitions for traces and metrics are defined and supported by the Observability plugin.

These schema definitions include:

- Index structure (mapping).
- [Index naming conventions](https://github.com/opensearch-project/observability/issues/1405).
- JSON schema for enforcement and validation of the structure.
- [Integration](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/3412) feature for adding pre-canned dashboards and assets.
