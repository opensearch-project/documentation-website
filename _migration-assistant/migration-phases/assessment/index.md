---
layout: default
title: Assessment
nav_order: 1
parent: Migration workflows
has_children: false
has_toc: false
permalink: /migration-assistant/migration-phases/assessment/
redirect_from:
  - /migration-assistant/migration-phases/planning-your-migration/
  - /migration-assistant/migration-phases/planning-your-migration/assessing-your-cluster-for-migration/
---

# Assessment

Assessment is where you decide whether your migration should be simple, staged, or zero-downtime. The goal is not to memorize every breaking change. The goal is to identify the issues that will affect your workflow configuration, your cutover plan, and your application behavior before you start moving data.

## What to answer before you migrate

Make sure you can answer these questions first:

- Is your source and target path supported?
- Do you need planned downtime, or do you need Capture and Replay?
- Can the source create snapshots, and can Migration Assistant read them?
- What authentication model will be used for source and target?
- Are there mapping or field transformations you already know you need?
- Which components will need separate manual migration, such as security, ILM or ISM, pipelines, or dashboards?

## Use the breaking changes tool first

Before you build the workflow, review the breaking changes for your source and target versions. Use the selector that follows.to narrow the changes that matter for your migration path.

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

## Think in terms of migration risk

Most migration risk falls into four buckets:

- **Application compatibility**: queries, aggregations, index names, aliases, or field names may need to change
- **Metadata compatibility**: mappings, templates, and settings may need transformations
- **Data movement**: snapshots, source S3 access, target ingest throughput, and large shards may affect runtime
- **Operational cutover**: you need to decide whether a write pause is acceptable or whether Capture and Replay is required

## Decide whether you need transformations

Migration Assistant already includes built-in metadata transformations for several common compatibility issues. Start by checking whether your migration falls into one of these categories:

- [Transform type mappings]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/)
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/)
- [Transform `flattened` fields to `flat_object`]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-flattened-flat-object/)
- [Transform `string` fields to `text` and `keyword`]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/)
- [Transform `dense_vector` fields to `knn_vector`]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/)

## Validate the application, not only the cluster

A migration is only finished when the application behaves correctly on the target.

Before cutover, plan to validate:

- representative reads and writes
- dashboards or saved searches that depend on mappings
- aggregations or sorts that depend on exact field behavior
- any client-side assumptions about aliases, index names, or field names

If you are using custom transformations, always run a pilot first.

## Platform questions matter too

If you are on AWS, decide early whether you want to own the platform details yourself or let EKS handle more of them.

- Use **generic Kubernetes** when you already operate your own Kubernetes platform and are comfortable wiring AWS identity, images, storage, and observability yourself.
- Use **Amazon EKS** when you want the recommended AWS production path with bootstrap automation, pod identity, snapshot helpers, and CloudWatch integration.

## Recommended next step

After assessment, the next best step is to choose the deployment path and then build a small pilot workflow.

{% include migration-phase-navigation.html %}
