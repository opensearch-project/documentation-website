---
layout: default
title: Migrate metadata
nav_order: 5
parent: Migration workflows
has_children: true
has_toc: true
permalink: /migration-assistant/migration-phases/migrate-metadata/
redirect_from:
  - /migration-assistant/migration-phases/migrating-metadata/
  - /migration-phases/migrating-metadata/
  - /migration-assistant/deploying-migration-assistant/getting-started-data-migration/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/migrate-metadata/
---

# Migrate metadata

Metadata migration moves the target cluster into a shape that can accept the incoming data and traffic. It processes mappings, templates, aliases, and other index-level definitions before document backfill or replay becomes meaningful.

In the workflow model, metadata migration is a configured phase inside the migration workflow.

## Metadata workflow steps

When `metadataMigrationConfig` is present, the workflow runs two logical steps:

1. `evaluateMetadata`
2. `migrateMetadata`

The first step evaluates what would be applied. The second step writes those changes to the target. If approvals are enabled, the workflow can pause between these steps so you can inspect the result before continuing.

## Metadata migration scope

Metadata migration can process:

- Index settings
- Index mappings
- Legacy and composable templates
- Component templates
- Aliases

It does not automatically migrate everything around the cluster. Plan separate work for security configuration, ISM or ILM policies, ingest pipelines, dashboards or Kibana objects, and other environment-specific assets.

## Built-in transformations

The current metadata migration path already includes built-in transformations for several common compatibility issues, including:

- `string` to `text` and `keyword`
- `flattened` to `flat_object`
- `dense_vector` to `knn_vector`
- Additional vector compatibility transformations for newer OpenSearch and Serverless targets.

If your migration needs more than the built-ins, you can also supply custom metadata transformers through `transformerConfig`, `transformerConfigBase64`, or `transformerConfigFile`.

## Important configuration fields

Useful metadata settings include:

- `indexAllowlist`
- `indexTemplateAllowlist`
- `componentTemplateAllowlist`
- `multiTypeBehavior`
- `allowLooseVersionMatching`
- `transformerConfig*`

Use the version-matched sample from your console to see the exact structure for your installed release. (*Version-matched* means the schema corresponds to the Migration Assistant version installed in your console pod---`workflow configure sample --load` reads the schema from `/root/.workflowUser.schema.json` on that pod, so the loaded sample always has the fields that release supports.) To load and edit the sample, run the following commands:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

## Index filtering behavior

The metadata `indexAllowlist` is evaluated after the snapshot has already been taken. It supports:

- Exact index names
- Regex patterns prefixed with `regex:`

This is different from the snapshot creation allow list, which uses the source cluster's own snapshot multi-index expression syntax.

## Multi-type behavior

If your migration involves older Elasticsearch data sets with multi-type mappings, set `multiTypeBehavior` intentionally:

- `NONE` to fail when multi-type data is encountered.
- `UNION` to merge types into one mapping
- `SPLIT` to route types into separate indexes.

Do not guess here. Pilot it first on a small subset if multi-type behavior matters to your application.

## Validate metadata before continuing

After metadata migration runs, verify the target before moving to full backfill or cutover:

```bash
console clusters curl target /_cat/indices?v
console clusters curl target /_cat/templates?v
console clusters curl target /_cat/aliases?v
console clusters curl target /my-index/_mapping
```
{% include copy.html %}

## Monitor and troubleshoot

Use the workflow tools rather than raw pod paths whenever possible:

```bash
workflow manage
workflow status
workflow log all
```
{% include copy.html %}

If metadata migration fails, the usual causes are:

- Incompatible mappings or settings
- Missing transformations
- Unsupported target-side features
- Authentication or connectivity issues to the target.

{% include migration-phase-navigation.html %}
