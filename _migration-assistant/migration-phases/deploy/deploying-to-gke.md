---
layout: default
title: Deploy on GKE
nav_order: 3
parent: Choose your deployment
has_children: true
has_toc: false
---

# Deploy Migration Assistant on Google Kubernetes Engine

Google Kubernetes Engine (GKE) is the recommended production path on GCP. A Terraform module provisions the GCP infrastructure required for a migration: the cluster, networking, snapshot storage, and workload identity.

## GKE deployment components

The GKE path provisions the GCP infrastructure that the workflow engine depends on. The Terraform module provides the following components:

- A GKE Standard cluster deployed into a new or existing virtual private cloud (VPC).
- Private nodes with Cloud Network Address Translation (NAT) for outbound access.
- Workload Identity Federation for GKE for the Migration Console and workflow pods.
- A Cloud Storage bucket for snapshots, and the service account access bindings that grant the migration pods read and write access to it.
- Secondary IP ranges for GKE pods and services.
- Configurable control plane access.

`terraform apply` provisions the cluster and installs the Migration Assistant Helm release in one step. Before you apply, copy the Migration Assistant container images into an Artifact Registry repository in your project. For instructions, see [Step 1: Copy the Migration Assistant images](#step-1-copy-the-migration-assistant-images).

## Prerequisites

Before you begin, ensure that you have the following:

- A GCP project with billing enabled. To create one, run `gcloud projects create <PROJECT_ID>` and then [link a billing account](https://cloud.google.com/billing/docs/how-to/modify-project).
- [Terraform](https://developer.hashicorp.com/terraform/install) 1.6 or later or [OpenTofu](https://opentofu.org/docs/intro/install/) 1.6 or later.
- The [`gcloud` CLI](https://cloud.google.com/sdk/docs/install) authenticated using `gcloud auth application-default login`.
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) and [Helm 3](https://helm.sh/docs/intro/install/).
- The `repository-gcs` plugin installed on every source node if your source cluster runs Elasticsearch 7.x or earlier or any version of OpenSearch. For installation steps, see [Source-cluster prerequisite for the repository-gcs plugin]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/#source-cluster-prerequisite-for-the-repository-gcs-plugin). Elasticsearch 8.0 and later include native Cloud Storage snapshot support and do not require the plugin. 
- The required GCP APIs enabled:

```bash
gcloud services enable compute.googleapis.com container.googleapis.com storage.googleapis.com
```
{% include copy.html %}

To keep migration traffic off the public internet, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/) before you begin. Two of the available options require coordination with another party: Private Service Connect requires the cluster provider to add your project to its accept list, and VPC peering requires the peer to create the reciprocal connection.
{: .note }

## Step 1: Copy the Migration Assistant images

The Migration Assistant images are published to Amazon Public ECR (`public.ecr.aws/opensearchproject/...`), but the GKE Terraform module pulls images from an Artifact Registry repository in your project. Copy the images into the Artifact Registry repository before you run `terraform apply`.

Create the Artifact Registry repository in `us-central1`:

```bash
gcloud artifacts repositories create migrations \
  --project=<PROJECT_ID> \
  --location=us-central1 \
  --repository-format=docker
```
{% include copy.html %}

Configure Docker to authenticate with Artifact Registry:

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```
{% include copy.html %}

Copy each image in the release that you are deploying. Replace `<RELEASE>` with the release tag you plan to pass as `migration_release` (for example, `3.3.5`):

```bash
REG=us-central1-docker.pkg.dev/<PROJECT_ID>/migrations
for img in migration-console reindex-from-snapshot traffic-capture-proxy traffic-replayer; do
  docker pull public.ecr.aws/opensearchproject/opensearch-migrations-${img}:<RELEASE>
  docker tag  public.ecr.aws/opensearchproject/opensearch-migrations-${img}:<RELEASE> ${REG}/${img}:<RELEASE>
  docker push ${REG}/${img}:<RELEASE>
done
```
{% include copy.html %}

The `migration_release` tag you apply in the next step must exist for all images in this repository.
{: .note }

## Step 2: Provision the GKE cluster and deploy Migration Assistant using Terraform

The Terraform module is published in the [`opensearch-migrations` repository](https://github.com/opensearch-project/opensearch-migrations) under `deployment/terraform/gcp`. Clone the release tag you want to deploy, replacing `<RELEASE_TAG>` with a published version (for example, `3.3.5`):

```bash
git clone --branch <RELEASE_TAG> --depth 1 --single-branch \
  https://github.com/opensearch-project/opensearch-migrations.git
cd opensearch-migrations/deployment/terraform/gcp
```
{% include copy.html %}

Running `terraform apply` provisions the cluster and installs the Migration Assistant Helm release. You do not need to run a separate `helm install` command.

The following table describes the frequently used variables. For the complete list, see the module's `variables.tf`.

| Variable | Required/Optional | Default | Description |
|:---------|:------------------|:--------|:--------|
| `project` | Required | N/A | The GCP project ID. |
| `region` | Optional | `us-central1` | The GCP region. |
| `migration_release` | Optional | `3.3.5` | The Migration Assistant release tag applied to all images. The tag must exist in the Artifact Registry repository from Step 1. |
| `node_machine_type` | Optional | `e2-standard-4` | The machine type for the cluster nodes. |
| `create_vpc` | Optional | `true` | Controls whether to create a new VPC (`true`) or reuse an existing one (`false`). |
| `master_authorized_cidrs` | Optional | `["0.0.0.0/0"]` | The IP ranges authorized to access the control plane. |

### Optional: Keep migration traffic private

To keep migration traffic off the public internet, configure private networking before applying the Terraform configuration. The connectivity options are controlled by the same Terraform variables used in this step, so you can configure private connectivity independently for the source, target, snapshot, and control plane paths. For instructions, see [Private networking on GKE]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/). Add the required connectivity variables and then continue to [Apply the configuration](#apply-the-configuration).

### Apply the configuration

Initialize the module to download the providers:

```bash
terraform init
```
{% include copy.html %}

Provision the GKE cluster and deploy Migration Assistant:

```bash
terraform apply \
  -var="project=<PROJECT_ID>" \
  -var="region=<REGION>" \
  -var="migration_release=3.3.5"
```
{% include copy.html %}

## Step 3: Retrieve cluster credentials

Terraform generates the cluster name, so read it from the module output when you retrieve the credentials:

```bash
gcloud container clusters get-credentials $(terraform output -raw cluster_name) \
  --region $(terraform output -raw cluster_location) \
  --project <PROJECT_ID>
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

After you access the console, the migration flow is identical across deployment paths: verify the version, load the sample configuration, run a pilot migration, validate it, and then run the full migration.

## GCP resources created by the deployment

Terraform creates a Cloud Storage bucket for migration snapshots and generates a unique name for it. The Helm chart exposes the bucket to workflows through the `migrations-default-gcs-config` ConfigMap. By default, the migration workflow creates a fresh snapshot in this bucket in its first step.

If you already have a snapshot in the bucket, you can configure the workflow to reuse it instead of creating a new one. For the workflow configuration, see [Using an existing snapshot]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/#using-an-existing-snapshot). For best performance, keep the bucket in the same region as the GKE cluster; cross-region reads work but are slower and incur egress charges.

## Authentication on GKE

Migration Assistant supports the following authentication methods on GKE.

### Basic authentication

Configure basic authentication by creating Kubernetes secrets and referencing them in `authConfig.basic.secretName`.

### Authentication for GCP services

For access to GCP services such as Cloud Storage, the Terraform module binds the Kubernetes service accounts that run migrations (the Migration Console and the Argo workflow executor) to a GCP service account through Workload Identity. As a result, the console and the migration jobs can reach Cloud Storage and other GCP services without requiring long-lived credentials.

## Removal

When you no longer need Migration Assistant for rollback, replay, or comparison, remove it. Do not remove it immediately after cutover. For the readiness checklist, see [Removing migration infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/).

The GKE module creates the snapshot bucket with `force_destroy = true`, so `terraform destroy` deletes the bucket and every snapshot in it without prompting. Save any snapshots you still need before running the command.
{: .warning }

Because Terraform installs the Migration Assistant Helm release, destroying the module removes both Migration Assistant and the GKE infrastructure. Delete the persistent volume claims first, while the cluster still exists:

```bash
kubectl -n ma delete pvc --all
terraform destroy \
  -var="project=<PROJECT_ID>" \
  -var="region=<REGION>"
```
{% include copy.html %}

## Next steps

1. Open the Migration Console and run `console --version`.
2. Load the sample workflow using `workflow configure sample --load`.
3. Run `console clusters connection-check`.
4. Configure and run your first migration by following [Using the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

