---
layout: default
title: dense_vector to knn_vector conversion
nav_order: 5
parent: Migrate metadata
grand_parent: Migration phases
permalink: /migration-assistant/migration-phases/migrate-metadata/handling-dense-vector-conversion/
---

# dense_vector to knn_vector conversion

Convert mapping type dense_vector to OpenSearch knn_vector.

This guide explains how the Migration Assistant automatically handles the conversion of Elasticsearch's `dense_vector` field type to OpenSearch's `knn_vector` field type during migration.

## Overview

The `dense_vector` field type was introduced in Elasticsearch 7.x for storing dense vectors used in machine learning and similarity search applications. When migrating from Elasticsearch 7.x to OpenSearch, the Migration Assistant automatically converts `dense_vector` fields to OpenSearch's equivalent `knn_vector` type.

This conversion includes mapping the vector configuration parameters and enabling the necessary OpenSearch k-NN plugin settings.

## Compatibility

The `dense_vector` to `knn_vector` conversion applies to:
- **Source clusters**: Elasticsearch 7.x with dense_vector fields
- **Target clusters**: OpenSearch (any version)
- **Automatic conversion**: No configuration required

## Automatic conversion logic

The Migration Assistant performs the following transformations when converting `dense_vector` to `knn_vector`:

### Field type conversion
- Changes `type: "dense_vector"` to `type: "knn_vector"`
- Maps `dims` parameter to `dimension`
- Converts similarity metrics to OpenSearch space types
- Configures HNSW algorithm with Lucene engine

### Similarity mapping
The conversion maps Elasticsearch similarity functions to OpenSearch space types:
- `cosine` → `cosinesimil`
- `dot_product` → `innerproduct`
- `l2` (default) → `l2`

### Index settings
When dense_vector fields are converted, the Migration Assistant automatically:
- Enables the k-NN plugin by setting `index.knn: true`
- Ensures proper index configuration for vector search

## Migration output

During the migration process, you'll see this transformation in the output:

```
Transformations:
   dense_vector to knn_vector:
      Convert mapping type dense_vector to OpenSearch knn_vector
```

## Example transformations

### Basic dense_vector conversion

<table>
<tr>
<th>Source Field Type</th>
<th>Target Field Type</th>
</tr>
<tr>
<td>
<pre><code class="language-json">{
  "properties": {
    "embedding": {
      "type": "dense_vector",
      "dims": 128,
      "similarity": "cosine"
    }
  }
}</code></pre>
</td>
<td>
<pre><code class="language-json">{
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
</table>

### Advanced configuration with index options

<table>
<tr>
<th>Source Field Type</th>
<th>Target Field Type</th>
</tr>
<tr>
<td>
<pre><code class="language-json">{
  "properties": {
    "vector_field": {
      "type": "dense_vector",
      "dims": 256,
      "similarity": "dot_product",
      "index_options": {
        "m": 16,
        "ef_construction": 200
      }
    }
  }
}</code></pre>
</td>
<td>
<pre><code class="language-json">{
  "properties": {
    "vector_field": {
      "type": "knn_vector",
      "dimension": 256,
      "method": {
        "name": "hnsw",
        "engine": "lucene",
        "space_type": "innerproduct",
        "parameters": {
          "encoder": {
            "name": "sq"
          },
          "m": 16,
          "ef_construction": 200
        }
      }
    }
  }
}</code></pre>
</td>
</tr>
</table>

### Multiple vector fields

<table>
<tr>
<th>Source Field Type</th>
<th>Target Field Type</th>
</tr>
<tr>
<td>
<pre><code class="language-json">{
  "properties": {
    "title_embedding": {
      "type": "dense_vector",
      "dims": 384,
      "similarity": "cosine"
    },
    "content_embedding": {
      "type": "dense_vector",
      "dims": 768,
      "similarity": "l2"
    },
    "title": {
      "type": "text"
    }
  }
}</code></pre>
</td>
<td>
<pre><code class="language-json">{
  "properties": {
    "title_embedding": {
      "type": "knn_vector",
      "dimension": 384,
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
    },
    "content_embedding": {
      "type": "knn_vector",
      "dimension": 768,
      "method": {
        "name": "hnsw",
        "engine": "lucene",
        "space_type": "l2",
        "parameters": {
          "encoder": {
            "name": "sq"
          }
        }
      }
    },
    "title": {
      "type": "text"
    }
  }
}</code></pre>
</td>
</tr>
</table>

## Configuration details

### HNSW algorithm parameters

The conversion automatically configures the HNSW (Hierarchical Navigable Small World) algorithm with:
- **Engine**: `lucene` (OpenSearch's default)
- **Encoder**: `sq` (scalar quantization for memory efficiency)
- **Method**: `hnsw` (approximate nearest neighbor search)

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

## Migration scenarios

### Migrating from Elasticsearch 7.x

The Migration Assistant automatically converts all `dense_vector` fields during metadata migration. The k-NN plugin must be installed and enabled on the target OpenSearch cluster.

### Query compatibility

After migration, vector search queries need to be updated:
- Elasticsearch uses `script_score` queries with vector functions
- OpenSearch uses native `knn` query syntax

**Elasticsearch query example:**
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

**OpenSearch query example:**
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

If you encounter issues with dense_vector conversion:

1. **Verify k-NN plugin**: Ensure the k-NN plugin is installed and enabled on your target OpenSearch cluster:
   ```bash
   GET /_cat/plugins
   ```

2. **Check migration logs**: Review the detailed migration logs for any warnings or errors:
   ```bash
   tail /shared-logs-output/migration-console-default/*/metadata/*.log
   ```

3. **Validate mappings**: After migration, verify that the field types have been correctly converted:
   ```bash
   GET /your-index/_mapping
   ```

4. **Test vector search**: Verify that vector search functionality works with sample queries:
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

5. **Monitor performance**: Vector search performance may differ between Elasticsearch and OpenSearch. Monitor query performance and adjust HNSW parameters if needed.

## Related documentation

For additional help with field type transformations, see:
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) - Configure custom field type transformations
