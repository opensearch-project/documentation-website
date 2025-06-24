---
layout: default
title: Register Snapshot Repository
parent: Snapshot APIs
nav_order: 1
canonical_url: https://docs.opensearch.org/docs/latest/api-reference/snapshots/create-repository/
---

# Registering or updating a snapshot repository
**Introduced 1.0**
{: .label .label-purple }

You can register a new repository in which to store snapshots or update information for an existing repository by using the snapshots API.

There are two types of snapshot repositories:

* File system (`fs`): For instructions on creating an `fs` repository, see [Register repository shared file system]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#shared-file-system).

* Amazon Simple Storage Service (Amazon S3) bucket (`s3`): For instructions on creating an `s3` repository, see [Register repository Amazon S3]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#amazon-s3).

For instructions on creating a repository, see [Register repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository).

## Endpoints

```json
POST /_snapshot/<repository>/ 
PUT /_snapshot/<repository>/
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`repository` | String | Repository name |

## Request parameters

Request parameters depend on the type of repository: `fs` or `s3`.

### Common parameters

The following table lists parameters that can be used with both the `fs` and `s3` repositories.

Request field | Description
:--- | :---
`prefix_mode_verification` | When enabled, adds a hashed value of a random seed to the prefix for repository verification. For remote-store-enabled clusters, you can add the `setting.prefix_mode_verification` setting to the node attributes for the supplied repository. This field works with both new and existing repositories. Optional.
`shard_path_type` | Controls the path structure of shard-level blobs. Supported values are `FIXED`, `HASHED_PREFIX`, and `HASHED_INFIX`. For more information about each value, see [shard_path_type values](#shard_path_type-values)/. Default is `FIXED`. Optional.

#### shard_path_type values

The following values are supported in the `shard_path_type` setting:

- `FIXED`: Keeps the path structure in the existing hierarchical manner, such as `<ROOT>/<BASE_PATH>/indices/<index-id>/0/<SHARD_BLOBS>`.
- `HASHED_PREFIX`: Prepends a hashed prefix at the start of the path for each unique shard ID, for example, `<ROOT>/<HASH-OF-INDEX-ID-AND-SHARD-ID>/<BASE_PATH>/indices/<index-id>/0/<SHARD_BLOBS>`.
- `HASHED_INFIX`: Appends a hashed prefix after the base path for each unique shard ID, for example, `<ROOT>/<BASE-PATH>/<HASH-OF-INDEX-ID-AND-SHARD-ID>/indices/<index-id>/0/<SHARD_BLOBS>`. The hash method used is `FNV_1A_COMPOSITE_1`, which uses the `FNV1a` hash function and generates a custom-encoded 64-bit hash value that scales well with most remote store options. `FNV1a` takes the most significant 6 bits to create a URL-safe Base64 character and the next 14 bits to create a binary string.

### fs repository

Request field | Description
:--- | :---
`location` | The file system directory for snapshots, such as a mounted directory from a file server or a Samba share. Must be accessible by all nodes. Required.
`chunk_size` | Breaks large files into chunks during snapshot operations (e.g. `64mb`, `1gb`), which is important for cloud storage providers and far less important for shared file systems. Default is `null` (unlimited). Optional.
`compress` | Whether to compress metadata files. This setting does not affect data files, which might already be compressed, depending on your index settings. Default is `false`. Optional.
`max_restore_bytes_per_sec` | The maximum rate at which snapshots restore. Default is 40 MB per second (`40m`). Optional.
`max_snapshot_bytes_per_sec` | The maximum rate at which snapshots take. Default is 40 MB per second (`40m`). Optional.
`remote_store_index_shallow_copy` | Boolean | Determines whether the snapshot of the remote store indexes are captured as a shallow copy. Default is `false`.
`shallow_snapshot_v2` | Boolean | Determines whether the snapshots of the remote store indexes are captured as a [shallow copy v2]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/snapshot-interoperability/#shallow-snapshot-v2). Default is `false`.
`readonly` | Whether the repository is read-only. Useful when migrating from one cluster (`"readonly": false` when registering) to another cluster (`"readonly": true` when registering). Optional.


#### s3 repository

Request field | Description
:--- | :---
`base_path` | The path within the bucket in which you want to store snapshots (for example, `my/snapshot/directory`). Optional. If not specified, snapshots are stored in the S3 bucket root.
`bucket` | Name of the S3 bucket. Required.
`buffer_size` | The threshold beyond which chunks (of `chunk_size`) should be broken into pieces (of `buffer_size`) and sent to S3 using a different API. Default is the smaller of two values: 100 MB or 5% of the Java heap. Valid values are between `5mb` and `5gb`. We don't recommend changing this option.
`canned_acl` | S3 has several [canned ACLs](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) that the `repository-s3` plugin can add to objects as it creates them in S3. Default is `private`. Optional.
`chunk_size` | Breaks files into chunks during snapshot operations (e.g. `64mb`, `1gb`), which is important for cloud storage providers and far less important for shared file systems. Default is `1gb`. Optional.
`client` | When specifying client settings (e.g. `s3.client.default.access_key`), you can use a string other than `default` (e.g. `s3.client.backup-role.access_key`). If you used an alternate name, change this value to match. Default and recommended value is `default`. Optional.
`compress` | Whether to compress metadata files. This setting does not affect data files, which might already be compressed, depending on your index settings. Default is `false`. Optional.
`disable_chunked_encoding` | Disables chunked encoding for compatibility with some storage services. Default is `false`. Optional.
`max_restore_bytes_per_sec` | The maximum rate at which snapshots restore. Default is 40 MB per second (`40m`). Optional.
`max_snapshot_bytes_per_sec` | The maximum rate at which snapshots take. Default is 40 MB per second (`40m`). Optional.
`readonly` | Whether the repository is read-only. Useful when migrating from one cluster (`"readonly": false` when registering) to another cluster (`"readonly": true` when registering). Optional.
`remote_store_index_shallow_copy` | Boolean | Whether the snapshot of the remote store indexes is captured as a shallow copy. Default is `false`.
`shallow_snapshot_v2` | Boolean | Determines whether the snapshots of the remote store indexes are captured as a [shallow copy v2]([shallow copy v2]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/snapshot-interoperability/#shallow-snapshot-v2). Default is `false`.
`server_side_encryption` | Whether to encrypt snapshot files in the S3 bucket. This setting uses AES-256 with S3-managed keys. See [Protecting data using server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/serv-side-encryption.html). Default is `false`. Optional.
`storage_class` | Specifies the [S3 storage class](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html) for the snapshots files. Default is `standard`. Do not use the `glacier` and `deep_archive` storage classes. Optional.

For the `base_path` parameter, do not enter the `s3://` prefix when entering your S3 bucket details. Only the name of the bucket is required.
{: .note}

## Example requests

### `fs`

The following example registers an `fs` repository using the local directory `/mnt/snapshots` as `location`:

```json
PUT /_snapshot/my-fs-repository
{
  "type": "fs",
  "settings": {
    "location": "/mnt/snapshots"
  }
}
```
{% include copy-curl.html %}

### `s3`


The following request registers a new S3 repository called `my-opensearch-repo` in an existing bucket called `my-open-search-bucket`. By default, all snapshots are stored in the `my/snapshot/directory`:

```json
PUT /_snapshot/my-opensearch-repo
{
  "type": "s3",
  "settings": {
    "bucket": "my-open-search-bucket",
    "base_path": "my/snapshot/directory"
  }
}
```
{% include copy-curl.html %}

## Example response

Upon success, the following JSON object is returned:

```json
{
  "acknowledged": true
}
```

To verify that the repository was registered, use the [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository) API, passing the repository name as the `repository` path parameter.
{: .note}
