---
layout: default
title: Sharing custom workloads
nav_order: 11
grand_parent: User guide
parent: Working with workloads
redirect_from: 
  - /benchmark/user-guide/contributing-workloads/
---

# Sharing custom workloads

You can share a custom workload with other OpenSearch users by uploading it to the [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/) on GitHub. 

Make sure that any data included in the workload's dataset does not contain proprietary data or personally identifiable information (PII). 

To share a custom workload, follow these steps.

## Create a README.md

Provide a detailed `README.MD` file that includes the following:  

- The purpose of the workload. When creating a description for the workload, consider its specific use and how the that use case differs from others in the [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/).
- An example document from the dataset that helps users understand the data's structure.
- The workload parameters that can be used to customize the workload.
- A list of default test procedures included in the workload as well as other test procedures that the workload can run.
- An output sample produced by the workload after a test is run.
- A copy of the open-source license that gives the user and OpenSearch Benchmark permission to use the dataset.

For an example workload README file, go to the `http_logs` [README](https://github.com/opensearch-project/opensearch-benchmark-workloads/blob/main/http_logs/README.md).

## Verify the workload's structure

The workload must include the following files: 

- `workload.json`
- `index.json`
- `files.txt`
- `test_procedures/default.json`
- `operations/default.json` 

Both `default.json` file names can be customized to have a descriptive name. The workload can include an optional `workload.py` file to add more dynamic functionality. For more information about a file's contents, go to [Anatomy of a workload]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/anatomy-of-a-workload/).

## Testing the workload

All workloads contributed to OpenSearch Benchmark must fulfill the following testing requirements: 

- All tests run to explore and produce an example from the workload must target an OpenSearch cluster.
- The workload must pass all integration tests. Follow these steps to ensure that the workload passes the integration tests:
   1. Add the workload to your forked copy of the [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). Make sure that you've forked both the `opensearch-benchmark-workloads` repository and the [OpenSeach Benchmark](https://github.com/opensearch-project/opensearch-benchmark) repository.
   3. In your forked OpenSearch Benchmark repository, update the `benchmark-os-it.ini` and `benchmark-in-memory.ini` files in the `/osbenchmark/it/resources` directory to point to the forked workloads repository containing your workload.
   4. After you've modified the `.ini` files, commit your changes to a branch for testing.
   6. Run your integration tests using GitHub actions by selecting the branch for which you committed your changes. Verify that the tests have run as expected.
   7. If your integration tests run as expected, go to your forked workloads repository and merge your workload changes into branches `1` and `2`. This allows for your workload to appear in both major versions of OpenSearch Benchmark.

## Create a PR

After testing the workload, create a pull request (PR) from your fork to the `opensearch-project` [workloads repository](https://github.com/opensearch-project/opensearch-benchmark-workloads/). Add a sample output and summary result to the PR description. The OpenSearch Benchmark maintainers will review the PR.

Once the PR is approved, you must share the data corpora of your dataset. The OpenSearch Benchmark team can then add the dataset to a shared S3 bucket. If your data corpora is stored in an S3 bucket, you can use [AWS DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html) to share the data corpora. Otherwise, you must inform the maintainers of where the data corpora resides.
