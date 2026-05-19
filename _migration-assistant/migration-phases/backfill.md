---
layout: default
title: Backfill
nav_order: 6
parent: Migration workflows
permalink: /migration-assistant/migration-phases/backfill/
redirect_from:
  - /migration-phases/backfill/
  - /migration-assistant/migration-phases/create-snapshot/
  - /migration-phases/create-snapshot/
---

# Backfill

Backfill is the document-migration phase of a snapshot workflow. Migration Assistant creates or reuses a source snapshot, migrates metadata, and then uses Reindex-from-Snapshot (RFS) to load documents into the target.

The key idea is simple: RFS reads shard data from the snapshot, not from the live source cluster API. That is why it scales well and keeps steady pressure off the source cluster during the document phase.

## What happens during backfill

A typical snapshot migration includes:

1. Create a snapshot, or reference an existing snapshot
2. Evaluate metadata
3. Migrate metadata
4. Run document backfill with RFS
5. Validate the target before cutover or replay

You do not run these as unrelated commands. You define them in one workflow and let the platform orchestrate them.

## Start with a pilot

Backfill is safest when you run a small pilot first.

Use a limited snapshot scope or a small metadata and RFS allowlist so you can prove:

- snapshot creation works
- source S3 access works
- mappings migrate cleanly
- target indexing capacity is sufficient
- document-level failures are understood before you scale up

## Configure the workflow

Always start from the version-matched sample:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Then configure the snapshot migration section for your source, target, and snapshot repository.

## Understand the three different allowlists

This is one of the easiest places to make mistakes.

### Snapshot allowlist

The snapshot creation allowlist is evaluated by the source cluster when the snapshot is created. It uses the source cluster's native multi-index expression syntax such as:

- `logs-*`
- `orders-2024-*`
- `-*-archive`

This is **not** regex syntax.

### Metadata allowlist

The metadata allowlist is evaluated after the snapshot exists. It supports exact names and `regex:` patterns such as:

- `orders`
- `regex:logs-.*`

### RFS allowlist

The RFS allowlist is also evaluated after the snapshot exists and uses the same exact-name or `regex:` pattern format.

If an index is excluded at the snapshot layer, downstream stages cannot bring it back.
{: .warning }

## Using an existing snapshot

If you already created the snapshot outside the workflow, configure:

```text
snapshotConfig.snapshotNameConfig.externallyManagedSnapshotName
```

Use `workflow configure sample --load` to confirm the exact structure for your installed version.

## Run and monitor the workflow

```bash
workflow submit
workflow manage
```
{% include copy.html %}

Useful supporting commands:

```bash
workflow status
workflow log all --follow
```
{% include copy.html %}

## What to approve

If approvals are enabled, the workflow pauses at meaningful checkpoints so you can validate before continuing. Typical gates include:

- **After `evaluateMetadata`** — Migration Assistant has computed what mappings, templates, and settings it would apply. Review the evaluator output and decide whether the planned changes are safe before letting `migrateMetadata` write them to the target.
- **After `migrateMetadata`** — Metadata has been written to the target. Inspect the target with the commands below before backfill writes documents.
- **Before document backfill starts** — Last chance to verify counts, allowlists, and target capacity before RFS pods start indexing.
- **After RFS completes** — Compare source and target document counts and spot-check a few queries before unblocking the rest of the workflow (cutover, replay, or teardown).

Things to check while a gate is open:

```bash
# What did metadata migration write?
console clusters curl target /_cat/indexes?v
console clusters curl target /_cat/templates?v
console clusters curl target /_cat/aliases?v
console clusters curl target /<index>/_mapping

# How is RFS progressing?
workflow status --live-status
workflow log all --follow

# Does a sample of the target look right?
console clusters curl target /<index>/_count
console clusters curl target /<index>/_search?size=5&pretty
```
{% include copy.html %}

The easiest way to drive approvals is interactively from `workflow manage` — the TUI shows pending gates next to their step output and lets you approve them in place without typing step names. The CLI form is below for scripts and CI:

```bash
workflow approve step <STEP_NAME>
```
{% include copy.html %}

## Performance model

RFS scales mainly with:

- total data volume
- number of primary shards
- available Kubernetes resources
- target cluster ingest capacity

Because RFS reads from snapshot storage, increasing worker count does not add live read load to the source cluster. It mostly changes how hard you drive the target cluster.

## Common tuning and recovery options

Useful RFS settings include:

- `podReplicas` — number of RFS pods running in parallel (one shard per pod)
- `maxConnections` — bulk-indexer concurrency to the target
- `documentsPerBulkRequest` — bulk batch size
- `maxShardSizeBytes` — maximum supported shard size (default 80 GiB). Larger shards must be reduced before backfill (force-merge or split).
- `initialLeaseDuration` — ISO-8601 duration each worker holds a shard lease before re-acquisition (default `PT1H`)
- `allowedDocExceptionTypes` — list of exception class names from the target's response that should be **counted as success** for that document instead of retried. Use sparingly; a matching error is treated as a successful migration of that document.
- `allowLooseVersionMatching` — bypass the strict source/target version compatibility check (default `true`)

`allowedDocExceptionTypes` and the Replayer's `nonRetryableDocExceptionTypes` are **not the same**. RFS treats matching exceptions as success; the Replayer treats them as deterministic failures that should not be retried. Map them to your target's actual error class names — see [Replay captured traffic]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/) for the replay side.
{: .warning }

## Validate after backfill

After the workflow completes, compare the source and target:

```bash
console clusters cat-indices
console clusters curl target /<index>/_count
```
{% include copy.html %}

If you are doing zero-downtime migration, backfill validation happens before replay becomes the final synchronization step.

{% include migration-phase-navigation.html %}
