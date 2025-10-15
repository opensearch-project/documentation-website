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

OpenSearch snapshots are incremental, meaning that they only store data that has changed since the last successful snapshot. The difference in disk usage between frequent and infrequent snapshots is often minimal.

In other words, taking hourly snapshots for a week (for a total of 168 snapshots) might not use much more disk space than taking a single snapshot at the end of the week. Also, the more frequently you take snapshots, the less time they take to complete. Some OpenSearch users take snapshots as often as every 30 minutes.

If you need to delete a snapshot, be sure to use the OpenSearch API rather than navigating to the storage location and purging files. Incremental snapshots from a cluster often share a lot of the same data; when you use the API, OpenSearch only removes data that no other snapshot is using.
{: .tip }

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
   PUT /_snapshot/my-fs-repository
   {
     "type": "fs",
     "settings": {
       "location": "/mnt/snapshots"
     }
   }
   ```
  {% include copy-curl.html %}

You will most likely not need to specify any parameters except for `location`. For allowed request parameters, see [Register or update snapshot repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository/).

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

   IAM roles require at least one of the above settings. Other settings will be taken from environment variables (if available): `AWS_ROLE_ARN`, `AWS_WEB_IDENTITY_TOKEN_FILE`, `AWS_ROLE_SESSION_NAME`.

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

You will most likely not need to specify any parameters except for `bucket` and `base_path`. For allowed request parameters, see [Register or update snapshot repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository/).


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

#### Using an Azure Storage account key
   
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

Starting in OpenSearch 2.15, you have the option to configure a token credential authentication flow in `opensearch.yml`. This method is distinct from connection string authentication, which requires a SAS or an account key.

If you choose to use token credential authentication, you will need to choose a token credential type. Although Azure offers multiple token credential types, as of OpenSearch version 2.15, only [managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) is supported.

To use managed identity, add your token credential type to `opensearch.yml` using either the `managed` or `managed_identity` value. This indicates that managed identity is being used to perform token credential authentication:

```yml
azure.client.default.token_credential_type: "managed_identity"
``` 

Note the following when using Azure token credentials:

- Token credential support is disabled in `opensearch.yml` by default.
- A token credential takes precedence over an Azure Storage account key or a SAS when multiple options are configured. 

## Take snapshots

You specify two pieces of information when you create a snapshot:

- Name of your snapshot repository
- Name for the snapshot

The following snapshot includes all indexes and the cluster state:

```json
PUT /_snapshot/my-repository/1
```
{% include copy-curl.html %}

You can also add a request body to include or exclude certain indexes or specify other settings:

```json
PUT /_snapshot/my-repository/2
{
  "indices": "opensearch-dashboards*,my-index*,-my-index-2016",
  "ignore_unavailable": true,
  "include_global_state": false,
  "partial": false
}
```
{% include copy-curl.html %}

For more information, see [Create Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-snapshot/).

If you request the snapshot immediately after taking it, you might see something like this:

```json
GET /_snapshot/my-repository/2
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
{% include copy-curl.html %}

For more information, see [Get Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/).

Note that the snapshot is still in progress. If you want to wait for the snapshot to finish before continuing, add the `wait_for_completion` parameter to your request. Snapshots can take a while to complete, so consider whether or not this option fits your use case:

```
PUT _snapshot/my-repository/3?wait_for_completion=true
```
{% include copy-curl.html %}

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
GET /_snapshot/_status
```
{% include copy-curl.html %}


## Restore snapshots

The first step in restoring a snapshot is retrieving existing snapshots. To see all snapshot repositories:

```
GET /_snapshot/_all
```
{% include copy-curl.html %}

To see all snapshots in a repository:

```
GET /_snapshot/my-repository/_all
```
{% include copy-curl.html %}

Then restore a snapshot:

```
POST /_snapshot/my-repository/2/_restore
```
{% include copy-curl.html %}

Just like when taking a snapshot, you can add a request body to include or exclude certain indexes or specify some other settings:

```json
POST /_snapshot/my-repository/2/_restore
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
{% include copy-curl.html %}

For more information, see [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/).

### Conflicts and compatibility

One way to avoid index naming conflicts when restoring indexes is to use the `rename_pattern` and `rename_replacement` options. You can then, if necessary, use the `_reindex` API to combine the two. However, it may be simpler to delete the indexes that caused the conflict prior to restoring them from a snapshot.

Similarly, to avoid alias naming conflicts when restoring indexes with aliases, you can use the `rename_alias_pattern` and `rename_alias_replacement` options. 

You can use the `_close` API to close existing indexes prior to restoring from a snapshot, but the index in the snapshot has to have the same number of shards as the existing index.

We recommend ceasing write requests to a cluster before restoring from a snapshot, which helps avoid scenarios such as:

1. You delete an index, which also deletes its alias.
1. A write request to the now-deleted alias creates a new index with the same name as the alias.
1. The alias from the snapshot fails to restore due to a naming conflict with the new index.

Snapshots are only forward compatible by one major version. Snapshots taken by earlier OpenSearch versions can continue to be restored by the version of OpenSearch that originally took the snapshot, even after a version upgrade. For example, a snapshot taken by OpenSearch 2.11 or earlier can continue to be restored by a 2.11 cluster even after upgrading to 2.12.

If you have an old snapshot taken from an earlier major OpenSearch version, you can restore it to an intermediate cluster one major version newer than the snapshot's version, reindex all indexes, take a new snapshot, and repeat until you arrive at your desired major version, but you may find it easier to manually index your data in the new cluster.

## Security considerations

If you're using the Security plugin, snapshots have some additional restrictions:

- To perform snapshot and restore operations, users must have the built-in `manage_snapshots` role.
- You can't restore snapshots that contain a global state or the `.opendistro_security` index.

If a snapshot contains a global state, you must exclude it when performing the restore. If your snapshot also contains the `.opendistro_security` index, either exclude it or list all the other indexes you want to include:

```json
POST /_snapshot/my-repository/3/_restore
{
  "indices": "-.opendistro_security",
  "include_global_state": false
}
```
{% include copy-curl.html %}

The `.opendistro_security` index contains sensitive data, so we recommend excluding it when you take a snapshot. If you do need to restore the index from a snapshot, you must include an admin certificate in the request:

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XPOST 'https://localhost:9200/_snapshot/my-repository/3/_restore?pretty'
```
{% include copy-curl.html %}

We strongly recommend against restoring `.opendistro_security` using an admin certificate because doing so can alter the security posture of the entire cluster. See [A word of caution]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/#a-word-of-caution) for a recommended process to back up and restore your Security plugin configuration.
{: .warning}

## Index codec considerations

For index codec considerations, see [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/#snapshots).

## Related articles

- [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/)