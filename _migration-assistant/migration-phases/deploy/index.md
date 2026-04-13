---
layout: default
title: Deploy
parent: Migration phases
nav_order: 2
has_children: true
has_toc: true
permalink: /migration-assistant/migration-phases/deploy/
redirect_from:
  - /deploying-migration-assistant/
  - /migration-assistant/getting-started-with-data-migration/
---

# Deploy

Migration Assistant deploys on Kubernetes using Helm charts. Choose the deployment option that matches your environment:

- [Deploy on Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) — Generic Kubernetes deployment (minikube, kind, or any K8s cluster)
- [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) — AWS EKS with CloudFormation, IAM integration, and CloudWatch dashboards

Both paths install the same Migration Assistant Helm chart. The EKS path adds AWS-specific infrastructure (VPC, IAM roles, EKS cluster) via CloudFormation and a bootstrap script.

## What gets deployed

The Migration Assistant Helm chart installs:

| Component | Purpose |
|:----------|:--------|
| Migration Console | Pod with CLI tools for configuring and running migrations |
| Argo Workflows | Workflow engine for orchestrating migration tasks |
| Strimzi | Kafka operator for Capture and Replay |
| Prometheus | Metrics collection |
| Grafana | Monitoring dashboards |

Helm manages bootstrapping these components into the cluster. Source and target cluster configuration is handled dynamically through the Workflow CLI — not through Helm values.

## Prerequisites

All deployment paths require:

- **Kubernetes cluster**: Version 1.24 or later
- **Helm 3**: Installed and configured
- **kubectl**: Configured to access your cluster
- **Network access**: Connectivity from the cluster to source and target clusters

{% include migration-phase-navigation.html %}
