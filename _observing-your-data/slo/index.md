---
layout: default
title: SLOs
nav_order: 125
has_children: false
redirect_from:
  - /observing-your-data/slo/
---

# SLOs

This feature is experimental and should not be used in production. The interface, APIs, and behavior may change in future releases.
{: .warning}

OpenSearch Dashboards provides an experimental service level objective (SLO) and service level indicator (SLI) surface in the `dashboards-observability` plugin. It lets you define availability and latency targets for your services, deploy the supporting recording and alerting rules to a Prometheus-compatible ruler, and track health, error budgets, and burn rates from a dedicated view in the Application Monitoring nav.

## Overview

SLOs are workspace-scoped saved objects. Creating an SLO does the following:

- Validates the SLI definition (availability, latency threshold, or custom PromQL) and the configured objectives.
- Generates a group of Prometheus recording rules covering a fixed set of error-ratio windows (`5m`, `30m`, `1h`, `2h`, `6h`, `1d`, `3d`).
- Generates multiwindow, multi-burn-rate (MWMBR) alerting rules using the Google SRE Workbook tier defaults.
- Deploys both rule groups to a Prometheus-compatible ruler (Cortex or Mimir) through the OpenSearch SQL plugin's DirectQuery resource proxy.
- Tracks live health, attainment, and remaining error budget per objective by querying the same backend at read time.

The view is shown in OpenSearch Dashboards with a **Beta** badge while the SLO/SLI app is mounted.

## Key terms

The following table defines the SLO and SLI terms used in the plugin.

| Term | Definition |
| :--- | :--- |
| Service level indicator (SLI) | The measurement that defines what "good" service looks like. The plugin supports `availability`, `latency_threshold`, and `custom` SLIs against a Prometheus-compatible backend. SLIs can be calculated from event counts, time slices (`periods`), or pre-aggregated ratios (`ratio_periods`). |
| Service level objective (SLO) | A target attainment level for one or more SLIs, evaluated over a time window. Each SLO carries one or more objectives and a single window. |
| Objective | A single target on the SLI, expressed as a decimal between `0.5` and `0.99999` (for example, `0.999`). Each objective generates its own set of recording and alerting rules. |
| Time window | The period the SLO is evaluated over. The plugin supports rolling windows (for example, `7d`, `28d`, `30d`); the `calendar` window shape is reserved for a future release. |
| Error budget | The fraction of failed events allowed in the window before the objective is breached. Tracked as `errorBudgetRemaining` in the live status response and can go negative once the budget is exhausted. |
| Burn rate | The ratio at which the error budget is being consumed. The plugin uses MWMBR alerting with default tiers (`PageQuick`, `PageSlow`, `TicketQuick`, `TicketSlow`) per the Google SRE Workbook. |
| SLO mode | `active` deploys recording and alerting rules and computes status. `shadow` deploys recording rules only — useful for validating an SLO before turning on alerts. |
| Datasource | A registered DirectQuery Prometheus connection. The SLO is bound to a single datasource and all generated rules are written against it. |
| Workspace | The OpenSearch Dashboards workspace the SLO belongs to. Workspace identity partitions SLO saved objects, the ruler namespace (`slo-generated-<workspace>`), and the recording-rule fingerprint registry. |

## Requirements

To use the SLO/SLI surface, your environment must meet the following requirements.

### Versions

- OpenSearch 3.7 or later.
- OpenSearch Dashboards 3.7 or later.

### OpenSearch Dashboards plugins

- `dashboards-observability` 3.7 or later, with both the SLO feature flag and the APM setting enabled. See [Enabling the feature](#enabling-the-feature).

### OpenSearch plugins

The following OpenSearch plugin must be installed on the cluster:

- [SQL plugin](https://github.com/opensearch-project/sql) (`opensearch-sql`) — provides the DirectQuery resource proxy used by the plugin to read from and write to the Prometheus ruler.

### Prometheus-compatible ruler

SLOs in the current release deploy rules to a Prometheus-compatible ruler reached through the SQL plugin's DirectQuery resource proxy. The ruler must implement the Cortex/Mimir ruler API:

- `POST /api/v1/rules/{namespace}` — upsert a rule group (Content-Type `application/yaml`).
- `DELETE /api/v1/rules/{namespace}/{groupName}` — delete a rule group.

Rule groups for a workspace are written to the namespace `slo-generated-<workspace-id>`. Tenant identity (for example, `X-Scope-OrgID`) is configured in the SQL plugin's Prometheus connector — the SLO plugin does not inject per-request tenant headers.

### Datasource

Each SLO is bound to a single datasource, which must be a registered DirectQuery Prometheus connection. The SLO API rejects creates and updates whose `spec.datasourceId` does not resolve to a datasource with a `directQueryName` field.

### Permissions

Users need the OpenSearch Dashboards `observability` capability to access the plugin. SLOs and their rule references are persisted as the saved-object types `slo-definition` and `slo-rule-ref`; standard saved-object permissions apply.

### Data prerequisites

The SLI definition determines what data the ruler must be able to reach:

- **Availability and latency-threshold SLIs** require the named Prometheus counter or histogram metric to be present in the configured backend. APM service templates assume span-derived RED metrics produced by [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/); OpenTelemetry semantic-convention templates assume the corresponding HTTP, RPC, database client, messaging, or generative AI metrics.
- **Custom SLIs** require the user-supplied PromQL to evaluate against the backend.

## Enabling the feature

The SLO/SLI surface ships disabled by default. To turn it on, add the following lines to `opensearch_dashboards.yml` and restart OpenSearch Dashboards:

```yaml
observability.slo.enabled: true
```
{% include copy.html %}

The plugin also requires the APM advanced setting to be on, because the SLO app is registered under the **Application Monitoring** category alongside Services and the Topology Map. In **Stack Management** > **Advanced settings**, set `observability:apmEnabled` to `true`.

The following optional settings tune SLO behavior:

| Setting | Default | Description |
| :--- | :--- | :--- |
| `observability.slo.enabled` | `false` | Top-level feature gate. Toggling this value requires an OpenSearch Dashboards restart. |
| `observability.slo.ruleDedup.enabled` | `true` | When enabled, recording rules are shared across SLOs with equivalent SLI shapes through a workspace-scoped fingerprint registry. Reduces evaluation cost on the ruler when many SLOs share the same backend query. Exposed as the **SLO recording-rule dedup** advanced setting. |
| `observability.slo.reconciler.enabled` | `true` | Enables the background sweep that garbage-collects shared recording rules whose aggregate reference count has been zero past the grace window. |
| `observability.slo.reconciler.intervalMs` | `300000` | Reconciler sweep cadence, in milliseconds. |
| `observability.slo.reconciler.graceMs` | `86400000` | Grace window, in milliseconds, between a shared rule's refcount dropping to zero and the reconciler deleting it from the ruler. Defaults to 24 hours. |

## Accessing the SLO view

After the feature flag is enabled and OpenSearch Dashboards is restarted, an **SLOs** application appears under **Application Monitoring** in the OpenSearch Dashboards main menu. The application is mounted on the hash route `/slos` and uses the following internal routes:

| Route | Page |
| :--- | :--- |
| `/slos` | SLO listing with filters and an overview panel. |
| `/slos/create` | Template selector. Picking a template opens the wizard prefilled with that template's SLI shape. |
| `/slos/create/:templateId` | Wizard prefilled from the named template. |
| `/slos/:id` | SLO detail page. |

While the application is open, OpenSearch Dashboards displays a **Beta** badge in the chrome.

## Creating an SLO

From the listing page, choose **Create SLO** to open the template selector. The available templates are grouped by category:

- **APM service SLOs (span-derived).** SLIs built from the RED metrics that [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) emits for every traced service. Templates: APM service availability, APM service latency, APM dependency availability, APM dependency latency.
- **OpenTelemetry semantic-convention metrics.** SLIs built from OTel semantic-convention metrics emitted by instrumented services. Templates: HTTP availability, HTTP latency, RPC availability, RPC latency, database client latency, messaging latency, generative AI availability.
- **Custom.** Starts from blank PromQL.

Picking a template opens the wizard with the SLI definition prefilled. The wizard is divided into the following sections:

- **Name and ownership.** A workspace-unique name (1–128 characters), service name, and owner team. The first team in the list is the primary owner.
- **Datasource.** A registered DirectQuery Prometheus connection. The wizard help text reads "The registered Prometheus / AMP DirectQuery connection."
- **SLI definition.** The SLI type (`availability`, `latency_threshold`, or `custom`), the calculation method (`events`, `periods`, or `ratio_periods`), the metric, and an optional good-events filter (a PromQL label matcher, for example `status_code!~"5.."`). For `latency_threshold` SLIs, the threshold unit (`seconds` or `milliseconds`) is also configurable. For custom SLIs, you supply either separate `goodQuery` and `totalQuery` PromQL expressions (`mode: events`) or a single `errorRatioQuery` (`mode: raw`).
- **Probe SLI.** A wizard-side dry run that issues the proposed PromQL against the selected backend over a `1h`, `24h`, or `7d` lookback so you can confirm the queries match series before you create the SLO.
- **Objectives.** One or more objectives. Each objective sets a target between `0.5` and `0.99999` (the wizard accepts the value as a percentage and stores the ratio). For latency-threshold SLIs, each objective also sets a latency bound. For period-based calculation methods, each objective sets a time-slice target.
- **Time window.** A rolling window expressed as a Prometheus duration (for example, `7d`, `28d`, `30d`).
- **Alerting strategy.** Multiwindow, multi-burn-rate (MWMBR) alerting. Defaults follow the Google SRE Workbook tiers: `5m`/`1h` × 14.4 (`PageQuick`), `30m`/`6h` × 6 (`PageSlow`), `2h`/`1d` × 3 (`TicketQuick`), and `6h`/`3d` × 1 (`TicketSlow`).
- **Supplemental alarms.** Optional toggles for SLI health, attainment-breach, budget-warning, no-data, and resolved alerts. Budget-warning is on by default; the others are off.
- **Budget warning thresholds.** Fractions of the remaining budget that fire warning alerts. Defaults to one threshold at `0.5` with severity `warning`.
- **Exclusion windows.** Cron- or one-off windows during which the SLO ignores measurements. Currently accepted by the API but not evaluated.
- **Generated rules preview.** A read-only preview of the recording and alerting rules that will be deployed. The same generator runs server-side at deploy time, so what you see is what is written to the ruler.

After you submit the wizard, the plugin validates the spec, generates rules, and writes them to the ruler synchronously. If the ruler rejects the group, the wizard surfaces the upstream error code and message and no SLO record is persisted.

## Viewing SLO health and error budgets

The **SLOs** listing shows one row per SLO with current state, attainment, remaining error budget, and a sparkline. SLO state is the worst per-objective state, with `disabled` and `stale` taking precedence:

| State | Meaning |
| :--- | :--- |
| `ok` | All objectives are above target. |
| `warning` | At least one objective is consuming budget faster than expected (a warning-tier burn-rate alert is firing). |
| `breached` | At least one objective has exhausted its error budget. |
| `no_data` | The SLI query returned no series in the evaluation window. |
| `stale` | The latest sample is older than the freshness threshold. |
| `disabled` | The SLO has been disabled (rules are torn down). |
| `rules_missing` | The recording rules expected by the aggregator are not present on the ruler. |

The detail page (`/slos/:id`) shows per-objective attainment, remaining error budget, the active burn-rate panel, the budget-remaining chart, the budget panel, and the metadata panel. The **Generated rules preview** shows the recording and alerting rules currently deployed for the SLO. The **Probe SLI** panel re-runs the dry-run query against the backend.

The aggregator caches ruler responses for the rule evaluation interval (60 seconds by default), so the freshest sample available to the listing is at most about a minute old.

## Editing an SLO

To update an SLO, open the detail page and choose **Edit**. The wizard accepts a partial update — only the fields you change are sent. The update API uses optimistic concurrency: the request must include the current `status.version`, and the server returns `409 Conflict` if the SLO has changed since you loaded it. After a successful update, the plugin regenerates the rule group and re-deploys it to the ruler.

You can also temporarily pause an SLO without deleting it:

- **Disable.** Tears down the rule group on the ruler and marks the SLO as `disabled` in the listing. No alerts fire while disabled.
- **Enable.** Redeploys the rule group and resumes status computation.
- **Mode.** Switching from `active` to `shadow` keeps the recording rules in place but stops generating alerts — useful for validating a freshly authored SLO.

## Deleting an SLO

To delete an SLO, choose **Delete** on the detail page or in the row actions on the listing. The plugin tears down the rule group on the ruler and removes the saved object. If the underlying datasource has been removed out-of-band, the API logs a warning and proceeds to delete the saved object; the reconciler sweep eventually cleans up any orphan rule groups left on the ruler.

If a delete fails because the rule group is shared with other SLOs (recording-rule deduplication is on), the plugin only releases this SLO's reference. The shared rule group is removed by the reconciler after its aggregate reference count has been zero past the grace window (24 hours by default).

## Limitations

The SLO/SLI surface has the following limitations:

- The feature is experimental, ships disabled by default, and is shown in OpenSearch Dashboards with a **Beta** badge. The interface, APIs, and behavior may change in future releases.
- Toggling `observability.slo.enabled` requires an OpenSearch Dashboards restart to take effect.
- Only the Prometheus SLI backend is wired up. The OpenSearch SLI backend is reserved in the schema but not yet implemented.
- Only single-leaf SLIs are supported. Composite SLOs (rolling up multiple SLOs by `all` or `any`) are reserved in the schema but not yet implemented.
- Only rolling windows are supported. Calendar windows (`week`, `month`, `quarter`) are reserved in the schema but not evaluated.
- Only the multiwindow, multi-burn-rate (`mwmbr`) alerting strategy is supported.
- Exclusion windows are accepted by the API but their evaluation is deferred to a later release.
- Workspace resolution for the ruler write path is hardcoded to `default` in the current release. The plugin still partitions saved objects per workspace, but rules generated by every workspace currently land in the `slo-generated-default` namespace until workspace-scope plumbing lands.
- Acting-user attribution stamps a placeholder identity (`osd-user`) on `createdBy` and `updatedBy` until the security-plugin user resolver lands.
- The ruler write is synchronous and fail-loud. If the ruler rejects a rule group, the create or update returns an error and no SLO record is persisted.

## Troubleshooting

- **The SLOs application is not visible in the menu.** Confirm that `observability.slo.enabled` is set to `true` in `opensearch_dashboards.yml`, that OpenSearch Dashboards has been restarted, and that the `observability:apmEnabled` advanced setting is `true`.
- **Create or update fails with "Datasource ... is not registered" or "is not a DirectQuery Prometheus connection."** The SLO API only writes rules to DirectQuery Prometheus datasources. Check that the datasource you are targeting is registered with a `directQueryName` field.
- **The ruler returns a non-2xx response.** The wizard surfaces the upstream HTTP status and body. The plugin does not retry; correct the underlying issue (for example, an authentication failure or a malformed PromQL expression) and resubmit.
- **An SLO shows `rules_missing` or `no_data`.** Use the **Rule health** action on the detail page (introduced by [dashboards-observability#2689](https://github.com/opensearch-project/dashboards-observability/pull/2689)) to probe the ruler and the underlying SLI query. The **Repair** action redeploys missing rule groups.

## Related documentation

- [Application Performance Monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/apm/)
- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/)
