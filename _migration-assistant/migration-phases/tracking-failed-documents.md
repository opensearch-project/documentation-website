---
layout: default
title: Tracking and remediating failed documents
parent: Backfill
grand_parent: Migration workflows
nav_order: 10
permalink: /migration-assistant/migration-phases/tracking-failed-documents/
---

# Tracking and remediating failed documents

During a [backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/), Reindex-from-Snapshot (RFS) retries most document errors automatically. A document counts as failed only when the error is terminal, either because the error is non-retryable or because RFS exhausted the retry limit. You can list which documents failed, determine why they failed, and remediate them.

## Where failures are recorded

Terminal document failures are recorded in two places:

- The failed document stream is a durable inventory of terminal failures written to Amazon S3 as gzip-compressed NDJSON. Each record identifies the document and captures enough detail to diagnose or resubmit it without returning to the source cluster.
- The RFS worker logs contain lower-level diagnostic detail. The workers log each failed bulk request, including the target index, failed item count, root cause, and the request and response bodies.

{: .warning }
> The failed document stream is **off by default**. If you do not enable it before running the backfill, a failed migration leaves no durable inventory of which documents did not land; you would be limited to the worker logs. Enable it as described in [Enabling the failed document stream](#enabling-the-failed-document-stream) before you start the backfill.

## Enabling the failed document stream

Setting an S3 bucket in the migration's `documentBackfillConfig` enables the stream. There is no separate enable flag and no default bucket:

```yaml
documentBackfillConfig:
  failedDocumentStreamS3Bucket: my-failed-documents-bucket
```
{% include copy.html %}

The following table lists the options that configure the failed document stream.

| Option | Default | Description |
| :-- | :-- | :-- |
| `failedDocumentStreamS3Bucket` | None | The bucket that stores the records. Setting it enables the stream. |
| `failedDocumentStreamS3Prefix` | `rfs-failed-document-stream/` | The key prefix. Each run has a session root at `<prefix>session=<uid>/`; individual objects are nested under that root by target index and worker. |
| `failedDocumentStreamS3Region` | Resolved from the configuration | The AWS Region of the bucket. Ignored when no bucket is set. |
| `failedDocumentStreamS3Endpoint` | Resolved from the configuration | An endpoint override, for example, LocalStack. Ignored when no bucket is set. |
| `failedDocumentStreamMaxBufferBytes` | `67108864` (64 MiB) | The maximum number of in-memory bytes per index before rotating to a new object. |

The console reports the session root:

```
s3://<bucket>/<prefix>session=<SnapshotMigration-UID>/
```

The individual gzip-compressed NDJSON objects are stored beneath that root:

```
s3://<bucket>/<prefix>session=<SnapshotMigration-UID>/index=<targetIndex>/worker=<workerId>/failed-document-stream-<timestamp>-<sequence>.ndjson.gz
```

## Checking whether any documents failed

Run a deep status check from a Migration Console shell:

```bash
console backfill status --deep-check
```
{% include copy.html %}

The output reports the failed document stream location and indicates whether any failures are present:

```
...
failed document stream location: s3://my-bucket/rfs-failed-document-stream/session=abc-123/
Failed documents present: yes
```

The status command reports whether failures exist but not how many. Counting requires reading every failed document record, which is unbounded work on a large failure set. To retrieve the number of failed documents, use `console failed-document-stream count`, described in [Inspecting failed documents](#inspecting-failed-documents).

In JSON mode, the same check adds the `failed_document_stream_location` and `failed_documents_present` fields:

```bash
console --json backfill status --deep-check
```
{% include copy.html %}

{: .note }
> If the stream is configured but cannot be read, for example, because of missing S3 permissions, the console command fails rather than reporting no failures.

## Inspecting failed documents

Run the following commands from a Migration Console shell. When more than one `SnapshotMigration` exists, add `--migration <name>` to select one:

```bash
# S3 location for the current session
console failed-document-stream location

# Count of distinct failed documents
console failed-document-stream count

# List failures (columns: timestamp, targetIndex, documentId, failureClass, failureType)
console failed-document-stream list --limit 100

# Full records as JSON, including the captured request item and the OpenSearch response
console --json failed-document-stream list --limit 100
```
{% include copy.html %}

The following table lists the fields included in each record.

| Field | Description |
| :-- | :-- |
| `targetIndex` | The index the document was being written to. |
| `documentId` | The document's ID. |
| `failureClass` | How the document reached the stream (for example, non-retryable, or `retryable` retries exhausted). |
| `failureType` | The OpenSearch error type, for example `mapper_parsing_exception`. |
| `requestItem` | The captured bulk request item. When the original source document is available, that source content is stored here so you can diagnose or resubmit without going back to the source cluster. |

A document can appear in the stream more than once, so the console deduplicates records on read by `targetIndex` and `documentId`. Counts therefore reflect the number of distinct failed documents.

## Reading the RFS worker logs

For lower-level detail, inspect the RFS worker logs. Each failed bulk request produces an error entry with the target index, failed item count, root cause, and the OpenSearch response body, plus a structured entry under the `FailedRequestsLogger` category containing the request and response bodies.

{: .note }
> Individual failed-item bodies are deliberately omitted from the general worker log to avoid leaking document data; the full request body is emitted only to the dedicated `FailedRequestsLogger` category.

## Remediating failures

Use the failed document stream to identify the main cause before retrying any documents.

### Identifying the failure type

Group the failures returned by `list` by `failureType` to identify the cause, and use `failureClass` to determine whether the error was non-retryable or became terminal only after retries were exhausted. The following table lists common failure types and the recommended remediation for each.

| `failureType` | Typical cause | Remediation |
| :-- | :-- | :-- |
| `mapper_parsing_exception` | Document doesn't match the target index mapping. | Fix the target mapping or add/correct a transform, then resubmit. |
| `version_conflict_engine_exception` | A newer version of the document already exists at the target. | Usually safe to leave; resubmit only if the source version should win. |
| `es_rejected_execution_exception` (often with `failureClass=RETRYABLE_EXHAUSTED`) | Target was overloaded or briefly unavailable. | Address target capacity, then resubmit the affected documents. |

### Resubmitting the failed documents

The `console --json failed-document-stream list` output contains each failed document's `requestItem`, so you can correct the root cause, such as a mapping or a transform, and then resubmit those documents to the target. When the original source document was available, `requestItem` holds that source content. It is not guaranteed to hold the exact transformed payload that was sent on the failed write.

## Deleting failed document records

The `backfill reset` command archives working state and preserves the failed document stream by default. To also delete the current session's records, add `--include-failed-document-stream`. This deletion is irreversible:

```bash
console backfill reset --include-failed-document-stream
```
{% include copy.html %}

## Related documentation

- [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)
- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
