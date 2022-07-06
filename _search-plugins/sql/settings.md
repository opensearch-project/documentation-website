---
layout: default
title: Settings
parent: SQL Plugin - SQL & PPL
nav_order: 77
---

# Settings

The SQL plugin adds a few settings to the standard OpenSearch cluster settings. Most are dynamic, so you can change the default behavior of the plugin without restarting your cluster. It is possible to independently disable processing of `PPL` or `SQL` queries.

You can update these settings like any other cluster setting:

```json
PUT _cluster/settings
{
  "transient" : {
    "plugins.sql.enabled" : false
  }
}
```

There is another format of request which could be used:

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

Similarly, you can also update the settings by sending the request to the plugin setting endpoint `_plugins/_query/setting`:

```json
PUT _plugins/_query/settings
{
  "transient" : {
    "plugins.sql.enabled" : false
  }
}
```

Or in alternative format:

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

**Note**: Requests to `_plugins/_ppl` and `_plugins/_sql` endpoints include index names in the request body, so they have the same access policy considerations as the `bulk`, `mget`, and `msearch` operations. Seting the `rest.action.multi.allow_explicit_index` parameter to `false`, disables both `SQL` and `PPL` endpoints.

# Available settings

Setting | Default | Description
:--- | :--- | :---
`plugins.sql.enabled` | True | Change to `false` to disable the `SQL` support in the plugin.
`plugins.ppl.enabled` | True | Change to `false` to disable the `PPL` component.
`plugins.sql.slowlog` | 2 seconds | Configure the time limit (in seconds) for slow queries. The plugin logs slow queries as `Slow query: elapsed=xxx (ms)` in `opensearch.log`.
`plugins.sql.cursor.keep_alive` | 1 minute | This value configures how long the cursor context is kept open. Cursor contexts are resource heavy, so we recommend a low value.
`plugins.query.memory_limit` | 85% | This setting configures the heap memory usage limit for the circuit breaker of the query engine.
`plugins.query.size_limit` | 200 | The setting sets the default size of index that the query engine fetches from OpenSearch.
