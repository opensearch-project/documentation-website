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

Migration Assistant resolves several common field-type compatibility problems during metadata migration automatically. The following sections describe when the built-in transformations are sufficient and when you need a custom transformer.

## Built-in transformations

Before you build custom logic, verify whether the migration is already covered by the built-in metadata transformations:

- `string` to `text` and `keyword`
- `flattened` to `flat_object`
- `dense_vector` to `knn_vector`
- Additional vector compatibility adjustments for newer OpenSearch and Serverless NextGen targets.

## Custom field type transformer

Use a custom transformer only when:

- The built-in rules do not match your target behavior.
- Your application requires a specific field rewrite.
- You need to remove or adjust mapping properties in a way the defaults do not cover.

Custom metadata transformations are configured through the following metadata migration settings:

- `transformerConfig`
- `transformerConfigBase64`
- `transformerConfigFile`

To configure a custom transformer, load the sample configuration and edit the workflow:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Configuring `transformerConfigFile` requires additional setup and is intended for advanced use cases: the file must be accessible inside the Migration Console container. You can mount it as a Kubernetes volume or include it in a custom container image.

### JavaScript-based transformer

You can supply a JavaScript-based metadata transformer through `JsonJSTransformerProvider`. Typical use cases include:

- Replacing deprecated field types
- Removing incompatible mapping properties
- Normalizing field definitions before they reach the target.

### Example configuration

The following example shows a transformer descriptor that references a JavaScript file:

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

## Recommended sequence

Use custom transformers only after verifying that the built-in transformations do not cover your requirements. Follow this sequence:

1. Run the assessment.
2. Inspect the built-in transformation pages.
3. Configure a pilot workflow.
4. Add a custom transformer only if the pilot workflow results require one.

## Validate the transformed metadata

After the metadata phase runs, verify the target mappings:

```bash
console clusters curl target /my-index/_mapping
workflow show
```
{% include copy.html %}

If a custom transformer changes field names or semantics, validate application queries before proceeding to full backfill or cutover.
