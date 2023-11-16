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

- `search.default_allow_partial_results` (Dynamic, Boolean):  A cluster-level setting that allows returning partial search results if a request times out or a shard fails. If a search request contains an `allow_partial_search_results` parameter, the parameter takes precedence over this setting. Default is `true`. 

- `search.cancel_after_time_interval` (Dynamic, time unit): A cluster-level setting that specifies the maximum amount of time that a search request can run before it is canceled at the shard level. After this time has been reached, a request is stopped and all associated tasks are canceled. Default is `-1`.

- `search.default_search_timeout` (Dynamic, time unit): A cluster-level setting that sets the default timeout for all search requests at the coordinating node level. If the `timeout` is specified in the search request, it takes precedence over this setting. Default is `-1` (no timeout).

- `search.default_keep_alive` (Dynamic, time unit): Specifies the default keep alive value for scroll and Point in Time (PIT) searches. Because a request may land on a shard multiple times (for example, during the query and fetch phases), OpenSearch opens a _request context_ that exists for the full duration of the request to ensure consistency of the shard state for each individual shard request. In a standard search, once the fetch phase completes, the request context is closed. For a scroll or a PIT search, OpenSearch keeps the request context open until explicitly closed (or until the keep alive time is reached). A background thread periodically checks all open scroll and PIT contexts and deletes the ones that have exceeded their keep alive timeout. The `search.keep_alive_interval` setting specifies how frequently the contexts are checked for expiration. The `search.default_keep_alive` setting is the default deadline for expiration. A scroll or PIT request can explicitly specify the keep alive, which takes precedence over this setting. Default is `5m`.

- `search.keep_alive_interval` (Static, time unit): Determines the interval at which OpenSearch checks for request contexts that have exceeded their keep alive limit. Default is `1m`.

- `search.max_keep_alive` (Dynamic, time unit): Specifies the maximum keep alive value. The `max_keep_alive` setting is used as a safety check against the other `keep_alive` settings (for example, `default_keep_alive`) and request-level keep alive settings (for scroll and PIT contexts). If a request exceeds the `max_keep_alive` value in either case, the operation will fail. Default is `24h`.

- `search.low_level_cancellation` (Dynamic, Boolean): Enables low-level request cancellation. Lucene's classic timeout mechanism only checks the time while collecting search results. However, an expensive query, such as wildcard or prefix, can take a long time to expand before starting to collect results. In this case, the query can run for a period of time that is greater than the timeout value. The low-level cancellation mechanism addresses this scenario by timing out not only while collecting search results but also during the query expansion phase or before performing any Lucene operation. Default is `true`.

- `search.max_open_scroll_context` (Dynamic, integer): A node-level setting that specifies the maximum number of open scroll contexts for the node. Default is `500`.

- `search.request_stats_enabled` (Dynamic, Boolean): Turns on node-level collection of phase-timing statistics from the perspective of the coordinator node. The request-level statistics keep track of how long (in total) search requests spend in each of the different search phases. You can retrieve these counters using the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/). Default is `false`.

- `search.highlight.term_vector_multi_value` (Static, Boolean): Specifies to highlight snippets across values of a multi-valued field. Default is `true`.

## Point in Time settings

For information about PIT settings, see [PIT settings]({{site.url}}{{site.baseurl}}/search-plugins/point-in-time-api/#pit-settings).

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).
