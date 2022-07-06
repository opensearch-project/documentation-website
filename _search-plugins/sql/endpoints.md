---
layout: default
title: Endpoint
parent: SQL Plugin - SQL & PPL
nav_order: 1
---


# Endpoint
Introduced 1.0
{: .label .label-purple }

To send query request to SQL plugin, you can either use a request
parameter in HTTP GET or request body by HTTP POST request. POST request
is recommended because it doesn't have length limitation and allows for
other parameters passed to plugin for other functionality such as
prepared statement. And also the explain endpoint is used very often for
query translation and troubleshooting.

## POST

### Description

You can also send HTTP POST request with your query in request body.

### Example

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql -d '{
  "query" : "SELECT * FROM accounts"
}'
```

## Explain

### Description

The SQL & PPL plugin has an `explain` feature that shows how a query would be executed against OpenSearch, which is useful for debugging and development. A `POST` request to `_plugins/_sql/_explain` or `_plugins/_ppl/_explain` endpoints will return OpenSearch domain specific language (DSL) in JSON format explaining the query.
The plugin would translate the query into OpenSearch Domain Specific Language (`DSL`) in `JSON` format. It could be executed on REST API using `curl` or in Dashboards Console.

### Example

Explain query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql/_explain -d '{
  "query" : "SELECT firstname, lastname FROM accounts WHERE age > 20"
}'
```

An explain query could be used for `PPL` as well:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_ppl/_explain -d '{
  "query" : "source=accounts | fields firstname, lastname"
}'
```

For queries that require post-processing, the `explain` response includes a query plan in addition to the OpenSearch DSL. For those queries that don't require post processing, you can see a complete DSL.

## Cursor

### Description

To get back a paginated response, use the `fetch_size` parameter. The value of `fetch_size` should be greater than 0. The default value is 1,000. A value of 0 will fallback to a non-paginated response.

The `fetch_size` parameter is only supported for the JDBC response format.
{: .note }


### Example

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql -d '{
  "fetch_size" : 5,
  "query" : "SELECT firstname, lastname FROM accounts WHERE age > 20 ORDER BY state ASC"
}'
```

Result set:

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

To fetch subsequent pages, use the `cursor` from last response:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql -d '{
   "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFBQU1XZWpkdFRFRkZUMlpTZEZkeFdsWnJkRlZoYnpaeVVRPT0iLCJjIjpbeyJuYW1lIjoiZmlyc3RuYW1lIiwidHlwZSI6InRleHQifSx7Im5hbWUiOiJsYXN0bmFtZSIsInR5cGUiOiJ0ZXh0In1dLCJmIjo1LCJpIjoiYWNjb3VudHMiLCJsIjo5NTF9"
}'
```

The result only has the `fetch_size` number of `datarows` and `cursor`.
The last page has only `datarows` and no `cursor`.
The `datarows` can have more than the `fetch_size` number of records in case the nested fields are flattened.

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

The `cursor` context is automatically cleared on the last page.
To explicitly clear cursor context, use the `_plugins/_sql/close endpoint` operation.

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql/close -d '{
   "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFBQU1XZWpkdFRFRkZUMlpTZEZkeFdsWnJkRlZoYnpaeVVRPT0iLCJjIjpbeyJuYW1lIjoiZmlyc3RuYW1lIiwidHlwZSI6InRleHQifSx7Im5hbWUiOiJsYXN0bmFtZSIsInR5cGUiOiJ0ZXh0In1dLCJmIjo1LCJpIjoiYWNjb3VudHMiLCJsIjo5NTF9"
}'
```

#### Sample response

```json
{"succeeded":true}
```
