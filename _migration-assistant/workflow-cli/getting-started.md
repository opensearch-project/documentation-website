---
layout: default
title: Using the Workflow CLI
nav_order: 1
parent: Workflow CLI
permalink: /migration-assistant/workflow-cli/getting-started/
---

# Using the Workflow CLI

To run your first migration, load the schema for your version, verify connectivity, run a small pilot, and then run the full workflow.

## Prerequisites

Before you start, ensure that you have fulfilled the following prerequisites:

- Migration Assistant is deployed on Kubernetes or Amazon EKS.
- The source and target clusters are reachable from the cluster.
- Snapshot storage is ready if you plan to run backfill.
- You have created any required basic authentication secrets in the `ma` namespace.

## Step 1: Access the Migration Console

To open a shell in the Migration Console pod, run the following command:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

This guide uses the default Migration Assistant namespace `ma`. If you installed Migration Assistant into a different namespace (using `--namespace <name>` with the bootstrap script or `helm install -n <name>`), replace `ma` with your namespace in all commands.
If you are using Amazon Elastic Kubernetes Service (EKS) in a new shell, refresh your `kubeconfig` first:

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
```
{% include copy.html %}

## Step 2: Confirm the installed version

Confirm the installed version because the workflow schema can change by release:

```bash
console --version
```
{% include copy.html %}

## Step 3: Load the version-matched sample

The `sample --load` command reads the workflow schema for the Migration Assistant release installed in your console pod (`/root/.workflowUser.schema.json`) and writes a starter configuration with the correct field structure for that release. You fill in the actual values in the next step. To load the sample, run the following command:

```bash
workflow configure sample --load
```
{% include copy.html %}

## Step 4: Edit the workflow configuration

To edit the workflow configuration, run the following command:

```bash
workflow configure edit
```
{% include copy.html %}

This command opens the workflow configuration file in your terminal editor (`$EDITOR`, defaults to `vi`). When you save and exit, the CLI validates the YAML against the workflow schema and prompts you to fix any errors.

The following table describes the fields to edit.

| Field | Description |
|:------|:------------|
| `sourceClusters.<name>.endpoint` | The source cluster URL (for example, `https://my-es-cluster:9200`). |
| `sourceClusters.<name>.version` | The engine and version string (for example, `ES 7.10.2`, `OS 2.11.0`, or `SOLR 8.11.2`). |
| `sourceClusters.<name>.authConfig` | The authentication method: `basic` (with `secretName`) or `sigv4` (AWS Signature Version 4 with `region` and `service`). |
| `targetClusters.<name>.endpoint` | The target cluster URL (required). |
| `targetClusters.<name>.authConfig` | The authentication method for the target (same options as source). |
| `sourceClusters.<name>.snapshotInfo` | The Amazon S3 repository and snapshot configuration (required for backfill). |

The migration pattern depends on which top-level configuration sections are present in the YAML file:

- **Backfill only**: Add a `snapshotMigrationConfigs` section. Do not add a `traffic` section.
- **Capture and Replay only**: Add a `traffic` section with `proxies` and `replayers`. Do not add a `snapshotMigrationConfigs` section.
- **Both (zero-downtime)**: Add both `snapshotMigrationConfigs` and `traffic` sections.

The minimum required fields for a backfill-only migration are `sourceClusters` (with `version` and `snapshotInfo`), `targetClusters` (with `endpoint`), and `snapshotMigrationConfigs` (with `fromSource`, `toTarget`, and `perSnapshotConfig`).
{: .note }

For an interactive reference of all available fields, their types, defaults, and descriptions, see the [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/). For complete configuration examples, see the [Playbooks]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/).

## Step 5 (Optional): Create authentication secrets

If your source or target requires basic authentication, create Kubernetes secrets for the credentials. To create a source credentials secret, run the following command:

```bash
kubectl create secret generic source-credentials \
  --from-literal=username=<SOURCE_USER> \
  --from-literal=password=<SOURCE_PASSWORD> \
  -n ma
```
{% include copy.html %}

To create a target credentials secret, run the following command:

```bash
kubectl create secret generic target-credentials \
  --from-literal=username=<TARGET_USER> \
  --from-literal=password=<TARGET_PASSWORD> \
  -n ma
```
{% include copy.html %}

Reference those secret names in `authConfig.basic.secretName` in your workflow configuration.

## Step 6: Verify connectivity

To verify that the Migration Console can reach both the source and target clusters, run the following command:

```bash
console clusters connection-check
```
{% include copy.html %}

By default, this command verifies both the source and target clusters. To verify a single cluster, run one of the following commands:

```bash
console clusters connection-check --cluster source
console clusters connection-check --cluster target
```
{% include copy.html %}

For a direct API verification, run the following command:

```bash
console clusters curl source /
console clusters curl target /
```
{% include copy.html %}

The path is a positional argument---no `--` separator is needed. Add `-X POST --json '{...}'` for write operations.

If any connectivity verification fails, resolve the connectivity or authentication issue before proceeding to the next step.

## Step 7 (Optional): Verify AWS identity

If your source or target uses AWS Signature Version 4 authentication for Amazon OpenSearch Service or Amazon OpenSearch Serverless:

- On EKS, verify that pod identity is working from the console pod.
- On generic Kubernetes, make sure AWS credentials exist for both the console pod and the workflow executor pods.

To verify your AWS identity from the console pod, run the following command:

```bash
aws sts get-caller-identity
```
{% include copy.html %}

If identity verification fails, or if `console clusters connection-check` succeeds but the workflow later fails with 401 or 403, resolve the authentication issue before proceeding to the next step. The usual cause is that only the console pod has credentials and the workflow executor pods do not.
{: .warning }

## Step 8: Run a pilot migration

Use a small allow list or a representative subset before you attempt the full migration to identify mapping issues, authentication issues, and throughput problems early. To submit the pilot workflow, run the following command:

```bash
workflow submit
```
{% include copy.html %}

To monitor progress and approve any gated steps, run the following command:

```bash
workflow manage
```
{% include copy.html %}

## Step 9: Validate the pilot migration

Before you expand scope, verify document counts and basic behavior on the target by running the following commands:

```bash
console clusters cat-indices
console clusters curl target /<index>/_count
console clusters curl target /<index>/_search?size=5&pretty
```
{% include copy.html %}

If you are migrating applications with live traffic, validate representative queries against the target.

## Step 10: Run the full migration

After the pilot migration succeeds, widen the configuration to the full index set and submit the workflow again by running the following commands:

```bash
workflow configure edit
workflow submit
workflow manage
```
{% include copy.html %}

## Troubleshooting failures

If a workflow step fails, use the following commands to inspect the logs:

```bash
workflow status
workflow log all
workflow log all --follow
```
{% include copy.html %}

If you need to fix the configuration and resubmit, run the following commands:

```bash
workflow configure edit
workflow submit
```
{% include copy.html %}

The `workflow submit` command automatically stops and replaces an existing workflow with the same name, so no manual removal is required between runs.

If a previous run left orphaned migration custom resource definitions (CRDs) (for example, after a partial failure or a manual `kubectl delete`), use `workflow reset` instead of deleting Argo workflows directly:

```bash
workflow reset                  # interactive — lists CRDs and prompts before delete
workflow reset migration-foo    # delete a specific resource by name
workflow reset --all            # delete everything (capture proxies are protected — add --include-proxies to also remove them)
workflow reset --all --delete-storage   # also remove Kafka PVCs
```
{% include copy.html %}

## Quick command sequence

The following commands summarize the complete workflow from console access through submission:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
console --version
workflow configure sample --load
workflow configure edit
console clusters connection-check
workflow submit
workflow manage
```
{% include copy.html %}

## Next steps

For more information, see the following resources:

- Use a [playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/) if you want an opinionated migration path.
- Read [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/) if connectivity, authentication, or workflow steps fail.
