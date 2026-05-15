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

items:
  - heading: "Is Migration Assistant right for you?"
    description: "Decide whether Migration Assistant fits your migration path, downtime target, and operational model."
    link: "/migration-assistant/is-migration-assistant-right-for-you/"
  - heading: "Why Kubernetes and EKS?"
    description: "Understand the philosophy behind the new Migration Assistant and why Amazon EKS is the recommended AWS production path."
    link: "/migration-assistant/why-kubernetes-and-eks/"
  - heading: "Choose your deployment"
    description: "See when to use generic Kubernetes and when Amazon EKS gives you more out of the box."
    link: "/migration-assistant/migration-phases/deploy/"
  - heading: "How migrations run"
    description: "Learn the workflow-driven lifecycle for backfill, Capture and Replay, validation, and cutover."
    link: "/migration-assistant/migration-phases/"
  - heading: "Run a migration"
    description: "Use the Workflow CLI as the day-to-day interface for configuring, submitting, and managing migrations."
    link: "/migration-assistant/workflow-cli/"
  - heading: "Use a playbook"
    description: "Follow path-specific guides for common source and target combinations."
    link: "/migration-assistant/playbooks/"
---

# ![Migration Assistant icon]({{site.url}}{{site.baseurl}}/images/icons/MigrationUpgrade_Color_Icon.svg){: .heading-icon} Migration Assistant for OpenSearch

Migration Assistant is the Kubernetes-native migration platform for moving data, metadata, and live traffic from Elasticsearch, OpenSearch, and Apache Solr to OpenSearch.

The key change from the classic Migration Assistant is the operating model:

- You define the migration in workflow configuration.
- Migration Assistant runs the work on Kubernetes.
- You use the Migration Console and Workflow CLI to submit, observe, approve, validate, and cut over.

Migration Assistant runs on any Kubernetes distribution, but **Amazon EKS is the recommended production path on AWS** because it supplies the AWS identity, image, snapshot, and observability integrations that users typically need for a real migration.

## What users get

- **One migration model** for backfill-only migrations (snapshot-based, planned downtime) and zero-downtime migrations (with live traffic Capture and Replay).
- **Repeatable workflows** instead of one-off infrastructure choreography.
- **Low source-cluster impact** through snapshot-based backfill with [Reindex-from-Snapshot (RFS)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/).
- **Operational checkpoints** through approval gates, logs, status views, and validation steps.
- **A practical AWS path** on EKS that removes a large amount of surrounding platform work.

## Start here

1. [Decide whether Migration Assistant is the right tool]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/).
2. [Understand why the product moved to Kubernetes and why EKS is recommended on AWS]({{site.url}}{{site.baseurl}}/migration-assistant/why-kubernetes-and-eks/).
3. [Choose your deployment path]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/).
4. [Learn how a migration runs]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/).
5. [Use the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) and then [pick a playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/).

Looking for the older ECS deployment model? See the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
{: .note }

{% include list.html list_items=page.items %}
