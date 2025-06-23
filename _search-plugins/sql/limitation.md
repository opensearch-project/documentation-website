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

## JOIN queries

Because OpenSearch doesn't natively support relational operations, `JOIN` queries are supported on a best-effort basis.

### JOIN does not support aggregations on the joined result

The `JOIN` query does not support aggregations on the joined result.

For example, `SELECT depo.name, avg(empo.age) FROM empo JOIN depo WHERE empo.id = depo.id GROUP BY depo.name` is not supported.

### Performance

`JOIN` queries are prone to expensive index scanning operations.

Depending on the dataset, there may be scalability issues when running `JOIN` queries between result sets matching more than around 5 million records.
To improve `JOIN` performance, reduce the number of records being joined by filtering your data first. For example, limit the join to a specific range of key values:

```sql
SELECT l.key, l.spanId, r.spanId
  FROM logs_left AS l
  JOIN logs_right AS r
  ON l.key = r.key
  WHERE l.key >= 17491637400000 -- We clamp the key field between two values to reduce the search space
    AND l.key < 17491637500000
    AND r.key >= 17491637400000
    AND r.key < 17491637500000
  LIMIT 10
```
{% include copy.html %}

If this isn't possible: to avoid runaway resource usage, `JOIN` queries will time out after 60 seconds by default.
This limit can be changed with a hint, specifying a new timeout in seconds:

```
SELECT /*! JOIN_TIME_OUT(300) */ left.a, right.b FROM left JOIN right ON left.id = right.id;
```

These performance restrictions don't apply when [querying external data sources]({{site.url}}{{site.baseurl}}/dashboards/management/query-data-source/).

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

Before OpenSearch 3.0.0, the SQL plugin used two query processing engines: `V1` and `V2`. Both engines supported most features, but only `V2` was under active development. When you ran a query, the plugin first tried to execute it using the `V2` engine and fell back to `V1` if execution failed. If a query was supported in `V2` but not in `V1`, the query would fail and return an error response.

Starting with OpenSearch 3.0.0, the SQL plugin introduced a new query engine (`V3`) that leverages Apache Calcite for query optimization and execution. Because `V3` is an experimental feature in OpenSearch 3.0.0, it's disabled by default. To enable this new engine, set `plugins.calcite.enabled` to `true`. Similar to the `V2` to `V1` fallback logic, when you run a query, the plugin first tries to execute it using the `V3` engine and falls back to `V2` if execution fails. For more information about `V3`, see [PPL Engine V3](https://github.com/opensearch-project/sql/blob/main/docs/dev/intro-v3-engine.md).

### V1 engine limitations

The `V1` query engine is the original SQL processing engine in OpenSearch. While it's been largely replaced by newer engines, understanding its limitations helps explain certain query behaviors, especially when queries fall back from `V2` to `V1`. The following limitations apply specifically to the `V1` engine:

* The select literal expression without `FROM` clause is not supported. For example, `SELECT 1` is not supported.
* The `WHERE` clause does not support expressions. For example, `SELECT FlightNum FROM opensearch_dashboards_sample_data_flights where (AvgTicketPrice + 100) <= 1000` is not supported.
* Most [relevancy search functions]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text/) are implemented in the `V2` engine only.

Such queries are successfully executed by the `V2` engine unless they have `V1`-specific functions. You will likely never meet these limitations.

### V2 engine limitations

The `V2` query engine handles most modern SQL query patterns. However, it has certain limitations that may affect your query development, particularly for complex analytical workloads. Understanding these limitations can help you design queries that work optimally with OpenSearch:

* The [cursor feature](#pagination-only-supports-basic-queries) is supported by the `V1` engine only.
  * For support of `cursor`/`pagination` in the `V2` engine, track [GitHub issue #656](https://github.com/opensearch-project/sql/issues/656).
* `json` formatted output is supported in `V1` engine only. 
* The `V2` engine does not track query execution time, so slow queries are not reported.
* The `V2` query engine not only runs queries in the OpenSearch engine but also supports post-processing for complex queries. Accordingly, the `explain` output is no longer OpenSearch domain-specific language (DSL) but also includes query plan information from the `V2` query engine.
* The `V2` query engine does not support aggregation queries such as `histogram`, `date_histogram`, `percentiles`, `topHits`, `stats`, `extended_stats`, `terms`, or `range`.
* JOINs and sub-queries are not supported. To stay up to date on the development for JOINs and sub-queries, track [GitHub issue #1441](https://github.com/opensearch-project/sql/issues/1441) and [GitHub issue #892](https://github.com/opensearch-project/sql/issues/892).
* OpenSearch does not natively support the array data type but does allow multi-value fields implicitly. The SQL/PPL plugin adheres strictly to the data type semantics defined in index mappings. When parsing OpenSearch responses, it expects data to match the declared type and does not interpret all data in an array. If the [`plugins.query.field_type_tolerance`](https://github.com/opensearch-project/sql/blob/main/docs/user/admin/settings.rst#plugins-query-field-type-tolerance) setting is enabled, the SQL/PPL plugin handles array datasets by returning scalar data types, allowing basic queries (for example, `SELECT * FROM tbl WHERE condition`). However, using multi-value fields in expressions or functions will result in exceptions. If this setting is disabled or not set, only the first element of an array is returned, preserving the default behavior.
* PartiQL syntax for `nested` queries is not supported.

### V3 engine limitations and restrictions

The `V3` query engine provides enhanced query processing capabilities using Apache Calcite. As an experimental feature in OpenSearch 3.0.0, it has certain limitations and behavioral differences you should be aware of when developing queries. These limitations fall into three categories: new restrictions, unsupported functionalities, and behavior changes.

#### Restrictions

The `V3` engine introduces stricter validation for OpenSearch metadata fields. When working with commands that manipulate field names, be aware of the following restrictions:

- `eval` won't allow you to use [OpenSearch metadata fields]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/index/) as the fields.
- `rename` won't allow renaming to an [OpenSearch metadata field]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/index/).
- `as` won't allow you to use an [OpenSearch metadata field]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/index/) as the alias name.

### Unsupported functionalities

The `V3` engine doesn't support all the functionality available in previous engines. For the following features, the query will automatically be forwarded to the `V2` query engine:

- `trendline`
- `show datasource`
- `describe`
- `top` and `rare`
- `fillnull`
- `patterns`
- `dedup` with `consecutive=true`
- Search-relevant commands:
  - `AD`
  - `ML`
  - `Kmeans`
- Commands with the `fetch_size` parameter
- Queries with metadata fields, such as `_id` or `_doc`
- JSON-relevant functions:
  - `cast to json`
  - `json`
  - `json_valid`
- Search-relevant functions:
  - `match`
  - `match_phrase`
  - `match_bool_prefix`
  - `match_phrase_prefix`
  - `simple_query_string`
  - `query_string`
  - `multi_match`

#### V2 compared to V3

Because the `V3` engine uses a different implementation internally, some behaviors have changed from previous versions. The behaviors in `V3` are considered correct, but they may produce different results than the same queries in `V2`. The following table highlights these differences.

Item | `V2` | `V3`
:--- | :--- | :---
Return type of `timestampdiff` | `timestamp` | `int`
Return type of `regexp` | `int` | `boolean`
Return type of `count`,`dc`,`distinct_count` | `int` | `bigint`
Return type of `ceiling`,`floor`,`sign` | `int` | Same type with input
`like(firstname, 'Ambe_')` on value "Amber JOHnny" | `true` | `false`
`like(firstname, 'Ambe*')` on value "Amber JOHnny" | `true` | `false`
`cast(firstname as boolean)` | `false` | `null`
Sum of multiple `null` values when `pushdown` is enabled | `0` | `null`
`percentile(null, 50)` | `0` | `null`
