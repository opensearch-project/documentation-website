---
layout: default
title: Remote index build
nav_order: 72
has_children: false
redirect_from:
  - /search-plugins/knn/remote-index-build/
---

# Building vector indexes remotely with GPUs
This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/k-NN/issues/2391).    
{: .warning}

As of version 3.0.0, OpenSearch supports the ability to build vector indexes using GPUs with a remote index build service. This new feature leverages the power of GPUs to dramatically reduce index build times and decrease cost. See the [GPU Accelerated Vector Search blog post](https://opensearch.org/blog/GPU-Accelerated-Vector-Search-OpenSearch-New-Frontier/) for more details.

## Getting started

Before configuring the remote index build settings, there are a couple prerequisite steps:

### Step 1: Enable remote index build

In order to use the remote build feature, it must be enabled both for the cluster and the chosen index:

Setting | Static/Dynamic | Default | Description
:--- | :--- | :--- | :---
`knn.feature.remote_index_build.enabled` | Dynamic | `false` | Feature flag that enables remote vector index building functionality for the cluster.
`index.knn.remote_index_build.enabled` | Dynamic | `false` | Whether remote index building is enabled for this index. Currently, the remote index build service supports Faiss indexes with method HNSW and data type `FP32`.

### Step 2: Create and register the remote vector repository

The remote vector repository will act as an intermediate object store between the OpenSearch cluster and the remote build service. The cluster will upload vectors and doc IDs to this repository. The remote build service will download these and eventually upload a completed index build in response. To create and register the repository, follow the [Register repository](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#register-repository) steps in the Snapshots documentation. Then, set  `knn.remote_index_build.vector_repo` to be the name of this registered repository.

The remote build service feature currently only supports Amazon S3 repositories.

### Step 3: Remote vector index builder setup

The remote endpoint configured in k-NN settings (`knn.remote_index_build.client.endpoint`) should point to a running [Remote Vector Index Builder](https://github.com/opensearch-project/remote-vector-index-builder) instance. Refer to the Remote Vector Index Builder `USER_GUIDE.md` for instructions to set up the remote service.

## Configuring settings

Refer to [Remote index build settings](https://opensearch.org/docs/latest/vector-search/settings/#remote-index-build-settings) to configure any remaining remote build settings. 

From there, any index with remote build enabled will use the Remote Vector Index Builder to carry out any index build operations that meet the configured size threshold. 