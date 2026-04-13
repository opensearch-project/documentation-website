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

For production deployments on vanilla Kubernetes (not EKS), you need Migration Assistant images in a registry your cluster can reach. Typical options:

- **Amazon Public ECR** — use the same `public.ecr.aws/opensearchproject/...` repositories and release tag as in [Step 3](#step-3-install-the-helm-chart) (nodes need outbound access to pull from Public ECR)
- **Build from source** with `localTesting.sh` (or `aws-bootstrap.sh --build-images`) and push to your private registry, then point `images.*.repository` / `tag` at that registry
- **Amazon EKS bootstrap** — automates chart install, optional image mirroring to private ECR, IAM, and CloudWatch (see [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/))

For most AWS production deployments, the EKS path is the least error-prone because it aligns versions across the chart, images, and dashboards.
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

The chart’s default `values.yaml` uses short image repository names (`migrations/...`). Those names are **not** pullable on their own — published installs point Migration Assistant images at **Amazon Public ECR** under `public.ecr.aws/opensearchproject/`, matching what the [EKS bootstrap script](https://github.com/opensearch-project/opensearch-migrations/blob/main/deployment/k8s/aws/aws-bootstrap.sh) applies. Without overriding `images.*`, pods typically fail with `ImagePullBackOff`.

Use a [GitHub release tag](https://github.com/opensearch-project/opensearch-migrations/releases) for `<VERSION>` (for example `2.1.0` or the tag you deploy). Your cluster must be able to reach `public.ecr.aws` (or mirror these images into your own registry).

```bash
git clone https://github.com/opensearch-project/opensearch-migrations
cd opensearch-migrations/deployment/k8s

helm install ma -n ma charts/aggregates/migrationAssistantWithArgo --create-namespace \
  --set images.captureProxy.repository=public.ecr.aws/opensearchproject/opensearch-migrations-traffic-capture-proxy \
  --set images.captureProxy.tag=<VERSION> \
  --set images.trafficReplayer.repository=public.ecr.aws/opensearchproject/opensearch-migrations-traffic-replayer \
  --set images.trafficReplayer.tag=<VERSION> \
  --set images.reindexFromSnapshot.repository=public.ecr.aws/opensearchproject/opensearch-migrations-reindex-from-snapshot \
  --set images.reindexFromSnapshot.tag=<VERSION> \
  --set images.migrationConsole.repository=public.ecr.aws/opensearchproject/opensearch-migrations-console \
  --set images.migrationConsole.tag=<VERSION> \
  --set images.installer.repository=public.ecr.aws/opensearchproject/opensearch-migrations-console \
  --set images.installer.tag=<VERSION>
```
{% include copy.html %}

For air-gapped clusters, mirror these images (and dependent charts) into a private registry; the EKS bootstrap script’s `--push-all-images-to-private-ecr` path automates that on AWS.
{: .note }

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
