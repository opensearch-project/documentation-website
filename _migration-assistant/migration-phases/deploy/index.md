---
layout: default
title: Deploy
parent: Migration phases
nav_order: 2
has_children: true
has_toc: true
permalink: /migration-assistant/migration-phases/deploy/
redirect_from:
  - /migration-assistant/getting-started-with-data-migration/
  - /deploying-migration-assistant/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/deploy/
---

# Deploy

This quickstart assumes that you have performed an [assessment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/) to understand upgrade breaking changes and limitations before beginning.

This quickstart outlines how to deploy Migration Assistant for OpenSearch and execute an existing data migration using `Reindex-from-Snapshot` (RFS). It uses AWS for illustrative purposes. However, you can modify the steps for use with other cloud providers.

**Note**: Although this page focuses on RFS-only deployment, you can add capture and replay functionality or replace RFS options with  Capture and Replay  as described in [Configuration options]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/configuration-options/#live-capture-migration-with-cr).

Before using this quickstart, review [Is Migration Assistant right for you?]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/).

Because this guide uses [AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/), ensure that the `CDKToolkit` stack exists and is in the `CREATE_COMPLETE` state. For setup instructions, see the [CDK Toolkit documentation](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).

## Planning Your Deployment environment

Before beginning the deployment, consider the following environment planning steps:

- **Choose a unique stage name**: Avoid using "dev" if you have existing deployments or potential conflicts. Consider using "test", "staging", "prod", or other descriptive names.
- **Verify domain endpoints**: Ensure your source and target cluster endpoints are accessible and properly formatted.
- **Prepare authentication**: Have your cluster credentials and AWS Secrets Manager Amazon Resource Names (ARNs) ready.
- **Check AWS credentials**: Verify that your AWS credentials are properly configured for the target account and AWS Region.

## Prerequisites

Before proceeding with the deployment, ensure you have completed the following prerequisites.

### AWS environment setup
1. **Configure AWS credentials**: Run `aws configure` to set up your credentials or ensure environment variables are properly set.
2. **Verify account access**: Test your credentials with `aws sts get-caller-identity`.
3. **Check region**: Ensure you're deploying to the correct AWS Region.

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

## Step 3: Log in to Bootstrap and build Migration Assistant (~15 minutes)

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

1. Add the basic authentication information (username and password) for both the source and target clusters as separate secrets in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html). Each secret must include two key-value pairs: one for the username and one for the password. The plaintext of each secret should resemble the following example:

   ```json
   {"username":"admin","password":"myStrongPassword123!"}
   ```
   
   Be sure to copy the secret Amazon Resource Name (ARN) for use during deployment. 

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
                "userSecretArn": "<SECRET_WITH_USERNAME_AND_PASSWORD_KEYS>"
            }
        },
        "sourceCluster": {
            "endpoint": "<SOURCE CLUSTER ENDPOINT>",
            "version": "<SOURCE ENGINE VERSION>",
            "auth": {
                "type": "basic",
                "userSecretArn": "<SECRET_WITH_USERNAME_AND_PASSWORD_KEYS>"
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

    ### Environment configuration examples

    To avoid conflicts with existing deployments, consider using different context IDs and stage names:

    ```json
    {
    "test-deploy": {
        "stage": "test",
        "migrationAssistanceEnabled": true,
        "migrationConsoleServiceEnabled": true,
        "reindexFromSnapshotServiceEnabled": true,
        "sourceCluster": {
            "endpoint": "https://migration-source-es710.us-west-2.es.amazonaws.com",
            "version": "ES_7.10",
            "auth": {
                "type": "basic",
                "username": "admin",
                "passwordFromSecretArn": "arn:aws:secretsmanager:us-west-2:123456789012:secret:migration-source-password"
            }
        },
        "targetCluster": {
            "endpoint": "https://migration-target-os219.us-west-2.es.amazonaws.com",
            "auth": {
                "type": "basic",
                "username": "admin",
                "passwordFromSecretArn": "arn:aws:secretsmanager:us-west-2:123456789012:secret:migration-target-password"
            }
        }
    },
    "prod-deploy": {
        "stage": "prod",
        "migrationAssistanceEnabled": true,
        "migrationConsoleServiceEnabled": true,
        "reindexFromSnapshotServiceEnabled": true,
        "// ... additional production-specific configuration"
    }
    }
    ```
    {% include copy.html %}

    **Important Notes**:
    - Use unique `stage` values to prevent resource naming conflicts.
    - Ensure secret ARNs are complete and accessible in your deployment Region.
    - Domain endpoints can be simplified names or full AWS URLs.
    - Deploy using `./deploy.sh <contextId>` (for example, `./deploy.sh test-deploy`).

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

To learn more about migration console commands, see [Migration console command reference]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/migration-console-command-reference/).

---

## Troubleshooting

The following section covers common deployment issues and resolutions.

### Common deployment issues

**Problem: AWS credentials not configured**
```
Unable to locate credentials. You can configure credentials by running "aws configure".
```
**Resolution**:
1. Run `aws configure` and provide your access key, secret key, and Region.
2. Alternatively, set environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`.
3. Verify credentials with `aws sts get-caller-identity`.

**Problem: Stack naming conflicts**
```
Stack with id OSMigrations-dev-us-west-2-MigrationConsole already exists
```
**Resolution**:
1. Use a different `stage` value in your context configuration (for example, "test", "staging").
2. Or destroy existing stacks: `cdk destroy "*" --c contextId=<existing-context>`.
3. Ensure unique context IDs for parallel deployments.

**Problem: Docker build failures**
```
ERROR: failed to solve: public.ecr.aws/sam/build-nodejs18.x: pulling from host public.ecr.aws failed
```
**Resolution**:
1. Run `docker logout public.ecr.aws` to clear the authentication cache.
2. Retry the build process: `./buildDockerImages.sh`.

**Problem: CDK bootstrap required**
```
This stack uses assets, so the toolkit stack must be deployed to the environment
```
**Resolution**:
1. Bootstrap the CDK in your Region: `cdk bootstrap --c contextId=<your-context>`.
2. Ensure you have configured the correct AWS credentials and Region.

### Rollback procedures

If you need to remove a deployment:

1. **Stop all running services**:
   ```bash
   console backfill stop  # If backfill is running
   ```

2. **Destroy CDK stacks**:
   ```bash
   cdk destroy "*" --c contextId=<your-context> --force
   ```

3. **Clean up manually if needed**:
   - Remove any remaining CloudFormation stacks from the AWS Management Console.
   - Delete any orphaned resources, for example, Amazon Elastic Container Service (Amazon ECS) tasks and load balancers.

---

## Next steps

After completing the deployment, proceed with the migration phases:

1. **[Create a snapshot]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/create-snapshot/)**: Create a snapshot of your source cluster.
2. **[Migrate metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/)**: Migrate cluster metadata to the target.
3. **[Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)**: Migrate documents and monitor the process.

For more information about the complete migration process, see [Migration phases]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/).

{% include migration-phase-navigation.html %}
