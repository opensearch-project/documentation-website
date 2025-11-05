---
layout: default
title: Script and resource settings
parent: Configuring OpenSearch
nav_order: 125
---

# Script and resource settings

OpenSearch provides settings for managing script compilation behavior and resource file monitoring. These settings help control script performance, security, and automatic reloading of configuration files and other resources.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Resource reload settings

Resource reload settings control the monitoring and automatic reloading of configuration files, security certificates, and other resources that OpenSearch needs to watch for changes.

OpenSearch supports the following static resource reload settings:

- `resource.reload.enabled` (Static, Boolean): Enables or disables the resource watcher service. When enabled, OpenSearch monitors registered resources for changes and reloads them periodically. This is useful for automatically detecting changes to configuration files, security certificates, and other resources without requiring a cluster restart. Default is `true`.

- `resource.reload.interval.low` (Static, time unit): Sets the reload interval for low-frequency resource monitoring. Resources registered with low frequency are checked for changes at this interval. This is typically used for resources that change infrequently, such as configuration files. Default is `60s` (60 seconds).

- `resource.reload.interval.medium` (Static, time unit): Sets the reload interval for medium-frequency resource monitoring. Resources registered with medium frequency are checked for changes at this interval. This provides a balance between responsiveness and system load for moderately changing resources. Default is `30s` (30 seconds).

- `resource.reload.interval.high` (Static, time unit): Sets the reload interval for high-frequency resource monitoring operations. This setting controls how often OpenSearch checks for changes to resources that require frequent monitoring, such as configuration files or security certificates. More frequent checks provide faster response to changes but consume more system resources. This setting is used by the resource watcher service for high-priority resources. Default is `5s`.

## Script compilation settings

Script compilation settings control how OpenSearch compiles and caches scripts for search queries, aggregations, and other operations.

OpenSearch supports the following static script compilation settings:

- `script.disable_max_compilations_rate` (Static, Boolean): Disables the maximum script compilation rate limiting. When enabled (`true`), OpenSearch removes the limit on how many scripts can be compiled per time period, allowing unlimited script compilation. This can improve performance for script-heavy workloads but may increase resource usage. When disabled (`false`, default), OpenSearch enforces compilation rate limits to prevent excessive resource consumption. Default is `false`.

## Script context settings

Script context settings provide fine-grained control over script caching and compilation behavior for specific script contexts (search, ingest, and field operations). These settings allow independent tuning of performance characteristics for different types of script usage.

OpenSearch supports the following dynamic script context settings:

**Search context settings**:

- `script.context.search.cache_max_size` (Dynamic, integer): Sets the maximum number of compiled scripts to cache for search operations. Search scripts are used in queries, aggregations, and sorting operations. A larger cache reduces compilation overhead for frequently used scripts but consumes more memory. Default is `200`.

- `script.context.search.cache_expire` (Dynamic, time unit): Sets the cache expiration time for compiled search scripts. After this time period, cached scripts are removed and must be recompiled on next use. Setting to `0ms` disables expiration (scripts remain cached indefinitely). Default is `0ms` (no expiration).

- `script.context.search.max_compilations_rate` (Dynamic, rate): Sets the maximum rate at which search scripts can be compiled to prevent resource exhaustion. Format is `number/time_unit` (e.g., `75/5m` for 75 compilations per 5 minutes). Setting to `unlimited` removes all compilation rate limits. Default is `unlimited`.

**Ingest context settings**:

- `script.context.ingest.cache_max_size` (Dynamic, integer): Sets the maximum number of compiled scripts to cache for ingest operations. Ingest scripts are used in ingest pipelines for document transformation and processing. A larger cache improves pipeline performance for repeated document processing patterns. Default is `200`.

- `script.context.ingest.cache_expire` (Dynamic, time unit): Sets the cache expiration time for compiled ingest scripts. Controls how long ingest pipeline scripts remain cached before requiring recompilation. Setting to `0ms` disables expiration. Default is `0ms` (no expiration).

- `script.context.ingest.max_compilations_rate` (Dynamic, rate): Sets the maximum rate at which ingest scripts can be compiled. This prevents excessive compilation during high-volume ingest operations that could impact cluster performance. Format is `number/time_unit`. Default is `unlimited`.

**Field context settings**:

- `script.context.field.cache_max_size` (Dynamic, integer): Sets the maximum number of compiled scripts to cache for field operations. Field scripts are used for runtime fields, script fields, and field-level transformations. A larger cache benefits workloads with many computed fields. Default is `100`.

- `script.context.field.cache_expire` (Dynamic, time unit): Sets the cache expiration time for compiled field scripts. Controls how long field computation scripts remain cached before expiration. Setting to `0ms` disables expiration. Default is `0ms` (no expiration).

- `script.context.field.max_compilations_rate` (Dynamic, rate): Sets the maximum rate at which field scripts can be compiled. This prevents compilation bottlenecks during operations involving many computed fields. Format is `number/time_unit`. Default is `75/5m` (75 compilations per 5 minutes).