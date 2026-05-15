---
layout: default
title: Transform field types
nav_order: 2
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/
redirect_from:
  - /migration-assistant/migration-phases/assessment/handling-field-type-breaking-changes/
  - /migration-assistant/migration-phases/planning-your-migration/handling-field-type-breaking-changes/
---

# Transform field types

Migration Assistant already knows how to handle several common field-type compatibility problems during metadata migration. This page explains when the built-in transformations are enough and when you need a custom transformer.

## Start with the built-in transformations

Before you build custom logic, check whether the migration is already covered by the built-in metadata transformations:

- `string` to `text` and `keyword`
- `flattened` to `flat_object`
- `dense_vector` to `knn_vector`
- additional vector compatibility adjustments for newer OpenSearch and Serverless targets

For many migrations, that is enough.

## When to create a custom field-type transformer

Use a custom transformer only when:

- the built-in rules do not match your target behavior
- your application requires a specific field rewrite
- you need to remove or adjust mapping properties in a way the defaults do not cover

## How custom transformers fit into the workflow model

In the current workflow model, custom metadata transformations are configured through metadata migration settings such as:

- `transformerConfig`
- `transformerConfigBase64`
- `transformerConfigFile`

Start with:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

If you use `transformerConfigFile`, the file must exist inside the container environment. That is an expert path and usually means mounting the file or baking it into the image.

## Example custom transformer pattern

Advanced users can supply a JavaScript-based metadata transformer through `JsonJSTransformerProvider`.

Typical use cases include:

- replacing deprecated field types
- removing incompatible mapping properties
- normalizing field definitions before they reach the target

## Example transformation descriptor

```json
[
  {
    "JsonJSTransformerProvider": {
      "initializationScriptFile": "/shared-logs-output/field-type-converter.js",
      "bindingsObject": "{}"
    }
  }
]
```
{% include copy.html %}

## Workflow guidance

Treat custom transformers as a last-mile compatibility tool, not as the starting point for every migration.

The safest sequence is:

1. run assessment
2. inspect the built-in transformation pages
3. configure a pilot workflow
4. add a custom transformer only if the pilot shows you need one

## Validate the transformed metadata

After the metadata phase runs, verify the target mappings:

```bash
console clusters curl target /my-index/_mapping
workflow output
```
{% include copy.html %}

If a custom transformer changes field names or semantics, validate application queries before proceeding to full backfill or cutover.
