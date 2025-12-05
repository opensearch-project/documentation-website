---
layout: default
title: Settings
parent: SQL and PPL
nav_order: 77
redirect_from:
  - /search-plugins/sql/settings/
---

# SQL settings

The SQL plugin adds a few settings to the standard OpenSearch cluster settings. Most are dynamic, so you can change the default behavior of the plugin without restarting your cluster. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

It is possible to independently disable processing of `PPL` or `SQL` queries.

You can update these settings like any other cluster setting:

```json
PUT _cluster/settings
{
  "transient" : {
    "plugins.sql.enabled" : false
  }
}
```

Alternatively, you can use the following request format:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins": {
      "ppl": {
        "enabled": "false"
      }
    }
  }
}
```

Similarly, you can update the settings by sending a request to the `_plugins/_query/settings` endpoint:

```json
PUT _plugins/_query/settings
{
  "transient" : {
    "plugins.sql.enabled" : false
  }
}
```

Alternatively, you can use the following request format:

```json
PUT _plugins/_query/settings
{
  "transient": {
    "plugins": {
      "ppl": {
        "enabled": "false"
      }
    }
  }
}
```

Requests to the `_plugins/_ppl` and `_plugins/_sql` endpoints include index names in the request body, so they have the same access policy considerations as the `bulk`, `mget`, and `msearch` operations. Setting the `rest.action.multi.allow_explicit_index` parameter to `false` disables both the `SQL` and `PPL` endpoints.
{: .note}

## Available settings

Setting | Default | Description
:--- | :--- | :---
`plugins.sql.enabled` | `true` | Change to `false` to disable the `SQL` support in the plugin.
`plugins.ppl.enabled` | `true` | Change to `false` to disable the `PPL` support in the plugin.
`plugins.sql.slowlog` | `2` | Configures the time limit (in seconds) for slow queries. The plugin logs slow queries as `Slow query: elapsed=xxx (ms)` in `opensearch.log`.
`plugins.sql.cursor.keep_alive` | `1m` | Configures the amount of time that the cursor context remains open. Because cursor contexts are resource-intensive, we recommend a low value.
`plugins.query.memory_limit` | `85%` | Configures the heap memory usage limit for the query engine's circuit breaker.
`plugins.query.size_limit` | `10000` | Sets the maximum number of rows returned from a query execution.
`plugins.query.datasources.enabled` | `true` | Change to `false` to disable support for data sources in the plugin.
`plugins.query.field_type_tolerance` | `true` | If `false`, then an array is reduced to the first non-array value at any nesting level. For example, `[[1, 2], [3, 4]]` is reduced to `1`. If `true`, then the array is preserved. Default is `true`.
`plugins.query.buckets` | `10000` | Sets the number of aggregation buckets returned in a single response. Default is the `plugins.query.size_limit` value.
`plugins.calcite.enabled` | `true` | Enables the Apache Calcite query engine, including advanced SQL and PPL capabilities such as subsearch, join, and lookup operations.
`plugins.calcite.pushdown.enabled` | `true` | Change to `false` to disable the operator push-down optimization. We recommend using the default value.
`plugins.calcite.fallback.allowed` | `false` | Change to `true` to allow fallback to the v2 engine.
`plugins.calcite.pushdown.rowcount.estimation.factor` | `0.9` | A factor used to multiply the row count of a table scan to estimate the resulting row count. We recommend using the default value.
`plugins.calcite.all_join_types.allowed` | `false` | Enables performance-sensitive join types, like `RIGHT`, `FULL`, and `CROSS` joins. Change to `true` to allow these join operations.
`plugins.ppl.syntax.legacy.preferred` | `true` | Controls certain PPL syntax behaviors, including default argument values. When `false`, uses newer syntax standards.
`plugins.ppl.values.max.limit` | `0` | Sets the maximum number of unique values that the `VALUES` aggregation function can return. A value of `0` indicates no limit.
`plugins.ppl.rex.max_match.limit` | `10` | Maximum number of matches to extract in `rex` command.
`plugins.ppl.subsearch.maxout` | `10000` | Sets the maximum of rows to return from subsearch.
`plugins.ppl.join.subsearch_maxout` | `50000` | Sets the maximum of rows from subsearch to join against.
`plugins.ppl.pattern.method` | `"simple_pattern"` | Sets the default patterns method. Another supported method is "brain".
`plugins.ppl.pattern.mode` | `"label"` | Sets the default patterns mode. Another supported mode is "aggregation".
`plugins.ppl.pattern.max.sample.count` | `10` | Sets the maximum number of sample logs returned per pattern in aggregation mode.
`plugins.ppl.pattern.buffer.limit` | `100000` | Sets the size of the internal temporary buffer used by the `brain` algorithm.
`plugins.ppl.pattern.show.numbered.token` | `false` | Change to `true` to enable the numbered token output format.
`plugins.ppl.query.timeout` | `5m` | Configures the maximum execution time for PPL queries. When a query exceeds this timeout, it will be interrupted and return a timeout error.

## Spark connector settings

The SQL plugin supports [Apache Spark](https://spark.apache.org/) as an augmented compute source. When data sources are defined as tables in Apache Spark, OpenSearch can consume those tables. This allows you to run SQL queries against external sources inside OpenSearch Dashboard's [Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) and observability logs. 

To get started, enable the following settings to add Spark as a data source and enable the correct permissions.

Setting | Description
:--- | :---
`spark.uri` | The identifier for your Spark data source.
`spark.auth.type` | The authorization type used to authenticate into Spark.
`spark.auth.username` | The username for your Spark data source.
`spark.auth.password` | The password for your Spark data source.
`spark.datasource.flint.host` | The host of the Spark data source. Default is `localhost`.
`spark.datasource.flint.port` | The port number for Spark. Default is `9200`.
`spark.datasource.flint.scheme` | The data scheme used in your Spark queries. Valid values are `http` and `https`.
`spark.datasource.flint.auth` | The authorization required to access the Spark data source. Valid values are `false` and `sigv4`.
`spark.datasource.flint.region` | The AWS Region in which your OpenSearch cluster is located. Only use when `auth` is set to `sigv4`. Default value is `us-west-2``.
`spark.datasource.flint.write.id_name` | The name of the index to which the Spark connector writes.
`spark.datasource.flint.ignore.id_column` | Excludes the `id` column when exporting data in a query. Default is `true`.
`spark.datasource.flint.write.batch_size` | Sets the batch size when writing to a Spark-connected index. Default is `1000`.
`spark.datasource.flint.write.refresh_policy` | Sets the refresh policy for the Spark connection upon failure for the connector to write data to OpenSearch. Either no refresh (`false`), an immediate refresh (`true`), or a set time to wait, `wait_for: X`. Default value is `false`.
`spark.datasource.flint.read.scroll_size` | Sets the number of results returned by queries run using Spark. Default is `100`.
`spark.flint.optimizer.enabled` | Enables OpenSearch to be optimized for Spark connection. Default is `true`.
`spark.flint.index.hybridscan.enabled` | Enables OpenSearch to scan for write data on non-partitioned devices from the data source. Default is `false`.

Once configured, you can test your Spark connection using the following API call:

```json
POST /_plugins/_ppl
content-type: application/json

{
   "query": "source = my_spark.sql('select * from alb_logs')"
}
```
