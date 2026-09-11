---
layout: default
title: Private networking on GKE
parent: Choose your deployment
nav_exclude: true
permalink: /migration-assistant/migration-phases/deploy/private-networking-on-gke/
---

# Private networking on GKE

By default, a Google Kubernetes Engine (GKE) migration deployment reaches the source cluster, target cluster, and Cloud Storage over routable (typically public) endpoints. This guide shows how to make each data path private so that no migration data traverses the public internet. This is a security and compliance capability, not a performance feature: for same-region migrations, private and public routing perform similarly.

All connectivity is **optional** and configured per data path, or "leg." With no configuration, behavior is unchanged from the standard GKE deployment. The legs are independent, so you can make some private and leave others public.

This guide covers only the connectivity variables. Follow [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/) for the full deployment (mirroring the images and setting `migration_release`), and add the connectivity variables described here to that same `terraform apply`.
{: .note }

These mechanisms are internal to Google Cloud Platform (GCP). A source or target hosted on another cloud or on premises cannot be reached through Private Service Connect or VPC peering; that requires a VPN or dedicated interconnect, which this path does not yet configure.
{: .note }

## The data legs

The following table lists each migration data path and how to make it private.

| Leg | What it carries | How to make it private |
|:----|:----------------|:-----------------------|
| Target write | Migrated documents to the target | `target_connectivity` set to `psc_consumer` or `vpc_peering` |
| Source read | Snapshot or proxy reads from the source | `source_connectivity` set to `psc_consumer` or `vpc_peering` |
| Snapshot storage | Snapshot data to and from Cloud Storage | `gcs_connectivity` set to `private_google_access` (default) |
| Live capture-proxy ingress | Client traffic to the capture proxy | Internal load balancer on GKE (automatic) |
| Control plane | Your `kubectl` and Helm access to the cluster | Private endpoint with narrowed authorized ranges |

## Source and target over Private Service Connect

Use Private Service Connect (PSC) in consumer mode when the cluster is published as a GCP PSC service attachment, such as a managed OpenSearch service that offers a private endpoint.

1. Obtain the producer's **service-attachment URI** and the **hostname** its Transport Layer Security (TLS) certificate is issued for. Ask the producer to add your project to the service attachment's consumer accept-list, or confirm that it accepts connections automatically.
2. Configure the leg, supplying `dns_name` so the endpoint is reachable by hostname with valid TLS:

   ```hcl
   target_connectivity = {
     mode               = "psc_consumer"
     service_attachment = "projects/PRODUCER/regions/REGION/serviceAttachments/NAME"
     dns_name           = "myservice-myproj.example.com"
   }
   ```

   When you set `dns_name`, Terraform creates a private Cloud DNS zone that resolves the hostname to the PSC endpoint's internal IP address, so clients validate TLS against the real certificate. Omit `dns_name` only if you intend to connect by IP address with relaxed TLS verification.
3. Apply the configuration, then read the hostname (preferred) or the raw IP address:

   ```bash
   terraform output target_private_fqdn       # hostname
   terraform output target_private_endpoint   # IP address fallback
   ```
   {% include copy.html %}

4. **Approve the connection on the producer side, if it is not automatic.** Applying the configuration creates a PSC endpoint that connects to the producer's service attachment. If the attachment uses manual acceptance, the connection stays in a pending state until the producer approves it. Confirm that the connection reaches the accepted state before you migrate. You can check the consumer side with the following command:

   ```bash
   gcloud compute forwarding-rules describe NAME --region REGION \
     --format='value(pscConnectionStatus)'
   ```
   {% include copy.html %}

   The value must be `ACCEPTED`, not `PENDING`.
5. **Use the endpoint in your migration.** Endpoints are not injected automatically. Put the hostname into your workflow configuration's `targetClusters` or `sourceClusters` entry as the cluster `endpoint`, for example `https://myservice-myproj.example.com:9200`. Use the port the producer serves on; managed services often use a port other than 9200. If you omitted `dns_name`, use the IP address with relaxed TLS instead.

## Source and target over VPC peering

Use VPC peering when the cluster lives in another GCP VPC that you can peer with.

1. Make sure the subnet ranges of the peer VPC do **not** overlap with this deployment's `subnet_cidr`, `pods_cidr`, or `services_cidr`.
2. Configure the leg:

   ```hcl
   source_connectivity = {
     mode               = "vpc_peering"
     peer_vpc_self_link = "projects/their-project/global/networks/their-vpc"
   }
   ```

3. This creates your side of the peering only. Peering is non-transitive, so the peer must create the reciprocal peering back to your VPC. Check the state with the following command:

   ```bash
   terraform output source_peering_state
   ```
   {% include copy.html %}

   The state becomes `ACTIVE` once both sides exist. The peer also needs firewall rules that permit your subnet and pod ranges to reach the cluster port, and DNS that resolves the cluster hostname over the peered route.
4. The cluster keeps its own endpoint URL. Put that URL into your workflow configuration as usual; traffic now routes privately over the peering.

## Snapshot storage over Private Google Access

The `gcs_connectivity` variable defaults to `private_google_access`, which enables Private Google Access on the migration subnet so nodes reach Cloud Storage over Google's private network. No action is needed for the default (created-VPC) path. Set the mode to `none` to opt out.

If you supply an existing subnet (`create_vpc = false`), Terraform does not manage that subnet and cannot set the flag. Enable Private Google Access on it yourself:

```bash
gcloud compute networks subnets update <your-subnet> --region REGION \
  --enable-private-ip-google-access
```
{% include copy.html %}

If your organization enforces a VPC Service Controls perimeter that denies the standard Google API endpoints, route Google API traffic through the restricted endpoint according to your organization's perimeter and DNS configuration.
{: .note }

### Source-cluster prerequisite for the repository-gcs plugin

Backfill snapshots the **source** cluster to Cloud Storage, which requires the source to support Cloud Storage snapshot repositories. Elasticsearch 8.0 and later and OpenSearch bundle this support. Elasticsearch 7.x does not: it needs the `repository-gcs` plugin installed on every source node, or snapshot-repository registration fails with `repository type [gcs] does not exist`. Install it on each source node and restart:

```bash
bin/elasticsearch-plugin install --batch repository-gcs
```
{% include copy.html %}

This is a property of the source cluster and is independent of the private-networking configuration.
{: .note }

## Live capture-proxy ingress

Live capture-and-replay migrations place a capture proxy in front of the source cluster: source clients connect to the proxy, which forwards traffic to the source while mirroring it to Kafka for the replayer. The proxy is exposed by a Kubernetes service.

On GKE, the proxy's service is annotated for an internal load balancer according to the deployment's cloud provider (the `cloudProvider` Helm value). The proxy therefore receives a VPC-internal address, and its ingress never traverses the public internet. No per-migration configuration is required: deploying with `cloudProvider: gcp` is enough.

- The internal load balancer lives in the migration subnet. Source clients must reach it over the VPC (through peering, a VPN, or the same VPC), the same as any other private leg.
- Set the proxy's `internetFacing` option to `true` only if you deliberately want a public proxy endpoint. Leaving it unset (the default) keeps the proxy private.
- The replayer-to-target leg reuses the target connectivity configured above, and Kafka runs in the cluster, so neither needs additional private-networking setup.

## Control-plane privacy

Set `enable_private_endpoint = true` to remove the public IP address from the GKE control plane. This affects only how you (operators and continuous integration) reach the cluster with `kubectl` and Helm; the in-cluster migration workloads are unaffected. When you enable it:

- Narrow `master_authorized_cidrs` from the default `0.0.0.0/0` to your internal ranges.
- Reach the cluster through an Identity-Aware Proxy (IAP) tunnel, a bastion host in the VPC, or a VPN. This path does not provision a bastion host.

The machine that runs `terraform apply` is also affected. The module's Kubernetes and Helm providers connect to the control-plane endpoint to install the Helm release, so that machine must reach the private endpoint, not just your interactive `kubectl` session. Run it from inside the VPC or over IAP or VPN.
{: .note }

## Firewall

For a private deployment, also narrow `allowed_ingress_cidrs` (default `0.0.0.0/0`) to the ranges that must reach the migration nodes.

{% include migration-phase-navigation.html %}
