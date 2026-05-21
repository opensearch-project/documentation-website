---
layout: default
title: Troubleshooting
nav_order: 70
permalink: /migration-assistant/troubleshooting/
---

# Troubleshooting

First, determine whether the issue is related to deployment, authentication, or workflow execution.

The following commands help categorize the issue:

```bash
console --version
console clusters connection-check
workflow status
workflow log all
kubectl get pods -n ma
```
{% include copy.html %}

## Platform health issues

If the platform is not healthy, use the following sections to diagnose the issue.

### Pods are not starting

To inspect pod failures, run the following commands:

```bash
kubectl describe pod <POD_NAME> -n ma
kubectl logs <POD_NAME> -n ma
```
{% include copy.html %}

Common causes:

- Image pull failures because the chart was installed without valid `images.*` overrides.
- Missing secrets.
- Insufficient permissions.
- Pending pods caused by missing capacity or a broken `StorageClass`.

### Pods are pending

To identify the cause of pending pods, run the following commands:

```bash
kubectl get events -n ma --sort-by='.lastTimestamp'
kubectl describe node <NODE_NAME>
```
{% include copy.html %}

On generic Kubernetes, this often means your cluster does not have enough CPU, memory, or storage. On Amazon Elastic Kubernetes Service (EKS), it can also mean your node group or Karpenter configuration needs attention.

## Connectivity failures

To diagnose connectivity issues, run the following commands from the Migration Console:

```bash
console clusters connection-check
console clusters curl source /
console clusters curl target /
```
{% include copy.html %}

### Common causes

The following are common causes of connectivity failures:

- The source or target security groups do not allow traffic from the EKS cluster.
- DNS does not resolve from inside the cluster.
- The source or target endpoint is incorrect.
- TLS verification fails and `allowInsecure` is not set for a self-signed environment.

Run a DNS test from the console pod:

```bash
kubectl exec -it migration-console-0 -n ma -- nslookup <CLUSTER_ENDPOINT>
```
{% include copy.html %}

## Authentication failures

Authentication issues typically present as `401`, `403`, or "connection check passed from the console but workflow failed later."

### Basic authentication

Verify that the secret exists in the `ma` namespace and contains the expected keys:

```bash
kubectl get secret <SECRET_NAME> -n ma
kubectl get secret <SECRET_NAME> -n ma -o jsonpath='{.data}' | jq 'keys'
```
{% include copy.html %}

Your workflow configuration must reference that secret name in `authConfig.basic.secretName`.

### Authenticate using AWS Signature Version 4 on Amazon EKS

On EKS, the solution stack automatically associates IAM roles with the service accounts used by the console pod and the workflow executor pods.

Verify the identity inside the console pod:

```bash
kubectl exec -it migration-console-0 -n ma -- aws sts get-caller-identity
```
{% include copy.html %}

If the target is Amazon OpenSearch Service with fine-grained access control, make sure the relevant IAM role is mapped with sufficient permissions on the domain.

Use `es` as the AWS Signature Version 4 service for Amazon OpenSearch Service domains and `aoss` for Amazon OpenSearch Serverless collections.
{: .note }

### Authenticate using AWS Signature Version 4 on generic Kubernetes

Generic Kubernetes does not automatically create AWS pod identity for Migration Assistant. You must supply AWS credentials to both of these pods separately:

- The Migration Console pod (`migration-console-0`), running under the `migration-console-access-role` service account, needs credentials for console CLI commands.
- The Argo workflow executor pods, running under the `argo-workflow-executor` service account, need credentials for the real migration steps.

If the console can authenticate but the workflow fails later, the problem is usually that only the console pod has credentials.

The developer-oriented local AWS credential mount is not a credential strategy suitable for production.
{: .warning }

### Service account name mismatch

The console pod does not run under a service account named `migration-console`. The chart uses `migration-console-access-role`.

To inspect service accounts or troubleshoot identity issues, run the following commands:

```bash
kubectl get serviceaccount -n ma
kubectl describe serviceaccount migration-console-access-role -n ma
kubectl describe serviceaccount argo-workflow-executor -n ma
```
{% include copy.html %}

### Fine-grained access control: 403 on cluster:monitor/main

If authentication succeeds but the cluster returns `403` on operations such as `cluster:monitor/main`, fine-grained access control (FGAC) is enabled and the Migration Assistant identity has no role mapping inside the cluster. Authentication verifies your identity at the cluster boundary, and FGAC controls which operations that identity can perform. Both must be configured.

Map the Migration Assistant identity to `all_access` (or a more scoped role) using the OpenSearch Security API. The API path differs by engine:

- **Elasticsearch 7.x** (Open Distro Security): `/_opendistro/_security/api/rolesmapping/<role>`
- **OpenSearch 1.x and later** (Security plugin): `/_plugins/_security/api/rolesmapping/<role>`

Use `users` for internal accounts and `backend_roles` for identities delivered by the authentication layer---an LDAP or SAML group, or an IAM role ARN when authenticating with AWS Signature Version 4.

For Elasticsearch 7.x, run the following command:

```bash
curl -u <admin-user>:<admin-pass> \
  -H 'Content-Type: application/json' \
  -X PUT "https://<cluster>/_opendistro/_security/api/rolesmapping/all_access" \
  -d '{ "backend_roles": ["<identity>"] }'
```
{% include copy.html %}

For OpenSearch 1.x and later, run the following command:

```bash
curl -u <admin-user>:<admin-pass> \
  -H 'Content-Type: application/json' \
  -X PUT "https://<cluster>/_plugins/_security/api/rolesmapping/all_access" \
  -d '{ "backend_roles": ["<identity>"] }'
```
{% include copy.html %}

On AWS-managed domains that only accept IAM authentication (no admin password), you can map the role by temporarily setting the Migration Assistant IAM role as the `MasterUserARN` through `aws opensearch update-domain-config --advanced-security-options`, then reduce the permissions after the migration is complete.

### Mutual TLS notes

Mutual TLS (mTLS) is not supported in all versions. Validate mTLS compatibility with your specific version before using it. The primary supported authentication methods are basic authentication and AWS Signature Version 4.

## Workflow failures

To diagnose workflow failures, run the following commands:

```bash
workflow status
workflow log all
workflow log all --follow
```
{% include copy.html %}

### Workflow already exists

The `workflow submit` command automatically stops and replaces an existing workflow with the same name, so this should rarely block you. If you notice lingering custom resource definitions (CRDs) after a partial failure, use `workflow reset` instead of deleting Argo workflows directly:

```bash
workflow reset           # interactive list and prompt
workflow reset --all     # remove everything (capture proxies are protected)
```
{% include copy.html %}

Avoid `kubectl delete workflow ...`. It bypasses the migration CRD lifecycle and can leave orphaned Apache Kafka persistent volume claims (PVCs) or pending assignments.
{: .warning }

### Approval gate is blocking progress

To view and approve pending gates, open the interactive UI:

```bash
workflow manage
```
{% include copy.html %}

Alternatively, approve the step directly:

```bash
workflow approve step <STEP_NAME>
```
{% include copy.html %}

## Snapshot creation failures

The most common cause for Elasticsearch sources is a missing `repository-s3` plugin.

To verify that the repository-s3 plugin is installed, run the following command:

```bash
curl http://<SOURCE_HOST>:9200/_cat/plugins?v
```
{% include copy.html %}

Additionally, verify the following:

- The source cluster can write to the snapshot bucket.
- The repository is registered correctly.
- The bucket region and path match the workflow config.

## Metadata migration failures

Common causes of metadata migration failures include:

- Incompatible mappings across major versions.
- Elasticsearch 6.x multi-type mapping incompatibilities.
- Target settings rejected by the newer version.

Use a pilot allow list first so these failures appear in a small slice of data instead of the whole cluster.

## Document backfill performance issues

If backfill is slow or unstable, verify the following:

- Target cluster ingest capacity.
- Available disk space on the target.
- RFS worker replica count.
- Pod memory limits for large documents.

Because RFS reads from snapshots, adding workers does not increase load on the source cluster. Additional workers increase write pressure on the target cluster.

## Missing console or workflow commands

Some console images install the binaries under `/.venv/bin`. If the commands are not found, add the path manually:

```bash
export PATH="/.venv/bin:$PATH"
/.venv/bin/console --version
/.venv/bin/workflow configure sample
```
{% include copy.html %}

## Additional debugging information

When reporting an issue, collect the output of the following commands:

- `console --version`
- `workflow status`
- `workflow log all`
- `kubectl describe pods -n ma`
- Source and target version numbers
- Exact authentication mode in use

When opening a [GitHub issue](https://github.com/opensearch-project/opensearch-migrations/issues), specify whether you are running on generic Kubernetes or EKS. The deployment type affects the root cause for identity and platform issues.
