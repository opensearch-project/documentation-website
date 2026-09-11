---
layout: default
title: Deploy on Google GKE
nav_order: 3
parent: Choose your deployment
permalink: /migration-assistant/migration-phases/deploy/deploying-to-gke/
---

# Deploy on Google Kubernetes Engine

Use this path when you run migrations on Google Cloud Platform (GCP). You receive the same Migration Assistant engine, workflow model, and console experience as every other path. Google Kubernetes Engine (GKE) is the recommended production path on GCP because a Terraform module prepares the GCP platform pieces that a real migration needs: the cluster, networking, snapshot storage, and workload identity.

GKE makes the migration **easier to deploy, easier to secure, and easier to operate** without changing how migrations run.

## GKE deployment components

The Terraform module prepares GCP infrastructure around the workflow engine, including:

- A GKE Standard cluster deployed into a new or existing virtual private cloud (VPC).
- Private nodes with Cloud NAT for outbound access.
- Workload Identity so migration pods can authenticate to GCP services without long-lived keys.
- A Cloud Storage bucket for snapshots, with the node service account granted access to it.
- Secondary IP ranges for GKE pods and services, and configurable control-plane access.

The same `terraform apply` also installs the Migration Assistant Helm release into the cluster, so provisioning and deployment happen in one step. The module pulls the Migration Assistant container images from an Artifact Registry repository in your project, so you mirror those images before you apply (see [Step 1](#step-1-mirror-the-migration-assistant-images)).

## Prerequisites

Before you begin, make sure you have the following:

- A GCP project with billing enabled. To create one, run `gcloud projects create <PROJECT_ID>` and then [link a billing account](https://cloud.google.com/billing/docs/how-to/modify-project).
- [Terraform](https://developer.hashicorp.com/terraform/install) 1.6 or later, or [OpenTofu](https://opentofu.org/docs/intro/install/) 1.6 or later.
- The [gcloud CLI](https://cloud.google.com/sdk/docs/install), authenticated with `gcloud auth application-default login`.
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) and [Helm 3](https://helm.sh/docs/intro/install/) installed.
- The required GCP APIs enabled:

```bash
gcloud services enable compute.googleapis.com container.googleapis.com storage.googleapis.com
```
{% include copy.html %}

## Step 1: Mirror the Migration Assistant images

Migration Assistant is published to Amazon Public ECR (`public.ecr.aws/opensearchproject/...`). The GKE Terraform module pulls the images from an Artifact Registry repository in your own project instead, so you mirror them there first.

Create the Artifact Registry repository (the module expects it in `us-central1`) and authenticate Docker:

```bash
gcloud artifacts repositories create migrations \
  --project=<PROJECT_ID> \
  --location=us-central1 \
  --repository-format=docker
gcloud auth configure-docker us-central1-docker.pkg.dev
```
{% include copy.html %}

Mirror each image for the release you are deploying. Replace `<RELEASE>` with the release tag you plan to pass as `migration_release` (for example, `3.3.5`):

```bash
REG=us-central1-docker.pkg.dev/<PROJECT_ID>/migrations
for img in migration-console reindex-from-snapshot traffic-capture-proxy traffic-replayer; do
  docker pull public.ecr.aws/opensearchproject/opensearch-migrations-${img}:<RELEASE>
  docker tag  public.ecr.aws/opensearchproject/opensearch-migrations-${img}:<RELEASE> ${REG}/${img}:<RELEASE>
  docker push ${REG}/${img}:<RELEASE>
done
```
{% include copy.html %}

The `migration_release` tag you apply in the next step must exist for all four images in this repository.
{: .note }

## Step 2: Provision and deploy with Terraform

The Terraform module is published in the [`opensearch-migrations` repository](https://github.com/opensearch-project/opensearch-migrations) under `deployment/terraform/gcp`. Clone the release tag you want to deploy, replacing `<RELEASE_TAG>` with a published version (for example, `3.3.5`):

```bash
git clone --branch <RELEASE_TAG> --depth 1 --single-branch \
  https://github.com/opensearch-project/opensearch-migrations.git
cd opensearch-migrations/deployment/terraform/gcp
```
{% include copy.html %}

Applying the module provisions the cluster **and** installs the Migration Assistant Helm release; there is no separate `helm install` step.

The most common variables are described in the following table. Check the module's `variables.tf` for the complete list.

| Variable | Default | Purpose |
|:---------|:--------|:--------|
| `project` | (required) | GCP project ID |
| `region` | `us-central1` | GCP region |
| `migration_release` | `3.3.5` | Migration Assistant release tag applied to all images; must exist in the Artifact Registry mirror from Step 1 |
| `node_machine_type` | `e2-standard-4` | Machine type for the cluster nodes |
| `create_vpc` | `true` | Create a new VPC, or reuse an existing one (`false`) |
| `master_authorized_cidrs` | `["0.0.0.0/0"]` | Ranges authorized to reach the control plane |

### Optional: Keep migration traffic private

If your migration must not traverse the public internet, configure private networking before you apply, because the connectivity options are set through the same Terraform variables used in this step. You can make the source, target, snapshot, and control-plane legs private independently. Go to [Private networking on GKE]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/), add the connectivity variables you need, and then return here to apply.

### Apply the configuration

Initialize the module (downloads the providers), then provision and deploy:

```bash
terraform init
terraform apply \
  -var="project=<your-gcp-project>" \
  -var="region=<your-gcp-region>" \
  -var="migration_release=3.3.5"
```
{% include copy.html %}

The module provisions a GKE Standard cluster and installs Migration Assistant into it.
{: .note }

## Step 3: Get cluster credentials

The cluster name is generated by Terraform. Fetch credentials with the following command:

```bash
gcloud container clusters get-credentials $(terraform output -raw cluster_name) \
  --region $(terraform output -raw cluster_location) \
  --project <your-gcp-project>
```
{% include copy.html %}

## Step 4: Verify the deployment

Verify that the platform pods are running:

```bash
kubectl get pods -n ma
```
{% include copy.html %}

You should see the Migration Console, the Argo workflow controller, and the Argo server in `Running` state.

## Step 5: Access the Migration Console

Access the Migration Console:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

After you access the console, the migration flow is the same as any other deployment: verify the version, load the sample configuration, run a pilot migration, validate it, and then run the full migration.

## GCP helpers the deployment created for you

The GKE path provisions a Cloud Storage bucket and configures identity so you do not have to build them manually.

### Snapshot bucket

Terraform creates a Cloud Storage bucket for migration snapshots and generates a unique name for it. The Helm chart exposes the bucket to workflows through the `migrations-default-gcs-config` config map. By default, the migration workflow creates a fresh snapshot in this bucket as its first step.

If you already have a snapshot in the bucket, you can configure the workflow to reuse it instead of creating a new one. For the workflow configuration, see [Using an existing snapshot]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/#using-an-existing-snapshot). For best performance, keep the bucket in the same region as the GKE cluster; cross-region reads work but are slower and incur egress charges.

### Workload Identity

The module binds the Kubernetes service accounts that run migrations (the Migration Console and the Argo workflow executor) to a GCP service account through Workload Identity. This means the console and the migration jobs can reach Cloud Storage and other GCP services without you distributing long-lived credentials. This is one of the main reasons GKE is the recommended GCP production path.

## Authentication on GKE

Migration Assistant supports the following authentication methods on GKE.

### Basic authentication

Basic authentication works the same way as every other path: create Kubernetes secrets and reference them in `authConfig.basic.secretName`.

### Workload Identity for GCP services

For access to GCP services such as Cloud Storage, the GKE path uses Workload Identity to assign a GCP identity to the Migration Console pod and the Argo workflow executor pods. The Terraform module configures these bindings for you.

## Removal

Once you no longer need Migration Assistant for rollback, replay, or comparison, remove it. Do not remove it immediately after cutover. For the readiness checklist, see [Removing migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/).

Because Terraform installed the Migration Assistant Helm release, destroying the module removes both Migration Assistant and the GKE infrastructure in one step:

```bash
terraform destroy \
  -var="project=<your-gcp-project>" \
  -var="region=<your-gcp-region>"
```
{% include copy.html %}

If any persistent volume claims remain afterward, delete them explicitly with `kubectl -n ma delete pvc --all`.

## Next steps

1. Open the Migration Console and run `console --version`.
2. Load the sample workflow with `workflow configure sample --load`.
3. Run `console clusters connection-check`.
4. Continue with [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

{% include migration-phase-navigation.html %}
