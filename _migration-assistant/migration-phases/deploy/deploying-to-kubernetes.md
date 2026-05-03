---
layout: default
title: Deploy on Kubernetes
nav_order: 1
grand_parent: Migration workflows
parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/deploying-to-kubernetes/
---

# Deploy on Kubernetes

Use this path when you already operate your own Kubernetes platform, you are evaluating Migration Assistant locally, or you are deploying outside AWS. You get the same migration engine, workflow model, and console experience as EKS. The difference is that **you provide the surrounding platform pieces yourself**.

If you are on AWS and want the recommended production path, use [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).

## When this path makes sense

- You already run a self-managed Kubernetes platform and are comfortable owning cluster identity, storage, logging, and registry access.
- You are testing locally with `minikube` or `kind`.
- Your migration is not centered on AWS-managed services.

## What you are responsible for

On generic Kubernetes, Migration Assistant does **not** automatically provision or wire:

- AWS pod identity for SigV4-authenticated source or target clusters
- private image mirroring for isolated networks
- default snapshot bucket and IAM helpers
- CloudWatch dashboards and AWS-native logging integration
- AWS-tuned storage classes and autoscaling node pools

That is the main difference from the EKS path. The workflow engine is the same.

## Prerequisites

- Kubernetes 1.24 or later
- `kubectl` configured for your cluster
- Helm 3 installed
- network connectivity from the cluster to the source and target clusters
- a StorageClass with dynamic provisioning

## Local evaluation with Minikube

For local testing, use the repository's helper script. This is the fastest way to experience the workflow model before preparing a production platform.

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

The script starts Minikube, builds the container images, installs the Helm chart, and deploys test source and target clusters. Use this path for learning and validation, not as a production blueprint.

## Production deployment on generic Kubernetes

### Step 1: Decide how your cluster will pull images

Migration Assistant can run on any conformant Kubernetes cluster, but published installs still need explicit image settings. The chart's default short repository names are not directly pullable.

Choose one of these patterns:

- Pull from Amazon Public ECR by overriding `images.*.repository` and `images.*.tag`
- Mirror the release images into your own registry and point the chart at that registry
- If you are on AWS and want image mirroring automated for you, use the EKS bootstrap path instead

### Step 2: Create the namespace

```bash
kubectl create namespace ma
```
{% include copy.html %}

### Step 3: Create Kubernetes secrets if you use basic auth

Basic auth is configured the same way on Kubernetes and EKS: store credentials in Kubernetes secrets and reference those secret names in the workflow config.

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

### Step 4: Install the Helm chart

Use a released version tag for `<VERSION>`.

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

If your nodes cannot reach public registries, mirror the images into a private registry first.
{: .note }

### Step 5: Verify the platform is running

```bash
kubectl get pods -n ma
```
{% include copy.html %}

You should see the Migration Console, the Argo workflow controller, and the Argo server in `Running` state.

### Step 6: Access the Migration Console

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

From here, the experience matches EKS: load the sample config for your version, edit it, run a pilot, then run the real workflow.

## Authentication on generic Kubernetes

### Basic auth

Basic auth works the same way as EKS. Put the credentials in a Kubernetes secret and reference the secret name in `authConfig.basic.secretName`.

### SigV4 for Amazon OpenSearch Service or Serverless

SigV4 is supported by the workflow configuration, but **generic Kubernetes does not automatically create AWS pod identity for you**.

If your source or target uses Amazon OpenSearch Service or OpenSearch Serverless, you must make AWS credentials available to:

- the `migration-console-access-role` pod, which runs CLI commands such as `console clusters connection-check`
- the `argo-workflow-executor` workflow pods, which perform the actual migration steps

This is the biggest operational difference from EKS. On EKS, pod identity is wired for you. On generic Kubernetes, you must solve credential injection yourself.

The chart includes a developer-oriented Kyverno policy that can mount local AWS credentials for certain pods, but that is not a production identity strategy.
{: .warning }

If you are on AWS and want SigV4 to work without building your own credential plumbing, use [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).

## What to do next

1. Open the Migration Console and run `console --version`.
2. Load the sample workflow with `workflow configure sample --load`.
3. Run `console clusters connection-check` before submitting a workflow.
4. Start with [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

{% include migration-phase-navigation.html %}
