---
layout: default
title: Transform type mappings
nav_order: 1
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/
redirect_from:
  - /migration-assistant/migration-phases/assessment/handling-type-mapping-deprecation/
  - /migration-assistant/migration-phases/planning-your-migration/handling-type-mapping-deprecation/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/
---

# Transform type mappings

Older Elasticsearch data sets could contain multiple mapping types per index, as shown in the following example:

```json
{
  "mappings": {
    "book": {
      "properties": {
        "title": { "type": "text" }
      }
    },
    "movie": {
      "properties": {
        "title": { "type": "text" }
      }
    }
  }
}
```

Modern OpenSearch does not support this structure. If your snapshot contains multi-type definitions, the `metadataMigrationConfig.multiTypeBehavior` parameter controls how Migration Assistant handles them. The following table describes the valid values.

| Option | Behavior | Use when |
|:-------|:---------|:---------|
| `NONE` | Fails the migration when multi-type mappings are encountered. | You want to handle multi-type issues explicitly before proceeding. |
| `UNION` | Merges all types into one mapping in a single target index. | The types are compatible enough to coexist under one merged mapping. |
| `SPLIT` | Routes each type into a separate target index. | Different types should become different indexes, or merging them would create field conflicts. |

## Configuring multi-type behavior

Set `multiTypeBehavior` to the appropriate value in your workflow configuration, then run a pilot migration and validate the resulting target mappings and index layout before migrating the full dataset. To edit the workflow configuration, run the following commands:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

## Custom type transformer

If the built-in `multiTypeBehavior` choices are not enough, you can supply custom transformer configuration through the metadata migration settings.

That is an expert path. Use it when:

- The target index naming must follow a specific pattern.
- Only selected types should migrate.
- You need different routing logic than the built-in workflow choices.

## Validate the result

After the pilot metadata run, verify the following:

- Resulting target index names
- Field conflicts introduced by merges
- Alias and template behavior
- Application queries that assume a specific index layout.

If this transformation changes index names or field semantics, your client configuration may need to change too.
