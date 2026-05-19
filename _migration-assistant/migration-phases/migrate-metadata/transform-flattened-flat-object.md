---
layout: default
title: Transform flattened fields to flat_object
nav_order: 3
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-flattened-flat-object/
---

# Transform flattened fields to flat_object

Migration Assistant can automatically convert Elasticsearch `flattened` fields into OpenSearch `flat_object` fields during metadata migration.

## When this applies

This transformation matters when:

- the source contains `flattened` mappings
- the target supports `flat_object`

If the target does not support the equivalent field behavior you need, plan a custom transformation instead.

## What the workflow does automatically

During metadata migration, built-in transformations detect `flattened` field definitions and rewrite them to `flat_object`.

That means most users do not need to configure anything manually.

## How to check whether your source uses `flattened`

```bash
console clusters curl source /_mapping
```
{% include copy.html %}

If the source mapping contains `"type":"flattened"`, this compatibility path may apply.

## What to validate after migration

After the metadata phase, verify that the target mappings look the way you expect:

```bash
console clusters curl target /your-index/_mapping
workflow show
```
{% include copy.html %}

## When automatic conversion is not enough

Use a custom metadata transformer if:

- the target version does not support the field behavior you need
- you want to convert `flattened` into a different target type
- you need additional property cleanup beyond the built-in transformation

## What to watch for in the application

Even when the mapping conversion succeeds, validate:

- representative queries
- aggregations
- dashboards or visualizations that depend on the field

The migration is only successful if the target behavior still matches what the application expects.
