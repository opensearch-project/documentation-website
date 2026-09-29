---
layout: default
title: Execute direct query
parent: Data source APIs
nav_order: 10
grand_parent: SQL and PPL API
canonical_url: https://docs.opensearch.org/latest/sql-and-ppl/sql-and-ppl-api/data-source-apis/execute-direct-query/
---

# Execute Direct Query API

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Executes a query against an external data source using the data source's native query language.

Before using this API, you must configure a data source. For information about configuring data sources, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/).
{: .note}

## Endpoint

```json
POST /_plugins/_directquery/_query/{dataSource}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`dataSource` | String | The name of the configured data source to query. Required.

## Request body fields

The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`query` | String | The query to execute in the data source's native query language (for example, PromQL for Prometheus). Required.
`language` | String | The query language. For Prometheus data sources, use `PROMQL`. Required.
`options` | Object | Data-source-specific query options. See [Prometheus options](#prometheus-options). Optional.
`maxResults` | Integer | The maximum number of results to return. Only applies to Prometheus. Optional.
`timeout` | Integer | The query timeout in seconds. Only applies to Prometheus. Optional.
`sessionId` | String | A session identifier for tracking queries. If not provided, a UUID is automatically generated. Optional.

### Prometheus options

The following options are specific to Prometheus data sources and should be provided in the `options` object.

Field | Data type | Description
:--- | :--- | :---
`options.queryType` | String | The type of query. Valid values are `instant` or `range`. Default is `instant`. Optional.
`options.time` | String | The evaluation timestamp for instant queries, specified as a Unix timestamp. Required for instant queries.
`options.start` | String | The start timestamp for `range` queries, specified as a Unix timestamp. Required for `range` queries.
`options.end` | String | The end timestamp for `range` queries, specified as a Unix timestamp. Required for `range` queries.
`options.step` | String | The query resolution step width for `range` queries, in duration format (for example, `15s`, `1m`, `1h`). Required for `range` queries.

## Example request: Instant query

The following request executes an instant PromQL query against a Prometheus data source:

```json
POST /_plugins/_directquery/_query/my_prometheus
{
  "query": "up",
  "language": "PROMQL",
  "options": {
    "queryType": "instant"
  }
}
```
{% include copy-curl.html %}

## Example request: Range query

The following request executes a range query to retrieve CPU usage over time:

```json
POST /_plugins/_directquery/_query/my_prometheus
{
  "query": "rate(node_cpu_seconds_total{mode=\"user\"}[5m])",
  "language": "PROMQL",
  "options": {
    "queryType": "range",
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-01T01:00:00Z",
    "step": "60s"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "queryId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "sessionId": "session-uuid-here",
  "results": {
    "status": "success",
    "data": {
      "resultType": "vector",
      "result": [
        {
          "metric": {
            "__name__": "up",
            "instance": "localhost:9090",
            "job": "prometheus"
          },
          "value": [1704067200, "1"]
        }
      ]
    }
  }
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`queryId` | String | The unique identifier for the executed query.
`sessionId` | String | The session identifier for tracking related queries.
`results` | Object | The query results from the data source, returned in the data source's native response format.
