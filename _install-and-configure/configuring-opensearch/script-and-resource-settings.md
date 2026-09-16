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

## Script size settings

OpenSearch supports the following dynamic script size setting:

- `script.max_size_in_bytes` (Dynamic, integer): Sets the maximum size, in bytes, of an individual script. OpenSearch rejects a longer script. Default is `65535`.

Lower `script.max_size_in_bytes` only after deleting any stored script that exceeds the new value. OpenSearch accepts the setting but then fails to apply it, and the node stops applying further cluster state updates until the setting is removed.
{: .warning}

## Script compilation settings

OpenSearch compiles a script on first use and caches the compiled result, so a script is recompiled only when its definition changes. A compilation rate limit caps how many new compilations a node performs in a time window, which prevents a high number of unique scripts from consuming a node's CPU on compilation. For an explanation of how the cache and the rate limit apply to a workload, see [Compilation limits and caching]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#compilation-limits-and-caching).

The value of `script.max_compilations_rate` determines whether the cache and the rate limit are tracked separately for each script context or shared across the cluster. OpenSearch supports the following script compilation settings:

- `script.max_compilations_rate` (Dynamic, string): Set to `use-context` to give each script context its own cache and compilation rate, configured through the [script context settings](#script-context-settings). Set it to a rate in the form `<count>/<time>`, such as `150/5m`, to use a single cluster-wide limit and one shared cache instead, in which case the per-context settings are rejected. Default is `use-context`.

- `script.cache.max_size` (Static, integer): Sets the number of compiled scripts held in the shared cache on each node. When the cache is full, the least recently used script is evicted. Configuring this setting explicitly also changes the default of `script.context.<context>.cache_max_size` to the same value. Default is `100`.

- `script.cache.expire` (Static, time unit): Sets the time after which a compiled script is evicted from the shared cache and must be recompiled on next use. Configuring this setting explicitly also changes the default of `script.context.<context>.cache_expire` to the same value. Default is `0ms`, which means that cached scripts do not expire on a timer.

- `script.disable_max_compilations_rate` (Static, Boolean): Removes the compilation rate limit entirely when set to `true`. This setting conflicts with both an explicit `script.max_compilations_rate` and any per-context rate, so remove those before setting it. Default is `false`.

`script.max_compilations_rate`, `script.cache.max_size`, and `script.cache.expire` are deprecated, because they exist to support the single shared cache. Leave `script.max_compilations_rate` at `use-context` and configure the per-context settings, which are dynamic and take effect without a restart.
{: .note}

A cluster with no compilation limit lets any client that can submit a script consume unbounded compilation CPU. Parameterize the scripts that trip the limit rather than turning the limit off. For more information, see [Passing values as parameters]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#passing-values-as-parameters).
{: .warning}

## Script context settings

Script context settings control caching and compilation for an individual script context, so that heavy recompilation in one context does not evict the cached scripts of another. They apply only when `script.max_compilations_rate` is set to `use-context`. Replace `<context>` with a context name returned by the [Get Script Contexts API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-contexts/).

OpenSearch supports the following dynamic script context settings:

- `script.context.<context>.cache_max_size` (Dynamic, integer): Sets the number of compiled scripts held for this context. A larger cache reduces compilation overhead for a workload that uses many distinct scripts and consumes more memory. Default is `100` for most contexts, or the value of `script.cache.max_size` when that setting is configured explicitly.

- `script.context.<context>.cache_expire` (Dynamic, time unit): Sets the time after which a compiled script for this context is evicted from the cache and must be recompiled on next use. Default is `0ms`, which means that cached scripts do not expire on a timer, or the value of `script.cache.expire` when that setting is configured explicitly.

- `script.context.<context>.max_compilations_rate` (Dynamic, string): Sets the number of compilations allowed for this context in a time window, in the form `<count>/<time>`, such as `200/1m`. Set it to `unlimited` to remove the limit for this context. When the rate is exceeded, OpenSearch returns a `circuit_breaking_exception` with a "Too many dynamic script compilations" message. Default is `75/5m` for most contexts.

Three contexts have different defaults. The following table lists them.

Context | Purpose | `cache_max_size` | `max_compilations_rate`
:--- | :--- | :--- | :---
`search` | The [`script` search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/script-processor/). | `200` | `unlimited`
`ingest` | The [`script` ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/script/). | `200` | `unlimited`
`processor_conditional` | The `if` condition on an ingest processor. | `200` | `unlimited`

Configuring any per-context setting while `script.max_compilations_rate` is set to an explicit rate fails with `Context cache settings [<settings>] requires [script.max_compilations_rate] to be [use-context]`.
{: .note}

For the settings that limit which scripts a cluster accepts and how regular expressions in Painless are constrained, see [Script security]({{site.url}}{{site.baseurl}}/scripting/script-security/).