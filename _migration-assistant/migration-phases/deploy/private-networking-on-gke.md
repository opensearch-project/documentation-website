---
layout: default
title: Private networking
nav_order: 1
parent: Deploy on GKE
grand_parent: Choose your deployment
---

# Private networking on GKE

By default, a Google Kubernetes Engine (GKE) migration deployment accesses the source cluster, target cluster, and Cloud Storage over routable (usually, public) endpoints. You can make each data leg private so that no migration data traverses the public internet. Private routing does not improve performance for same-region migrations. Instead, it provides a security and compliance control.

Configuring private connectivity is optional and applies per data path, or _leg_. The legs are independent, so you can make some private and leave others public.

Follow [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/) for the full deployment (copying the images and setting `migration_release`) and add the connectivity variables described on this page to the `terraform apply` command.
{: .note }

These connectivity mechanisms are specific to Google Cloud Platform (GCP). Private Service Connect and VPC peering cannot provide connectivity to a source or target hosted on another cloud or on premises. Such connections require a VPN or dedicated interconnect, neither of which is configured by the GKE deployment path.
{: .note }

## The data legs

The following table lists each data leg and its private configuration option.

| Leg | Traffic type | Private configuration |
|:----|:----------------|:-----------------------|
| Target write | Documents written to the target cluster | `target_connectivity` set to `psc_consumer` or `vpc_peering` |
| Source read | Data read from the source cluster (snapshots and proxy traffic) | `source_connectivity` set to `psc_consumer` or `vpc_peering` |
| Snapshot storage | Snapshot data written to and read from Cloud Storage | `gcs_connectivity` set to `private_google_access` (default) |
| Live capture-proxy ingress | Client traffic to the capture proxy | Internal load balancer on GKE (automatic) |
| Control plane | `kubectl` and Helm commands from operators | Private endpoint with narrowed authorized ranges |

## Connecting source and target using Private Service Connect

Use Private Service Connect (PSC) in consumer mode when the cluster is published as a GCP PSC service attachment, such as a managed OpenSearch offering that exposes a private endpoint. To configure PSC connectivity, follow these steps:

1. Obtain the producer's service-attachment URI and the hostname that its Transport Layer Security (TLS) certificate is issued for. Ask the producer to add your project to the service attachment's consumer accept list or confirm that it accepts connections automatically.
1. Configure the leg, supplying `dns_name` so the endpoint is accessible by hostname using valid TLS:

   ```hcl
   target_connectivity = {
     mode               = "psc_consumer"
     service_attachment = "projects/<PRODUCER_PROJECT>/regions/<REGION>/serviceAttachments/<ATTACHMENT_NAME>"
     dns_name           = "myservice-myproj.example.com"
   }
   ```
   {% include copy.html %}

   When you set `dns_name`, Terraform creates a private Cloud DNS zone that resolves the hostname to the PSC endpoint's internal IP address, so clients validate TLS against the real certificate. Omit `dns_name` only if you intend to connect by IP address without certificate verification.
1. Apply the configuration, then read the hostname (preferred) or the raw IP address:

   ```bash
   terraform output target_private_fqdn       # hostname
   terraform output target_private_endpoint   # IP address fallback
   ```
   {% include copy.html %}

1. Approve the connection on the producer side if it is not approved automatically. Applying the configuration creates a PSC endpoint that connects to the producer's service attachment. If the attachment uses manual acceptance, the connection stays in a pending state until the producer approves it. Confirm that the connection reaches the accepted state before you migrate. To verify the consumer side, run the following command:

   ```bash
   gcloud compute forwarding-rules describe <FORWARDING_RULE_NAME> --region <REGION> \
     --format='value(pscConnectionStatus)'
   ```
   {% include copy.html %}

   The value must be `ACCEPTED`, not `PENDING`.
1. Use the endpoint in your migration. Endpoints are not injected automatically. Add the hostname to your workflow configuration's `targetClusters` or `sourceClusters` entry as the cluster `endpoint`, for example, `https://myservice-myproj.example.com:9200`. Use the port on which the producer service listens. Managed services often use a port other than 9200. If you omitted `dns_name`, use the IP address without certificate verification instead.

## Connecting source and target using VPC peering

Use VPC peering when the cluster is located in another GCP VPC that you can establish a peering connection with. To configure VPC peering for a source or target cluster, follow these steps:

1. Ensure that the subnet ranges of the peer VPC do not overlap with the deployment's `subnet_cidr`, `pods_cidr`, or `services_cidr`.
2. Configure the leg:

   ```hcl
   source_connectivity = {
     mode               = "vpc_peering"
     peer_vpc_self_link = "projects/their-project/global/networks/their-vpc"
   }
   ```
   {% include copy.html %}

3. The configuration creates your side of the peering only. VPC peering is not transitive, so the peer must create a reciprocal peering connection back to your VPC. To verify the peering connection state, run the following command:

   ```bash
   terraform output source_peering_state
   ```
   {% include copy.html %}

   The state becomes `ACTIVE` after both sides of the peering connection exist. The peer must also configure firewall rules that permit your subnet and pod ranges to access the cluster port. Additionally, the peer must configure DNS to resolve the cluster hostname over the peering connection.
4. The cluster retains its own endpoint URL. Add the cluster's endpoint URL to your workflow configuration as usual---traffic now routes privately over the peering connection.

## Snapshot storage using Private Google Access

The `gcs_connectivity` variable defaults to `private_google_access`, which enables Private Google Access on the migration subnet so nodes can access Cloud Storage over Google's private network. No action is needed when the Terraform module creates the VPC. To disable Private Google Access, set the mode to `none`.

If you supply an existing subnet (`create_vpc = false`), Terraform does not manage that subnet and cannot set the flag. Enable Private Google Access on it yourself:

```bash
gcloud compute networks subnets update <SUBNET_NAME> --region <REGION> \
  --enable-private-ip-google-access
```
{% include copy.html %}

If your organization enforces a VPC Service Controls perimeter that denies the standard Google API endpoints, route Google API traffic through the restricted endpoint according to your organization's perimeter and DNS configuration.
{: .note }

### Source cluster prerequisite for the repository-gcs plugin

Backfill snapshots the source cluster to Cloud Storage, which requires the source to support Cloud Storage snapshot repositories. Elasticsearch 8.0 and later include this support. If your source cluster runs Elasticsearch 7.x or earlier or any version of OpenSearch, install the `repository-gcs` plugin on every source node and then restart the node:

```bash
bin/elasticsearch-plugin install --batch repository-gcs
```
{% include copy.html %}

You must install the `repository-gcs` plugin only on the source cluster regardless of whether you configure private networking.
{: .note }

## Live capture proxy ingress

Capture and Replay migrations place a capture proxy in front of the source cluster: source clients connect to the proxy, which forwards traffic to the source while mirroring it to Apache Kafka for the Traffic Replayer. The proxy is exposed by a Kubernetes Service.

On GKE, the proxy's Service is annotated to provision an internal load balancer based on the deployment's cloud provider, as specified by the `cloudProvider` Helm value. The proxy receives a private IP address within the VPC, ensuring that ingress traffic does not traverse the public internet. No additional per-migration configuration is required. Setting `cloudProvider: gcp` during deployment is sufficient.

Consider the following when using the internal load balancer:

- The internal load balancer resides in the migration subnet. Source clients must access it over the VPC---either through VPC peering, a VPN, or the same VPC---as with any other private connectivity path.
- Set the proxy's `internetFacing` option to `true` only if you need a public proxy endpoint. By default, this option is unset and the proxy remains private.
- The Traffic Replayer connection to the target uses the `target_connectivity` setting configured in the preceding sections. Kafka runs inside the cluster, so neither requires additional private network configuration.

## Control plane privacy

Set `enable_private_endpoint = true` to remove the public IP address from the GKE control plane. This affects only how operators and continuous integration systems access the cluster using `kubectl` and Helm. The in-cluster migration workloads are unaffected. When you enable this option, the following requirements apply:

- Narrow `master_authorized_cidrs` from the default `0.0.0.0/0` to your internal ranges.
- Access the cluster using an Identity-Aware Proxy (IAP) tunnel, a bastion host in the VPC, or a VPN. This path does not provision a bastion host.

The machine running `terraform apply` must also have access to the private control plane endpoint. The module's Kubernetes and Helm providers connect to this endpoint to install the Helm release. Therefore, access from an interactive `kubectl` session alone is not sufficient. Run `terraform apply` from within the VPC or through IAP or a VPN.
{: .note }

## Firewall configuration

For a private deployment, narrow `allowed_ingress_cidrs` (default `0.0.0.0/0`) to the IP ranges that must access the migration nodes.

