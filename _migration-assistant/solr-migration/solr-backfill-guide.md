---
layout: default
title: Solr backfill guide
nav_order: 2
parent: Solr migration
permalink: /migration-assistant/solr-migration/solr-backfill-guide/
---

# Solr backfill guide

To migrate documents from Apache Solr to OpenSearch, use the snapshot-based backfill workflow. For the overall Solr migration architecture, see [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/).

## SolrCloud compared to standalone Solr

Migration Assistant supports both SolrCloud and standalone Solr deployment modes. It auto-detects the mode by probing the Solr Collections API first and falling back to the Solr Core Admin API. The prerequisites differ between the two modes, as described in the following table.

| Feature | SolrCloud | Standalone Solr |
|:-------|:----------|:----------------|
| Backup unit | Collection | Core |
| Solr backup API endpoint | `admin/collections?action=BACKUP` | `/solr/<core>/replication?command=backup` |
| Poll API endpoint | `admin/collections?action=REQUESTSTATUS` | `/solr/<core>/replication?command=details` |
| `solr.xml` location | ZooKeeper | Filesystem (typically `/var/solr/data/solr.xml`) |
| Restart scope | Restart every node in the cluster | Restart the single Solr node |
| Migration Assistant workflow argument | `solrCollections: [name1, name2]` | Same field, value is core names |

Steps 1–4 are identical in both modes. Only Step 5 (how `solr.xml` is published and how nodes are restarted) differs.

## Responsibility breakdown

The snapshot is produced by **your Solr cluster** ([Solr's Amazon S3 backup plugin](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html#s3backuprepository) writes the backup files to Amazon S3) and consumed by **Migration Assistant** (reads those files and bulk-indexes into OpenSearch). Migration Assistant cannot access your Solr cluster to install plugins or modify its configuration. You must complete those steps manually. All prerequisites on your side must be in place before you run the `create snapshot` step of the workflow.

| Responsibility | Owner | Timing |
|:---------------|:------|:-----|
| Install the Solr S3 backup plugin on every Solr node | You | Before running Migration Assistant |
| Configure `solr.xml` with an `<backup>` repository and publish it (ZooKeeper for SolrCloud, filesystem for standalone) | You | Before running Migration Assistant |
| Restart Solr so it loads the new `solr.xml` (every node for SolrCloud, the single node for standalone) | You | Before running Migration Assistant |
| Create the S3 bucket and grant Solr `PutObject` / `GetObject` / `ListBucket` | You | Before running Migration Assistant |
| Grant the Migration Assistant pods read access to the same bucket | You | During deployment |
| Trigger `BACKUP` on every collection (SolrCloud) or core (standalone) and poll until complete. For SolrCloud, also create the S3 directory markers Solr's `S3BackupRepository` checks for. | Migration Assistant (`create snapshot`) | Workflow step |
| Read the backup from S3, translate schemas, bulk-index into OpenSearch | Migration Assistant (metadata + Reindex-from-Snapshot) | Workflow step |

## Solr prerequisites

Complete the following five steps on every Solr node in the cluster.

### Step 1: Install the S3 backup plugin on every Solr node

In the Solr 8.11 Docker image (and most default installations), the S3 backup plugin files are distributed across two directories.

| Path | Contents | Missing component |
|:-----|:---------|:---------------|
| `/opt/solr/contrib/s3-repository/lib/` | AWS SDK jars (dependencies only) | The `S3BackupRepository` class |
| `/opt/solr/dist/solr-s3-repository-<VERSION>.jar` | `S3BackupRepository` class | The required AWS SDK jars |

If `sharedLib` references only one of these directories, Solr starts without errors but every `BACKUP` request fails with a `ClassNotFoundException: org.apache.solr.s3.S3BackupRepository` (or an AWS SDK `NoClassDefFoundError`).

Copy the `solr-s3-repository` jar from the `/opt/solr/dist/` directory into the `/opt/solr/contrib/s3-repository/lib/` directory so that all required files are in the same location:

```bash
cp /opt/solr/dist/solr-s3-repository-*.jar /opt/solr/contrib/s3-repository/lib/
```
{% include copy.html %}

Run this command on **every Solr node** before starting Solr. In Docker, include this command in the container startup script (the directory requires `root` permissions).

### Step 2: Configure solr.xml

There is **no API to register a backup repository at runtime in any version of Solr**. Repositories must be declared in `solr.xml` and loaded at node startup.

Two common configuration errors produce no visible warning:

- **`sharedLib` must be a single directory in Solr 8**: A comma-separated list is accepted but treated as a single invalid path, and the plugin does not load.
- **Variable substitution `${VAR:default}` in `solr.xml` reads Java system properties, not OpenSearch environment variables**: Pass the values using `SOLR_OPTS=-Dkey=value` rather than Docker environment variables (`-e KEY=value`).

The following example shows a minimal `solr.xml` configuration:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<solr>
  <str name="sharedLib">/opt/solr/contrib/s3-repository/lib</str>

  <solrcloud>
    <str name="host">${host:}</str>
    <int name="hostPort">${jetty.port:8983}</int>
    <str name="hostContext">${hostContext:solr}</str>
    <bool name="genericCoreNodeNames">${genericCoreNodeNames:true}</bool>
    <int name="zkClientTimeout">${zkClientTimeout:30000}</int>
    <int name="distribUpdateSoTimeout">${distribUpdateSoTimeout:600000}</int>
    <int name="distribUpdateConnTimeout">${distribUpdateConnTimeout:60000}</int>
  </solrcloud>

  <backup>
    <repository name="s3" class="org.apache.solr.s3.S3BackupRepository" default="true">
      <str name="s3.bucket.name">${S3_BUCKET_NAME:}</str>
      <str name="s3.region">${S3_REGION:us-east-1}</str>
      <str name="s3.endpoint">${S3_ENDPOINT:}</str>
    </repository>
  </backup>
</solr>
```
{% include copy.html %}

The following table describes the configuration fields.

| Field | Description |
|:------|:------------|
| `<str name="sharedLib">` | The directory containing the jar files that Solr loads on startup. This must be the single directory into which you copied both the AWS SDK jar files and the plugin jar in Step 1. |
| `<repository name="s3">` | The logical repository name. This value corresponds to `repoName` in your workflow configuration and to the `repository=` parameter in Solr's `BACKUP` URL. |
| `s3.bucket.name` | The Amazon S3 bucket that stores the backup. The bucket must already exist because Solr does not create it. |
| `s3.region` | The AWS Region of the bucket. |
| `s3.endpoint` | The S3 endpoint. Leave empty for production Amazon S3. Set this field only when targeting a custom endpoint (for example, LocalStack). |

### Step 3: Configure Solr S3 connection

Pass S3 connection values to Solr through `SOLR_OPTS` system properties:

```bash
export SOLR_OPTS="-DS3_BUCKET_NAME=my-solr-backups \
                  -DS3_REGION=us-west-2 \
                  -DSOLR_SECURITY_MANAGER_ENABLED=false"
```
{% include copy.html %}

`SOLR_SECURITY_MANAGER_ENABLED=false` is only required in sandboxed or `LocalStack` setups where the Java security manager blocks the AWS SDK outbound connections. In standard AWS deployments, it is not needed.

### Step 4: Grant Solr permission to write to S3

The Solr process uses the [default AWS credential provider chain](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html): environment variables, Amazon EC2 instance profile, ECS task role, `~/.aws/credentials`, or a shared profile. Ensure that one of these credential sources resolves to an IAM identity with the following permissions scoped to the backup bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetBucketLocation"
    ],
    "Resource": [
      "arn:aws:s3:::my-solr-backups",
      "arn:aws:s3:::my-solr-backups/*"
    ]
  }]
}
```
{% include copy.html %}

Solr writes backups incrementally and reads previous backup metadata to determine which Lucene segments to re-upload. Therefore, `PutObject`, `GetObject`, and `ListBucket` are all required. `DeleteObject` is only needed if you use the `DELETE_BACKUP` or `maxNumBackup` cleanup features.

### Step 5: Publish solr.xml and restart Solr

The method for publishing `solr.xml` differs between SolrCloud and standalone Solr, but the file contents from Step 2 are the same for both modes.

#### SolrCloud

In SolrCloud mode, `solr.xml` is stored in `ZooKeeper`. Upload the edited file and then restart each node to load the new `<backup>` section:

```bash
/opt/solr/bin/solr zk cp <path-to-new-solr.xml> zk:/solr.xml -z <ZK_HOST>:2181
/opt/solr/bin/solr restart -force  # repeat on every node
```
{% include copy.html %}

#### Standalone Solr

Copy the edited `solr.xml` to the Solr home directory and restart Solr. In the default Docker image, the correct path is `/var/solr/data/solr.xml`. Do not use `/opt/solr/server/solr/solr.xml` because Solr ignores that path when started with `-Dsolr.solr.home=/var/solr/data`. To copy the file and restart Solr, run the following commands:

```bash
cp <path-to-new-solr.xml> /var/solr/data/solr.xml
/opt/solr/bin/solr restart -force
```
{% include copy.html %}

### Verify the repository before running Migration Assistant

Before running Migration Assistant, verify that your Solr cluster can write a backup to S3 successfully. If the test backup fails, resolve the issue in your Solr configuration before proceeding.

#### SolrCloud

For SolrCloud, run the following command:

```bash
# Trigger an async backup of one collection to a throwaway location.
curl "http://<solr-host>:8983/solr/admin/collections?action=BACKUP\
&name=preflight&collection=<SOME_COLLECTION>\
&repository=s3&location=/preflight-check&async=preflight-1&wt=json"

# Poll until state=completed (should take a few seconds on a small collection).
curl "http://<solr-host>:8983/solr/admin/collections?action=REQUESTSTATUS\
&requestid=preflight-1&wt=json"
```
{% include copy.html %}

If `REQUESTSTATUS` returns `state=failed`, review the complete JSON response. The `status.msg` field only contains a generic message such as `"found [preflight-1] in failed tasks"`. The detailed error appears in the top-level `exception.msg` or `response.*` fields. Common causes include the following:

- The plugin jar was not copied in Step 1.
- The S3 bucket does not exist.
- The IAM identity from step 4 does not have access to the bucket.

After the test backup succeeds, delete it by running the following command:

```bash
curl "http://<solr-host>:8983/solr/admin/collections?action=DELETE_BACKUP&name=preflight&location=/preflight-check&purge=true&repository=s3"
```
{% include copy.html %}

#### Standalone Solr

For standalone Solr, run the following command:

```bash
# Trigger a backup of one core.
curl "http://<solr-host>:8983/solr/<CORE_NAME>/replication\
?command=backup&repository=s3&location=/preflight-check&name=preflight&wt=json"

# Poll until status=success (the same endpoint returns the latest backup status).
curl "http://<solr-host>:8983/solr/<CORE_NAME>/replication?command=details&wt=json"
```
{% include copy.html %}

Verify that `details.backup.status` returns `"success"`. If the value is `"failed"` or `"exception"`, the `details.backup.exception` field contains the error details. The same root causes apply as for SolrCloud.

## Migration Assistant prerequisites

Verify that the following Migration Assistant prerequisites are met:

- Migration Assistant is deployed to Kubernetes or Amazon EKS. For more information, see [Deploy on Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) or [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).
- The Migration Console pod and the RFS worker pods have read access (`s3:GetObject` and `s3:ListBucket`) to the backup bucket. If Solr and Migration Assistant run in different AWS accounts or VPCs, verify routing (VPC endpoints, bucket policy) before proceeding.
- The bucket configured in Solr's `solr.xml` (`s3.bucket.name`) and the bucket referenced in the workflow configuration (`s3RepoPathUri`) are the same bucket.

## Workflow configuration

Migration Assistant validates the workflow against a schema generated at installation time. Always start from the version-matched sample (`workflow configure sample --load`) instead of writing the configuration manually. The schema names and structure change between releases.

### Key configuration fields

The following table describes the key configuration fields.

| Field | Description |
|:------|:------------|
| `sourceClusters.<name>.version` | The Solr version string. Must match the format `SOLR <major>.<minor>.<patch>`, for example, `SOLR 6.6.6`, `SOLR 7.7.3`, `SOLR 8.11.4`, or `SOLR 9.7.0`. |
| `sourceClusters.<name>.snapshotInfo.repos.<repoName>.s3RepoPathUri` | The full Amazon S3 URI in the format `s3://bucket` or `s3://bucket/subpath`. The bucket must match `s3.bucket.name` in `solr.xml`. The subpath is passed as the `location` parameter to Solr's `BACKUP` API. |
| `sourceClusters.<name>.snapshotInfo.snapshots.<snapshotName>.repoName` | The repository name. Must match the `name` attribute in `solr.xml`. |
| `targetClusters.<name>.authConfig.sigv4.service` | The AWS service identifier. Use `es` for Amazon OpenSearch Service or `aoss` for Amazon OpenSearch Serverless NextGen. |
| `targetClusters.<name>.authConfig.basic.secretName` | The Kubernetes secret name containing basic authentication credentials. Use this field instead of `sigv4` when targeting a self-managed cluster. |
| `perSnapshotConfig.<snapshotName>[].metadataMigrationConfig.skipEvaluateApproval` / `skipMigrateApproval` | Bypasses the per-step approval gates without disabling all approvals globally. |
| `perSnapshotConfig.<snapshotName>[].documentBackfillConfig.podReplicas` | The number of RFS pods. Each pod processes a different shard in parallel. |
| `perSnapshotConfig.<snapshotName>[].documentBackfillConfig.maxShardSizeBytes` | The maximum supported shard size. The default is 80 GiB. Larger shards must be reduced (force-merge or split) before backfill. |

### S3 repository path URI

Both `CreateSnapshot` (write) and `RFS` (read) use the same `s3RepoPathUri`, so they reference the same S3 location. Migration Assistant automatically creates the S3 directory markers Solr expects at both `<subpath>/` and `<subpath>/<snapshotName>/` before calling `BACKUP`, so you do not need to create them manually, as shown in the following diagram. 

```
s3RepoPathUri: "s3://my-bucket/solr-migration-v3"
                      │              │
                      │              └── Subpath — passed as "location" to Solr BACKUP
                      └── Bucket — must match s3.bucket.name in solr.xml
```

### Creating a snapshot

When you run the `create snapshot` workflow step, Migration Assistant performs the following operations:

1. **Detects the deployment mode** by probing the SolrCloud Collections API. If the probe fails, Migration Assistant falls back to the standalone Core Admin API.
2. **Discovers the backup units** -- Collections in SolrCloud (through `admin/collections?action=LIST`) or cores in standalone (through `admin/cores?action=STATUS`). You can override this by specifying the `solrCollections` workflow field.
3. **Creates Amazon S3 directory markers** at `<subpath>/` and `<subpath>/<snapshotName>/` (zero-byte objects with `content-type: application/x-directory`). Solr's `S3BackupRepository` verifies these paths exist before accepting a backup. This step applies to SolrCloud only. Migration Assistant does not create these markers in standalone mode. If you encounter a `specified location` failure in standalone mode, create the subpath manually by running `aws s3api put-object --bucket <bucket> --key <subpath>/ --content-type application/x-directory` and resubmit the workflow. For additional standalone Solr with S3 issues, see [Troubleshooting](#troubleshooting).
4. **Calls Solr's backup API** once per collection or core:
   - SolrCloud: `admin/collections?action=BACKUP&name=<collection>&location=<subpath>/<snapshotName>&repository=s3&async=...` (asynchronous).
   - Standalone: `/solr/<core>/replication?command=backup&name=<snapshotName>&location=<subpath>&repository=s3` (synchronous dispatch, asynchronous execution).
5. **Polls for completion** using `REQUESTSTATUS` per asynchronous ID (SolrCloud) or `replication?command=details` per core (standalone) until every unit reports `completed`, `success`, or failure.

Steps 3 through 5 require the [Solr prerequisites](#solr-prerequisites) to be fulfilled.

## Running the backfill

Load your YAML into the workflow session, then submit the workflow:

```bash
# Option 1: edit interactively (loads sample, opens $EDITOR)
workflow configure sample --load
workflow configure edit

# Option 2: pipe a file in non-interactively
cat solr-backfill.wf.yaml | workflow configure edit --stdin

# Submit and watch
workflow submit
workflow manage    # interactive TUI — also shows approval gates
```
{% include copy.html %}

If a previous workflow exists in your cluster, `workflow submit` automatically stops and replaces it. To remove CRDs without resubmitting, run `workflow reset` (interactive) or `workflow reset --all` (delete everything).

### Verify document counts

After backfill completes, verify document counts on the target by running the following command:

```bash
console clusters cat-indices --refresh
```
{% include copy.html %}

## Troubleshooting

The following are common issues and their resolutions.

### Snapshot creation fails

The following table lists common snapshot creation errors, their causes, and resolutions.

| Error | Cause | Resolution |
|:------|:------|:-----------|
| `ClassNotFoundException: org.apache.solr.s3.S3BackupRepository` in Solr logs | The plugin jar was not copied from `/opt/solr/dist/` into the `sharedLib` directory. | Repeat [Step 1](#step-1-install-the-s3-backup-plugin-on-every-solr-node) on every node and restart Solr. |
| `Repository default-s3 not found` | The `<backup>` block is missing from the running `solr.xml` (incorrect file, incorrect mount path, or nodes were not restarted after upload). | Repeat [Step 5](#step-5-publish-solrxml-and-restart-solr). |
| `specified location s3:///...` (triple slash) | Solr cannot verify the directory marker using `HeadObject`. | Verify permissions in [Step 4](#step-4-grant-solr-permission-to-write-to-s3). |
| S3 `AccessDenied` in Solr logs | The IAM identity on the Solr node does not have write access to the bucket. | Correct the IAM policy in [Step 4](#step-4-grant-solr-permission-to-write-to-s3) and confirm access by running `aws s3 ls` from the Solr node. |
| (SolrCloud only) `status.msg="found [...] in failed tasks"` | The asynchronous task failed. The detailed error is in a different field. | Review the full `REQUESTSTATUS` JSON response and inspect the top-level `exception.msg` or `response.*` fields. |
| (Standalone only) `details.backup.status` = `failed` or `exception` | The core-level backup failed. | Review the `details.backup.exception` field in the `replication?command=details` response for the detailed error. |

### Metadata migration finds 0 items

The following are common causes of empty metadata migration results:

- The `s3RepoPathUri` is incorrect. The bucket matches but the subpath does not match the location where Solr wrote the backup.
- The snapshot did not complete. Verify `REQUESTSTATUS` for every collection (SolrCloud) or `replication?command=details` for every core (standalone).
- The snapshot name referenced in `snapshotMigrationConfigs` is incorrect.

### RFS migrates fewer documents than expected

If the document count on the target is lower than expected, perform the following steps:

1. Verify that the backup contains all shards by running the following command:
   ```bash
   aws s3 ls s3://<bucket>/<subpath>/<snapshot>/<collection-or-core>/shard_backup_metadata/
   ```
2. Confirm that each shard has a `md_shardN_0.json` file (or `md_shardN_<N>.json` for successive backups). Migration Assistant uses the highest N value.
3. Verify work item status in `workflow manage`.
