---
layout: default
title: Remote index build
nav_order: 72
has_children: false
---

# Building vector indexes remotely using GPUs
Introduced 3.0 
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/k-NN/issues/2391).    
{: .warning}

Starting with version 3.0, OpenSearch supports building vector indexes using GPUs with a remote index build service. Using GPUs dramatically reduces index build times and decreases costs. For benchmarking results, see [this blog post](https://opensearch.org/blog/GPU-Accelerated-Vector-Search-OpenSearch-New-Frontier/).

## Prerequisites

Before configuring the remote index build settings, ensure you fulfill the following prerequisites. For more information about updating dynamic settings, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

### Step 1: Enable remote index build

Enable remote index build for both for the cluster and the chosen index by configuring the following settings. 

Setting | Static/Dynamic | Default | Description
:--- | :--- | :--- | :---
`knn.feature.remote_index_build.enabled` | Dynamic | `false` | Enables remote vector index building for the cluster. 
`index.knn.remote_index_build.enabled` | Dynamic | `false` | Enables remote index building for the index. Currently, the remote index build service supports [Faiss]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#faiss-engine) indexes with the `hnsw` method and the default 32-bit floating-point (`FP32`) vectors. 

### Step 2: Create and register the remote vector repository

The remote vector repository acts as an intermediate object store between the OpenSearch cluster and the remote build service. The cluster uploads vectors and doc IDs to this repository. The remote build service then downloads these and eventually uploads a completed index build in response. To create and register the repository, follow the steps in [Register repository]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#register-repository). Then set the `knn.remote_index_build.vector_repo` dynamic setting to the name of this registered repository.

The remote build service currently only supports Amazon S3 repositories.
{: .note}

### Step 3: Set up a remote vector index builder

Configure the remote endpoint in k-NN settings by setting `knn.remote_index_build.client.endpoint` to a running [remote vector index builder](https://github.com/opensearch-project/remote-vector-index-builder) instance. For instructions to set up the remote service, see [the user guide](https://github.com/opensearch-project/remote-vector-index-builder/blob/main/USER_GUIDE.md).

## Configuring remote index build settings

Remote index build supports several additional optional settings. For information about configuring any remaining remote index build settings, see [Remote index build settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#remote-index-build-settings).

## Using remote index build

Once remote index build is configured, any index with it enabled will use the remote vector index builder for builds that meet the configured `index.knn.remote_index_build.size_threshold`.