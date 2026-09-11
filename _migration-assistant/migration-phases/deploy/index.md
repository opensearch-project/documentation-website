---
layout: default
title: Choose your deployment
nav_order: 20
has_children: true
has_toc: true
permalink: /migration-assistant/migration-phases/deploy/
redirect_from:
  - /migration-assistant/deploying-migration-assistant/
  - /migration-assistant/getting-started-with-data-migration/
  - /deploying-migration-assistant/
---

# Choose your deployment

Migration Assistant always runs on Kubernetes. Two decisions are independent: **where Migration Assistant runs** (the cloud or platform that hosts it) and **what you migrate to** (the target OpenSearch deployment). This page covers the first decision: how much of the hosting platform the tooling prepares for you.

## Deployment types

The following table compares the three deployment types.

| Type | Best when | Included |
|:-----|:----------|:-------------|
| [Deploy on Amazon Elastic Kubernetes Service (EKS)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) | You run migrations on AWS and want the recommended production path | The same engine plus AWS bootstrap automation, pod identity, image mirroring, snapshot helpers, and Amazon CloudWatch integration |
| [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/) | You run migrations on GCP and want the recommended production path | The same engine plus a Terraform module for the GKE cluster, VPC networking, Cloud Storage snapshots, and Workload Identity |
| [Deploy on other Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) | You use another Kubernetes platform (managed or self-managed), or you are evaluating locally | The core Migration Assistant engine and workflow model, with you supplying the platform integrations |

All paths install the same Migration Assistant Helm chart. The difference is how much of the surrounding environment is prepared for you.

## Default components

The following table describes the components that the Migration Assistant Helm chart installs.

| Component | Purpose |
|:----------|:--------|
| Migration Console | Pod with CLI tools for configuring and running migrations |
| Workflow Engine | Orchestrates migration tasks (Argo Workflows) |
| Strimzi | Kafka operator for Capture and Replay |
| Prometheus-compatible metrics | Metrics collection and platform observability integration |

Source and target cluster configuration is handled dynamically through the Workflow CLI, not through large Helm value files.

## Managed-cloud paths

On a managed cloud, a provider-specific path removes a large amount of non-migration work by preparing the surrounding platform for you.

On AWS, Amazon EKS is the recommended path. It provides:

- Cluster and VPC bootstrap.
- Pod identity for AWS API access.
- Private image support for isolated subnets.
- Snapshot bucket and role helpers.
- Amazon CloudWatch dashboards and logging.
- AWS-aware storage and node-pool defaults.

On GCP, Google Kubernetes Engine (GKE) is the recommended path. A Terraform module provides:

- GKE cluster and VPC provisioning.
- Workload Identity for GCP API access.
- A Cloud Storage snapshot bucket and access bindings.
- Optional private networking for the source, target, snapshot, and control-plane legs.

Both managed paths reduce platform configuration effort so you can focus on validating the migration.

## Prerequisites

All deployment paths require:

- **Kubernetes cluster**: Version 1.24 or later.
- **Helm 3**: Installed and configured
- **`kubectl`**: Configured to access your cluster.
- **Network access**: Connectivity from the cluster to source and target clusters.

Use [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) for the recommended production path on AWS.

Use [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/) for the recommended production path on GCP.

Use [Deploy on other Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) for any other Kubernetes platform, managed or self-managed.

{% include migration-phase-navigation.html %}
