---
layout: default
title: Reroute client traffic to capture proxy
nav_order: 3
parent: Migration phases
permalink: /migration-assistant/migration-phases/reroute-source-to-proxy/
---

# Reroute client traffic to the capture proxy

This page is only relevant if you are using Capture and Replay for a zero-downtime migration. If you are only performing a backfill migration, skip this step.
{: .note }

Capture must begin **before** metadata migration and backfill so that no writes are lost during the migration window. The capture proxy records all traffic to Kafka while forwarding requests to the source cluster as normal.

## How capture works on Kubernetes

When you include a `traffic` section in your workflow configuration, the workflow deploys a capture proxy fleet as a Kubernetes Deployment with a Kubernetes Service fronting it. Client traffic is routed to the proxy's Service, which forwards requests to the source cluster while simultaneously recording them to Kafka (managed by Strimzi).

Unlike the classic ECS deployment (which uses an Application Load Balancer), the EKS deployment exposes the capture proxy via a Kubernetes Service. On EKS, this is typically backed by a Network Load Balancer via a `LoadBalancer`-type Service.

## Routing traffic to the capture proxy

After submitting a workflow with `traffic.proxies` configured, the capture proxy pods and Service are created automatically. To route client traffic:

1. Get the capture proxy Service endpoint:

   ```bash
   kubectl get svc -n ma -l migrations.opensearch.org/task=captureProxy
   ```
   {% include copy.html %}

2. Update your client configuration, DNS, or load balancer to point to the capture proxy Service endpoint instead of the source cluster directly.

3. Verify traffic is flowing through the proxy by checking Kafka topic records from the Migration Console:

   ```bash
   console clusters curl source -- "/_cat/count?v"
   ```
   {% include copy.html %}

## Host header configuration

If your source cluster uses `Host` header routing (common with Elastic Cloud and hosted Elasticsearch services), configure the proxy to override the `Host` header. In your workflow configuration under `traffic.proxies.<name>.proxyConfig`:

```json
{
  "setHeaders": ["Host <your-source-domain>"]
}
```
{% include copy.html %}

The `Host` header value should be the domain name only — no protocol (`https://`) or port.

## Verifying capture

From the Migration Console, verify that traffic is being captured:

```bash
# Check workflow status — the proxy step should show as Running
workflow status

# Monitor via TUI
workflow manage
```
{% include copy.html %}

## Next steps

Once traffic is flowing through the capture proxy, proceed to:
1. [Migrate metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/)
2. [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)
3. [Replay captured traffic]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/)

{% include migration-phase-navigation.html %}
