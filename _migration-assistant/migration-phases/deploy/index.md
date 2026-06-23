---
layout: default
title: Choose your deployment
parent: Migration workflows
nav_order: 2
has_children: true
has_toc: true
permalink: /migration-assistant/migration-phases/deploy/
redirect_from:
  - /migration-assistant/getting-started-with-data-migration/
  - /deploying-migration-assistant/
  - /migration-assistant/deploying-migration-assistant/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/deploy/
---

# Choose your deployment

Migration Assistant always runs on Kubernetes. The primary decision is how much platform configuration you want the tooling to automate.

## Deployment types

The following table compares the two deployment types.

| Type | Best when | Included |
|:-----|:----------|:-------------|
| [Deploy on Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) | You already operate a Kubernetes platform, you are not on AWS, or you are evaluating locally | The core Migration Assistant engine and workflow model, with you supplying the platform integrations |
| [Deploy on Amazon Elastic Kubernetes Service (EKS)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) | You are on AWS and want the recommended production path | The same engine plus AWS bootstrap automation, pod identity, image mirroring, snapshot helpers, and CloudWatch integration |

Both paths install the same Migration Assistant Helm chart. The difference is how much of the surrounding environment is prepared for you.

## Default components

The following table describes the components that the Migration Assistant Helm chart installs.

| Component | Purpose |
|:----------|:--------|
| Migration Console | Pod with CLI tools for configuring and running migrations |
| Workflow Engine | Orchestrates migration tasks (Argo Workflows) |
| Strimzi | Kafka operator for Capture and Replay |
| Prometheus-compatible metrics | Metrics collection and platform observability integration |

Source and target cluster configuration is handled dynamically through the Workflow CLI, not through large Helm value files.

## Why Amazon EKS is recommended on AWS

On AWS, Amazon EKS is the recommended path because it removes a large amount of non-migration work:

- Cluster and VPC bootstrap.
- Pod identity for AWS API access.
- Private image support for isolated subnets.
- Snapshot bucket and role helpers.
- CloudWatch dashboards and logging.
- AWS-aware storage and node-pool defaults.

This approach reduces platform configuration effort and allows you to focus on validating the migration.

## Prerequisites

All deployment paths require:

- **Kubernetes cluster**: Version 1.24 or later.
- **Helm 3**: Installed and configured
- **`kubectl`**: Configured to access your cluster.
- **Network access**: Connectivity from the cluster to source and target clusters.

Use [Deploy on Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) if you are bringing your own Kubernetes platform.

Use [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) if you want the AWS production path that the rest of the new Migration Assistant documentation assumes by default.

{% include migration-phase-navigation.html %}
