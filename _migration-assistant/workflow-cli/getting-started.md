---
layout: default
title: Getting started
nav_order: 1
parent: Workflow CLI
permalink: /migration-assistant/workflow-cli/getting-started/
---

# Getting started with the Workflow CLI

This guide shows the shortest safe path to your first migration. The goal is simple: load the right schema for your version, prove connectivity, run a small pilot, and only then run the full workflow.

## Before you start

Make sure all of the following are true:

- Migration Assistant is already deployed on Kubernetes or Amazon EKS
- the source and target clusters are reachable from the cluster
- snapshot storage is ready if you plan to run backfill
- any basic-auth secrets you need can be created in the `ma` namespace

## Step 1: Access the Migration Console

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

If you are using EKS from a new shell, refresh your kubeconfig first:

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
```
{% include copy.html %}

## Step 2: Confirm the installed version

```bash
console --version
```
{% include copy.html %}

This matters because the workflow schema can change by release.

## Step 3: Load the version-matched sample

```bash
workflow configure sample --load
```
{% include copy.html %}

This gives you the safest starting point for your current version.

## Step 4: Edit the workflow configuration

```bash
workflow configure edit
```
{% include copy.html %}

Fill in the fields that describe your migration:

- source endpoint, version, and authentication
- target endpoint and authentication
- snapshot repository details if you are running backfill
- the migration pattern you actually want: backfill only, capture and replay only, or both

Do not start by editing every possible field. Start with the minimum required fields for your path.
{: .note }

## Step 5: Create secrets if you use basic auth

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

Reference those names in `authConfig.basic.secretName`.

## Step 6: Verify connectivity before you submit anything

```bash
console clusters connection-check
```
{% include copy.html %}

If you want a direct API check, run:

```bash
console clusters curl source -- "/"
console clusters curl target -- "/"
```
{% include copy.html %}

If these checks fail, stop and fix connectivity or authentication first. Do not start a workflow yet.

## Step 7: Verify AWS identity if you use SigV4

If your source or target uses Amazon OpenSearch Service or OpenSearch Serverless:

- on EKS, verify that pod identity is working from the console pod
- on generic Kubernetes, make sure AWS credentials will exist for both the console pod and the workflow executor pods

Quick console check:

```bash
aws sts get-caller-identity
```
{% include copy.html %}

If `console clusters connection-check` works in the console but the workflow later fails with 401 or 403, the usual cause is that only the console pod has credentials and the workflow executor pods do not.
{: .warning }

## Step 8: Run a pilot migration first

Use a small allowlist or a representative subset before you attempt the full migration. This is the easiest way to catch mapping issues, auth issues, and throughput problems early.

```bash
workflow submit
workflow manage
```
{% include copy.html %}

Use `workflow manage` to watch the run and approve any gated steps.

## Step 9: Validate the pilot

Check counts and basic behavior on the target before you expand scope:

```bash
console clusters curl source -- "/_cat/indices?v"
console clusters curl target -- "/_cat/indices?v"
```
{% include copy.html %}

If you are migrating applications with live traffic, also validate representative queries against the target.

## Step 10: Run the real migration

After the pilot succeeds, widen the configuration to the full index set and submit again.

```bash
workflow configure edit
workflow submit
workflow manage
```
{% include copy.html %}

## Step 11: Use logs if anything fails

```bash
workflow status
workflow output
workflow output --follow
```
{% include copy.html %}

If you need to fix the config and try again:

```bash
workflow configure edit
workflow submit
```
{% include copy.html %}

## Quick command sequence

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

## What to do next

- Use a [playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/) if you want an opinionated migration path.
- Read [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/) if connectivity, auth, or workflow steps fail.
