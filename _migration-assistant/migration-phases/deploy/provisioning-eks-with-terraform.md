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

If your migration must not traverse the public internet, read [Private connectivity to the source and target](#private-connectivity-to-the-source-and-target) before you begin, because both options depend on another party: PrivateLink requires the cluster's provider to allow-list your account and accept the endpoint connection, and VPC peering requires the peer to accept the connection and add a reciprocal route.
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

## Isolated (air-gapped) deployments

Set `isolated = true` with `create_vpc = true` for a migration that must not traverse the public internet:

```bash
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev" \
  -var="isolated=true"
```
{% include copy.html %}

In isolated mode the module creates no NAT gateway, adds no default route from the private subnets, and creates the full set of service endpoints the cluster needs to reach AWS APIs privately: `s3` as a gateway endpoint, plus interface endpoints for `ecr.api`, `ecr.dkr`, `logs`, `monitoring`, `elasticfilesystem`, `sts`, and `eks-auth`.

Isolated mode also makes the Kubernetes API endpoint private, which changes how you reach the cluster. Plan for this before you apply:

- `kubectl`, including the `kubeconfig_command` output, must run from inside the VPC or a network routed to it: a bastion or workload in a private subnet, a peered VPC, or a virtual private network (VPN) or AWS Direct Connect attachment.
- `deploy_helm = true` requires the same access, because the Terraform Helm provider talks to the cluster API directly. `terraform apply` itself must run from a host that can reach the private endpoint.

Unlike the NAT gateway and endpoint behavior, the control-plane change is **not** conditional on `create_vpc`. Setting `isolated = true` with an existing VPC still disables the public API endpoint, even though the module makes no other network changes.
{: .warning }

To keep the data path isolated while reaching the API from outside the VPC, set `cluster_endpoint_public_access` explicitly. An explicit value always overrides the value derived from `isolated`, and it affects only the control plane. Narrow `cluster_public_access_cidrs` when you do, because it defaults to `0.0.0.0/0`:

```bash
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev" \
  -var="isolated=true" \
  -var="cluster_endpoint_public_access=true" \
  -var='cluster_public_access_cidrs=["203.0.113.10/32"]'
```
{% include copy.html %}

The override works in the other direction as well: set `cluster_endpoint_public_access = false` without `isolated` for a private-only API endpoint in a VPC that keeps its NAT egress.

Container images must be reachable without internet egress. Mirror the Migration Assistant images, and any third-party images the chart pulls, into the module's private ECR repository before workloads start.

## Private connectivity to the source and target

The `source_connectivity` and `target_connectivity` variables establish a private network path to the source and target clusters. Each leg is independent and defaults to `mode = "none"`, which creates nothing:

- `privatelink`: creates a consumer interface VPC endpoint to the cluster provider's VPC endpoint service, optionally with a Route 53 private hosted zone that resolves a hostname to the endpoint. Requires the provider to publish a VPC endpoint service name, which you obtain from the provider.
- `vpc_peering`: peers the migration VPC with the cluster's VPC and routes to its CIDR. Fits a cluster in a VPC you can peer with, which is often the source.

```hcl
target_connectivity = {
  mode                      = "privatelink"
  vpc_endpoint_service_name = "com.amazonaws.vpce.us-east-1.vpce-svc-0123456789abcdef0"
  dns_name                  = "my-target.example.com"
}

source_connectivity = {
  mode        = "vpc_peering"
  peer_vpc_id = "vpc-0aaaaaaaaaaaaaaaa"
  peer_cidr   = "10.99.0.0/16"
}
```
{% include copy.html %}

For `privatelink`, the resolved endpoint is available as the `source_private_endpoint` and `target_private_endpoint` outputs; use those values in the workflow cluster configuration. For `vpc_peering`, these outputs are `null`, because peering routes to the cluster's existing address rather than creating an endpoint. Supply the cluster's own endpoint in the workflow configuration instead.

The cluster endpoints and credentials themselves are supplied as runtime migration configuration, not by Terraform.

The module provisions only the consumer side of each connection. The following remain operator responsibilities:

- **PrivateLink**: the provider must allow-list your account and accept the endpoint connection if acceptance is required. Until then the endpoint stays in `pendingAcceptance` and the hostname does not resolve. Use the provider's canonical hostname for `dns_name` so that its TLS certificate validates. The endpoint service must be offered in the migration availability zones.
- **VPC peering**: the peer must accept the connection and add a reciprocal route back to `vpc_cidr`. Peer CIDRs must not overlap the migration VPC CIDR.

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
