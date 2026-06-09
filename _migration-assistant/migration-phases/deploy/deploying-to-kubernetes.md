---
layout: default
title: Deploy on Kubernetes
nav_order: 1
grand_parent: Migration workflows
parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/deploying-to-kubernetes/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/
---

# Deploy on Kubernetes

Use this path when you already operate your own Kubernetes platform, you are evaluating Migration Assistant locally, or you are deploying outside AWS. You receive the same migration engine, workflow model, and console experience as EKS. The difference is that **you provide the surrounding platform pieces yourself**.

If you are on AWS and want the recommended production path, use [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).

## Recommended use cases

This path is appropriate when:

- You already run a self-managed Kubernetes platform and are comfortable owning cluster identity, storage, logging, and registry access.
- You are testing locally with `minikube` or `kind`.
- Your migration is not centered on AWS-managed services.

## Your responsibilities

On generic Kubernetes, Migration Assistant does **not** automatically provision or wire:

- AWS Identity and Access Management (IAM) pod identity for AWS Signature Version 4-authenticated source or target clusters.
- Private image mirroring for isolated networks.
- Default snapshot bucket and IAM helpers
- CloudWatch dashboards and AWS-native logging integration.
- AWS-tuned storage classes and auto scaling node pools.

The workflow engine is the same as the EKS path.

## Prerequisites

Before you begin, make sure you have the following:

- Kubernetes 1.24 or later
- `kubectl` configured for your cluster
- Helm 3 installed
- Network connectivity from the cluster to the source and target clusters.
- A StorageClass with dynamic provisioning

## Local evaluation with Minikube

For local testing, use the repository's helper script. This is the fastest way to experience the workflow model before preparing a production platform.

### Prerequisites for local builds

Local builds require the following:

- JDK 11--17 (`localTesting.sh` builds container images from source)
- Docker
- `minikube`, `kubectl`, and Helm 3
- At least 8 vCPUs and 12 GB of RAM available to Docker.

The Migration Assistant images are large (several GB combined). If Docker does not have enough memory, the script fails with unclear error messages.
{: .warning }

### Step 1: Clone a release tag

Clone a release tag:

```bash
git clone --branch 3.2.1 https://github.com/opensearch-project/opensearch-migrations
cd opensearch-migrations/deployment/k8s
```
{% include copy.html %}

### Step 2: Run the local testing script

Run the local testing script:

```bash
./localTesting.sh
```
{% include copy.html %}

The script starts Minikube, builds the container images, installs the Helm chart, and deploys test source and target clusters. Use this path for learning and validation, not as a production blueprint.

### Verify the deployment

To verify that the pods are running and access the Migration Console, run the following commands:

```bash
kubectl get pods -n ma
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

## Production deployment on generic Kubernetes

For a production deployment on generic Kubernetes, follow these steps.

### Step 1: Choose an image source

Migration Assistant is published to Amazon Public ECR (`public.ecr.aws/opensearchproject/...`). The Helm chart's default `images.*.repository` values are short development names that cannot be pulled directly, so you have to either point the chart at the public images or mirror them into your own registry.

The following three options are available:

1. **Pull from Amazon Public ECR** (simplest): Use the `valuesEks.yaml` shipped in the chart, which contains the full `images.*.repository` and `images.*.tag` overrides for the public images.
2. **Mirror the images into your own registry**: Use this for isolated environments. Then configure the chart to reference that registry by passing your own values file.
3. **Use the EKS bootstrap path instead**: The bootstrap script automates mirroring. See [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).

The exact image tags must match the Migration Assistant release you want to run. You can find released versions at [the GitHub releases page](https://github.com/opensearch-project/opensearch-migrations/releases).
{: .note }

### Step 2: Clone the release tag

Clone the release tag you want to install:

```bash
git clone --branch <RELEASE_TAG> https://github.com/opensearch-project/opensearch-migrations
cd opensearch-migrations/deployment/k8s
```
{% include copy.html %}

For example, `--branch 3.2.1` pins to that release. Building or installing from `main` is not recommended for production use.

### Step 3: Create the namespace

Create the Migration Assistant namespace:

```bash
kubectl create namespace ma
```
{% include copy.html %}

### Step 4 (Optional): Create Kubernetes secrets 

If your source or target requires basic authentication, store the credentials in Kubernetes secrets and reference those secret names in the workflow configuration. The process is the same on generic Kubernetes and EKS. To create a secret for the source and target, run the following commands:

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

### Step 5: Install the Helm chart

The chart is at `charts/aggregates/migrationAssistantWithArgo`. Use one of the values files shipped in the chart to provide the public image references:

```bash
# For local Minikube/kind testing
helm install ma -n ma charts/aggregates/migrationAssistantWithArgo \
  --create-namespace \
  -f charts/aggregates/migrationAssistantWithArgo/valuesForLocalK8s.yaml

# For a generic Kubernetes cluster pulling from public ECR
helm install ma -n ma charts/aggregates/migrationAssistantWithArgo \
  --create-namespace \
  -f charts/aggregates/migrationAssistantWithArgo/valuesEks.yaml
```
{% include copy.html %}

If your nodes cannot reach public registries, mirror the images into a private registry first and copy `valuesEks.yaml` into your own values file with the registry prefix updated.
{: .note }

### Step 6: Verify that the platform is running

Verify that the platform is running:

```bash
kubectl get pods -n ma
```
{% include copy.html %}

You should see the Migration Console, the Argo workflow controller, and the Argo server in `Running` state.

### Step 7: Access the Migration Console

Access the Migration Console:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

After accessing the console, the remaining steps are the same as for EKS: load the sample configuration, edit it, run a pilot migration, and then run the full workflow.

## Authentication on generic Kubernetes

Migration Assistant supports the following authentication methods on generic Kubernetes.

### Basic authentication

Basic authentication works the same way as EKS. Put the credentials in a Kubernetes secret and reference the secret name in `authConfig.basic.secretName`.

### Use AWS Signature Version 4 for Amazon OpenSearch Service or Serverless

AWS Signature Version 4 is supported by the workflow configuration, but **generic Kubernetes does not automatically create AWS pod identity for you**.

If your source or target uses Amazon OpenSearch Service or OpenSearch Serverless, you must make AWS credentials available to two sets of pods:

- The Migration Console pod (`migration-console-0`), running under the `migration-console-access-role` service account, which runs CLI commands such as `console clusters connection-check`
- The Argo workflow executor pods, running under the `argo-workflow-executor` service account, which perform the actual migration steps.

On EKS, pod identity is configured automatically. On generic Kubernetes, you must configure credential injection yourself.

The chart includes a developer-oriented Kyverno policy that can mount local AWS credentials for certain pods, but that is not a production identity strategy.
{: .warning }

If you are on AWS and want AWS Signature Version 4 to work without configuring credential injection manually, use [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).

## Next steps

1. Open the Migration Console and run `console --version`.
2. Load the sample workflow with `workflow configure sample --load`.
3. Run `console clusters connection-check` before submitting a workflow.
4. Start with [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

{% include migration-phase-navigation.html %}
