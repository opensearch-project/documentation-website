---
layout: default
title: Private networking
nav_order: 3
parent: Deploy on Amazon EKS
grand_parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/private-networking-on-eks/
---

# Private networking on Amazon EKS

By default, a Migration Assistant deployment on Amazon Elastic Kubernetes Service (EKS) reaches the source cluster, the target cluster, and Amazon Simple Storage Service (Amazon S3) over routable (typically public) endpoints. This page shows how to make each path private so that no migration data traverses the public internet. This is a security and compliance capability, not a performance feature: for same-region migrations, private and public routing perform similarly.

All connectivity is **optional** and configured per data path, or "leg." With no configuration, behavior is unchanged from the standard EKS deployment. The legs are independent, so you can make some private and leave others public.

This page covers the connectivity options only, not the full deployment. Follow the instructions on either [Provision with Terraform]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-terraform/) or [Provision with CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) for the remaining deployment details.
{: .note }

## The data legs

Most of these options are configured on the migration virtual private cloud (VPC), and several rely on private endpoints to Amazon Elastic Container Registry (Amazon ECR). The following table lists each migration data path and how to make it private.

| Leg | What it carries | How to make it private |
|:----|:----------------|:-----------------------|
| Target write | Migrated documents to the target | `target_connectivity` set to `privatelink` or `vpc_peering` |
| Source read | Snapshot or proxy reads from the source | `source_connectivity` set to `privatelink` or `vpc_peering` |
| Snapshot storage | Snapshot data to and from Amazon S3 | Amazon S3 gateway endpoint (created by default) |
| AWS APIs | Cluster calls to Amazon ECR, CloudWatch Logs, and other services | Interface endpoints in the migration VPC |
| Control plane | Your `kubectl` and Helm access to the cluster | Private Kubernetes API endpoint with narrowed authorized ranges |

Two of these legs depend on another party, so plan for them before you provision:

- **AWS PrivateLink**: the cluster's provider must allow-list your account and accept the endpoint connection if acceptance is required. Until then the endpoint stays in `pendingAcceptance` and the hostname does not resolve. The endpoint service must also be offered in the migration availability zones.
- **VPC peering**: the peer must accept the connection and add a reciprocal route back to the migration VPC. Peer Classless Inter-Domain Routing (CIDR) blocks must not overlap the migration VPC CIDR block.

## Source and target connectivity

The `source_connectivity` and `target_connectivity` variables establish a private network path to the source and target clusters. Each leg is independent and defaults to `mode = "none"`, which creates nothing:

- `privatelink`: creates a consumer interface VPC endpoint to the cluster provider's VPC endpoint service, optionally with a Route 53 private hosted zone that resolves a hostname to the endpoint. Requires the provider to publish a VPC endpoint service name, which you obtain from the provider.
- `vpc_peering`: peers the migration VPC with the cluster's VPC and routes to its CIDR block. Fits a cluster in a VPC you can peer with, which is often the source.

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

For `privatelink`, the resolved endpoint is available as the `source_private_endpoint` and `target_private_endpoint` outputs; use those values in the workflow cluster configuration. For `vpc_peering`, these outputs are `null`, because peering routes to the cluster's existing address rather than creating an endpoint. Supply the cluster's own endpoint in the workflow configuration instead.

The cluster endpoints and credentials themselves are supplied as runtime migration configuration, not by Terraform.

The module provisions only the consumer side of each connection. The peer or provider responsibilities listed in [The data legs](#the-data-legs) remain yours to arrange.
{: .note }

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

## Container images

Container images must be reachable without internet egress. Mirror the Migration Assistant images, and any third-party images the chart pulls, into a private Amazon Elastic Container Registry (Amazon ECR) repository before workloads start. The Terraform module creates that repository and exposes it as the `ecr_repository_url` output.

## Private networks with the bootstrap script

If you provision with CloudFormation instead, the bootstrap script mirrors images into private Amazon ECR by default and creates the VPC endpoints needed to pull from inside the cluster:

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

The mirroring step runs from your machine (which has internet), copies the release images and Helm charts to Amazon ECR, then the EKS cluster pulls everything through VPC endpoints. The endpoints created are Amazon S3, Amazon ECR API, Amazon ECR Docker, CloudWatch Logs, and Amazon Elastic File System (Amazon EFS).

Some deployments also need endpoints for AWS Security Token Service (AWS STS) or EKS Authentication, for example when pods take an AWS identity through AWS Identity and Access Management (IAM) Roles for Service Accounts (IRSA) or EKS Pod Identity. Create those separately before running the bootstrap script.

If you prefer to manage VPC endpoints with another tool, omit `--create-vpc-endpoints`. The script still mirrors images and uses your existing endpoints.

The bootstrap script has no equivalent of the `source_connectivity` and `target_connectivity` variables. To reach the source or target over PrivateLink or VPC peering on this path, create those connections yourself against the VPC that the stack deploys into.
{: .note }

{% include migration-phase-navigation.html %}
