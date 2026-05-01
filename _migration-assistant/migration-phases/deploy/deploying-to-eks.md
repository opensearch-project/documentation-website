---
layout: default
title: Deploying to EKS
nav_order: 2
grand_parent: Migration phases
parent: Deploy
permalink: /migration-assistant/migration-phases/deploy/deploying-to-eks/
---

# Deploying to Amazon EKS

This guide covers deploying Migration Assistant to Amazon Elastic Kubernetes Service (EKS) using CloudFormation and the bootstrap script.

For generic Kubernetes deployment, see [Deploying to Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/).

## Prerequisites

- **AWS account** with appropriate permissions
- **One of the following**:
  - **AWS CloudShell** (recommended) — pre-configured terminal environment
  - **Local terminal** with [AWS CLI 2.x](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed

## Understanding STAGE

Throughout this guide, `<STAGE>` refers to a user-chosen deployment label (for example, `dev`, `staging`, `prod`). This label:
- Distinguishes multiple deployments in the same account/region
- Appears in resource names: `migration-eks-cluster-<STAGE>-<REGION>`
- Is set using the `--stage` flag in the bootstrap script (defaults to `dev`)

## Installation

### Step 1: Access AWS CloudShell

Open AWS CloudShell from the AWS Console using the account and identity for the deployment.

Alternatively, run from any terminal with AWS CLI and kubectl installed with credentials loaded.
{: .note }

### Step 2: Download and run the bootstrap script

Download the bootstrap script from the latest release:

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

**Deploy with a new VPC:**

```bash
./aws-bootstrap.sh \
  --deploy-create-vpc-cfn \
  --stack-name MA \
  --stage dev \
  --region us-east-2
```
{% include copy.html %}

**Deploy into an existing VPC:**

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

Run `./aws-bootstrap.sh --help` for the full list of options.

The script deploys an EKS cluster via CloudFormation, installs the Helm chart, and configures CloudWatch dashboards.
{: .note }

### Step 3: Verify deployment

After the bootstrap script completes:

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
kubectl get pods -n ma
```
{% include copy.html %}

Expected output:

```
NAME                                    READY   STATUS    RESTARTS   AGE
argo-workflows-server-xxxxxxxxx-xxxxx   1/1     Running   0          5m
argo-workflows-workflow-controller-xx   1/1     Running   0          5m
migration-console-0                     1/1     Running   0          5m
```

### Step 4: Access the Migration Console

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

## Isolated and air-gapped networks

For subnets without internet access, the bootstrap script can mirror all required container images and Helm charts to your private ECR registry:

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

The `--push-all-images-to-private-ecr` flag mirrors ~50 images and 11 Helm charts to ECR. The `--create-vpc-endpoints` flag creates the required VPC endpoints (ECR, S3, CloudWatch Logs, EFS, STS, EKS Auth).

## Snapshot configuration

When migrating from Amazon OpenSearch Service or Amazon Elasticsearch Service, you need the S3 bucket URI and snapshot role ARN for your workflow configuration.

### Default S3 bucket

The EKS deployment automatically creates an S3 bucket and mounts it read-only on the Migration Console at `/s3/artifacts`:

```
s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>
```

### Snapshot role ARN

Find the snapshot role created by CloudFormation:

```bash
aws cloudformation describe-stacks \
  --stack-name <YOUR_STACK_NAME> \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

Use these values in your workflow configuration. Run `workflow configure sample` on the Migration Console to see the exact fields.

## Error recovery

If the bootstrap script fails:

1. **Check CloudFormation status**:
   ```bash
   aws cloudformation describe-stacks --stack-name <STACK_NAME> --query "Stacks[0].StackStatus"
   ```

2. **For stack failures** (ROLLBACK_COMPLETE or CREATE_FAILED):
   ```bash
   aws cloudformation delete-stack --stack-name <STACK_NAME>
   aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
   ```
   Then re-run the bootstrap script.

3. **For Helm failures** (CloudFormation succeeded but Helm failed):
   ```bash
   ./aws-bootstrap.sh --skip-cfn-deploy --stage <STAGE> --region <REGION>
   ```

## Reconnecting to the Migration Console

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

## Cleanup

To remove the EKS deployment:

```bash
# Remove Helm release
helm uninstall -n ma ma
kubectl -n ma delete pvc --all

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name <STACK_NAME>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

## Next steps

1. [Workflow CLI overview]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) — Learn about the Workflow CLI concepts
2. [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/) — Run your first migration

{% include migration-phase-navigation.html %}
