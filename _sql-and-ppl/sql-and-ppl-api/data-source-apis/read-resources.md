---
layout: default
title: Read resources
parent: Data source APIs
nav_order: 20
grand_parent: SQL and PPL API
---

# Read Resources API

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Fetches metadata and resources from an external data source. This API provides access to labels, series, alerts, and other metadata from Prometheus and Alertmanager.

Before using this API, you must configure a data source. For information about configuring data sources, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/).
{: .note}

## Endpoints

The Read Resources API supports several endpoints for different resource types:

```json
GET /_plugins/_directquery/_resources/{dataSource}/api/v1/{resourceType}
GET /_plugins/_directquery/_resources/{dataSource}/api/v1/{resourceType}/{resourceName}/values
GET /_plugins/_directquery/_resources/{dataSource}/alertmanager/api/v2/{resourceType}
GET /_plugins/_directquery/_resources/{dataSource}/alertmanager/api/v2/alerts/groups
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`dataSource` | String | The name of the configured data source. Required.
`resourceType` | String | The type of resource to fetch. See [Supported resource types](#supported-resource-types). Required.
`resourceName` | String | The name of a specific resource (for example, a label name when fetching label values). Required for the label values endpoint.

## Supported resource types

The following resource types are supported for Prometheus data sources.

Resource Type | Endpoint | Description
:--- | :--- | :---
`labels` | `/api/v1/labels` | Fetches all label names.
`label` | `/api/v1/label/{labelName}/values` | Fetches values for a specific label.
`metadata` | `/api/v1/metadata` | Fetches metric metadata.
`series` | `/api/v1/series` | Fetches time series matching a selector.
`alerts` | `/alertmanager/api/v2/alerts` | Fetches active alerts from Alertmanager.
`silences` | `/alertmanager/api/v2/silences` | Fetches alert silences from Alertmanager.
`receivers` | `/alertmanager/api/v2/receivers` | Fetches Alertmanager receivers.

## Prometheus query parameters

The following query parameters are specific to Prometheus and Alertmanager data sources. These parameters are passed to the underlying data source API.

Parameter   | Data type | Description
:---|:---|:---
`start`     | String    | The start timestamp for filtering results, in ISO 8601 format. Optional.
`end`       | String    | The end timestamp for filtering results, in ISO 8601 format. Optional.
`match[]`   | String    | A time series selector used to filter results (series endpoint only). Optional.
`active`    | Boolean   | Filters alerts by active status (Alertmanager only). Optional.
`silenced`  | Boolean   | Filters alerts by silenced status (Alertmanager only). Optional.
`filter`    | String    | A filter expression used to match silences (Alertmanager only). Optional.

## Example request: Get all labels

```http
GET /_plugins/_directquery/_resources/my_prometheus/api/v1/labels
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "success",
  "data": [
    "__name__",
    "instance",
    "job",
    "mode",
    "cpu"
  ]
}
```

## Example request: Get values for a specific label

```http
GET /_plugins/_directquery/_resources/my_prometheus/api/v1/label/job/values
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "success",
  "data": [
    "prometheus",
    "node_exporter",
    "alertmanager"
  ]
}
```

## Example request: Get active alerts

```http
GET /_plugins/_directquery/_resources/my_prometheus/alertmanager/api/v2/alerts?active=true&silenced=false
```
{% include copy-curl.html %}

## Example response

```json
[
  {
    "labels": {
      "alertname": "HighMemoryUsage",
      "instance": "server1:9100",
      "severity": "warning"
    },
    "annotations": {
      "summary": "High memory usage detected"
    },
    "startsAt": "2024-01-01T10:00:00.000Z",
    "status": {
      "state": "active"
    }
  }
]
```

## Example request: Get alert silences

```http
GET /_plugins/_directquery/_resources/my_prometheus/alertmanager/api/v2/silences
```
{% include copy-curl.html %}
