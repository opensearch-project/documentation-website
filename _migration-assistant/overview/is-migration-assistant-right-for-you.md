---
layout: default
title: Is Migration Assistant right for you?
nav_order: 5
parent: Overview
redirect_from:
  - /migration-assistant/is-migration-assistant-right-for-you/
---

# Is Migration Assistant right for you?

Deciding whether to use Migration Assistant depends on your specific upgrade path, infrastructure complexity, and operational goals. This page will help you evaluate whether Migration Assistant aligns with your migration needs—or whether another tool might be a better fit.

Migration Assistant was built to fill important gaps in common migration strategies. For example, if you're upgrading across multiple major versions—such as from Elasticsearch 6.8 to OpenSearch 2.19—Migration Assistant lets you do this in a single step. Other methods, like rolling upgrades or snapshot restores, require you to upgrade through each major version, often reindexing your data at every step.

Migration Assistant also supports live traffic replication, allowing for zero-downtime migrations. This makes it a strong choice for production environments where minimizing service disruption is critical.

If your migration is limited to static cluster configuration (like index templates and aliases), or if you're not concerned about downtime, simpler tools may be sufficient. But for complex migrations involving real-time traffic or major version jumps, Migration Assistant offers robust, flexible capabilities.

## Supported migration paths

The following matrix shows which source versions can be directly migrated to which OpenSearch target versions:

<!-- Migration matrix rendering logic retained -->
{% comment %}First, collect all unique target versions{% endcomment %}
{% assign all_targets = "" | split: "" %}
{% for path in site.data.migration-assistant.valid_migrations.migration_paths %}
  {% for target in path.targets %}
    {% assign all_targets = all_targets | push: target %}
  {% endfor %}
{% endfor %}
{% assign unique_targets = all_targets | uniq | sort %}

<table class="migration-matrix">
  <thead>
    <tr>
      <th></th>
      {% for target in unique_targets %}
        <th>{{ target }}</th>
      {% endfor %}
    </tr>
  </thead>
  <tbody>
    {% for path in site.data.migration-assistant.valid_migrations.migration_paths %}
      <tr>
        <th>{{ path.source }}</th>
        {% for target_version in unique_targets %}
          <td>
            {% if path.targets contains target_version %}✓{% endif %}
          </td>
        {% endfor %}
      </tr>
    {% endfor %}
  </tbody>
</table>

## Supported platforms

**Source and target platforms**

- Self-managed (on-premises or hosted by cloud provider)
- AWS OpenSearch

Other cloud platforms may work, but are not officially tested. To request support, contact a [maintainer on GitHub](https://github.com/opensearch-project/opensearch-migrations/blob/main/MAINTAINERS.md).

**AWS Regions**

Migration Assistant is supported in the following AWS Regions:

- US East (N. Virginia, Ohio)
- US West (Oregon, N. California)
- Europe (Frankfurt, Ireland, London)
- Asia Pacific (Tokyo, Singapore, Sydney)
- AWS GovCloud (US-East, US-West)[^1]

[^1]: In AWS GovCloud, `reindex-from-snapshot` (RFS) is limited to shard sizes of 80 GiB or smaller.

**Future migration paths**

To see upcoming support and roadmap plans, visit the [OpenSearch migrations roadmap](https://github.com/orgs/opensearch-project/projects/229/views/1).

## Supported components

Migration Assistant supports migrating the following components:

| Component | Supported | Recommendations   |
| :--- |:--- | :--- |
| **Documents**  | Yes  | Use `reindex-from-snapshot` (RFS) and live traffic replay. |
| **Index settings**  | Yes   | Migrate with the metadata migration tool. |
| **Index mappings**  | Yes   | Migrate with the metadata migration tool.  |
| **Index templates**   | Yes   | Migrate with the metadata migration tool. |
| **Component templates**  | Yes   | Migrate with the metadata migration tool.  |
| **Aliases**   | Yes   | Migrate with the metadata migration tool.  |
| **Index State Management (ISM) policies**  | Expected in 2025    | Migrate manually using the OpenSearch ISM API.  |
| **Elasticsearch Kibana dashboards** | Expected in 2025 | Use the `dashboardsSanitizer` tool to prepare exports for OpenSearch Dashboards. |
| **Security constructs**   | No   | Set up manually based on your provider’s best practices (e.g., AWS IAM). |
| **Plugins**  | No  | Check plugin compatibility—some Elasticsearch plugins may not have OpenSearch equivalents. |

## Checklist

Use this checklist to decide if migration assistant is right for you.

- [ ] Are you migrating across one or more major versions?

- [ ] Do you need to maintain service availability with zero downtime?

- [ ] Are you migrating live traffic in addition to static data?

- [ ] Do you need to validate a new OpenSearch cluster before switching over?

- [ ] Is your environment self-managed or running on AWS OpenSearch?

- [ ]Are you looking for tooling that can automate metadata migration and performance comparison?

If you answered “yes” to most of these questions, Migration Assistant is likely the right solution for your migration.

## Choosing your migration approach

USe the following checklist to determine which parts of Migration Assistant best fit your situation:

### Metadata migration

Use metadata migration if:

- You need to migrate index templates, mappings, settings, aliases, or component templates
- You want consistent configuration between source and target clusters
- You are bootstrapping a new OpenSearch cluster

### Backfill migration

Use backfill migration if:

- You need to move historical data while continuing to serve live traffic
- Your data volume makes real-time migration impractical
- You want to verify historical data in the new cluster before switching over

### Reindex-from-Snapshot (RFS)

Use Reindex-from-Snapshot if:

- You already use OpenSearch snapshots for backups
- You need to migrate documents at scale in parallel, such as Amazon ECS
- You require a data migration path as part of a zero-downtime migration
- Your AWS Region supports RFS and your shard sizes are within supported limits

### Combination of all three

Use a combination of all three migration types if:

- You're performing a complex, multi-version migration.
- You require zero downtime and full validation of the target environment.
- You want end-to-end tooling for metadata, data movement, and cluster behavior comparison.

