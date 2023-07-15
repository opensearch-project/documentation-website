---
layout: default
title: Settings
parent: SQL and PPL
nav_order: 77
redirect_from:
  - /search-plugins/sql/settings/
---

# SQL settings

The SQL plugin adds a few settings to the standard OpenSearch cluster settings. Most are dynamic, so you can change the default behavior of the plugin without restarting your cluster. 

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
`plugins.sql.enabled` | True | Change to `false` to disable the `SQL` support in the plugin.
`plugins.ppl.enabled` | True | Change to `false` to disable the `PPL` support in the plugin.
`plugins.sql.slowlog` | 2 seconds | Configures the time limit (in seconds) for slow queries. The plugin logs slow queries as `Slow query: elapsed=xxx (ms)` in `opensearch.log`.
`plugins.sql.cursor.keep_alive` | 1 minute | Configures how long the cursor context is kept open. Cursor contexts are resource-intensive, so we recommend a low value.
`plugins.query.memory_limit` | 85% | Configures the heap memory usage limit for the circuit breaker of the query engine.
`plugins.query.size_limit` | 200 | Sets the default size of index that the query engine fetches from OpenSearch.

## Spark connector settings

The SQL plugin supports [Apache Spark](https://spark.apache.org/) as a data source. This allows you to run SQL queries in Spark and seamlessly write the resulting data back to OpenSearch. To use Spark, enable the following settings to add Spark as a data source and enable the correct permissions.

Setting | Description
:--- | :---
`spark.uri` | The identifier for your Spark data source.
`spark.auth.type` | The authorization type used to authenticate into Spark.
`spark.auth.username` | The username for your Spark data source.
`spark.auth.password` | The password for your Spark data source.
`spark.datasource.flint.host` | The host of the Spark data source.
`spark.datasource.flint.port` | The post number for Spark.
`spark.datasource.flint.scheme` | The data scheme used in your Spark queries. 
`spark.datasource.flint.auth` | The authorization required to access the Spark data source.
`spark.datasource.flint.region` | The region in which your OpenSearch cluster is located.

Once configured, you can test your Spark connection using the following API call:

```json
POST /_plugins/_ppl
content-type: application/json

{
   "query": "source = my_spark.sql('select * from alb_logs')"
}
```
