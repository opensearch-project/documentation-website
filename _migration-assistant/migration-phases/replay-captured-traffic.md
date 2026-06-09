---
layout: default
title: Replay captured traffic
nav_order: 7
parent: Migration workflows
permalink: /migration-assistant/migration-phases/replay-captured-traffic/
redirect_from:
  - /migration-assistant/migration-phases/live-traffic-migration/using-traffic-Replayer/
  - /migration-assistant/migration-phases/using-traffic-Replayer/
  - /migration-phases/using-traffic-Replayer/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/replay-captured-traffic/
---

# Replay captured traffic

The following information applies only to zero-downtime migrations that use Capture and Replay.
{: .note }

Replay is the step that closes the time gap between the snapshot used for backfill and the current state of the source system.

## Replay start conditions

Replay should begin only after the dependent snapshot migration has completed. In the workflow model, this is normally expressed with:

```text
dependsOnSnapshotMigrations
```

That dependency is important. Starting replay too early can cause ordering problems between historical backfill and live change processing.

## Replay process

The Traffic Replayer performs the following steps:

1. Reads captured traffic from Kafka.
2. Reconstructs requests.
3. Applies replay-time transformations and authentication.
4. Sends the requests to the target cluster.
5. Advances Kafka offsets so replay can resume safely.

## Key replay settings

The following table describes the key replay workflow settings.

| Setting | Description | Default |
|:--------|:------------|:--------|
| `podReplicas` | The number of Replayer pods running in parallel. | N/A |
| `speedupFactor` | Controls how quickly replay catches up relative to the original traffic timeline. A value of `2.0` replays at twice the original rate. | `1.1` |
| `removeAuthHeader` | Strips the captured `Authorization` header before replaying. Use when the captured traffic carries credentials that are not valid against the target. | N/A |
| `authHeaderOverride` | Replaces the captured `Authorization` header with a static value. | N/A |
| `dependsOnSnapshotMigrations` | Specifies which snapshot migration must complete before replay begins. | N/A |
| `nonRetryableDocExceptionTypes` | A list of exception class names that are counted as failures but not retried because they are expected to fail deterministically. This setting differs from the RFS `allowedDocExceptionTypes`, which treats matching exceptions as success. | N/A |

Do not set both `replayerConfig.removeAuthHeader: true` and an `authConfig` block on the same target. The schema rejects this combination. Either rely on the target's `authConfig` (the Replayer applies it automatically) or strip the captured header.
{: .warning }

## Factors affecting replay duration

Replay duration depends on the following factors:

- The volume of traffic captured during backfill.
- The target cluster's processing throughput.
- The `speedupFactor` value in your configuration.

## Monitor replay

Use the interactive workflow view whenever possible:

```bash
workflow manage
```
{% include copy.html %}

The following commands provide additional monitoring information:

```bash
workflow status
workflow log all --follow
```
{% include copy.html %}

## Pre-cutover validation

Do not switch traffic only because the Replayer is running. Before proceeding, confirm the following:

- Replay has reached the live edge.
- Document counts are directionally correct.
- Representative queries behave correctly on the target.
- Target-side errors are understood and acceptable.

The following commands help validate the target state:

```bash
console clusters cat-indices
console clusters curl target /my-index/_search --json '{"query":{"match_all":{}},"size":5}'
```
{% include copy.html %}

After replay reaches the live edge and validation passes, proceed to switch traffic. Keep the source available until the rollback window has passed.

{% include migration-phase-navigation.html %}
