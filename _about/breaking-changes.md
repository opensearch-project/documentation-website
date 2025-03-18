---
layout: default
title: Breaking changes
nav_order: 5
permalink: /breaking-changes/
---

## 1.x

### Migrating to OpenSearch and limits on the number of nested JSON objects

Migrating from Elasticsearch OSS version 6.8 to OpenSearch version 1.x will fail when a cluster contains any document that includes more than 10,000 nested JSON objects across all fields. Elasticsearch version 7.0 introduced the `index.mapping.nested_objects.limit` setting to guard against out-of-memory errors and assigned the setting a default of `10000`. OpenSearch adopted this setting at its inception and enforces the limitation on nested JSON objects. However, because the setting is not present in Elasticsearch 6.8 and not recognized by this version, migration to OpenSearch 1.x can result in incompatibility issues that block shard relocation between Elasticsearch 6.8 and OpenSearch versions 1.x when the number of nested JSON objects in any document surpasses the default limit. 

Therefore, we recommend evaluating your data for these limits before attempting to migrate from Elasticsearch 6.8.


## 2.0.0

### Remove mapping types parameter

The `type` parameter has been removed from all OpenSearch API endpoints. Instead, indexes can be categorized by document type. For more details, see issue [#1940](https://github.com/opensearch-project/opensearch/issues/1940).

### Deprecate non-inclusive terms 

Non-inclusive terms are deprecated in version 2.x and will be permanently removed in OpenSearch 3.0.  We are using the following replacements: 

- "Whitelist" is now "Allow list"
- "Blacklist" is now "Deny list"
- "Master" is now "Cluster Manager"

### Add OpenSearch Notifications plugins

In OpenSearch 2.0, the Alerting plugin is now integrated with new plugins for Notifications. If you want to continue to use the notification action in the Alerting plugin, install the new backend plugins `notifications-core` and `notifications`. If you want to manage notifications in OpenSearch Dashboards, use the new `notificationsDashboards` plugin. For more information, see [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) on the OpenSearch documentation page.

### Drop support for JDK 8

A Lucene upgrade forced OpenSearch to drop support for JDK 8. As a consequence, the Java high-level REST client no longer supports JDK 8. Restoring JDK 8 support is currently an `opensearch-java` proposal [#156](https://github.com/opensearch-project/opensearch-java/issues/156) and will require removing OpenSearch core as a dependency from the Java client (issue [#262](https://github.com/opensearch-project/opensearch-java/issues/262)).


## 2.5.0

### Wildcard query behavior for text fields

OpenSearch 2.5 contains a bug fix that corrects the behavior of the `case_insensitive` parameter for the `wildcard` query on text fields. As a result, a wildcard query on text fields that ignored case sensitivity and erroneously returned results prior to the bug fix will not return the same results. For more information, see issue [#8711](https://github.com/opensearch-project/OpenSearch/issues/8711).

## 3.0.0

### JDK requirement

The minimum supported JDK version is JDK 21.

### System index access

Access to system indexes through the REST API is no longer provided. This functionality has been deprecated since OpenSearch 1.x. For more information, see issue [#7936](https://github.com/opensearch-project/OpenSearch/issues/7936).

### Document ID length limits

The document ID length limit of 512 bytes is now consistently enforced across all APIs, including the Bulk API. Previously, the Bulk API allowed document IDs longer than 512 bytes. For more information, see issue [#6595](https://github.com/opensearch-project/OpenSearch/issues/6595).

### Node role configuration

The configuration of empty node roles using environment variables has been fixed. Setting `node.roles=` using environment variables now properly configures a coordinating-only node, consistent with the `opensearch.yml` configuration. For more information, see issue [#3412](https://github.com/opensearch-project/OpenSearch/issues/3412).

### JSON processing limits

New default limits have been introduced for JSON processing (using the Jackson library) throughout OpenSearch:

- The maximum nesting depth of JSON objects and arrays is limited to 1,000 levels.
- The maximum length of JSON property names is limited to 50,000 units (bytes or chars, depending on the input source).

These limits help prevent potential memory issues and denial-of-service attacks. For more information, see issue [#11278](https://github.com/opensearch-project/OpenSearch/issues/11278).

### Nested query depth

A new `index.query.max_nested_depth` setting has been introduced with a default value of `20` and a minimum value of `1`, limiting the maximum number of nesting levels for `nested` queries. For more information, see issue [#3268](https://github.com/opensearch-project/OpenSearch/issues/3268).

### Thread pool settings

The following deprecated thread pool settings have been removed:
- `thread_pool.test.max_queue_size`
- `thread_pool.test.min_queue_size`
For more information, see issue [#2595](https://github.com/opensearch-project/OpenSearch/issues/2595).

### Index store settings

The `index.store.hybrid.mmap.extensions` setting has been removed as part of improvements to `hybridfs` file handling. For more information, see pull request [#9392](https://github.com/opensearch-project/OpenSearch/pull/9392).

### Transport Nio plugin

The `transport-nio` plugin has been removed. Netty remains the standard network framework for both node-to-node and client-to-server communication. For more information, see issue [#16887](https://github.com/opensearch-project/OpenSearch/issues/16887).

### Nodes API response format

The format of indexing buffer values in the Nodes API response has changed:

- `total_indexing_buffer_in_bytes` now displays raw bytes (for example, `53687091`).
- `total_indexing_buffer` now displays human-readable format (for example, `51.1mb`).

For more information, see pull request [#17070](https://github.com/opensearch-project/OpenSearch/pull/17070).

### PathHierarchy tokenizer

The camel case `PathHierarchy` tokenizer name has been deprecated in favor of the snake case `path_hierarchy`. For more information, see pull request [#10894](https://github.com/opensearch-project/OpenSearch/pull/10894).

### Security plugin

The Blake2b hash implementation now uses the salt parameter correctly, which will result in different (though correct) hash values compared to previous versions. For more information, see pull request [#5089](https://github.com/opensearch-project/security/pull/5089).

### k-NN plugin

The following deprecated settings have been removed from the k-NN plugin:

- `knn.plugin.enabled` setting
- `index.knn.algo_param.ef_construction` index setting
- `index.knn.algo_param.m` index setting
- `index.knn.space_type` index setting

The NMSLIB engine is now deprecated. We recommend using the Faiss or Lucene engines instead.

For more information, see pull request [#2564](https://github.com/opensearch-project/k-NN/pull/2564).

### Performance Analyzer plugin

The `performance-analyzer-rca` agent has been removed. We recommend transitioning to the [Telemetry plugin](https://github.com/opensearch-project/performance-analyzer/issues/585) for performance monitoring and analysis. The Telemetry plugin, using the OpenTelemetry framework, allows for seamless integration with lightweight open-source agents in order to publish performance metrics to observability stores. For more information, see issue [#591](https://github.com/opensearch-project/performance-analyzer-rca/issues/591).

### SQL plugin

- The OpenSearch query domain-specific language (DSL) response format has been removed.
- `DELETE` statement support has been removed.
- The `plugins.sql.delete.enabled` setting has been removed.
- The legacy Spark Connector module has been deprecated. For information about connecting to Spark, see [`async-query-core`](https://github.com/opensearch-project/sql/blob/main/async-query-core/README.md).
- Deprecated OpenDistro endpoints and legacy settings with the `opendistro` prefix have been removed.
- The `plugins.sql.pagination.api` has been removed and the Scroll API has been deprecated. Pagination now defaults to Point in Time.

For more information, see issue [#3248](https://github.com/opensearch-project/sql/issues/3248).

### OpenSearch Dashboards

- Discover experience:

    - The `discover:newExperience` setting has been removed.
    - The DataGrid table feature has been removed.

    For more information, see pull request [#9511](https://github.com/opensearch-project/OpenSearch-Dashboards/pull/9511).

- Visualizations: The `dashboards-visualizations` plugin (including Gantt chart visualization) has been removed. We recommend transitioning to:

    - Vega visualization for flexible visualization needs.
    - Trace analytics for trace-related use cases.

    For more information, see issue [#430](https://github.com/opensearch-project/dashboards-visualizations/issues/430).

### Dashboards Observability plugin

The legacy notebooks feature has been removed from `dashboards-observability`. Key changes include the following:

- Legacy notebooks (previously stored in the `.opensearch-observability` index) are no longer supported.
- Only notebooks stored in the `.kibana` index (introduced in version 2.17) are supported.
- You must migrate your notebooks to the new storage system before upgrading to version 3.0.

For more information, see issue [#2350](https://github.com/opensearch-project/dashboards-observability/issues/2350).