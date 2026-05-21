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

RFS reads shard data from the snapshot rather than from the live source cluster API, so it scales well and keeps load off the source cluster during the document phase.

## Backfill process

A typical snapshot migration includes:

1. Create a snapshot, or reference an existing snapshot
2. Evaluate metadata
3. Migrate metadata
4. Run document backfill with RFS
5. Validate the target before cutover or replay

You define these in one workflow and let the platform orchestrate them.

## Pilot migration

Run a small pilot before the full migration. Use a limited snapshot scope or a small metadata and RFS allow list to confirm that:

- Snapshot creation is correct.
- Source Amazon S3 access is correct.
- Mappings migrate correctly.
- Target indexing capacity is sufficient.
- Any document-level errors are resolved before you run the full migration.

## Configure the workflow

Always start from the version-matched sample:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Then configure the snapshot migration section for your source, target, and snapshot repository.

## Allow list types

Migration Assistant uses three separate allow lists, each evaluated at a different stage. Using the incorrect one is a common source of errors, so review the following distinctions carefully.

### Snapshot allow list

The snapshot creation allow list is evaluated by the source cluster when the snapshot is created. It uses the source cluster's native multi-index expression syntax such as:

- `logs-*`
- `orders-2024-*`
- `-*-archive`

### Metadata allow list

The metadata allow list is evaluated after the snapshot exists. It supports exact names and `regex:` patterns such as:

- `orders`
- `regex:logs-.*`

### RFS allow list

The RFS allow list is also evaluated after the snapshot exists and uses the same exact-name or `regex:` pattern format.

If an index is excluded from the snapshot, the metadata and RFS allow lists cannot recover it. Verify your snapshot allow list before proceeding.
{: .warning }

## Using an existing snapshot

If you already created the snapshot outside the workflow, use `workflow configure sample --load` to confirm the exact structure for your installed version, then set the following parameter in your workflow configuration:

```text
snapshotConfig.snapshotNameConfig.externallyManagedSnapshotName
```

## Run and monitor the workflow

To submit the workflow and monitor progress, run the following commands:

```bash
workflow submit
workflow manage
```
{% include copy.html %}

The following commands provide additional monitoring information:

```bash
workflow status
workflow log all --follow
```
{% include copy.html %}

## Approvals

If approvals are enabled, the workflow pauses at meaningful checkpoints so you can validate before continuing. Typical gates include:

- **After `evaluateMetadata`** -- Migration Assistant has computed what mappings, templates, and settings it would apply. Review the evaluator output and decide whether the planned changes are safe before letting `migrateMetadata` write them to the target.
- **After `migrateMetadata`** -- Metadata has been written to the target. Inspect the target with the following commands before backfill writes documents.
- **Before document backfill starts** -- Last chance to verify counts, allow lists, and target capacity before RFS pods start indexing.
- **After RFS completes** -- Compare source and target document counts and spot-check a few queries before unblocking the rest of the workflow (cutover, replay, or removal).

While a gate is open, run the following validation commands:

```bash
# What did metadata migration write?
console clusters curl target /_cat/indices?v
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

To approve gates interactively, use `workflow manage`. The terminal user interface (TUI) shows pending gates next to their step output and allows you to approve them in place. For scripts and CI, use the following CLI form:

```bash
workflow approve step <STEP_NAME>
```
{% include copy.html %}

## Performance model

RFS performance depends on the following factors:

- Total data volume
- Number of primary shards
- Available Kubernetes resources
- Target cluster ingest capacity

Because RFS reads from snapshot storage, increasing worker count does not add read load to the source cluster; it increases write pressure on the target cluster.

## Common tuning and recovery options

The following table describes the RFS settings available for tuning and recovery.

| Setting | Description | Default |
|:--------|:------------|:--------|
| `podReplicas` | The number of RFS pods running in parallel (one shard per pod). | N/A |
| `maxConnections` | The bulk-indexer concurrency to the target. | N/A |
| `documentsPerBulkRequest` | The bulk batch size. | N/A |
| `maxShardSizeBytes` | The maximum supported shard size. Larger shards must be reduced before backfill (force-merge or split). | 80 GiB |
| `initialLeaseDuration` | The ISO-8601 duration each worker holds a shard lease before re-acquisition. | `PT1H` |
| `allowedDocExceptionTypes` | A list of exception class names from the target's response that are counted as success for that document instead of retried. Use sparingly; a matching error is treated as a successful migration of that document. This setting differs from the Replayer's `nonRetryableDocExceptionTypes`, which treats matching exceptions as deterministic failures that should not be retried. For the replay side, see [Replay captured traffic]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/). | N/A |
| `allowLooseVersionMatching` | Bypasses the strict source/target version compatibility check. | `true` |

## Validate after backfill

After the workflow completes, compare the source and target:

```bash
console clusters cat-indices
console clusters curl target /<index>/_count
```
{% include copy.html %}

For zero-downtime migrations, complete backfill validation before replay begins the final synchronization step.

{% include migration-phase-navigation.html %}
