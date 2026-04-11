---
layout: default
title: Is Migration Assistant right for you?
nav_order: 10
redirect_from:
  - /migration-assistant/overview/is-migration-assistant-right-for-you/
---

# Is Migration Assistant right for you?

Whether Migration Assistant is right for you depends on your upgrade path, infrastructure complexity, and operational goals. This page helps you evaluate whether Migration Assistant fits your use case.

Migration Assistant addresses key limitations in traditional migration approaches. For example, if you're upgrading across multiple major versions — such as from Elasticsearch 6.8 to OpenSearch 2.19 — you can use Migration Assistant to complete the process in a single step. Other methods, like rolling upgrades or snapshot restoration, require upgrading through each major version and often reindexing at every stage.

## Supported migration paths

The following matrix shows which source versions can be directly migrated to which OpenSearch target versions:

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

- Self-managed (on-premises or hosted by a cloud provider)
- Amazon OpenSearch Service
- Amazon OpenSearch Serverless (target only)
- Elastic Cloud
- Apache Solr 8.x (source only — see [Solr migration]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/))

## Deployment options

Migration Assistant runs on Kubernetes and can be deployed to:

- **Any Kubernetes cluster** (minikube, kind, GKE, AKS, self-managed) using Helm charts
- **Amazon EKS** (recommended for production) with CloudFormation and the bootstrap script

For production workloads at scale, Amazon EKS is the recommended deployment target. For development and testing, minikube or kind provide a quick local setup.

## Supported features

| Feature | Supported | Recommendations |
|:--------|:----------|:----------------|
| **Documents** | Yes | Migrate using RFS (backfill) or Capture and Replay |
| **Index settings** | Yes | Migrated automatically by the metadata migration tool |
| **Index mappings** | Yes | Migrated automatically |
| **Index templates** | Yes | Migrated automatically |
| **Component templates** | Yes | Migrated automatically |
| **Aliases** | Yes | Migrated automatically |
| **ISM/ILM policies** | No | Manually recreate on target |
| **Kibana/Dashboards objects** | No | Export/import using Dashboards UI |
| **Security configuration** | No | Configure separately on target |
| **Plugins** | No | Check plugin compatibility |

## Checklist

Use this checklist to determine whether Migration Assistant is the right fit:

- Are you migrating across one or more major versions in a single step?
- Do you need to maintain high service availability with minimal or zero downtime?
- Do you need to validate a new OpenSearch cluster before switching over?
- Are you looking for tooling to migrate index settings and other metadata?
- Do you need a high-performance backfill solution with pause, resume, and checkpoint recovery?
- Are you migrating from Apache Solr and need query translation?

If you answered "yes" to most of these questions, Migration Assistant is likely the right solution.

## Assumptions and limitations

### Reindex-from-Snapshot (RFS)

- The `_source` field must be enabled on all indexes to be migrated
- The source cluster must have the Amazon S3 plugin installed (for S3-based snapshots)
- Shards of up to **80 GiB** are supported by default
- Snapshots of indexes using zstd or zstd_no_dict codecs (OpenSearch 2.9+) are not supported — reindex with `default` or `best_compression` first

### Capture and Replay

- Automatically generated document IDs are **not preserved** during replay — clients must explicitly provide document IDs
- Live capture is recommended only for workloads with **< 4 TB/day** of incoming traffic

### Networking

- The Kubernetes cluster must have network connectivity to both source and target clusters
- For EKS deployments, source and target cluster security groups must allow inbound traffic from the EKS cluster security group
