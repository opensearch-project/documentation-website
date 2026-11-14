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

When deploying Migration Assistant, you need to make two independent decisions: where to run Migration Assistant (the cloud or platform that will host it) and what to migrate to (the target OpenSearch deployment). This page helps you choose where to run Migration Assistant by explaining how much of the hosting platform the deployment tooling provisions for you.

## Prerequisites

All deployment paths require:

- Kubernetes cluster** version 1.24 or later.
- Helm 3 installed and configured.
- `kubectl` configured to access your cluster.
- Network access for connectivity from the cluster to source and target clusters.

## Deployment paths

The following table compares the Migration Assistant deployment paths.

| Path | Best when | Included |
|:-----|:----------|:-------------|
| [Deploy on Amazon Elastic Kubernetes Service (EKS)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploy-on-amazon-eks/) | You plan to run production migrations on AWS | Migration Assistant and AWS platform integrations, including cluster and VPC provisioning, pod identity, snapshot access, and Amazon CloudWatch dashboards. Choose between an AWS CloudFormation bootstrap script and Terraform for provisioning. |
| [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/) | You plan to run production migrations on GCP | Migration Assistant and a Terraform module that provisions the GKE cluster, VPC networking, Cloud Storage snapshots, and Workload Identity Federation for GKE. |
| [Deploy on other Kubernetes platforms]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) | You use another managed or self-managed Kubernetes platform, or want to evaluate Migration Assistant locally | Migration Assistant only. You provision and configure the required platform integrations yourself. |

All paths use the Migration Assistant Helm chart. The difference is how much of the surrounding environment the tooling prepares for you.

## Default components

The following table describes the components that the Migration Assistant Helm chart installs.

| Component | Purpose |
|:----------|:--------|
| Migration Console | Pod with CLI tools for configuring and running migrations |
| Workflow Engine | Orchestrates migration tasks (Argo Workflows) |
| Strimzi | Kafka operator for Capture and Replay |
| Prometheus-compatible metrics | Metrics collection and platform observability integration |

Source and target cluster configuration is handled dynamically through the Workflow CLI, not through large Helm value files.

## Managed cloud paths

When you run Migration Assistant on a managed cloud, a provider-specific deployment path provisions and configures the surrounding platform for you, reducing setup effort. For component details, see [Deploy Migration Assistant on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploy-on-amazon-eks/) or [Deploy Migration Assistant on Google Kubernetes Engine]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/).

{% include migration-phase-navigation.html %}
