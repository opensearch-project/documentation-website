---
layout: default
title: Replay captured traffic
nav_order: 7
parent: Migration phases
permalink: /migration-assistant/migration-phases/replay-captured-traffic/
---

# Replay captured traffic

This page is only relevant if you are using Capture and Replay for a zero-downtime migration. If you are only performing a backfill migration, skip this step.
{: .note }

After metadata migration and document backfill are complete, the Traffic Replayer reads captured traffic from Kafka and replays it against the target cluster. This closes the gap between the snapshot point-in-time and the current state of the source.

## When to start replay

Start the replayer **after** backfill completes. If you configured `dependsOnSnapshotMigrations` in your replayer config, the workflow handles this sequencing automatically — the replayer waits for the specified snapshot migrations to finish before starting.

If replay starts before backfill completes, delete operations captured during the backfill window may execute before the corresponding documents are migrated, causing data inconsistency.

## How replay works on Kubernetes

The replayer runs as a Kubernetes Deployment managed by the workflow. It:

1. Reads captured traffic from the Kafka topic associated with the capture proxy
2. Reconstructs HTTP requests from the captured byte streams
3. Applies request transformations (auth headers, index names) as configured
4. Sends requests to the target cluster
5. Tracks Kafka consumer offsets for resumability

## Monitoring replay

```bash
# Interactive TUI — watch replayer progress
workflow manage

# Check workflow status
workflow status

# Stream replayer logs
workflow output --follow
```
{% include copy.html %}

## Configuration options

The replayer is configured in `traffic.replayers.<name>.replayerConfig` in your workflow YAML. Key options:

| Option | Description |
|:-------|:------------|
| `podReplicas` | Number of replayer pods (scale for throughput) |
| `speedupFactor` | Replay faster than real-time to catch up (e.g., `2.0` = 2x speed) |
| `nonRetryableDocExceptionTypes` | Document errors to skip retrying (e.g., `mapper_parsing_exception`) |

Run `workflow configure sample` for the full list of options.

## Verifying replay completion

The replayer catches up when it reaches the live edge of the Kafka topic. At that point, the target cluster is synchronized with the source. Verify:

```bash
# Compare document counts
console clusters curl source -- "/_cat/indices?v"
console clusters curl target -- "/_cat/indices?v"

# Run representative queries against both
console clusters curl target -- "/my-index/_search" --json '{"query":{"match_all":{}},"size":5}'
```
{% include copy.html %}

## Next steps

Once the target is caught up and verified:
1. [Switch traffic to the target]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/switch-traffic-to-target/)
2. [Remove migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/)

{% include migration-phase-navigation.html %}
