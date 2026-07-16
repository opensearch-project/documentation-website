---
layout: default
title: Deploy on Amazon EKS
nav_order: 2
grand_parent: Migration workflows
parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/deploying-to-eks/
---

# Deploy on Amazon EKS

This is the recommended production path on AWS. You receive the same Migration Assistant engine and workflows as generic Kubernetes, but the Amazon Elastic Kubernetes Service (EKS) tooling removes much of the AWS platform work that otherwise delays migrations.

EKS makes the migration **easier to deploy, easier to secure, and easier to operate** without changing how migrations run.

## EKS deployment components

The bootstrap path prepares AWS infrastructure around the workflow engine, including:

- EKS cluster deployment into a new or existing virtual private cloud (VPC).
- Pod identity for the Migration Console and workflow pods.
- Image mirroring and VPC endpoint support for isolated subnets.
- Default Amazon Simple Storage Service (Amazon S3) bucket and snapshot-role helpers.
- Amazon CloudWatch logging and dashboards.
- AWS-aware storage and node-pool defaults.

If you are migrating to or from Amazon OpenSearch Service, this is usually the shortest path to a working production setup.

## Prerequisites

Before you begin, make sure you have the following:

- An AWS account with permissions for AWS CloudFormation, Amazon EKS, AWS Identity and Access Management (IAM), Amazon EC2, Amazon Elastic Container Registry (Amazon ECR), Amazon S3, Amazon CloudWatch, and related services.
- Either AWS CloudShell or a local terminal with AWS CLI v2, `kubectl`, and Helm installed. AWS CloudShell is recommended because it comes preconfigured with the required tools and avoids platform-specific issues (for example, the `tac` command used by the bootstrap script is not available on macOS by default).

## Deployment label

Throughout this playbook, `<STAGE>` is a short label such as `dev`, `staging`, or `prod`. It is used in cluster and resource names so you can keep multiple deployments separate.

## Step 1: Download the bootstrap script

Download the bootstrap script:

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

### Bootstrap flag reference

Run `./aws-bootstrap.sh --help` to view the available flags for the version you downloaded.

The following flags cover the most common cases. The script always installs the matching Helm chart and CloudWatch dashboards after the CloudFormation stack succeeds.

| Group | Flag | Purpose |
|:------|:-----|:--------|
| **Mode (one required)** | `--deploy-create-vpc-cfn` | Create a new VPC and EKS cluster |
| | `--deploy-import-vpc-cfn` | Reuse an existing VPC. Requires `--vpc-id` and `--subnet-ids` |
| | `--skip-cfn-deploy` | Skip CloudFormation. Use when the stack already exists and you only want to re-bootstrap the cluster |
| **Identity** | `--stack-name <name>` | CloudFormation stack name (required with `--deploy-*-cfn`) |
| | `--stage <name>` | Short label for cluster and resource names. Defaults to `dev` |
| | `--region <region>` | AWS region |
| | `--vpc-id <id>` | Existing VPC ID (with `--deploy-import-vpc-cfn`) |
| | `--subnet-ids <id1,id2>` | Comma-separated subnets in different AZs (with `--deploy-import-vpc-cfn`) |
| **Versioning** | `--version <tag>` | Pin to a published GitHub release tag. Find tags at [the GitHub releases page](https://github.com/opensearch-project/opensearch-migrations/releases). Use this for reproducible deployments. |
| | `--build` | Build all artifacts from source (requires a repo checkout). Mutually exclusive with `--version` |
| **Networking** | `--create-vpc-endpoints` | Create the five VPC endpoints needed for isolated subnets (S3, ECR API, ECR Docker, CloudWatch Logs, EFS) |
| | `--use-public-images` | Skip mirroring images into private ECR. Use only when the cluster has internet access and you do not want a private mirror |
| | `--ma-images-source <registry>` | Copy Migration Assistant images from another ECR registry. Useful when images were built on a separate cluster with internet access |
| **Access** | `--eks-access-principal-arn <arn>` | Grant a CI role or teammate cluster-admin access. Combine with `--skip-cfn-deploy --skip-console-exec` to grant access without redeploying |
| | `--kubectl-context <name>` | Set a custom alias for the `kubectl` context (defaults to the EKS cluster name) |
| | `--skip-setting-k8s-context` | Don't switch your active `kubectl` context to the new cluster |
| | `--skip-console-exec` | Don't auto-exec into the console pod when the script finishes |
| **TLS** (Capture proxy) | `--tls-mode none` | No TLS termination on the capture proxy (default) |
| | `--tls-mode self-signed` | cert-manager-issued self-signed certificate |
| | `--tls-mode pca-existing --pca-arn <arn>` | Use an existing AWS Private CA |
| | `--tls-mode pca-create` | Create a new AWS Private CA through ACK |
| **Helm** | `--namespace <name>` | Override the Migration Assistant namespace (default: `ma`) |
| | `--helm-values <path>` | Extra values file for the Helm install---for example, to customize `workloadsNodePool.architectures` |
| | `--use-general-node-pool` | Use the EKS Auto Mode general-purpose pool instead of the production Karpenter NodePool |

## Step 2: Deploy into a new or existing VPC

Deploy Migration Assistant into either a new VPC or an existing VPC.

### New VPC (latest published release)

To deploy into a new VPC using the latest published release, run the following command:

```bash
./aws-bootstrap.sh \
  --deploy-create-vpc-cfn \
  --stack-name MA \
  --stage dev \
  --region us-east-2
```
{% include copy.html %}

### New VPC pinned to a specific release

To pin the deployment to a specific release version, run the following command:

```bash
./aws-bootstrap.sh \
  --deploy-create-vpc-cfn \
  --stack-name MA \
  --stage prod \
  --region us-east-2 \
  --version 3.2.1
```
{% include copy.html %}

Pinning a version makes the deployment reproducible. If you need to deploy the same artifacts again (or use CI), always pass `--version`.
{: .note }

### Existing VPC

To deploy into an existing VPC, run the following command:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --stack-name MA \
  --stage dev \
  --vpc-id vpc-0abc123 \
  --subnet-ids subnet-111,subnet-222 \
  --region us-east-2
```
{% include copy.html %}

When the script finishes, it has already installed the Helm chart and configured the core platform pieces.

## Step 3: Verify the deployment

To verify the deployment, run the following commands:

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
```
{% include copy.html %}

```bash
kubectl get pods -n ma
```
{% include copy.html %}

You should see the Migration Console, the Argo workflow controller, and the Argo server in `Running` state.

## Step 4: Access the Migration Console

Access the Migration Console:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Once you access the console, the migration flow is the same as any other deployment: verify the version, load the sample configuration, run a pilot migration, validate it, and then run the full migration.

## Step 5: Use the AWS helpers the deployment created for you

The EKS path provides a default snapshot bucket and related configuration so you do not have to build it manually.

### Default S3 bucket

The deployment creates a default S3 bucket for migration artifacts and snapshots:

```text
s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>
```

### Snapshot role output

If your workflow needs a snapshot role Amazon Resource Name (ARN), look it up from the CloudFormation outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name <YOUR_STACK_NAME> \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

## Authentication on EKS

Migration Assistant supports the following authentication methods on EKS.

### Basic authentication

Basic authentication works the same way as generic Kubernetes: create Kubernetes secrets and reference them in `authConfig.basic.secretName`.

### Authenticate with AWS Signature Version 4

AWS Signature Version 4 authentication is the primary advantage of deploying on EKS.

For sources or targets authenticated using AWS Signature Version 4, the EKS stack uses [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) to assign an AWS identity to two sets of pods:

- The Migration Console pod (`migration-console-0`), which runs under the `migration-console-access-role` service account.
- The Argo workflow executor pods, which run under the `argo-workflow-executor` service account.

This means the console and the migration jobs can authenticate to Amazon OpenSearch Service and other AWS services without you manually distributing long-lived AWS credentials.

This is one of the main reasons EKS is the recommended AWS production path.

## Private or isolated networks

If your subnets do not have direct internet access, the bootstrap script mirrors images into private ECR by default and creates the VPC endpoints needed to pull from inside the cluster:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --create-vpc-endpoints \
  --stack-name MA-Prod \
  --stage prod \
  --vpc-id vpc-xxx \
  --subnet-ids subnet-aaa,subnet-bbb \
  --region us-east-1 \
  --version 3.2.1
```
{% include copy.html %}

The mirroring step runs from your machine (which has internet), copies the release images and Helm charts to ECR, then the EKS cluster pulls everything through VPC endpoints. The endpoints created are: Amazon S3, Amazon ECR API, Amazon ECR Docker, CloudWatch Logs, and Amazon Elastic File System (Amazon EFS).

If your deployment also requires STS or EKS Authentication endpoints (for example, for IRSA or EKS Pod Identity), create those separately before running the bootstrap script.

If you prefer to manage VPC endpoints with another tool, omit `--create-vpc-endpoints`. The script still mirrors images and uses your existing endpoints.

<!-- vale off -->
## Grant kubectl access to a CI role or teammate
<!-- vale on -->

You can run the bootstrap script in access-only mode after the stack is already deployed:

```bash
./aws-bootstrap.sh \
  --skip-cfn-deploy \
  --eks-access-principal-arn arn:aws:iam::123456789012:role/MyCIRole \
  --stage dev \
  --region us-east-2 \
  --skip-console-exec
```
{% include copy.html %}

This grants the principal cluster-admin access to the existing EKS cluster without redeploying anything else.

## Recovery if bootstrap fails

If CloudFormation fails, verify the stack status:

```bash
aws cloudformation describe-stacks --stack-name <STACK_NAME> --query "Stacks[0].StackStatus"
```
{% include copy.html %}

If the stack is stuck in `ROLLBACK_COMPLETE` or `CREATE_FAILED`, delete it and rerun the bootstrap script:

```bash
aws cloudformation delete-stack --stack-name <STACK_NAME>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

If CloudFormation succeeded but the Helm portion failed, rerun only the bootstrap's cluster-side steps:

```bash
./aws-bootstrap.sh --skip-cfn-deploy --stage <STAGE> --region <REGION>
```
{% include copy.html %}

## Removal

To remove Migration Assistant from EKS, run the following commands:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
aws cloudformation delete-stack --stack-name <STACK_NAME>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

## Next steps

1. Open the Migration Console and run `console --version`.
2. Load the sample workflow with `workflow configure sample --load`.
3. Run `console clusters connection-check`.
4. Continue with [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

{% include migration-phase-navigation.html %}
