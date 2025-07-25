---
layout: default
title: Limitations
parent: SQL
nav_order: 18
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/limitation/
---

# Limitations

The SQL plugin has the following limitations:

## SELECT FROM WHERE

### Select literal is not supported

The select literal expression is not supported. For example, `Select 1` is not supported.


### Where clause does not support arithmetic operations

The `WHERE` clause does not support expressions. For example, `SELECT FlightNum FROM opensearch_dashboards_sample_data_flights where (AvgTicketPrice + 100) <= 1000` is not supported.


### Aggregation over expression is not supported

You can only apply aggregation on fields, aggregations can't accept an expression as a parameter. For example, `avg(log(age))` is not supported.


### Conflict type in multiple index query

Queries using wildcard index fail if the index has the field with a conflict type.
For example, if you have two indices with field `a`:

```
POST conflict_index_1/_doc/
{
  "a": {
    "b": 1
  }
}

POST conflict_index_2/_doc/
{
  "a": {
    "b": 1,
    "c": 2
  }
}
```

Then, the query fails because of the field mapping conflict. The query `SELECT * FROM conflict_index*` also fails for the same reason.

```sql
Error occurred in OpenSearch engine: Different mappings are not allowed for the same field[a]: found [{properties:{b:{type:long},c:{type:long}}}] and [{properties:{b:{type:long}}}] ",
    "details": "com.amazon.opensearch.sql.rewriter.matchtoterm.VerificationException: Different mappings are not allowed for the same field[a]: found [{properties:{b:{type:long},c:{type:long}}}] and [{properties:{b:{type:long}}}] \nFor more details, please send request for Json format to see the raw response from opensearch engine.",
    "type": "VerificationException
```


## Subquery in the FROM clause

Subquery in the `FROM` clause in this format: `SELECT outer FROM (SELECT inner)` is supported only when the query is merged into one query. For example, the following query is supported:

```sql
SELECT t.f, t.d
FROM (
    SELECT FlightNum as f, DestCountry as d
    FROM opensearch_dashboards_sample_data_flights
    WHERE OriginCountry = 'US') t
```

But, if the outer query has `GROUP BY` or `ORDER BY`, then it's not supported.

## JOIN does not support aggregations on the joined result

The `join` query does not support aggregations on the joined result.
For example, e.g. `SELECT depo.name, avg(empo.age) FROM empo JOIN depo WHERE empo.id == depo.id GROUP BY depo.name` is not supported.


## Pagination only supports basic queries

The pagination query enables you to get back paginated responses.
Currently, the pagination only supports basic queries. For example, the following query returns the data with cursor id.

```json
POST _plugins/_sql/
{
  "fetch_size" : 5,
  "query" : "SELECT OriginCountry, DestCountry FROM opensearch_dashboards_sample_data_flights ORDER BY OriginCountry ASC"
}
```

The response in JDBC format with cursor id.

```json
{
  "schema": [
    {
      "name": "OriginCountry",
      "type": "keyword"
    },
    {
      "name": "DestCountry",
      "type": "keyword"
    }
  ],
  "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFCSllXVTJKVU4yeExiWEJSUkhsNFVrdDVXVEZSYkVKSmR3PT0iLCJjIjpbeyJuYW1lIjoiT3JpZ2luQ291bnRyeSIsInR5cGUiOiJrZXl3b3JkIn0seyJuYW1lIjoiRGVzdENvdW50cnkiLCJ0eXBlIjoia2V5d29yZCJ9XSwiZiI6MSwiaSI6ImtpYmFuYV9zYW1wbGVfZGF0YV9mbGlnaHRzIiwibCI6MTMwNTh9",
  "total": 13059,
  "datarows": [[
    "AE",
    "CN"
  ]],
  "size": 1,
  "status": 200
}
```

The query with `aggregation` and `join` does not support pagination for now.
