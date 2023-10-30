---
layout: default
title: AWS Signature Version 4 support
nav_order: 70
parent: Tutorials
---

# Running OpenSearch Benchmark with AWS Signature Version 4

OpenSearch Benchmark supports AWS Signature Version 4 authentication. To run Benchmark with Signature Version 4, use the following steps:

1. Set up an [IAM user or an IAM Role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create.html) and provide it access to the OpenSearch cluster using Signature Version 4 authentication.

2. Set up the following environment variables for your IAM user:

   ```bash
   export OSB_AWS_ACCESS_KEY_ID=<IAM USER AWS ACCESS KEY ID>
   export OSB_AWS_SECRET_ACCESS_KEY=<IAM USER AWS SECRET ACCESS KEY>
   export OSB_REGION=<YOUR REGION>
   export OSB_SERVICE=es
   ```
   {% include copy.html %}

   If you want to set up an IAM role instead of an IAM user, use the following environment variables instead:

   ```bash
   export OSB_AWS_ACCESS_KEY_ID=<IAM Role AWS ACCESS KEY ID>
   export OSB_AWS_SECRET_ACCESS_KEY=<IAM Role AWS SECRET ACCESS KEY>
   export OSB_AWS_SESSION_TOKEN=<IAM Role SESSION TOKEN>
   export OSB_REGION=<YOUR REGION>
   export OSB_SERVICE=es
   ```
   {% include copy.html %}

  If you're testing against Amazon OpenSearch Serverless, set `OSB_SERVICE` to `aoss`.

3. Customize and run the following `execute-test` command with the ` --client-options=amazon_aws_log_in:environment` flag. This flag tells OpenSearch Benchmark the location of your exported credentials.

   ```bash
   opensearch-benchmark execute-test \
   --target-hosts=<CLUSTER ENDPOINT> \
   --pipeline=benchmark-only \
   --workload=geonames \
   --client-options=timeout:120,amazon_aws_log_in:environment \
   ```
