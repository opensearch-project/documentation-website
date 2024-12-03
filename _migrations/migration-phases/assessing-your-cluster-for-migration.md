---
layout: default
title: Assessing your cluster for migration
nav_order: 60
has_children: true
parent: Migration phases
---

# Assessing your cluster for migration

The goal of Migration Assistant is to streamline the process of migrating from one location or version of Elasticsearch/OpenSearch to another. However, completing a migration sometimes requires resolving client compatibility issues before they can communicate directly with the target cluster.

## Understanding breaking changes

Before performing any upgrade or migration, you should review any breaking changes documentation. Even if the cluster is migrated, there may be changes required in order for clients to connect to the new cluster.

## Upgrade and breaking changes guides

For migration paths between Elasticsearch 6.8 and OpenSearch 2.x, you should be familiar with the following documentation, depending on your specific use case:

* [Upgrading Amazon OpenSearch Service domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/version-migration.html).

* [Amazon OpenSearch Service rename - Summary of changes](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html).

* [OpenSearch breaking changes](https://opensearch.org/docs/latest/breaking-changes/).

The next step is to set up a proper test bed to verify that your applications will work as expected on the target version.

## Impact of data transformations

Any time you apply a transformation to your data, such as changing index names, modifying field names or field mappings, or splitting indexes with type mappings, these changes may need to be reflected in your client configurations. For example, if your clients are reliant on specific index or field names, you must ensure that their queries are updated accordingly. 



We recommend running production-like queries against the target cluster before switching to actual production traffic. This helps verify that the client can:

- Communicate with the target cluster.
- Locate the necessary indexes and fields.
- Retrieve the expected results.

For complex migrations involving multiple transformations or breaking changes, we highly recommend performing a trial migration with representative, non-production data (for example, in a staging environment) to fully test client compatibility with the target cluster.



