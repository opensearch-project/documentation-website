---
layout: default
title: Remote index build
nav_order: 72
has_children: false
---

# Building vector indexes remotely using GPUs
Introduced 3.0 
{: .label .label-purple }

OpenSearch supports building vector indexes using a GPU-accelerated remote index build service. Using GPUs dramatically reduces index build times and decreases costs. For benchmarking results, see [this blog post](https://opensearch.org/blog/GPU-Accelerated-Vector-Search-OpenSearch-New-Frontier/).

## Supported configurations

The remote index build service supports [Faiss]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#faiss-engine) indexes with the `hnsw` method and the default 32-bit floating-point (`FP32`) vectors.

As of OpenSearch 3.2, the `hnsw` method with [Faiss]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#faiss-engine) supports 16-bit floating-point (`FP16`), byte, and binary vectors.
With the `hnsw` method and the [Faiss]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#faiss-engine) engine, all compression levels (2×, 8×, 16×, 32×) are supported for remote indexes.


## Prerequisites

Before configuring the remote index build settings, ensure you fulfill the following prerequisites. For more information about updating dynamic settings, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

### Step 1: Enable the remote index build service

Enable the remote index build service for both the cluster and the chosen index by configuring the following settings. 

| Setting                                | Static/Dynamic | Default | Description                                           |
|:---------------------------------------|:---------------|:--------|:------------------------------------------------------|
| `knn.remote_index_build.enabled`       | Dynamic        | `false` | Enables remote vector index building for the cluster. |
| `index.knn.remote_index_build.enabled` | Dynamic        | `true`  | Enables remote index building for the index. Takes effect only if `knn.remote_index_build.enabled` is set to `true`.         |

The remote vector index builder for an index is enabled only when both the cluster-level `knn.remote_index_build.enabled` setting and the `index.knn.remote_index_build.enabled` index-level setting are set to `true`.
{: .note}

### Step 2: Create and register the remote vector repository

The remote vector repository acts as an intermediate object store between the OpenSearch cluster and the remote build service. The cluster uploads vectors and document IDs to the repository. The remote build service retrieves the data, builds the index externally, and uploads the completed result back to the repository.

To create and register the repository, follow the steps in [Register repository]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#register-repository). Then set the `knn.remote_index_build.repository` dynamic setting to the name of the registered repository.

The remote build service currently only supports Amazon Simple Storage Service (Amazon S3) repositories.
{: .note}

### Step 3: Set up a remote vector index builder

Configure the remote endpoint in the k-NN settings by setting `knn.remote_index_build.service.endpoint` to a running [remote vector index builder](https://github.com/opensearch-project/remote-vector-index-builder) instance. For instructions on setting up the remote service, see [the user guide](https://github.com/opensearch-project/remote-vector-index-builder/blob/main/USER_GUIDE.md).

## Configuring remote index build settings

The remote index build service supports several additional, optional settings. For information about configuring any remaining remote index build settings, see [Remote index build settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#remote-index-build-settings).

## Using the remote index build service

Once the remote index build service is configured, any segment flush and merge operations that meet the following requirements will transparently use the GPU build path:

- The index is using one of the [supported configurations](#supported-configurations).
- The segment size is greater than `index.knn.remote_index_build.size.min` and less than `knn.remote_index_build.size.max`.

You can monitor remote index build tasks by calling the k-NN Stats API and reviewing the [remote index build statistics]({{site.url}}{{site.baseurl}}/vector-search/api/knn/#remote-index-build-stats).
