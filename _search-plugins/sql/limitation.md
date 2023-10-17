---
layout: default
title: Limitations
parent: SQL and PPL
nav_order: 99
redirect_from:
  - /search-plugins/sql/limitation/
---

# Limitations

The SQL plugin has the following limitations:

## Aggregation over expression is not supported

You can only apply aggregation to fields. Aggregations cannot accept an expression as a parameter. For example, `avg(log(age))` is not supported.

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

## Query processing engines

The SQL plugin has two query processing engines, `V1` and `V2`. Most of the features are supported by both engines, but only the new engine is actively being developed. A query that is first executed on the `V2` engine falls back to the `V1` engine in case of failure. If a query is supported in `V2` but not included in `V1`, the query will fail with an error response.

### V1 engine limitations

* The select literal expression without `FROM` clause is not supported. For example, `SELECT 1` is not supported.
* The `WHERE` clause does not support expressions. For example, `SELECT FlightNum FROM opensearch_dashboards_sample_data_flights where (AvgTicketPrice + 100) <= 1000` is not supported.
* Most [relevancy search functions]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text/) are implemented in the `V2` engine only.

Such queries are successfully executed by the `V2` engine unless they have `V1`-specific functions. You will likely never meet these limitations.

### V2 engine limitations

* The [cursor feature](#pagination-only-supports-basic-queries) is supported by the `V1` engine only.
  * For support of `cursor`/`pagination` in the `V2` engine, track [GitHub issue #656](https://github.com/opensearch-project/sql/issues/656).
* `json` formatted output is supported in `V1` engine only. 
* The `V2` engine does not track query execution time, so slow queries are not reported.
* The `V2` query engine not only runs queries in the OpenSearch engine but also supports post-processing for complex queries. Accordingly, the `explain` output is no longer OpenSearch domain-specific language (DSL) but also includes query plan information from the `V2` query engine.
Suggested change
* The `V2` query engine does not support aggregation queries such as `histogram`, `date_histogram`, `percentiles`, `topHits`, `stats`, `extended_stats`, `terms`, or `range`.
* JOINs and sub-queries are not supported. To stay up to date on the development for JOINs and sub-queries, track [GitHub issue #1441](https://github.com/opensearch-project/sql/issues/1441) and [GitHub issue #892](https://github.com/opensearch-project/sql/issues/892).
* PartiQL syntax for `nested` queries are not supported.  Additionally, arrays of objects and primitive types return the first index of the array, while in `V1` they return the entire array as a JSON object. 
