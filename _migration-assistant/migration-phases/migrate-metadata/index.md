---
layout: default
title: Migrate metadata
nav_order: 5
parent: Migration phases
has_children: true
has_toc: true
permalink: /migration-assistant/migration-phases/migrate-metadata/
redirect_from:
  - /migration-assistant/migration-phases/migrating-metadata/
  - /migration-phases/migrating-metadata/
  - /migration-assistant/deploying-migration-assistant/getting-started-data-migration/
---

# Migrate metadata

Metadata migration transfers index settings, mappings, templates, component templates, and aliases from the source cluster to the target. In Migration Assistant 3.0, metadata migration runs as an automated step within the workflow — you configure it in your workflow YAML and the workflow engine handles execution.

## How it works

When you include `metadataMigrationConfig` in your workflow configuration, the workflow executes two steps automatically:

1. **evaluateMetadata** — Scans the source snapshot, applies filtering and transformations, and produces a list of items that will be migrated. This is a dry run — nothing is written to the target.
2. **migrateMetadata** — Applies the evaluated items to the target cluster. Items that already exist on the target are skipped.

If `skipApprovals` is `false` (the default), the workflow pauses between evaluate and migrate for your approval. Use `workflow manage` or `workflow approve` to continue.

## Configuration

Metadata migration is configured inside `metadataMigrationConfig` in your workflow YAML. Run `workflow configure sample` on the Migration Console to see all available options for your version.

Key options:

| Option | Description |
|:-------|:------------|
| `indexAllowlist` | List of indexes to migrate (regex supported with `regex:` prefix) |
| `indexTemplateAllowlist` | List of index templates to migrate |
| `componentTemplateAllowlist` | List of component templates to migrate |
| `multiTypeBehavior` | How to handle ES 6.x multi-type indexes: `NONE`, `UNION`, or `SPLIT` |
| `allowLooseVersionMatching` | Allow migration across version gaps with best-effort compatibility |

### Example configuration

```json
{
  "metadataMigrationConfig": {
    "indexAllowlist": ["products", "users", "regex:logs-.*"],
    "multiTypeBehavior": "UNION"
  }
}
```
{% include copy.html %}

This is placed inside the `migrations` array in your workflow configuration. See [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/) for the full configuration structure.

## Monitoring metadata migration

```bash
# Interactive TUI — watch the evaluateMetadata and migrateMetadata steps
workflow manage

# Check status
workflow status

# View logs for metadata steps
workflow output
```
{% include copy.html %}

## Metadata verification

After metadata migration completes, verify the results before proceeding to document backfill:

```bash
# Check indexes on the target
console clusters curl target -- "/_cat/indices?v"

# Check templates
console clusters curl target -- "/_cat/templates?v"

# Check aliases
console clusters curl target -- "/_cat/aliases?v"

# Check a specific index mapping
console clusters curl target -- "/my-index/_mapping"
```
{% include copy.html %}

## What gets migrated

| Component | Migrated |
|:----------|:---------|
| Index settings (shards, replicas, analyzers) | ✓ |
| Index mappings (field types, dynamic templates) | ✓ |
| Index templates (legacy) | ✓ |
| Composable index templates | ✓ |
| Component templates | ✓ |
| Aliases | ✓ |
| ISM/ILM policies | ✗ — Recreate manually |
| Security configuration | ✗ — Configure separately |
| Ingest pipelines | ✗ — Recreate manually |

## Troubleshooting

### Viewing metadata migration logs

If a metadata step fails, check the workflow output:

```bash
workflow output
```
{% include copy.html %}

For detailed logs, use the interactive TUI:

```bash
workflow manage
```
{% include copy.html %}

### Warnings and errors

When encountering `WARN` or `ERROR` in the output, they will be accompanied by a short message, such as `WARN - my_index already exists`. Items that already exist on the target are skipped — this is expected behavior when resubmitting a workflow.

### OpenSearch running in compatibility mode

If you see an error about being unable to update an ES 7.10.2 cluster, compatibility mode may be enabled on the OpenSearch target. Disable it to continue. See [Enable compatibility mode](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-upgrade).

### Breaking change compatibility

Metadata migration transforms data from the source version to the target version. Some features may not be supported across version gaps. When encountering a compatibility issue, [search existing issues](https://github.com/opensearch-project/opensearch-migrations/issues) or [create a new issue](https://github.com/opensearch-project/opensearch-migrations/issues/new/choose).

For information about handling specific field type compatibility issues, see:
- [Transform type mappings]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/) — Handle deprecated mapping types from Elasticsearch 6.x.
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) — Configure custom field type transformations.
- [Transform `flattened` to `flat_object` fields]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-flattened-flat-object/) — Automatically transform `flattened` to `flat_object` fields.
- [Transform `string` to `text`/`keyword` fields]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/) — Automatically transform `string` to `text`/`keyword` fields.
- [Transform `dense_vector` to `knn_vector` fields]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/) — Automatically transform `dense_vector` to `knn_vector` fields.

#### Deprecation of mapping types

In Elasticsearch 6.8 the mapping types feature was discontinued in Elasticsearch 7.0+, which creates complexity when migrating to newer versions. Metadata migration handles this by removing the type mapping and restructuring the template or index properties.

**Example starting state with mapping type foo (ES 6):**

```json
{
  "mappings": [
    {
      "foo": {
        "properties": {
          "field1": { "type": "text" },
          "field2": { "type": "keyword" }
        }
      }
    }
  ]
}
```
{% include copy.html %}

**Example ending state with foo removed (ES 7+/OpenSearch):**

```json
{
  "mappings": {
    "properties": {
      "field1": { "type": "text" },
      "field2": { "type": "keyword" }
    }
  }
}
```
{% include copy.html %}

Configure `multiTypeBehavior` in your `metadataMigrationConfig` to control how multi-type indexes are handled: `NONE` (fail), `UNION` (merge types), or `SPLIT` (separate indexes).

{% include migration-phase-navigation.html %}
