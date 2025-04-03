---
layout: default
title: Removing migration infrastructure
nav_order: 120
parent: Migration phases
---

# Removing migration infrastructure

After a migration is complete all resources should be removed except for the target cluster, and optionally your Cloudwatch Logs, and Traffic Replayer logs.

To remove all the CDK stack(s) which get created during a deployment you can execute a command similar to below within the CDK directory

```bash
cd deployment/cdk/opensearch-service-migration
cdk destroy "*" --c contextId=<CONTEXT_ID>
```
{% include copy.html %}

Follow the instructions on the command-line to remove the deployed resources from the AWS account.

The AWS Management Console can also be used to remove Migration Assistant resources and confirm that they are no longer in the account.

## Uninstalling Migration Assistant for Amazon OpenSearch Service

You can uninstall the Migration Assistant for Amazon OpenSearch Service solution from the AWS Management Console or by using the AWS Command Line Interface. Manually remove the contents of the bucket that matches `cdk-<unique id>-assets-<account id>-<region>` created by this solution. Migration Assistant for Amazon OpenSearch Service does not automatically delete S3 buckets in case you have stored data to retain. To delete the stored data and the CouldFormation stacks created by Migration Assistant, use the following steps:


1. Sign in to the **CloudFormation console**.
2. On the **Stacks** page, select the solution’s installation stack. Depending on what options you enabled for the deployment, the solution creates different AWS CloudFormation stacks.
3. Delete the stacks in the following order:
   
   - **MigrationConsole**
   - **TrafficReplayer**
   - **CaptureProxy**
   - **CaptureProxyES** (only available for demo install)
   - **ReindexFromSnapshot**
   - **MigrationInfra**
   - **NetworkInfra**

4. On the **Stacks** page, delete the **bootstrap stack**.
5. Choose **Delete** for each of the previous stacks.
