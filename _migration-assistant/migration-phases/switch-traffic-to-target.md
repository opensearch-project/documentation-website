---
layout: default
title: Switch traffic to the target
nav_order: 8
parent: Migration workflows
permalink: /migration-assistant/migration-phases/switch-traffic-to-target/
redirect_from:
  - /migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/switch-traffic-to-target/
---

# Switch traffic to the target

The following information applies only to zero-downtime migrations that use Capture and Replay.
{: .note }

Switching traffic is the cutover step. By this point, capture has already protected writes during backfill, replay has caught the target up, and validation should already be complete.

## Cutover checklist

Before you switch traffic, confirm the following:

- Replay has reached the live edge.
- The target cluster is healthy.
- Representative application queries work on the target.
- The application team is ready to move traffic.
- The rollback path is still available.

## Switching traffic

The exact mechanism depends on your environment, but the process is the same:

1. Redirect clients away from the capture proxy.
2. Point clients directly at the target cluster.
3. Monitor the target closely during the first production traffic window.

In practice, that usually means updating:

- A DNS record
- A load balancer backend
- An application connection string
- A service-discovery entry

## Validate the target after switching traffic

Immediately after switching traffic, verify the following:

- Cluster health
- Basic index visibility
- Representative application behavior

The following commands help validate the target:

```bash
console clusters curl target /_cluster/health
console clusters cat-indices --cluster target
```
{% include copy.html %}

## Maintaining rollback capability

Do not remove the source cluster or the migration infrastructure immediately after switching traffic. If you need to revert to the source, perform the following steps:

1. Redirect clients back to the previous route.
2. Investigate the target-side issue.
3. Decide whether to resume replay, rerun the migration, or retry the switch later.

Keep the source available until you confirm that the target is stable under production traffic. After the rollback window has passed, remove migration infrastructure and any temporary resources.

{% include migration-phase-navigation.html %}
