---
layout: default
title: Workload parameters
nav_order: 150
parent: Workload reference
grand_parent: Reference
---

# Workload parameters

Workload parameters let you customize workload behavior without editing the workload files directly. You can control settings such as bulk size, number of shards, index name, and search configuration by passing parameters at runtime.

OpenSearch Benchmark workloads use [Jinja2](https://jinja.palletsprojects.com/) templates. When you pass parameters using the `--workload-params` flag, OpenSearch Benchmark injects them into the workload JSON files before execution.

For example, a workload's `index.json` might contain the following settings:

```json
{
  "settings": {
    "index.number_of_shards": {% raw %}{{ number_of_shards | default(1) }}{% endraw %},
    "index.number_of_replicas": {% raw %}{{ number_of_replicas | default(0) }}{% endraw %}
  }
}
```

When you run a benchmark with `--workload-params='{"number_of_shards": 3}'`, OpenSearch Benchmark replaces `{% raw %}{{ number_of_shards | default(1) }}{% endraw %}` with `3`. Parameters you don't override use their default values.

## Passing parameters

You can pass parameters in the following ways.

### JSON file (recommended for many parameters)

Create a JSON file containing your parameters:

```json
{
  "number_of_shards": 3,
  "number_of_replicas": 1,
  "bulk_size": 5000,
  "target_index_name": "my_index"
}
```
{% include copy.html %}

Then reference it as follows:

```bash
opensearch-benchmark run --workload=geonames --workload-params=my-params.json
```
{% include copy.html %}

### Inline JSON

Pass parameters directly on the command line:

```bash
opensearch-benchmark run --workload=geonames --workload-params='{"number_of_shards": 3, "bulk_size": 5000}'
```
{% include copy.html %}

### Comma-separated key-value pairs

Use the following format to pass key-value pairs:

```bash
opensearch-benchmark run --workload=geonames --workload-params="number_of_shards:3,bulk_size:5000"
```
{% include copy.html %}

The comma-separated format only supports string values. Use JSON file or inline JSON for numbers, Boolean values, or nested objects.
{: .note}

## Parameter precedence

When the same parameter is defined in multiple sources, OpenSearch Benchmark applies them in the following order (highest priority first):

1. **`--workload-params`** (CLI flag): Overrides all other values.
1. **Workload template defaults**: Default values specified in `{% raw %}{{ var | default(value) }}{% endraw %}` expressions in the workload JSON files (for example, `{% raw %}{{ number_of_shards | default(1) }}{% endraw %}`).
1. **Undefined**: If no default is specified and the parameter is not provided, OpenSearch Benchmark raises a template rendering error.

## Template syntax

This section describes the most common template patterns used in workload files.

### Variable with a default value

Use the `default` filter to specify a fallback value when a parameter is not provided. For example, if `bulk_size` is not provided in `--workload-params`, the expression evaluates to `5000`:

```json
{% raw %}{{ bulk_size | default(5000) }}{% endraw %}
```
{% include copy.html %}

### Boolean values

Use the `tojson` filter for Boolean values to ensure correct JSON output. For example, the following expression evaluates to `false` (without quotation marks), not `"false"`:

```json
{% raw %}{{ query_cache_enabled | default(false) | tojson }}{% endraw %}
```
{% include copy.html %}

### String values

Wrap string variables in quotation marks:

```json
{% raw %}"{{ conflicts | default('random') }}"{% endraw %}
```
{% include copy.html %}

### Conditional sections

Use `{% raw %}{% if %}{% endraw %}` blocks to include or exclude sections based on whether a parameter is defined or on the parameter value.

#### Including a field only when defined

The following template conditionally includes the `target-throughput` field. If `target_throughput` is not provided using `--workload-params`, the entire field is omitted from the rendered output:

```json
{% raw %}{% if target_throughput is defined %}
"target-throughput": {{ target_throughput }},
{% endif %}{% endraw %}
```
{% include copy.html %}

#### If/else for alternative values

Use `{% raw %}{% else %}{% endraw %}` to provide a fallback. For example, if `use_zstd` is set to `true` in `--workload-params`, the rendered output sets the `source-file` parameter to `documents.json.zst`. Otherwise, it sets the `source-file` to `documents.json.bz2`:

```json
{% raw %}{% if use_zstd %}
"source-file": "documents.json.zst",
{% else %}
"source-file": "documents.json.bz2",
{% endif %}{% endraw %}
```
{% include copy.html %}

#### Conditionally adding index fields

This pattern is commonly used to define optional fields in `vectorsearch` workload templates. The `{% raw %}{%- endif %}{% endraw %}` (with the dash) trims trailing whitespace and newline characters, preventing empty lines from appearing and avoiding invalid JSON formatting (such as trailing commas or misaligned structure):

```json
"properties": {
  {% raw %}{% if id_field_name is defined and id_field_name != "_id" %}
  "{{ id_field_name }}": {
    "type": "keyword"
  },
  {%- endif %}{% endraw %}
  "embedding": {
    "type": "knn_vector",
    "dimension": {% raw %}{{ target_index_dimension }}{% endraw %}
  }
}
```
{% include copy.html %}

#### Version-based conditionals

Some workloads adapt their behavior based on `distribution_version`, which OpenSearch Benchmark sets automatically according to the target cluster. This pattern allows a single workload to support multiple OpenSearch versions by conditionally including version-specific operations or settings:

```json
{% raw %}{% if distribution_version is not defined %}
  {% set distribution_version = "2.11.0" %}
{% endif %}

{% if distribution_version.split('.') | map('int') | list >= "2.19.1".split('.') | map('int') | list %}
  {# Include features available in 2.19.1+ #}
{% endif %}{% endraw %}
```
{% include copy.html %}

#### For loops

Use `{% raw %}{% for %}{% endraw %}` loops to generate repeated structures:

```json
{% raw %}{% for i in range(1, 101) %}
{
  "name": "query-{{ i }}",
  "operation-type": "search",
  "body": { ... }
},
{% endfor %}{% endraw %}
```
{% include copy.html %}

### Integer conversion

Use the `int` filter when a parameter must be an integer:

```json
{% raw %}{{ target_index_dimension | default(768) | int }}{% endraw %}
```
{% include copy.html %}

### Including external files

Workloads are typically organized into multiple files for readability. The `{% raw %}{{ benchmark.collect }}{% endraw %}` helper composes a single workload definition from multiple JSON files at render time.

#### Importing the helper

Every `workload.json` that uses `benchmark.collect` must import it at the top of the file:

```json
{% raw %}{% import "benchmark.helpers" as benchmark with context %}{% endraw %}
```
{% include copy.html %}

The `with context` clause ensures that all workload parameters are available in the included files.

#### Collecting operations and test procedures

A typical `workload.json` delegates its operations and test procedures to separate files:

```json
{% raw %}{% import "benchmark.helpers" as benchmark with context %}{% endraw %}
{
  "version": 2,
  "description": "My workload",
  "indices": [ ... ],
  "corpora": [ ... ],
  "operations": [
    {% raw %}{{ benchmark.collect(parts="operations/*.json") }}{% endraw %}
  ],
  "test_procedures": [
    {% raw %}{{ benchmark.collect(parts="test_procedures/*.json") }}{% endraw %}
  ]
}
```
{% include copy.html %}

The `parts` argument accepts glob patterns. The pattern `operations/*.json` matches all JSON files in the `operations/` directory and includes their contents, separated by commas. This keeps the main `workload.json` concise while the operation and test procedure definitions are defined in separate files.

#### Composing schedules from shared parts

Test procedures can reuse common schedule fragments. For example, the `vectorsearch` workload has shared schedules under `test_procedures/common/`:

```
test_procedures/
  common/
    index-only-schedule.json
    search-only-schedule.json
    force-merge-schedule.json
    vespa-search-only-schedule.json
  default.json
```
{% include copy.html %}

A test procedure in `default.json` composes its schedule from these parts:

```json
{
  "name": "no-train-test",
  "default": true,
  "schedule": [
    {% raw %}{{ benchmark.collect(parts="common/index-only-schedule.json") }}{% endraw %},
    {% raw %}{{ benchmark.collect(parts="common/force-merge-schedule.json") }}{% endraw %},
    {% raw %}{{ benchmark.collect(parts="common/search-only-schedule.json") }}{% endraw %}
  ]
}
```
{% include copy.html %}

Each collected file contains one or more schedule entries. Parameters such as `{% raw %}{{ target_index_name }}{% endraw %}` in those files are resolved from the same `--workload-params` passed on the command line because the `with context` import propagates all parameters to the included files.

#### Index body files

The `body` field in an index definition references a separate JSON file for mappings and settings:

```json
"indices": [
  {
    "name": "geonames",
    "body": "index.json"
  }
]
```
{% include copy.html %}

The `index.json` file is a Jinja2 template like any other workload file, so it can use parameters:

```json
{
  "settings": {
    "index.number_of_shards": {% raw %}{{ number_of_shards | default(1) }}{% endraw %}
  },
  "mappings": { ... }
}
```
{% include copy.html %}

## Discovering available parameters

To view the parameters supported by a workload, use the `info` command. This command lists the workload's test procedures along with their configurable parameters and default values:

```bash
opensearch-benchmark info --workload=geonames
```
{% include copy.html %}

You can also inspect the workload source directly. Parameters appear as `{% raw %}{{ variable_name | default(value) }}{% endraw %}` in workload JSON files. The main workload files are the following:

- `workload.json` -- The top-level workload definition.
- `index.json` -- The index settings and mappings.
- `test_procedures/default.json` -- The test procedure schedules.
- `_operations/default.json` -- The operation definitions.

## Common parameters

The following parameters are supported by most official workloads.

| Parameter | Description | Default |
|-----------|-------------|-----------------|
| `number_of_shards` | The primary shard count for created indexes. | `1` |
| `number_of_replicas` | The replica count for created indexes. | `0` |
| `bulk_size` | The number of documents per bulk request. | `5000` or `10000` |
| `bulk_indexing_clients` | The number of concurrent bulk indexing clients. | `8` |
| `ingest_percentage` | The percentage of the document corpus to ingest. | `100` |
| `target_throughput` | The target number of operations per second per client. | Unthrottled |
| `search_clients` | The number of concurrent search clients. | `1` |
| `cluster_health` | The required cluster health status before proceeding. | `green` |
| `source_enabled` | Whether to store the `_source` field. | `true` |

## Vector search workload parameters

The `vectorsearch` workload supports additional parameters for vector search benchmarking.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `target_index_name` | The vector index name. | `target_index` |
| `target_field_name` | The vector field name.| `target_field` |
| `target_index_dimension` | The number of vector dimensions. | `768` |
| `target_index_space_type` | The distance metric. Valid values are `l2`, `innerproduct`, and `cosinesimil`. | Varies |
| `target_index_body` | The path to index settings file. | `indices/faiss-index.json` |
| `target_index_bulk_size` | The number of documents per bulk request. | `500` |
| `target_index_bulk_index_data_set_format` | The corpus format. Valid values are `hdf5` and `bigann`. | `hdf5` |
| `target_index_bulk_index_data_set_corpus` | The corpus name (for example, `cohere-1m`). | Varies |
| `target_index_bulk_indexing_clients` | The number of concurrent indexing clients. | `10` |
| `target_index_max_num_segments` | The number of segments after force merge. | `1` |
| `hnsw_ef_construction` | The HNSW graph build-time exploration factor. | `256` |
| `hnsw_ef_search` | The HNSW search-time exploration factor. | `256` |
| `query_k` | The number of nearest neighbors to retrieve. | `100` |
| `query_count` | The number of queries to run. Use `-1` for all queries. | `-1` |
| `query_data_set_format` | The query vector format. Valid values are `hdf5` and `bigann`. | `hdf5` |
| `query_data_set_corpus` | The query vector corpus name. | Varies |
| `search_clients` | The number of concurrent search clients. | `1` |
| `neighbors_data_set_corpus` | The ground-truth neighbors corpus used for recall evaluation.| Varies |
| `neighbors_data_set_format` | The neighbors dataset format. | `hdf5` |

### Example vector search parameter file

The following example shows a complete parameter file for a `vectorsearch` workload:

```json
{
  "target_index_name": "vector_1m",
  "target_field_name": "embedding",
  "target_index_body": "indices/faiss-index.json",
  "target_index_primary_shards": 1,
  "target_index_replica_shards": 0,
  "target_index_dimension": 768,
  "target_index_space_type": "innerproduct",
  "target_index_bulk_size": 500,
  "target_index_bulk_index_data_set_format": "hdf5",
  "target_index_bulk_index_data_set_corpus": "cohere-1m",
  "target_index_bulk_indexing_clients": 10,
  "target_index_max_num_segments": 1,
  "hnsw_ef_construction": 200,
  "hnsw_ef_search": 256,
  "query_k": 100,
  "query_data_set_format": "hdf5",
  "query_data_set_corpus": "cohere-1m",
  "query_count": 10000,
  "search_clients": 1,
  "neighbors_data_set_corpus": "cohere-1m",
  "neighbors_data_set_format": "hdf5"
}
```
{% include copy.html %}

To use this parameter file, save it as `params.json` and run the benchmark with the `--workload-params` flag:

```bash
opensearch-benchmark run \
  --pipeline=benchmark-only \
  --workload-path=/path/to/vectorsearch \
  --workload-params=params.json \
  --target-hosts=localhost:9200
```
{% include copy.html %}