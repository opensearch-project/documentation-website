---
layout: default
title: Playbooks
nav_order: 80
has_children: true
has_toc: false
permalink: /migration-assistant/playbooks/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/playbooks/
---

# Playbooks

Playbooks are step-by-step migration guides for specific source and target combinations. Each playbook provides the complete sequence of commands and configuration required for that migration path.

## Prerequisites

Before using a playbook, ensure the following:

- Migration Assistant is deployed on Kubernetes or Amazon EKS.
- You have determined whether your migration requires planned downtime or zero downtime.
- You have loaded the version-matched sample configuration by running `workflow configure sample --load`.

## Using a playbook

To use a playbook, follow these steps:

1. Choose the playbook that matches your source and target.
2. Follow the prerequisite checklist before editing the workflow.
3. Run a pilot migration first.
4. After the pilot migration succeeds, run the full migration.

## Available playbooks

The following table lists the available playbooks.

| Playbook | Use case |
|:---------|:---------|
| [Elasticsearch 6.8 to OpenSearch 3.5]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/) | Self-managed Elasticsearch sources requiring metadata transformation and snapshot-based backfill |
| [Amazon OpenSearch Service to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/) | Managed AWS sources targeting Serverless collections |
| [Solr 8.11 to OpenSearch 3]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-solr-8.11-to-opensearch-3/) | Solr snapshot-based backfill to OpenSearch |

For AWS production deployments, deploy Migration Assistant on Amazon Elastic Kubernetes Service (EKS) before following a playbook. For more information, see [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).
