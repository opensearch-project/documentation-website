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

The `object_store` source lets an index pull newline-delimited JSON (NDJSON) files directly from object storage, such as Amazon Simple Storage Service (Amazon S3), Google Cloud Storage, Azure Blob Storage, or a shared file system. Each shard reads its own portion of the files, so you don't need a separate streaming system or loading tool for a one-time load.

The source reads objects through a registered [snapshot repository]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/), so the bucket, endpoint, and credentials are stored in the repository configuration and never appear in index settings.

## Prerequisites

Before you create an index that uses the object store source, ensure that the following prerequisites are met:

* Install the `ingestion-object-store` plugin on every node using `bin/opensearch-plugin install ingestion-object-store`.
* Register a repository of type `s3`, `gcs`, `azure`, or `fs` and set `readonly` to `true`. The source rejects repositories that are not read-only, so it cannot modify or delete objects in your storage.
* Place the files in the repository before you create the index. The files must not change during ingestion.

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

The object store source requires the following `ingestion_source` settings to have non-default values:

* The `pointer.init.reset` setting must be `earliest` or `none`. The default value, `latest`, starts reading at the end of the data, so the source rejects it. The source also rejects `reset_by_timestamp` and accepts `reset_by_offset` only for single-shard indexes. For more information, see [Stream position]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/#stream-position).
* The `mapper_type` setting must be `raw_payload`. Each line of a file is indexed as one document, using the line as the document body. For more information, see [Message format]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/#message-format).

## Source parameters

The following table lists the source parameters. Specify each parameter as `index.ingestion_source.param.<name>`.

| Parameter | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `repository` | Yes | | The name of a registered read-only `s3`, `gcs`, `azure`, or `fs` repository. If the repository is not registered, the shard retries every 10 seconds, so you can register the repository after creating the index. |
| `source_url` | Conditional | | The key of a single object, relative to the repository base path. Either `source_url` or `source_prefix` is required. Required when `shard_split` is `equal_bytes`. |
| `source_prefix` | Conditional | | The key prefix of the objects to read, relative to the repository base path. Either `source_url` or `source_prefix` is required. Required when `shard_split` is `whole_files` or `shard_prefixes`. |
| `shard_split` | Yes | | The method used to divide objects among shards. Valid values are `whole_files`, `shard_prefixes`, and `equal_bytes`. For more information, see [Dividing objects among shards](#dividing-objects-among-shards). |
| `discovery` | No | `manifest` | The method that shards use to find objects. Valid values are `manifest` and `list`. For more information, see [Finding objects](#finding-objects). |
| `manifest` | Conditional | | The list of objects and their exact sizes in bytes, provided as a JSON array in a string: `[{"key":"<key>","size":<size>}, ...]`. Required when `discovery` is `manifest`. Maximum size is 1 MB. |
| `format` | No | `ndjson` | The file format. Only `ndjson` is supported. |
| `max_record_bytes` | No | `10485760` (10 MB) | The maximum record size, in bytes. A line that exceeds this size pauses the shard. |
| `max_objects` | No | `1000000` | The maximum number of objects that a manifest can list or that a shard can discover. |
| `max_list_requests` | No | Unlimited | The maximum number of list requests that a shard can send to the object store. |
| `max_get_requests` | No | Unlimited | The maximum number of read requests that a shard can send to the object store. |
| `max_bytes` | No | Unlimited | The maximum number of bytes that a shard can read from the object store. |

All keys are relative to the repository base path. A key cannot start with `/`; contain `//`, `*`, or `?`; or contain a `.` or `..` path segment.

Object storage providers can charge per request and per byte transferred. If `max_list_requests`, `max_get_requests`, or `max_bytes` is unlimited, OpenSearch logs a warning. Limits are counted per shard and reset when the shard restarts or relocates.
{: .note}

## Finding objects

The `discovery` parameter determines how each shard finds the objects to read. It supports the `manifest` and `list` methods.

### Manifest

When `discovery` is `manifest` (the default), you list every object and its exact size in the `manifest` parameter. Every shard reads the same list, so the source sends no list requests to the object store. Each key must start with the `source_prefix` value. Because the manifest is stored in the cluster state, it is limited to 1 MB. For larger sets of objects, use the `list` method.

Objects added to the object store after the index is created are not read. If an object is removed, truncated, or enlarged before it is fully read, the shard pauses.

### List

When `discovery` is `list`, each shard lists the objects in its own folder when it starts. This method requires setting `shard_split` to `shard_prefixes` and omitting the `manifest` parameter. Shard `N` reads the objects in `<source_prefix>/N/`. For example, if `source_prefix` is `listed/` and the index has two shards, shard 0 reads `listed/0/` and shard 1 reads `listed/1/`. Listing includes nested folders up to 64 levels deep.

A shard lists its folder each time it starts, including after a restart, a relocation, or a settings update. Place all objects in the folders before you create the index, and don't change them during ingestion. If objects change between listings, the shard processes them as follows:

* An object added after the previous listing is read only if its name sorts after the object that the shard was reading.
* An unread object that was removed is skipped.
* A resized object is read up to its new size.
* If the object that the shard was reading was removed and other objects remain in the folder, the shard pauses.
* If no objects remain in the folder, the shard reads nothing and reports a lag of `0`.

Objects that are not in any shard folder are not read.

## Dividing objects among shards

Each shard determines its own portion of the objects from the same settings, so each record is read by exactly one shard. The `shard_split` parameter supports the following values:

* `whole_files`: Each object is assigned to one shard based on a hash of its key. This method balances the number of objects per shard and does not account for object size.
* `shard_prefixes`: Objects in `<source_prefix>/N/` are assigned to shard `N`.
* `equal_bytes`: The single object specified in `source_url` is divided into one byte range per shard. Each range boundary is moved forward to the start of the next line so that no record is split between shards. The manifest must contain exactly this one object, and its size must be greater than 0.

## Exactly-once ingestion

Each document ID is built from the shard number, the object key, and the byte offset at which the record starts. If a record is read again after a crash or restart, it receives the same ID and overwrites the earlier copy, so each record produces exactly one document.

## Monitoring ingestion progress

The `consumer_stats.pointer_based_lag` metric reports the number of bytes that the shard has not yet read. Ingestion is complete when this metric is `0` on every shard. For more information, see [Pull-based ingestion metrics]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/#pull-based-ingestion-metrics).

## Errors

The following errors pause the shard:

* A configuration error. The reason is written to the logs.
* A read error, such as a missing object or a reached cost limit.
* An object size mismatch. The source verifies that each object has its declared size. If an object is shorter or longer than declared, or is declared empty but contains data, the shard pauses so that partial data is not indexed.

Lines that cannot be parsed are handled according to the `error_strategy` setting. For more information, see [Updating the error policy]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/#updating-the-error-policy).

## Limitations

The object store source has the following limitations:

* Compressed files, such as gzip files, are not supported.
* You cannot change the `manifest`, `source_url`, `source_prefix`, `shard_split`, or `discovery` parameters on an existing index. To change these parameters, create a new index.

## Related documentation

* [Pull-based Ingestion API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/)
* [Pull-based Ingestion Management API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion-management/)
