---
layout: default
title: Is Migration Assistant right for you?
nav_order: 10
parent: Overview
permalink: /migration-assistant/overview/is-migration-assistant-right-for-you/
redirect_from:
  - /migration-assistant/is-migration-assistant-right-for-you/
---

# Is Migration Assistant right for you?

Deciding whether to use Migration Assistant depends on your specific upgrade path, infrastructure complexity, and operational goals. This page will help you evaluate whether Migration Assistant is right for your use case—or whether another tool might be a better fit.

Migration Assistant was built to fill important gaps in common migration strategies. For example, if you're upgrading across multiple major versions—such as from Elasticsearch 6.8 to OpenSearch 2.19—Migration Assistant lets you do this in a single step. Other methods, like rolling upgrades or snapshot restores, require you to upgrade through each major version, often reindexing your data at every step.

Migration Assistant also supports live traffic replication, allowing for zero-downtime migrations. This makes it a strong choice for production environments, where minimizing service disruption is critical.

If your migration is limited to a static cluster configuration (like index templates and aliases), or if you're not concerned about downtime, simpler tools may be sufficient. But for complex migrations involving real-time traffic or major version jumps, Migration Assistant offers robust, flexible capabilities.

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

- Self-managed (on premises or hosted by a cloud provider)
- Amazon OpenSearch Service


**AWS Regions**

Migration Assistant is supported in the following AWS Regions:

- US East (N. Virginia, Ohio)
- US West (Oregon, N. California)
- Europe (Frankfurt, Ireland, London)
- Asia Pacific (Tokyo, Singapore, Sydney)
- AWS GovCloud (US-East, US-West)[^1]

[^1]: In AWS GovCloud (US), `reindex-from-snapshot` (RFS) is limited to shard sizes of 80 GiB or smaller.



## Supported components

Before starting a migration, consider the scope of the components involved. The following table outlines components that should potentially be migrated, indicates whether they are supported by Migration Assistant, and provides recommendations.

| Component | Supported | Recommendations   |
| :--- |:--- | :--- |
| **Documents**  | Yes  | Migrate existing data with RFS and live traffic with capture and replay. |
| **Index settings**  | Yes   | Migrate with the `Metadata-Migration-Tool`. |
| **Index mappings**  | Yes   | Migrate with the `Metadata-Migration-Tool`.  |
| **Index templates**   | Yes   | Migrate with the `Metadata-Migration-Tool`. |
| **Component templates**  | Yes   | Migrate with the `Metadata-Migration-Tool`.  |
| **Aliases**   | Yes   | Migrate with the `Metadata-Migration-Tool`.  |
| **Index State Management (ISM) policies**  | Expected in 2025    | Manually migrate using an API. For more information about ISM support, see [issue #944](https://github.com/opensearch-project/opensearch-migrations/issues/944). |
| **Elasticsearch Kibana[^2] dashboards** | Expected in 2025 | This tool is only needed when migrating from Elasticsearch Kibana dashboards to OpenSearch Dashboards. Start by exporting JSON files from Kibana and importing them into OpenSearch Dashboards. For Elasticsearch versions 7.10.2 to 7.17, use the [`dashboardsSanitizer`](https://github.com/opensearch-project/opensearch-migrations/tree/main/dashboardsSanitizer) tool before importing X-Pack visualizations like Canvas and Lens in Kibana dashboards, as they may require recreation for compatibility with OpenSearch.|
| **Security constructs**   | No   | Configure roles and permissions based on cloud provider recommendations. For example, if using AWS, leverage AWS Identity and Access Management (IAM) for enhanced security management. |
| **Plugins**  | No  | Check plugin compatibility; some Elasticsearch plugins may not have direct OpenSearch equivalents. |

[^2]: Support for Kibana 5.0 through 7.10.2 migration paths to OpenSearch Dashboards will be added in a future version. Kibana 8 and later are not supported. For more information, see [issue #944](https://github.com/opensearch-project/opensearch-migrations/issues/944).

## Choosing your migration approach

Use the following checklist to determine which Migration Assistant components best fit your use case.

### Metadata migration

Use [metadata migration]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrating-metadata/) if:

- You need to migrate while mitigating breaking changes between the source and target clusters, such as differences in mappings, settings, aliases, or component templates.
- You want a relatively consistent configuration between the source and target clusters.

### Backfill migration

Use [backfill migration]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/) if:

- You need to move historical data without disrupting live traffic.
- You want to backfill indexes from a specific point in time without impacting the source cluster.
- You want to verify historical data in the target cluster before switching over.
- You want to backfill using an existing or incremental snapshot.
- You need the fastest backfill option that includes reindexing.
- You want the ability to pause and resume migration.

### RFS

Use [RFS]({{site.url}}{{site.baseurl}}/migration-assistant/deploying-migration-assistant/getting-started-data-migration/) if:

- You already use OpenSearch snapshots for backups.
- You need to migrate documents at scale in parallel, such as with Amazon Elastic Container Service (Amazon ECS).
- You require a data migration path as part of a zero-downtime migration.
- Your AWS Region supports RFS and your shard sizes are within supported limits.

### Combination of all three

Use a combination of all three migration types if:

- You're performing a complex, multi-version migration.
- You require zero downtime and full validation of the target environment.
- You want end-to-end tooling for metadata, data movement, and cluster behavior comparison.
- You're cloning an existing cluster and changing the source's configuration.
- You're setting up disaster recovery.

## Checklist

Use this checklist to decide whether Migration Assistant is right for you:

- Are you migrating across one or more major versions?

- Do you need to maintain service availability with zero downtime?

- Do you need to validate a new OpenSearch cluster before switching over?

- Is your environment self-managed or running on Amazon OpenSearch Service?

- Are you looking for tooling that can automate metadata migration and performance comparison?

If you answered "yes" to most of these questions, Migration Assistant is likely the right solution for your migration.
