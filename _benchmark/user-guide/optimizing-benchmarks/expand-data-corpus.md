---
layout: default
title: Expand data corpus
nav_order: 20
parent: Optimizing benchmarks
grand_parent: User guide
---

# Expanding the data corpus of a workload

This tutorial shows you how to use the [`expand-data-corpus.py`](https://github.com/opensearch-project/opensearch-benchmark/blob/main/scripts/expand-data-corpus.py) script to increase the size of the data corpus for a OpenSearch Becnhmark workload. This can help assist in running the `https_logs` Benchmark with a larger scale, for instance, with clusters containing multiple data nodes.

Only the `http_logs` workload is currently supported.
{: .warning}

## Prerequisites

To use this tutorial, make sure you fulfill the following prerequsities:

1. Python 3.x or greater installed.
2. The `http_logs` workload data corpus already downloaded in your cluster.

## Understanding the script

The `expand-data-corpus.py` script is designed to generate a larger data corpus by duplicating and modifying existing documents from the `http_logs` workload. It primarily adjusts the timestamp field while keeping other fields intact. It also generates an offset file, which enables OpenSearch Benchmark to start up faster.

## Using `expand-data-corpus.py`

To use `expand-data-corpus.py`, use the following syntax:

```bash
./expand-data-corpus.py [options]
```

You can adjust the script with the following options.

- `--corpus-size`: The desired corpus size in GB
- `--output-file-suffix`: The suffix for the output file name.

## Example

This example generates a 100 GB corpus.

```bash
./expand-data-corpus.py --corpus-size 100 --output-file-suffix 100gb
```

The script will start generating documents. For a 100gb corpus, it can take up to 30 minutes to generate the full corpus.

You can generate multiple corpora by running the script multiple times with different output suffixes.

## Verifying the documents

After the script completes, check the following locations for new files:

- In the OSB data directory for `http_logs`:
   - `documents-100gb.json`: The generated corpus.
   - `documents-100gb.json.offset`: The offset file.

1. In the `http_logs` workload directory:
   - `gen-docs-100gb.json`: The metadata for the generated corpus.
   - `gen-idx-100gb.json`: The index specification for the generated corpus.

## Using the corpus in a test

To use the newly generated corpus in an OpenSearch Benchmark test, use the following syntax:

```bash
opensearch-benchmark execute-test --workload http_logs --workload-params=generated_corpus:t [other_options]
```

The `generated_corpus:t` parameter tells OSB to use the expanded corpus.

## Expert-level settings

Be cautious when using following expert options as they may affect the corpus structure:

- `-f`: Specifies the input file to use as a base for generating new documents.
- `-n`: Sets the number of documents to generate instead of the corpus size.
- `-i`: Defines the interval between consecutive timestamps.
- `-t`: Sets the starting timestamp for the generated documents.
- `-b`: Defines the number of documents per batch when writing to the offset file.

