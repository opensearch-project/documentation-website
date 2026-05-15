---
layout: default
title: Transform dense_vector fields to knn_vector
nav_order: 5
parent: Migrate metadata
grand_parent: Migration workflows
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/
---

# Transform dense_vector fields to knn_vector

Migration Assistant can automatically convert Elasticsearch `dense_vector` mappings into OpenSearch `knn_vector` mappings during metadata migration.

## Why this matters

Vector fields are not only a rename problem. The target mapping needs to be valid for the OpenSearch k-NN model and the application may need query changes after migration.

## What the built-in transformation does

The metadata migration path can:

- convert `dense_vector` to `knn_vector`
- translate vector dimensions and related settings
- prepare the target mapping for OpenSearch vector search

Depending on the target, additional vector compatibility transforms may also apply, including Serverless-specific adjustments.

## How to check whether your source uses `dense_vector`

```bash
console clusters curl source /_mapping
```
{% include copy.html %}

If the source mapping contains `"type":"dense_vector"`, inspect those indexes carefully during assessment and pilot validation.

## What to validate after metadata migration

Check the target mapping:

```bash
console clusters curl target /your-index/_mapping
workflow output
```
{% include copy.html %}

Also validate that the target cluster supports the vector-search features you intend to use.

## Application impact

Even when the mapping migration succeeds, query behavior may still need to change. Validate the search layer carefully if your application currently relies on Elasticsearch vector-query patterns.

## When extra work may be required

Pay special attention when:

- the target is OpenSearch Serverless
- the target version has vector-engine compatibility constraints
- the application relies on specific vector-query syntax or ranking behavior

These are good cases for a pilot migration with representative queries before cutover.
