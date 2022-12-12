---
layout: default
title: Register Snapshot Repository
parent: Snapshot APIs
nav_order: 1
---

## Register or update snapshot repository

Registers a new repository to store snapshots, or updates information for an existing repository. Repositories can be of two types:

* File system (`fs`)

* Amazon S3 bucket (`s3`)

To learn more about repositories, see [Register repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository).

### Path parameters

Parameter | Data type | Description
:--- | :--- | :---
repository | String | Repostory name. |

### Request fields

Allowable parameters depend on the repository type.

#### fs repository type

Setting | Description
:--- | :---
`location` | The shared file system for snapshots. Required.
`chunk_size` | Breaks large files into chunks during snapshot operations (e.g. `64mb`, `1gb`), which is important for cloud storage providers and far less important for shared file systems. Default is `null` (unlimited). Optional.
`compress` | Whether to compress metadata files. This setting does not affect data files, which might already be compressed, depending on your index settings. Default is `false`. Optional.
`max_restore_bytes_per_sec` | The maximum rate at which snapshots restore. Default is 40 MB per second (`40m`). Optional.
`max_snapshot_bytes_per_sec` | The maximum rate at which snapshots take. Default is 40 MB per second (`40m`). Optional.
`readonly` | Whether the repository is read-only. Useful when migrating from one cluster (`"readonly": false` when registering) to another cluster (`"readonly": true` when registering). Optional.

#### s3 repository type

Setting | Description
:--- | :---
`base_path` | The path within the bucket where you want to store snapshots (e.g. `my/snapshot/directory`). Optional. If not specified, snapshots are stored in the bucket root.
`bucket` | Name of the S3 bucket. Required.
`buffer_size` | The threshold beyond which chunks (of `chunk_size`) should be broken into pieces (of `buffer_size`) and sent to S3 using a different API. Default is the smaller of two values: 100 MB or 5% of the Java heap. Valid values are between `5mb` and `5gb`. We don't recommend changing this option.
`canned_acl` | S3 has several [canned ACLs](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) that the `repository-s3` plugin can add to objects as it creates them in S3. Default is `private`. Optional.
`chunk_size` | Breaks files into chunks during snapshot operations (e.g. `64mb`, `1gb`), which is important for cloud storage providers and far less important for shared file systems. Default is `1gb`. Optional.
`client` | When specifying client settings (e.g. `s3.client.default.access_key`), you can use a string other than `default` (e.g. `s3.client.backup-role.access_key`). If you used an alternate name, change this value to match. Default and recommended value is `default`. Optional.
`compress` | Whether to compress metadata files. This setting does not affect data files, which might already be compressed, depending on your index settings. Default is `false`. Optional.
`max_restore_bytes_per_sec` | The maximum rate at which snapshots restore. Default is 40 MB per second (`40m`). Optional.
`max_snapshot_bytes_per_sec` | The maximum rate at which snapshots take. Default is 40 MB per second (`40m`). Optional.
`readonly` | Whether the repository is read-only. Useful when migrating from one cluster (`"readonly": false` when registering) to another cluster (`"readonly": true` when registering). Optional.
`server_side_encryption` | Whether to encrypt snapshot files in the S3 bucket. This setting uses AES-256 with S3-managed keys. See [Protecting data using server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/serv-side-encryption.html). Default is false. Optional.
`storage_class` | Specifies the [S3 storage class](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html) for the snapshots files. Default is `standard`. Do not use the `glacier` and `deep_archive` storage classes. Optional.

#### Sample request

The following requests register or update a repository called `my-first-repo`. Both require a request body as described in [Request fields](#request-fields).

* `POST _snapshot/my-first-repo/` registers a snapshot repository.

* `PUT _snapshot/my-first-repo/` registers a snapshot repository if it does not exist; otherwise, updates information about the repository. 

The following request registers a new S3 repository called `my-opensearch-repo` in an existing bucket called `my-open-search-bucket`. By default, all snapshots are stored in the `my/snapshot/directory`.

```json
PUT _snapshot/my-opensearch-repo
{
  "type": "s3",
  "settings": {
    "bucket": "my-open-search-bucket",
    "base_path": "my/snapshot/directory"
  }
}
```

#### Sample response

Upon success, the following JSON object is returned:

```json
{
  "acknowledged": true
}
```

To verify that the repository was registered, use the [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository) API, passing the repository name as the `repository` path parameter.
{: .note}