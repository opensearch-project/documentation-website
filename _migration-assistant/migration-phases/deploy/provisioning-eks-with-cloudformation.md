---
layout: default
title: CloudFormation
nav_order: 1
parent: Deploy on Amazon EKS
grand_parent: Choose your deployment
redirect_from:
  - /migration-assistant/migration-phases/deploy/deploying-to-eks/
---

# Provision Migration Assistant on Amazon EKS using AWS CloudFormation

To provision Migration Assistant on Amazon Elastic Kubernetes Service (EKS), use the `aws-bootstrap.sh` script. The script uses AWS CloudFormation to create the Amazon EKS cluster, virtual private cloud (VPC) networking, and Amazon CloudWatch integration. It also copies the container images into a private registry, configures snapshot helpers, and installs the Migration Assistant Helm chart.

## Prerequisites

Before you begin, ensure that you have the following:

- An AWS account with permissions for AWS CloudFormation, Amazon EKS, AWS Identity and Access Management (IAM), Amazon Elastic Compute Cloud (Amazon EC2), Amazon Elastic Container Registry (Amazon ECR), Amazon S3, Amazon CloudWatch, and related services.
- Either AWS CloudShell or a local terminal with AWS CLI v2, `kubectl`, and Helm installed. We recommend using AWS CloudShell because it is preconfigured with the required tools and avoids platform-specific issues (for example, the `tac` command used by the bootstrap script is not available on macOS by default).

To keep migration traffic off the public internet, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/) before you begin. The bootstrap script creates the VPC endpoints required for the cluster but does not establish private connectivity to the source or target cluster. You must arrange those connections separately. AWS PrivateLink also requires the cluster's provider to add your account to its allow list and accept the endpoint connection. VPC peering requires the peer to accept the connection and add a reciprocal route.
{: .note }

## Deployment label

Throughout this guide, `<STAGE>` refers to a short label such as `dev`, `staging`, or `prod`. It is used in cluster and resource names so you can keep multiple deployments separate.

## Step 1: Download the bootstrap script

Run these steps from AWS CloudShell or a local terminal using the tools listed in [Prerequisites](#prerequisites). We recommend using CloudShell.

Download the bootstrap script:

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

### Bootstrap flags

The following table lists the most commonly used flags. To see all available options for the version you downloaded, run `./aws-bootstrap.sh --help`.

| Flag | Typical use |
|:-----|:------------|
| `--deploy-create-vpc-cfn` | Create a new VPC and EKS cluster. |
| `--deploy-import-vpc-cfn` | Reuse an existing VPC using `--vpc-id` and `--subnet-ids`. |
| `--skip-cfn-deploy` | Re-bootstrap an existing cluster, skipping the CloudFormation deployment. |
| `--stack-name <name>` | Set the CloudFormation stack name for `--deploy-*-cfn`. |
| `--stage <name>` | Set the environment label used in resource names. |
| `--region <region>` | Choose the AWS Region. |
| `--vpc-id <id>` | Identify the existing VPC to reuse. |
| `--subnet-ids <id1,id2>` | Provide subnets in different Availability Zones. |
| `--grant-eks-access-only` | Grant access to an existing cluster and exit. |
| `--eks-access-principal-arn <arn>` | Specify the IAM principal to grant `cluster-admin` access. |
| `--version <tag>` | Pin the deployment to a specific published release for reproducibility. For available tags, see [Releases](https://github.com/opensearch-project/opensearch-migrations/releases). |

## Step 2: Deploy Migration Assistant into a new or existing VPC

Depending on your environment, deploy Migration Assistant into a new VPC or an existing VPC:

- To deploy into a new VPC using the latest published release, run the following command:

    ```bash
    ./aws-bootstrap.sh \
      --deploy-create-vpc-cfn \
      --stack-name MA \
      --stage dev \
      --region us-east-2
    ```
    {% include copy.html %}

Use a `stage` value that no other deployment in the same AWS Region uses. The AWS CloudFormation bootstrap script and the Terraform module share a cluster and repository naming pattern, so reusing the `stage` and Region of a live Terraform deployment causes a collision.
{: .note }

- To pin the deployment to a specific release version, run the following command:

    ```bash
    ./aws-bootstrap.sh \
      --deploy-create-vpc-cfn \
      --stack-name MA \
      --stage prod \
      --region us-east-2 \
      --version 3.2.1
    ```
    {% include copy.html %}

Pinning a version makes the deployment reproducible. If you need to deploy the same artifacts again or deploy using continuous integration (CI), always pass `--version`.
{: .note }

- To deploy into an existing VPC, run the following command:

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

The script installs the Helm chart and configures the Migration Console, Argo workflow controller, and Argo server.

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

After you access the console, the migration flow is identical across deployment paths: verify the version, load the sample configuration, run a pilot migration, validate it, and then run the full migration.

## Step 5: Use the AWS resources created by the deployment

The EKS path provides a default snapshot bucket and related configuration so you do not have to create these resources manually.

### Default S3 bucket

The deployment creates a default S3 bucket for migration artifacts and snapshots:

```text
s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>
```

### Snapshot role output

If your workflow needs a snapshot role Amazon Resource Name (ARN), retrieve it from the AWS CloudFormation stack outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name <YOUR_STACK_NAME> \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

## Private or isolated networks

If your subnets do not have direct internet access, add the `--create-vpc-endpoints` flag to the bootstrap command so that the script creates the VPC endpoints the cluster needs to pull images from inside the VPC:

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

For the VPC endpoints that this command creates, the additional endpoints some deployments need, and the way to access a source or target privately, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/#configuring-private-networking-using-a-bootstrap-script).

<!-- vale off -->
## Granting kubectl access to a CI role or another administrator
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

The script applies the EKS access entry and policy association for the principal and then exits. The script does not redeploy CloudFormation, copy images, run Helm, or update your `kubeconfig`. It skips the `jq`, `kubectl`, and `helm` prerequisite checks.

From the account owning the cluster, list the access entries to verify the principal was added:

```bash
aws eks list-access-entries \
  --cluster-name <CLUSTER_NAME> \
  --region <REGION>
```
{% include copy.html %}

Then list the access policies associated with the principal:

```bash
aws eks list-associated-access-policies \
  --cluster-name <CLUSTER_NAME> \
  --principal-arn arn:aws:iam::123456789012:role/MyCIRole \
  --region <REGION>
```
{% include copy.html %}

## Troubleshooting bootstrap failures

If CloudFormation fails, verify the CloudFormation stack status:

```bash
aws cloudformation describe-stacks --stack-name <STACK_NAME> --query "Stacks[0].StackStatus"
```
{% include copy.html %}

If the stack is in `ROLLBACK_COMPLETE` or `CREATE_FAILED` status, delete it and rerun the bootstrap script:

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

## Removing the EKS infrastructure

When you no longer need Migration Assistant for rollback, replay, or comparison, remove it. Do not remove it immediately after cutover. For the checklist of conditions to verify before removing, see [Removing migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/).

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
2. Load the sample workflow by running `workflow configure sample --load`.
3. Run `console clusters connection-check`.
4. Configure and run your first migration by following [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

