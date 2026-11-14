---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 30
has_children: true
has_toc: false
nav_exclude: true
permalink: /migration-assistant/
redirect_from:
  - /migration-assistant/overview/
  - /migration-assistant/index/
---

# ![Migration Assistant icon]({{site.url}}{{site.baseurl}}/images/icons/MigrationUpgrade_Color_Icon.svg){: .heading-icon} Migration Assistant for OpenSearch

Migration Assistant is the Kubernetes-native migration platform for moving data, metadata, and live traffic from Elasticsearch, OpenSearch, and Apache Solr to OpenSearch.

The Migration Assistant operating model is:

- You define the migration in workflow configuration.
- Migration Assistant runs the work on Kubernetes.
- You use the Migration Console and Workflow CLI to submit, observe, approve, validate, and switch traffic to the target.

Migration Assistant runs on any Kubernetes distribution. Before you start, make two independent choices:

- Where to deploy Migration Assistant: Choose a managed cloud platform, such as Amazon Elastic Kubernetes Service (EKS) on AWS or Google Kubernetes Engine (GKE) on GCP. Alternatively, choose another Kubernetes platform. Managed cloud deployments provide integrations for identity, container images, snapshots, and observability that are typically needed for production migrations.
- The OpenSearch target to use: Choose the target that best fits your environment, whether it is a self-managed OpenSearch cluster or a managed OpenSearch offering.

Any deployment path can be used to migrate to any supported OpenSearch target.

Migration Assistant provides the following capabilities:

- One migration model for snapshot-based migrations with planned downtime (called *backfill-only*) and zero-downtime migrations that use live-traffic Capture and Replay.
- Repeatable workflows instead of one-time infrastructure choreography.
- Low source-cluster impact, using snapshot-based backfill with [Reindex-from-Snapshot (RFS)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/).
- Operational checkpoints using approval gates, logs, status views, and validation steps.
- Practical managed cloud paths (Amazon EKS on AWS and GKE on GCP) that reduce surrounding platform work.

## Getting started

1. [Decide whether Migration Assistant is the right tool]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/).
2. [Understand why Migration Assistant runs on Kubernetes and what each managed cloud path provides]({{site.url}}{{site.baseurl}}/migration-assistant/why-kubernetes/).
3. [Assess your migration]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/). Review breaking changes, downtime constraints, and required transformations.
4. [Choose your deployment path]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/).
5. [Learn how a migration runs]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/).
6. [Use the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) and then [pick a playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/).

Looking for the older ECS deployment model? See the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
{: .note }
