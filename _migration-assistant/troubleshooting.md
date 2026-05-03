---
layout: default
title: Troubleshooting
nav_order: 70
permalink: /migration-assistant/troubleshooting/
---

# Troubleshooting

Start with the simplest question: is this a deployment problem, an authentication problem, or a workflow problem?

These commands give you the fastest first signal:

```bash
console --version
console clusters connection-check
workflow status
workflow output
kubectl get pods -n ma
```
{% include copy.html %}

## If the platform itself is not healthy

### Pods are not starting

```bash
kubectl describe pod <POD_NAME> -n ma
kubectl logs <POD_NAME> -n ma
```
{% include copy.html %}

Common causes:

- image pull failures because the chart was installed without valid `images.*` overrides
- missing secrets
- insufficient permissions
- pending pods caused by missing capacity or a broken StorageClass

### Pods are pending

```bash
kubectl get events -n ma --sort-by='.lastTimestamp'
kubectl describe node <NODE_NAME>
```
{% include copy.html %}

On generic Kubernetes, this often means your cluster does not have enough CPU, memory, or storage. On EKS, it can also mean your node group or Karpenter setup needs attention.

## If connectivity checks fail

Start from the Migration Console:

```bash
console clusters connection-check
console clusters curl source -- "/"
console clusters curl target -- "/"
```
{% include copy.html %}

### Common causes

- source or target security groups do not allow traffic from the EKS cluster
- DNS does not resolve from inside the cluster
- the endpoint is wrong
- TLS verification fails and `allowInsecure` is not set for a self-signed environment

Quick DNS test from the console pod:

```bash
kubectl exec -it migration-console-0 -n ma -- nslookup <CLUSTER_ENDPOINT>
```
{% include copy.html %}

## If authentication fails

Authentication issues usually show up as `401`, `403`, or "connection check passed from the console but workflow failed later."

### Basic auth

Verify that the secret exists in the `ma` namespace and contains the expected keys:

```bash
kubectl get secret <SECRET_NAME> -n ma
kubectl get secret <SECRET_NAME> -n ma -o jsonpath='{.data}' | jq 'keys'
```
{% include copy.html %}

Your workflow config must point to that same secret name in `authConfig.basic.secretName`.

### SigV4 on Amazon EKS

EKS is designed to make this easy. The solution stack associates IAM roles with the service accounts used by the console pod and the workflow executor pods.

Check the identity inside the console pod:

```bash
kubectl exec -it migration-console-0 -n ma -- aws sts get-caller-identity
```
{% include copy.html %}

If the target is Amazon OpenSearch Service with fine-grained access control, make sure the relevant IAM role is mapped with sufficient permissions on the domain.

Use `es` as the SigV4 service for Amazon OpenSearch Service domains and `aoss` for OpenSearch Serverless collections.
{: .note }

### SigV4 on generic Kubernetes

This is the most common source of confusion.

Generic Kubernetes does not automatically create AWS pod identity for Migration Assistant. That means:

- the `migration-console-access-role` pod needs credentials for console commands
- the `argo-workflow-executor` pods need credentials for the real migration steps

If the console can authenticate but the workflow fails later, the problem is usually that only the console pod has credentials.

The developer-oriented local AWS credential mount is not a production credential strategy.
{: .warning }

### Service account name mismatch

The console pod does not run under a service account named `migration-console`. The chart uses `migration-console-access-role`.

If you are inspecting service accounts or troubleshooting identity, check:

```bash
kubectl get serviceaccount -n ma
kubectl describe serviceaccount migration-console-access-role -n ma
kubectl describe serviceaccount argo-workflow-executor -n ma
```
{% include copy.html %}

### mTLS

Do not plan around mTLS unless you have validated it in the exact version you are running. The workflow path is centered on basic auth and SigV4.

## If the workflow fails after submission

```bash
workflow status
workflow output
workflow output --follow
```
{% include copy.html %}

### Workflow already exists

```bash
kubectl delete workflow migration-workflow -n ma
workflow submit
```
{% include copy.html %}

### Approval gate is blocking progress

Open the interactive UI:

```bash
workflow manage
```
{% include copy.html %}

Or approve the step directly:

```bash
workflow approve <STEP_NAME>
```
{% include copy.html %}

## If snapshot creation fails

The most common cause for Elasticsearch sources is a missing `repository-s3` plugin.

Check the source cluster:

```bash
curl http://<SOURCE_HOST>:9200/_cat/plugins?v
```
{% include copy.html %}

Also verify:

- the source cluster can write to the snapshot bucket
- the repository is registered correctly
- the bucket region and path match the workflow config

## If metadata migration fails

Common causes:

- incompatible mappings across major versions
- Elasticsearch 6.x mapping-type cleanup issues
- target-side settings rejected by the newer version

Use a pilot allowlist first so these failures show up on a small slice of data instead of the whole cluster.

## If document backfill is too slow or unstable

Check:

- target cluster ingest capacity
- available disk space on the target
- RFS worker replica count
- pod memory limits for large documents

Backfill reads from snapshots, so adding RFS workers does not increase load on the source cluster. It mainly changes how quickly the target is driven.

## If `console` or `workflow` is not in `PATH`

Some console images install the binaries under `/.venv/bin`.

```bash
export PATH="/.venv/bin:$PATH"
/.venv/bin/console --version
/.venv/bin/workflow configure sample
```
{% include copy.html %}

## If you need more data to debug

Collect:

- `console --version`
- `workflow status`
- `workflow output`
- `kubectl describe pods -n ma`
- source and target version numbers
- exact authentication mode in use

If you open a GitHub issue, include whether you are running on generic Kubernetes or EKS, because that changes the likely root cause for identity and platform issues.
