---
layout: default
title: Getting started with data migration
nav_order: 10
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
redirect_from:
  - /upgrade-to/upgrade-to/
  - /upgrade-to/snapshot-migrate/
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md
---

# Getting started with data migration

This quickstart outlines how to deploy Migration Assistant for OpenSearch and execute an existing data migration using `Reindex-from-Snapshot` (RFS). It uses AWS for illustrative purposes. However, the steps can be modified for use with other cloud providers.

<<<<<<< HEAD:_migrations/getting-started-data-migration.md

=======
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md
## Prerequisites and assumptions

Before using this quickstart, make sure you fulfill the following prerequisites:

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
* Verify that your migration path [is supported](https://opensearch.org/docs/latest/migrations/is-migration-assistant-right-for-you/#supported-migration-paths). Note that we test with the exact versions specified, but you should be able to migrate data on alternative minor versions as long as the major version is supported.
=======
* Verify that your migration path [is supported]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/#migration-paths). Note that we test with the exact versions specified, but you should be able to migrate data on alternative minor versions as long as the major version is supported.
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md
* The source cluster must be deployed Amazon Simple Storage Service (Amazon S3) plugin.
* The target cluster must be deployed.

The steps in this guide assume the following:

* In this guide, a snapshot will be taken and stored in Amazon S3; the following assumptions are made about this snapshot:
  * The `_source` flag is enabled on all indexes to be migrated.
  * The snapshot includes the global cluster state (`include_global_state` is `true`).
  * Shard sizes of up to approximately 80 GB are supported. Larger shards cannot be migrated. If this presents challenges for your migration, contact the [migration team](https://opensearch.slack.com/archives/C054JQ6UJFK).
* Migration Assistant will be installed in the same AWS Region and have access to both the source snapshot and target cluster.

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 1: Installing Bootstrap on an Amazon EC2 instance (~10 minutes)
=======
## Step 1: Install Bootstrap on an Amazon EC2 instance (~10 minutes)
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

To begin your migration, use the following steps to install a `bootstrap` box on an Amazon Elastic Compute Cloud (Amazon EC2) instance. The instance uses AWS CloudFormation to create and manage the stack.

1. Log in to the target AWS account in which you want to deploy Migration Assistant.
2. From the browser where you are logged in to your target AWS account, right-click [here](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?templateURL=https://solutions-reference.s3.amazonaws.com/migration-assistant-for-amazon-opensearch-service/latest/migration-assistant-for-amazon-opensearch-service.template&redirectId=SolutionWeb) to load the CloudFormation template from a new browser tab.
3. Follow the CloudFormation stack wizard:
   * **Stack Name:** `MigrationBootstrap`
   * **Stage Name:** `dev`
   * Choose **Next** after each step > **Acknowledge** > **Submit**.
4. Verify that the Bootstrap stack exists and is set to `CREATE_COMPLETE`. This process takes around 10 minutes to complete.

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 2: Setting up Bootstrap instance access (~5 minutes)
=======
## Step 2: Set up Bootstrap instance access (~5 minutes)
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

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
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

3. Name the policy, for example, `SSM-OSMigrationBootstrapAccess`, and then create the policy by selecting **Create policy**.

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 3: Logging in to Bootstrap and building Migration Assistant (~15 minutes)
=======
## Step 3: Log in to Bootstrap and building Migration Assistant (~15 minutes)
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

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
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md
    
3. Once logged in, run the following command from the shell of the Bootstrap instance in the `/opensearch-migrations` directory:

    ```bash
    ./initBootstrap.sh && cd deployment/cdk/opensearch-service-migration
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md
    
4. After a successful build, note the path for infrastructure deployment, which will be used in the next step.

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 4: Configuring and deploying RFS (~20 minutes)
=======
## Step 4: Configure and deploy RFS (~20 minutes)
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

Use the following steps to configure and deploy RFS:

1. Add the target cluster password to AWS Secrets Manager as an unstructured string. Be sure to copy the secret Amazon Resource Name (ARN) for use during deployment.
2. From the same shell as the Bootstrap instance, modify the `cdk.context.json` file located in the `/opensearch-migrations/deployment/cdk/opensearch-service-migration` directory:

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
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

    The source and target cluster authorization can be configured to have no authorization, `basic` with a username and password, or `sigv4`. 

3. Bootstrap the account with the following command:

    ```bash
    cdk bootstrap --c contextId=migration-assistant --require-approval never 
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

4. Deploy the stacks:

    ```bash
    cdk deploy "*" --c contextId=migration-assistant --require-approval never --concurrency 5
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

5. Verify that all CloudFormation stacks were installed successfully.

### RFS parameters

If you're creating a snapshot using migration tooling, these parameters are automatically configured. If you're using an existing snapshot, modify the `reindexFromSnapshotExtraArgs` setting with the following values:

    ```bash
    --s3-repo-uri s3://<bucket-name>/<repo> --s3-region <region> --snapshot-name <name>
    ```

You will also need to give the `migrationconsole` and `reindexFromSnapshot` TaskRoles permissions to the S3 bucket. 

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 5: Deploying Migration Assistant
=======
## Step 5: Deploy Migration Assistant
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

To deploy Migration Assistant, use the following steps:

1. Bootstrap the account:
   
    ```bash
    cdk bootstrap --c contextId=migration-assistant --require-approval never --concurrency 5
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}

>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md
2. Deploy the stacks when `cdk.context.json` is fully configured:
   
    ```bash
    cdk deploy "*" --c contextId=migration-assistant --require-approval never --concurrency 3
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

These commands deploy the following stacks:

* Migration Assistant network stack
* `Reindex-from-snapshot` stack
* Migration console stack

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 6: Accessing the migration console
=======
## Step 6: Access the migration console
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

Run the following command to access the migration console:

```bash
./accessContainer.sh migration-console dev <region>
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
{% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md


`accessContainer.sh` is located in `/opensearch-migrations/deployment/cdk/opensearch-service-migration/` on the Bootstrap instance. To learn more, see [Accessing the migration console].
`{: .note}

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 7: Verifying the connection to the source and target clusters
=======
## Step 7: Verify the connection to the source and target clusters
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

To verify the connection to the clusters, run the following command:

```bash
console clusters connection-check
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md

You should receive the following output:

```
=======
{% include copy.html %}

You should receive the following output:

```bash
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md
* **Source Cluster:** Successfully connected!
* **Target Cluster:** Successfully connected!
```

To learn more about migration console commands, see [Migration commands].

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 8: Snapshot creation
=======
## Step 8: Create a snapshot
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

Run the following command to initiate snapshot creation from the source cluster:

```bash
console snapshot create [...]
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
{% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

To check the snapshot creation status, run the following command:

```bash
console snapshot status [...]
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
{% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

To learn more information about the snapshot, run the following command:

```bash
console snapshot status --deep-check [...]
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
{% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

Wait for snapshot creation to complete before moving to step 9.

To learn more about snapshot creation, see [Snapshot Creation].

---

<<<<<<< HEAD:_migrations/getting-started-data-migration.md
## Step 9: Metadata migration
=======
## Step 9: Migrate metadata
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

Run the following command to migrate metadata:

```bash
console metadata migrate [...]
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md

For more information, see [Migrating metadata]({{site.url}}{{site.baseurl}}/migrations/migration-phases/migrating-metadata/).

---

## Step 10: RFS document migration
=======
{% include copy.html %}

For more information, see [Migrating metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrating-metadata/).

---

## Step 10: Migrate documents with RFS
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

You can now use RFS to migrate documents from your original cluster:

1. To start the migration from RFS, start a `backfill` using the following command:

    ```bash
    console backfill start
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

2. _(Optional)_ To speed up the migration, increase the number of documents processed at a simultaneously by using the following command:

    ```bash
    console backfill scale <NUM_WORKERS>
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

3. To check the status of the documentation backfill, use the following command:

    ```bash
    console backfill status
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
    {% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

4. If you need to stop the backfill process, use the following command:

    ```bash
    console backfill stop
    ```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md

For more information, see [Backfill]({{site.url}}{{site.baseurl}}/migrations/migration-phases/backfill/).
=======
    {% include copy.html %}

For more information, see [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/).
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

---

## Step 11: Backfill monitoring

Use the following command for detailed monitoring of the backfill process:

```bash
console backfill status --deep-check
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
{% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

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

## Step 12: Verify that all documents were migrated 

Use the following query in CloudWatch Logs Insights to identify failed documents:

```bash
fields @message
| filter @message like "Bulk request succeeded, but some operations failed."
| sort @timestamp desc
| limit 10000
```
<<<<<<< HEAD:_migrations/getting-started-data-migration.md
=======
{% include copy.html %}
>>>>>>> 72f07c60 (Add migrations section (#8873)):_migration-assistant/getting-started-data-migration.md

If any failed documents are identified, you can index the failed documents directly as opposed to using RFS.

