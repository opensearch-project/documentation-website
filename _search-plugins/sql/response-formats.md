---
layout: default
title: Response formats
parent: SQL and PPL
nav_order: 2
---

# Response formats

The SQL plugin provides the `jdbc`, `csv`, `raw`, and `json` response formats that are useful for different purposes. The `jdbc` format is widely used because it provides the schema information and adds more functionality, such as pagination. Besides the JDBC driver, various clients can benefit from a detailed and well-formatted response.

## JDBC format

By default, the SQL plugin returns the response in the standard JDBC format. This format is provided for the JDBC driver and clients that need both the schema and the result set to be well formatted.

#### Example request

The following query does not specify the response format, so the format is set to `jdbc`:

```json
POST _plugins/_sql
{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age LIMIT 2"
}
```

#### Example response

In the response, the `schema` contains the field names and types, and the `datarows` field contains the result set:

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

If an error of any type occurs, OpenSearch returns the error message.

The following query searches for a non-existent field `unknown`:

```json
POST /_plugins/_sql
{
  "query" : "SELECT unknown FROM accounts"
}
```

The response contains the error message and the cause of the error:

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

## OpenSearch DSL JSON format

If you set the format to `json`, the original OpenSearch response is returned in JSON format. Because this is the native response from OpenSearch, extra effort is needed to parse and interpret it.

#### Example request

The following query sets the response format to `json`:

```json
POST _plugins/_sql?format=json
{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age LIMIT 2"
}
```

#### Example response

The response is the original response from OpenSearch:

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

## CSV format

You can also specify to return results in CSV format. 

#### Example request

```json
POST /_plugins/_sql?format=csv
{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age"
}
```

#### Example response

```text
firstname,lastname,age
Nanette,Bates,28
Amber,Duke,32
Dale,Adams,33
Hattie,Bond,36
```
### Sanitizing results in CSV format

By default, OpenSearch sanitizes header cells (field names) and data cells (field contents) according to the following rules:

- If a cell starts with `+`, `-`, `=` , or `@`, the sanitizer inserts a single quote (`'`) at the start of the cell.
- If a cell contains one or more commas (`,`), the sanitizer surrounds the cell with double quotes (`"`).

### Example 

The following query indexes a document with cells that either start with special characters or contain commas:

```json
PUT /userdata/_doc/1?refresh=true
{
  "+firstname": "-Hattie",
  "=lastname": "@Bond",
  "address": "671 Bristol Street, Dente, TN"
}
```

You can use the query below to request results in CSV format:

```json
POST /_plugins/_sql?format=csv
{
  "query" : "SELECT * FROM userdata"
}
```

In the response, cells that start with special characters are prefixed with `'`. The cell that has commas is surrounded with quotation marks:

```text
'+firstname,'=lastname,address
'Hattie,'@Bond,"671 Bristol Street, Dente, TN"
```

To skip sanitizing, set the `sanitize` query parameter to false:

```json
POST /_plugins/_sql?format=csvandsanitize=false
{
  "query" : "SELECT * FROM userdata"
}
```

The response contains the results in the original CSV format:

```text
=lastname,address,+firstname
@Bond,"671 Bristol Street, Dente, TN",-Hattie
```

## Raw format

You can use the raw format to pipe the results to other command line tools for post-processing.

#### Example request

```json
POST /_plugins/_sql?format=raw
{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age"
}
```

#### Example response

```text
Nanette|Bates|28
Amber|Duke|32
Dale|Adams|33
Hattie|Bond|36
```

By default, OpenSearch sanitizes results in `raw` format according to the following rule:

- If a data cell contains one or more pipe characters (`|`), the sanitizer surrounds the cell with double quotes.

### Example 

The following query indexes a document with pipe characters (`|`) in its fields:

```json
PUT /userdata/_doc/1?refresh=true
{
  "+firstname": "|Hattie",
  "=lastname": "Bond|",
  "|address": "671 Bristol Street| Dente| TN"
}
```

You can use the query below to request results in `raw` format:

```json
POST /_plugins/_sql?format=raw
{
  "query" : "SELECT * FROM userdata"
}
```

The query returns cells with the `|` character surrounded by quotation marks:

```text
"|address"|=lastname|+firstname
"671 Bristol Street| Dente| TN"|"Bond|"|"|Hattie"
```