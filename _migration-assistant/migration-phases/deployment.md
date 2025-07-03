---
layout: default
title: Deploy
parent: Migration phases
nav_order: 2
redirect_from:
  - /migration-assistant/getting-started-with-data-migration/
  - /deploying-migration-assistant/
---

# Deploying Migration Assistant
This document assumes you have performed assessment.

---

## Step 1: Install Bootstrap on an Amazon EC2 instance (~10 minutes)

To begin your migration, use the following steps to install a `bootstrap` box on an Amazon Elastic Compute Cloud (Amazon EC2) instance. The instance uses AWS CloudFormation to create and manage the stack.

1. Log in to the target AWS account in which you want to deploy Migration Assistant.
2. From the browser where you are logged in to your target AWS account, right-click [here](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?templateURL=https://solutions-reference.s3.amazonaws.com/migration-assistant-for-amazon-opensearch-service/latest/migration-assistant-for-amazon-opensearch-service.template&redirectId=SolutionWeb) to load the CloudFormation template from a new browser tab.
3. Follow the CloudFormation stack wizard:
   * **Stack Name:** `MigrationBootstrap`
   * **Stage Name:** `dev`
   * Choose **Next** after each step > **Acknowledge** > **Submit**.
4. Verify that the Bootstrap stack exists and is set to `CREATE_COMPLETE`. This process takes around 10 minutes to complete.

---

## Step 2: Set up Bootstrap instance access (~5 minutes)

Use the following steps to set up Bootstrap instance access:

1. After deployment, find the EC2 instance ID for the `bootstrap-dev-instance`.
2. Create an AWS Identity and Access Management (IAM) policy using the following snippet, replacing `<aws-region>`, `<aws-account>`, `<stage>`, and `<ec2-instance-id>` with your information:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "ssm:StartSession",
                "Resource": [
                    "arn:aws:ec2:<aws-region>:<aws-account>:instance/<ec2-instance-id>",
                    "arn:aws:ssm:<aws-region>:<aws-account>:document/BootstrapShellDoc-<stage>-<aws-region>"
                ]
            }
        ]
    }
    ```
    {% include copy.html %}

3. Name the policy, for example, `SSM-OSMigrationBootstrapAccess`, and then create the policy by selecting **Create policy**.
4. Attach the newly created policy to your EC2 instance's IAM role.

---

## Step 3: Log in to Bootstrap and building Migration Assistant (~15 minutes)

Next, log in to Bootstrap and build Migration Assistant using the following steps.

### Prerequisites

To use these steps, make sure you fulfill the following prerequisites:

* The AWS Command Line Interface (AWS CLI) and AWS Session Manager plugin are installed on your instance.
* The AWS credentials are configured (`aws configure`) for your instance.

### Steps

1. Load AWS credentials into your terminal.
2. Log in to the instance using the following command, replacing `<instance-id>` and `<aws-region>` with your instance ID and Region:

    ```bash
    aws ssm start-session --document-name BootstrapShellDoc-<stage>-<aws-region> --target <instance-id> --region <aws-region> [--profile <profile-name>]
    ```
    {% include copy.html %}
    
3. Once logged in, run the following command from the shell of the Bootstrap instance in the `/opensearch-migrations` directory:

    ```bash
    ./initBootstrap.sh && cd deployment/cdk/opensearch-service-migration
    ```
    {% include copy.html %}
    
4. After a successful build, note the path for infrastructure deployment, which will be used in the next step.

---

## Step 4: Configure and deploy RFS (~20 minutes)

To deploy Migration Assistant with RFS, the following stacks must be deployed:

These commands deploy the following stacks:

* `Migration Assistant network` stack
* `RFS` stack
* `Migration console` stack

Use the following steps to configure and deploy RFS, deploy Migration Assistant, and verify installation of the required stacks:

1. Add the source and target cluster password as separate **Secrets** in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) as an unstructured string. Be sure to copy the secret Amazon Resource Name (ARN) for use during deployment.
2. From the same shell as the Bootstrap instance, modify the `cdk.context.json` file located in the `/opensearch-migrations/deployment/cdk/opensearch-service-migration` directory and configure the following settings:

    ```json
    {
    "default": {
        "stage": "dev",
        "vpcId": "<TARGET CLUSTER VPC ID>",
        "targetCluster": {
            "endpoint": "<TARGET CLUSTER ENDPOINT>",
            "auth": {
                "type": "basic",
                "username": "<TARGET CLUSTER USERNAME>",
                "passwordFromSecretArn": "<TARGET CLUSTER PASSWORD SECRET>"
            }
        },
        "sourceCluster": {
            "endpoint": "<SOURCE CLUSTER ENDPOINT>",
            "version": "<SOURCE ENGINE VERSION>",
            "auth": {
                "type": "basic",
                "username": "<TARGET CLUSTER USERNAME>",
                "passwordFromSecretArn": "<TARGET CLUSTER PASSWORD SECRET>"
            }
        },
        "reindexFromSnapshotExtraArgs": "<RFS PARAMETERS (see below)>",
        "reindexFromSnapshotMaxShardSizeGiB": 80,
        "otelCollectorEnabled": true,
        "migrationConsoleServiceEnabled": true
    }
    }
    ```
    {% include copy.html %}

    The source and target cluster authorization can be configured to have no authorization, `basic` with a username and password, or `sigv4`. 

3. After the `cdk.context.json` file is fully configured, bootstrap the account and deploy the required stacks using the following command:

    ```bash
    cdk bootstrap --c contextId=default --require-approval never 
    ```
    {% include copy.html %}

4. Deploy Migration Assistant using the following command:

    ```bash
    cdk deploy "*" --c contextId=default --require-approval never --concurrency 5
    ```
    {% include copy.html %}
    
5. From the same Bootstrap instance shell, verify that all CloudFormation stacks were installed successfully:

    ```bash
    aws cloudformation list-stacks --query "StackSummaries[?StackStatus!='DELETE_COMPLETE'].[StackName,StackStatus]" --output table
    ```
    {% include copy.html %}
    
You should receive a similar output for your Region:

```bash
------------------------------------------------------------------------
|                              ListStacks                              |
+--------------------------------------------------+-------------------+
|  OSMigrations-dev-us-east-1-MigrationConsole     |  CREATE_COMPLETE  |
|  OSMigrations-dev-us-east-1-ReindexFromSnapshot  |  CREATE_COMPLETE  |
|  OSMigrations-dev-us-east-1-MigrationInfra       |  CREATE_COMPLETE  |
|  OSMigrations-dev-us-east-1-default-NetworkInfra |  CREATE_COMPLETE  |
|  MigrationBootstrap                              |  CREATE_COMPLETE  |
|  CDKToolkit                                      |  CREATE_COMPLETE  |
+--------------------------------------------------+-------------------+
```

### RFS parameters

If you're creating a snapshot using migration tooling, these parameters are automatically configured. If you're using an existing snapshot, modify the `reindexFromSnapshotExtraArgs` setting with the following values:

```bash
    "reindexFromSnapshotExtraArgs": "--s3-repo-uri s3://<bucket-name>/<repo> --s3-region <region> --snapshot-name <name>"
```

You will also need to give the `migrationconsole` and `reindexFromSnapshot` TaskRoles permissions to the S3 bucket. 

---

## Step 5: Access the migration console

Run the following command to access the migration console:

```bash
./accessContainer.sh migration-console dev <region>
```
{% include copy.html %}


`accessContainer.sh` is located in `/opensearch-migrations/deployment/cdk/opensearch-service-migration/` on the Bootstrap instance. To learn more, see [Accessing the migration console]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrating-metadata/).
{: .note}

---

## Step 6: Verify the connection to the source and target clusters

To verify the connection to the clusters, run the following command:

```bash
console clusters connection-check
```
{% include copy.html %}

You should receive the following output:

```bash
SOURCE CLUSTER
ConnectionResult(connection_message='Successfully connected!', connection_established=True, cluster_version='')
TARGET CLUSTER
ConnectionResult(connection_message='Successfully connected!', connection_established=True, cluster_version='')
```

To learn more about migration console commands, see [Migration console command reference](https://docs.opensearch.org/docs/latest/migration-assistant/migration-console/migration-console-commands-references/).

---

## Step 7: Create a snapshot

Run the following command to initiate snapshot creation from the source cluster:

```bash
console snapshot create [...]
```
{% include copy.html %}

To check the snapshot creation status, run the following command:

```bash
console snapshot status [...]
```
{% include copy.html %}

To learn more information about the snapshot, run the following command:

```bash
console snapshot status --deep-check [...]
```
{% include copy.html %}

Wait for snapshot creation to complete before moving to step 9.

To learn more about snapshot creation, see [Snapshot Creation].

---

## Step 8: Migrate metadata

Run the following command to migrate metadata:

```bash
console metadata migrate [...]
```
{% include copy.html %}

For more information, see [Migrating metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrating-metadata/).

---

## Step 9: Migrate documents with RFS

You can now use RFS to migrate documents from your original cluster:

1. To start the migration from RFS, start a `backfill` using the following command:

    ```bash
    console backfill start
    ```
    {% include copy.html %}

2. _(Optional)_ To speed up the migration, increase the number of documents processed at a simultaneously by using the following command:

    ```bash
    console backfill scale <NUM_WORKERS>
    ```
    {% include copy.html %}

3. To check the status of the documentation backfill, use the following command:

    ```bash
    console backfill status
    ```
    {% include copy.html %}

4. If you need to stop the backfill process, use the following command:

    ```bash
    console backfill stop
    ```
    {% include copy.html %}

For more information, see [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/).

---

## Step 10: Backfill monitoring

Use the following command for detailed monitoring of the backfill process:

```bash
console backfill status --deep-check
```
{% include copy.html %}

You should receive the following output:

```json
BackfillStatus.RUNNING
Running=9
Pending=1
Desired=10
Shards total: 62
Shards completed: 46
Shards incomplete: 16
Shards in progress: 11
Shards unclaimed: 5
```

Logs and metrics are available in Amazon CloudWatch in the `OpenSearchMigrations` log group.

---

## Step 11: Verify that all documents were migrated 

Use the following query in CloudWatch Logs Insights to identify failed documents:

```bash
fields @message
| filter @message like "Bulk request succeeded, but some operations failed."
| sort @timestamp desc
| limit 10000
```
{% include copy.html %}

If any failed documents are identified, you can index the failed documents directly as opposed to using RFS.
