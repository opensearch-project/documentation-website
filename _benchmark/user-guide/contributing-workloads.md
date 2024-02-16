---
layout: default
title: Contributing custom workloads
nav_order: 11
parent: User guide
---

# Contributing custom workloads

After [Creating a custom workload]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/) you can contribute your workload for other OpenSearch Benchmark users to use. If you plan on configuring a workload, use the following guidelines.

## README and license

Each workload must include a detailed `README.MD` file, which should include the following:  

- The purpose of the workload and what users should use the workload. When creating a description, think about what specific use case your workload address that other workloads included in OpenSearch Benchmark do not.
- An overview of the data set use. Make sure that any data included in the data set does not contain any properietary data or PII. 
- An example document from the data that displays that data types.
- The pearamters supported by the workload.
- A list of default test procedures included in the workload and other test procedures the workload can run.
- A sample of the output the workload produces after a test is run.
- A copy of the license that gives the user and OpenSearch Benchmark permission to use the dataset.


For an example workload README, see the `http_logs` [README](https://github.com/opensearch-project/opensearch-benchmark-workloads/blob/main/http_logs/README.md).

## Structure

Make sure that your workload includes the following files. For more details on the contents of each file, see [Anatomy of a workload]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/anatomy-of-a-workload/).

- `workload.json`
- `index.json`
- `files.txt`
- `test_procedures/default.json`
- `operations/default.json` 

Both `default.json` file names can be customized to have a descriptive name.

The workload can also include an optional `workload.py` file to add more dynamic functionality to the workload.

## Testing the workload

All workloads contributed to OpenSearch Benchmark must fulfil the following testing requirements: 

- All tests run to explore the workload and produce example are run on OpenSearch clusters to ensure that results from the workload are consistent.
- The workload passes integration tests in order to be included in [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). To make sure the workload passes integration tests, run the following steps:
   1. Add the workload to your forked copy of the [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/).
   2. In the forked repository, change the `benchmark-os-it.ini` and `benchmark-in-memory.ini` files in the `/osbenchmark/it/resources` to point to your forked workloads repository which contains your workload.
   3. After you've modified the `.ini` files, open a branch modifying your workload and make sure that the integration tests run as expected.

## Raise a Pull Request

After you've completed [testing the workload](#testing-the-workload), make a PR from your fork to `opensearch-project` [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). Add a sample output and summary result to the PR description. Then, the OpenSearch Benchmark maintainers will review the PR. 

If approved, you'll be required to share the data corpora of your dataset, so the OpenSearch Benchmark team can add the dataset to a shared Amazon S3 bucket. If your corpora is stored in an S3 bucket, you can use [AWS DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html) to share the data corpora. Otherwise, inform the maintainers of where the corpora currently resides.

