---
layout: default
title: Configuring OpenSearch Benchmark
nav_order: 7
has_children: false
---

OpenSearch Benchmark configuration data is stored in `~/.benchmark/benchmark.ini` which is automatically created the first time OpenSearch Benchmark runs. 

The file is separated into the following sections that you can customize based on the needs of your cluster.

## meta

This section contains meta information about the configuration file.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `config.version` | Integer |  The version of the configuration file format. This property is managed by OpenSearch Benchmark and should not be changed. |

## system

This section contains global information for the current benchmark environment. This information should be identical on all machines where OpenSearch Benchmark is installed.

| Parameter | Type | Description |
| :---- | :---- | :---- |
| `env.name` | String | The name of the benchmark environment used a meta-data in metrics documents when an OpenSearch metrics store is configured.  Only alphanumeric characters are allowed. Default is `local`. |
| `available.cores` | Integer | Determines the number of available CPU cores. OpenSearch Benchmark aims to create one asyncio event loop per core and distributes to clients evenly across event loops. Defaults to the number of logical CPU cores for your cluster. |
| `async.debug` | Boolean | 