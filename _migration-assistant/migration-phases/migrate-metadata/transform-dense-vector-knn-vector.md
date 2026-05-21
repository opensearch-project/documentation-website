---
layout: default
title: Transform dense_vector fields to knn_vector
nav_order: 5
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/
---

# Transform dense_vector fields to knn_vector

Migration Assistant can automatically convert Elasticsearch `dense_vector` mappings into OpenSearch `knn_vector` mappings during metadata migration. The target mapping must be valid for the OpenSearch k-NN model, and the application may need query changes after migration.

## Built-in transformation behavior

The metadata migration path can:

- Convert `dense_vector` to `knn_vector`.
- Translate vector dimensions and related settings.
- Prepare the target mapping for OpenSearch vector search.

Depending on the target, additional vector compatibility transforms may also apply, including Serverless-specific adjustments.

## Identifying dense_vector fields

To verify whether your source uses `dense_vector` fields, run the following command:

```bash
console clusters curl source /_mapping
```
{% include copy.html %}

If the source mapping contains `"type":"dense_vector"`, inspect those indexes carefully during assessment and pilot validation.

## Post-migration validation

Verify the target mapping:

```bash
console clusters curl target /your-index/_mapping
workflow show
```
{% include copy.html %}

Additionally, validate that the target cluster supports the vector search features you intend to use.

## Application impact

Even when the mapping migration succeeds, query behavior may still need to change. Validate the search layer carefully if your application currently relies on Elasticsearch vector query patterns.

## Additional considerations

Run a pilot migration with representative queries before cutover in the following cases:

- The target is OpenSearch Serverless.
- The target version has vector-engine compatibility constraints.
- The application relies on specific vector query syntax or ranking behavior.
