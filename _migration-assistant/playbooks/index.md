---
layout: default
title: Playbooks
nav_order: 80
has_children: true
has_toc: false
permalink: /migration-assistant/playbooks/
---

# Playbooks

Playbooks are opinionated migration runbooks. They are meant to answer the question, "What should I actually do for my source and target combination?" without making you assemble the steps yourself.

Each playbook assumes:

- Migration Assistant is already deployed
- you understand whether you are taking a downtime path or a zero-downtime path
- you will still start from `workflow configure sample --load` for your installed version

## How to use a playbook

1. Pick the playbook that matches your source and target.
2. Follow the prerequisite checklist before editing the workflow.
3. Run a pilot first.
4. Only then run the full migration.

## Available playbooks

| Playbook | Best for |
|:---------|:---------|
| [Elasticsearch 6.8 to OpenSearch 3.5]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/) | Self-managed Elasticsearch sources that need metadata cleanup and snapshot-based backfill |
| [Amazon OpenSearch Service to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/) | Managed AWS sources targeting Serverless collections |
| [Solr 8.11 to OpenSearch 3]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-solr-8.11-to-opensearch-3/) | Solr migrations that need transform-proxy and backfill guidance |

If you are on AWS and want the simplest production setup, deploy Migration Assistant on Amazon EKS before using these runbooks.
