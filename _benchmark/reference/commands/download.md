---
layout: default
title: download
nav_order: 60
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/commands/download/
---

# download

Use the `download` command to select which OpenSearch distribution version to download.  

## Usage

The following example downloads OpenSearch version 2.7.0:

```
opensearch-benchmark download --distribution-version=2.7.0 
```
 
Benchmark then returns the location of the OpenSearch artifact:

```
{
  "opensearch": "/Users/.benchmark/benchmarks/distributions/opensearch-2.7.0.tar.gz" 
}
```

## Options
 
Use the following options to customize how OpenSearch Benchmark downloads OpenSearch:

- `--provision-config-repository`: Defines the repository from which OpenSearch Benchmark loads `provision-configs` and `provision-config-instances`. 
- `--provision-config-revision`: Defines a specific Git revision in the `provision-config` that OpenSearch Benchmark should use. 
- `--provision-config-path`: Defines the path to the `--provision-config-instance` and any OpenSearch plugin configurations to use. 
- `--distribution-version`: Downloads the specified OpenSearch distribution based on version number. For a list of released OpenSearch versions, see [Version history](https://opensearch.org/docs/version-history/). 
- `--distribution-repository`: Defines the repository from where the OpenSearch distribution should be downloaded. Default is `release`.
- `--provision-config-instance`: Defines the `--provision-config-instance` to use. You can view possible configuration instances using the command `opensearch-benchmark list provision-config-instances`.  
- `--provision-config-instance-params`: A comma-separated list of key-value pairs injected verbatim as variables for the `provision-config-instance`.
- `--target-os`: The target operating system (OS) for which the OpenSearch artifact should be downloaded. Default is the current OS.
- `--target-arch`: The name of the CPU architecture for which an artifact should be downloaded. 
