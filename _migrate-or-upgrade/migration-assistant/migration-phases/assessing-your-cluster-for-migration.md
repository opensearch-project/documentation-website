---
layout: default
title: Assessing your cluster for migration
nav_order: 1
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/migration-phases/assessment/
---

# Assessing your cluster for migration

The goal of the Migration Assistant is to streamline the process of migrating from one location or version of Elasticsearch/OpenSearch to another. However, completing a migration sometimes requires resolving client compatibility issues before they can communicate directly with the target cluster.


## Understanding breaking changes

Before performing any upgrade or migration, you should review any breaking changes that might exist between version because there may be changes required in order for clients to connect to the new cluster. Use the following tool by selecting the versions in your migration path. The tool will respond with any breaking changes you should note when migrating:

<link rel="stylesheet" href="{{site.url}}{{site.baseurl}}/migration-assistant/assets/css/breaking-changes-selector.css">

<div class="breaking-changes-selector">
  <h4>Find a list of breaking changes for your migration path</h4>
  
  <div>
    <label for="source-version">Source:</label>
    <select id="source-version">
      <option value="">Select</option>
      <!-- Source versions will be populated by JavaScript -->
    </select>
    
    <label for="target-version">Target:</label>
    <select id="target-version">
      <option value="">Select</option>
      <!-- Target versions will be populated by JavaScript -->
    </select>
  </div>
  
  <div>
    <label>Include Optional Components:</label><br>
    <!-- Components will be populated by JavaScript -->
    <span id="component-checkboxes"></span>
  </div>
  
  <div id="breaking-changes-results"></div>
</div>

<div id="migration-data" 
     data-migration-paths="{{ site.data.migration-assistant.valid_migrations.migration_paths | jsonify | escape }}"
     data-breaking-changes="{{ site.data.migration-assistant.breaking-changes.breaking_changes | jsonify | escape }}"
     style="display:none;"></div>

<script type="module" src="{{site.url}}{{site.baseurl}}/migration-assistant/assets/js/breaking-changes-index.js"></script>

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

## Supported transformations

The following [transformations]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/#transformations) are included in Migration Assistant. They can be enabled, combined, and configured to customize a migration for your use case. To request additional Migration Assistant transformations , create a GitHub issue [in the OpenSearch migrations repository](https://github.com/opensearch-project/opensearch-migrations/issues).

- [Type mapping deprecation]({{site.url}}{{site.baseurl}}/migration-assistant/planning-your-migration/handling-type-mapping-deprecation/)
