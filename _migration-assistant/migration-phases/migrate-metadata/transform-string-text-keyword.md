---
layout: default
title: Transform string fields to text/keyword
nav_order: 4
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/
---

# Transform string fields to text/keyword

Older Elasticsearch versions used `string` as the primary text field type. Modern Elasticsearch and OpenSearch use `text` and `keyword` instead. Migration Assistant automatically converts legacy `string` fields into modern `text` or `keyword` mappings during metadata migration.

## Built-in transformation behavior

Migration Assistant chooses the target field type based on how the original `string` field was configured:

- Analyzed string behavior becomes `text`.
- Non-analyzed or exact-match string behavior becomes `keyword`.

The transformation also removes or normalizes incompatible legacy mapping properties where needed.

## Identifying string fields

To verify whether your source uses `string` fields, run the following command:

```bash
console clusters curl source /_mapping
```
{% include copy.html %}

If the source mapping contains `"type":"string"`, this built-in transformation may apply.

## Post-migration validation

After metadata migration, verify the target mapping:

```bash
console clusters curl target /your-index/_mapping
workflow show
```
{% include copy.html %}

Then validate the application behavior that depends on those fields, especially:

- Term queries
- Aggregations
- Sorting
- Case-sensitive exact-match logic

## Custom transformer

Use a custom field type transformer if the built-in `string` conversion is not enough for your application semantics, for example if:

- You need custom multi-field behavior.
- You want field renaming at the same time.
- You need special cleanup of field properties.

