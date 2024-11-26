---
layout: default
title: Quickstart - Data migration
nav_order: 10
---

# Getting started: Data migration

This document outlines how to deploy the Migration Assistant and execute an existing data migration using `Reindex-from-Snapshot` (RFS). It uses AWS for the sake of illustration. However, the steps can be modified for use with other cloud providers.


## Prerequisites and assumptions

Before utilizing this quickstart, make sure you fulfill the following prerequisites:

* Verify your that migration path [is supported](https://opensearch.org/docs/latest/migrations/is-migration-assistant-right-for-you/#supported-migration-paths). Note that we test with the exact versions specified, but you should be able to migrate data on alternative minor versions as long as the major version is supported.
* The source cluster must be deployed with the S3 plugin.
* The target cluster must be deployed.

Using this guide assumes the following:

* A snapshot will be taken and stored in S3 in this guide, and the following assumptions are made about this snapshot:
  * The `_source` flag is enabled on all indexes that will be migrated.
  * The snapshot includes the global cluster state (`include_global_state` is `true`).
  * Shard sizes up to approximately 80 GB are supported. Larger shards can not be migrated. If this is blocker for your migration, contact the [migration's team](https://opensearch.slack.com/archives/C054JQ6UJFK).
* Migration Assistant will be installed in the same region and have access to both the source snapshot and target cluster.

---

## Step 1: Installing bootstrap on an AWS EC2 instance (~10 mins)

To begin your migration, use the following steps to install a `bootstrap` box on an AWS EC2 instance. The instance uses CloudFormation to create and manage the stack.

1. Log into the target AWS account where you want to deploy the Migration Assistant.
2. From the browser where you are logged into your target AWS account, right-click [here](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?templateURL=https://solutions-reference.s3.amazonaws.com/migration-assistant-for-amazon-opensearch-service/latest/migration-assistant-for-amazon-opensearch-service.template&redirectId=SolutionWeb) to load the CloudFormation  template from a new browser tab.
3. Follow the CloudFormation stack wizard:
   * **Stack Name:** `MigrationBootstrap`
   * **Stage Name:** `dev`
   * Hit **Next** on each step, acknowledge on the fourth screen, and hit **Submit**.
4. Verify that the bootstrap stack exists and is set to `CREATE_COMPLETE`. This process takes around 10 minutes.

---

## Step 2: Setting up bootstrap instance access (~5 mins)

Use the following steps to set up bootstrap instance access:

1. After deployment, find the EC2 instance ID for the `bootstrap-dev-instance`.
2. Create an IAM policy using the following snippet, replacing `<aws-region>`, `<aws-account>`, `<stage>`, and `<ec2-instance-id>` with your information:

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

3. Name the policy, for example `SSM-OSMigrationBootstrapAccess`, then create the policy by selecting **Create policy**.

---

## Step 3: Logging into bootstrap and build the Migration Assistant (~15 mins)

Next, log into to bootstrap and build the Migration Assistant using the following steps.

### Prerequisites

To use these steps, make sure you fulfill the following prerequisites:

* AWS CLI and AWS Session Manager Plugin is installed on your instance.
* The AWS credentials are configured (`aws configure`) for your instance.

### Steps

1. Load AWS credentials into your terminal.
2. Login to the instance using the following command, replacing `<instance-id>` and `<aws-region>` with your instance ID and region:

    ```bash
    aws ssm start-session --document-name BootstrapShellDoc-<stage>-<aws-region> --target <instance-id> --region <aws-region> [--profile <profile-name>]
    ```
    
3. Once logged in, run the following command from the shell of the bootstrap instance inside the `/opensearch-migrations` directory):

    ```bash
    ./initBootstrap.sh && cd deployment/cdk/opensearch-service-migration
    ```
    
4. After a successful build, remember the path for infrastructure deployment in the next step.

---

## Step 4: Configuring and deploying for RFS (~20 mins)

Use the following step to configure and deploy RFS:

1. Add the target cluster password to AWS Secrets Manager as an unstructured string. Be sure to copy the secret ARN for use during deployment.
2. From the same shell as the bootstrap instance, modify the `cdk.context.json` file located in the `/opensearch-migrations/deployment/cdk/opensearch-service-migration` directory:

    ```json
    {
    "migration-assistant": {
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
            "auth": {
                "type": "basic",
                "username": "<TARGET CLUSTER USERNAME>",
                "passwordFromSecretArn": "<TARGET CLUSTER PASSWORD SECRET>"
            }
        },
        "reindexFromSnapshotExtraArgs": "<RFS PARAMETERS (see below)>",
        "stage": "dev",
        "otelCollectorEnabled": true,
        "migrationConsoleServiceEnabled": true,
        "reindexFromSnapshotServiceEnabled": true,
        "migrationAssistanceEnabled": true
    }
    }
    ```

    The source and target cluster authorization can be configured to have no authorization, `basic` with a username and password, or `sigv4`. 

3. Bootstrap the account with the following command:

    ```bash
    cdk bootstrap --c contextId=migration-assistant --require-approval never 
    ```

4. Deploy the stacks:

    ```bash
    cdk deploy "*" --c contextId=migration-assistant --require-approval never --concurrency 5
    ```

5. Verify that all CloudFormation stacks were installed successfully.

### RFS parameters

If you're creating a snapshot using migration tooling, these parameters are auto-configured. If you're using an existing snapshot, modify the  `reindexFromSnapshotExtraArgs` setting with the following values:

    ```bash
    --s3-repo-uri s3://<bucket-name>/<repo> --s3-region <region> --snapshot-name <name>
    ```

You will also need to give access to the `migrationconsole` and `reindexFromSnapshot` taskRole permissions to the EC2 bucket. 

---

## Step 5: Deploying the migration assistant

To deploy the migration assistant, use the following steps:

1. Bootstrap the account:
   
    ```bash
    cdk bootstrap --c contextId=migration-assistant --require-approval never --concurrency 5
    ```
2. Deploy the stacks when `cdk.context.json` is fully configured:
   
    ```bash
    cdk deploy "*" --c contextId=migration-assistant --require-approval never --concurrency 3
    ```

These commands deploy the following stacks:

* Migration assistant network stack
* Reindex From Snapshot stack
* Migration console stack

---

## Step 6: Accessing the migration console

Run the following command to access the migration console:

```bash
./accessContainer.sh migration-console dev <region>
```


`accessContainer.sh` is located in `/opensearch-migrations/deployment/cdk/opensearch-service-migration/` on the bootstrap instance. To learn more, see [Accessing the migration console]:
`{: .note}

---

## Step 7: Checking the connection to the source and target clusters

To verify the connection to the clusters, run:

```bash
console clusters connection-check
```

You should receive the following output:

```
* **Source Cluster:** Successfully connected!
* **Target Cluster:** Successfully connected!
```

To learn more about migration console commands, see [Migration commands].

---

## Step 8: Snapshot creation

Run the following to initiate creating a snapshot from the source cluster:

```bash
console snapshot create [...]
```

To check on the progress of the snapshot creation, use:

```bash
console snapshot status [...]
```

To learn more details about the snapshot, use:

```bash
console snapshot status --deep-check [...]
```

Wait for the snapshot to complete before moving to step 9.

To learn more about snapshot creation, see [Snapshot Creation]:

---

## Step 9: Metadata Migration

Run the following command to migrate metadata:

```bash
console metadata migrate [...]
```

To learn more see [Metadata migration].

---

## Step 10: RFS document migration

You can now use RFS to migrate documents from your original cluster:

1. To start the migration from RFS, start a `backfill` using the following command:

    ```bash
    console backfill start
    ```

2. _(Optional)_ To speed up the migration, increase the number of documents processed at a time by using the following command:

    ```bash
    console backfill scale <NUM_WORKERS>
    ```

3. To check the status of the documentation backfill, use the following command:

    ```bash
    console backfill status
    ```

4. If you need to stop the backfill process use the following command:

    ```bash
    console backfill stop
    ```

To learn more see [Backfill execution].

---

## Step 11: Backfill monitoring

Use the following command for detailed monitoring of the backfill process:

```bash
console backfill status --deep-check
```

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

Logs and metrics are available in CloudWatch under the `OpenSearchMigrations` log group.

---

## Step 12: Verify all documents were migrated 

Use the following query in CloudWatch logs insights to identify failed documents:

```bash
fields @message
| filter @message like "Bulk request succeeded, but some operations failed."
| sort @timestamp desc
| limit 10000
```

If any failed documents are identified, you can index the failed documents directly, as opposed to using RFS.

For more information, see [Backfill migration].
