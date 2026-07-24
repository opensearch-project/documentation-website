---
layout: default
title: SLOs
nav_order: 125
has_children: false
redirect_from:
  - /observing-your-data/slo/
---

# Service-level objectives
**Introduced 3.7**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Service-level objectives (SLOs) let you define availability and latency targets for your services, deploy supporting recording and alerting rules to a Prometheus-compatible ruler, and track application health, error budgets, and budget consumption rates (burn rates) from a dedicated view in OpenSearch Dashboards.

SLOs consolidate alerts from OpenSearch monitors and Prometheus alerting rules, so you can monitor service health across data sources without switching between tools.

When you create an SLO, OpenSearch Dashboards generates Prometheus recording and alerting rules based on your configuration and deploys them to your Prometheus-compatible ruler. The rules track health, attainment, and remaining error budget for each objective.

The following table defines the SLO and SLI terms.

| Term | Definition |
| :--- | :--- |
| Service-level indicator (SLI) | A quantitative measurement of service performance, such as availability or latency. Supported SLI types are `availability`, `latency_threshold`, and `custom`. |
| Service-level objective (SLO) | A target attainment level for one or more SLIs, evaluated over a single time window. Each SLO contains one or more objectives. |
| Objective | A target value for an SLI, expressed as a decimal between `0.5` and `0.99999` (for example, `0.999`). Each objective generates its own set of recording and alerting rules. |
| Time window | The rolling period over which the SLO is evaluated (for example, `7d`, `28d`, `30d`). Calendar windows are not yet supported. |
| Error budget | The allowable fraction of failed events within the time window. When the error budget drops below zero, the objective is breached. |
| Burn rate | The rate at which the error budget is being consumed relative to the time window. Used to trigger alerts at different severity tiers. |
| SLO mode | Controls whether alerting is active. In `active` mode, both recording and alerting rules are deployed. In `shadow` mode, only recording rules are deployed, which is useful for validating an SLO before enabling alerts. |
| Data source | The `DirectQuery` Prometheus connection that the SLO uses. Each SLO is bound to a single data source. |
| Workspace | The OpenSearch Dashboards workspace that the SLO belongs to. Each workspace has its own set of SLOs and ruler namespace. |

## Prerequisites

Before using SLOs, complete the following setup steps.

### Enabling the feature

SLOs are disabled by default. To enable them, add the following settings to `opensearch_dashboards.yml`:

```yaml
workspace.enabled: true
explore.enabled: true
explore.discoverTraces.enabled: true
observability.slo.enabled: true
```
{% include copy.html %}

Then restart OpenSearch Dashboards. 

### Observability workspace

The SLO feature is available within an Observability [workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/). To create a workspace, follow these steps:

1. Navigate to the OpenSearch Dashboards home page.
2. Select **Create workspace**.
3. Enter a workspace name.
4. Select the **Observability** use case.
5. Select **Create workspace**.

### Prometheus-compatible ruler

SLOs deploy recording and alerting rules to a Prometheus-compatible ruler (Cortex or Grafana Mimir) through the `DirectQuery` resource proxy. The ruler must support the following API endpoints:

- `POST /api/v1/rules/{namespace}` -- Creates or updates a rule group.
- `DELETE /api/v1/rules/{namespace}/{groupName}` -- Deletes a rule group.

Rule groups for a given workspace are written to the namespace `slo-generated-<workspace-id>`. Tenant identity (for example, `X-Scope-OrgID`) is configured in the [Prometheus connector]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/) settings.

### Data source

Each SLO is bound to a single data source, which must be a registered `DirectQuery` Prometheus connection. For information about configuring a Prometheus data source, see [Connecting Prometheus to OpenSearch]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/).

### Data prerequisites

The SLI definition determines what data the ruler must be able to query:

- **Availability and latency-threshold SLIs** require the named Prometheus counter or histogram metric to be present in the configured backend. Application Performance Monitoring (APM) service templates expect span-derived Rate, Error, Duration (RED) metrics produced by [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/). OpenTelemetry (OTel) semantic convention templates expect the corresponding HTTP, RPC, database client, messaging, or generative AI metrics.
- **Custom SLIs** require your PromQL expression to evaluate successfully against the backend.

## Accessing SLOs

To access SLOs, select your Observability workspace from the home page, or create one if you don't have one (see [Observability workspace](#observability-workspace)). Then navigate to **Application Performance** > **SLOs**.


## Creating an SLO

To create an SLO, follow these steps:

1. In the **SLOs** view, choose **Create SLO**.
2. Select a template. Templates are grouped into the following categories:
   - **APM service SLOs**: SLIs based on RED metrics from [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/). Templates include **APM service availability**, **APM service latency**, **APM dependency availability**, and **APM dependency latency**.
   - **OTel semantic convention metrics**: SLIs based on standard OTel metrics. Templates include **HTTP availability**, **HTTP latency**, **RPC/gRPC availability**, **RPC/gRPC latency**, **Database client latency**, **Messaging processing latency**, and **GenAI invocation availability**.
   - **Custom**: A blank **Custom PromQL** template for custom PromQL expressions.
3. Configure the SLO in the wizard. The wizard contains the following sections:
   - **Identity**: A unique name, description, and data source (a registered DirectQuery Prometheus connection).
   - **Window & mode**: A rolling window (for example, `28d`) and an optional shadow mode that deploys recording rules without alerting.
   - **Service & owner**: The service name and owner team.
   - **SLI**: For prebuilt templates, the SLI type and metric are preconfigured. You can optionally add dimensions (label filters) to narrow the query. For the **Custom PromQL** template, you provide your own PromQL expressions---either separate good-events and total-events queries, or a single pre-computed error-ratio query.
   - **Probe SLI**: Tests the proposed query against the Prometheus backend over a configurable look-back period (`1h`, `24h`, or `7d`) so you can verify the query returns data before creating the SLO.
   - **Objectives**: One or more target values between `0.5` and `0.99999` (for example, `99.9%`). For latency SLIs, each objective also sets a latency bound.
   - **Advanced**: Burn rate alerting tiers, budget warnings, and supplemental alarms.
   - **Exclusion windows**: Time periods during which the SLO ignores measurements (for example, maintenance windows or deploy freezes).
   - **Labels & annotations**: Optional metadata that propagates to the generated rules.
   - **Rule preview**: A read-only preview of the recording and alerting rules that will be deployed to the ruler.
4. Choose **Create SLO**. The rules are validated and deployed to the ruler. If the ruler rejects the rules, the error is displayed and the SLO is not saved.

## Monitoring SLOs

The **SLOs** listing displays each SLO with its current state, attainment percentage, remaining error budget, and a sparkline. 


The following table describes the SLO states.

| State | Description |
| :--- | :--- |
| `ok` | All objectives are above target. |
| `warning` | At least one objective is consuming budget faster than expected. |
| `breached` | At least one objective has exhausted its error budget. |
| `no_data` | The SLI query returned no data in the evaluation window. |
| `stale` | The latest data sample is older than expected, which may indicate a problem with the data source connection. |
| `disabled` | The SLO has been disabled. |
| `rules_missing` | The expected recording rules are not present on the ruler. |

To view details for a specific SLO, select it in the listing. The detail page shows per-objective attainment, remaining error budget, budget consumption rate, and the deployed recording and alerting rules.

## Editing an SLO

To update an SLO, select the SLO in the list and choose **Edit**. Only the fields you change are updated. After a successful update, the rule group is regenerated and redeployed to the ruler.

You can also change the SLO mode without editing the full configuration:

- **Disable**: Removes the rule group from the ruler and stops alerting.
- **Enable**: Redeploys the rule group and resumes status computation.
- **Shadow mode**: Keeps recording rules in place but stops alerting. Use this to validate a new SLO before enabling alerts.

## Deleting an SLO

To delete an SLO, select it from the listing and choose **Delete** from the detail page or the row actions menu. The associated rule group is removed from the ruler and the SLO configuration is deleted.

If the SLO shares recording rules with other SLOs (when rule deduplication is enabled), only the reference is released. The shared rules are removed automatically after the grace window (24 hours by default).

## Configuration settings

The following table lists the SLO configuration settings.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `observability.slo.enabled` | `false` | Enables SLOs. Requires an OpenSearch Dashboards restart. |
| `observability.slo.ruleDedup.enabled` | `true` | Allows multiple SLOs that use the same query to share a single set of recording rules on the ruler, reducing duplicate evaluations. |
| `observability.slo.reconciler.enabled` | `true` | Enables automatic cleanup of shared recording rules that are no longer referenced by any SLO. |
| `observability.slo.reconciler.intervalMs` | `300000` (5 minutes) | How often the cleanup process runs, in milliseconds. |
| `observability.slo.reconciler.graceMs` | `86400000` (24 hours) | The amount of time to wait after all references to a shared rule are removed before deleting the rule from the ruler, in milliseconds. |

## Troubleshooting

The following table describes common issues and their solutions.

| Problem | Solution |
| :--- | :--- |
| The ruler returns an error when creating or updating an SLO. | The error details are displayed in the wizard. Correct the underlying issue (for example, an authentication failure or malformed PromQL) and resubmit. |
| An SLO shows `rules_missing` or `no_data`. | Use the **Rule health** action on the detail page to check the ruler and the SLI query. Use **Repair** to redeploy missing rule groups. |

## Limitations

SLOs have the following limitations:

- Only Prometheus data sources are supported for SLI evaluation.
- Only single SLIs are supported. Composite SLOs that combine multiple SLOs are not yet available.
- Only rolling time windows are supported. Calendar windows (`week`, `month`, `quarter`) are not yet available.
- Only the multi-window, multi-burn-rate (MWMBR) alerting strategy is supported.
- Exclusion windows can be configured but are not yet evaluated.

## Related documentation

- [Application Performance Monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/apm/)
- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/)
