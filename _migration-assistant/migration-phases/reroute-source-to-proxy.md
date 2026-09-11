---
layout: default
title: Reroute client traffic to capture proxy
nav_order: 3
parent: Migration workflows
permalink: /migration-assistant/migration-phases/reroute-source-to-proxy/
---

# Reroute client traffic to the capture proxy

The following information applies only to zero-downtime migrations that use Capture and Replay.
{: .note }

Capture must start before snapshot backfill if you want to preserve writes that happen during the migration window.

## Workflow-created resources

When your workflow includes a `traffic.proxies` section, Migration Assistant creates:

- Capture proxy pods.
- A Kubernetes Service resource in front of those pods.
- Apache Kafka configuration so captured traffic can be replayed later.

Client traffic is sent to the proxy Kubernetes Service. The proxy forwards requests to the source cluster and records them for later replay.

## How the proxy is exposed across platforms

The migration engine is the same on every platform. The practical difference is how the proxy's Kubernetes Service is exposed and integrated into your environment:

- On **other Kubernetes platforms**, you provide the networking pattern that routes clients to the proxy Kubernetes Service.
- On **Amazon Elastic Kubernetes Service (EKS)**, the Kubernetes Service can be backed by AWS load-balancer infrastructure, and the bootstrap path automates more of the platform configuration.
- On **Google Kubernetes Engine (GKE)**, the Service is annotated for an internal (VPC-local) load balancer by default, so the proxy's ingress stays off the public internet. For details, see [Private networking on GKE]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/).

## Configure the proxy in the workflow

Always start from the current sample:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

In the proxy configuration, important fields include:

- `listenPort`
- `podReplicas`
- `internetFacing` when you need external (public) exposure instead of the platform default. On GKE, the proxy is internal by default; leave `internetFacing` unset to keep it private.
- `tls`
- `setHeader`

## TLS behavior

The proxy is secure by default. If you do not configure TLS explicitly, the workflow provisions a self-signed certificate for the proxy.

If you intentionally want plain text HTTP, set the proxy TLS mode to `plaintext`.

## Host and header overrides

If your source uses host-based routing, add a static header in the proxy configuration.

Use the `setHeader` field with entries in `Header-Name: value` format, for example:

```json
{
  "setHeader": ["Host: source.example.com"]
}
```
{% include copy.html %}

## Find the proxy endpoint

After you submit the workflow, inspect the Services in the `ma` namespace and identify the one created for the proxy:

```bash
kubectl get svc -n ma
```
{% include copy.html %}

Then update your application, DNS, or load balancer to send traffic to that proxy endpoint instead of directly to the source.

## Verify capture before proceeding

Before you proceed to metadata migration and backfill, confirm that:

- The proxy pods are running.
- The Kubernetes Service is reachable.
- Application traffic is flowing through the proxy.
- The workflow shows the traffic components as healthy.

Useful commands:

```bash
workflow status
workflow manage
```
{% include copy.html %}

## Next steps

Once capture is live, keep traffic flowing through the proxy while you perform the following steps:

1. Migrate metadata
2. Backfill historical documents
3. Replay the captured traffic to catch the target up

{% include migration-phase-navigation.html %}
