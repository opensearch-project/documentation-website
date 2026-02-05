---
layout: default
title: SQL and PPL API
nav_order: 1
redirect_from:
  - /search-plugins/sql/sql-ppl-api/
---

# SQL and PPL API

Use the SQL and PPL API to send queries to the SQL plugin. Use the `_sql` endpoint to send queries in SQL, and the `_ppl` endpoint to send queries in PPL. For both of these, you can also use the `_explain` endpoint to translate your query into [OpenSearch domain-specific language]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/) (DSL) or to troubleshoot errors.

## Query API

Sends an SQL/PPL query to the SQL plugin. You can pass the format for the response as a query parameter.

### Query parameters

Parameter | Data type | Description
:--- | :--- | :---
[format]({{site.url}}{{site.baseurl}}/search-plugins/sql/response-formats/) | String | The format for the response. The `_sql` endpoint supports `jdbc`, `csv`, `raw`, and `json` formats. The `_ppl` endpoint supports `jdbc`, `csv`, and `raw` formats. Default is `jdbc`.
sanitize | Boolean | Specifies whether to escape special characters in the results. See [Response formats]({{site.url}}{{site.baseurl}}/search-plugins/sql/response-formats/) for more information. Default is `true`.

### Request body fields

Field | Data type | Description  
:--- | :--- | :---
query | String | The query to be executed. Required.
[filter](#filtering-results) | JSON object | The filter for the results. Optional.
[fetch_size](#paginating-results) | integer | The number of results to return in one response. Used for paginating results. Default is 1,000. Optional. `fetch_size` is supported for SQL and requires using the `jdbc` response format.

#### Example request

```json
POST /_plugins/_sql
{
  "query" : "SELECT * FROM accounts"
}
```
{% include copy-curl.html %}

#### Example response

The response contains the schema and the results:

```json
{
  "schema": [
    {
      "name": "account_number",
      "type": "long"
    },
    {
      "name": "firstname",
      "type": "text"
    },
    {
      "name": "address",
      "type": "text"
    },
    {
      "name": "balance",
      "type": "long"
    },
    {
      "name": "gender",
      "type": "text"
    },
    {
      "name": "city",
      "type": "text"
    },
    {
      "name": "employer",
      "type": "text"
    },
    {
      "name": "state",
      "type": "text"
    },
    {
      "name": "age",
      "type": "long"
    },
    {
      "name": "email",
      "type": "text"
    },
    {
      "name": "lastname",
      "type": "text"
    }
  ],
  "datarows": [
    [
      1,
      "Amber",
      "880 Holmes Lane",
      39225,
      "M",
      "Brogan",
      "Pyrami",
      "IL",
      32,
      "amberduke@pyrami.com",
      "Duke"
    ],
    [
      6,
      "Hattie",
      "671 Bristol Street",
      5686,
      "M",
      "Dante",
      "Netagy",
      "TN",
      36,
      "hattiebond@netagy.com",
      "Bond"
    ],
    [
      13,
      "Nanette",
      "789 Madison Street",
      32838,
      "F",
      "Nogal",
      "Quility",
      "VA",
      28,
      "nanettebates@quility.com",
      "Bates"
    ],
    [
      18,
      "Dale",
      "467 Hutchinson Court",
      4180,
      "M",
      "Orick",
      null,
      "MD",
      33,
      "daleadams@boink.com",
      "Adams"
    ]
  ],
  "total": 4,
  "size": 4,
  "status": 200
}
```

### Response body fields

Field | Data type | Description  
:--- | :--- | :---
schema | Array | Specifies the field names and types for all fields. 
data_rows | 2D array | An array of results. Each result represents one matching row (document).
total | Integer | The total number of rows (documents) in the index.
size | Integer | The number of results to return in one response.
status | String | The HTTP response status OpenSearch returns after running the query.

## Explain API

The SQL plugin's `explain` feature shows how a query is executed against OpenSearch, which is useful for debugging and development. A POST request to the `_plugins/_sql/_explain` or `_plugins/_ppl/_explain` endpoint returns [OpenSearch domain-specific language]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/) (DSL) in JSON format.

Starting with OpenSearch 3.0.0, when you set `plugins.calcite.enabled` to `true`, the `explain` response provides enhanced information about query execution plans. The API supports four output formats:

- `standard`: Displays logical and physical plans (default if not specified)
- `simple`: Displays logical plan without attributes
- `cost`: Displays logical and physical plans with their costs
- `extended`: Displays logical and physical plans with generated code

### Examples

#### Basic SQL query

The following request shows a basic SQL `explain` query:

```json
POST _plugins/_sql/_explain
{
  "query": "SELECT firstname, lastname FROM accounts WHERE age > 20"
}
```
{% include copy.html %}


The response shows the query execution plan:

```json
{
  "root": {
    "name": "ProjectOperator",
    "description": {
      "fields": "[firstname, lastname]"
    },
    "children": [
      {
        "name": "OpenSearchIndexScan",
        "description": {
          "request": """OpenSearchQueryRequest(indexName=accounts, sourceBuilder={"from":0,"size":200,"timeout":"1m","query":{"range":{"age":{"from":20,"to":null,"include_lower":false,"include_upper":true,"boost":1.0}}},"_source":{"includes":["firstname","lastname"],"excludes":[]},"sort":[{"_doc":{"order":"asc"}}]}, searchDone=false)"""
        },
        "children": []
      }
    ]
  }
}
```

#### Advanced query with the Calcite engine

The following request demonstrates a more complex query using the Calcite engine:

```json
POST _plugins/_ppl/_explain
{
  "query" : "source=state_country | where country = 'USA' OR country = 'England' | stats count() by country"
}
```
{% include copy.html %}


The response shows both logical and physical plans in the standard format:

```json
{
  "calcite": {
    "logical": """LogicalProject(count()=[$1], country=[$0])
  LogicalAggregate(group=[{1}], count()=[COUNT()])
    LogicalFilter(condition=[SEARCH($1, Sarg['England', 'USA':CHAR(7)]:CHAR(7))])
      CalciteLogicalIndexScan(table=[[OpenSearch, state_country]])
""",
    "physical": """EnumerableCalc(expr#0..1=[{inputs}], count()=[$t1], country=[$t0])
  CalciteEnumerableIndexScan(table=[[OpenSearch, state_country]], PushDownContext=[[FILTER->SEARCH($1, Sarg['England', 'USA':CHAR(7)]:CHAR(7)), AGGREGATION->rel#53:LogicalAggregate.NONE.[](input=RelSubset#43,group={1},count()=COUNT())], OpenSearchRequestBuilder(sourceBuilder={"from":0,"size":0,"timeout":"1m","query":{"terms":{"country":["England","USA"],"boost":1.0}},"sort":[{"_doc":{"order":"asc"}}],"aggregations":{"composite_buckets":{"composite":{"size":1000,"sources":[{"country":{"terms":{"field":"country","missing_bucket":true,"missing_order":"first","order":"asc"}}}]},"aggregations":{"count()":{"value_count":{"field":"_index"}}}}}}, requestedTotalSize=10000, pageSize=null, startFrom=0)])
"""
  }
}
```

For a simplified view of the query plan, you can use the `simple` format:

```json
POST _plugins/_ppl/_explain?format=simple
{
  "query" : "source=state_country | where country = 'USA' OR country = 'England' | stats count() by country"
}
```
{% include copy-curl.html %}

The response shows a condensed logical plan:

```json
{
  "calcite": {
    "logical": """LogicalProject
  LogicalAggregate
    LogicalFilter
      CalciteLogicalIndexScan
"""
  }
}
```

For queries that require post-processing, the `explain` response includes a query plan in addition to the OpenSearch DSL. For queries that don't require post-processing, you'll see only the complete DSL.

## Paginating results

To get back a paginated response, use the `fetch_size` parameter. The value of `fetch_size` should be greater than 0. The default value is 1,000. A value of 0 will fall back to a non-paginated response.

The `fetch_size` parameter is only supported for the `jdbc` response format.
{: .note }

### Example

The following request contains an SQL query and specifies to return five results at a time:

```json
POST _plugins/_sql/
{
  "fetch_size" : 5,
  "query" : "SELECT firstname, lastname FROM accounts WHERE age > 20 ORDER BY state ASC"
}
```
{% include copy-curl.html %}

The response contains all the fields that a query without `fetch_size` would contain, and a `cursor` field that is used to retrieve subsequent pages of results:

```json
{
  "schema": [
    {
      "name": "firstname",
      "type": "text"
    },
    {
      "name": "lastname",
      "type": "text"
    }
  ],
  "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFBQU1XZWpkdFRFRkZUMlpTZEZkeFdsWnJkRlZoYnpaeVVRPT0iLCJjIjpbeyJuYW1lIjoiZmlyc3RuYW1lIiwidHlwZSI6InRleHQifSx7Im5hbWUiOiJsYXN0bmFtZSIsInR5cGUiOiJ0ZXh0In1dLCJmIjo1LCJpIjoiYWNjb3VudHMiLCJsIjo5NTF9",
  "total": 956,
  "datarows": [
    [
      "Cherry",
      "Carey"
    ],
    [
      "Lindsey",
      "Hawkins"
    ],
    [
      "Sargent",
      "Powers"
    ],
    [
      "Campos",
      "Olsen"
    ],
    [
      "Savannah",
      "Kirby"
    ]
  ],
  "size": 5,
  "status": 200
}
```

To fetch subsequent pages, use the `cursor` from the previous response:

```json
POST /_plugins/_sql
{
   "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFBQU1XZWpkdFRFRkZUMlpTZEZkeFdsWnJkRlZoYnpaeVVRPT0iLCJjIjpbeyJuYW1lIjoiZmlyc3RuYW1lIiwidHlwZSI6InRleHQifSx7Im5hbWUiOiJsYXN0bmFtZSIsInR5cGUiOiJ0ZXh0In1dLCJmIjo1LCJpIjoiYWNjb3VudHMiLCJsIjo5NTF9"
}
```
{% include copy-curl.html %}

The next response contains only the `datarows` of the results and a new `cursor`.

```json
{
  "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFBQU1XZWpkdFRFRkZUMlpTZEZkeFdsWnJkRlZoYnpaeVVRPT0iLCJjIjpbeyJuYW1lIjoiZmlyc3RuYW1lIiwidHlwZSI6InRleHQifSx7Im5hbWUiOiJsYXN0bmFtZSIsInR5cGUiOiJ0ZXh0In1dLCJmIjo1LCJpIjoiYWNjb3VudHMabcde12345",
  "datarows": [
    [
      "Abbey",
      "Karen"
    ],
    [
      "Chen",
      "Ken"
    ],
    [
      "Ani",
      "Jade"
    ],
    [
      "Peng",
      "Hu"
    ],
    [
      "John",
      "Doe"
    ]
  ]
}
```

The `datarows` can have more than the `fetch_size` number of records in case nested fields are flattened. 
{: .note }

The last page of results has only `datarows` and no `cursor`. The `cursor` context is automatically cleared on the last page.

To explicitly clear the cursor context, use the `_plugins/_sql/close` endpoint operation:

```json
POST /_plugins/_sql/close
{
   "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFBQU1XZWpkdFRFRkZUMlpTZEZkeFdsWnJkRlZoYnpaeVVRPT0iLCJjIjpbeyJuYW1lIjoiZmlyc3RuYW1lIiwidHlwZSI6InRleHQifSx7Im5hbWUiOiJsYXN0bmFtZSIsInR5cGUiOiJ0ZXh0In1kLCJmIjo1LCJpIjoiYWNjb3VudHMiLCJsIjo5NTF9"
}
```
{% include copy-curl.html %}

The response is an acknowledgement from OpenSearch:

```json
{"succeeded":true}
```

## Filtering results

You can use the `filter` parameter to add more conditions to the OpenSearch DSL directly.

The following SQL query returns the names and account balances of all customers. The results are then filtered to contain only those customers with less than $10,000 balance. 

```json
POST /_plugins/_sql/
{
  "query" : "SELECT firstname, lastname, balance FROM accounts",
  "filter" : {
    "range" : {
      "balance" : {
        "lt" : 10000
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching results:

```json
{
  "schema": [
    {
      "name": "firstname",
      "type": "text"
    },
    {
      "name": "lastname",
      "type": "text"
    },
    {
      "name": "balance",
      "type": "long"
    }
  ],
  "total": 2,
  "datarows": [
    [
      "Hattie",
      "Bond",
      5686
    ],
    [
      "Dale",
      "Adams",
      4180
    ]
  ],
  "size": 2,
  "status": 200
}
```

You can use the Explain API to see how this query is executed against OpenSearch:

```json
POST /_plugins/_sql/_explain
{
  "query" : "SELECT firstname, lastname, balance FROM accounts",
  "filter" : {
    "range" : {
      "balance" : {
        "lt" : 10000
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the Boolean query in OpenSearch DSL that corresponds to the query above:

```json
{
  "from": 0,
  "size": 200,
  "query": {
    "bool": {
      "filter": [{
        "bool": {
          "filter": [{
            "range": {
              "balance": {
                "from": null,
                "to": 10000,
                "include_lower": true,
                "include_upper": false,
                "boost": 1.0
              }
            }
          }],
          "adjust_pure_negative": true,
          "boost": 1.0
        }
      }],
      "adjust_pure_negative": true,
      "boost": 1.0
    }
  },
  "_source": {
    "includes": [
      "firstname",
      "lastname",
      "balance"
    ],
    "excludes": []
  }
}
```

## Using parameters

You can use the `parameters` field to pass parameter values to a prepared SQL query.

The following explain operation uses an SQL query with an `age` parameter:

```json
POST /_plugins/_sql/_explain
{
  "query": "SELECT * FROM accounts WHERE age = ?",
  "parameters": [{
    "type": "integer",
    "value": 30
  }]
}
```
{% include copy-curl.html %}

The response contains the Boolean query in OpenSearch DSL that corresponds to the SQL query above:

```json
{
  "from": 0,
  "size": 200,
  "query": {
    "bool": {
      "filter": [{
        "bool": {
          "must": [{
            "term": {
              "age": {
                "value": 30,
                "boost": 1.0
              }
            }
          }],
          "adjust_pure_negative": true,
          "boost": 1.0
        }
      }],
      "adjust_pure_negative": true,
      "boost": 1.0
    }
  }
}

```

## Datasources

OpenSearch supports querying external non-OpenSearch data sources like Prometheus through the SQL plugin. The Direct Query API enables querying these data sources directly using their native query languages (for example, PromQL for Prometheus).

Before using these APIs, you must configure a data source. For information about configuring data sources, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/).
{: .note}

### Execute Direct Query API
Experimental
{: .label .label-yellow }

Executes a query against an external data source using the data source's native query language.

#### HTTP method and path

```
POST /_plugins/_directquery/_query/{dataSource}
```

#### Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`dataSource` | String | The name of the configured data source to query. Required.

#### Request body fields

Field | Data type | Description
:--- | :--- | :---
`query` | String | The query to execute in the data source's native query language (for example, PromQL for Prometheus). Required.
`language` | String | The query language. For Prometheus data sources, use `PROMQL`. Required.
`options` | Object | Data source-specific query options. Optional.
`options.queryType` | String | The type of query. For Prometheus, valid values are `instant` or `range`. Default is `instant`. Optional.
`options.time` | String | The evaluation timestamp for instant queries. ISO 8601 format or Unix timestamp. Optional.
`options.start` | String | The start timestamp for range queries. ISO 8601 format or Unix timestamp. Required for range queries.
`options.end` | String | The end timestamp for range queries. ISO 8601 format or Unix timestamp. Required for range queries.
`options.step` | String | The query resolution step width for range queries. Duration format (for example, `15s`, `1m`, `1h`). Required for range queries.
`maxResults` | Integer | The maximum number of results to return. Optional.
`timeout` | Integer | The query timeout in seconds. Optional.
`sessionId` | String | A session identifier for tracking queries. If not provided, a UUID is automatically generated. Optional.

#### Example request: Instant query

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

#### Example request: Range query

The following request executes a range query to get CPU usage over time:

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

#### Example response

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

#### Response body fields

Field | Data type | Description
:--- | :--- | :---
`queryId` | String | A unique identifier for the executed query.
`sessionId` | String | The session identifier for tracking related queries.
`results` | Object | The query results from the data source in its native response format.

### Read Resources API
Experimental
{: .label .label-yellow }

Fetches metadata and resources from an external data source. This API provides access to labels, series, alerts, and other metadata from Prometheus and Alertmanager.

#### HTTP method and path

The Read Resources API supports several endpoints for different resource types:

```
GET /_plugins/_directquery/_resources/{dataSource}/api/v1/{resourceType}
GET /_plugins/_directquery/_resources/{dataSource}/api/v1/{resourceType}/{resourceName}/values
GET /_plugins/_directquery/_resources/{dataSource}/alertmanager/api/v2/{resourceType}
GET /_plugins/_directquery/_resources/{dataSource}/alertmanager/api/v2/alerts/groups
```

#### Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`dataSource` | String | The name of the configured data source. Required.
`resourceType` | String | The type of resource to fetch. See [Supported resource types](#supported-resource-types). Required.
`resourceName` | String | The name of a specific resource (for example, a label name when fetching label values). Required for label values endpoint.

#### Supported resource types

The following resource types are supported for Prometheus data sources:

Resource Type | Endpoint | Description
:--- | :--- | :---
`labels` | `/api/v1/labels` | Fetches all label names.
`label` | `/api/v1/label/{labelName}/values` | Fetches values for a specific label.
`metadata` | `/api/v1/metadata` | Fetches metric metadata.
`series` | `/api/v1/series` | Fetches time series matching a selector.
`alerts` | `/alertmanager/api/v2/alerts` | Fetches active alerts from Alertmanager.
`silences` | `/alertmanager/api/v2/silences` | Fetches alert silences from Alertmanager.
`receivers` | `/alertmanager/api/v2/receivers` | Fetches Alertmanager receivers.

#### Query parameters

Parameter | Data type | Description
:--- | :--- | :---
`start` | String | The start timestamp for filtering results. ISO 8601 format. Optional.
`end` | String | The end timestamp for filtering results. ISO 8601 format. Optional.
`match[]` | String | A series selector for filtering (used with series endpoint). Optional.
`active` | Boolean | Filters alerts by active status. Optional.
`silenced` | Boolean | Filters alerts by silenced status. Optional.
`filter` | String | A filter expression for silences. Optional.

#### Example request: Get all labels

```json
GET /_plugins/_directquery/_resources/my_prometheus/api/v1/labels
```
{% include copy-curl.html %}

#### Example response

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

#### Example request: Get values for a specific label

```json
GET /_plugins/_directquery/_resources/my_prometheus/api/v1/label/job/values
```
{% include copy-curl.html %}

#### Example response

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

#### Example request: Get active alerts

```json
GET /_plugins/_directquery/_resources/my_prometheus/alertmanager/api/v2/alerts?active=true&silenced=false
```
{% include copy-curl.html %}

#### Example response

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

#### Example request: Get alert silences

```json
GET /_plugins/_directquery/_resources/my_prometheus/alertmanager/api/v2/silences
```
{% include copy-curl.html %}

### Write Resources API
Experimental
{: .label .label-yellow }

Creates or modifies resources in an external data source. Currently supports creating alert silences in Prometheus Alertmanager.

#### HTTP method and path

```
POST /_plugins/_directquery/_resources/{dataSource}/alertmanager/api/v2/{resourceType}
```

#### Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`dataSource` | String | The name of the configured data source. Required.
`resourceType` | String | The type of resource to create. Currently only `silences` is supported. Required.

#### Request body fields

The request body should contain the resource definition in the format expected by the external data source. For Alertmanager silences, use the following format:

Field | Data type | Description
:--- | :--- | :---
`matchers` | Array | An array of label matchers that determine which alerts the silence applies to. Required.
`matchers[].name` | String | The label name to match. Required.
`matchers[].value` | String | The label value to match. Required.
`matchers[].isRegex` | Boolean | Whether the value is a regular expression. Default is `false`. Optional.
`matchers[].isEqual` | Boolean | Whether to match equal (`true`) or not equal (`false`). Default is `true`. Optional.
`startsAt` | String | The start time for the silence. ISO 8601 format. Required.
`endsAt` | String | The end time for the silence. ISO 8601 format. Required.
`createdBy` | String | The author of the silence. Required.
`comment` | String | A comment describing the reason for the silence. Required.

#### Example request: Create an alert silence

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

#### Example response

```json
{
  "silenceID": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

#### Response body fields

Field | Data type | Description
:--- | :--- | :---
`silenceID` | String | The unique identifier of the created silence.
