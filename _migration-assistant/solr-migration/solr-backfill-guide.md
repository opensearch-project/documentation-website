---
layout: default
title: Solr backfill guide
nav_order: 2
parent: Solr migration
permalink: /migration-assistant/solr-migration/solr-backfill-guide/
---

# Solr backfill guide

This page provides a step-by-step guide for migrating documents from Apache Solr 8.x to OpenSearch using the snapshot-based backfill workflow. For the overall Solr migration architecture (including the Transformation Shim for query traffic), see [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/).

## Prerequisites

### Solr cluster requirements

- **Apache Solr 8.x** running in SolrCloud mode (with ZooKeeper)
- The **`s3-repository` module** must be installed (ships with Solr 8.9+)
- Solr must have the `s3-repository` lib on its shared lib path. In `solr.xml`:
  ```xml
  <str name="sharedLib">/opt/solr/dist,/opt/solr/contrib/s3-repository/lib</str>
  ```
- The Solr process must have **AWS credentials** available (environment variables, instance profile, or `~/.aws/credentials`)

### S3 bucket

- An S3 bucket accessible from **both** the Solr cluster (for writing backups) and the Migration Assistant pods (for reading backups)
- The bucket must already exist — neither Solr nor Migration Assistant will create it

### Migration Assistant deployment

- Migration Assistant deployed to Kubernetes (see [Deploying to Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) or [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/))
- The migration console and RFS worker pods must have S3 read access to the backup bucket

## Setting up the S3 backup repository in Solr

Solr backup repositories are configured statically in `solr.xml` — there is no API to register them at runtime. After changing `solr.xml`, **all Solr nodes must be restarted**.

### 1. Edit solr.xml

Add a `<backup>` section:

```xml
<backup>
  <repository name="default-s3" class="org.apache.solr.s3.S3BackupRepository" default="true">
    <str name="s3.bucket.name">YOUR-BUCKET-NAME</str>
    <str name="s3.region">us-west-2</str>
  </repository>
</backup>
```
{% include copy.html %}

| Parameter | Description |
|:----------|:-----------|
| `name` | Repository name — referenced in the workflow config as `repoName` |
| `s3.bucket.name` | S3 bucket name (without `s3://` prefix) |
| `s3.region` | AWS region of the bucket |

### 2. Upload to ZooKeeper (SolrCloud)

```bash
/opt/solr/bin/solr zk cp /opt/solr/server/solr/solr.xml zk:/solr.xml -z localhost:2181
```
{% include copy.html %}

### 3. Restart all Solr nodes

```bash
/opt/solr/bin/solr restart -force
```
{% include copy.html %}

### 4. Verify the repository

Test with a backup:

```bash
curl "http://localhost:8983/solr/admin/collections?action=BACKUP&name=test-backup&collection=<COLLECTION>&repository=default-s3&location=/test&async=test-verify"
```
{% include copy.html %}

Check status:

```bash
curl "http://localhost:8983/solr/admin/collections?action=REQUESTSTATUS&requestid=test-verify"
```
{% include copy.html %}

## Workflow configuration

```yaml
skipApprovals: true

sourceClusters:
  solr-source:
    endpoint: "http://<solr-host>:8983"
    version: "SOLR 8.11.4"
    snapshotInfo:
      repos:
        default-s3:
          awsRegion: "us-west-2"
          s3RepoPathUri: "s3://<bucket-name>/<optional-subpath>"
      snapshots:
        source-solr-snap:
          config:
            createSnapshotConfig: {}
          repoName: "default-s3"

targetClusters:
  target:
    endpoint: "https://<opensearch-endpoint>"
    allowInsecure: false
    authConfig:
      awsSigV4:
        serviceName: "es"
        region: "us-west-2"

snapshotMigrationConfigs:
  - fromSource: "solr-source"
    toTarget: "target"
    perSnapshotConfig:
      source-solr-snap:
        - metadataMigrationConfig:
            skipEvaluateApproval: true
            skipMigrateApproval: true
          documentBackfillConfig:
            maxConnections: 10
            documentsPerBulkRequest: 1000
            maxShardSizeBytes: 80000000000
```
{% include copy.html %}

### Key configuration fields

| Field | Description |
|:------|:-----------|
| `version` | Must be `"SOLR 8.x.x"` format (for example, `"SOLR 8.11.4"`) |
| `s3RepoPathUri` | Full S3 URI: `s3://bucket/subpath`. The subpath maps to the `location` parameter in Solr's BACKUP API. |
| `repoName` | Must match the repository `name` in Solr's `solr.xml` |

### Understanding s3RepoPathUri

```
s3RepoPathUri: "s3://my-bucket/solr-migration-v3"
                      │              │
                      │              └── Subpath: passed as "location" to Solr BACKUP API
                      └── Bucket: must match s3.bucket.name in solr.xml
```

Both CreateSnapshot (write) and RFS (read) use the same `s3RepoPathUri`, so they agree on where the data lives.

## Running the backfill

```bash
workflow configure apply --file solr-backfill.wf.yaml
workflow submit
workflow manage    # Interactive TUI
```
{% include copy.html %}

### Verify document counts

```bash
console clusters cat-indices --refresh
```
{% include copy.html %}

## Troubleshooting

### Snapshot creation fails

| Symptom | Cause | Fix |
|:--------|:------|:----|
| `Repository default-s3 not found` | Repository not in `solr.xml` or Solr not restarted | Add `<backup>` section, restart all nodes |
| S3 permission denied | IAM role/credentials missing | Ensure Solr process has S3 write access |
| `location` errors | Wrong `s3RepoPathUri` format | Must be `s3://bucket` or `s3://bucket/subpath` |

### Metadata migration finds 0 items

Common causes:
- Wrong `s3RepoPathUri` — subpath doesn't match where the backup was written
- Snapshot didn't complete — check the async status on Solr
- Wrong snapshot name referenced

### RFS migrates fewer documents than expected

1. Verify the backup contains all shards:
   ```bash
   aws s3 ls s3://<bucket>/<subpath>/<snapshot>/<collection>/shard_backup_metadata/
   ```
2. Each shard should have a `md_shardN_0.json` file
3. Check the coordinator for work item status
