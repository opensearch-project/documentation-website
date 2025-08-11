---
layout: default
title: Transform dense_vector to knn_vector
nav_order: 5
parent: Migrate metadata
grand_parent: Migration phases
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/
---

# Transform dense_vector to knn_vector fields


This guide explains how the Migration Assistant automatically handles the transformation of Elasticsearch's `dense_vector` field type to OpenSearch's `knn_vector` field type during migration.

## Overview

The `dense_vector` field type was introduced in Elasticsearch 7.x for storing dense vectors used in machine learning and similarity search applications. When migrating from Elasticsearch 7.x to OpenSearch, the Migration Assistant automatically converts `dense_vector` fields to OpenSearch's equivalent `knn_vector` type.

This transformation includes mapping the vector configuration parameters and enabling the necessary OpenSearch k-NN plugin settings.

To determine if an Elasticsearch cluster uses `dense_vector` field types, make a call to your source cluster's `GET /_mapping` api. On the Migration Console, run `console clusters curl source_cluster "/_mapping"`.  If you see `"type":"dense_vector"`, then this transformation is applicable and these fields will be automatically transformed during migration.

## Compatibility

The `dense_vector` to `knn_vector` transformation applies to:
- **Source clusters**: Elasticsearch 7.x+
- **Target clusters**: OpenSearch 1.x+
- **Automatic conversion**: No configuration required

## Automatic conversion logic

The Migration Assistant performs the following transformations when converting `dense_vector` to `knn_vector`.

### Field type transformation
- Changes `type: "dense_vector"` to `type: "knn_vector"`
- Maps `dims` parameter to `dimension`
- Converts similarity metrics to OpenSearch space types
- Configures HNSW algorithm with Lucene engine

### Similarity mapping
The transformation maps Elasticsearch similarity functions to OpenSearch space types:
- `cosine` → `cosinesimil`
- `dot_product` → `innerproduct`
- `l2` (default) → `l2`

### Index settings
When `dense_vector` fields are converted, the Migration Assistant automatically performs the following operations:
- Enables the k-NN plugin by setting `index.knn: true`
- Ensures proper index configuration for vector search

## Migration output

During the migration process, you'll see this transformation in the output:

```
Transformations:
   dense_vector to knn_vector:
      Convert field data type dense_vector to OpenSearch knn_vector
```

## Transformation behavior

<table style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px;">Source field type</th>
      <th style="border: 1px solid #ddd; padding: 8px;">Target field type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "embedding": {
      "type": "dense_vector",
      "dims": 128,
      "similarity": "cosine"
    }
  }
}</code></pre>
      </td>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "embedding": {
      "type": "knn_vector",
      "dimension": 128,
      "method": {
        "name": "hnsw",
        "engine": "lucene",
        "space_type": "cosinesimil",
        "parameters": {
          "encoder": {
            "name": "sq"
          }
        }
      }
    }
  }
}</code></pre>
      </td>
    </tr>
  </tbody>
</table>

### HNSW algorithm parameters

The transformation automatically configures the Hierarchical Navigable Small World (HNSW) algorithm with the following options:
- `engine`: `lucene` (OpenSearch default)
- `encoder`: `sq` (scalar quantization for memory efficiency)
- `method`: `hnsw` (approximate nearest neighbor search)

### Index options mapping

Elasticsearch `index_options` are mapped to OpenSearch HNSW parameters:
- `m` → `m` (maximum number of connections per node)
- `ef_construction` → `ef_construction` (size of dynamic candidate list)

### Index settings

When any `dense_vector` fields are converted, the following index setting is automatically added:

```json
{
  "settings": {
    "index.knn": true
  }
}
```

## Behavior differences

Migration Assistant automatically transforms all `dense_vector` fields during metadata migration. The k-NN plugin must be installed and enabled on the target OpenSearch cluster. Note: Most OpenSearch distributions include the k-NN plugin in which case no action is needed.

### Query compatibility

After migration, vector search queries need to be updated:
- Elasticsearch uses `script_score` queries with vector functions.
- OpenSearch uses native `knn` query syntax.

**Elasticsearch query example**:
```json
{
  "query": {
    "script_score": {
      "query": {"match_all": {}},
      "script": {
        "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
        "params": {"query_vector": [0.1, 0.2, 0.3]}
      }
    }
  }
}
```

**OpenSearch query example**:
```json
{
  "query": {
    "knn": {
      "embedding": {
        "vector": [0.1, 0.2, 0.3],
        "k": 10
      }
    }
  }
}
```

## Troubleshooting

If you encounter issues with `dense_vector` conversion:

1. **Verify the k-NN plugin** -- Ensure the k-NN plugin is installed and enabled on your target OpenSearch cluster:
   ```bash
   GET /_cat/plugins
   ```

2. **Check migration logs** -- Review the detailed migration logs for any warnings or errors:
   ```bash
   tail /shared-logs-output/migration-console-default/*/metadata/*.log
   ```

3. **Validate mappings** -- After migration, verify that the field types have been correctly converted:
   ```bash
   GET /your-index/_mapping
   ```

4. **Test vector search** -- Verify that vector search functionality works with sample queries:
   ```bash
   POST /your-index/_search
   {
     "query": {
       "knn": {
         "embedding": {
           "vector": [0.1, 0.2, 0.3],
           "k": 5
         }
       }
     }
   }
   ```

5. **Monitor performance** -- Vector search performance may differ between Elasticsearch and OpenSearch. Monitor query performance and adjust HNSW parameters if needed.

## Related documentation

- [Transform field types documentation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) -- Configure custom field type transformations.
- [k-NN documentation]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/approximate-knn/) -- Approximate k-NN search documentation.