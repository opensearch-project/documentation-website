---
layout: default
title: "Elasticsearch 6.8 → OpenSearch 3.5 on GCP"
nav_order: 2
parent: Playbooks
permalink: /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3-gcp/
---

# Playbook: Elasticsearch 6.8 to OpenSearch 3.5 on GCP (GKE)

This playbook is a concrete runbook for migrating a self-managed Elasticsearch 6.8 cluster to an OpenSearch 3.5 cluster on Google Cloud Platform (GCP), with Migration Assistant running on Google Kubernetes Engine (GKE). The source and target are reached over the migration cluster's virtual private cloud (VPC) network, and snapshots are stored in Google Cloud Storage.

This pattern applies when you run search infrastructure on GCP and want a repeatable, snapshot-based migration with optional zero-downtime capture and replay.

The playbook is end-to-end. It covers source preparation, workflow configuration, a pilot migration, the full migration, validation, cutover, and removal. It assumes Migration Assistant is already deployed on GKE; if it is not, see [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/).

## Example placeholders

Replace the following placeholders with values from your environment.

| Placeholder | Meaning |
|:------------|:--------|
| `<PROJECT_ID>` | GCP project ID hosting the migration environment |
| `<REGION>` | GCP region, such as `us-central1` |
| `<CLUSTER_NAME>` | GKE cluster name (from `terraform output -raw cluster_name`) |
| `<SOURCE_ENDPOINT>` | Elasticsearch endpoint reachable from the migration VPC |
| `<SOURCE_USERNAME>`, `<SOURCE_PASSWORD>` | Source cluster credentials |
| `<TARGET_ENDPOINT>` | OpenSearch 3.5 endpoint reachable from the migration VPC |
| `<TARGET_USERNAME>`, `<TARGET_PASSWORD>` | Target cluster credentials |
| `<PILOT_INDEX_NAME>` | A small, noncritical index for the pilot run |

The Cloud Storage bucket for snapshots is created by the GKE Terraform module and exposed to the workflow through the `migration-config` config map, so you do not set it manually. This playbook reads it as `<BUCKET_NAME>`.
{: .note }

## Estimated timing

The following table provides estimated durations for each phase of the migration.

| Phase | Typical duration |
|:------|:-----------------|
| Source preparation (plugin, Cloud Storage access, snapshot repo) | 15 to 25 minutes |
| Deploy Migration Assistant on GKE | 15 to 25 minutes |
| Build configuration and test connectivity | 5 to 10 minutes |
| Pilot migration | 15 to 20 minutes |
| Full backfill-only migration | Depends on data size and target ingest capacity |
| Full zero-downtime migration | Backfill duration plus replay catch-up time |

For zero-downtime migrations, replay duration depends on the volume of traffic accumulated during backfill and the `speedupFactor` configured for the Replayer. A typical starting value is `1.5` to `2.0`. Monitor the target cluster to confirm it can sustain the replay rate.

## Before you start

In addition to the [general playbook prerequisites]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/), verify the following before starting the migration.

### Source cluster requirements

Your source cluster must meet all of the following requirements:

- It is reachable from the VPC where Migration Assistant runs.
- You know the source endpoint and authentication method.
- It can write snapshots to Google Cloud Storage.
- It contains the `repository-gcs` plugin. Elasticsearch 8.0 and later and OpenSearch bundle Cloud Storage support, but Elasticsearch 6.8 requires the plugin to be installed on every node.

If the source uses self-signed certificates, plan to set `allowInsecure: true` in the workflow configuration.

### Target cluster requirements

Your OpenSearch 3.5 cluster must meet all of the following requirements:

- It already exists.
- It is reachable from the migration VPC.
- You know the target endpoint and authentication method.

### Infrastructure requirements

The following infrastructure is required:

- Migration Assistant deployed on GKE. See [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/).
- The `gcloud` CLI and `kubectl`, authenticated for the migration cluster.
- If the source or target must be reached over private connectivity, see [Private networking on GKE]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/).

## Step 1: Choose the migration style

Select one of the following migration approaches before configuring the workflow.

### Option A: Planned downtime

For a planned downtime migration, follow these steps:

1. Pause writes to Elasticsearch.
2. Create a snapshot.
3. Migrate metadata.
4. Backfill documents.
5. Validate the target.
6. Point clients to OpenSearch.

If you are unsure which approach to select, use planned downtime because it involves fewer components and lower risk.
{: .note }

### Option B: Zero downtime

For a zero-downtime migration, follow these steps:

1. Start the capture.
2. Route clients to the capture proxy.
3. Create a snapshot.
4. Migrate metadata.
5. Backfill documents.
6. Replay captured traffic until the target catches up.
7. Validate the target.
8. Switch clients to OpenSearch.

If your application depends on auto-generated document IDs, test Capture and Replay thoroughly before selecting the zero-downtime approach. Auto-generated IDs are not preserved during replay.

## Step 2: Prepare the source cluster

### Install the repository-gcs plugin

Migration Assistant uses snapshots for backfill, so the source must support Cloud Storage snapshots. Verify the current plugin state:

```bash
curl -sk -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> https://<SOURCE_ENDPOINT>:9200/_cat/plugins?v
```
{% include copy.html %}

If `repository-gcs` is missing, install it on every source node and restart:

```bash
bin/elasticsearch-plugin install --batch repository-gcs
```
{% include copy.html %}

If your source runs in Kubernetes, a common pattern is to install the plugin using an init container so it persists across pod restarts. For general information, see the Elasticsearch documentation for the `repository-gcs` plugin.

### Grant the source access to Cloud Storage

The source cluster writes snapshot files directly to the Cloud Storage bucket, so it needs credentials with write access to that bucket. Configure the `repository-gcs` client credentials on the source according to your environment (for example, a service account key added to the Elasticsearch keystore). Grant that identity object read and write access (`roles/storage.objectAdmin`) on the migration bucket.

### Register a snapshot repository

Read the bucket name that the GKE Terraform module provisioned, then register it as a snapshot repository on the source. From a shell with access to the migration cluster, read the bucket name from the config map:

```bash
kubectl get configmap migration-config -n ma \
  -o jsonpath='{.data.bucket_name}'
```
{% include copy.html %}

Register the repository on the source cluster (this is the same `gcs` repository body the workflow expects):

```bash
curl -sk -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  -X PUT "https://<SOURCE_ENDPOINT>:9200/_snapshot/migration" \
  -H "Content-Type: application/json" \
  -d '{"type":"gcs","settings":{"bucket":"<BUCKET_NAME>","base_path":"snapshots"}}'
```
{% include copy.html %}

A successful response returns `{"acknowledged":true}`.

## Step 3: Connect to the Migration Console and create secrets

Open a shell in the Migration Console pod:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Create Kubernetes secrets for the source and target credentials, which the workflow references by name:

```bash
kubectl create secret generic source-credentials \
  --from-literal=username=<SOURCE_USERNAME> \
  --from-literal=password=<SOURCE_PASSWORD> -n ma

kubectl create secret generic target-credentials \
  --from-literal=username=<TARGET_USERNAME> \
  --from-literal=password=<TARGET_PASSWORD> -n ma
```
{% include copy.html %}

## Step 4: Build the workflow configuration

Load the version-matched sample and edit it:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

The following configuration is the backfill-only (planned downtime) workflow. It sets the source and target endpoints, references the credential secrets, and points the snapshot repository at the Cloud Storage bucket:

```yaml
sourceClusters:
  source:
    endpoint: https://<SOURCE_ENDPOINT>:9200
    allowInsecure: true
    version: ES 6.8.23
    authConfig:
      basic:
        secretName: source-credentials
    snapshotInfo:
      repos:
        migration:
          repoPathUri: gs://<BUCKET_NAME>/snapshots
      snapshots:
        snap1:
          config:
            createSnapshotConfig: {}
          repoName: migration
targetClusters:
  target:
    endpoint: https://<TARGET_ENDPOINT>:9200
    allowInsecure: true
    authConfig:
      basic:
        secretName: target-credentials
snapshotMigrationConfigs:
  - fromSource: source
    toTarget: target
    perSnapshotConfig:
      snap1:
        - metadataMigrationConfig: {}
          documentBackfillConfig:
            podReplicas: 1
            maxConnections: 50
            documentsPerBulkRequest: 10000
```

For a **zero-downtime** migration, add a `traffic` section with a capture proxy and a replayer. On GKE, the capture proxy's load balancer is internal by default, so its ingress stays on the VPC network:

```yaml
traffic:
  proxies:
    capture-proxy:
      source: source
      proxyConfig:
        listenPort: 9201
        podReplicas: 2
  replayers:
    replay1:
      fromProxy: capture-proxy
      toTarget: target
      dependsOnSnapshotMigrations:
        - source: source
          snapshot: snap1
      replayerConfig:
        speedupFactor: 2
        # Cap in-flight requests so a throttled target cannot drive the
        # replayer out of memory. Raise gradually while watching the target.
        maxConcurrentRequests: 500
```

Set `version` to your exact source version. Use `allowInsecure: true` only when the source or target uses self-signed certificates.
{: .note }

When you save and exit, the CLI validates the configuration against the workflow schema and prompts you to fix any errors.

## Step 5: Test connectivity

Confirm that the Migration Console can reach both clusters:

```bash
console clusters connection-check
```
{% include copy.html %}

Resolve any connectivity or authentication failure before continuing.

## Step 6: Run the pilot migration

Run a small pilot before the full migration to catch mapping, authentication, and throughput issues early. Restrict the pilot to a small, noncritical index (`<PILOT_INDEX_NAME>`), then submit and monitor:

```bash
workflow submit
workflow manage
```
{% include copy.html %}

## Step 7: Validate the pilot migration

Compare document counts and sample a few documents on the target:

```bash
console clusters cat-indices
console clusters curl target /<PILOT_INDEX_NAME>/_count
console clusters curl target /<PILOT_INDEX_NAME>/_search?size=5&pretty
```
{% include copy.html %}

## Step 8: Run the full migration

After the pilot succeeds, widen the configuration to the full index set and submit again.

### Planned downtime path

1. Pause writes to the source.
2. Run `workflow submit` and monitor with `workflow manage`.
3. Wait for the workflow to reach `Succeeded`.
4. Continue to validation.

### Zero-downtime path

1. Confirm capture is running and clients are routed through the capture proxy so live writes are recorded.
2. Run `workflow submit` and monitor with `workflow manage`.
3. After backfill completes, the Replayer drains captured traffic to the target. Monitor until the target catches up to live and the document counts stabilize.
4. Continue to validation.

For large migrations, consider applying target-side write tuning during the load: increase primary shards on hot indices, and set `refresh_interval: -1` and `number_of_replicas: 0` while loading, then restore them afterward. Watch the target's write thread pool for rejections and lower replayer concurrency if rejections appear.
{: .note }

## Step 9: Validate and switch traffic

Validate the target before switching clients:

```bash
console clusters cat-indices
console clusters curl target /_cat/count?h=count
```
{% include copy.html %}

Confirm per-index document counts match between source and target. When you are confident, switch clients to the OpenSearch target by updating DNS, load balancer configuration, or application connection strings.

## Step 10: Keep the source available as a fallback

Keep the source cluster available as a rollback option until production traffic has been stable on the target (24 to 72 hours is a common window).

## Step 11: Remove the migration infrastructure

Once you no longer need Migration Assistant for rollback, replay, or comparison, remove it. Do not remove it immediately after cutover. For the readiness checklist and removal commands, see [Removing migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/).

## Troubleshooting

### Snapshot registration fails with "repository type [gcs] does not exist"

The source is missing the `repository-gcs` plugin. Install it on every source node and restart (see [Step 2](#step-2-prepare-the-source-cluster)).

### Source cannot write to the bucket

Confirm the source's `repository-gcs` client credentials are configured and that the identity has object read and write access to the migration bucket.

### Pilot succeeds from the console but the workflow fails

The Migration Console and the workflow executor pods can have different network or identity access. Confirm both can reach the source and target and that any required credentials are available to both.

## Related documentation

- [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/)
- [Private networking on GKE]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/)
- [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/)
- [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
