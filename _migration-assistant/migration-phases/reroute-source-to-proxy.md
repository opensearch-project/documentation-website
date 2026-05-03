---
layout: default
title: Reroute client traffic to capture proxy
nav_order: 3
parent: Migration workflows
permalink: /migration-assistant/migration-phases/reroute-source-to-proxy/
---

# Reroute client traffic to the capture proxy

This page only applies to zero-downtime migrations that use capture and replay.
{: .note }

Capture must start before snapshot backfill if you want to preserve writes that happen during the migration window.

## What the workflow creates

When your workflow includes a `traffic.proxies` section, Migration Assistant creates:

- capture proxy pods
- a Kubernetes Service in front of those pods
- Kafka wiring so captured traffic can be replayed later

Client traffic is sent to the proxy Service. The proxy forwards requests to the source cluster and records them for later replay.

## What changes on Kubernetes and EKS

The migration engine is the same on both platforms. The practical difference is how the Service is exposed and integrated into your environment.

- On **generic Kubernetes**, you provide the networking pattern that gets clients to the proxy Service.
- On **Amazon EKS**, the Service can be backed by AWS load-balancer infrastructure, and the bootstrap path handles more of the platform wiring for you.

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
- `internetFacing` when you need external exposure on EKS
- `tls`
- `setHeader`

## TLS behavior

The proxy is secure by default. If you do not configure TLS explicitly, the workflow provisions a self-signed certificate for the proxy.

If you intentionally want plaintext HTTP, set the proxy TLS mode to `plaintext`.

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

## Verify capture before moving on

Before you proceed to metadata migration and backfill, confirm that:

- the proxy pods are running
- the Service is reachable
- application traffic is flowing through the proxy
- the workflow shows the traffic components as healthy

Useful commands:

```bash
workflow status
workflow manage
```
{% include copy.html %}

## What happens next

Once capture is live, keep traffic flowing through the proxy while you:

1. migrate metadata
2. backfill historical documents
3. replay the captured traffic to catch the target up

{% include migration-phase-navigation.html %}
