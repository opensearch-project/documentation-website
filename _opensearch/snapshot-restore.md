---
layout: default
title: Take and restore snapshots
nav_order: 65
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/
---

# Take and restore snapshots

Snapshots are backups of a cluster's indices and state. State includes cluster settings, node information, index metadata (mappings, settings, templates, etc.), and shard allocation.

Snapshots have two main uses:

- **Recovering from failure**

  For example, if cluster health goes red, you might restore the red indices from a snapshot.

- **Migrating from one cluster to another**

  For example, if you're moving from a proof-of-concept to a production cluster, you might take a snapshot of the former and restore it on the latter.


---

#### Table of contents
1. TOC
{:toc}


---

## About snapshots

Snapshots aren't instantaneous. They take time to complete and do not represent perfect point-in-time views of the cluster. While a snapshot is in progress, you can still index documents and make other requests to the cluster, but new documents and updates to existing documents generally aren't included in the snapshot. The snapshot includes primary shards as they existed when OpenSearch initiated the snapshot. Depending on the size of your snapshot thread pool, different shards might be included in the snapshot at slightly different times.

OpenSearch snapshots are incremental, meaning that they only store data that has changed since the last successful snapshot. The difference in disk usage between frequent and infrequent snapshots is often minimal.

In other words, taking hourly snapshots for a week (for a total of 168 snapshots) might not use much more disk space than taking a single snapshot at the end of the week. Also, the more frequently you take snapshots, the less time they take to complete. Some OpenSearch users take snapshots as often as every half hour.

If you need to delete a snapshot, be sure to use the OpenSearch API rather than navigating to the storage location and purging files. Incremental snapshots from a cluster often share a lot of the same data; when you use the API, OpenSearch only removes data that no other snapshot is using.
{: .tip }


## Register repository

Before you can take a snapshot, you have to "register" a snapshot repository. A snapshot repository is just a storage location: a shared file system, Amazon S3, Hadoop Distributed File System (HDFS), Azure Storage, etc.


### Shared file system

1. To use a shared file system as a snapshot repository, add it to `opensearch.yml`:

   ```yml
   path.repo: ["/mnt/snapshots"]
   ```

   On the RPM and Debian installs, you can then mount the file system. If you're using the Docker install, add the file system to each node in `docker-compose.yml` before starting the cluster:

   ```yml
   volumes:
     - /Users/jdoe/snapshots:/mnt/snapshots
   ```

1. Then register the repository using the REST API:

   ```json
   PUT _snapshot/my-fs-repository
   {
     "type": "fs",
     "settings": {
       "location": "/mnt/snapshots"
     }
   }
   ```

   If the request is successful, the response from OpenSearch is minimal:

   ```json
   {
     "acknowledged": true
   }
   ```

You probably only need to specify `location`, but the following table summarizes the options:

Setting | Description
:--- | :---
`location` | The shared file system for snapshots. Required.
`chunk_size` | Breaks large files into chunks during snapshot operations (e.g. `64mb`, `1gb`), which is important for cloud storage providers and far less important for shared file systems. Default is `null` (unlimited). Optional.
`compress` | Whether to compress metadata files. This setting does not affect data files, which might already be compressed, depending on your index settings. Default is `false`. Optional.
`max_restore_bytes_per_sec` | The maximum rate at which snapshots restore. Default is 40 MB per second (`40m`). Optional.
`max_snapshot_bytes_per_sec` | The maximum rate at which snapshots take. Default is 40 MB per second (`40m`). Optional.
`readonly` | Whether the repository is read-only. Useful when migrating from one cluster (`"readonly": false` when registering) to another cluster (`"readonly": true` when registering). Optional.


### Amazon S3

1. To use an Amazon S3 bucket as a snapshot repository, install the `repository-s3` plugin on all nodes:

   ```bash
   sudo ./bin/opensearch-plugin install repository-s3
   ```

   If you're using the Docker installation, see [Customize the Docker image]({{site.url}}{{site.baseurl}}/opensearch/install/docker#customize-the-docker-image). Your `Dockerfile` should look something like this:

   ```
   FROM opensearchproject/opensearch:{{site.opensearch_version}}

   ENV AWS_ACCESS_KEY_ID <access-key>
   ENV AWS_SECRET_ACCESS_KEY <secret-key>

   # Optional
   ENV AWS_SESSION_TOKEN <optional-session-token>

   RUN /usr/share/opensearch/bin/opensearch-plugin install --batch repository-s3
   RUN /usr/share/opensearch/bin/opensearch-keystore create

   RUN echo $AWS_ACCESS_KEY_ID | /usr/share/opensearch/bin/opensearch-keystore add --stdin s3.client.default.access_key
   RUN echo $AWS_SECRET_ACCESS_KEY | /usr/share/opensearch/bin/opensearch-keystore add --stdin s3.client.default.secret_key

   # Optional
   RUN echo $AWS_SESSION_TOKEN | /usr/share/opensearch/bin/opensearch-keystore add --stdin s3.client.default.session_token
   ```

   After the Docker cluster starts, skip to step 7.

1. Add your AWS access and secret keys to the OpenSearch keystore:

   ```bash
   sudo ./bin/opensearch-keystore add s3.client.default.access_key
   sudo ./bin/opensearch-keystore add s3.client.default.secret_key
   ```

1. (Optional) If you're using temporary credentials, add your session token:

   ```bash
   sudo ./bin/opensearch-keystore add s3.client.default.session_token
   ```

1. (Optional) If you connect to the internet through a proxy, add those credentials:

   ```bash
   sudo ./bin/opensearch-keystore add s3.client.default.proxy.username
   sudo ./bin/opensearch-keystore add s3.client.default.proxy.password
   ```

1. (Optional) Add other settings to `opensearch.yml`:

   ```yml
   s3.client.default.disable_chunked_encoding: false # Disables chunked encoding for compatibility with some storage services, but you probably don't need to change this value.
   s3.client.default.endpoint: s3.amazonaws.com # S3 has alternate endpoints, but you probably don't need to change this value.
   s3.client.default.max_retries: 3 # number of retries if a request fails
   s3.client.default.path_style_access: false # whether to use the deprecated path-style bucket URLs.
   # You probably don't need to change this value, but for more information, see https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html#path-style-access.
   s3.client.default.protocol: https # http or https
   s3.client.default.proxy.host: my-proxy-host # the hostname for your proxy server
   s3.client.default.proxy.port: 8080 # port for your proxy server
   s3.client.default.read_timeout: 50s # the S3 connection timeout
   s3.client.default.use_throttle_retries: true # whether the client should wait a progressively longer amount of time (exponential backoff) between each successive retry
   ```

1. If you changed `opensearch.yml`, you must restart each node in the cluster. Otherwise, you only need to reload secure cluster settings:

   ```
   POST _nodes/reload_secure_settings
   ```

1. Create an S3 bucket if you don't already have one. To take snapshots, you need permissions to access the bucket. The following IAM policy is an example of those permissions:

   ```json
   {
	   "Version": "2012-10-17",
	   "Statement": [{
		   "Action": [
			   "s3:*"
		   ],
		   "Effect": "Allow",
		   "Resource": [
			   "arn:aws:s3:::your-bucket",
			   "arn:aws:s3:::your-bucket/*"
		   ]
	   }]
   }
   ```

1. Register the repository using the REST API:

   ```json
   PUT _snapshot/my-s3-repository
   {
     "type": "s3",
     "settings": {
       "bucket": "my-s3-bucket",
       "base_path": "my/snapshot/directory"
     }
   }
   ```

You probably don't need to specify anything but `bucket` and `base_path`, but the following table summarizes the options:

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


## Take snapshots

You specify two pieces of information when you create a snapshot:

- Name of your snapshot repository
- Name for the snapshot

The following snapshot includes all indices and the cluster state:

```json
PUT _snapshot/my-repository/1
```

You can also add a request body to include or exclude certain indices or specify other settings:

```json
PUT _snapshot/my-repository/2
{
  "indices": "opensearch-dashboards*,my-index*,-my-index-2016",
  "ignore_unavailable": true,
  "include_global_state": false,
  "partial": false
}
```

Setting | Description
:--- | :---
`indices` | The indices you want to include in the snapshot. You can use `,` to create a list of indices, `*` to specify an index pattern, and `-` to exclude certain indices. Don't put spaces between items. Default is all indices.
`ignore_unavailable` | If an index from the `indices` list doesn't exist, whether to ignore it rather than fail the snapshot. Default is false.
`include_global_state` | Whether to include cluster state in the snapshot. Default is true.
`partial` | Whether to allow partial snapshots. Default is false, which fails the entire snapshot if one or more shards fails to store.

If you request the snapshot immediately after taking it, you might see something like this:

```json
GET _snapshot/my-repository/2
{
  "snapshots": [{
    "snapshot": "2",
    "version": "6.5.4",
    "indices": [
      "opensearch_dashboards_sample_data_ecommerce",
      "my-index",
      "opensearch_dashboards_sample_data_logs",
      "opensearch_dashboards_sample_data_flights"
    ],
    "include_global_state": true,
    "state": "IN_PROGRESS",
    ...
  }]
}
```

Note that the snapshot is still in progress. If you want to wait for the snapshot to finish before continuing, add the `wait_for_completion` parameter to your request. Snapshots can take a while to complete, so consider whether or not this option fits your use case:

```
PUT _snapshot/my-repository/3?wait_for_completion=true
```

Snapshots have the following states:

State | Description
:--- | :---
SUCCESS | The snapshot successfully stored all shards.
IN_PROGRESS | The snapshot is currently running.
PARTIAL | At least one shard failed to store successfully. Can only occur if you set `partial` to `true` when taking the snapshot.
FAILED | The snapshot encountered an error and stored no data.
INCOMPATIBLE | The snapshot is incompatible with the version of OpenSearch running on this cluster. See [Conflicts and compatibility](#conflicts-and-compatibility).

You can't take a snapshot if one is currently in progress. To check the status:

```
GET _snapshot/_status
```


## Restore snapshots

The first step in restoring a snapshot is retrieving existing snapshots. To see all snapshot repositories:

```
GET _snapshot/_all
```

To see all snapshots in a repository:

```
GET _snapshot/my-repository/_all
```

Then restore a snapshot:

```
POST _snapshot/my-repository/2/_restore
```

Just like when taking a snapshot, you can add a request body to include or exclude certain indices or specify some other settings:

```json
POST _snapshot/my-repository/2/_restore
{
  "indices": "opensearch-dashboards*,my-index*",
  "ignore_unavailable": true,
  "include_global_state": false,
  "include_aliases": false,
  "partial": false,
  "rename_pattern": "opensearch-dashboards(.+)",
  "rename_replacement": "restored-opensearch-dashboards$1",
  "index_settings": {
    "index.blocks.read_only": false
  },
  "ignore_index_settings": [
    "index.refresh_interval"
  ]
}
```

Setting | Description
:--- | :---
`indices` | The indices you want to restore. You can use `,` to create a list of indices, `*` to specify an index pattern, and `-` to exclude certain indices. Don't put spaces between items. Default is all indices.
`ignore_unavailable` | If an index from the `indices` list doesn't exist, whether to ignore it rather than fail the restore operation. Default is false.
`include_global_state` | Whether to restore the cluster state. Default is false.
`include_aliases` | Whether to restore aliases alongside their associated indices. Default is true.
`partial` | Whether to allow the restoration of partial snapshots. Default is false.
`rename_pattern` | If you want to rename indices as you restore them, use this option to specify a regular expression that matches all indices you want to restore. Use capture groups (`()`) to reuse portions of the index name.
`rename_replacement` | If you want to rename indices as you restore them, use this option to specify the replacement pattern. Use `$0` to include the entire matching index name, `$1` to include the content of the first capture group, etc.
`index_settings` | If you want to change index settings on restore, specify them here.
`ignore_index_settings` | Rather than explicitly specifying new settings with `index_settings`, you can ignore certain index settings in the snapshot and use the cluster defaults on restore.


### Conflicts and compatibility

One way to avoid naming conflicts when restoring indices is to use the `rename_pattern` and `rename_replacement` options. Then, if necessary, you can use the `_reindex` API to combine the two. The simpler way is to delete existing indices prior to restoring from a snapshot.

You can use the `_close` API to close existing indices prior to restoring from a snapshot, but the index in the snapshot has to have the same number of shards as the existing index.

We recommend ceasing write requests to a cluster before restoring from a snapshot, which helps avoid scenarios such as:

1. You delete an index, which also deletes its alias.
1. A write request to the now-deleted alias creates a new index with the same name as the alias.
1. The alias from the snapshot fails to restore due to a naming conflict with the new index.

Snapshots are only forward-compatible by one major version. If you have an old snapshot, you can sometimes restore it into an intermediate cluster, reindex all indices, take a new snapshot, and repeat until you arrive at your desired version, but you might find it easier to just manually index your data on the new cluster.

## Security plugin considerations

If you're using the security plugin, snapshots have some additional restrictions:

- To perform snapshot and restore operations, users must have the built-in `manage_snapshots` role.
- You can't restore snapshots that contain global state or the `.opendistro_security` index.

If a snapshot contains global state, you must exclude it when performing the restore. If your snapshot also contains the `.opendistro_security` index, either exclude it or list all the other indices you want to include:

```json
POST _snapshot/my-repository/3/_restore
{
  "indices": "-.opendistro_security",
  "include_global_state": false
}
```

The `.opendistro_security` index contains sensitive data, so we recommend excluding it when you take a snapshot. If you do need to restore the index from a snapshot, you must include an admin certificate in the request:

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XPOST 'https://localhost:9200/_snapshot/my-repository/3/_restore?pretty'
```
