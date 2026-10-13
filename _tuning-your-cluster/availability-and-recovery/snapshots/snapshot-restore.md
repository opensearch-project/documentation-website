---
layout: default
title: Take and restore snapshots
parent: Snapshots
nav_order: 10
has_toc: false
has_children: false
grand_parent: Availability and recovery
redirect_from: 
  - /opensearch/snapshots/snapshot-restore/
  - /upgrade-to/snapshot-migrate/
  - /opensearch/snapshot-restore/
  - /availability-and-recovery/snapshots/snapshot-restore/
---

# Take and restore snapshots

Snapshots aren't instantaneous. They take time to complete and do not represent perfect point-in-time views of the cluster. While a snapshot is in progress, you can still index documents and send other requests to the cluster, but new documents and updates to existing documents generally aren't included in the snapshot. The snapshot includes primary shards as they existed when OpenSearch initiated the snapshot. Depending on the size of your snapshot thread pool, different shards might be included in the snapshot at slightly different times.

Before snapshotting a shard, OpenSearch [flushes]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/) it and then copies the files of the resulting Lucene commit. A shard's snapshot therefore contains all operations indexed to that shard before the flush, including documents that have not yet been refreshed and are not yet searchable.

OpenSearch snapshots are incremental, meaning that they only store data that has changed since the last successful snapshot. The difference in disk usage between frequent and infrequent snapshots is often minimal.

In other words, taking hourly snapshots for a week (for a total of 168 snapshots) might not use much more disk space than taking a single snapshot at the end of the week. Also, the more frequently you take snapshots, the less time they take to complete. Some OpenSearch users take snapshots as often as every 30 minutes.

If you need to delete a snapshot, be sure to use the OpenSearch API rather than navigating to the storage location and purging files. Incremental snapshots from a cluster often share a lot of the same data; when you use the API, OpenSearch only removes data that no other snapshot is using.
{: .tip }

Don't back up a cluster by copying the data directories of its nodes. A copy of the data directories is not a consistent backup, and restoring from such a copy can fail or silently lose data. Snapshots are the only reliable way to back up a cluster.
{: .warning }

To take snapshots on a schedule and delete old snapshots automatically, use [Snapshot Management]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-management/).

---

<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Register repository

Before you can take a snapshot, you have to "register" a snapshot repository. A snapshot repository is just a storage location: a shared file system, Amazon Simple Storage Service (Amazon S3), Hadoop Distributed File System (HDFS), or Azure Storage.

### Node-level repository settings

The following node-level settings control repository behavior globally across all repositories of their respective types. These settings are configured in `opensearch.yml` and require a cluster restart to modify.

#### File system repository settings

- `repositories.fs.chunk_size` (Static, byte unit): Sets the default chunk size for file system repositories when storing large blobs. This setting determines how large blob files are split into smaller chunks during storage. Larger chunk sizes can improve performance for sequential access but may increase memory usage and network transfer overhead. This setting serves as a fallback when chunk size is not explicitly specified in repository settings. Default is unlimited (no chunking). Minimum is `5` bytes.

#### URL repository settings

- `repositories.url.allowed_urls` (Static, list): Specifies a list of URL patterns that are allowed for URL repository access. This security setting restricts which URLs can be used when creating URL repositories, preventing access to unauthorized or internal network resources. URL patterns support wildcards (e.g., `http://snapshot.example.com/*`). When empty (default), no URL repositories are permitted unless a path.repo is configured. This setting helps prevent server-side request forgery (SSRF) attacks. Default is `[]` (empty list).

- `repositories.url.supported_protocols` (Static, list): Defines which URL protocols are supported for URL repositories. This setting controls which protocol schemes (such as HTTP, HTTPS, or FTP) can be used when accessing URL repositories. Limiting supported protocols helps enhance security by preventing access through potentially insecure or unintended protocols. Default is `["http", "https", "ftp", "file", "jar"]`.

### Shared file system

1. To use a shared file system as a snapshot repository, add it to `opensearch.yml`:

   ```yml
   path.repo: ["/mnt/snapshots"]
   ```

   The file system must be mounted at the same path on all cluster manager and data nodes. On the RPM and Debian installs, you can then mount the file system. If you're using the Docker install, add the file system to each node in `docker-compose.yml` before starting the cluster:

   ```yml
   volumes:
     - /Users/jdoe/snapshots:/mnt/snapshots
   ```

1. Then register the repository using the REST API:

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

If `location` is a relative path, OpenSearch resolves it against the first `path.repo` directory. For example, with `path.repo: ["/mnt/snapshots"]`, the location `my-backups` resolves to `/mnt/snapshots/my-backups`.

You will most likely not need to specify any parameters except for `location`. For allowed request parameters, see [Create or Update Snapshot Repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository/).

### URL repository

A URL repository provides read-only access to snapshots stored at a URL, for example, a shared file system repository that another cluster writes to. The following request registers a URL repository for a shared file system location. A `file:` URL must point to a location listed in `path.repo`:

```json
PUT /_snapshot/my-url-repository
{
  "type": "url",
  "settings": {
    "url": "file:/mnt/snapshots"
  }
}
```
{% include copy-curl.html %}

You can list and restore snapshots from a URL repository, but you can't create snapshots in it.

### Amazon S3

1. To use an Amazon S3 bucket as a snapshot repository, install the `repository-s3` plugin on all nodes:

   ```bash
   sudo ./bin/opensearch-plugin install repository-s3
   ```

   If you're using the Docker installation, see [Working with plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#working-with-plugins). Your `Dockerfile` should look similar to the following:

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

   If you're using [AWS IAM instance profile](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html) to allow OpenSearch nodes on AWS EC2 instances to inherit roles for policies when granting access to AWS S3 buckets, skip to step 8.

1. Add your AWS access and secret keys to the OpenSearch keystore:

   ```bash
   sudo ./bin/opensearch-keystore add s3.client.default.access_key
   sudo ./bin/opensearch-keystore add s3.client.default.secret_key
   ```

1. (Optional) If you're using a custom S3 endpoint (for example, MinIO), disable the Amazon EC2 metadata connection:

   ```bash
   export AWS_EC2_METADATA_DISABLED=true
   ```

   If you're installing OpenSearch using Helm, update the following settings in your values file:

   ```yml
   extraEnvs:
     - name: AWS_EC2_METADATA_DISABLED
       value: "true"
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
   s3.client.default.endpoint: s3.amazonaws.com # S3 has alternate endpoints, but you probably don't need to change this value.
   s3.client.default.max_retries: 3 # number of retries if a request fails
   s3.client.default.path_style_access: false # whether to use the deprecated path-style bucket URLs.
   # You probably don't need to change this value, but for more information, see https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html#path-style-access.
   s3.client.default.protocol: https # http or https
   s3.client.default.proxy.host: my-proxy-host # the hostname for your proxy server
   s3.client.default.proxy.port: 8080 # port for your proxy server
   s3.client.default.read_timeout: 50s # the S3 connection timeout
   s3.client.default.use_throttle_retries: true # whether the client should wait a progressively longer amount of time (exponential backoff) between each successive retry
   s3.client.default.region: us-east-2 # AWS region to use. For non-AWS S3 storage, this value is required but has no effect.
   ```

1. (Optional) If you don't want to use AWS access and secret keys, you could configure the S3 plugin to use AWS Identity and Access Management (IAM) roles for service accounts:

   ```bash
   sudo ./bin/opensearch-keystore add s3.client.default.role_arn
   sudo ./bin/opensearch-keystore add s3.client.default.role_session_name
   ```

   If you don't want to configure AWS access and secret keys, modify the following `opensearch.yml` setting. Make sure the file is accessible by the `repository-s3` plugin:
   
   ```yml
   s3.client.default.identity_token_file: /usr/share/opensearch/plugins/repository-s3/token
   ```

   If copying is not an option, you can create a symlink to the web identity token file in the `${OPENSEARCH_PATH_CONFIG}` folder:

   ```
   ln -s $AWS_WEB_IDENTITY_TOKEN_FILE "${OPENSEARCH_PATH_CONFIG}/aws-web-identity-token-file"
   ```

   You can reference the web identity token file in the following `opensearch.yml` setting by specifying the relative path that is resolved against `${OPENSEARCH_PATH_CONFIG}`:

   ```yaml
   s3.client.default.identity_token_file: aws-web-identity-token-file
   ```

   IAM roles require at least one of the preceding settings. Other settings will be taken from environment variables (if available): `AWS_ROLE_ARN`, `AWS_WEB_IDENTITY_TOKEN_FILE`, `AWS_ROLE_SESSION_NAME`.

1. If you changed `opensearch.yml`, you must restart each node in the cluster. Otherwise, you only need to reload secure cluster settings:

   ```
   POST /_nodes/reload_secure_settings
   ```
  {% include copy-curl.html %}

1. Create an S3 bucket if you don't already have one. To take snapshots, you need permissions to access the bucket. The following IAM policy is an example of those permissions:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Action": [
           "s3:GetBucketLocation",
           "s3:ListBucket",
           "s3:ListBucketMultipartUploads",
           "s3:ListBucketVersions"
         ],
         "Effect": "Allow",
         "Resource": [
           "arn:aws:s3:::your-bucket"
         ]
       },
       {
         "Action": [
           "s3:AbortMultipartUpload",
           "s3:DeleteObject",
           "s3:GetObject",
           "s3:ListMultipartUploadParts",
           "s3:PutObject"
         ],
         "Effect": "Allow",
         "Resource": [
           "arn:aws:s3:::your-bucket/*"
         ]
       }
     ]
   }
   ```

1. Register the repository using the REST API:

   ```json
   PUT /_snapshot/my-s3-repository
   {
     "type": "s3",
     "settings": {
       "bucket": "my-s3-bucket",
       "base_path": "my/snapshot/directory"
     }
   }
   ```
   {% include copy-curl.html %}

You will most likely not need to specify any parameters except for `bucket` and `base_path`. For allowed request parameters, see [Create or Update Snapshot Repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository/).

### HDFS

To use Hadoop Distributed File System (HDFS) as a snapshot repository, follow these steps:

1. Create an HDFS directory for snapshots (for example, `/opensearch/repositories/searchable_snapshots`) and ensure that the OpenSearch user has read and write permissions to it.

1. Install the `repository-hdfs` plugin on all nodes:

   ```bash
   sudo ./bin/opensearch-plugin install repository-hdfs
   ```

   If you're using the Docker installation, see [Working with plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#working-with-plugins). Your `Dockerfile` should look similar to the following:

   ```
   FROM opensearchproject/opensearch:{{site.opensearch_version}}

   RUN /usr/share/opensearch/bin/opensearch-plugin install --batch repository-hdfs
   ```

1. (Optional) If your HDFS cluster uses Kerberos, you may need to distribute the keytab file to all nodes and ensure that the OpenSearch user has read access.

1. Restart all nodes in the OpenSearch cluster.

1. Register the repository using the OpenSearch Snapshot API:

    Without HDFS authentication:

    ```json
    PUT _snapshot/searchable_snapshots
    {
      "type": "hdfs",
      "settings": {
        "uri": "hdfs://namenode:8020/",
        "path": "/opensearch/repositories/searchable_snapshots",
        "conf.<key>": "<value>"
      }
    }
    ```
    {% include copy-curl.html %}

    With HDFS authentication:

    ```json
    PUT _snapshot/searchable_snapshots
    {
      "type": "hdfs",
      "settings": {
        "uri": "hdfs://namenode:8020/",
        "path": "/opensearch/repositories/searchable_snapshots",
        "security.principal": "opensearch@YOURREALM",
        "conf.<key>": "<value>"
      }
    }
    ```
    {% include copy-curl.html %}

### Registering a Microsoft Azure storage account using Helm

Use the following steps to register a snapshot repository backed by an Azure storage account for an OpenSearch cluster deployed using Helm.

1. Create an Azure storage account. Then create a container within the storage account. For more information, see [Introduction to Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction).

1. Create an OpenSearch keystore file using a bash script. To create the bash script, copy the contents of the following example into a file named `create-keystore.sh`:

   ```bash
   #!/bin/bash

   /usr/share/opensearch/bin/opensearch-keystore create
   echo $AZURE_SNAPSHOT_STORAGE_ACCOUNT | /usr/share/opensearch/bin/opensearch-keystore add --stdin azure.client.default.account
   echo $AZURE_SNAPSHOT_STORAGE_ACCOUNT_KEY | /usr/share/opensearch/bin/opensearch-keystore add --stdin azure.client.default.key
   cp /usr/share/opensearch/config/opensearch.keystore /tmp/keystore/opensearch.keystore
   ```

1. Create a Docker file. This file contains the details of your keystore, the OpenSearch instance, and the Azure repository. To create the file, copy the following example and save it as a `Dockerfile`: 

   ```docker
   FROM opensearchproject/opensearch:{{site.opensearch_version}}

   RUN /usr/share/opensearch/bin/opensearch-plugin install --batch repository-azure
   COPY --chmod=0775 create-keystore.sh create-keystore.sh
   ```

1. Use the following `docker build` command to build an OpenSearch image from your Dockerfile:

   ```
   docker build -t opensearch-custom:{{site.opensearch_version}} -f Dockerfile .
   ```

1. Create a Kubernetes secret containing the Azure storage account key by using the following manifest and command:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: opensearch
   data:
     azure-snapshot-storage-account-key: ### Insert base64 encoded key
   ```

1. [Deploy OpenSearch using Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/) with the following additional values. Specify the value of the storage account in the `AZURE_SNAPSHOT_STORAGE_ACCOUNT` environment variable:

   ```yaml
   extraInitContainers:
   - name: keystore-generator
     image: opensearch-custom:{{site.opensearch_version}}
     command: ["/bin/bash", "-c"]
     args: ["bash create-keystore.sh"]
     env:
     - name: AZURE_SNAPSHOT_STORAGE_ACCOUNT
       value: ### Insert storage account name
     - name: AZURE_SNAPSHOT_STORAGE_ACCOUNT_KEY
       valueFrom:
         secretKeyRef:
           name: opensearch
           key: azure-snapshot-storage-account-key
     volumeMounts:
     - name: keystore
       mountPath: /tmp/keystore

   extraVolumeMounts:
   - name: keystore
     mountPath: /usr/share/opensearch/config/opensearch.keystore
     subPath: opensearch.keystore
  
   extraVolumes:
   - name: keystore
     emptyDir: {}

   image:
     repository: "opensearch-custom"
     tag: {{site.opensearch_version}}
   ```

1. Register the repository using the Snapshot API. Replace `snapshot_container` with the name you specified in step 1, as shown in the following command:
   ```json
   PUT /_snapshot/my-azure-snapshot
   {
     "type": "azure",
     "settings": {
       "client": "default",
       "container": "snapshot_container"
     }
   }
   ```

### Set up Microsoft Azure Blob Storage

To use Azure Blob Storage as a snapshot repository, follow these steps:
1. Install the `repository-azure` plugin on all nodes with the following command:

   ```bash
   ./bin/opensearch-plugin install repository-azure
   ```

1. After the `repository-azure` plugin is installed, define your Azure Blob Storage settings before initializing the node. Start by defining your Azure Storage account name using the following secure setting:

   ```bash
   ./bin/opensearch-keystore add azure.client.default.account
   ```

Choose one of the following options for setting up your Azure Blob Storage authentication credentials.

#### Using an Azure Blob Storage account key
   
Use the following setting to specify your Azure Storage account key:
   
```bash 
./bin/opensearch-keystore add azure.client.default.key
```

#### Shared access signature
   
Use the following setting when accessing Azure with a shared access signature (SAS):
         
```bash
./bin/opensearch-keystore add azure.client.default.sas_token      
```

#### Azure token credential 

You can configure a token credential authentication flow in `opensearch.yml`. This method is distinct from connection string authentication, which requires a SAS or an account key.

If you choose to use token credential authentication, you must choose a token credential type. Although Azure offers multiple token credential types, only [managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) is supported.

To use managed identity, add your token credential type to `opensearch.yml` using either the `managed` or `managed_identity` value. This indicates that managed identity is being used to perform token credential authentication:

```yml
azure.client.default.token_credential_type: "managed_identity"
``` 

Note the following when using Azure token credentials:

- Token credential support is disabled in `opensearch.yml` by default.
- A token credential takes precedence over an Azure Storage account key or a SAS when multiple options are configured. 

## Sharing a repository between clusters

You can register the same repository on more than one cluster, for example, to restore snapshots from a production cluster to a test cluster. Only one cluster should write to a repository. On every other cluster, register the repository with the `readonly` setting set to `true`. A read-only repository can list and restore snapshots, but it can't create them. If more than one cluster writes to the same repository, the repository contents can become corrupted:

```json
PUT /_snapshot/my-fs-repository
{
  "type": "fs",
  "settings": {
    "location": "/mnt/snapshots",
    "readonly": true
  }
}
```
{% include copy-curl.html %}

Because the snapshot format can change between major versions, we recommend using a separate repository for each major version of OpenSearch.

## Maintaining repositories

Use the following APIs to maintain snapshot repositories:

- [Verify Snapshot Repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/verify-snapshot-repository/): Checks that all nodes can access the repository. OpenSearch verifies a repository when you register it. To skip this check, add `?verify=false` to the registration request, and then verify the repository later using `POST /_snapshot/<repository>/_verify`.
- [Cleanup Snapshot Repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/cleanup-snapshot-repository/): Removes data that is no longer referenced by any snapshot, such as data left by failed snapshot operations.
- [Delete Snapshot Repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/delete-snapshot-repository/): Removes the repository registration from the cluster. The snapshots in the repository are not deleted. To use them again, register the repository again.

## Take snapshots

You specify two pieces of information when you create a snapshot:

- Name of your snapshot repository
- Name for the snapshot

The following snapshot includes all indexes and the cluster state:

```json
PUT /_snapshot/my-repository/snapshot-1
```
{% include copy-curl.html %}

You can also add a request body to include or exclude certain indexes or specify other settings. The `metadata` object stores custom information with the snapshot, such as who took it and why:

```json
PUT /_snapshot/my-repository/snapshot-2
{
  "indices": "opensearch_dashboards*,my-index*,-my-index-2016",
  "ignore_unavailable": true,
  "include_global_state": false,
  "partial": false,
  "metadata": {
    "taken_by": "ops-team",
    "reason": "Backup before upgrading to 3.9"
  }
}
```
{% include copy-curl.html %}

For more information, see [Create Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-snapshot/).

To include the date in a snapshot name, use [date math]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/#date-math) in the name and URL-encode it. For example, the following request creates a snapshot named `nightly-` followed by the current date, such as `nightly-2026.10.12`. The non-encoded name is `<nightly-{now/d}>`:

```json
PUT /_snapshot/my-repository/%3Cnightly-%7Bnow%2Fd%7D%3E
```
{% include copy-curl.html %}

To check the snapshot immediately after starting it, send the following request:

```json
GET /_snapshot/my-repository/snapshot-2
```
{% include copy-curl.html %}

The response shows that the snapshot is still in progress:

```json
{
  "snapshots": [{
    "snapshot": "snapshot-2",
    "indices": [
      "opensearch_dashboards_sample_data_ecommerce",
      "my-index",
      "opensearch_dashboards_sample_data_logs",
      "opensearch_dashboards_sample_data_flights"
    ],
    "include_global_state": false,
    "state": "IN_PROGRESS",
    ...
  }]
}
```

For more information, see [Get Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/).

If you want to wait for the snapshot to finish before continuing, add the `wait_for_completion` parameter to your request. Snapshots can take a while to complete, so consider whether or not this option fits your use case:

```json
PUT _snapshot/my-repository/snapshot-3?wait_for_completion=true
```
{% include copy-curl.html %}

Snapshots have the following states:

State | Description
:--- | :---
SUCCESS | The snapshot successfully stored all shards.
`IN_PROGRESS` | The snapshot is currently running.
PARTIAL | At least one shard failed to store successfully. Can only occur if you set `partial` to `true` when taking the snapshot.
FAILED | The snapshot encountered an error and stored no data.
INCOMPATIBLE | The snapshot is incompatible with the version of OpenSearch running on this cluster. See [Conflicts and compatibility](#conflicts-and-compatibility).

To check the status of all running snapshots, send the following request:

```json
GET /_snapshot/_status
```
{% include copy-curl.html %}

To view the progress of each shard in a specific snapshot, include the repository and snapshot names. This request returns detailed information even if the snapshot has finished:

```json
GET /_snapshot/my-repository/snapshot-2/_status
```
{% include copy-curl.html %}

For more information, see [Get Snapshot Status API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-status/). While a snapshot is running, the Get Snapshot API can respond slowly because it uses the same thread pool as the snapshot operation, so use the Get Snapshot Status API to monitor progress.

While a shard is being included in a snapshot, it can't be relocated to another node. As a result, a running snapshot can delay shard rebalancing and the effects of shard allocation filtering.
{: .note}

### Global cluster state

When `include_global_state` is `true` (the default when taking a snapshot), the snapshot stores the global cluster state. The global state contains the following cluster metadata:

- Persistent cluster settings. Transient cluster settings are not included.
- Index templates, composable index templates, and component templates.
- Ingest pipelines and search pipelines.
- Stored scripts.
- Persistent tasks. Plugins use persistent tasks for long-running work that must continue after a node restarts, such as cross-cluster replication tasks.

The global state does not include snapshot repository registrations. Data stream definitions are stored for the data streams included in the snapshot, regardless of the `include_global_state` value.

The global state does not contain any indexes. The `indices` parameter determines which indexes are included in a snapshot, and system and hidden indexes are treated like any other index. If you omit `indices`, the snapshot includes all open indexes, including system and hidden indexes. Plugin configuration stored in system indexes, such as Index State Management (ISM) policies in the `.opendistro-ism-config` index, is backed up only if those indexes are included in the snapshot.

## Restore snapshots

The first step in restoring a snapshot is retrieving existing snapshots. To view all snapshot repositories, send the following request:

```json
GET /_snapshot/_all
```
{% include copy-curl.html %}

To view all snapshots in a repository, send the following request:

```json
GET /_snapshot/my-repository/_all
```
{% include copy-curl.html %}

Then restore a snapshot, send the following request:

```json
POST /_snapshot/my-repository/snapshot-2/_restore
```
{% include copy-curl.html %}

As when taking a snapshot, you can add a request body to include or exclude certain indexes or specify some other settings:

```json
POST /_snapshot/my-repository/snapshot-2/_restore
{
  "indices": "opensearch_dashboards*,my-index*",
  "ignore_unavailable": true,
  "include_global_state": false,
  "include_aliases": false,
  "partial": false,
  "rename_pattern": "opensearch_dashboards(.+)",
  "rename_replacement": "restored_opensearch_dashboards$1",
  "index_settings": {
    "index.blocks.read_only": false
  },
  "ignore_index_settings": [
    "index.refresh_interval"
  ]
}
```
{% include copy-curl.html %}

For more information, see [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/).

When restoring a snapshot, `include_global_state` defaults to `false`. If you set it to `true`, OpenSearch restores the global cluster state stored in the snapshot, including persistent cluster settings, composable and component index templates, ingest and search pipelines, stored scripts, and persistent tasks. The restored metadata replaces corresponding metadata in the cluster. For example, persistent tasks that exist in the cluster but not in the snapshot are removed, and index templates in the snapshot overwrite existing templates with the same name. Transient cluster settings and registered snapshot repositories are not included in the snapshot and are not restored. For a list of the metadata included in the global state, see [Global cluster state](#global-cluster-state).

### Monitoring a restore operation

While the primary shards of an index are being restored, the index health is `yellow` and the index has no active primary shards. When the primary shards are restored, OpenSearch allocates the replica shards, and the index health becomes `green` when all replicas are allocated. To monitor the progress of the restore, use the [CAT Recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/) or the [Index Recovery API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/recover/). Shards being restored from a snapshot have the recovery type `snapshot`.


### Restoring snapshots across remote-backed clusters

When using remote-backed storage, OpenSearch automatically backs up index segments and translogs to remote repositories (typically, Amazon S3). If you're restoring snapshots between clusters that **both use remote-backed storage** with different remote store repositories, you must specify the source cluster's remote store repositories.

This procedure applies only to clusters with remote-backed storage enabled. For standard OpenSearch clusters without remote-backed storage, use the standard snapshot restore process without these additional parameters.
{: .note}

The following procedure restores a snapshot from Cluster A to Cluster B, where both clusters use remote-backed storage with different Amazon S3 repositories.

#### Prerequisites

Before you start, ensure that you have fulfilled the following prerequisites:

- Both clusters are running the same OpenSearch version.
- You have obtained the Amazon S3 bucket names, base paths, AWS Key Management Service (KMS) key Amazon Resource Names (ARNs), and domain ARNs from the source cluster's remote store configuration.

#### Steps

To restore a snapshot from the source cluster to the target cluster, complete the following steps:

1. Register the source cluster's snapshot repository on the target cluster as read-only:

   ```json
   PUT /_snapshot/source-cluster-snapshots
   {
     "type": "s3",
     "settings": {
       "bucket": "source-snapshot-bucket",
       "base_path": "snapshots",
       "region": "us-east-1",
       "readonly": true
     }
   }
   ```
   {% include copy-curl.html %}

2. Register the source cluster's remote segment repository on the target cluster as read-only:

   ```json
   PUT /_snapshot/source-remote-segment-repo
   {
     "type": "s3",
     "settings": {
       "bucket": "source-segment-bucket",
       "base_path": "remote-store/segments",
       "region": "us-east-1",
       "amazon_es_kms_enc_ctx": "domainARN=arn:aws:es:us-east-1:123456789012:domain/source-cluster",
       "amazon_es_kms_key_arn": "arn:aws:kms:us-east-1:123456789012:key/abcd1234-56ef-78gh-90ij-klmnopqrstuv",
       "amazon_es_encryption": "true",
       "remote_store_index_shallow_copy": "true",
       "readonly": true
     }
   }
   ```
   {% include copy-curl.html %}

3. Register the source cluster's remote translog repository on the target cluster as read-only:

   ```json
   PUT /_snapshot/source-remote-translog-repo
   {
     "type": "s3",
     "settings": {
       "bucket": "source-translog-bucket",
       "base_path": "remote-store/translogs",
       "region": "us-east-1",
       "amazon_es_kms_enc_ctx": "domainARN=arn:aws:es:us-east-1:123456789012:domain/source-cluster",
       "amazon_es_kms_key_arn": "arn:aws:kms:us-east-1:123456789012:key/abcd1234-56ef-78gh-90ij-klmnopqrstuv",
       "amazon_es_encryption": "true",
       "remote_store_index_shallow_copy": "true",
       "readonly": true
     }
   }
   ```
   {% include copy-curl.html %}

4. Verify that you can list snapshots in the source snapshot repository:

   ```json
   GET /_snapshot/source-cluster-snapshots/_all
   ```
   {% include copy-curl.html %}

5. Restore the snapshot, specifying both the source segment and translog repositories:

   ```json
   POST /_snapshot/source-cluster-snapshots/snapshot-1/_restore
   {
     "indices": "my-index",
     "source_remote_store_repository": "source-remote-segment-repo",
     "source_remote_translog_repository": "source-remote-translog-repo"
   }
   ```
   {% include copy-curl.html %}

The target cluster will restore the index from the snapshot repository and configure the restored indexes to read their remote segments and translogs from the source cluster's remote store repositories.

If you encounter index name collisions during restore, use the `rename_pattern` and `rename_replacement` parameters to rename the indexes, or delete the conflicting indexes before restoring.
{: .tip}

### Restoring a snapshot to a different cluster

A snapshot is not tied to the cluster that created it. To restore a snapshot to another cluster, register the snapshot repository on that cluster as read-only and then restore the snapshot as usual. For more information, see [Sharing a repository between clusters](#sharing-a-repository-between-clusters). The target cluster can have a different size or topology than the source cluster. Keep the following considerations in mind:

- If the target cluster is smaller, make sure that it has enough storage for the restored indexes. To reduce the required capacity, restore only some of the indexes using the `indices` parameter, or reduce the number of replicas using the `index_settings` parameter, for example, `"index_settings": {"index.number_of_replicas": 0}`.
- Shard allocation filtering settings, such as `index.routing.allocation.require.*`, are restored with each index. If no node in the target cluster matches these settings, the restored shards remain unassigned. To allocate them, override the settings using `index_settings` or remove them using `ignore_index_settings`.
- If the snapshot's persistent cluster settings are incompatible with the target cluster, restoring the cluster state fails. In this case, restore the snapshot without the cluster state by setting `include_global_state` to `false`.

For more information about the restore parameters, see [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/).

### Conflicts and compatibility

One way to avoid index naming conflicts when restoring indexes is to use the `rename_pattern` and `rename_replacement` options. You can then, if necessary, use the `_reindex` API to combine the two. However, it may be simpler to delete the indexes that caused the conflict prior to restoring them from a snapshot.

Similarly, to avoid alias naming conflicts when restoring indexes with aliases, you can use the `rename_alias_pattern` and `rename_alias_replacement` options. 

You can use the `_close` API to close existing indexes prior to restoring from a snapshot, but the index in the snapshot has to have the same number of shards as the existing index.

We recommend ceasing write requests to a cluster before restoring from a snapshot, which helps avoid scenarios such as:

1. You delete an index, which also deletes its alias.
1. A write request to the now-deleted alias creates a new index with the same name as the alias.
1. The alias from the snapshot fails to restore due to a naming conflict with the new index.

Compatibility is determined by the version of OpenSearch that created each index in the snapshot, not by the version that took the snapshot. Each index must have been created by the current major version or the previous major version. If any index in the snapshot is incompatible, you can't restore the snapshot. Restoring a snapshot to an older version of OpenSearch is not supported.

Snapshots are only forward compatible by one major version. Snapshots taken by earlier OpenSearch versions can continue to be restored by the version of OpenSearch that originally took the snapshot, even after a version upgrade. For example, a snapshot taken by OpenSearch 2.11 or earlier can continue to be restored by a 2.11 cluster even after upgrading to 2.12.

If you have an old snapshot taken from an earlier major OpenSearch version, you can restore it to an intermediate cluster one major version newer than the snapshot's version, reindex all indexes, take a new snapshot, and repeat until you arrive at your desired major version, but you may find it easier to manually index your data in the new cluster.

## Canceling snapshot and restore operations

To cancel a snapshot that is in progress, delete it. OpenSearch stops the snapshot and removes the data it has written to the repository:

```json
DELETE _snapshot/my-repository/my-snapshot
```
{% include copy-curl.html %}

A restore operation recovers each index from the snapshot using the standard shard recovery process. To cancel a restore that is in progress, delete the indexes that are being restored. This deletes all data that has been restored to those indexes:

```json
DELETE restored-index
```
{% include copy-curl.html %}

To find the indexes that are being restored, use the [CAT Recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/) with the `active_only` parameter. Shards being restored from a snapshot have the recovery type `snapshot`:

```json
GET _cat/recovery?active_only=true&v&h=index,shard,type,stage,snapshot,bytes_percent
```
{% include copy-curl.html %}

## Effect of cluster blocks

Cluster blocks, such as the one set by the `cluster.blocks.read_only` setting, affect snapshot and restore operations that modify the cluster metadata. With a read-only cluster block in place, the following operations are affected:

- Registering or deleting a repository fails because it writes to the cluster metadata.
- Restoring a snapshot fails because it writes to the cluster metadata.
- Taking a snapshot succeeds because it only reads the cluster metadata.
- Listing and deleting snapshots in a registered repository succeed because the repository contents are not part of the cluster metadata.

Index blocks, such as `index.blocks.write`, are stored in the index settings and are restored with the index. To remove a restored block, update the index settings after the restore or exclude the setting using the `ignore_index_settings` parameter.

## Security considerations

If you're using the Security plugin, snapshots have some additional restrictions:

- To perform snapshot and restore operations, users must have the built-in `manage_snapshots` role.
- You can't restore snapshots that contain a global state or the `.opendistro_security` index.

If a snapshot contains a global state, you must exclude it when performing the restore. If your snapshot also contains the `.opendistro_security` index, either exclude it or list all the other indexes you want to include:

```json
POST /_snapshot/my-repository/snapshot-3/_restore
{
  "indices": "-.opendistro_security",
  "include_global_state": false
}
```
{% include copy-curl.html %}

The `.opendistro_security` index contains sensitive data, so we recommend excluding it when you take a snapshot. If you do need to restore the index from a snapshot, you must include an admin certificate in the request:

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XPOST 'https://localhost:9200/_snapshot/my-repository/snapshot-3/_restore?pretty'
```
{% include copy.html %}

We strongly recommend against restoring `.opendistro_security` using an admin certificate because doing so can alter the security posture of the entire cluster. See [A word of caution]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/#a-word-of-caution) for a recommended process to back up and restore your Security plugin configuration.
{: .warning}

## Index codec considerations

For index codec considerations, see [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/#snapshots).

## Related documentation

- [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/)
