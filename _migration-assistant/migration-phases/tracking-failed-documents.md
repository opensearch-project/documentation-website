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

Setting an S3 bucket in the migration's `documentBackfillConfig` enables the stream. There is no separate enable flag, and the stream does not fall back to the deployment's default bucket, so you must name a bucket explicitly. Complete these steps from a Migration Console shell before you start the backfill:

1. Choose a bucket. On Amazon EKS, you can use the deployment's default bucket, `migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>`, to which Migration Assistant can write. The following command lists the default bucket for every Migration Assistant deployment in the account, so choose the one that matches your stage and Region:

   ```bash
   aws s3 ls | grep migrations-default
   ```
   {% include copy.html %}

   Alternatively, create a bucket in the same AWS account:

   ```bash
   aws s3 mb s3://<BUCKET_NAME> --region <REGION>
   ```
   {% include copy.html %}

1. Open the workflow configuration:

   ```bash
   workflow configure edit
   ```
   {% include copy.html %}

1. Add the bucket to each migration's `documentBackfillConfig` and then save:

   ```yaml
   snapshotMigrationConfigs:
     - ...
       perSnapshotConfig:
         snap1:
           - documentBackfillConfig:
               failedDocumentStreamS3Bucket: <BUCKET_NAME>
   ```
   {% include copy.html %}

1. Submit the workflow:

   ```bash
   workflow submit
   ```
   {% include copy.html %}

1. After the backfill starts, confirm the stream location:

   ```bash
   console failed-document-stream location
   ```
   {% include copy.html %}

To use a bucket in another AWS account or a bucket encrypted with a KMS key that you manage, also grant the Migration Assistant pod role access in the bucket policy or KMS key policy. On Amazon EKS, uninstalling Migration Assistant empties and deletes the default bucket by default. Copy any records that you want to keep before uninstalling Migration Assistant.
{: .note }

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
s3://<bucket>/<prefix>session=<migration-UID>/
```

The individual gzip-compressed NDJSON objects are stored beneath that root:

```
s3://<bucket>/<prefix>session=<migration-UID>/index=<targetIndex>/worker=<workerId>/failed-document-stream-<timestamp>-<sequence>.ndjson.gz
```

## Checking whether any documents failed

After the backfill finishes, run the following commands from a Migration Console shell:

```bash
workflow status
```
{% include copy.html %}

```bash
console failed-document-stream count
```
{% include copy.html %}

A count greater than `0` means that documents failed. `workflow status` can report the backfill as completed even when documents failed, so check the count rather than relying on the workflow status alone.

{: .note }
> If the stream is configured but cannot be read, for example, because of missing S3 permissions, the console command fails rather than reporting no failures.

## Inspecting failed documents

Run the following commands from a Migration Console shell. When more than one migration exists, add `--migration <name>` to select one:

```bash
# S3 location for the current session
console failed-document-stream location

# Count of distinct failed documents
console failed-document-stream count

# List failures as tab-separated rows without a header
# (columns: timestamp, targetIndex, documentId, failureClass, failureType)
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
| `failureClass` | How the document reached the stream: `NON_RETRYABLE` for errors that are never retried, or `RETRYABLE_EXHAUSTED` when retries were exhausted. |
| `failureType` | The OpenSearch error type, for example `mapper_parsing_exception`. |
| `timestamp` | The time when the failure was recorded. |
| `sessionId` | The session the record belongs to. This matches the migration UID in the stream location. |
| `workerId` | The RFS worker that produced the failure. |
| `workItemId` | The shard work item that produced the failure. |
| `requestItem` | The captured bulk request item. When the original source document is available, the source content is stored under `document` so you can diagnose the problem or resubmit the request without retrieving the document from the source cluster. |
| `responseItem` | The OpenSearch bulk response item, including the error type and reason. |

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

The Migration Console doesn't provide a command to delete failed document records. To delete the current session's records, remove the session location returned by the `console failed-document-stream location` command. This deletion is irreversible:

```bash
aws s3 rm --recursive s3://<BUCKET>/<PREFIX>session=<migration-UID>/
```
{% include copy.html %}

## Related documentation

- [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)
- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
