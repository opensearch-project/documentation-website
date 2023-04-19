---
layout: default
title: Configuring OpenSearch Benchmark
nav_order: 7
parent: OpenSearch Benchmark
---

<!--
Testing out tabs for code blocks to identify example outputs and file names.
To use, invoke class="codeblock-label"
-->

<style>
.codeblock-label {
    display: inline-block;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    font-family: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    font-size: .75rem;
    --bg-opacity: 1;
    background-color: #e1e7ef;
    background-color: rgba(224.70600000000002,231.07080000000002,239.394,var(--bg-opacity));
    padding: 0.25rem 0.75rem;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    --border-opacity: 1;
    border-color: #ccd6e0;
    border-color: rgba(204,213.85999999999999,224.39999999999998,var(--border-opacity));
    margin-bottom: 0;
}
</style>

# Configuring OpenSearch Benchmark

OpenSearch Benchmark configuration data is stored in `~/.benchmark/benchmark.ini` for manual installations, and in `/opensearch-benchmark/.benchmark/benchmark.ini` for the Docker distribution.

<p class="codeblock-label">Example benchmark.ini</p>
```
[meta]
config.version = 17

[system]
env.name = local

[node]
root.dir = /Users/jeffhuss/.benchmark/benchmarks
src.root.dir = /Users/jeffhuss/.benchmark/benchmarks/src

[source]
remote.repo.url = https://github.com/opensearch-project/OpenSearch.git
opensearch.src.subdir = opensearch

[benchmarks]
local.dataset.cache = /Users/jeffhuss/.benchmark/benchmarks/data

[results_publishing]
datastore.type = in-memory
datastore.host =
datastore.port =
datastore.secure = False
datastore.user =
datastore.password =


[workloads]
default.url = https://github.com/opensearch-project/opensearch-benchmark-workloads

[provision_configs]
default.dir = default-provision-config

[defaults]
preserve_benchmark_candidate = false

[distributions]
release.cache = true
```