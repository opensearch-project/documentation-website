---
layout: default
title: Ingest settings
parent: Configuring OpenSearch
nav_order: 115
---

# Ingest settings

OpenSearch provides ingest settings that control which ingest processors are allowed for data processing pipelines. These settings help maintain security and control over data transformation operations by restricting which processors can be used in ingest pipelines.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## GeoIP processor settings

GeoIP processor settings control which geographic IP processors are allowed in ingest pipelines.

OpenSearch supports the following static GeoIP processor settings:

- `ingest.geoip.processors.allowed` (Static, list): Specifies which GeoIP processors are allowed to be used in ingest pipelines. When this list is empty (default), no restriction is applied and all available GeoIP processors can be used. When configured with specific processor names, only those processors will be permitted in pipelines. This setting helps control which geographic IP enrichment processors can be used for security and compliance purposes. Default is `[]` (empty list - no restrictions).

## User Agent processor settings

User Agent processor settings control which user agent parsing processors are allowed in ingest pipelines.

OpenSearch supports the following static User Agent processor settings:

- `ingest.useragent.processors.allowed` (Static, list): Specifies which User Agent processors are allowed to be used in ingest pipelines. When this list is empty (default), no restriction is applied and all available User Agent processors can be used. When configured with specific processor names, only those processors will be permitted in pipelines. This setting helps control which user agent parsing processors can be used for security and data governance purposes. Default is `[]` (empty list - no restrictions).

## Common processor settings

Common processor settings control which standard ingest processors are allowed in ingest pipelines.

OpenSearch supports the following static common processor settings:

- `ingest.common.processors.allowed` (Static, list): Specifies which common ingest processors are allowed to be used in ingest pipelines. When this list is empty (default), no restriction is applied and all available common processors (such as `set`, `remove`, `rename`, `convert`, etc.) can be used. When configured with specific processor names, only those processors will be permitted in pipelines. This setting provides fine-grained control over data transformation capabilities for security and compliance requirements. Default is `[]` (empty list - no restrictions).

## Caching and performance settings

Caching and performance settings control cache sizes and execution limits for various ingest processors.

OpenSearch supports the following static caching and performance settings:

- `ingest.geoip.cache_size` (Static, long): Sets the cache size for GeoIP database lookups. This cache stores the results of GeoIP lookups to improve performance for repeated queries to the same IP addresses. Higher values improve cache hit rates and reduce database lookup overhead, but consume more memory. The cache stores mappings between IP addresses and their geographic information. Default is `1000`. Minimum is `0`.

- `ingest.user_agent.cache_size` (Static, long): Sets the cache size for User Agent string parsing results. This cache stores parsed user agent information to improve performance when processing documents with repeated user agent strings. Higher values reduce parsing overhead for common user agents but use more memory. The cache stores mappings between user agent strings and their parsed components (browser, OS, device information). Default is `1000`. Minimum is `0`.

- `ingest.grok.watchdog.interval` (Static, time unit): Sets the interval at which the Grok processor watchdog checks for long-running pattern matching operations. The watchdog helps prevent Grok processors from consuming excessive CPU time with complex or inefficient patterns. More frequent checks provide better protection against runaway operations but add slight overhead. Default is `1s`.

- `ingest.grok.watchdog.max_execution_time` (Static, time unit): Sets the maximum execution time allowed for Grok pattern matching operations before the watchdog interrupts them. This prevents poorly designed or malicious Grok patterns from causing excessive CPU usage or blocking ingest processing. Operations exceeding this limit are terminated to maintain cluster stability. Default is `1s`.
