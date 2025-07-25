---
layout: default
title: About the process
nav_order: 1
redirect_from:
  - /upgrade-to/
canonical_url: https://docs.opensearch.org/latest/upgrade-to/
---

# About the process

The process of upgrading from Elasticsearch OSS (including Open Distro for Elasticsearch) to OpenSearch varies depending on your current version of Elasticsearch OSS, install type, tolerance for downtime, and cost-sensitivity. Rather than concrete steps to cover every situation, we have general guidance for the process.

Three approaches exist:

- Use a snapshot to [migrate your Elasticsearch OSS data]({{site.url}}{{site.baseurl}}/upgrade-to/snapshot-migrate/) to a new OpenSearch cluster.
- Perform a [rolling upgrade or cluster restart upgrade]({{site.url}}{{site.baseurl}}/upgrade-to/upgrade-to/) on your existing nodes.
- Replace existing Elasticsearch OSS nodes with new OpenSearch nodes. Node replacement is most popular when upgrading [Docker clusters]({{site.url}}{{site.baseurl}}/upgrade-to/docker-upgrade-to/).

Regardless of your approach, to safeguard against data loss, we recommend that you take a [snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshot-restore/) of all indices prior to any migration.

If your existing clients include a version check, such as recent versions of Logstash OSS and Filebeat OSS, [check compatibility]({{site.url}}{{site.baseurl}}/clients/agents-and-ingestion-tools/index/) before upgrading.
