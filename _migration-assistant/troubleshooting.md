---
layout: default
title: Troubleshooting
nav_order: 70
permalink: /migration-assistant/troubleshooting/
---

# Troubleshooting

## Connectivity issues

### Diagnosis

Test connectivity from the Migration Console:

```bash
console clusters connection-check
console clusters curl source -- "/"
console clusters curl target -- "/"
```
{% include copy.html %}

### Common causes

**Security groups (EKS deployments)**: Source and target cluster security groups must allow inbound traffic from the EKS cluster security group.

```bash
aws eks describe-cluster --name migration-eks-cluster-<STAGE>-<REGION> \
  --query "cluster.resourcesVpcConfig.clusterSecurityGroupId" --output text
```
{% include copy.html %}

Add an inbound rule to your source/target cluster security group allowing traffic from the EKS cluster security group on port 443 or 9200.

**DNS resolution**: Verify the cluster endpoint resolves from the Migration Console:

```bash
kubectl exec -it migration-console-0 -n ma -- nslookup <cluster-endpoint>
```
{% include copy.html %}

**TLS/certificate issues**: If using self-signed certificates, set `allowInsecure: true` in your cluster configuration.

## Authentication failures

### Basic auth

Verify the secret exists and has correct keys:

```bash
kubectl get secret <secret-name> -n ma
kubectl get secret <secret-name> -n ma -o jsonpath='{.data}' | jq 'keys'
```
{% include copy.html %}

### SigV4 (AWS IAM)

Verify IAM role association and pod identity:

```bash
kubectl describe serviceaccount migration-console -n ma | grep -A5 "Annotations"
kubectl exec -it migration-console-0 -n ma -- aws sts get-caller-identity
```
{% include copy.html %}

Use `es` for Amazon OpenSearch Service, `aoss` for OpenSearch Serverless.
{: .note }

## Workflow failures

### Diagnosis

```bash
workflow status
workflow output
workflow output --follow
```
{% include copy.html %}

### Snapshot creation failures

- **S3 permissions**: Verify the snapshot role has `s3:PutObject`, `s3:GetObject`, `s3:ListBucket` on the bucket
- **Repository not registered**: Check source cluster logs if registration fails

### Metadata migration failures

- **Version incompatibility**: Some index settings don't transfer between major versions
- **Field type conflicts**: Target cluster may reject mappings with incompatible field types

### Document backfill failures

- **Target cluster capacity**: Ensure target cluster has sufficient disk space and indexing capacity
- **Mapping conflicts**: If indexes already exist on target with different mappings, delete conflicting indexes
- **Memory pressure**: RFS workers may OOM if documents are very large — check pod resource limits

## Pod issues

### Pods not starting

```bash
kubectl describe pod <pod-name> -n ma
kubectl logs <pod-name> -n ma
```
{% include copy.html %}

### CrashLoopBackOff

```bash
kubectl logs <pod-name> -n ma --previous
```
{% include copy.html %}

Common causes: invalid configuration, missing secrets, insufficient permissions.

### Pending pods

```bash
kubectl describe nodes | grep -A5 "Allocated resources"
kubectl get events -n ma --sort-by='.lastTimestamp'
```
{% include copy.html %}

Pending pods often indicate insufficient CPU, memory, or node capacity.

## Performance issues

### Slow backfill

- **Check RFS worker count**: More workers increase parallelism. Since RFS reads from S3 (not the source cluster), adding workers has no impact on the source.
- **Monitor target cluster**: Check indexing rate, CPU/memory utilization, and rejected indexing requests.
- **S3 read throughput**: Ensure the snapshot S3 bucket is in the same region as the migration workers.

### Slow snapshots

- **Source cluster load**: Snapshot creation competes with production traffic. Consider running during low-traffic periods.
- **Snapshot size**: Initial snapshots are full; subsequent snapshots are incremental and faster.

## Getting additional help

1. Enable verbose logging: `workflow -v status`
2. Collect diagnostics: `workflow status`, `workflow output`, `kubectl describe pods -n ma`
3. Search [GitHub Issues](https://github.com/opensearch-project/opensearch-migrations/issues)
4. Create a [new issue](https://github.com/opensearch-project/opensearch-migrations/issues/new/choose) with your Migration Assistant version (`console --version`), Kubernetes version, source/target versions, and error logs
