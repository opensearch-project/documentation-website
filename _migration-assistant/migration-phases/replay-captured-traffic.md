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
---

# Replay captured traffic

This page only applies to zero-downtime migrations that use Capture and Replay.
{: .note }

Replay is the step that closes the time gap between the snapshot used for backfill and the current state of the source system.

## When replay should start

Replay should begin only after the dependent snapshot migration has completed. In the workflow model, this is normally expressed with:

```text
dependsOnSnapshotMigrations
```

That dependency is important. Starting replay too early can cause ordering problems between historical backfill and live change processing.

## What replay does

The Traffic Replayer:

1. reads captured traffic from Kafka
2. reconstructs requests
3. applies replay-time transformations and auth behavior
4. sends the requests to the target cluster
5. advances Kafka offsets so replay can resume safely

## Key replay settings

Important workflow settings include:

- `podReplicas`
- `speedupFactor` — default `1.1`. `2.0` means twice the original traffic timeline.
- `removeAuthHeader` — strips the captured `Authorization` header before replaying. Useful when the captured traffic carries credentials that would not be valid against the target.
- `authHeaderOverride` — replaces the captured `Authorization` header with a static value.
- `dependsOnSnapshotMigrations`
- `nonRetryableDocExceptionTypes`

`speedupFactor` controls how quickly replay tries to catch up relative to the original traffic timeline.

`nonRetryableDocExceptionTypes` is different from RFS `allowedDocExceptionTypes`. These replay errors are still counted as failures in the output, but they are not retried because they are expected to fail deterministically.

Setting both `replayerConfig.removeAuthHeader: true` and an `authConfig` block on the same target is rejected by the schema. Pick one — either rely on the target's `authConfig` (the Replayer applies it for you) or strip the captured header. Setting both causes a dual-auth startup crash.
{: .warning }

## What catch-up time depends on

Replay duration is mostly a function of:

- how much traffic was captured during backfill
- how fast the target can process that traffic
- the `speedupFactor` you configure

In other words, replay time is not fixed. It depends on backlog and throughput.

## Monitor replay

Use the interactive workflow view whenever possible:

```bash
workflow manage
```
{% include copy.html %}

Useful supporting commands:

```bash
workflow status
workflow output --follow
```
{% include copy.html %}

## What to validate before cutover

Do not switch traffic only because the Replayer is running. Validate that:

- replay has reached the live edge
- document counts are directionally correct
- representative queries behave correctly on the target
- target-side errors are understood and acceptable

Useful checks:

```bash
console clusters cat-indexes
console clusters curl target /my-index/_search --json '{"query":{"match_all":{}},"size":5}'
```
{% include copy.html %}

## What happens next

Once replay is caught up and the target is validated, move to the cutover step and keep the source available until the rollback window has passed.

{% include migration-phase-navigation.html %}
