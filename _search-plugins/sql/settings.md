---
layout: default
title: Settings
parent: SQL
nav_order: 16
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/settings/
---

# Settings

The SQL plugin adds a few settings to the standard OpenSearch cluster settings. Most are dynamic, so you can change the default behavior of the plugin without restarting your cluster.

You can update these settings like any other cluster setting:

```json
PUT _cluster/settings
{
  "transient" : {
    "plugins.sql.enabled" : false
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

Setting | Default | Description
:--- | :--- | :---
`plugins.sql.enabled` | True | Change to `false` to disable the plugin.
`plugins.sql.slowlog` | 2 seconds | Configure the time limit (in seconds) for slow queries. The plugin logs slow queries as `Slow query: elapsed=xxx (ms)` in `opensearch.log`.
`plugins.sql.cursor.keep_alive` | 1 minute | This value configures how long the cursor context is kept open. Cursor contexts are resource heavy, so we recommend a low value.
`plugins.query.memory_limit` | 85% | This setting configures the heap memory usage limit for the circuit breaker of the query engine.
`plugins.query.size_limit` | 200 | The setting sets the default size of index that the query engine fetches from OpenSearch.
