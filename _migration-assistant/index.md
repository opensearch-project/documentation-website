---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 30
has_children: true
has_toc: false
nav_exclude: true
permalink: /migration-assistant/
redirect_from:
  - /migration-assistant/index/

items:
  - heading: "Is Migration Assistant right for you?"
    description: "Evaluate whether Migration Assistant fits your migration path and use case."
    link: "/migration-assistant/is-migration-assistant-right-for-you/"
  - heading: "Migration paths"
    description: "Check supported source and target versions and playbooks."
    link: "/migration-assistant/migration-paths/"
  - heading: "Architecture"
    description: "Understand the Kubernetes-native architecture and components."
    link: "/migration-assistant/architecture/"
  - heading: "Deploy"
    description: "Deploy Migration Assistant on Kubernetes or Amazon EKS."
    link: "/migration-assistant/migration-phases/deploy/"
  - heading: "Run your migration"
    description: "Configure and execute migrations using the Workflow CLI."
    link: "/migration-assistant/workflow-cli/"
---

# Migration Assistant for OpenSearch

Migration Assistant is a Kubernetes-native tool for migrating data, metadata, and query traffic from Elasticsearch, OpenSearch, and Apache Solr clusters to OpenSearch. It uses a workflow-driven approach with declarative YAML configuration and Argo Workflows for orchestration.

Migration Assistant runs on any Kubernetes distribution — including minikube, kind, Amazon EKS, GKE, AKS, and self-managed clusters. For production workloads at scale, Amazon EKS is the recommended deployment target.

Looking for the classic ECS-based documentation? See the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
{: .note }

## Key capabilities

| Capability | Description |
|:-----------|:------------|
| **Metadata migration** | Migrate index templates, component templates, index settings, and aliases |
| **Document backfill** | Migrate existing documents using snapshot-based reindexing (RFS) |
| **Capture and Replay** | Record live traffic and replay it on the target for zero-downtime migration |
| **Version compatibility** | Migrate from Elasticsearch 1.x–8.x and OpenSearch 1.x–2.x to OpenSearch |
| **Solr migration** | Migrate from Apache Solr 8.x with automatic schema translation and query proxying |
| **Kubernetes-native** | Runs on any Kubernetes cluster with Helm charts and Argo Workflows |

## Getting started

### 1. Check your migration path

Review [Is Migration Assistant right for you?]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/) and [Migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/migration-paths/) to verify your source and target versions are supported.

### 2. Deploy Migration Assistant

Choose your deployment option:

- [Deploy on Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) — Generic Kubernetes deployment using Helm
- [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) — AWS EKS with CloudFormation and the bootstrap script

### 3. Configure and run your migration

Use the [Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) to configure, submit, and monitor your migration.

### 4. Migrating from Apache Solr?

See the [Solr migration guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/) for the Solr-specific migration approach.

{% include list.html list_items=page.items %}
