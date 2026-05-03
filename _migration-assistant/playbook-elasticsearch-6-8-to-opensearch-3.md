---
layout: default
title: "Elasticsearch 6.8 → OpenSearch 3.5"
nav_order: 1
parent: Playbooks
permalink: /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/
redirect_from:
  - /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3-kubernetes/
---

# Playbook: Elasticsearch 6.8 to OpenSearch 3.5

This playbook is written for someone who wants the safest path from a self-managed Elasticsearch 6.8 cluster to OpenSearch 3.5 without having to invent the migration plan.

It assumes:

- your source cluster already exists
- your target cluster already exists
- Migration Assistant is already deployed
- you will run the migration from the Migration Console

If you are on AWS, deploy Migration Assistant on Amazon EKS unless you already operate a self-managed Kubernetes platform. EKS gives you pod identity, snapshot helpers, private image support, and CloudWatch integration so you can focus on the migration instead of the AWS plumbing.

## Choose the migration path first

Pick one of these before you touch the workflow:

- **Backfill only**: easiest path, recommended if you can pause writes during cutover
- **Backfill plus capture and replay**: use this if you need near-zero downtime

If you can tolerate a write pause, choose **backfill only**. It is the simplest and lowest-risk option.
{: .note }

## Step 1: Confirm the path is supported

Check [Is Migration Assistant right for you?]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/) and [Assessment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/).

You are specifically looking for:

- Elasticsearch 6.8 as a supported source
- OpenSearch 3.5 as a supported target
- any breaking changes that require mapping cleanup or special handling

## Step 2: Prepare for Elasticsearch 6.8 mapping-type cleanup

Elasticsearch 6.8 can still contain multiple mapping types per index. OpenSearch 3.5 does not support that model.

That means metadata migration is not just a copy step. It may need to transform type wrappers and handle multi-type indexes explicitly.

Before you migrate:

- review [Transform type mappings]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/)
- review [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/)
- plan to run a pilot on a small allowlist first

## Step 3: Prepare the source cluster for snapshot-based backfill

Backfill requires the source to write a snapshot that Migration Assistant can read.

### Required source-side checks

- the source cluster is reachable from the Kubernetes or EKS cluster
- you know the source endpoint
- you know the source authentication method
- Elasticsearch 6.8 has the `repository-s3` plugin installed
- the snapshot repository can write to the S3 bucket you plan to use

### Verify the `repository-s3` plugin

```bash
curl http://<SOURCE_HOST>:9200/_cat/plugins?v
```
{% include copy.html %}

If `repository-s3` is missing, stop here and install it on the source before continuing.

### Register or verify the snapshot repository

```bash
curl -X PUT "http://<SOURCE_HOST>:9200/_snapshot/migration-repo" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "s3",
    "settings": {
      "bucket": "<SNAPSHOT_BUCKET>",
      "region": "<AWS_REGION>",
      "base_path": "es68-migration"
    }
  }'
```
{% include copy.html %}

Then verify the repository:

```bash
curl -X POST "http://<SOURCE_HOST>:9200/_snapshot/migration-repo/_verify?pretty"
```
{% include copy.html %}

If verification fails, fix the source cluster's S3 access before moving on.

## Step 4: Prepare the target cluster

Make sure all of the following are true:

- the target is reachable from the Migration Assistant cluster
- you know the target endpoint
- you know whether the target uses basic auth or SigV4
- you have permissions to create indexes, mappings, and write documents

If the target is Amazon OpenSearch Service with fine-grained access control, the IAM role used by Migration Assistant must be mapped with sufficient permissions.

On EKS, this is usually the role associated with the `migration-console-access-role` and `argo-workflow-executor` service accounts.

## Step 5: Access the Migration Console

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Then confirm the installed version:

```bash
console --version
```
{% include copy.html %}

Always use the sample config for the exact version you are running.

## Step 6: Create secrets if you use basic auth

If the source or target uses basic auth, create the secrets in the `ma` namespace before editing the workflow.

```bash
kubectl create secret generic source-credentials \
  --from-literal=username=<SOURCE_USER> \
  --from-literal=password=<SOURCE_PASSWORD> \
  -n ma
```
{% include copy.html %}

```bash
kubectl create secret generic target-credentials \
  --from-literal=username=<TARGET_USER> \
  --from-literal=password=<TARGET_PASSWORD> \
  -n ma
```
{% include copy.html %}

If the target uses SigV4 instead of basic auth:

- on EKS, verify the console pod can assume the expected IAM role
- on generic Kubernetes, make sure AWS credentials exist for both the console pod and the workflow executor pods

Quick EKS check:

```bash
aws sts get-caller-identity
```
{% include copy.html %}

## Step 7: Load the sample workflow and fill in your environment

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

At minimum, set:

- source endpoint, version, and auth
- target endpoint and auth
- snapshot repository name and S3 path
- metadata migration options required for Elasticsearch 6.8
- the index allowlist for your pilot run

Use the version strings shown by your sample configuration. For Elasticsearch 6.8 sources, releases commonly expect a value such as `ES 6.8`.

## Step 8: Build the workflow in two passes

Do not start with the full cluster.

### Pilot pass

Configure a small allowlist or representative subset of indexes. The goal is to prove:

- connectivity
- auth
- snapshot creation
- metadata migration behavior
- document backfill behavior

### Full pass

After the pilot succeeds, widen the allowlist to the full data set.

## Step 9: Run a connection check before submitting

```bash
console clusters connection-check
console clusters curl source -- "/"
console clusters curl target -- "/"
```
{% include copy.html %}

If any of these fail, stop and fix the issue before running a workflow.

## Step 10: Run the pilot workflow

```bash
workflow submit
workflow manage
```
{% include copy.html %}

Use `workflow manage` to watch progress, inspect logs, and approve any gated steps.

## Step 11: Validate the pilot

Do not expand scope until the pilot looks correct.

Check:

- index creation on the target
- document counts
- representative queries
- any mapping transformations required by Elasticsearch 6.8

Useful commands:

```bash
console clusters curl source -- "/_cat/indices?v"
console clusters curl target -- "/_cat/indices?v"
```
{% include copy.html %}

## Step 12: Run the full migration

At this point, choose the cutover sequence that matches your migration path.

### Backfill only

Use this if you can pause writes during cutover.

1. Pause writes to the source application.
2. Update the workflow config from the pilot scope to the full scope.
3. Submit the workflow.
4. Wait for snapshot, metadata migration, and backfill to complete.
5. Validate the target.
6. Switch application traffic to the target.

### Backfill plus capture and replay

Use this if you need near-zero downtime.

1. Start capture first so writes are recorded before backfill begins.
2. Route client traffic to the capture proxy.
3. Submit the full workflow.
4. Let snapshot, metadata migration, and backfill complete while traffic continues to be captured.
5. Start replay and wait for the target to catch up.
6. Validate the target.
7. Switch application traffic from the capture proxy to the target.

For this path, replay duration depends on how much traffic accumulated during backfill and the `speedupFactor` you configure for the replayer.

## Step 13: Validate before cutover

Before you consider the migration complete, verify:

- the expected indexes exist on the target
- document counts are in line with the source
- representative reads behave as expected
- application-level smoke tests pass

If the target is Amazon OpenSearch Service or Serverless, also validate that the IAM and auth model works for the production clients after cutover.

## Step 14: Keep a rollback window, then clean up

Do not immediately tear down Migration Assistant or delete artifacts.

Wait until:

- the target has been stable under real traffic
- the application team is comfortable with the cutover
- you no longer need to replay or compare against the source

Only then remove the Migration Assistant infrastructure and snapshot artifacts.

## Minimal auth examples

Use these only as direction. Your real config should always start from `workflow configure sample --load`.

### Basic-auth source snippet

```json
"sourceClusters": {
  "source": {
    "endpoint": "http://<SOURCE_HOST>:9200",
    "version": "ES 6.8",
    "authConfig": {
      "basic": {
        "secretName": "source-credentials"
      }
    }
  }
}
```
{% include copy.html %}

### SigV4 target snippet

```json
"targetClusters": {
  "target": {
    "endpoint": "https://<TARGET_ENDPOINT>",
    "authConfig": {
      "sigv4": {
        "service": "es",
        "region": "<AWS_REGION>"
      }
    }
  }
}
```
{% include copy.html %}

Use `aoss` instead of `es` when the target is OpenSearch Serverless.

## If you get stuck

- [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
- [Amazon OpenSearch Service to Serverless playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/)
