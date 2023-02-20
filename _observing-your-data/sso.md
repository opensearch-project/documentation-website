---
layout: default
title: Simple Schema for Observability
nav_order: 120
---

# Simple Schema for Observability
Introduced 2.6
{: .label .label-purple }

Starting with OpenSearch 2.6, a standardization for conforming to a common and unified observability schema has been introduced: Simple Schema for Observability (SSO). [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/index/) allows a user to understand and check on systems without needing to know their inner workings. Observability also gives users the ability to troubleshoot various issues.

With SSO in place, observability tools can ingest and automatically extract and aggregate data and create custom common dashboards making it easier to understand the system at a higher level.

SSO is compatible with the [OpenTelemetry](https://opentelemetry.io/docs/) (OTEL) schema including traces, logs, and metrics. Alerts are also supported. SSO also accepts Elastic Common Schema (ECS) logs when structured logs such as these are present.

### Use cases

Use cases for SSO include:

- Ingest observability data from different data types:

    ![Rollover]({{site.url}}{{site.baseurl}}/images/sso.png)

- Move from proprietary configurations that are non-transferable to a consolidated sharable Observability solution that allows users to ingest any type of telemetry data from any type of provider and have the capability of displaying an analysis of this data.
- Move away from a dependence on the Data Prepper plugin.

## Data Prepper

SSO allows for independent Observability ingestion that has been handled by the [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/index/) plugin up until now by configuring an [OTel trace source](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/otel-trace-source).

## Traces and Metrics

Schema definitions for traces and metrics are defined and supported by Observability plugin.

This includes:

- Index structure (mapping).
- Index naming conventions.
- JSON schema for enforcement and validation of the structure.
 