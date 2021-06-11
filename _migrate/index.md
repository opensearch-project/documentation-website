---
layout: default
title: About migrating
nav_order: 1
redirect_from: /migrate/
---

# About migrating

The process of migrating from Elasticsearch OSS (including Open Distro for Elasticsearch) to OpenSearch varies depending on your current version of Elasticsearch OSS, install type, tolerance for downtime, and cost-sensitivity. Rather than concrete steps to cover every situation, we have general guidance for the process.

To safeguard against data loss, we recommend that you take a [snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshot-restore/) of all indices prior to any migration.
{: .tip }
