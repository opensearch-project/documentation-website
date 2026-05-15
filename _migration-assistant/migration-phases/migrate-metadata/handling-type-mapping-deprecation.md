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
---

# Transform type mappings

This page explains how to handle deprecated Elasticsearch mapping types when they appear in data you are migrating to modern OpenSearch targets.

## Why this matters

Older Elasticsearch data sets could contain multiple mapping types per index. Modern OpenSearch expects a single mapping model. If your snapshot contains older multi-type definitions, you need to decide how Migration Assistant should interpret them.

## The main choice: Fail, merge, or split

Use `metadataMigrationConfig.multiTypeBehavior` to control what happens when multi-type mappings are encountered:

- `NONE`: fail and make you handle the issue explicitly
- `UNION`: merge the types into one mapping
- `SPLIT`: route types into separate indexes

These choices have application-level consequences. `UNION` is simpler operationally, while `SPLIT` may preserve clearer semantics at the cost of index-name changes.

## When to use each option

The following sections describe when each option is appropriate.

### `NONE`

Use this when you want the migration to stop rather than make an implicit decision for you.

### `UNION`

Use this when the types are compatible enough to coexist under one merged mapping and your application can live with one target index.

### `SPLIT`

Use this when different types should become different target indexes, or when merging them would create field conflicts or confusing application behavior.

## Workflow-first guidance

Do not reach for old manual transformer commands first. In the current workflow model, start by:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Set `multiTypeBehavior`, run a pilot, and validate the resulting target mappings and index layout before migrating the full dataset.

## Example outcome

A legacy source might contain a mapping like:

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

After migration, that data cannot remain in this exact shape on a modern target. The workflow must either merge or split the result according to your chosen strategy.

## When custom type transformers are still useful

If the built-in `multiTypeBehavior` choices are not enough, advanced users can still supply custom transformer configuration through the metadata migration settings.

That is an expert path. Use it when:

- the target index naming must follow a specific pattern
- only selected types should migrate
- you need different routing logic than the built-in workflow choices

## Validate the result

After the pilot metadata run, check:

- resulting target index names
- field conflicts introduced by merges
- alias and template behavior
- application queries that assume a specific index layout

If this transformation changes index names or field semantics, your client configuration may need to change too.
