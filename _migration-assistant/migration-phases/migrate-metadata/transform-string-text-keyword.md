---
layout: default
title: Transform string fields to text/keyword
nav_order: 4
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/
---

# Transform string fields to text/keyword

Migration Assistant automatically converts legacy Elasticsearch `string` fields into modern `text` or `keyword` mappings during metadata migration.

## Why this exists

Older Elasticsearch versions used `string` as the primary text field type. Modern Elasticsearch and OpenSearch use `text` and `keyword` instead.

That means old mappings need to be rewritten before the target can accept them cleanly.

## What the built-in transformation does

Migration Assistant chooses the target field type based on how the original `string` field was configured:

- analyzed string behavior becomes `text`
- non-analyzed or exact-match string behavior becomes `keyword`

The transformation also removes or normalizes incompatible legacy mapping properties where needed.

## How to check whether your source uses `string`

```bash
console clusters curl source /_mapping
```
{% include copy.html %}

If the source mapping contains `"type":"string"`, this built-in transformation may apply.

## What to validate after migration

After metadata migration, verify the target mapping:

```bash
console clusters curl target /your-index/_mapping
workflow output
```
{% include copy.html %}

Then validate the application behavior that depends on those fields, especially:

- term queries
- aggregations
- sorting
- case-sensitive exact-match logic

## When to use a custom transformer instead

Use a custom field-type transformer if the built-in `string` conversion is not enough for your application semantics, for example if:

- you need custom multi-field behavior
- you want field renaming at the same time
- you need special cleanup of field properties

For most migrations, the built-in conversion is the right starting point.
