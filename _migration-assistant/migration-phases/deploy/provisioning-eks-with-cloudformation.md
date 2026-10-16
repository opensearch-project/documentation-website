---
layout: default
title: CloudFormation
nav_order: 1
parent: Deploy on Amazon EKS
grand_parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/deploying-to-eks/
---

# Provision with CloudFormation

The bootstrap script provisions the Amazon Elastic Kubernetes Service (EKS) infrastructure for Migration Assistant using AWS CloudFormation. It creates the cluster, virtual private cloud (VPC) networking, image mirroring, snapshot helpers, and Amazon CloudWatch integration, then installs the Migration Assistant Helm chart.

## Prerequisites

Before you begin, make sure you have the following:

- An AWS account with permissions for AWS CloudFormation, Amazon EKS, AWS Identity and Access Management (IAM), Amazon Elastic Compute Cloud (Amazon EC2), Amazon Elastic Container Registry (Amazon ECR), Amazon S3, Amazon CloudWatch, and related services.
- Either AWS CloudShell or a local terminal with AWS CLI v2, `kubectl`, and Helm installed. AWS CloudShell is recommended because it comes preconfigured with the required tools and avoids platform-specific issues (for example, the `tac` command used by the bootstrap script is not available on macOS by default).

If your migration must not traverse the public internet, read [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/) before you begin. The bootstrap script creates the VPC endpoints the cluster needs, but it does not establish a private path to the source or target cluster, so arrange that connection yourself. AWS PrivateLink also requires the cluster's provider to allow-list your account and accept the endpoint connection, and VPC peering requires the peer to accept the connection and add a reciprocal route.
{: .note }

## Deployment label

Throughout this guide, `<STAGE>` is a short label such as `dev`, `staging`, or `prod`. It is used in cluster and resource names so you can keep multiple deployments separate.

## Step 1: Download the bootstrap script

Run these steps from AWS CloudShell or a local terminal with the tools listed in [Prerequisites](#prerequisites). CloudShell is recommended because it comes preconfigured and avoids platform-specific issues.

Download the bootstrap script:

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

### Bootstrap flag reference

The following table lists the most commonly used flags. To see all available options for the version you downloaded, run `./aws-bootstrap.sh --help`.

| Group | Flag | Typical use |
|:------|:-----|:------------|
| Mode | `--deploy-create-vpc-cfn` | Create a new VPC and EKS cluster |
| | `--deploy-import-vpc-cfn` | Reuse an existing VPC with `--vpc-id` and `--subnet-ids` |
| | `--skip-cfn-deploy` | Re-bootstrap an existing cluster without rerunning CloudFormation |
| Identity | `--stack-name <name>` | Set the CloudFormation stack name for `--deploy-*-cfn` |
| | `--stage <name>` | Set the environment label used in resource names |
| | `--region <region>` | Choose the AWS Region |
| Networking | `--vpc-id <id>` | Identify the existing VPC to reuse |
| | `--subnet-ids <id1,id2>` | Provide subnets in different Availability Zones |
| Access | `--grant-eks-access-only` | Grant access to an existing cluster and exit |
| | `--eks-access-principal-arn <arn>` | Specify the IAM principal to grant `cluster-admin` access |
| Versioning | `--version <tag>` | Pin to a specific published release for reproducible deployments. For available tags, see [Releases](https://github.com/opensearch-project/opensearch-migrations/releases) |

## Step 2: Deploy into a new or existing VPC

Deploy Migration Assistant into either a new VPC or an existing VPC.

### New VPC using the latest published release

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

Pinning a version makes the deployment reproducible. If you need to deploy the same artifacts again or deploy through continuous integration (CI), always pass `--version`.
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

When the script finishes, it has installed the Helm chart and configured the Migration Console, the Argo workflow controller, and the Argo server.

## Step 3: Verify the deployment

First, point `kubectl` at the new cluster:

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
```
{% include copy.html %}

Then list the pods in the `ma` namespace:

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

After you access the console, the migration flow is the same as for any other deployment: verify the version, load the sample configuration, run a pilot migration, validate it, and then run the full migration.

## Step 5: Use the AWS resources created by the deployment

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

## Private or isolated networks

If your subnets do not have direct internet access, add `--create-vpc-endpoints` so that the script creates the VPC endpoints the cluster needs to pull images from inside the VPC:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --create-vpc-endpoints \
  --stack-name MA-Prod \
  --stage prod \
  --vpc-id vpc-xxx \
  --subnet-ids subnet-aaa,subnet-bbb \
  --region us-east-2 \
  --version 3.2.1
```
{% include copy.html %}

For the endpoints this creates, the additional endpoints some deployments need, and how to reach a source or target privately, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/#private-networks-with-the-bootstrap-script).

<!-- vale off -->
## Grant kubectl access to a CI role or teammate
<!-- vale on -->

After the cluster is bootstrapped, run the script in grant-only mode to add a second admin principal:

```bash
./aws-bootstrap.sh \
  --grant-eks-access-only \
  --eks-access-principal-arn arn:aws:iam::123456789012:role/MyCIRole \
  --stage dev \
  --region us-east-2
```
{% include copy.html %}

The script applies the EKS access entry and policy association for the principal and then exits. It does not redeploy CloudFormation, mirror images, run Helm, or update your `kubeconfig`, and it skips the `jq`, `kubectl`, and `helm` prerequisite checks.

From the cluster-owning account, verify the access entry and its associated policies:

```bash
aws eks list-access-entries \
  --cluster-name <CLUSTER_NAME> \
  --region <REGION>

aws eks list-associated-access-policies \
  --cluster-name <CLUSTER_NAME> \
  --principal-arn arn:aws:iam::123456789012:role/MyCIRole \
  --region <REGION>
```
{% include copy.html %}

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

Once you no longer need Migration Assistant for rollback, replay, or comparison, remove it. Do not remove it immediately after cutover. For the readiness checklist, see [Removing migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/).

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
