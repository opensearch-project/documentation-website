---
layout: default
title: Private networking
nav_order: 3
parent: Deploy on Amazon EKS
grand_parent: Choose your deployment
---

# Private networking on Amazon EKS

By default, a Migration Assistant deployment on Amazon Elastic Kubernetes Service (Amazon EKS) accesses the source cluster, the target cluster, and Amazon Simple Storage Service (Amazon S3) over routable (usually, public) endpoints. You can make each path private so that no migration data traverses the public internet. Private routing does not improve performance for same-region migrations. Instead, it provides a security and compliance control.

Configuring private connectivity is optional and applies per data path, or _leg_. The legs are independent, so you can make some private and leave others public.

After configuring connectivity, follow the instructions in [Provision Migration Assistant on Amazon EKS using Terraform]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-terraform/) or [Provision Migration Assistant on Amazon EKS using AWS CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-cloudformation/) for the remaining deployment details.
{: .note }

## The data legs

The following table lists each data leg and its private configuration option. Most options are configured on the migration virtual private cloud (VPC). Several options rely on private endpoints to Amazon Elastic Container Registry (Amazon ECR).

| Leg | Traffic type | Private configuration |
|:----|:----------------|:-----------------------|
| Target write | Documents written to the target cluster | `target_connectivity` set to `privatelink` or `vpc_peering` |
| Source read | Data read from the source cluster (snapshots and proxy traffic) | `source_connectivity` set to `privatelink` or `vpc_peering` |
| Snapshot storage | Snapshot data written to and read from Amazon S3 | Amazon S3 gateway endpoint (created by default) |
| AWS APIs | Cluster calls to Amazon ECR, Amazon CloudWatch Logs, and other services | Interface endpoints in the migration VPC |
| Control plane | `kubectl` and Helm commands from operators | Private Kubernetes API endpoint with narrowed authorized ranges |

The following connectivity options require the external provider to approve a connection. Obtain approval before provisioning the cluster:

- AWS PrivateLink requires the cluster's provider to add your account to its allow list and to accept the endpoint connection if acceptance is required. Until then, the endpoint stays in `pendingAcceptance` and the hostname does not resolve. The endpoint service must also be offered in the migration Availability Zones.
- VPC peering requires the peer to accept the connection and add a reciprocal route back to the migration VPC. Peer Classless Inter-Domain Routing (CIDR) blocks must not overlap the migration VPC CIDR block.

## Source and target connectivity

The `source_connectivity` and `target_connectivity` variables establish a private network path to the source and target clusters. Each leg is independent and defaults to `mode = "none"`, which creates no private network resources:

- `privatelink`: Creates a consumer interface VPC endpoint to the cluster provider's VPC endpoint service, optionally, with a Route 53 private hosted zone that resolves a hostname to the endpoint. Requires the provider to publish a VPC endpoint service name, which you obtain from the provider.
- `vpc_peering`: Establishes a VPC peering connection between the migration VPC and the cluster's VPC and adds a route to the cluster's CIDR block. Use this mode for a cluster in a VPC that you can peer with, which is often the source.

The following example configures PrivateLink for the target cluster and VPC peering for the source cluster:

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

Use the provider's canonical hostname for `dns_name` so that its Transport Layer Security (TLS) certificate validates.

For `privatelink`, the resolved endpoint values are available through the `source_private_endpoint` and `target_private_endpoint` outputs. Use these values in the workflow cluster configuration. For `vpc_peering`, these outputs are `null`, because peering routes to the cluster's existing address rather than creating an endpoint. Provide the cluster's own endpoint in the workflow configuration instead.

Supply the cluster endpoints and credentials in the runtime migration configuration, not in the Terraform variables.

The module provisions only the consumer side of each connection. You are responsible for arranging the peer or provider requirements listed in [The data legs](#the-data-legs).
{: .note }

## Isolated (air-gapped) deployments

To keep migration traffic off the public internet, set `isolated = true` (`create_vpc` defaults to `true`):

```bash
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev" \
  -var="isolated=true"
```
{% include copy.html %}

In isolated mode, the module does not create a NAT gateway or add a default route to the private subnets. Instead, it creates VPC endpoints so the cluster can reach AWS services without leaving the VPC: an `s3` gateway endpoint and interface endpoints for `ecr.api`, `ecr.dkr`, `logs`, `monitoring`, `elasticfilesystem`, `sts`, and `eks-auth`.

Isolated mode also makes the Kubernetes API endpoint private, which changes how you reach the cluster. Plan for this access requirement before you apply:

- `kubectl`, including the `kubeconfig_command` output, must run from inside the VPC or a network routed to it: a bastion or workload in a private subnet, a peered VPC, or a virtual private network (VPN) or AWS Direct Connect attachment.
- `deploy_helm = true` requires the same VPC internal access as `kubectl`, because the Terraform Helm provider connects to the cluster API directly. Run `terraform apply` from inside the VPC or a network routed to the private endpoint.

Unlike the NAT gateway and endpoint changes, the control plane change does not depend on `create_vpc`. Setting `isolated = true` for an existing VPC still disables the public API endpoint, even though the module makes no other network changes.
{: .warning }

To keep the data leg isolated while reaching the API from outside the VPC, set `cluster_endpoint_public_access` explicitly. An explicit value always overrides the value derived from `isolated`, and it affects only the control plane. Narrow `cluster_public_access_cidrs` when setting this override, because `cluster_public_access_cidrs` defaults to `0.0.0.0/0`:

```bash
terraform apply \
  -var="region=us-east-1" \
  -var="stage=dev" \
  -var="isolated=true" \
  -var="cluster_endpoint_public_access=true" \
  -var='cluster_public_access_cidrs=["203.0.113.10/32"]'
```
{% include copy.html %}

You can also use the override independently: set `cluster_endpoint_public_access = false` without enabling `isolated` to create a private-only API endpoint in a VPC that retains its NAT egress.

## Container images

Container images must be reachable without internet egress. Copy the Migration Assistant images, and any third-party images that the chart downloads, into a private Amazon ECR repository before deploying Migration Assistant. The Terraform module creates the Amazon ECR repository and exposes it as the `ecr_repository_url` output.

## Configuring private networking using a bootstrap script

If you provision the EKS cluster using AWS CloudFormation instead, the bootstrap script copies images into private Amazon ECR by default. To also create the VPC endpoints that the cluster needs to pull images from inside the VPC, add `--create-vpc-endpoints`:

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

This step runs from your machine, which must have internet access, and copies the release images and Helm charts to Amazon ECR. The EKS cluster then pulls the images through VPC endpoints. The script creates endpoints for Amazon S3, Amazon ECR API, Amazon ECR Docker, CloudWatch Logs, and Amazon Elastic File System (Amazon EFS).

Some deployments also need endpoints for AWS Security Token Service (AWS STS) or EKS Authentication, for example when pods take an AWS identity through AWS Identity and Access Management (IAM) Roles for Service Accounts (IRSA) or EKS Pod Identity. Create those separately before running the bootstrap script.

If you prefer to manage VPC endpoints using another tool, omit `--create-vpc-endpoints`. The script still copies images and uses your existing endpoints.

"Stack" is ambiguous here. If you're referring to the VPC created by the CloudFormation bootstrap script, I'd name it explicitly:

The bootstrap script does not provide equivalents to the `source_connectivity` and `target_connectivity` variables. To connect to the source or target over PrivateLink or VPC peering, establish those connections yourself using the VPC created by the bootstrap script.
{: .note }

