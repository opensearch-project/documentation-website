---
layout: default
title: Is Migration Assistant right for you?
nav_order: 10
parent: Overview
redirect_from:
  - /migration-assistant/is-migration-assistant-right-for-you/
---

# Is Migration Assistant right for you?

Whether Migration Assistant is right for you depends on your upgrade path, infrastructure complexity, and operational goals. This page will help you evaluate whether Migration Assistant fits your use case.

Migration Assistant addresses key limitations in traditional migration approaches. For example, if you're upgrading across multiple major versions—such as from Elasticsearch 6.8 to OpenSearch 2.19—Migration Assistant enables you to complete the process in a single step. Other methods, like rolling upgrades or snapshot restores, require upgrading through each major version, often with reindexing at every stage.

Migration Assistant also supports live traffic replication, enabling zero-downtime migrations. This makes it a strong fit for environments where minimizing service disruption is critical.

## Migration Assistant assumptions and limitations

Before using Migration Assistant, review the following assumptions and limitations. They are grouped by scope to clarify which apply generally and which are specific to components.

### General

- If deploying on AWS, the identity used to deploy Migration Assistant must have permission to install all required resources. For a full list of services, see [AWS Services in this Solution](https://docs.aws.amazon.com/solutions/latest/migration-assistant-for-amazon-opensearch-service/architecture-details.html#aws-services-in-this-solution).
- The target cluster must be deployed and reachable by Migration Assistant components, including the Migration Console, Reindex-from-Snapshot, and Traffic Replayer, depending on which features are used.
- The `_source` field must be enabled on all indexes to be migrated. See [Source documentation]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/source/) for more information.
- If deploying to AWS, ensure the `CDKToolkit` stack exists and is in the `CREATE_COMPLETE` state. For setup instructions, see the [CDK Toolkit documentation](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).

### Reindex-from-Snapshot

- The source cluster must have the Amazon S3 plugin installed.
- Snapshots must include global cluster state (`include_global_state` is `true`).
- Shards up to 80 GiB are supported by default. Larger shards can be configured, except in AWS GovCloud, where 80 GiB is the maximum supported size.

### Capture-and-Replay

- The Traffic Capture Proxy must be deployed to intercept relevant client traffic.
- Live capture is recommended only for environments with less than 4 TB/day of incoming traffic to the source cluster.
- Automatically generated document IDs are not preserved for index requests. Clients must explicitly provide document IDs when indexing or updating documents.

---

## Supported migration paths

The matrix below shows which source versions can be directly migrated to which OpenSearch target versions:


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
      <th>Source Version</th>
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
- Amazon OpenSearch Service (OpenSearch Serverless Collections are not supported)

**Supported AWS Regions**

Refer to [AWS Supported Regions](https://docs.aws.amazon.com/solutions/latest/migration-assistant-for-amazon-opensearch-service/plan-your-deployment.html#supported-aws-regions) for the for the full list of supported regions.

## Supported features

Before starting an upgrade or migration, consider the cluster feature to be included. The table below lists what can be migrated using Migration Assistant, whether it is currently supported, and recommendations for how to handle each component.

| Feature | Supported | Recommendations   |
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
