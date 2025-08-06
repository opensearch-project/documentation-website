---
layout: default
title: Is Migration Assistant right for you?
nav_order: 10
parent: Migration Assistant for OpenSearch
redirect_from:
  - /migration-assistant/overview/is-migration-assistant-right-for-you/
---

# Is Migration Assistant right for you?

Whether Migration Assistant is right for you depends on your upgrade path, infrastructure complexity, and operational goals. This page will help you evaluate whether Migration Assistant fits your use case.

Migration Assistant addresses key limitations in traditional migration approaches. For example, if you're upgrading across multiple major versions—such as from Elasticsearch 6.8 to OpenSearch 2.19—you can use Migration Assistant to complete the process in a single step. Other methods, like rolling upgrades or snapshot restoration, require upgrading through each major version and often reindexing at every stage.

Migration Assistant also supports live traffic replication, enabling zero-downtime migrations. This makes it a strong fit for environments where minimizing service disruption is critical.

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

<table class="migration-matrix" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px;">Source version</th>
      {% for target in unique_targets %}
      <th style="border: 1px solid #ddd; padding: 8px;">{{ target }}</th>
      {% endfor %}
    </tr>
  </thead>
  <tbody>
    {% for path in site.data.migration-assistant.valid_migrations.migration_paths %}
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px;">{{ path.source }}</th>
      {% for target_version in unique_targets %}
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
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
- Amazon OpenSearch Service (Amazon OpenSearch Serverless collections are not supported)

**Supported AWS Regions**

Refer to [Supported AWS Regions](https://docs.aws.amazon.com/solutions/latest/migration-assistant-for-amazon-opensearch-service/plan-your-deployment.html#supported-aws-regions) for the full list of supported Regions.

## Supported features

Before starting an upgrade or migration, consider the cluster feature to be included. The following table lists what can be migrated using Migration Assistant, whether it is currently supported, and recommendations for how to handle each component.

| Feature | Supported | Recommendations   |
| :--- | :--- | :--- |
| **Documents**  | Yes  | Migrate existing data with RFS and live traffic with Capture and Replay. |
| **Index settings**  | Yes   | Migrate with the `Metadata-Migration-Tool`. |
| **Index mappings**  | Yes   | Migrate with the `Metadata-Migration-Tool`.  |
| **Index templates**   | Yes   | Migrate with the `Metadata-Migration-Tool`. |
| **Component templates**  | Yes   | Migrate with the `Metadata-Migration-Tool`.  |
| **Aliases**   | Yes   | Migrate with the `Metadata-Migration-Tool`.  |
| **Index State Management (ISM) policies**  | Expected in 2025    | Manually migrate using an API. For more information about ISM support, see [issue #944](https://github.com/opensearch-project/opensearch-migrations/issues/944). |
| **Elasticsearch Kibana dashboards** | Expected in 2025 | This tool is only needed when migrating from Elasticsearch Kibana dashboards to OpenSearch Dashboards. Start by exporting JSON files from Kibana and importing them into OpenSearch Dashboards. For Elasticsearch versions 7.10.2 to 7.17, use the [`dashboardsSanitizer`](https://github.com/opensearch-project/opensearch-migrations/tree/main/dashboardsSanitizer) tool before importing X-Pack visualizations like Canvas and Lens into Kibana dashboards, as they may require recreation for compatibility with OpenSearch.|
| **Security constructs**   | No   | Configure roles and permissions based on cloud provider recommendations. For example, if using AWS, use AWS Identity and Access Management (IAM) for enhanced security management. |
| **Plugins**  | No  | Check plugin compatibility; some Elasticsearch plugins may not have direct OpenSearch equivalents. |

## Checklist

Use this checklist to determine whether Migration Assistant is the right fit for your migration:

- Are you migrating across one or more major versions—such as from Elasticsearch 5 to OpenSearch 3—in a single step?
- Are you upgrading but want the ability to safely back out, reducing the risk of data loss or service disruption?
- Do you need to maintain high service availability with minimal or zero downtime?
- Do you need to validate a new OpenSearch cluster before switching over—with rollback capabilities?
- Is your environment self-managed or running on Amazon OpenSearch Service?
- Are you looking for tooling to migrate index settings and other metadata?
- Do you need to reconfigure your target cluster—for example, by changing the sharding strategy and reindexing?
- Are you migrating across Regions, from on premises, or from another cloud provider?
- Do you need a high-performance backfill solution that can reliably reindex documents—with support for pause, resume, or checkpoint recovery?

If you answered "yes" to most of these questions, Migration Assistant is likely the right solution for your migration.

## Migration Assistant assumptions and limitations

Before using Migration Assistant, review the following assumptions and limitations.

### Networking and environment

Connectivity to AWS services and outbound internet access are required in order to build and deploy Migration Assistant. Requirements differ based on whether you're deploying to a new or existing virtual private cloud (VPC).

#### Source and target connectivity

To meet connectivity requirements, ensure the following:

- You must establish connectivity between:
  - The source cluster and/or Amazon Simple Storage Service (Amazon S3) (for snapshots, which may only require updating the bucket policy) and Migration Assistant.
  - The target cluster and Migration Assistant.
- If the source or target resides in a private VPC without internet access, use one of the following to connect:
  - VPC endpoints
  - VPC peering
  - AWS Transit Gateway

#### Deploying to a new VPC

When deploying to a new VPC, consider the following:

- Migration Assistant provisions a new VPC with required components (for example, NAT gateway, subnets).
- You must establish network access from this VPC to both the source and target clusters.

#### Deploying to an existing VPC

When deploying to an existing VPC, consider the following:

- If deploying Migration Assistant to an existing VPC (for example, the same VPC as the source or target), you may need to configure connectivity to any cluster external to the target VPC.
  - For example, if Migration Assistant is deployed to the source VPC, you may need VPC endpoints or peering to reach the target.

- Ensure all required AWS services are reachable by Migration Assistant components.

  - If the VPC has outbound access using private subnets with a NAT gateway or public subnets with an internet gateway, then VPC interface endpoints are not required.


  - If using isolated subnets with no outbound access, you must configure VPC interface endpoints or routing to the following services:

    - **Application Load Balancer** (Capture and Replay only) – Used to optionally reroute client traffic from the source to the target during migration.
    - **Amazon CloudWatch** – Publishes migration metrics.
    - **Amazon CloudWatch Logs** – Ingests Amazon Elastic Container Service (Amazon ECS) task logs.
    - **Amazon Elastic Compute Cloud (Amazon EC2)** – Used to bootstrap Migration Assistant. When deploying using AWS CloudFormation, the bootstrap EC2 instance requires outbound internet access (using NAT gateway or an internet gateway) to download the latest version from GitHub.
    - **Amazon Elastic Block Store (Amazon EBS)** – Provides temporary disk storage.
    - **Amazon Elastic Container Registry (Amazon ECR)** – Pulls container images.
    - **Amazon ECS** – Orchestrates container workloads.
    - **Amazon Elastic File System (Amazon EFS)** – Stores persistent logs.
    - **Amazon Managed Streaming for Apache Kafka (Amazon MSK)** (Capture and Replay only) – Used as durable storage to capture and replay live HTTP traffic.
    - **Amazon S3** – Stores and retrieves snapshots and artifacts.
    - **Elastic Load Balancing** (Capture and Replay only) – Used by the migration console to connect to the Application Load Balancer.
    - **AWS Secrets Manager** – Securely stores credentials when using basic authentication on the source or target.
    - **AWS Systems Manager Parameter Store** – Stores configuration parameters.
    - **AWS Systems Manager Session Manager** – Enables secure shell access to ECS tasks such as the migration console.
    - **AWS X-Ray** – Supports distributed tracing.
    - **Amazon Virtual Private Cloud (Amazon VPC)** – Ensures proper routing, DNS resolution, and endpoint configuration.

### Reindex-from-Snapshot

To use `Reindex-from-Snapshot` (RFS), ensure the following:

- The `_source` field must be enabled on all indexes to be migrated. See [Source]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/source/).
- The source cluster must have the Amazon S3 plugin installed.
- If you choose to bring your own snapshot (that is, one not created by Migration Assistant), the following settings must be applied when creating the snapshot:
  - `include_global_state: true` – Ensures that global cluster state is included.
  - `compress: false` – Disables metadata compression, which is required for compatibility with RFS.
- Shards of up to **80 GiB** are supported by default. Larger shard sizes can be configured, **except in AWS GovCloud (US)**, where 80 GiB is the maximum.
- In OpenSearch 2.9 and later, snapshots of indexes that use the zstd or zstd_no_dict codecs are not supported. If you need to migrate these indexes using `Reindex-from-Snapshot`, you must first reindex them on the source cluster using either `default` or `best_compression` before creating a new snapshot for use with RFS.

### Capture and Replay

Capture and Replay has the following requirements:

- The Traffic Capture Proxy must be deployed to intercept client traffic.
- Live capture is recommended only for workloads with **< 4 TB/day** of incoming traffic to the source cluster.
- Automatically generated document IDs are **not preserved** during replay. Clients must explicitly provide document IDs for `index` and `update` operations.
- Migration Assistant does not guarantee zero-downtime migration through live traffic Capture and Replay for migration paths starting from Elasticsearch 1.x and Elasticsearch 2.x.