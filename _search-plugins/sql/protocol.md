---
layout: default
title: Protocol
parent: SQL
nav_order: 14
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/response-formats/
---

# Protocol

For the protocol, SQL plugin provides multiple response formats for
different purposes while the request format is same for all. Among them
JDBC format is widely used because it provides schema information and
more functionality such as pagination. Besides JDBC driver, various
clients can benefit from the detailed and well formatted response.

## Request Format

### Description

The body of HTTP POST request can take a few more other fields with SQL
query.

### Example 1

Use `filter` to add more conditions to
OpenSearch DSL directly.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql -d '{
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

Explain:

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

### Example 2

Use `parameters` for actual parameter value
in prepared SQL query.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql -d '{
  "query": "SELECT * FROM accounts WHERE age = ?",
  "parameters": [{
    "type": "integer",
    "value": 30
  }]
}'
```

Explain:

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
## JDBC Format

### Description

By default, the plugin returns the JDBC standard format. This format
is provided for JDBC driver and clients that need both schema and
result set well formatted.

### Example 1

Here is an example for normal response. The
`schema` includes field name and its type
and `datarows` includes the result set.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql -d '{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age LIMIT 2"
}'
```

Result set:

```json
{
  "schema": [{
      "name": "firstname",
      "type": "text"
    },
    {
      "name": "lastname",
      "type": "text"
    },
    {
      "name": "age",
      "type": "long"
    }
  ],
  "total": 4,
  "datarows": [
    [
      "Nanette",
      "Bates",
      28
    ],
    [
      "Amber",
      "Duke",
      32
    ]
  ],
  "size": 2,
  "status": 200
}
```

### Example 2

If any error occurred, error message and the cause will be returned
instead.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql -d '{
  "query" : "SELECT unknown FROM accounts"
}'
```

Result set:

```json
{
  "error": {
    "reason": "Invalid SQL query",
    "details": "Field [unknown] cannot be found or used here.",
    "type": "SemanticAnalysisException"
  },
  "status": 400
}
```

## OpenSearch DSL

### Description

The `json` format returns original response from OpenSearch in
JSON. Because this is the native response from OpenSearch, extra
efforts are needed to parse and interpret it.

### Example

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql?format=json -d '{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age LIMIT 2"
}'
```

Result set:

```json
{
  "_shards": {
    "total": 5,
    "failed": 0,
    "successful": 5,
    "skipped": 0
  },
  "hits": {
    "hits": [{
        "_index": "accounts",
        "_type": "account",
        "_source": {
          "firstname": "Nanette",
          "age": 28,
          "lastname": "Bates"
        },
        "_id": "13",
        "sort": [
          28
        ],
        "_score": null
      },
      {
        "_index": "accounts",
        "_type": "account",
        "_source": {
          "firstname": "Amber",
          "age": 32,
          "lastname": "Duke"
        },
        "_id": "1",
        "sort": [
          32
        ],
        "_score": null
      }
    ],
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null
  },
  "took": 100,
  "timed_out": false
}
```

## CSV Format

### Description

You can also use CSV format to download result set as CSV.

### Example

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql?format=csv -d '{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age"
}'
```

Result set:

```text
firstname,lastname,age
Nanette,Bates,28
Amber,Duke,32
Dale,Adams,33
Hattie,Bond,36
```

## Raw Format

### Description

Additionally raw format can be used to pipe the result to other command
line tool for post processing.

### Example

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_plugins/_sql?format=raw -d '{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age"
}'
```

Result set:

```text
Nanette|Bates|28
Amber|Duke|32
Dale|Adams|33
Hattie|Bond|36
```
