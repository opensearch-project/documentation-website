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
    description: "The philosophy behind the new Migration Assistant and why Amazon EKS is the recommended AWS production path."
    link: "/migration-assistant/why-kubernetes-and-eks/"
  - heading: "Choose your deployment"
    description: "Compare generic Kubernetes with Amazon EKS and decide which path fits your environment."
    link: "/migration-assistant/migration-phases/deploy/"
  - heading: "How migrations run"
    description: "The workflow-driven lifecycle for backfill, Capture and Replay, validation, and cutover."
    link: "/migration-assistant/migration-phases/"
  - heading: "Run a migration"
    description: "Use the Workflow CLI as the primary interface for configuring, submitting, and managing migrations."
    link: "/migration-assistant/workflow-cli/"
  - heading: "Use a playbook"
    description: "Follow path-specific guides for common source and target combinations."
    link: "/migration-assistant/playbooks/"
canonical_url: https://docs.opensearch.org/latest/migration-assistant/
---

# ![Migration Assistant icon]({{site.url}}{{site.baseurl}}/images/icons/MigrationUpgrade_Color_Icon.svg){: .heading-icon} Migration Assistant for OpenSearch

Migration Assistant is the Kubernetes-native migration platform for moving data, metadata, and live traffic from Elasticsearch, OpenSearch, and Apache Solr to OpenSearch.

The Migration Assistant operating model is:

- You define the migration in workflow configuration.
- Migration Assistant runs the work on Kubernetes.
- You use the Migration Console and Workflow CLI to submit, observe, approve, validate, and switch traffic to the target.

Migration Assistant runs on any Kubernetes distribution, but **Amazon EKS is the recommended production path on AWS** because it supplies the AWS identity, image, snapshot, and observability integrations that you typically need for a real migration.

If you used the older ECS/CDK-based Migration Assistant, see [Changes from the classic version](#changes-from-the-classic-version).

## Key capabilities

Migration Assistant provides the following:

- **One migration model** for snapshot-based migrations with planned downtime (called *backfill-only*) and zero-downtime migrations that use live-traffic Capture and Replay.
- **Repeatable workflows** instead of ad-hoc infrastructure choreography.
- **Low source-cluster impact** through snapshot-based backfill with [Reindex-from-Snapshot (RFS)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/).
- **Operational checkpoints** through approval gates, logs, status views, and validation steps.
- **A practical AWS path** on EKS that reduces surrounding platform work.

## Getting started

1. [Decide whether Migration Assistant is the right tool]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/).
2. [Understand why the product moved to Kubernetes and why EKS is recommended on AWS]({{site.url}}{{site.baseurl}}/migration-assistant/why-kubernetes-and-eks/).
3. [Assess your migration]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/). Review breaking changes, downtime constraints, and required transformations.
4. [Choose your deployment path]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/).
5. [Learn how a migration runs]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/).
6. [Use the Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) and then [pick a playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/).

Looking for the older ECS deployment model? See the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
{: .note }

## Changes from the classic version

If you previously used the ECS/CDK-based Migration Assistant, the operating model is different in this version:

- The migration is defined in workflow configuration instead of long-lived infrastructure stacks.
- Migration Assistant runs the work on Kubernetes (Amazon EKS is the recommended AWS path).
- Day-to-day operations happen through the Migration Console and Workflow CLI rather than through ad-hoc scripts.

For background on the rationale, see [Why Kubernetes and EKS]({{site.url}}{{site.baseurl}}/migration-assistant/why-kubernetes-and-eks/).

{% include list.html list_items=page.items %}
