---
layout: default
title: Choose your deployment
parent: Migration workflows
nav_order: 2
has_children: true
has_toc: true
permalink: /migration-assistant/migration-phases/deploy/
redirect_from:
  - /migration-assistant/deploying-migration-assistant/
  - /migration-assistant/getting-started-with-data-migration/
  - /deploying-migration-assistant/
---

# Choose your deployment

Migration Assistant always runs on Kubernetes. The real decision is **how much of the surrounding platform you want the tooling to prepare for you**.

## Which path should you choose?

| Path | Best when | What you get |
|:-----|:----------|:-------------|
| [Deploy on Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) | You already operate a Kubernetes platform, you are not on AWS, or you are evaluating locally | The core Migration Assistant engine and workflow model, with you supplying the platform integrations |
| [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) | You are on AWS and want the recommended production path | The same engine plus AWS bootstrap automation, pod identity, image mirroring, snapshot helpers, and CloudWatch integration |

Both paths install the same Migration Assistant Helm chart. The difference is how much of the surrounding environment is prepared for you.

## What the platform always deploys

The Migration Assistant Helm chart installs:

| Component | Purpose |
|:----------|:--------|
| Migration Console | Pod with CLI tools for configuring and running migrations |
| Workflow Engine | Orchestrates migration tasks (Argo Workflows) |
| Strimzi | Kafka operator for Capture and Replay |
| Prometheus-compatible metrics | Metrics collection and platform observability integration |

Source and target cluster configuration is handled dynamically through the Workflow CLI, not through large Helm value files.

## Why EKS is recommended on AWS

For AWS customers, EKS is the recommended path because it removes a large amount of non-migration work:

- cluster and VPC bootstrap,
- pod identity for AWS API access,
- private image support for isolated subnets,
- snapshot bucket and role helpers,
- CloudWatch dashboards and logging,
- and AWS-aware storage and node-pool defaults.

That lets customers spend more time validating the migration and less time building the platform around it.

## Prerequisites

All deployment paths require:

- **Kubernetes cluster**: Version 1.24 or later
- **Helm 3**: Installed and configured
- **kubectl**: Configured to access your cluster
- **Network access**: Connectivity from the cluster to source and target clusters

Use [Deploy on Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) if you are bringing your own Kubernetes platform.

Use [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) if you want the AWS production path that the rest of the new Migration Assistant documentation assumes by default.

{% include migration-phase-navigation.html %}
