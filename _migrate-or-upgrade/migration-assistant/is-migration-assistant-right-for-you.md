---
layout: default
title: Is Migration Assistant right for you?
nav_order: 10
nav_exclude: false
parent: Migration Assistant for penSearch
permalink: /migration-assistant/is-migration-assistant-right-for-you/
---

# Is Migration Assistant right for you?

Whether Migration Assistant is right for you depends on your upgrade path, infrastructure complexity, and operational goals. This page will help you evaluate whether Migration Assistant fits your use case.

Migration Assistant addresses key limitations in traditional migration approaches. For example, if you're upgrading across multiple major versions—such as from Elasticsearch 6.8 to OpenSearch 2.19—Migration Assistant enables you to complete the process in a single step. Other methods, like rolling upgrades or snapshot restores, require upgrading through each major version, often with reindexing at every stage.

Migration Assistant also supports live traffic replication, enabling zero-downtime migrations. This makes it a strong fit for environments where minimizing service disruption is critical.


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

## Checklist

Use this checklist to determine whether Migration Assistant is the right fit for your migration:

- Are you migrating across one or more major versions—for example, from Elasticsearch 5 to OpenSearch 3—in a single step?
- Are you upgrading but want the ability to safely back out, reducing the risk of data loss or service disruption?
- Do you need to maintain high service availability with minimal or zero downtime?
- Do you need to validate a new OpenSearch cluster before switching over, with rollback capabilities?
- Is your environment self-managed or running on Amazon OpenSearch Service?
- Are you looking for tooling to migrate index settings and other metadata?
- Do you need to reconfigure your target cluster—for example, by changing the sharding strategy and reindexing?
- Are you migrating across regions, from on-premises, or from another cloud provider?
- Do you need a high-performance backfill solution that can reliably reindex documents—with support for pause, resume, or checkpoint recovery?

If you answered "yes" to most of these questions, Migration Assistant is likely the right solution for your migration.

## Migration Assistant assumptions and limitations

Before using Migration Assistant, review the following assumptions and limitations. They are grouped by scope to clarify which apply generally and which are specific to components.

### General


- If deploying on AWS, the identity used to deploy Migration Assistant must have permission to install all required resources. For a full list of services, see [AWS Services in this Solution](https://docs.aws.amazon.com/solutions/latest/migration-assistant-for-amazon-opensearch-service/architecture-details.html#aws-services-in-this-solution).
- The target cluster must be deployed and reachable by Migration Assistant components, including the Migration Console, Reindex-from-Snapshot, and Traffic Replayer, depending on which features are used.
- The `_source` field must be enabled on all indexes to be migrated. See [Source documentation]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/source/) for more information.
- If deploying to AWS, ensure the `CDKToolkit` stack exists and is in the `CREATE_COMPLETE` state. For setup instructions, see the [CDK Toolkit documentation](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).
- If deploying Migration Assistant into an existing AWS VPC, you must configure VPC interface endpoints and IAM permissions for the following AWS services:
  - **Amazon CloudWatch Logs** – for log ingestion from ECS tasks.
  - **Amazon CloudWatch** – for metrics published during migration
  - **Amazon Elastic Container Registry (ECR)** – for pulling container images.
  - **Amazon Elastic Container Service (ECS)** – for task orchestration and migration.
  - **Elastic Load Balancing (ELB)** – for routing traffic to Capture Proxy.
  - **AWS Secrets Manager** – for storing credentials.
  - **AWS Systems Manager Parameter Store** – for storing and accessing parameter values.
  - **AWS Systems Manager Session Manager** – for secure shell access to EC2 (i.e., bootstrap instance).
  - **Amazon EC2** – for launching the bootstrap instance responsible for build and deployment.
  - **Amazon Elastic Block Store (EBS)** – for disk storage during migration.
  - **Amazon Virtual Private Cloud (VPC)** – for private networking and VPC endpoints.
  - **AWS X-Ray** – for distributed tracing across components.
  - **Amazon Elastic File System (EFS)** – for persistent logging. 

### Reindex-from-Snapshot

- The source cluster must have the Amazon S3 plugin installed.
- Snapshots must include global cluster state (`include_global_state` is `true`).
- Shards up to 80 GiB are supported by default. Larger shards can be configured, except in AWS GovCloud, where 80 GiB is the maximum supported size.

### Capture-and-Replay

- The Traffic Capture Proxy must be deployed to intercept relevant client traffic.
- Live capture is recommended only for environments with less than 4 TB/day of incoming traffic to the source cluster.
- Automatically generated document IDs are not preserved for index requests. Clients must explicitly provide document IDs when indexing or updating documents.

---