---
layout: default
title: Switch traffic to the target
nav_order: 8
parent: Migration phases
permalink: /migration-assistant/migration-phases/switch-traffic-to-target/
redirect_from:
  - /migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/
---

# Switch traffic to the target

This page is only relevant if you are using Capture and Replay for a zero-downtime migration. If you are only performing a backfill migration, skip this step.
{: .note }

After the source and target clusters are synchronized, redirect client traffic from the capture proxy to the target cluster.

## Prerequisites

Before switching:

- The replayer has caught up to the live edge of the Kafka topic
- Document counts match between source and target
- Representative queries return expected results on the target
- The target cluster is healthy and ready to accept production traffic

## Switching traffic

On Kubernetes, the capture proxy is exposed via a Kubernetes Service. To switch traffic:

1. Update your DNS record, load balancer target, or application connection string to point directly to the target cluster instead of the capture proxy Service.

2. If using an external load balancer (NLB, ALB, or DNS-based routing), update the target group or backend to point to the target cluster endpoint.

3. Monitor the target cluster to confirm it is handling traffic correctly:

   ```bash
   console clusters curl target -- "/_cluster/health"
   console clusters curl target -- "/_cat/indices?v"
   ```
   {% include copy.html %}

## Fallback

If issues arise after switching:

1. Revert DNS or load balancer configuration to point back to the capture proxy (which still forwards to the source cluster)
2. The source cluster has all its original data — no data is lost by reverting
3. Investigate and resolve the issue before attempting the switch again

Keep the source cluster available as a fallback for 24–72 hours after switching.

## Next steps

Once confident in the target cluster:
1. [Remove migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/)

{% include migration-phase-navigation.html %}
