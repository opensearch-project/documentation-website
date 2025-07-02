---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 1
has_children: false
nav_exclude: true
has_toc: false
permalink: /migration-assistant/
redirect_from:
  - /migration-assistant/index/
  - /upgrade-to/index/
  - /upgrade-to/
  - /upgrade-to/upgrade-to/
tutorial_cards:
  - heading: "Overview"
    description: "Get familiar with the key components of Migration Assistant and evaluate your use case."
    link: "/migration-assistant/overview/"
  - heading: "Deploying Migration Assistant"
    description: "Follow step-by-step instructions to deploy Migration Assistant and prepare data for migration."
    link: "/deploying-migration-assistant/"
  - heading: "Migration phases"
    description: "Execute your migration in phases—metadata, backfill, and traffic replay—for a controlled and validated transition."
    link: "/migration-phases/"
  - heading: "Migration console"
    description: "Use CLI commands provided by the migration console to orchestrate and monitor your migration process."
    link: "/migration-console/"
---

# Migration and upgrade options

Upgrading or migrating OpenSearch is essential for maintaining optimal performance, security, and access to the latest features. Whether you're upgrading an existing OpenSearch deployment or migrating from another system such as Elasticsearch OSS, choosing the right approach is critical to a successful transition.

This page outlines four primary methods for upgrading or migrating OpenSearch clusters—each with distinct benefits and trade-offs. These methods include rolling upgrades, snapshot and restore, Migration Assistant, and remote reindexing. Use this guide to evaluate which option best fits your data size, infrastructure, and operational requirements.

## Migration Assistant

The Migration Assistant is a comprehensive tool designed to simplify upgrades by automating the process and supporting live data capture.

**Pros:**
- Supports multi-version upgrades in a single migration.
- Enables near-zero downtime using live data capture.
- Includes rollback support to revert changes if issues occur.
- Integrates with existing OpenSearch tooling for a streamlined experience.

**Cons:**
- Requires additional setup and infrastructure.

### Why choose Migration Assistant?

Migration Assistant offers the most automated and resilient path for OpenSearch upgrades, especially for complex environments and large version gaps.

- **Multi-version hops:** Avoids sequential upgrades by migrating across multiple versions in one step.
- **Live data capture:** Maintains service continuity by syncing changes during the migration.
- **Reversion support:** Provides a fallback option in case of errors or issues.
- **Integrated automation:** Designed to fit into OpenSearch workflows for a guided upgrade experience.

### Getting started with Migration Assistant

To get started with Migration Assistant, determine which of the following scenarios best suits your needs:

- **Metadata migration**: Migrating cluster metadata, such as index settings, aliases, and templates.
- **Backfill migration**: Migrating existing or historical data from a source to a target cluster.
- **Live traffic migration**: Replicating live ongoing traffic from a source to a target cluster.
- **Comparative tooling**: Comparing the performance and behaviors of an existing cluster with a prospective new one.

It's crucial to note that migration strategies are not universally applicable. This guide provides a detailed methodology, based on certain assumptions detailed throughout, emphasizing the importance of robust engineering practices to ensure a successful migration.
{: .tip }

{% include cards.html cards=page.tutorial_cards %}

## Rolling upgrades

Rolling upgrades allow you to upgrade one node at a time, keeping the cluster operational throughout the process. Note that this is only an upgrade option.

**Pros:**
- Minimal downtime; the cluster remains available during the upgrade.
- No new infrastructure is required.

**Cons:**
- Only supports adjacent major version upgrades.
- Incompatibilities may still arise, requiring a snapshot restore that can be complex and risky.
- Multiple upgrade cycles are needed for large version jumps.
- Manual reindexing may be required to enable newer features.


## Snapshot and restore

This method involves taking a snapshot of your existing OpenSearch or Elasticsearch OSS cluster and restoring it to a new cluster running the target version.

**Pros:**
- Original cluster remains untouched, allowing rollback if needed (note: may result in data loss without a change data capture (CDC) solution).
- Scales well for large data volumes, including cold storage and datasets up to 1 PB.

**Cons:**
- Requires downtime or an external CDC solution.
- Requires provisioning a new cluster.
- Manual reindexing may be necessary for full feature support.

## Remote reindexing

This method reindexes data from your current cluster into a new OpenSearch cluster, typically running in parallel.

## Other migration options

Additional migration strategies not covered in detail in this documentation include rebuilding your target cluster from source systems and using traffic replication to mirror production traffic during migration.

**Pros:**
- No downtime; clusters operate concurrently.
- Supports upgrades across multiple versions.

**Cons:**
- Slow and resource-intensive, not recommended for data sets over 1 GB.
- May impact performance of the source cluster.
- Requires careful configuration and a compatible target cluster.

## Why choose Migration Assistant?

Migration Assistant offers the most automated and resilient path for OpenSearch upgrades, especially for complex environments and large version gaps.

- **Multi-version hops:** Avoids sequential upgrades by migrating across multiple versions in one step.
- **Live data capture:** Maintains service continuity by syncing changes during the migration.
- **Reversion support:** Provides a fallback option in case of errors or issues.
- **Integrated automation:** Designed to fit into OpenSearch workflows for a guided upgrade experience.

## Before you begin

Before choosing a method, make sure that your OpenSearch clients and plugins are compatible with the target version. For example, tools like Logstash OSS and Filebeat OSS may enforce version checks that impact upgrade paths.


## Next steps

After you've determined which upgrade or migration path works best for you, take one of the following next steps:

- Review the [Migration Assistant Overview]({{site.url}}{{site.baseurl}}/migration-assistant/overview/)
- Perform a [rolling upgrade]({{site.url}}{{site.baseurl}}/install-and-configure/upgrade-opensearch/rolling-upgrade/)

