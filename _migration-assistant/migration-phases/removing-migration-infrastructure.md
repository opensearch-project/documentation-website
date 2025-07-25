---
layout: default
title: Removing migration infrastructure
nav_order: 120
parent: Migration phases
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/removing-migration-infrastructure/
---

# Removing migration infrastructure

After a migration is complete all resources should be removed except for the target cluster, and optionally your Cloudwatch Logs, and Traffic Replayer logs.

To remove all the CDK stack(s) which get created during a deployment you can execute a command similar to below within the CDK directory

```bash
cdk destroy "*" --c contextId=<CONTEXT_ID>
```
{% include copy.html %}

Follow the instructions on the command-line to remove the deployed resources from the AWS account.

The AWS Management Console can also be used to remove Migration Assistant resources and confirm that they are no longer in the account.