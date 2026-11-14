---
layout: default
title: Terraform
nav_order: 2
parent: Deploy on Amazon EKS
grand_parent: Choose your deployment
---

# Provision Migration Assistant on Amazon EKS using Terraform

A Terraform module provisions the Amazon Elastic Kubernetes Service (Amazon EKS) infrastructure for Migration Assistant: an EKS Auto Mode cluster, virtual private cloud (VPC) networking, Amazon Elastic Container Registry (Amazon ECR), AWS Identity and Access Management (IAM) roles, snapshot access, and EKS Pod Identity.

## Prerequisites

Before you begin, ensure that you have the following:

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.6 or later or [OpenTofu](https://opentofu.org/docs/intro/install/) 1.6 or later.
- AWS credentials authorized to manage VPC, EKS, Amazon ECR, IAM, and VPC endpoint resources.
- AWS CLI v2 and [`kubectl`](https://kubernetes.io/docs/tasks/tools/) for cluster access after provisioning.
- Network access to public Helm and container registries if you install the chart using Terraform.

EKS Auto Mode must be available in your AWS Region for the Kubernetes version you select. The `kubernetes_version` variable defaults to `1.35`; override it if that version is not offered in your Region.
{: .note }

To keep migration traffic off the public internet, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/) before you begin. Two connectivity options require action from an external provider: AWS PrivateLink requires the cluster's provider to add your account to its allow list and accept the endpoint connection, and VPC peering requires the peer to accept the connection and add a reciprocal route.
{: .note }

## Step 1: Clone the module

The module is published in the [`opensearch-migrations` repository](https://github.com/opensearch-project/opensearch-migrations) under `deployment/terraform/aws`. Clone the release tag you want to deploy, replacing `<RELEASE_TAG>` with a published version:

```bash
git clone --branch <RELEASE_TAG> --depth 1 --single-branch \
  https://github.com/opensearch-project/opensearch-migrations.git
```
{% include copy.html %}

Navigate to the Terraform module directory:

```bash
cd opensearch-migrations/deployment/terraform/aws
```
{% include copy.html %}

The module installs the Helm chart from the same clone, so do not delete or move the cloned repository until the deployment is complete.

## Step 2: Provision the infrastructure

The default configuration creates a dual-stack VPC across two Availability Zones, one Network Address Translation (NAT) gateway per zone, an EKS Auto Mode cluster, a private ECR repository, the cluster and workload IAM roles, and EKS Pod Identity associations:

```bash
terraform init
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev"
```
{% include copy.html %}

Use a `stage` value that no other deployment in the same AWS Region uses. Terraform and the AWS CloudFormation bootstrap script share a cluster and repository naming pattern, so reusing the `stage` and Region of a live CloudFormation deployment causes a collision.
{: .note }

The new VPC uses the Classless Inter-Domain Routing (CIDR) block `10.212.0.0/16`. Override `vpc_cidr` if that range overlaps a source, target, peered, or transit-connected network.

### Common variables

The following table describes the frequently used variables. For the complete list, see the module's `variables.tf`.

| Variable | Default | Purpose |
|:---------|:--------|:--------|
| `region` | `us-east-1` | The AWS Region for the infrastructure. |
| `stage` | `dev` | A short identifier used in resource names. Must be unique per deployment in a Region. |
| `kubernetes_version` | `1.35` | The EKS control plane version. |
| `create_vpc` | `true` | Whether to create a new VPC (`true`) or use an existing one (`false`). |
| `vpc_cidr` | `10.212.0.0/16` | The IPv4 CIDR block for a VPC created by the module. |
| `isolated` | `false` | Whether to provision a VPC with no outbound internet path (air-gapped). |
| `deploy_helm` | `false` | Whether to install the Migration Assistant Helm chart after the cluster is ready. |
| `migration_assistant_version` | `null` | The image tag used when `deploy_helm` is `true`. Required when `deploy_helm` is `true`. |
| `permissions_boundary_arn` | `null` | The IAM permissions boundary applied to every role the module creates. |
| `create_opensearch_service_snapshot_role` | `true` | Whether to create the role that Amazon OpenSearch Service assumes for S3 snapshots. |

If your account requires a specific permissions boundary for `iam:CreateRole` requests, set `permissions_boundary_arn`. If your source is a self-managed Elasticsearch or OpenSearch cluster, set `create_opensearch_service_snapshot_role` to `false`. These clusters register their snapshot repositories without assuming an AWS role, so the role is unnecessary.

### Using an existing VPC

Provide at least two subnets in distinct Availability Zones. We recommend private subnets with NAT or equivalent egress. The following example configures an existing VPC:

```hcl
create_vpc          = false
existing_vpc_id     = "vpc-0123456789abcdef0"
existing_subnet_ids = [
  "subnet-0123456789abcdef0",
  "subnet-abcdef01234567890",
]

vpc_endpoints = ["s3", "ecr.api", "ecr.dkr", "logs", "sts", "eks-auth"]
```
{% include copy.html %}

The VPC endpoints that the module creates depend on whether it also creates the VPC:

- When the module creates the VPC, it always creates the `s3`, `ecr.api`, `ecr.dkr`, `logs`, and `elasticfilesystem` endpoints and adds any values in `vpc_endpoints` to that set.
- When you use an existing VPC, the module creates only the endpoints that you name in `vpc_endpoints`.

When `existing_route_table_ids` is empty, Terraform discovers the route table associated with each subnet you supply for the S3 gateway endpoint. Set the route table IDs explicitly if the subnets are implicitly associated with the main route table.

## Step 3: Configure cluster access

Terraform generates the cluster name, so run the command that the module outputs:

```bash
$(terraform output -raw kubeconfig_command)
kubectl get nodes
```
{% include copy.html %}

The `migration_environment` output contains the same shell exports that the CloudFormation bootstrap provides using `MigrationsExportString`. Review the values before you apply them to your shell:

```bash
terraform output -raw migration_environment
```
{% include copy.html %}

The output is a single line of `export` statements containing the cluster name, ECR registry, AWS account, Region, VPC ID, cluster security group, snapshot role, and stage. After you confirm the values, load them:

```bash
eval "$(terraform output -raw migration_environment)"
```
{% include copy.html %}

## Step 4: Install Migration Assistant

Helm installation is disabled by default so that you can provision infrastructure first and copy images before deploying Migration Assistant. This differs from the bootstrap script, which always installs the chart.

To have Terraform install the chart using published public ECR images, set `deploy_helm` and a release tag:

```bash
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev" \
  -var="deploy_helm=true" \
  -var="migration_assistant_version=3.4.1"
```
{% include copy.html %}

Use a published Migration Assistant release tag. Terraform applies the `valuesEks.yaml` overlay, passes the AWS account, Region, stage, and snapshot role to the chart, and waits up to `helm_timeout_seconds` (1,500 seconds, or 25 minutes) for the release.

Alternatively, leave `deploy_helm` at `false` and install the chart yourself. The module creates a private ECR repository and exposes it as the `ecr_repository_url` output for images copied from the public registry or built locally.

## Keep migration traffic private

To keep migration traffic off the public internet, you can make the source, target, snapshot, and control plane legs private independently. The private networking options use the same variables as [Step 2](#step-2-provision-the-infrastructure), so configure them before you apply. For the leg model, the `isolated` mode, and the `source_connectivity` and `target_connectivity` variables, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/).

## Validate the module

The module's tests use Terraform mock providers and require no AWS credentials. To validate the module, run the following commands:

Initialize the providers without a backend:

```bash
terraform init -backend=false
```
{% include copy.html %}

Check formatting:

```bash
terraform fmt -check -recursive
```
{% include copy.html %}

Validate the configuration:

```bash
terraform validate
```
{% include copy.html %}

Run the tests:

```bash
terraform test
```
{% include copy.html %}

## Removing the EKS infrastructure

When you no longer need Migration Assistant for rollback, replay, or comparison, remove it. Do not remove it immediately after cutover. For the readiness checklist, see [Removing migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/).

Destroying the module removes the EKS environment and any Helm release in the same state. Review the plan carefully before you confirm:

```bash
terraform destroy \
  -var="region=us-east-1" \
  -var="stage=dev"
```
{% include copy.html %}

Terraform does not modify a CloudFormation deployment or its resources.

## Next steps

- To verify the deployment, access the Migration Console, and run a migration, continue with the corresponding steps in [Provision Migration Assistant on Amazon EKS using AWS CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-cloudformation/#step-3-verify-the-deployment). All steps after provisioning are identical on both paths.
- To configure and run migrations, see [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

