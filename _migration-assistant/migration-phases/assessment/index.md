---
layout: default
title: Assessment
nav_order: 1
parent: Migration workflows
has_children: false
has_toc: false
permalink: /migration-assistant/migration-phases/assessment/
redirect_from:
  - /migration-assistant/migration-phases/planning-your-migration/assessing-your-cluster-for-migration/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/assessment/
---

# Assessment

At this stage, you'll determine the migration type for your use case. The goal is to identify the issues that affect your workflow configuration, your cutover plan, and your application behavior before you start moving data.

There are three migration types:

- **Simple** -- One snapshot-based backfill from source to target. You can plan a write pause, you only need to migrate document data and basic metadata, and there are no breaking changes that require transformations. Lowest operational complexity.
- **Staged** -- Multi-phase migration where you migrate metadata first, validate, then run backfill, and possibly migrate components in batches. Use this when you have many indexes, complex mappings, or breaking changes that need transformations or pilot validation.
- **Zero-downtime** -- Capture and Replay alongside backfill. Live writes are captured from the source through a proxy, buffered in Kafka, and replayed against the target after backfill catches up. Use this only when planned downtime is not acceptable.

## Questions to answer before you migrate

Make sure you can answer these questions first:

- Is your source and target path supported?
- Can you accept planned downtime, or do you need Capture and Replay?
- Can the source create snapshots, and can Migration Assistant read them?
- What authentication model will be used for source and target?
- Are there mapping or field transformations you already know you need?
- Which components need separate manual migration, such as security, ILM or ISM, pipelines, or dashboards?

## Breaking changes tool

Before you build the workflow, review the breaking changes for your source and target versions. Use the selector that follows to narrow the changes that matter for your migration path.

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

## Migration risk categories

Most migration risk falls into four buckets:

- **Application compatibility**: Queries, aggregations, index names, aliases, or field names may need to change.
- **Metadata compatibility**: Mappings, templates, and settings may need transformations.
- **Data movement**: Snapshots, source S3 access, target ingest throughput, and large shards may affect runtime.
- **Operational cutover**: You need to decide whether a write pause is acceptable or whether Capture and Replay is required.

## Decide whether you need transformations

Migration Assistant already includes built-in metadata transformations for several common compatibility issues. Start by checking whether your migration falls into one of these categories:

- [Transform type mappings]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/)
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/)
- [Transform `flattened` fields to `flat_object`]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-flattened-flat-object/)
- [Transform `string` fields to `text` and `keyword`]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/)
- [Transform `dense_vector` fields to `knn_vector`]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/)

## Application validation

A migration is only finished when the application behaves correctly on the target.

Before cutover, plan to validate:

- Representative reads and writes
- Dashboards or saved searches that depend on mappings.
- Aggregations or sorts that depend on exact field behavior.
- Any client-side assumptions about aliases, index names, or field names.

If you are using custom transformations, always run a pilot first.

## Platform considerations

If you are deploying on AWS, determine whether to manage the platform configuration yourself or use Amazon EKS to automate it:

- Use **generic Kubernetes** when you already operate your own Kubernetes platform and are proficient in configuring AWS identity, images, storage, and observability.
- Use **Amazon EKS** when you want the recommended AWS production path with bootstrap automation, pod identity, snapshot helpers, and CloudWatch integration.

## Next step

After assessment, the recommended next step is to choose the deployment path and then build a small pilot workflow.

{% include migration-phase-navigation.html %}
