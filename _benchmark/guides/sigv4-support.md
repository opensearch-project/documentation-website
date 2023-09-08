---
layout: default
title: SigV4 Support
nav_order:
parent: Guides
---

# Run with sigv4 support

Note: Sigv4 refers to AWS Signature Version 4

1. Provision a serverless collection with proper access policies and security policies. Serverless usually requires that users specify an IAM User or Role ARN in the access policy.

2. Set up environment variables where you are running OSB
```
OSB_AWS_ACCESS_KEY_ID=<<IAM USER AWS ACCESS KEY ID>
OSB_AWS_SECRET_ACCESS_KEY=<IAM USER AWS SECRET ACCESS KEY>
OSB_REGION=<YOUR REGION>
OSB_SERVICE=aoss
```

3. Invoke OSB like the command below. Ensure that you are specifying:

- `--distribution-version` = This is needed because OSB parses the distribution version (usually provided or fetched from curling the cluster’s settings) and uses that to determine which OSB Workload branch to use. This can be 2.3.0 should be sufficient for now as it will use the workload branches that correlate to OpenSearch version 2.X
- `--client-options=amazon_aws_log_in:environment` = tells OSB that you’ve exported the credentials in the environment in the previous step
- `--exclude-tasks=check-cluster-health,refresh-after-index,force-merge,refresh-after-force-merge,wait-until-merges-finish` = this skips operations in the test that call APIs exclusive to OpenSearch and not found in serverless

Example command:
```
opensearch-benchmark execute-test \
--distribution-version=2.3.0 \
--target-hosts=<YOUR COLLECTION ENDPOINT> \
--pipeline=benchmark-only \
--workload percolator \
--client-options=timeout:120,amazon_aws_log_in:environment \
--exclude-tasks=check-cluster-health,refresh-after-index,force-merge,refresh-after-force-merge,wait-until-merges-finish,percolator_with_content_ignore_me
```