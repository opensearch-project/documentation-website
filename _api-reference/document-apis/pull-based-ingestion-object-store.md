---
layout: default
title: Object store source
parent: Pull-based ingestion
grand_parent: Document APIs
has_children: false
nav_order: 20
---

# Object store source for pull-based ingestion
**Introduced 3.10**
{: .label .label-purple }

The `object_store` source lets an index pull newline-delimited JSON (NDJSON) files directly from object storage, such as Amazon S3, Google Cloud Storage, Azure Blob Storage, or a shared file system. Each shard reads its own share of the files, so no separate streaming system or loader is needed for a one-time load.

The source reads through a registered [snapshot repository]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/), so the bucket, endpoint, and credentials stay in the repository configuration and never appear in index settings.

## Prerequisites

Before you create an index that uses the object store source, ensure that the following prerequisites are met:

* Install the `ingestion-object-store` plugin on every node using `bin/opensearch-plugin install ingestion-object-store`.
* Register a repository of type `s3`, `gcs`, `azure`, or `fs` with `"readonly": true`. The source rejects a repository that is not read-only, so it can never write to or delete from your bucket.
* Place the files in the repository before you create the index. Files must not change while the index ingests them.

The following request registers a read-only S3 repository:

```json
PUT /_snapshot/ingest-repo
{
  "type": "s3",
  "settings": {
    "bucket": "my-bucket",
    "base_path": "exports",
    "readonly": true
  }
}
```
{% include copy-curl.html %}

## Creating an index

The following request creates an index that reads five NDJSON files, assigning each file to one of three shards:

```json
PUT /events
{
  "settings": {
    "index.number_of_shards": 3,
    "index.number_of_replicas": 0,
    "index.replication.type": "SEGMENT",
    "index.ingestion_source.type": "object_store",
    "index.ingestion_source.pointer.init.reset": "earliest",
    "index.ingestion_source.mapper_type": "raw_payload",
    "index.ingestion_source.param.repository": "ingest-repo",
    "index.ingestion_source.param.shard_split": "whole_files",
    "index.ingestion_source.param.source_prefix": "events/part-",
    "index.ingestion_source.param.manifest": "[{\"key\":\"events/part-0001.ndjson\",\"size\":76},{\"key\":\"events/part-0002.ndjson\",\"size\":50},{\"key\":\"events/part-0003.ndjson\",\"size\":52},{\"key\":\"events/part-0004.ndjson\",\"size\":26},{\"key\":\"events/part-0005.ndjson\",\"size\":50}]"
  },
  "mappings": {
    "properties": {
      "name": { "type": "keyword" },
      "age": { "type": "integer" }
    }
  }
}
```
{% include copy-curl.html %}

The object store source requires two `ingestion_source` settings that differ from their defaults:

* `pointer.init.reset` must be `earliest` (or `none`). The default, `latest`, starts at the end of the data, so it is rejected, as is `reset_by_timestamp`. `reset_by_offset` is accepted only for an index with one shard.
* `mapper_type` must be `raw_payload`. Each line of a file becomes one document whose body is the line itself.

## Source parameters

Specify the following parameters as `index.ingestion_source.param.<name>`.

| Parameter | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `repository` | Yes | | The name of a registered, read-only `s3`, `gcs`, `azure`, or `fs` repository. If the repository is not yet registered, the shard retries every 10 seconds, so you can register it after creating the index. |
| `source_url` | One of `source_url` or `source_prefix` | | The key of a single object, relative to the repository base path. Required for `equal_bytes`. |
| `source_prefix` | One of `source_url` or `source_prefix` | | The key prefix under which the objects are stored, relative to the repository base path. Required for `whole_files` and `shard_prefixes`. |
| `shard_split` | Yes | | How the work is divided between shards. Valid values are `whole_files`, `shard_prefixes`, and `equal_bytes`. See [Dividing the work between shards](#dividing-the-work-between-shards). |
| `discovery` | No | `manifest` | How shards find the objects. Valid values are `manifest` and `list`. See [Finding the objects](#finding-the-objects). |
| `manifest` | With `discovery: manifest` | | The list of objects and their exact sizes in bytes, as a JSON array written as a string: `[{"key":"...","size":N}, ...]`. At most 1 MB. |
| `format` | No | `ndjson` | The file format. Only `ndjson` is supported. |
| `max_record_bytes` | No | `10485760` (10 MB) | The largest allowed record, in bytes. A longer line pauses the shard. |
| `max_objects` | No | `1000000` | The maximum number of objects a manifest may list or a shard may discover. |
| `max_list_requests` | No | Unlimited | The maximum number of list requests a shard may send to the store. |
| `max_get_requests` | No | Unlimited | The maximum number of read requests a shard may send to the store. |
| `max_bytes` | No | Unlimited | The maximum number of bytes a shard may read from the store. |

All keys are written relative to the repository base path. A key cannot start with `/`, contain `//`, `*`, or `?`, or contain a `.` or `..` path segment.

Object storage bills per request and per byte. If any of `max_list_requests`, `max_get_requests`, or `max_bytes` is left unlimited, the index logs a warning. The limits are counted per shard and start again when the shard restarts or moves.
{: .note}

## Finding the objects

The `discovery` parameter controls how each shard learns which objects exist.

### Manifest

With `discovery: manifest` (the default), you list every object and its exact size in the `manifest` parameter. Every shard reads the same list, so no list requests are sent to the store. Each key must start with `source_prefix`. Because the manifest is stored in the cluster state, it is limited to 1 MB; use `list` for larger object sets.

Objects added to the store after the index is created are ignored. An object that is removed, truncated, or grown before it is fully read pauses the shard.

### List

With `discovery: list`, each shard lists its own folder in the store when it starts. This mode requires `shard_split: shard_prefixes` and no `manifest`. Shard `N` reads the objects under `<source_prefix>/N/`. For example, with `source_prefix: listed/` and two shards, shard 0 reads `listed/0/` and shard 1 reads `listed/1/`. Folders are walked to a depth of 64.

A shard lists its folder again every time it starts, including after a restart, a relocation, or a settings update. Place all objects before you create the index and do not change them while the index ingests. After a new listing:

* An object added later is read only if its name sorts after the object the shard was reading.
* An unread object that was removed is skipped.
* A resized object is read to its new size.
* If the object the shard was reading was removed, the shard pauses, unless no objects remain in its folder, in which case it reads nothing and reports a lag of `0`.

Objects outside every shard folder are never read.

## Dividing the work between shards

Each shard computes its own share from the same settings, so every record is read by exactly one shard.

* `whole_files`: Each object is assigned to one shard by a hash of its key. This balances the number of objects, not their size.
* `shard_prefixes`: Objects under `<source_prefix>/N/` belong to shard `N`.
* `equal_bytes`: A single object, named by `source_url`, is cut into one byte range per shard. Each cut is moved forward to the start of the next line, so no record is split. The manifest must contain exactly that one object, with a size greater than 0.

## Behavior

* **Exactly-once ingestion**: Each document ID is built from the shard number, the object key, and the byte offset where the record starts. A record that is read again after a crash or restart gets the same ID and overwrites the earlier copy, so each record produces exactly one document.
* **Unchanged files**: The source checks that each object has its declared size. An object that is shorter or longer than declared, or that is declared empty but is not, pauses the shard instead of producing partial data.
* **Uncompressed files only**: Files compressed with gzip are rejected.
* **Lag**: `consumer_stats.pointer_based_lag` reports the number of bytes the shard still has to read. When it is `0` on every shard, ingestion is complete.
* **Errors**: A configuration error pauses the shard with the reason in the logs. A read error, such as a missing object or a reached cost limit, also pauses the shard. A line that cannot be parsed is handled by `error_strategy`.
* **Fixed layout**: Changing `manifest`, `source_url`, `source_prefix`, `shard_split`, or `discovery` on a live index is not supported. Create a new index instead.

## Related documentation

* [Pull-based ingestion]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/)
* [Pull-based ingestion management]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion-management/)
