---
layout: default
title: Solr backfill guide
nav_order: 2
parent: Solr migration
permalink: /migration-assistant/solr-migration/solr-backfill-guide/
---

# Solr backfill guide

This page walks through migrating documents from Apache Solr 8.x to OpenSearch using the snapshot-based backfill workflow. For the overall Solr migration architecture (including the Transformation Shim for query traffic), see [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/).

## SolrCloud vs. standalone Solr

Migration Assistant supports both deployment modes and auto-detects which you're running (it probes the Collections API first, falls back to Core Admin). The customer-side prerequisites differ in a few places — this table summarizes; individual steps below call out mode-specific instructions.

| Aspect | SolrCloud | Standalone Solr |
|:-------|:----------|:----------------|
| Backup unit | Collection | Core |
| Solr backup API MA calls | `admin/collections?action=BACKUP` | `/solr/<core>/replication?command=backup` |
| Poll API MA calls | `admin/collections?action=REQUESTSTATUS` | `/solr/<core>/replication?command=details` |
| Where `solr.xml` lives | ZooKeeper | Filesystem (typically `/var/solr/data/solr.xml`) |
| Restart scope | Roll every node in the cluster | Restart the single Solr node |
| MA workflow arg | `solrCollections: [name1, name2]` | Same field, value is core names |

S3 plugin install (step 1), `solr.xml` contents (step 2), `SOLR_OPTS` (step 3), and IAM (step 4) are **identical** in both modes. Only step 5 (how `solr.xml` is published and how nodes are restarted) differs.

## Who does what

The snapshot is produced by **your Solr cluster** (Solr's own S3 backup plugin writes the backup files to S3) and consumed by **Migration Assistant** (reads those files and bulk-indexes into OpenSearch). Migration Assistant cannot reach into your Solr cluster to install plugins or change its configuration — those steps are yours. All customer-side prerequisites must be in place before you run the `create snapshot` step of the workflow.

| Responsibility | Owner | When |
|:---------------|:------|:-----|
| Install the Solr S3 backup plugin on every Solr node | You | Before running Migration Assistant |
| Configure `solr.xml` with an `<backup>` repository and publish it (ZooKeeper for SolrCloud, filesystem for standalone) | You | Before running Migration Assistant |
| Restart Solr so it picks up the new `solr.xml` (every node for SolrCloud, the single node for standalone) | You | Before running Migration Assistant |
| Create the S3 bucket and grant Solr `PutObject` / `GetObject` / `ListBucket` | You | Before running Migration Assistant |
| Grant the Migration Assistant pods read access to the same bucket | You | During deployment |
| Trigger `BACKUP` on every collection (SolrCloud) or core (standalone) and poll until complete. For SolrCloud, also create the S3 directory markers Solr's `S3BackupRepository` checks for. | Migration Assistant (`create snapshot`) | Workflow step |
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

### 5. Publish `solr.xml` and restart Solr

How you publish `solr.xml` depends on your deployment mode. The contents from step 2 are identical in both cases.

**SolrCloud**

In SolrCloud mode, `solr.xml` lives in ZooKeeper. Upload the edited file and then roll the nodes so each picks up the new `<backup>` section:

```bash
/opt/solr/bin/solr zk cp <path-to-new-solr.xml> zk:/solr.xml -z <ZK_HOST>:2181
/opt/solr/bin/solr restart -force  # repeat on every node
```
{% include copy.html %}

**Standalone Solr**

Place the edited `solr.xml` on the filesystem (in the Docker image this is `/var/solr/data/solr.xml` — not `/opt/solr/server/solr/solr.xml`, which is silently ignored when Solr starts with `-Dsolr.solr.home=/var/solr/data`) and restart:

```bash
cp <path-to-new-solr.xml> /var/solr/data/solr.xml
/opt/solr/bin/solr restart -force
```
{% include copy.html %}

### Verify the repository before running Migration Assistant

Run a throwaway backup through your Solr deployment. If this succeeds, Migration Assistant will work; if this fails, no amount of workflow tweaking will fix it — the problem is on the Solr side and must be resolved first.

**SolrCloud — Collections API**

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

**Standalone Solr — replication handler**

```bash
# Trigger a backup of one core.
curl "http://<solr-host>:8983/solr/<CORE_NAME>/replication\
?command=backup&repository=s3&location=/preflight-check&name=preflight&wt=json"

# Poll until status=success (the same endpoint returns the latest backup status).
curl "http://<solr-host>:8983/solr/<CORE_NAME>/replication?command=details&wt=json"
```
{% include copy.html %}

Look for `details.backup.status = "success"`. If it says `"failed"` or `"exception"`, the adjacent `details.backup.exception` field has the real error. Same root causes apply as for SolrCloud.

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

1. **Detects the deployment mode** by probing the SolrCloud Collections API; falls back to standalone Core Admin on failure.
2. **Auto-discovers the backup units** — collections in SolrCloud (via `admin/collections?action=LIST`), cores in standalone (via `admin/cores?action=STATUS`). Override with the `solrCollections` workflow field in either mode.
3. **Creates S3 directory markers** at `<subpath>/` and `<subpath>/<snapshotName>/` (zero-byte objects with `content-type: application/x-directory`). Solr's `S3BackupRepository` `HeadObject`-checks these paths before accepting a backup. **SolrCloud only** — Migration Assistant does not create these markers in standalone mode today; if you hit a `specified location` failure there, pre-create the subpath yourself (`aws s3api put-object --bucket <bucket> --key <subpath>/ --content-type application/x-directory`) and rerun. Standalone Solr + S3 is a less-trodden path than SolrCloud + S3 — see Troubleshooting.
4. **Calls Solr's backup API** once per collection or core:
   - SolrCloud: `admin/collections?action=BACKUP&name=<collection>&location=<subpath>/<snapshotName>&repository=s3&async=...` — asynchronous.
   - Standalone: `/solr/<core>/replication?command=backup&name=<snapshotName>&location=<subpath>&repository=s3` — synchronous dispatch, asynchronous execution.
5. **Polls for completion** — `REQUESTSTATUS` per async id (SolrCloud) or `replication?command=details` per core (standalone) — until every unit reports `completed` / `success` or fails.

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
| `Repository default-s3 not found` | `<backup>` block missing from the running `solr.xml` (wrong file, wrong mount path, or nodes not restarted after upload) | Redo [step 5](#5-publish-solrxml-and-restart-solr) |
| `specified location s3:///...` (triple slash) | Solr couldn't `HeadObject` the directory marker | Usually a permissions issue — check [step 4](#4-grant-solr-permission-to-write-to-s3) |
| S3 `AccessDenied` in Solr logs | IAM identity on the Solr node can't write the bucket | Fix IAM in [step 4](#4-grant-solr-permission-to-write-to-s3); confirm with `aws s3 ls` from the Solr node |
| (SolrCloud only) Empty or terse `status.msg="found [...] in failed tasks"` | Async task failed; real error is elsewhere in the response | Pull the full `REQUESTSTATUS` JSON and look at the top-level `exception.msg` / `response.*` fields |
| (Standalone only) `details.backup.status` = `failed` or `exception` | Core-level backup failed | Read `details.backup.exception` in the `replication?command=details` response — this holds the real error |

### Metadata migration finds 0 items

Common causes:
- Wrong `s3RepoPathUri` — bucket matches but the subpath doesn't match where Solr actually wrote.
- Snapshot didn't finish — check `REQUESTSTATUS` for every collection (SolrCloud) or `replication?command=details` on every core (standalone).
- Wrong snapshot name referenced in `snapshotMigrationConfigs`.

### RFS migrates fewer documents than expected

1. Verify the backup contains all shards:
   ```bash
   aws s3 ls s3://<bucket>/<subpath>/<snapshot>/<collection-or-core>/shard_backup_metadata/
   ```
2. Each shard should have a `md_shardN_0.json` file (or `md_shardN_<N>.json` for successive backups — Migration Assistant picks the highest N).
3. Check the coordinator for work item status via `workflow manage`.
