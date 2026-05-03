---
layout: default
title: Deploy on Amazon EKS
nav_order: 2
grand_parent: Migration workflows
parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/deploying-to-eks/
---

# Deploy on Amazon EKS

This is the recommended production path for AWS customers. You get the same Migration Assistant engine and workflows as generic Kubernetes, but the EKS tooling removes much of the AWS platform work that otherwise slows migrations down.

In practice, EKS is not about changing how migrations run. It is about making the migration **easier to deploy, easier to secure, and easier to operate**.

## What EKS gives you

The bootstrap path prepares AWS infrastructure around the workflow engine, including:

- EKS cluster deployment into a new or existing VPC
- pod identity for the Migration Console and workflow pods
- image mirroring and VPC endpoint support for isolated subnets
- default S3 bucket and snapshot-role helpers
- CloudWatch logging and dashboards
- AWS-aware storage and node-pool defaults

If you are migrating to or from Amazon OpenSearch Service, this is usually the shortest path to a working production setup.

## Prerequisites

- an AWS account with permissions for CloudFormation, EKS, IAM, EC2, ECR, S3, CloudWatch, and related services
- either AWS CloudShell or a local terminal with AWS CLI v2, `kubectl`, and Helm installed

## Understand the deployment label

Throughout this guide, `<STAGE>` is a short label such as `dev`, `staging`, or `prod`. It is used in cluster and resource names so you can keep multiple deployments separate.

## Step 1: Download the bootstrap script

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

Run `./aws-bootstrap.sh --help` if you want to inspect the available options before deploying.

## Step 2: Deploy into a new or existing VPC

### New VPC

```bash
./aws-bootstrap.sh \
  --deploy-create-vpc-cfn \
  --stack-name MA \
  --stage dev \
  --region us-east-2
```
{% include copy.html %}

### Existing VPC

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

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
kubectl get pods -n ma
```
{% include copy.html %}

You should see the Migration Console, the Argo workflow controller, and the Argo server in `Running` state.

## Step 4: Access the Migration Console

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Once you are in the console, the migration flow is the same as any other deployment: check the version, load the sample config, run a pilot, validate, and then run the full migration.

## Step 5: Use the AWS helpers the deployment created for you

The EKS path usually gives you a default snapshot bucket and related configuration so you do not have to build this wiring manually.

### Default S3 bucket

The deployment creates a default S3 bucket for migration artifacts and snapshots:

```text
s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>
```

### Snapshot role output

If your workflow needs a snapshot role ARN, look it up from the CloudFormation outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name <YOUR_STACK_NAME> \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

## Authentication on EKS

### Basic auth

Basic auth works the same way as generic Kubernetes: create Kubernetes secrets and reference them in `authConfig.basic.secretName`.

### SigV4

This is where EKS changes the customer experience the most.

For SigV4-authenticated sources or targets, the solution stack associates IAM roles with the service accounts used by:

- the `migration-console-access-role` pod
- the `argo-workflow-executor` workflow pods

That means the console and the migration jobs can authenticate to Amazon OpenSearch Service and other AWS services without you manually distributing long-lived AWS credentials.

This is one of the main reasons EKS is the recommended AWS production path.

## Private or isolated networks

If your subnets do not have direct internet access, use the bootstrap options that mirror images into private ECR and create the required VPC endpoints:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --push-all-images-to-private-ecr \
  --create-vpc-endpoints \
  --stack-name MA-Prod \
  --stage prod \
  --vpc-id vpc-xxx \
  --subnet-ids subnet-aaa,subnet-bbb \
  --region us-east-1
```
{% include copy.html %}

## Recovery if bootstrap fails

If CloudFormation fails, check the stack status first:

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

## Cleanup

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
aws cloudformation delete-stack --stack-name <STACK_NAME>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

## What to do next

1. Open the Migration Console and run `console --version`.
2. Load the sample workflow with `workflow configure sample --load`.
3. Run `console clusters connection-check`.
4. Continue with [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

{% include migration-phase-navigation.html %}
