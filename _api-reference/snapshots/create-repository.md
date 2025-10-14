---
layout: default
title: Register snapshot repository
parent: Snapshot APIs
nav_order: 1
---

# Registering Or Updating A Snapshot Repository API
**Introduced 1.0**
{: .label .label-purple }

You can register a new repository in which to store snapshots or update information for an existing repository by using the snapshots API.

There are three types of snapshot repositories:

* File system (`fs`): For instructions on creating an `fs` repository, see [Register repository shared file system]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#shared-file-system).

* Amazon Simple Storage Service (Amazon S3) bucket (`s3`): For instructions on creating an `s3` repository, see [Register repository Amazon S3]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#amazon-s3).

* Hadoop Distributed File System (HDFS) (`hdfs`): For instructions on creating an `hdfs` repository, see [Register repository HDFS]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#hdfs).

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

Request parameters depend on the type of repository:
  - `fs`
  - `s3`
  - `hdfs`

### Common parameters

The following table lists parameters that can be used with both the `fs` and `s3` repositories.

Request field | Description
:--- | :---
`prefix_mode_verification` | When enabled, adds a hashed value of a random seed to the prefix for repository verification. For remote-store-enabled clusters, you can add the `setting.prefix_mode_verification` setting to the node attributes for the supplied repository. This field works with both new and existing repositories. Optional.
`shard_path_type` | Controls the path structure of shard-level blobs. Supported values are `FIXED`, `HASHED_PREFIX`, and `HASHED_INFIX`. For more information about each value, see [shard_path_type values](#shard_path_type-values)/. Default is `HASHED_PREFIX`. Optional.

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
`remote_store_index_shallow_copy` | Determines whether the snapshot of the remote store indexes are captured as a shallow copy. Default is `false`.
`shallow_snapshot_v2` | Determines whether the snapshots of the remote store indexes are captured as a [shallow copy v2]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/snapshot-interoperability/#shallow-snapshot-v2). Default is `false`.
`readonly` | Whether the repository is read-only. Useful when migrating from one cluster (`"readonly": false` when registering) to another cluster (`"readonly": true` when registering). Optional.


### s3 repository

| Request field                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|:--------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `base_path`                                 | The path within the bucket in which you want to store snapshots (for example, `my/snapshot/directory`). Optional. If not specified, snapshots are stored in the S3 bucket root.                                                                                                                                                                                                                                                                    |
| `bucket`                                    | Name of the S3 bucket. Required.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `buffer_size`                               | The threshold beyond which chunks (of `chunk_size`) should be broken into pieces (of `buffer_size`) and sent to S3 using a different API. Default is the smaller of two values: 100 MB or 5% of the Java heap. Valid values are between `5mb` and `5gb`. We don't recommend changing this option.                                                                                                                                                  |
| `canned_acl`                                | S3 has several [canned ACLs](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) that the `repository-s3` plugin can add to objects as it creates them in S3. Default is `private`. Optional.                                                                                                                                                                                                                            |
| `chunk_size`                                | Breaks files into chunks during snapshot operations (for example, `64mb`, `1gb`), which is important for cloud storage providers and far less important for shared file systems. Default is `1gb`. Optional.                                                                                                                                                                                                                                               |
| `client`                                    | When specifying client settings (for example, `s3.client.default.access_key`), you can use a string other than `default` (for example, `s3.client.backup-role.access_key`). If you used an alternate name, change this value to match. Default and recommended value is `default`. Optional.                                                                                                                                                                       |
| `compress`                                  | Whether to compress metadata files. This setting does not affect data files, which might already be compressed, depending on your index settings. Default is `false`. Optional.                                                                                                                                                                                                                                                                    |
| `disable_chunked_encoding`                  | Disables chunked encoding for compatibility with some storage services. Default is `false`. Optional.                                                                                                                                                                                                                                                                                                                                              |
| `max_restore_bytes_per_sec`                 | The maximum rate at which snapshots restore. Default is 40 MB per second (`40m`). Optional.                                                                                                                                                                                                                                                                                                                                                        |
| `max_snapshot_bytes_per_sec`                | The maximum rate at which snapshots are taken. Default is 40 MB per second (`40m`). Optional.                                                                                                                                                                                                                                                                                                                                                           |
| `readonly`                                  | Whether the repository is read-only. Useful when migrating from one cluster (`"readonly": false` when registering) to another cluster (`"readonly": true` when registering). Optional.                                                                                                                                                                                                                                                             |
| `remote_store_index_shallow_copy`            | Determines whether the snapshot of the remote store indexes is captured as a shallow copy. Default is `false`.
| `shallow_snapshot_v2`                       | Determines whether the snapshots of the remote store indexes are captured as a [shallow copy v2]([shallow copy v2]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/snapshot-interoperability/#shallow-snapshot-v2). Default is `false`.
| `storage_class`                             | Specifies the [S3 storage class](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html) for the snapshot files. Default is `standard`. Do not use the `glacier` and `deep_archive` storage classes. Optional.                                                                                                                                                                                                                  |
| `server_side_encryption_type`               | Specifies the S3 server-side encryption types. Supported values are `AES256` ([SSE-S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html), `aws:kms` ([SSE-KMS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html)), and `bucket_default` ([bucket default encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html). Default is `bucket_default`. |
| `server_side_encryption_kms_key_id`         | Specifies the AWS Key Management Service (AWS KMS) key to be used if [S3 SSE-KMS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html) is selected by setting the `aws:kms` encryption type. Required if `aws:kms` is set as the `server_side_encryption_type`.                                                                                                                                                                                               |
| `server_side_encryption_bucket_key_enabled` | Specifies whether [S3 Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html) should be used when using [S3 SSE-KMS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html). Optional.                                                                                                                                                                                                              |
| `server_side_encryption_encryption_context` | Specifies any additional [encryption context](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html#encryption-context) that should be used when using [S3 SSE-KMS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html). This setting value must be formatted as a JSON object. Optional.                                                                                                            |
| `expected_bucket_owner`                     | Specifies the AWS account ID of the expected S3 bucket owner. This setting can be used for [verifying bucket ownership](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html). Optional.                                                                                                                                                                                                                              |

For the `base_path` parameter, do not enter the `s3://` prefix when entering your S3 bucket details. Only the name of the bucket is required.
{: .note}

The `server_side_encryption` setting is removed as of OpenSearch 3.1.0. S3 applies server-side encryption as the base level of encryption for all S3 buckets. Because this cannot be disabled, this value repository setting had no effect. For more information, see [Protecting data with server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html).
{: .note}

### hdfs repository

 Request field                     | Description                                                                                                                                                                 
:----------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| `uri`                             | The HDFS URI of the form `hdfs://<HOST>:<PORT>/path/to/backup`. Required.                                                                                                   |
| `path`                            | The path within HDFS in which you want to store snapshots (for example, `/my/snapshot/directory`). Required.                                                                |
| `security.principal`              | The Kerberos principal to use when connecting to HDFS. Optional.                                                                                                            |
| `conf.<key>`                  | Additional HDFS client configuration (i.e. core-site.xml, hdfs-site.xml) settings. Optional. |



## Example requests

### `fs`

The following example registers an `fs` repository using the local directory `/mnt/snapshots` as `location`:

<!-- spec_insert_start
component: example_code
rest: PUT /_snapshot/my-fs-repository
body: |
{
  "type": "fs",
  "settings": {
    "location": "/mnt/snapshots"
  }
}
-->
{% capture step1_rest %}
PUT /_snapshot/my-fs-repository
{
  "type": "fs",
  "settings": {
    "location": "/mnt/snapshots"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.create_repository(
  repository = "my-fs-repository",
  body =   {
    "type": "fs",
    "settings": {
      "location": "/mnt/snapshots"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### `s3`


The following request registers a new S3 repository called `my-opensearch-repo` in an existing bucket called `my-open-search-bucket`. By default, all snapshots are stored in the `my/snapshot/directory`:

<!-- spec_insert_start
component: example_code
rest: PUT /_snapshot/my-opensearch-repo
body: |
{
  "type": "s3",
  "settings": {
    "bucket": "my-open-search-bucket",
    "base_path": "my/snapshot/directory"
  }
}
-->
{% capture step1_rest %}
PUT /_snapshot/my-opensearch-repo
{
  "type": "s3",
  "settings": {
    "bucket": "my-open-search-bucket",
    "base_path": "my/snapshot/directory"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.create_repository(
  repository = "my-opensearch-repo",
  body =   {
    "type": "s3",
    "settings": {
      "bucket": "my-open-search-bucket",
      "base_path": "my/snapshot/directory"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


The following request registers a new S3 repository called `my-opensearch-repo` in an existing bucket called `my-open-search-bucket`. By default, all snapshots are stored in the `my/snapshot/directory`. Additionally, this repository is configured to use [SSE-KMS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html#encryption-context), and the expected bucket owner AWS account ID is `123456789000`.

<!-- spec_insert_start
component: example_code
rest: PUT /_snapshot/my-opensearch-repo
body: |
{
  "type": "s3",
  "settings": {
    "bucket": "my-open-search-bucket",
    "base_path": "my/snapshot/directory",
    "server_side_encryption_type": "aws:kms",
    "server_side_encryption_kms_key_id": "arn:aws:kms:us-east-1:123456789000:key/kms-key-id",
    "server_side_encryption_encryption_context": "{\"additional-enc-ctx\": \"sample-context\"}",
    "expected_bucket_owner": "123456789000",
  }
}
-->
{% capture step1_rest %}
PUT /_snapshot/my-opensearch-repo
{
  "type": "s3",
  "settings": {
    "bucket": "my-open-search-bucket",
    "base_path": "my/snapshot/directory",
    "server_side_encryption_type": "aws:kms",
    "server_side_encryption_kms_key_id": "arn:aws:kms:us-east-1:123456789000:key/kms-key-id",
    "server_side_encryption_encryption_context": "{\"additional-enc-ctx\": \"sample-context\"}",
    "expected_bucket_owner": "123456789000",
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.create_repository(
  repository = "my-opensearch-repo",
  body = '''
{
  "type": "s3",
  "settings": {
    "bucket": "my-open-search-bucket",
    "base_path": "my/snapshot/directory",
    "server_side_encryption_type": "aws:kms",
    "server_side_encryption_kms_key_id": "arn:aws:kms:us-east-1:123456789000:key/kms-key-id",
    "server_side_encryption_encryption_context": "{\"additional-enc-ctx\": \"sample-context\"}",
    "expected_bucket_owner": "123456789000",
  }
}
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### `hdfs`

The following request registers a new HDFS repository using the HDFS URI `hdfs://namenode:8020` and the HDFS filesystem path `/opensearch/snapshots`:
<!-- spec_insert_start
component: example_code
rest: PUT /_snapshot/my-hdfs-repository
body: |
{
  "type": "hdfs",
  "settings": {
    "uri": "hdfs://namenode:8020",
    "path": "/opensearch/snapshots"
  }
}
-->
{% capture step1_rest %}
PUT /_snapshot/my-hdfs-repository
{
"type": "hdfs",
"settings": {
"uri": "hdfs://namenode:8020",
"path": "/opensearch/snapshots"
}
}
{% endcapture %}

{% capture step1_python %}  
response = client.snapshot.create_repository(
repository = "my-hdfs-repository",
body =   {
"type": "hdfs",
"settings": {
"uri": "hdfs://namenode:8020",
"path": "/opensearch/snapshots"
}
}
)

{% endcapture %}

{% include code-block.html
rest=step1_rest
python=step1_python %}


## Example response

Upon success, the following JSON object is returned:

```json
{
  "acknowledged": true
}
```

To verify that the repository was registered, use the [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository) API, passing the repository name as the `repository` path parameter.
{: .note}
