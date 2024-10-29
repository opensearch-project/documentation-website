---
layout: default
title: Quickstart - Data migration
nav_order: 10
---

# Quickstart - Data migration

This document outlines how to deploy the Migration Assistant and execute an existing data migration using Reindex-from-Snapshot (RFS). Note that this does not include steps for deploying and capturing live traffic, which is necessary for a zero-downtime migration. Please refer to the "Phases of a Migration" section in the wiki navigation bar for a complete end-to-end migration process, including metadata migration, live capture, Reindex-from-Snapshot, and replay.

## Prerequisites and Assumptions
* Verify your migration path [is supported](https://github.com/opensearch-project/opensearch-migrations/wiki/Is-Migration-Assistant-Right-for-You%3F#supported-migration-paths). Note that we test with the exact versions specified, but you should be able to migrate data on alternative minor versions as long as the major version is supported.
* Source cluster must be deployed with the S3 plugin.
* Target cluster must be deployed.
* A snapshot will be taken and stored in S3 in this guide, and the following assumptions are made about this snapshot:
  * The `_source` flag is enabled on all indices to be migrated.
  * The snapshot includes the global cluster state (`include_global_state` is `true`).
  * Shard sizes up to approximately 80GB are supported. Larger shards will not be able to migrate. If this is a blocker, please consult the migrations team.
* Migration Assistant will be installed in the same region and have access to both the source snapshot and target cluster.

---

## Step 1 - Installing Bootstrap EC2 Instance (~10 mins)
1. Log into the target AWS account where you want to deploy the Migration Assistant.
2. From the browser where you are logged into your target AWS account right-click [here](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?templateURL=https://solutions-reference.s3.amazonaws.com/migration-assistant-for-amazon-opensearch-service/latest/migration-assistant-for-amazon-opensearch-service.template&redirectId=SolutionWeb) ↗ to load the CloudFormation (Cfn) template from a new browser tab.
3. Follow the CloudFormation stack wizard:
   * **Stack Name:** `MigrationBootstrap`
   * **Stage Name:** `dev`
   * Hit **Next** on each step, acknowledge on the fourth screen, and hit **Submit**.
4. Verify that the bootstrap stack exists and is set to `CREATE_COMPLETE`. This process takes around 10 minutes.

---

## Step 2 - Setup Bootstrap Instance Access (~5 mins)
1. After deployment, find the EC2 instance ID for the `bootstrap-dev-instance`.
2. Create an IAM policy using the snippet below, replacing `<aws-region>`, `<aws-account>`, `<stage>`, and `<ec2-instance-id>`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "ssm:StartSession",
            "Resource": [
                "arn:aws:ec2:<aws-region>:<aws-account>:instance/<ec2-instance-id>",
                "arn:aws:ssm:<aws-region>:<aws-account>:document/SSM-<stage>-BootstrapShell"
            ]
        }
    ]
}
```

3. Name the policy, e.g., `SSM-OSMigrationBootstrapAccess`, and create the policy.

---

## Step 3 - Login to Bootstrap and Build (~15 mins)
### Prerequisites:
* AWS CLI and AWS Session Manager Plugin installed.
* AWS credentials configured (`aws configure`).

1. Load AWS credentials into your terminal.
2. Login to the instance using the command below, replacing `<instance-id>` and `<aws-region>`:
```bash
aws ssm start-session --document-name SSM-dev-BootstrapShell --target <instance-id> --region <aws-region> [--profile <profile-name>]
```
3. Once logged in, run the following command from the shell of the bootstrap instance (within the /opensearch-migrations directory):
```bash
./initBootstrap.sh && cd deployment/cdk/opensearch-service-migration
```
4. After a successful build, remember the path for infrastructure deployment in the next step.

---

## Step 4 - Configuring and Deploying for RFS Use Case (~20 mins)
1. Add the target cluster password to AWS Secrets Manager as an unstructured string. Be sure to copy the secret ARN for use during deployment.
2. From the same shell on the bootstrap instance, modify the cdk.context.json file located in the `/opensearch-migrations/deployment/cdk/opensearch-service-migration` directory:

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

The source and target cluster authorization can be configured to have none, `basic` with a username and password, or `sigv4`. There are examples of each available [here](https://github.com/opensearch-project/opensearch-migrations/wiki/Configuration-Options#cluster-authentication-options).

3. Bootstrap the account with the following command:
```bash
cdk bootstrap --c contextId=migration-assistant --require-approval never 
```
4. Deploy the stacks:
```bash
cdk deploy "*" --c contextId=migration-assistant --require-approval never --concurrency 5
```
5. Verify that all CloudFormation stacks were installed successfully.

#### ReindexFromSnapshot Parameters
* If you're creating a snapshot using migration tooling, these parameters are auto-configured. If you're using an existing snapshot, modify `reindexFromSnapshotExtraArgs` with the following values:
```bash
--s3-repo-uri s3://<bucket-name>/<repo> --s3-region <region> --snapshot-name <name>
```
Note, you will also need to give access to the migrationconsole and reindexFromSnapshot taskRole permissions to the bucket 

---

## Step 5 - Deploying the Migration Assistant
1. Bootstrap the account:
```bash
cdk bootstrap --c contextId=migration-assistant --require-approval never --concurrency 5
```
2. Deploy the stacks when `cdk.context.json` is fully configured:
```bash
cdk deploy "*" --c contextId=migration-assistant --require-approval never --concurrency 3
```

### Stacks Deployed:
* Migration Assistant Network stack
* Reindex From Snapshot stack
* Migration Console stack

---

## Step 6 - Accessing the Migration Console
Run the following command to access the migration console:
```bash
./accessContainer.sh migration-console dev <region>
```
>[!NOTE]
>`accessContainer.sh` is located in `/opensearch-migrations/deployment/cdk/opensearch-service-migration/` on the bootstrap instance.

_Learn more [[Accessing the Migration Console]]_

---

## Step 7 - Checking Connection to Source & Target Clusters
To verify the connection to the clusters, run:
```bash
console clusters connection-check
```

### Expected Output:
* **Source Cluster:** Successfully connected!
* **Target Cluster:** Successfully connected!

_Learn more [[Console commands reference|Migration-Console-commands-references]]_

---

## Step 8 - Snapshot Creation
Run the following to initiate creating a snapshot from the source cluster
```
console snapshot create [...]
```

To check on the progress,
```
console snapshot status [...]
```
or, for more detail,
```
console snapshot status --deep-check [...]
```

Wait for the snapshot to complete before moving to the next step.

_Learn more [[Snapshot Creation Verification]] [[Snapshot Creation]]_

---

## Step 9 - Metadata Migration
Run the following command to migrate metadata:
```bash
console metadata migrate [...]
```

_Learn more [[Metadata Migration]]_

---

## Step 10 - RFS Document Migration
Start the backfill process:
```bash
console backfill start
```

Scale up the number of workers:
```bash
console backfill scale <NUM_WORKERS>
```

Check the status:
```bash
console backfill status
```

To stop the workers:
```bash
console backfill stop
```

_Learn more [[Backfill Execution]]_

---

## Step 11 - Monitoring
Use the following command for detailed monitoring:
```bash
console backfill status --deep-check
```

### Example Output:
```text
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

Logs and metrics are available in CloudWatch in the OpenSearchMigrations log group.

---

## Step 12 - Verify all documents were migrated 
Use the following query in CloudWatch Logs Insights to identify failed documents:
```bash
fields @message
| filter @message like "Bulk request succeeded, but some operations failed."
| sort @timestamp desc
| limit 10000
```

_Learn more [[Backfill Result Validation]]_