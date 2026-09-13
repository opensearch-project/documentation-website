---
layout: default
title: Terraform
nav_order: 2
parent: Deploy on Amazon EKS
grand_parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/provisioning-eks-with-terraform/
---

# Provision with Terraform

A Terraform module provisions the Amazon Elastic Kubernetes Service (EKS) infrastructure for Migration Assistant: an EKS Auto Mode cluster, virtual private cloud (VPC) networking, Amazon Elastic Container Registry (Amazon ECR), AWS Identity and Access Management (IAM) roles, snapshot access, and EKS Pod Identity.

## Prerequisites

Before you begin, make sure you have the following:

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.6 or later, or [OpenTofu](https://opentofu.org/docs/intro/install/) 1.6 or later.
- AWS credentials authorized to manage VPC, EKS, Amazon ECR, IAM, and VPC endpoint resources.
- AWS CLI v2 and [`kubectl`](https://kubernetes.io/docs/tasks/tools/) for cluster access after provisioning.
- Network access to public Helm and container registries if you install the chart with Terraform.

EKS Auto Mode must be available in your region for the Kubernetes version you select. The `kubernetes_version` variable defaults to `1.35`; override it if that version is not offered in your region.
{: .note }

If your migration must not traverse the public internet, read [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/) before you begin, because two of the options depend on another party: AWS PrivateLink requires the cluster's provider to allow-list your account and accept the endpoint connection, and VPC peering requires the peer to accept the connection and add a reciprocal route.
{: .note }

## Step 1: Get the module

The module is published in the [`opensearch-migrations` repository](https://github.com/opensearch-project/opensearch-migrations) under `deployment/terraform/aws`. Clone the release tag you want to deploy, replacing `<RELEASE_TAG>` with a published version:

```bash
git clone --branch <RELEASE_TAG> --depth 1 --single-branch \
  https://github.com/opensearch-project/opensearch-migrations.git
cd opensearch-migrations/deployment/terraform/aws
```
{% include copy.html %}

The module installs the Helm chart from the same clone, so keep the repository in place until the deployment is complete.

## Step 2: Provision the infrastructure

The default configuration creates a dual-stack VPC across two availability zones, one NAT gateway per zone, an EKS Auto Mode cluster, a private ECR repository, the cluster and workload IAM roles, and EKS Pod Identity associations:

```bash
terraform init
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev"
```
{% include copy.html %}

Use a `stage` value that no other deployment in the same AWS Region uses. Terraform and the CloudFormation bootstrap script share a cluster and repository naming pattern, so reusing the `stage` and Region of a live CloudFormation deployment causes a collision.
{: .note }

The new VPC uses the Classless Inter-Domain Routing (CIDR) block `10.212.0.0/16`. Override `vpc_cidr` if that range overlaps a source, target, peered, or transit-connected network.

### Common variables

The following table describes the variables used most often. For the complete list, see the module's `variables.tf`.

| Variable | Default | Purpose |
|:---------|:--------|:--------|
| `region` | `us-east-1` | AWS Region for the infrastructure |
| `stage` | `dev` | Short identifier used in resource names; must be unique per deployment in a region |
| `kubernetes_version` | `1.35` | EKS control-plane version |
| `create_vpc` | `true` | Create a new VPC, or use an existing one (`false`) |
| `vpc_cidr` | `10.212.0.0/16` | IPv4 CIDR block for a VPC created by the module |
| `isolated` | `false` | Provision an air-gapped VPC with no outbound internet path |
| `deploy_helm` | `false` | Install the Migration Assistant Helm chart after the cluster is ready |
| `migration_assistant_version` | `null` | Image tag used when `deploy_helm` is `true`; required in that case |
| `permissions_boundary_arn` | `null` | IAM permissions boundary applied to every role the module creates |
| `create_opensearch_service_snapshot_role` | `true` | Create the role Amazon OpenSearch Service assumes for S3 snapshots |

Set `permissions_boundary_arn` if your account denies `iam:CreateRole` unless the request includes a specific boundary. Set `create_opensearch_service_snapshot_role` to `false` when the source is a self-managed Elasticsearch or OpenSearch cluster, because such a cluster registers its snapshot repository without assuming an AWS role and the role goes unused.

### Use an existing VPC

Supply at least two subnets in distinct availability zones. Private subnets with NAT or equivalent egress are recommended:

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

VPC endpoints behave differently depending on whether the module creates the VPC:

- **New VPC**: `s3`, `ecr.api`, `ecr.dkr`, `logs`, and `elasticfilesystem` are always created. Values in `vpc_endpoints` are added to that set.
- **Existing VPC**: nothing is created unless you name it in `vpc_endpoints`.

When `existing_route_table_ids` is empty, Terraform discovers the route table associated with each subnet you supply for the S3 gateway endpoint. Set the route table IDs explicitly if the subnets use an implicit main-route-table association.

## Step 3: Configure cluster access

Terraform generates the cluster name, so take the command from the module output:

```bash
$(terraform output -raw kubeconfig_command)
kubectl get nodes
```
{% include copy.html %}

To load the same environment variables that the CloudFormation bootstrap exports, run the following command:

```bash
eval "$(terraform output -raw migration_environment)"
```
{% include copy.html %}

## Step 4: Install Migration Assistant

Helm installation is disabled by default so that you can provision infrastructure first and mirror images before any workload starts. This differs from the bootstrap script, which always installs the chart.

To let Terraform install the chart using published public ECR images, set `deploy_helm` and a release tag:

```bash
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev" \
  -var="deploy_helm=true" \
  -var="migration_assistant_version=3.3.4"
```
{% include copy.html %}

Use a published Migration Assistant release tag. Terraform applies the `valuesEks.yaml` overlay, passes the AWS account, region, stage, and snapshot role to the chart, and waits up to `helm_timeout_seconds` (1500, or 25 minutes) for the release.

Alternatively, leave `deploy_helm` at `false` and install the chart yourself. The module creates a private ECR repository and exposes it as the `ecr_repository_url` output for mirrored or locally built images.

## Keep migration traffic private

If your migration must not traverse the public internet, you can make the source, target, snapshot, and control-plane legs private independently. The options are set through the same variables used in [Step 2](#step-2-provision-the-infrastructure), so configure them before you apply. For the leg model, the `isolated` mode, and the `source_connectivity` and `target_connectivity` variables, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/).

## Validate the module

The module's tests use Terraform mock providers and require no AWS credentials:

```bash
terraform init -backend=false
terraform fmt -check -recursive
terraform validate
terraform test
```
{% include copy.html %}

## Removal

Once you no longer need Migration Assistant for rollback, replay, or comparison, remove it. Do not remove it immediately after cutover. For the readiness checklist, see [Removing migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/).

Destroying the module removes the EKS environment and any Helm release in the same state. Review the plan carefully before you confirm:

```bash
terraform destroy \
  -var="region=us-east-1" \
  -var="stage=dev"
```
{% include copy.html %}

Terraform does not touch a CloudFormation deployment or its resources.

## Next steps

- To verify the deployment, access the Migration Console, and run a migration, continue with the corresponding steps in [Provision with CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/#step-3-verify-the-deployment). Everything after provisioning is identical on both paths.
- To configure and run migrations, see [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

{% include migration-phase-navigation.html %}
