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

If the platform itself is not healthy, work through these checks.

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

On generic Kubernetes, this often means your cluster does not have enough CPU, memory, or storage. On EKS, it can also mean your node group or Karpenter configuration needs attention.

## If connectivity checks fail

Start from the Migration Console:

```bash
console clusters connection-check
console clusters curl source /
console clusters curl target /
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

### Authenticate with AWS Signature Version 4 on Amazon EKS

EKS is designed to make this easy. The solution stack associates IAM roles with the service accounts used by the console pod and the workflow executor pods.

Check the identity inside the console pod:

```bash
kubectl exec -it migration-console-0 -n ma -- aws sts get-caller-identity
```
{% include copy.html %}

If the target is Amazon OpenSearch Service with fine-grained access control, make sure the relevant IAM role is mapped with sufficient permissions on the domain.

Use `es` as the AWS Signature Version 4 service for Amazon OpenSearch Service domains and `aoss` for OpenSearch Serverless collections.
{: .note }

### Authenticate with AWS Signature Version 4 on generic Kubernetes

This is the most common source of confusion.

Generic Kubernetes does not automatically create AWS pod identity for Migration Assistant. That means you must supply AWS credentials to both of these pods separately:

- the Migration Console pod (`migration-console-0`), running under the `migration-console-access-role` service account, needs credentials for console CLI commands
- the Argo workflow executor pods, running under the `argo-workflow-executor` service account, need credentials for the real migration steps

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

### Fine-grained access control: 403 on `cluster:monitor/main`

If authentication succeeds but the cluster returns `403` on operations such as `cluster:monitor/main`, fine-grained access control (FGAC) is enabled and the Migration Assistant identity has no role mapping inside the cluster. Authentication gets you **to** the cluster; FGAC authorizes what you can do **once you are in** — both must be in place.

Map the Migration Assistant identity to `all_access` (or a more scoped role) using the OpenSearch Security API. The API path differs by engine:

- **Elasticsearch 7.x** (Open Distro Security): `/_opendistro/_security/api/rolesmapping/<role>`
- **OpenSearch 1.x and later** (Security plugin): `/_plugins/_security/api/rolesmapping/<role>`

Use `users` for internal accounts and `backend_roles` for identities delivered by the authentication layer — an LDAP or SAML group, or an IAM role ARN when authenticating with AWS Signature Version 4.

Elasticsearch 7.x:

```bash
curl -u <admin-user>:<admin-pass> \
  -H 'Content-Type: application/json' \
  -X PUT "https://<cluster>/_opendistro/_security/api/rolesmapping/all_access" \
  -d '{ "backend_roles": ["<identity>"] }'
```
{% include copy.html %}

OpenSearch 1.x and later:

```bash
curl -u <admin-user>:<admin-pass> \
  -H 'Content-Type: application/json' \
  -X PUT "https://<cluster>/_plugins/_security/api/rolesmapping/all_access" \
  -d '{ "backend_roles": ["<identity>"] }'
```
{% include copy.html %}

On AWS-managed domains that only accept IAM auth (no admin password), you can map the role by temporarily setting the Migration Assistant IAM role as the `master user` through `aws opensearch update-domain-config --advanced-security-options`, then scope it down afterward.

### Mutual TLS notes

Do not plan around mTLS unless you have validated it in the exact version you are running. The workflow path is centered on basic auth and AWS Signature Version 4.

## If the workflow fails after submission

```bash
workflow status
workflow output
workflow output --follow
```
{% include copy.html %}

### Workflow already exists

`workflow submit` automatically stops and replaces an existing workflow with the same name, so this should rarely block you. If you see lingering CRDs after a partial failure, use `workflow reset` instead of deleting Argo workflows directly:

```bash
workflow reset           # interactive list and prompt
workflow reset --all     # remove everything (capture proxies are protected)
```
{% include copy.html %}

Avoid `kubectl delete workflow ...`. It bypasses the migration CRD lifecycle and can leave orphaned Kafka PVCs or pending assignments.
{: .warning }

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

If you [open a GitHub issue](https://github.com/opensearch-project/opensearch-migrations/issues), include whether you are running on generic Kubernetes or EKS, because that changes the likely root cause for identity and platform issues.
