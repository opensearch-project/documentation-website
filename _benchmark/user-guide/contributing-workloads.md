---
layout: default
title: Contributing custom workloads
nav_order: 11
parent: User guide
---

# Contributing custom workloads

After [creating a custom workload]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/), you can contribute your workload for other OpenSearch Benchmark users to use. If you plan on contributing a workload, use the following guidelines.

## README and license

Each workload must include a detailed `README.MD` file, which should include the following:  

- The purpose of the workload and which users should use the workload. When creating a description, consider the specific use case of the workload, especially scenarios that have not yet been addressed by OpenSearch Benchmark.
- An overview of the dataset used by the workload. Make sure that any data included in the dataset does not contain any proprietary data or Personal Identifiable Information (PII). 
- An example document from the dataset that helps users understand the datas structure.
- The parameters supported by the workload.
- A list of default test procedures included in the workload and other test procedures that the workload can run.
- An output sample that the workload produces after a test is run.
- A copy of the license that gives the user and OpenSearch Benchmark permission to use the dataset.

For an example workload README, go to the `http_logs` [README](https://github.com/opensearch-project/opensearch-benchmark-workloads/blob/main/http_logs/README.md).

## Structure

The workload must include the following files: 

- `workload.json`
- `index.json`
- `files.txt`
- `test_procedures/default.json`
- `operations/default.json` 

Both `default.json` file names can be customized to have a descriptive name. The workload can include an optional `workload.py` file to add more dynamic functionality. For more information about a file's contents, go to [Anatomy of a workload]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/anatomy-of-a-workload/).

## Testing the workload

All workloads contributed to OpenSearch Benchmark must fulfil the following testing requirements: 

- All tests run to explore the workload and produce examples must run on OpenSearch clusters.
- The workload must pass integration tests in order to be included in the [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). Follow these steps to ensure the workload passes the integration tests:
   1. Add the workload to your forked copy of the [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/).
   2. In the forked repository, update the `benchmark-os-it.ini` and `benchmark-in-memory.ini` files in the `/osbenchmark/it/resources` directory to point to the forked workloads repository containing your workload.
   3. After you've modified the `.ini` files, commit your changes to a branch for testing.
   4. Run your integration tests by using GitHub Actions and verify the tests have run as expected.

## Raise a pull request

After completing the [testing the workload](#testing-the-workload) step, create a pull request (PR) from your fork to `opensearch-project` [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). Add a sample output and summary result to the PR description. The OpenSearch Benchmark maintainers then will review the PR. 

Once the PR is approved, you must share the data corpora of your dataset. The OpenSearch Benchmark team can then add the shared dataset to a shared Amazon S3 bucket. Note that if your data corpora is stored in an Amazon S3 bucket, you can use [AWS DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html) to share the data corpora. Otherwise, you must inform the maintainers of where the data corpora resides.
