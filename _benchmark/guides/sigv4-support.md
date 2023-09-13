---
layout: default
title: SigV4 Support
nav_order: 70
parent: Guides
---

# Running OpenSearch Benchmark with AWS Sigv4 

OpenSearch Benchmark supports AWS Signature Version 4 (Sigv4) authentication. To run with Sigv4, use the following steps:

1. Provision a serverless collection with proper access policies and security policies. Serverless usually requires that users specify an IAM User or Role ARN in the access policy.

2. Set up environment variables where you are running OSB
```
OSB_AWS_ACCESS_KEY_ID=<<IAM USER AWS ACCESS KEY ID>
OSB_AWS_SECRET_ACCESS_KEY=<IAM USER AWS SECRET ACCESS KEY>
OSB_REGION=<YOUR REGION>
OSB_SERVICE=aos
```

3. Invoke OSB like the command below. Ensure that you are specifying:

- `--client-options=amazon_aws_log_in:environment`: Tells OpenSearch Benchmark when you've exported your environment's credentials.

## Example

The following example `execute-test` command run a benchmark test with sigv4 enabled:
```
opensearch-benchmark execute-test \
--distribution-version=2.3.0 \
--target-hosts=<YOUR COLLECTION ENDPOINT> \
--pipeline=benchmark-only \
--workload percolator \
--client-options=timeout:120,amazon_aws_log_in:environment \
--exclude-tasks=check-cluster-health,refresh-after-index,force-merge,refresh-after-force-merge,wait-until-merges-finish,percolator_with_content_ignore_me
```