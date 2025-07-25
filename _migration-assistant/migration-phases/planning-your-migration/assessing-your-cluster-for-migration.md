---
layout: default
title: Assessing your cluster for migration
nav_order: 60
parent: Planning your migration
grand_parent: Migration phases
redirect_from:
  - /migration-assistant/migration-phases/assessing-your-cluster-for-migration/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/planning-your-migration/assessing-your-cluster-for-migration/
---

# Assessing your cluster for migration

The goal of the Migration Assistant is to streamline the process of migrating from one location or version of Elasticsearch/OpenSearch to another. However, completing a migration sometimes requires resolving client compatibility issues before they can communicate directly with the target cluster.

## Understanding breaking changes

Before performing any upgrade or migration, you should review any documentation of breaking changes.  Even if the cluster is migrated there might be changes required for clients to connect to the new cluster

## Upgrade and breaking changes guides

For migrations paths between Elasticsearch 6.8 and OpenSearch 2.x users should be familiar with documentation in the links below that apply to their specific case:

* [Upgrading Amazon Service Domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/version-migration.html).

* [Changes from Elasticsearch to OpenSearch fork](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html).

* [OpenSearch Breaking Changes]({{site.url}}{{site.baseurl}}/breaking-changes/).

The next step is to set up a proper test bed to verify that your applications will work as expected on the target version.

## Impact of data transformations

Any time you apply a transformation to your data, such as:

- Changing index names
- Modifying field names or field mappings
- Splitting indices with type mappings

These changes might need to be reflected in your client configurations. For example, if your clients are reliant on specific index or field names, you must ensure that their queries are updated accordingly.

We recommend running production-like queries against the target cluster before switching over actual production traffic. This helps verify that the client can:

- Communicate with the target cluster
- Locate the necessary indices and fields
- Retrieve the expected results

For complex migrations involving multiple transformations or breaking changes, we highly recommend performing a trial migration with representative, non-production data (e.g., in a staging environment) to fully test client compatibility with the target cluster.



