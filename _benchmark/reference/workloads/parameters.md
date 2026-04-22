---
layout: default
title: Workload parameters
nav_order: 15
parent: Workload reference
grand_parent: Reference
---

# Workload parameters

Workload parameters let you customize a workload's behavior without editing the workload files directly. You can control settings like bulk size, number of shards, index name, and search configuration by passing parameters at runtime.

## How parameters work

OpenSearch Benchmark workloads use [Jinja2](https://jinja.palletsprojects.com/) templates. When you pass parameters via the `--workload-params` flag, Benchmark injects them into the workload's JSON files before execution.

For example, a workload's `index.json` might contain:

```json
{
  "settings": {
    "index.number_of_shards": {% raw %}{{ number_of_shards | default(1) }}{% endraw %},
    "index.number_of_replicas": {% raw %}{{ number_of_replicas | default(0) }}{% endraw %}
  }
}
```

When you run a benchmark with `--workload-params='{"number_of_shards": 3}'`, Benchmark replaces `{% raw %}{{ number_of_shards | default(1) }}{% endraw %}` with `3`. Parameters you don't override use their default values.

## Passing parameters

You can pass parameters in three ways:

### JSON file (recommended for many parameters)

Create a JSON file with your parameters:

```json
{
  "number_of_shards": 3,
  "number_of_replicas": 1,
  "bulk_size": 5000,
  "target_index_name": "my_index"
}
```

Then reference it:

```bash
opensearch-benchmark run --workload=geonames --workload-params=my-params.json
```

### Inline JSON

Pass parameters directly on the command line:

```bash
opensearch-benchmark run --workload=geonames --workload-params='{"number_of_shards": 3, "bulk_size": 5000}'
```

### Comma-separated key-value pairs

For simple values:

```bash
opensearch-benchmark run --workload=geonames --workload-params="number_of_shards:3,bulk_size:5000"
```

{: .note}
The comma-separated format only supports string values. Use JSON file or inline JSON for numbers, booleans, or nested objects.

## Parameter precedence

When the same parameter is defined in multiple places, OpenSearch Benchmark applies them in the following order (highest priority first):

1. **`--workload-params`** (CLI flag) --- overrides everything
2. **Workload defaults** --- `{% raw %}{{ var | default(value) }}{% endraw %}` in the workload files
3. **Undefined** --- if no default is set and the parameter isn't provided, Benchmark raises a template rendering error

## Template syntax

Workload files use Jinja2 template syntax. The most common patterns are:

### Variable with a default value

```
{% raw %}{{ bulk_size | default(5000) }}{% endraw %}
```

If `bulk_size` is not provided via `--workload-params`, it renders as `5000`.

### Boolean values

Use the `tojson` filter for booleans to ensure correct JSON output:

```
{% raw %}{{ query_cache_enabled | default(false) | tojson }}{% endraw %}
```

This renders as `false` (without quotes), not `"false"`.

### String values

Wrap string variables in quotes:

```
{% raw %}"{{ conflicts | default('random') }}"{% endraw %}
```

### Conditional sections

Use `{% raw %}{% if %}{% endraw %}` blocks to include or exclude sections based on whether a parameter is defined or its value.

#### Including a field only when defined

```json
{% raw %}{% if target_throughput is defined %}
"target-throughput": {{ target_throughput }},
{% endif %}{% endraw %}
```

If `target_throughput` is not passed via `--workload-params`, the entire block is omitted from the rendered output.

#### If/else for alternative values

Use `{% raw %}{% else %}{% endraw %}` to provide a fallback:

```json
{% raw %}{% if use_zstd %}
"source-file": "documents.json.zst",
{% else %}
"source-file": "documents.json.bz2",
{% endif %}{% endraw %}
```

Running with `--workload-params='{"use_zstd": true}'` selects the zstd file; otherwise, it defaults to bz2.

#### Conditionally adding index fields

This pattern is common in the vectorsearch workload for optional fields:

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

The `{% raw %}{%- endif %}{% endraw %}` (with the dash) strips trailing whitespace, keeping the JSON output clean.

#### Version-based conditionals

Some workloads adapt their behavior based on `distribution_version`, which OpenSearch Benchmark sets automatically based on the target cluster:

```json
{% raw %}{% if distribution_version is not defined %}
  {% set distribution_version = "2.11.0" %}
{% endif %}

{% if distribution_version.split('.') | map('int') | list >= "2.19.1".split('.') | map('int') | list %}
  {# Include features available in 2.19.1+ #}
{% endif %}{% endraw %}
```

This pattern lets a single workload support multiple OpenSearch versions by conditionally including version-specific operations or settings.

#### For loops

Use `{% raw %}{% for %}{% endraw %}` to generate repeated structures:

```json
{% raw %}{% for i in range(1, 101) %}
{
  "name": "query-{{ i }}",
  "operation-type": "search",
  "body": { ... }
},
{% endfor %}{% endraw %}
```

### Integer conversion

Use the `int` filter when a parameter must be an integer:

```
{% raw %}{{ target_index_dimension | default(768) | int }}{% endraw %}
```

### Including external files

Workloads are typically split across multiple files for readability. The `{% raw %}{{ benchmark.collect }}{% endraw %}` helper inlines content from other JSON files at render time.

#### Importing the helper

Every `workload.json` that uses `benchmark.collect` must import it at the top of the file:

```
{% raw %}{% import "benchmark.helpers" as benchmark with context %}{% endraw %}
```

The `with context` clause ensures that all workload parameters are available inside the included files.

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

The `parts` argument accepts glob patterns. `operations/*.json` collects all JSON files in the `operations/` directory and inlines their content, separated by commas. This keeps the main `workload.json` short while the actual operation and test procedure definitions live in their own files.

#### Composing schedules from shared parts

Test procedures can reuse common schedule fragments. For example, the vectorsearch workload has shared schedules under `test_procedures/common/`:

```
test_procedures/
  common/
    index-only-schedule.json
    search-only-schedule.json
    force-merge-schedule.json
    vespa-search-only-schedule.json
  default.json
```

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

Each collected file contains one or more schedule entries. Parameters like `{% raw %}{{ target_index_name }}{% endraw %}` inside those files resolve from the same `--workload-params` you pass on the command line, because the `with context` import propagates all parameters into included files.

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

The `index.json` file is a Jinja2 template like any other workload file, so it can use parameters:

```json
{
  "settings": {
    "index.number_of_shards": {% raw %}{{ number_of_shards | default(1) }}{% endraw %}
  },
  "mappings": { ... }
}
```

## Discovering available parameters

To see which parameters a workload supports, use the `info` command:

```bash
opensearch-benchmark info --workload=geonames
```

This lists the workload's test procedures and their configurable parameters with default values.

You can also inspect the workload source directly. Parameters appear as `{% raw %}{{ variable_name | default(value) }}{% endraw %}` in the workload's JSON files. The main files to check are:

- `workload.json` --- top-level workload definition
- `index.json` --- index settings and mappings
- `test_procedures/default.json` --- test procedure schedules
- `_operations/default.json` --- operation definitions

## Common parameters

The following parameters are supported by most official workloads:

| Parameter | Description | Typical default |
|-----------|-------------|-----------------|
| `number_of_shards` | Primary shard count for created indices | `1` |
| `number_of_replicas` | Replica count for created indices | `0` |
| `bulk_size` | Number of documents per bulk request | `5000` or `10000` |
| `bulk_indexing_clients` | Number of concurrent bulk indexing clients | `8` |
| `ingest_percentage` | Percentage of the document corpus to ingest | `100` |
| `target_throughput` | Target operations per second per client | Unthrottled |
| `search_clients` | Number of concurrent search clients | `1` |
| `cluster_health` | Required cluster health before proceeding | `green` |
| `source_enabled` | Whether to store `_source` field | `true` |

## Vectorsearch workload parameters

The `vectorsearch` workload supports additional parameters for vector search benchmarking:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `target_index_name` | Name of the vector index | `target_index` |
| `target_field_name` | Name of the vector field | `target_field` |
| `target_index_dimension` | Vector dimensions | `768` |
| `target_index_space_type` | Distance metric (`l2`, `innerproduct`, `cosinesimil`) | varies |
| `target_index_body` | Path to index settings file | `indices/faiss-index.json` |
| `target_index_bulk_size` | Documents per bulk request | `500` |
| `target_index_bulk_index_data_set_format` | Corpus format (`hdf5`, `bigann`) | `hdf5` |
| `target_index_bulk_index_data_set_corpus` | Corpus name (e.g., `cohere-1m`) | varies |
| `target_index_bulk_indexing_clients` | Concurrent indexing clients | `10` |
| `target_index_max_num_segments` | Segments after force-merge | `1` |
| `hnsw_ef_construction` | HNSW graph build-time exploration factor | `256` |
| `hnsw_ef_search` | HNSW search-time exploration factor | `256` |
| `query_k` | Number of nearest neighbors to retrieve | `100` |
| `query_count` | Number of queries to run (`-1` for all) | `-1` |
| `query_data_set_format` | Query vector format | `hdf5` |
| `query_data_set_corpus` | Query vector corpus name | varies |
| `search_clients` | Concurrent search clients | `1` |
| `neighbors_data_set_corpus` | Ground truth neighbors corpus for recall | varies |
| `neighbors_data_set_format` | Neighbors dataset format | `hdf5` |

### Example vectorsearch params file

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

Save this as `params.json` and run:

```bash
opensearch-benchmark run \
  --pipeline=benchmark-only \
  --workload-path=/path/to/vectorsearch \
  --workload-params=params.json \
  --target-hosts=localhost:9200
```
