---
layout: default
title: Deploying to Kubernetes
nav_order: 1
grand_parent: Migration phases
parent: Deploy
permalink: /migration-assistant/migration-phases/deploy/deploying-to-kubernetes/
---

# Deploying to Kubernetes

This guide covers deploying Migration Assistant to a generic Kubernetes cluster using Helm charts. For AWS EKS deployment, see [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).

## Prerequisites

- **Kubernetes cluster**: Version 1.24 or later (minikube, kind, or any distribution)
- **Helm 3**: [Install Helm](https://helm.sh/docs/intro/install/)
- **kubectl**: [Install kubectl](https://kubernetes.io/docs/tasks/tools/) and configure it to access your cluster
- **Docker**: Required if building images from source or using minikube
- **Network access**: Connectivity from the cluster to source and target clusters
- **Persistent storage**: StorageClass with dynamic provisioning

## Quick start with minikube

For local testing and development, minikube provides the fastest path. The `localTesting.sh` script automates the full setup: starting minikube, building container images from source, and installing the Helm chart with test clusters.

### Prerequisites

- [minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [Docker](https://docs.docker.com/engine/install/) running
- Java Development Kit (JDK) 11–17
- At least 8 CPUs and 12 GB memory available for Docker

### Step 1: Clone the repository

```bash
git clone https://github.com/opensearch-project/opensearch-migrations
cd opensearch-migrations/deployment/k8s
```
{% include copy.html %}

### Step 2: Run the local testing script

```bash
./localTesting.sh
```
{% include copy.html %}

This script:
1. Starts minikube with adequate resources
2. Sets up a local container registry inside minikube
3. Builds all Migration Assistant container images from source using Gradle and BuildKit
4. Installs the Migration Assistant Helm chart
5. Deploys test source (Elasticsearch) and target (OpenSearch) clusters

The initial build takes 10–20 minutes depending on your machine. Subsequent runs are faster due to caching.

Building from source requires a JDK and may encounter Gradle configuration cache issues. If the build fails, try running with `--no-configuration-cache` or check the [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/) page.
{: .note }

### Step 3: Access the Migration Console

```bash
kubectl -n ma exec --stdin --tty migration-console-0 -- /bin/bash
```
{% include copy.html %}

## Production Kubernetes deployment

For production deployments on vanilla Kubernetes (not EKS), you need container images available in a registry accessible from your cluster. Options:

- **Build from source** using the `localTesting.sh` approach and push to your registry
- **Use the EKS bootstrap script** which handles image mirroring to ECR (see [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/))
- **Pull from the GitHub release** artifacts (when available for your version)

For most production deployments, the [EKS deployment path]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) is recommended as it handles image management, IAM, and monitoring automatically.
{: .note }

### Step 1: Create the namespace

```bash
kubectl create namespace ma
```
{% include copy.html %}

### Step 2: Create authentication secrets

Create Kubernetes secrets for cluster authentication before deploying.

**Basic authentication:**

```bash
kubectl create secret generic source-credentials \
  --from-literal=username=<user> \
  --from-literal=password=<pass> \
  -n ma
```
{% include copy.html %}

**mTLS authentication:**

```bash
kubectl create secret generic source-mtls \
  --from-file=client.crt=<path-to-cert> \
  --from-file=client.key=<path-to-key> \
  -n ma
```
{% include copy.html %}

### Step 3: Install the Helm chart

```bash
git clone https://github.com/opensearch-project/opensearch-migrations
cd opensearch-migrations/deployment/k8s

helm install ma -n ma charts/aggregates/migrationAssistantWithArgo --create-namespace
```
{% include copy.html %}

### Step 4: Verify deployment

```bash
kubectl get pods -n ma
```
{% include copy.html %}

Expected output:

```
NAME                                    READY   STATUS    RESTARTS   AGE
argo-workflows-server-xxxxxxxxx-xxxxx   1/1     Running   0          5m
argo-workflows-workflow-controller-xx   1/1     Running   0          5m
migration-console-0                     1/1     Running   0          5m
```

### Step 5: Access the Migration Console

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

## Authentication configuration

Configure authentication in your workflow configuration. Run `workflow configure sample` on the Migration Console to see the exact schema for your installed version.

| Type | Use case | Secret requirements |
|:-----|:---------|:--------------------|
| Basic | Username/password auth | Secret with `username` and `password` keys |
| SigV4 | AWS managed OpenSearch | IAM role (no secret needed) |
| mTLS | Certificate-based auth | Secret with `client.crt` and `client.key` |

## Network requirements

| From | To | Port | Purpose |
|:-----|:---|:-----|:--------|
| Migration Console | Source cluster | 9200/443 | Source cluster access |
| Migration Console | Target cluster | 9200/443 | Target cluster access |
| Migration Console | Snapshot storage | 443 | S3/snapshot repository |
| Workflow pods | Source cluster | 9200/443 | Migration operations |
| Workflow pods | Target cluster | 9200/443 | Migration operations |

## Cleanup

To remove the Migration Assistant Helm deployment and its volumes:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
```
{% include copy.html %}

To remove the minikube cluster (if using minikube):

```bash
cd deployment/k8s
./minikubeLocal.sh --delete
```
{% include copy.html %}

## Next steps

1. [Workflow CLI overview]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) — Learn about the Workflow CLI concepts
2. [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/) — Run your first migration

{% include migration-phase-navigation.html %}
