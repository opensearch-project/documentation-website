---
layout: default
title: Settings
parent: SQL
nav_order: 16
---

# Settings

The SQL plugin adds a few settings to the standard OpenSearch cluster settings. Most are dynamic, so you can change the default behavior of the plugin without restarting your cluster.

You can update these settings like any other cluster setting:

```json
PUT _cluster/settings
{
  "transient" : {
    "opensearch.sql.enabled" : false
  }
}
```

Setting | Default | Description
:--- | :--- | :---
`opensearch.sql.enabled` | True | Change to `false` to disable the plugin.
`opensearch.sql.query.slowlog` | 2 seconds | Configure the time limit (in seconds) for slow queries. The plugin logs slow queries as `Slow query: elapsed=xxx (ms)` in `opensearch.log`.
`opensearch.sql.query.analysis.enabled` | True | Enables or disables the query analyzer. Changing this setting to `false` lets you bypass strict syntactic and semantic analysis.
`opensearch.sql.query.analysis.semantic.suggestion` | False | If enabled, the query analyzer suggests correct field names for quick fixes.
`opensearch.sql.query.analysis.semantic.threshold` | 200 | Because query analysis needs to build semantic context in memory, indices with a large number of fields are be skipped. You can update this setting to apply analysis to smaller or larger indices as needed.
`opensearch.sql.query.response.format` | JDBC | Sets the default response format for queries. The supported formats are JDBC, JSON, CSV, raw, and table.
`opensearch.sql.cursor.enabled` | False | You can enable or disable pagination for all queries that are supported.
`opensearch.sql.cursor.fetch_size` | 1,000 | You can set the default `fetch_size` for all queries that are supported by pagination. An explicit `fetch_size` passed in request overrides this value.
`opensearch.sql.cursor.keep_alive` | 1 minute | This value configures how long the cursor context is kept open. Cursor contexts are resource heavy, so we recommend a low value.
