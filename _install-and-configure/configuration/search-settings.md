---
layout: default
title: Search settings
parent: Configuring OpenSearch
nav_order: 60
---

# Search settings

OpenSearch supports the following search settings:

- `search.max_buckets` (Dynamic, integer): The maximum number of aggregation buckets allowed in a single response. Default is `65536`. 

- `search.phase_took_enabled` (Dynamic, Boolean): Enables returning phase-level `took` time values in search responses. Default is `false`. 

- `search.allow_expensive_queries` (Dynamic, Boolean): Allows or disallows expensive queries. For more information, see [Expensive queries]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries).
