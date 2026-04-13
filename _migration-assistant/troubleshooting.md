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

### OpenSearch Serverless 403 or empty permissions

If the target is a **Serverless collection** and bulk or search fails with **403** or authorization errors:

- Confirm the Migration Console pod’s IAM role is allowed in the collection **data access policy** (principal ARN).
- Confirm the workflow target `endpoint` is the **collection** URL (`*.aoss.amazonaws.com`) and `authConfig.sigv4.service` is **`aoss`** (not `es`).
- See [Amazon OpenSearch Service → Serverless playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/).

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

## Known issues

### `console` and `workflow` commands not in PATH

On some Migration Console versions, the `console` and `workflow` commands are installed in `/.venv/bin/` and may not be in the default `PATH`. If you get "command not found":

```bash
export PATH="/.venv/bin:$PATH"
# Or run directly:
/.venv/bin/console --version
/.venv/bin/workflow configure sample
```
{% include copy.html %}

### macOS: `tac` command not found in bootstrap script

The `aws-bootstrap.sh` script uses `tac` (a Linux utility) which is not available on macOS. If you see `tac: command not found`, install GNU coreutils:

```bash
brew install coreutils
```
{% include copy.html %}

Alternatively, run the bootstrap script from AWS CloudShell (Linux-based) or a Linux machine.

### Minikube: Helm install fails with ImagePullBackOff

Direct `helm install` on minikube fails because Migration Assistant container images are not published to a public registry. Use the `localTesting.sh` script instead, which builds images from source and pushes them to a local registry inside minikube.

### Gradle build failures with configuration cache

When building from source, the Gradle build may fail with configuration cache errors, particularly for the `trafficReplayer:jib` task. Workaround:

```bash
./gradlew :buildImages:buildImagesToRegistry --no-configuration-cache
```
{% include copy.html %}

### EKS: CloudFormation stack already exists

If you see `ResourceExistenceCheck` errors when deploying CloudFormation, a stack with the same name already exists. Either:
- Use a different `--stack-name`
- Delete the existing stack first: `aws cloudformation delete-stack --stack-name <NAME>`
- Use `--skip-cfn-deploy` to bootstrap an existing cluster

### Snapshot creation fails with exit code 1

If the `createSnapshot` workflow step fails immediately, the most common cause is that the source Elasticsearch cluster does not have the `repository-s3` plugin installed. Verify:

```bash
curl http://<SOURCE_HOST>:9200/_cat/plugins?v
```
{% include copy.html %}

If the plugin is missing, install it on the source cluster:

```bash
/usr/share/elasticsearch/bin/elasticsearch-plugin install --batch repository-s3
systemctl restart elasticsearch
```
{% include copy.html %}

The source cluster also needs IAM permissions to write to the S3 snapshot bucket. For EC2-hosted Elasticsearch, attach an IAM role with `s3:PutObject`, `s3:GetObject`, and `s3:ListBucket` permissions.

### Workflow already exists error

If you see `workflows.argoproj.io "migration-workflow" already exists` when submitting, delete the old workflow first:

```bash
kubectl delete workflow migration-workflow -n ma
workflow submit
```
{% include copy.html %}

### Config validation errors

The workflow configuration schema has required fields that are not obvious from the sample:

- `createSnapshotConfig` is **required** even if empty (`{}`)
- `migrations` array is **required** inside `snapshotExtractAndLoadConfigs`
- `snapshotNameConfig` must contain either `snapshotNamePrefix` or `externallyManagedSnapshot`

If you see `Error while safely parsing the transformed workflow`, check these fields. Run `workflow configure sample` to see the full schema with all required fields.

### EC2 instances stop between sessions

If your source or target EC2 instances stop (due to spot termination, session timeout, etc.), you'll need to restart them and update your workflow configuration with the new private IPs:

```bash
aws ec2 start-instances --instance-ids <INSTANCE_ID>
aws ec2 describe-instances --instance-ids <INSTANCE_ID> --query "Reservations[0].Instances[0].PrivateIpAddress"
```
{% include copy.html %}

Then update your workflow configuration with `workflow configure edit`.
