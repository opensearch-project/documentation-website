---
layout: default
title: Capture and Replay
nav_order: 7
parent: Migration phases
permalink: /migration-assistant/migration-phases/capture-and-replay/
redirect_from:
  - /migration-assistant/migration-phases/using-traffic-replayer/
  - /migration-phases/using-traffic-replayer/
  - /migration-assistant/migration-phases/replay-captured-traffic/
  - /migration-phases/replay-captured-traffic/

---

# Capture and Replay

Capture and Replay enables zero-downtime migrations by recording ongoing traffic to the source cluster and replaying it on the target, keeping both clusters in sync.

Capture and Replay support is version-dependent. Run `console --version` and check your release notes to confirm availability. Use `workflow configure sample` to see if the `traffic` configuration section is present in your version's schema.
{: .note }

## When to use Capture and Replay

Use Capture and Replay when:
- You cannot pause writes during migration (zero-downtime requirement)
- You want to validate that the target cluster handles real production traffic correctly before switching over
- You need to keep the target synchronized with ongoing source changes during a backfill

If you can tolerate a brief write pause, [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/) alone is simpler.

## Architecture

Capture and Replay deploys three components, all managed by Migration Assistant on Kubernetes:

1. **Capture Proxy** — An isolated fleet of proxy instances deployed as a Kubernetes Deployment. The source cluster is never modified. The proxy forwards every request to the source while recording raw request/response streams to Kafka.
2. **Kafka** — A durable message queue managed by Strimzi (the Kafka operator for Kubernetes) or an external Kafka cluster. Ensures no traffic is lost even if the replayer falls behind.
3. **Traffic Replayer** — Reads captured traffic from Kafka and replays it against the target cluster, transforming requests as needed (auth headers, index names, document content).

## The zero-downtime migration process

1. **Deploy the capture proxy** and route client traffic through it. The source cluster continues operating normally.
2. **Start the backfill** (snapshot → metadata → RFS document load). While backfill runs, the proxy records all new writes.
3. **Start the replayer** after backfill completes. It reads from the beginning of the Kafka topic and replays all captured traffic against the target.
4. **Monitor convergence**. The replayer eventually catches up to the live traffic stream.
5. **Validate** the target: compare document counts, run test queries.
6. **Switch over**: Redirect client traffic from the capture proxy directly to the target cluster.

## Key considerations

### Document IDs

Capture and Replay requires that clients provide explicit document IDs for index and update operations. Automatically generated document IDs are not preserved during replay.
{: .warning }

### Request transformations

The replayer supports transforming requests during replay:
- **Authentication**: Replace source auth headers with target-appropriate credentials
- **Index names**: Remap index names if the target uses a different naming scheme
- **Document content**: Transform document fields if needed

### Scaling

- **Proxy**: Scale horizontally by increasing `podReplicas` — each proxy instance is stateless
- **Replayer**: Scale by increasing `podReplicas` — Kafka partitions are distributed across replayer instances
- **Kafka**: Scale by increasing partitions and broker count

## Configuration

Capture and Replay is configured in the `traffic` section of your workflow configuration. Run `workflow configure sample` to see the full schema for your version.

## Monitoring

```bash
# Interactive TUI
workflow manage

# Check workflow status
workflow status

# Stream logs
workflow output --follow
```
{% include copy.html %}

{% include migration-phase-navigation.html %}
