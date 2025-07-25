---
layout: default
title: Breaking changes
nav_order: 5
permalink: /breaking-changes/
canonical_url: https://docs.opensearch.org/latest/breaking-changes/
---


## 1.x

The following breaking changes are relevant to OpenSearch versions 1.x.

### Migrating to OpenSearch and limits on the number of nested JSON objects

Migrating from Elasticsearch OSS version 6.8 to OpenSearch version 1.x will fail when a cluster contains any document that includes more than 10,000 nested JSON objects across all fields. Elasticsearch version 7.0 introduced the `index.mapping.nested_objects.limit` setting to guard against out-of-memory errors and assigned the setting a default of `10000`. OpenSearch adopted this setting at its inception and enforces the limitation on nested JSON objects. However, because the setting is not present in Elasticsearch 6.8 and not recognized by this version, migration to OpenSearch 1.x can result in incompatibility issues that block shard relocation between Elasticsearch 6.8 and OpenSearch versions 1.x when the number of nested JSON objects in any document surpasses the default limit. 

Therefore, we recommend evaluating your data for these limits before attempting to migrate from Elasticsearch 6.8.

