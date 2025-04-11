---
layout: default
title: Remote index build
nav_order: 72
has_children: false
redirect_from:
  - /search-plugins/knn/remote-index-build/
---

# Building vector indexes remotely with GPUs
Currently, the remote index build service supports Faiss indexes with method HNSW and data type `FP32`.
{: .note}

As of version 3.0.0, OpenSearch supports the ability to build vector indexes using GPUs with a remote index build service. This new feature leverages the power of GPUs to dramatically reduce index build times and decrease cost. See the [GPU Accelerated Vector Search blog post](https://opensearch.org/blog/GPU-Accelerated-Vector-Search-OpenSearch-New-Frontier/) for more details.

## Getting started

Before configuring the remote index build settings, there are a couple prerequisite steps:

### Step 1: Create and register the remote vector repository

The remote vector repository will act as an intermediate object store between the OpenSearch cluster and the remote build service. To create and register the repository to be used to store the vectors and, eventually, the completed index, follow the [Register repository](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#register-repository) steps in the Snapshots documentation.

### Step 2: Remote vector index builder setup

The remote endpoint configured in k-NN settings should point to a running [Remote Vector Index Builder](https://github.com/opensearch-project/remote-vector-index-builder) instance. Refer to the Remote Vector Index Builder `DEVELOPER_GUIDE.md` for instructions to set up the remote service.

## Configuring settings

Refer to [Remote index build settings](https://opensearch.org/docs/latest/vector-search/settings/#remote-index-build-settings) to configure each of the remote build settings. Ensure that the values used for `knn.remote_index_build.vector_repo` and `knn.remote_index_build.client.endpoint` match the values from the preceding setup steps.

From there, any index with remote build enabled will use the Remote Vector Index Builder to carry out any index build operations that meet the configured size threshold. 