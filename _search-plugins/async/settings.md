---
layout: default
title: Settings
parent: Asynchronous search
nav_order: 4
canonical_url: https://docs.opensearch.org/latest/search-plugins/async/settings/
---

# Settings

The asynchronous search plugin adds several settings to the standard OpenSearch cluster settings. They are dynamic, so you can change the default behavior of the plugin without restarting your cluster. You can mark the settings as `persistent` or `transient`.

For example, to update the retention period of the result index:

```json
PUT _cluster/settings
{
  "transient": {
    "opensearch.asynchronous_search.max_wait_for_completion_timeout": "5m"
  }
}
```

Setting | Default | Description
:--- | :--- | :---
`opensearch.asynchronous_search.max_search_running_time` | 12 hours | The maximum running time for the search beyond which the search is terminated.
`opensearch.asynchronous_search.node_concurrent_running_searches` | 20 | The concurrent searches running per coordinator node.
`opensearch.asynchronous_search.max_keep_alive` | 5 days | The maximum amount of time that search results can be stored in the cluster.
`opensearch.asynchronous_search.max_wait_for_completion_timeout` | 1 minute | The maximum value for the `wait_for_completion_timeout` parameter.
`opensearch.asynchronous_search.persist_search_failures` | false | Persist asynchronous search results that end with a search failure in the system index.
