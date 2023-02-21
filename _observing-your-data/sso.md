---
layout: default
title: Simple Schema for Observability
nav_order: 120
---

# Simple Schema for Observability
Introduced 2.6
{: .label .label-purple }

Starting with OpenSearch 2.6, a standardization for conforming to a common and unified observability schema has been introduced: Simple Schema for Observability (SSO). [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/index/) is collection of plugins and applications that let you visualize data-driven events by using Piped Processing Language to explore, discover, and query data stored in OpenSearch.

With the schema in place, observability tools can ingest and automatically extract and aggregate data and create custom common dashboards making it easier to understand the system at a higher level.

The SSO schema is inspired by both [OTEL](https://opentelemetry.io/docs/) and Elastic Common Schema (ECS) and uses the large variety that ECS has to offer for logs with the OTEL metadata.

Alerts will be supported in a future release.
{: .note }

### Use cases

Use cases for SSO include:

- Ingest observability data from different data types.
- Move from proprietary configurations that are non-transferable to a consolidated sharable Observability solution that allows users to ingest any type of telemetry data from any type of provider and have the capability of displaying an analysis of this data.
- Data Prepper conforms to the SSO schema for metrics and will gradually support traces and logs.

[Data Prepper's]({{site.url}}{{site.baseurl}}/data-prepper/index/) existing traces mapping has enriched data in the form of serviceMap which differs from SSO traces. In the future this will consolidate with Observability by using the SSO traces schema and introduce serviceMap as an enriched calculated field.
{: .note }

## Traces and Metrics

Schema definitions for traces and metrics are defined and supported by Observability plugin.

This includes:

- Index structure (mapping).
- [Index naming conventions](https://github.com/opensearch-project/observability/issues/1405).
- JSON schema for enforcement and validation of the structure.
- [Integration](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/3412) feature for adding pre-canned dashboards and assets.
