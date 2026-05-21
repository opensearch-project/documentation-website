---
layout: default
title: Transform flattened fields to flat_object
nav_order: 3
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-flattened-flat-object/
---

# Transform flattened fields to flat_object

Migration Assistant automatically converts Elasticsearch `flattened` fields into OpenSearch `flat_object` fields during metadata migration when the source contains `flattened` mappings and the target supports `flat_object`. If the target does not support the equivalent field behavior you need, plan a custom transformation instead.

## Built-in transformation behavior

During metadata migration, built-in transformations detect `flattened` field definitions and rewrite them to `flat_object` automatically. No manual configuration is required.

## Identifying flattened fields

To verify whether your source uses `flattened` fields, run the following command:

```bash
console clusters curl source /_mapping
```
{% include copy.html %}

If the response contains `"type":"flattened"`, the automatic transformation applies during metadata migration.

## Post-migration validation

After the metadata phase, verify that the target mappings are correct:

```bash
console clusters curl target /your-index/_mapping
workflow show
```
{% include copy.html %}

Also validate the following against the target:

- Representative queries
- Aggregations
- Dashboards or visualizations that depend on the field.

## Custom transformer

Use a custom metadata transformer if:

- The target version does not support the field behavior you need.
- You want to convert `flattened` into a different target type.
- You need additional property cleanup beyond the built-in transformation.
