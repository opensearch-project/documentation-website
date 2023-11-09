---
layout: default
title: Search settings
parent: Configuring OpenSearch
nav_order: 80
---

# Search settings

OpenSearch supports the following search settings:

- `search.max_buckets` (Dynamic, integer): The maximum number of aggregation buckets allowed in a single response. Default is `65535`. 

- `search.phase_took_enabled` (Dynamic, Boolean): Enables returning phase-level `took` time values in search responses. Default is `false`. 

- `search.allow_expensive_queries` (Dynamic, Boolean): Allows or disallows expensive queries. For more information, see [Expensive queries]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries).

- `search.cancel_after_time_interval` (Dynamic, Time unit): A cluster-level setting that specifies the maximum amount of time that a search request can run before it is canceled at the shard level. If the `timeout` is specified in the search request, it takes precedence over this setting. Default is `-1`.

- `search.default_allow_partial_results` (Dynamic, Boolean):  A cluster-level setting that allows returning partial search results if a request times out or a shard fails. If a search request contains an `allow_partial_search_results` parameter, the parameter takes precedence over this setting. Default is `true`. 

- `search.default_keep_alive` (Dynamic, Time unit): Specifies the default keep alive value. Default is `5m`.

- `search.default_search_timeout` (Dynamic, Time unit): A cluster-level setting that sets the default timeout for all search requests at the coordinating node level. If the `timeout` is specified in the search request, it takes precedence over this setting. Default is `-1` (no timeout).

- `search.highlight.term_vector_multi_value` (Static, Boolean): Specifies to highlight snippets across values of a multi-valued field. Default is `true`.

- `search.keep_alive_interval` (Static, Time unit): Determines the interval at which the coordinating node sends a keep alive request to a shard or data node. Default is `1m`.

- `search.low_level_cancellation` (Dynamic, Boolean): Enables low-level request cancellation. Default is `true`.

- `search.max_keep_alive` (Dynamic, Time unit): Specifies the maximum keep alive value. Default is `24h`.

- `search.max_open_scroll_context` (Dynamic, Integer): A node-level setting that specifies the maximum number of open scroll contexts for the node. Default is `500`.

- `search.request_stats_enabled` (Dynamic, Boolean): Specifies whether search request statistics is enabled. Default is `false`.

## Point in Time settings

For information about Point in Time (PIT) settings, see [PIT settings]({{site.url}}{{site.baseurl}}/search-plugins/point-in-time-api/#pit-settings).
