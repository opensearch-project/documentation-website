---
layout: default
title: Settings
parent: Piped processing language
nav_order: 3
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/settings/
---

# Settings

The PPL plugin adds a few settings to the standard OpenSearch cluster settings. Most are dynamic, so you can change the default behavior of the plugin without restarting your cluster.

You can update these settings like any other cluster setting:

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

Similarly, you can also update the settings by sending request to the plugin setting endpoint `_plugins/_query/settings` :
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

Requests to `_plugins/_ppl` include index names in the request body, so they have the same access policy considerations as the `bulk`, `mget`, and `msearch` operations. If you set the `rest.action.multi.allow_explicit_index` parameter to `false`, the PPL plugin is disabled.

You can specify the settings shown in the following table:

Setting | Description | Default
:--- | :--- | :---
`plugins.ppl.enabled` | Change to `false` to disable the PPL component. | True
`plugins.query.memory_limit` | Set heap memory usage limit. If a query crosses this limit, it's terminated. | 85%
`plugins.query.size_limit` | Set the maximum number of results that you want to see. This impacts the accuracy of aggregation operations. For example, if you have 1000 documents in an index, by default, only 200 documents are extracted from the index for aggregation. | 200
