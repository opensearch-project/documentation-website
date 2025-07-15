---
layout: default
title: Removing migration infrastructure
nav_order: 8
parent: Migration phases
permalink: /migration-assistant/migration-phases/remove-migration-infrastructure/
---

# Removing migration infrastructure

After a migration is complete, you should remove all resources except for the target cluster and, optionally, your Amazon CloudWatch logs and Traffic Replayer logs.

To remove the AWS Cloud Development Kit (AWS CDK) stack(s) created during a deployment, run the following command within the CDK directory:

```bash  
cd deployment/cdk/opensearch-service-migration
cdk destroy "*" --c contextId=<CONTEXT_ID>
```
{% include copy.html %}

Follow the instructions on the command line to remove the deployed resources from your AWS account.

You can also use the AWS Management Console to remove Migration Assistant resources and confirm that they are no longer present in the account.

## Uninstalling Migration Assistant for OpenSearch

You can uninstall Migration Assistant for OpenSearch Service from the AWS Management Console or by using the AWS Command Line Interface (AWS CLI). Manually remove the contents of the Amazon Simple Storage Service (Amazon S3) bucket that matches the syntax `cdk-<unique id>-assets-<account id>-<region>`, the bucket created by Migration Assistant. Migration Assistant for OpenSearch Service does not automatically delete Amazon S3 buckets. 

To delete the stored data and the AWS CloudFormation stacks created by Migration Assistant, see [Uninstall the solution](https://docs.aws.amazon.com/solutions/latest/migration-assistant-for-amazon-opensearch-service/uninstall-the-solution.html) in the Amazon OpenSearch Service documentation.
