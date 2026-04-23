---
layout: default
title: Solr backfill guide
nav_order: 2
parent: Solr migration
permalink: /migration-assistant/solr-migration/solr-backfill-guide/
---

# Solr backfill guide

This page walks through migrating documents from Apache Solr 8.x to OpenSearch using the snapshot-based backfill workflow. For the overall Solr migration architecture (including the Transformation Shim for query traffic), see [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/).

## Who does what

The snapshot is produced by **your Solr cluster** (Solr's own S3 backup plugin writes the backup files to S3) and consumed by **Migration Assistant** (reads those files and bulk-indexes into OpenSearch). Migration Assistant cannot reach into your Solr cluster to install plugins or change its configuration — those steps are yours. All customer-side prerequisites must be in place before you run the `create snapshot` step of the workflow.

| Responsibility | Owner | When |
|:---------------|:------|:-----|
| Install the Solr S3 backup plugin on every Solr node | You | Before running Migration Assistant |
| Configure `solr.xml` with an `<backup>` repository and upload to ZooKeeper | You | Before running Migration Assistant |
| Restart every Solr node so it picks up the new `solr.xml` | You | Before running Migration Assistant |
| Create the S3 bucket and grant Solr `PutObject` / `GetObject` / `ListBucket` | You | Before running Migration Assistant |
| Grant the Migration Assistant pods read access to the same bucket | You | During deployment |
| Trigger `BACKUP` on every collection, poll async status, create S3 directory markers | Migration Assistant (`create snapshot`) | Workflow step |
| Read the backup from S3, translate schemas, bulk-index into OpenSearch | Migration Assistant (metadata + RFS) | Workflow step |

## Customer prerequisites (Solr side)

Complete all five steps below — in order — on every Solr node in the cluster.

### 1. Install the S3 backup plugin on every Solr node

In the Solr 8.11 Docker image (and most default installs), the S3 backup plugin is split across two directories:

| Path | Contents | What's missing |
|:-----|:---------|:---------------|
| `/opt/solr/contrib/s3-repository/lib/` | AWS SDK jars (dependencies only) | The `S3BackupRepository` class itself |
| `/opt/solr/dist/solr-s3-repository-<VERSION>.jar` | `S3BackupRepository` class | The AWS SDK jars it needs |

If you point `sharedLib` at only one of these, Solr will boot cleanly but every `BACKUP` request fails with `ClassNotFoundException: org.apache.solr.s3.S3BackupRepository` (or a cryptic AWS SDK `NoClassDefFoundError`).

Copy the dist jar into the contrib `lib/` directory so both live in the same place:

```bash
cp /opt/solr/dist/solr-s3-repository-*.jar /opt/solr/contrib/s3-repository/lib/
```
{% include copy.html %}

Do this on **every Solr node** before starting Solr. In Docker, do it as part of the container entrypoint (you must run as `root` for that directory to be writable).

### 2. Write a minimum-viable `solr.xml`

There is **no API to register a backup repository at runtime in any version of Solr**. Repositories must be declared in `solr.xml` and picked up at node startup.

Two things break silently if you get them wrong:

- **`sharedLib` must be a single directory in Solr 8.** A comma-separated list is accepted but treated as a single bogus path — the plugin never loads.
- **Variable substitution `${VAR:default}` resolves Java system properties, not environment variables.** Pass configuration via `SOLR_OPTS=-Dkey=value`, not `-e KEY=value`.

Minimum viable `solr.xml`:

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

| Field | Purpose |
|:------|:--------|
| `<str name="sharedLib">` | Directory of jars Solr loads on startup. Must be the single directory into which you copied both the SDK jars and the plugin jar in step 1. |
| `<repository name="s3">` | Logical repository name. This string goes into your workflow config as `repoName` and into Solr's `BACKUP` URL as `repository=`. |
| `s3.bucket.name` | S3 bucket that will hold the backup. Must already exist; Solr will not create it. |
| `s3.region` | AWS region of the bucket. |
| `s3.endpoint` | Leave empty for real AWS S3. Set only when targeting a custom endpoint (for example, LocalStack). |

### 3. Pass S3 configuration via `SOLR_OPTS` (system properties)

```bash
export SOLR_OPTS="-DS3_BUCKET_NAME=my-solr-backups \
                  -DS3_REGION=us-west-2 \
                  -DSOLR_SECURITY_MANAGER_ENABLED=false"
```
{% include copy.html %}

`SOLR_SECURITY_MANAGER_ENABLED=false` is only required in some sandboxed/LocalStack setups where the Java security manager blocks the AWS SDK's outbound connections. In standard AWS deployments it is not needed.

### 4. Grant Solr permission to write to S3

The Solr process uses the [default AWS credential provider chain](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html): environment variables, EC2 instance profile, ECS task role, `~/.aws/credentials`, or a shared profile. Make sure one of those resolves to an IAM identity with the following permissions scoped to the backup bucket:

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

Solr writes backups incrementally, so `PutObject` plus `GetObject`/`ListBucket` are all required — Solr reads the previous backup's metadata to decide which Lucene segments to re-upload. `DeleteObject` is only needed if you use the `DELETE_BACKUP` or `maxNumBackup` cleanup features.

### 5. Upload `solr.xml` to ZooKeeper and restart every Solr node

In SolrCloud mode, `solr.xml` lives in ZooKeeper. Upload the edited file and then roll the nodes so each picks up the new `<backup>` section:

```bash
/opt/solr/bin/solr zk cp <path-to-new-solr.xml> zk:/solr.xml -z <ZK_HOST>:2181
/opt/solr/bin/solr restart -force  # repeat on every node
```
{% include copy.html %}

### Verify the repository before running Migration Assistant

Pick any existing collection and run a throwaway backup. If this succeeds, Migration Assistant will work; if this fails, no amount of workflow tweaking will fix it — the problem is on the Solr side and must be resolved first.

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

If `REQUESTSTATUS` returns `state=failed`, **read the whole JSON response**, not just `status.msg`. The useful error is at the top level (for example, under `exception.msg` or `response.*`); `status.msg` only says `"found [preflight-1] in failed tasks"`. Common root causes: the plugin jar was not copied in step 1, the bucket doesn't exist, or the IAM identity from step 4 can't reach it.

Once verified, clean up: `action=DELETE_BACKUP&name=preflight&location=/preflight-check&purge=true&repository=s3`.

## Migration Assistant prerequisites

- Migration Assistant deployed to Kubernetes or EKS (see [Deploying to Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) or [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/)).
- The Migration Console pod and the RFS worker pods must have **read** access to the backup bucket: `s3:GetObject` and `s3:ListBucket`. If Solr and Migration Assistant run in different AWS accounts or different VPCs, confirm routing (VPC endpoints, bucket policy) before starting.
- The bucket you configured in Solr's `solr.xml` (`s3.bucket.name`) and the bucket referenced in the workflow config (`s3RepoPathUri`) must be the **same bucket** — Migration Assistant reads exactly where Solr wrote.

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
| `s3RepoPathUri` | Full S3 URI: `s3://bucket` or `s3://bucket/subpath`. The bucket must match `s3.bucket.name` in `solr.xml`. The subpath is passed as the `location` parameter in Solr's `BACKUP` API. |
| `repoName` | Must match the repository `name` attribute in `solr.xml` |

### Understanding `s3RepoPathUri`

```
s3RepoPathUri: "s3://my-bucket/solr-migration-v3"
                      │              │
                      │              └── Subpath — passed as "location" to Solr BACKUP
                      └── Bucket — must match s3.bucket.name in solr.xml
```

Both CreateSnapshot (write) and RFS (read) use the same `s3RepoPathUri`, so they agree on where the data lives. Migration Assistant automatically creates the S3 directory markers Solr expects at both `<subpath>/` and `<subpath>/<snapshotName>/` before calling `BACKUP`, so you don't need to pre-create them.

### What Migration Assistant does when you run `create snapshot`

1. Detects whether the source is SolrCloud (Collections API) or standalone (replication API).
2. For SolrCloud, auto-discovers collections via `admin/collections?action=LIST` (you can override with `--solr-collections`).
3. Creates S3 directory markers at `<subpath>/` and `<subpath>/<snapshotName>/` (zero-byte objects with `content-type: application/x-directory`). Solr's `S3BackupRepository` `HeadObject`-checks these paths before accepting a backup.
4. Calls `admin/collections?action=BACKUP` once per collection, using `location=<subpath>/<snapshotName>` and `name=<collection>` so each collection lands under a shared snapshot directory.
5. Polls `REQUESTSTATUS` per collection until all complete.

Steps 3–5 only work because steps 1–5 of [Customer prerequisites](#customer-prerequisites-solr-side) are in place.

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
| `ClassNotFoundException: org.apache.solr.s3.S3BackupRepository` in Solr logs | Plugin jar not copied from `/opt/solr/dist/` into `sharedLib` | Redo [step 1](#1-install-the-s3-backup-plugin-on-every-solr-node) on every node, restart |
| `Repository default-s3 not found` | `<backup>` block missing from `solr.xml` in ZK, or nodes not restarted | Redo [step 5](#5-upload-solrxml-to-zookeeper-and-restart-every-solr-node) |
| `specified location s3:///...` (triple slash) | Solr couldn't `HeadObject` the directory marker | Usually a permissions issue — check [step 4](#4-grant-solr-permission-to-write-to-s3) |
| S3 `AccessDenied` in Solr logs | IAM identity on the Solr node can't write the bucket | Fix IAM in [step 4](#4-grant-solr-permission-to-write-to-s3); confirm with `aws s3 ls` from the Solr node |
| Empty or terse `status.msg="found [...] in failed tasks"` | Async task failed; real error is elsewhere in the response | Pull the full `REQUESTSTATUS` JSON, look at the top-level `exception.msg` / `response.*` fields |

### Metadata migration finds 0 items

Common causes:
- Wrong `s3RepoPathUri` — bucket matches but the subpath doesn't match where Solr actually wrote.
- Snapshot didn't complete — check `REQUESTSTATUS` for every collection.
- Wrong snapshot name referenced in `snapshotMigrationConfigs`.

### RFS migrates fewer documents than expected

1. Verify the backup contains all shards:
   ```bash
   aws s3 ls s3://<bucket>/<subpath>/<snapshot>/<collection>/shard_backup_metadata/
   ```
2. Each shard should have a `md_shardN_0.json` file (or `md_shardN_<N>.json` for successive backups — Migration Assistant picks the highest N).
3. Check the coordinator for work item status via `workflow manage`.
