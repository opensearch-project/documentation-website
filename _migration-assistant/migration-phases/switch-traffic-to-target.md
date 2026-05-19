---
layout: default
title: Switch traffic to the target
nav_order: 8
parent: Migration workflows
permalink: /migration-assistant/migration-phases/switch-traffic-to-target/
redirect_from:
  - /migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/
---

# Switch traffic to the target

This page only applies to zero-downtime migrations that use Capture and Replay.
{: .note }

Switching traffic is the cutover step. By this point, capture has already protected writes during backfill, replay has caught the target up, and validation should already be complete.

## Cutover checklist

Before you switch:

- replay has reached the live edge
- the target cluster is healthy
- representative application queries work on the target
- the application team is ready to move traffic
- the rollback path is still available

## How to cut over

The exact mechanism depends on your environment, but the principle is always the same:

1. stop pointing clients at the capture proxy
2. point clients directly at the target cluster
3. watch the target closely during the first production traffic window

In practice, that usually means updating:

- a DNS record
- a load balancer backend
- an application connection string
- or a service-discovery entry

## Validate immediately after cutover

Right after you switch, check:

- cluster health
- basic index visibility
- representative application behavior

Useful commands:

```bash
console clusters curl target /_cluster/health
console clusters cat-indices --cluster target
```
{% include copy.html %}

## Keep the rollback path open

Do not immediately tear down the source or the migration infrastructure.

If you need to fall back:

1. point clients back to the previous route
2. investigate the target-side issue
3. decide whether to resume replay, rerun the migration, or retry cutover later

Keep the source available until the application team is comfortable that the target is stable under real production traffic.

## What happens next

After the rollback window has passed, remove migration infrastructure and clean up any temporary resources.

{% include migration-phase-navigation.html %}
