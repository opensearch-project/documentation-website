---
layout: default
title: Tracking and remediating failed documents
parent: Migration workflows
nav_order: 6.5
permalink: /migration-assistant/migration-phases/tracking-failed-documents/
---

# Tracking and remediating failed documents

During a [backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/), Reindex-from-Snapshot (RFS) retries most document errors automatically. A document is only counted as *failed* when the error is terminal, either non-retryable, or retried until the retry limit was exhausted. This page shows operators where those failures are recorded, how to see exactly which documents failed and why, and how to remediate them.

## Where failures are recorded

Terminal document failures are recorded in two places:

- **Failed document stream (durable, structured).** An inventory of terminal failures written to Amazon S3 as gzip-compressed NDJSON. Each record identifies the document and captures enough detail to diagnose or resubmit it without returning to the source cluster.
- **RFS worker logs (diagnostic detail).** Each failed bulk request is logged by the RFS workers, including the target index, failed item count, root cause, and the request and response bodies.

{: .warning }
> The failed document stream is **off by default**. If you do not enable it before running the backfill, a failed migration leaves no durable inventory of which documents did not land; you would be limited to the worker logs. Enable it as described in [Enabling the failed document stream](#enabling-the-failed-document-stream) before you start the backfill.

## Enabling the failed document stream

Set an S3 bucket under the migration's `documentBackfillConfig`. Setting the bucket is the on/off switch; there is no separate enable flag and no default bucket.

```yaml
documentBackfillConfig:
  failedDocumentStreamS3Bucket: my-failed-documents-bucket
```

| Option | Default | Description |
| :-- | :-- | :-- |
| `failedDocumentStreamS3Bucket` | none-stream off | Bucket for records. Setting it enables the stream. |
| `failedDocumentStreamS3Prefix` | `rfs-failed-document-stream/` | Key prefix. Each run has a session root at `<prefix>session=<uid>/`; individual objects are nested under that root by target index and worker. |
| `failedDocumentStreamS3Region` | resolved from config | Region for the bucket. Ignored without a bucket. |
| `failedDocumentStreamS3Endpoint` | resolved from config | Endpoint override (for example, LocalStack). Ignored without a bucket. |
| `failedDocumentStreamMaxBufferBytes` | `67108864` (64 MiB) | Max in-memory bytes per index before rotating to a new object. |

The console reports the session root:

```
s3://<bucket>/<prefix>session=<SnapshotMigration-UID>/
```

The individual gzip-compressed NDJSON objects are stored beneath that root:

```
s3://<bucket>/<prefix>session=<SnapshotMigration-UID>/index=<targetIndex>/worker=<workerId>/failed-document-stream-<timestamp>-<sequence>.ndjson.gz
```

## Checking whether any documents failed

Run a deep status check from a Migration Console shell. It appends the failed document stream location and whether any failures are present:

```
console backfill status --deep-check
```

```
...
failed document stream location: s3://my-bucket/rfs-failed-document-stream/session=abc-123/
Failed documents present: yes
```

The status command reports only *whether* failures exist, not how many. Counting requires reading every failed-document record, which is unbounded work on a large failure set. To get the number of failed documents, use `console failed-document-stream count` in [Inspecting failed documents](#inspecting-failed-documents).

In JSON mode, the same check adds `failed_document_stream_location` and `failed_documents_present`:

```
console --json backfill status --deep-check
```

{: .note }
> If the stream is configured but cannot be read (for example, missing S3 permissions), the console command fails rather than reporting "no failures" — a stream that cannot be read is never reported as empty.

## Inspecting failed documents

Run these from a Migration Console shell. When more than one `SnapshotMigration` exists, add `--migration <name>` to choose one.

```
# S3 location for the current session
console failed-document-stream location

# Count of distinct failed documents
console failed-document-stream count

# List failures (columns: timestamp, targetIndex, documentId, failureClass, failureType)
console failed-document-stream list --limit 100

# Full records as JSON, including the captured request item and the OpenSearch response
console --json failed-document-stream list --limit 100
```

Each record includes:

| Field | Description |
| :-- | :-- |
| `targetIndex` | The index the document was being written to. |
| `documentId` | The document's ID. |
| `failureClass` | How the document reached the stream (for example, non-retryable, or `retryable` retries exhausted). |
| `failureType` | The OpenSearch error type, for example `mapper_parsing_exception`. |
| `requestItem` | The captured bulk request item. When the original source document is available, that source content is stored here so you can diagnose or resubmit without going back to the source cluster. |

The stream is at-least-once and the console de-duplicates on read by `(targetIndex, documentId)`, so counts reflect *distinct* failed documents.

## Reading the RFS worker logs

For lower-level detail, inspect the RFS worker logs. Each failed bulk request produces an error entry with the target index, failed item count, root cause, and the OpenSearch response body, plus a structured entry under the `FailedRequestsLogger` category containing the request and response bodies.

{: .note }
> Individual failed-item bodies are deliberately omitted from the general worker log to avoid leaking document data; the full request body is emitted only to the dedicated `FailedRequestsLogger` category.

## Remediating failures

Use the failed document stream to identify the main cause before retrying any documents.

### Understand the failure type

Group the failures by `failureType` (from `list`) to see what is going wrong, and use `failureClass` to tell whether the error was non-retryable or only became terminal after retries were exhausted. Common cases:

| `failureType` | Typical cause | Remediation |
| :-- | :-- | :-- |
| `mapper_parsing_exception` | Document doesn't match the target index mapping. | Fix the target mapping or add/correct a transform, then resubmit. |
| `version_conflict_engine_exception` | A newer version of the document already exists at the target. | Usually safe to leave; resubmit only if the source version should win. |
| `es_rejected_execution_exception` (often with `failureClass=RETRYABLE_EXHAUSTED`) | Target was overloaded or briefly unavailable. | Address target capacity, then resubmit the affected documents. |

### Resubmit the failed documents

The `--json ... list` output contains each failed document's `requestItem`, so you can correct the root cause (for example, a mapping or transform) and resubmit those documents to the target. When the original source document was available, `requestItem` preserves that source-side content rather than guaranteeing the exact transformed payload that was sent on the failed write.

## Deleting records

`backfill reset` archives working state and, by default, preserves the failed document stream. To also delete the current session's records (irreversible), add `--include-failed-document-stream`:

```
console backfill reset --include-failed-document-stream
```

## Related pages

- [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)
- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
