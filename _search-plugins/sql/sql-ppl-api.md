---
layout: default
title: SQL and PPL API
parent: SQL and PPL
nav_order: 1
---

# SQL and PPL API

Use the SQL and PPL API to send queries to the SQL plugin. Use the `_sql` endpoint to send queries in SQL, and the `_ppl` endpoint to send queries in PPL. For both of these, you can also use the `_explain` endpoint to translate your query into [OpenSearch domain-specific language]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/) (DSL) or to troubleshoot errors.

## Query API

Sends an SQL/PPL query to the SQL plugin. You can pass the format for the response as a query parameter.

### Query parameters

Parameter | Data Type | Description
:--- | :--- | :---
[format]({{site.url}}{{site.baseurl}}/search-plugins/sql/response-formats/) | String | The format for the response. The `_sql` endpoint supports `jdbc`, `csv`, `raw`, and `json` formats. The `_ppl` endpoint supports `jdbc`, `csv`, and `raw` formats. Default is `jdbc`.
sanitize | Boolean | Specifies whether to escape special characters in the results. See [Response formats]({{site.url}}{{site.baseurl}}/search-plugins/sql/response-formats/) for more information. Default is `true`.

### Request fields

Field | Data Type | Description  
:--- | :--- | :---
query | String | The query to be executed. Required.
[filter](#filtering-results) | JSON object | The filter for the results. Optional.
[fetch_size](#paginating-results) | integer | The number of results to return in one response. Used for paginating results. Default is 1,000. Optional. Only supported for the `jdbc` response format.

#### Example request

```json
POST /_plugins/_sql 
{
  "query" : "SELECT * FROM accounts"
}
```

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

### Response fields

Field | Data Type | Description  
:--- | :--- | :---
schema | Array | Specifies the field names and types for all fields. 
data_rows | 2D array | An array of results. Each result represents one matching row (document).
total | Integer | The total number of rows (documents) in the index.
size | Integer | The number of results to return in one response.
status | String | The HTTP response status OpenSearch returns after running the query.

## Explain API

The SQL plugin has an `explain` feature that shows how a query is executed against OpenSearch, which is useful for debugging and development. A POST request to the `_plugins/_sql/_explain` or `_plugins/_ppl/_explain` endpoint returns [OpenSearch domain-specific language]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/) (DSL) in JSON format, explaining the query.
You can execute the explain API operation either in command line using `curl` or in the Dashboards console, like in the example below. 

#### Sample explain request for an SQL query

```json
POST _plugins/_sql/_explain
{
  "query": "SELECT firstname, lastname FROM accounts WHERE age > 20"
}
```

#### Sample SQL query explain response

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

#### Sample explain request for a PPL query

```json
POST _plugins/_ppl/_explain
{
  "query" : "source=accounts | fields firstname, lastname"
}
```

#### Sample PPL query explain response

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
          "request": """OpenSearchQueryRequest(indexName=accounts, sourceBuilder={"from":0,"size":200,"timeout":"1m","_source":{"includes":["firstname","lastname"],"excludes":[]}}, searchDone=false)"""
        },
        "children": []
      }
    ]
  }
}
```

For queries that require post-processing, the `explain` response includes a query plan in addition to the OpenSearch DSL. For those queries that don't require post processing, you can see a complete DSL.

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
   "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFBQU1XZWpkdFRFRkZUMlpTZEZkeFdsWnJkRlZoYnpaeVVRPT0iLCJjIjpbeyJuYW1lIjoiZmlyc3RuYW1lIiwidHlwZSI6InRleHQifSx7Im5hbWUiOiJsYXN0bmFtZSIsInR5cGUiOiJ0ZXh0In1dLCJmIjo1LCJpIjoiYWNjb3VudHMiLCJsIjo5NTF9"
}'
```

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
}'
```

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
