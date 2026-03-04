---
layout: default
title: Write resources
parent: Data source APIs
nav_order: 30
grand_parent: SQL and PPL API
---

# Write Resources API

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Creates or modifies resources in an external data source. Currently supports creating alert silences in Prometheus Alertmanager.

Before using this API, you must configure a data source. For information about configuring data sources, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/).
{: .note}

## Endpoint

```http
POST /_plugins/_directquery/_resources/{dataSource}/alertmanager/api/v2/{resourceType}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`dataSource` | String | The name of the configured data source. Required.
`resourceType` | String | The type of resource to create. Currently, only `silences` is supported. Required.

## Alertmanager silence request body fields

The request body is passed to the external data source API. The following fields apply when creating an Alertmanager silence.

Field | Data type | Description
:--- | :--- | :---
`matchers` | Array | An array of label matchers that determine the alerts to which the silence applies. Required.
`matchers[].name` | String | The label name to match. Required.
`matchers[].value` | String | The label value to match. Required.
`matchers[].isRegex` | Boolean | Whether the value is a regular expression. Default is `false`. Optional.
`matchers[].isEqual` | Boolean | Whether to match equal (`true`) or not equal (`false`). Default is `true`. Optional.
`startsAt` | String | The start time for the silence, in ISO 8601 format. Required.
`endsAt` | String | The end time for the silence, in ISO 8601 format. Required.
`createdBy` | String | The author of the silence. Required.
`comment` | String | A comment describing the reason for the silence. Required.

## Example request: Create an alert silence

```json
POST /_plugins/_directquery/_resources/my_prometheus/alertmanager/api/v2/silences
{
  "matchers": [
    {
      "name": "alertname",
      "value": "HighMemoryUsage",
      "isRegex": false,
      "isEqual": true
    },
    {
      "name": "instance",
      "value": "server1:9100",
      "isRegex": false,
      "isEqual": true
    }
  ],
  "startsAt": "2024-01-01T12:00:00.000Z",
  "endsAt": "2024-01-01T14:00:00.000Z",
  "createdBy": "admin",
  "comment": "Scheduled maintenance window"
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "silenceID": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`silenceID` | String | The unique identifier of the created silence.
