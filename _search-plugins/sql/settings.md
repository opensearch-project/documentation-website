---
layout: default
title: Settings
parent: SQL and PPL
nav_order: 77
redirect_from:
  - /search-plugins/sql/settings/
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/settings/
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

# Available settings

Setting | Default | Description
:--- | :--- | :---
`plugins.sql.enabled` | True | Change to `false` to disable the `SQL` support in the plugin.
`plugins.ppl.enabled` | True | Change to `false` to disable the `PPL` support in the plugin.
`plugins.sql.slowlog` | 2 seconds | Configures the time limit (in seconds) for slow queries. The plugin logs slow queries as `Slow query: elapsed=xxx (ms)` in `opensearch.log`.
`plugins.sql.cursor.keep_alive` | 1 minute | Configures how long the cursor context is kept open. Cursor contexts are resource-intensive, so we recommend a low value.
`plugins.query.memory_limit` | 85% | Configures the heap memory usage limit for the circuit breaker of the query engine.
`plugins.query.size_limit` | 200 | Sets the default size of index that the query engine fetches from OpenSearch.
