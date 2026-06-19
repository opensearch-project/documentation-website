---
layout: default
title: OpenSearch JVector Plugin
nav_order: 25
redirect_from:
  - /install-and-configure/additional-plugins/opensearch-jvector/
---

# OpenSearch JVector Plugin Documentation

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start Guide](#quick-start-guide)
- [Usage](#usage)
- [Advanced Features](#advanced-features)
- [Limitations](#limitations)
- [Support](#support)

---

## Overview

### What is OpenSearch JVector Plugin?

The OpenSearch JVector Plugin is a high-performance vector search solution that enables approximate nearest neighbor (ANN) search on large-scale datasets. Built on the pure Java JVector library, it provides significant performance improvements over traditional implementations, particularly in memory-constrained environments.

### Key Benefits

- **High Performance**: Thread-safe concurrent indexing and optimized query execution
- **Scalable**: Handle billions of vectors using DiskANN implementation
- **Memory Efficient**: Product Quantization support reduces memory usage up to 64x
- **Fast Updates**: Incremental merges eliminate full index rebuilds (50-100x faster)
- **Pure Java**: No native dependencies or complex build requirements

### When to Use This Plugin

**Ideal For:**
- Semantic search and document similarity
- Recommendation systems
- Image and video search
- Large-scale vector datasets (millions to billions of vectors)
- Memory-constrained environments

**Not Recommended For:**
- Small datasets (< 10,000 vectors) where standard solutions suffice
- Real-time updates requiring sub-second latency
- Applications requiring exact nearest neighbor search

---

## Installation

### Prerequisites

- **OpenSearch**: Version 3.5.0 or later
- **Java**: JDK 21 or later
- **Memory**: Minimum 4GB RAM recommended
- **Disk**: SSD recommended for optimal performance

> **Warning**: This plugin replaces the standard `opensearch-knn` plugin. Both cannot be installed simultaneously. Remove `opensearch-knn` before installation.

### Installation Steps

**1. Remove Existing KNN Plugin (if installed)**

```bash
cd /path/to/opensearch
bin/opensearch-plugin remove opensearch-knn
```

**2. Install JVector Plugin**

```bash
# Download and install from Maven
curl -O https://repo1.maven.org/maven2/org/opensearch/plugin/opensearch-jvector-plugin/3.5.0.0/opensearch-jvector-plugin-3.5.0.0.zip
bin/opensearch-plugin install file://`pwd`/opensearch-jvector-plugin-3.5.0.0.zip
```

**3. Start OpenSearch**

```bash
bin/opensearch
```

**4. Verify Installation**

```bash
curl -X GET "localhost:9200/_cat/plugins?v"
```

Expected output:
```
name    component           version
node-1  opensearch-jvector  3.5.0.0
```

---

## Quick Start Guide

### Step 1: Create an Index

```bash
curl -X PUT "http://localhost:9200/my-vector-index" -H "Content-Type: application/json" -d '
{
  "settings": {
    "index.knn": true,
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 8,
        "method": {
          "name": "disk_ann",
          "engine": "jvector",
          "space_type": "l2",
          "parameters": {
            "m": 16,
            "ef_construction": 100
          }
        }
      },
      "title": {
        "type": "text"
      }
    }
  }
}'
```

**Key Parameters:**
- `index.knn: true`: Required to activate KNN functionality
- `dimension`: Vector size (must match your embeddings exactly)
- `method.engine: "jvector"`: Selects the JVector engine
- `method.name: "disk_ann"`: The only available algorithm for JVector
- `space_type`: Similarity metric (`l2`, `cosinesimil`, or `innerproduct`)
- `ef_construction`: Build quality (higher = better recall, slower indexing)
- `m`: Graph connectivity (higher = better recall, more memory)

### Step 2: Index Documents

```bash
# Index a single document
curl -X POST "http://localhost:9200/my-vector-index/_doc/1" -H "Content-Type: application/json" -d '
{
  "my_vector": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
  "title": "First document"
}'

# Index another document
curl -X POST "http://localhost:9200/my-vector-index/_doc/2" -H "Content-Type: application/json" -d '
{
  "my_vector": [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
  "title": "Second document"
}'

# Refresh the index
curl -X POST "http://localhost:9200/my-vector-index/_refresh"
```

### Step 3: Search

```bash
curl -X POST "http://localhost:9200/my-vector-index/_search" -H "Content-Type: application/json" -d '
{
  "size": 5,
  "query": {
    "knn": {
      "my_vector": {
        "vector": [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85],
        "k": 5
      }
    }
  }
}'
```

**Search with Filters:**

```bash
curl -X POST "http://localhost:9200/my-vector-index/_search" -H "Content-Type: application/json" -d '
{
  "size": 5,
  "query": {
    "bool": {
      "must": {
        "knn": {
          "my_vector": {
            "vector": [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85],
            "k": 10
          }
        }
      },
      "filter": {
        "term": { "category": "electronics" }
      }
    }
  }
}'
```

---

## Usage

### Configuration Reference

**Index Settings:**

| Setting | Description | Default | Recommended |
|---------|-------------|---------|-------------|
| `index.knn` | Enable KNN functionality | false | true (required) |
| `number_of_shards` | Primary shards | 1 | 1-5 based on data size |
| `number_of_replicas` | Replica shards | 1 | 1-2 for production |

**Vector Field Parameters:**

| Parameter | Description | Range | Default |
|-----------|-------------|-------|---------|
| `dimension` | Vector size | 1-16000 | Required |
| `ef_construction` | Index build quality | 50-500 | 100 |
| `m` | Graph connections | 8-64 | 16 |
| `ef_search` | Query-time quality | k-1000 | 100 |

**Space Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| `cosinesimil` | Cosine similarity | Text embeddings, normalized vectors |
| `l2` | Euclidean distance | General purpose |
| `innerproduct` | Dot product | Recommendation systems |

### Performance Tuning

**For Better Recall:**
```json
{
  "method": {
    "parameters": {
      "ef_construction": 200,
      "m": 32
    }
  }
}
```

**For Faster Indexing:**
```json
{
  "settings": {
    "refresh_interval": "30s",
    "number_of_replicas": 0
  }
}
```

**For Faster Queries:**
```json
{
  "query": {
    "knn": {
      "embedding": {
        "vector": [...],
        "k": 10,
        "method_parameters": {
          "ef_search": 50
        }
      }
    }
  }
}
```

> **Note**: Lower `ef_search` improves speed but may reduce recall. Start with default (100) and adjust based on your requirements.

---

## Advanced Features

### 1. Product Quantization (Memory Reduction)

Compress vectors to reduce memory usage significantly.

```bash
curl -X PUT "http://localhost:9200/pq-index" -H "Content-Type: application/json" -d '
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "embedding": {
        "type": "knn_vector",
        "dimension": 768,
        "method": {
          "name": "disk_ann",
          "engine": "jvector",
          "space_type": "l2",
          "parameters": {
            "m": 16,
            "ef_construction": 100,
            "advanced.num_pq_subspaces": 192,
            "advanced.min_batch_size_for_quantization": 1024
          }
        }
      }
    }
  }
}'
```

**Configuration Rules:**
- `num_pq_subspaces` must be ≤ `dimension` and ideally a divisor of `dimension`
- Quantization training triggers automatically once segment has at least `min_batch_size_for_quantization` documents
- More subspaces = less compression but better recall

**Default Subspaces by Dimension:**

| Dimension | Default Subspaces |
|-----------|-------------------|
| 384 | 96 |
| 768 | 192 |
| 1536 | 192 |
| 3072 | 384 |

**Trade-offs:**
- Memory: Significant reduction (configurable compression ratio)
- Recall: Approximately 90-95% of original (depends on configuration)
- Speed: Faster for large datasets
- Best for large datasets with memory constraints

### 2. MMR Search (Diverse Results)

Balance relevance and diversity in search results.

> **Warning**: Requires cluster configuration. This feature is experimental and may change in future versions.

**Enable MMR Processors:**

```bash
curl -X PUT "localhost:9200/_cluster/settings" -H "Content-Type: application/json" -d '
{
  "persistent": {
    "cluster.search.enabled_system_generated_factories": [
      "mmr_over_sample_factory",
      "mmr_rerank_factory"
    ]
  }
}'
```

**Use MMR in Queries:**

```bash
curl -X POST "http://localhost:9200/my-index/_search" -H "Content-Type: application/json" -d '
{
  "size": 5,
  "query": {
    "knn": {
      "restaurant_embedding": {
        "vector": [1.0, 1.0, 1.0, 1.0, 1.0],
        "k": 5
      }
    }
  },
  "ext": {
    "mmr": {
      "diversity": 0.5,
      "candidates": 8
    }
  }
}'
```

**Parameters:**
- `diversity`: 0.0 (max diversity) to 1.0 (max relevance), default: 0.5
- `candidates`: Initial results to consider, default: 3 × k

### 3. Derived Source (Storage Optimization)

Reduce storage by reconstructing vectors from index data instead of storing in `_source`.

> **Warning**: This feature has version-specific behavior. Verify compatibility with your OpenSearch version.

**For OpenSearch 3.5-3.6:**

```json
{
  "settings": {
    "index.knn": true,
    "index.knn.derived_source.enabled": true
  }
}
```

**For OpenSearch 3.7+:**

```json
{
  "settings": {
    "index.knn": true,
    "index.derived_source.enabled": true
  }
}
```

**Limitations:**
- `_source` must remain enabled
- Cannot use `copy_to` directive
- Nested objects support varies by version
- Requires reindexing to change settings

For detailed information, see [Derived Source Documentation](docs/derived_source.md).

### 4. Hybrid Search (Vector + Text)

Combine vector similarity with traditional text search.

```bash
curl -X POST "http://localhost:9200/my-index/_search" -H "Content-Type: application/json" -d '
{
  "size": 10,
  "query": {
    "bool": {
      "should": [
        {
          "knn": {
            "my_vector": {
              "vector": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
              "k": 10
            }
          }
        },
        {
          "match": {
            "title": {
              "query": "laptop computer",
              "boost": 0.3
            }
          }
        }
      ]
    }
  }
}'
```

---

## Limitations

### General Limitations

- **Vector Dimensions**: Maximum 16,000; recommended 128-1024 for optimal performance
- **Data Types**: Float32 vectors only; no NaN or Infinity values
- **Plugin Conflicts**: Cannot coexist with `opensearch-knn` plugin
- **Version Requirements**: OpenSearch 3.5.0+, Java 21+

### Feature-Specific Constraints

**Product Quantization:**
- Dimension must be divisible by compression factor
- Recall may decrease with higher compression ratios
- Retraining codebooks requires reindexing

**MMR Search:**
- Requires explicit cluster setting enablement
- Oversampling increases query latency
- Not compatible with all query types

**Derived Source:**
- `_source` must remain enabled
- Cannot use `copy_to` directive
- Nested objects support varies by version
- Requires reindexing to change settings

### Performance Considerations

- First query after index creation may be slower (cold start)
- Large segment merges can temporarily impact query performance
- Concurrent indexing and searching may compete for resources
- Disk I/O bandwidth critical for DiskANN performance

**Mitigation Strategies:**
- Warm up indices with sample queries after creation
- Schedule force merges during low-traffic periods
- Allocate dedicated resources for indexing vs. search workloads
- Use SSDs for optimal disk-based operations

---

## Support

- [Documentation](https://github.com/opensearch-project/opensearch-jvector)

### Community Support

**Get Help:**
- [OpenSearch Forum](https://forum.opensearch.org/c/plugins/k-nn/48) - Ask questions and discuss
- [GitHub Issues](https://github.com/opensearch-project/opensearch-jvector/issues) - Report bugs
- [GitHub Discussions](https://github.com/opensearch-project/opensearch-jvector/discussions) - General questions

**When Reporting Issues:**

Please include:
1. OpenSearch and plugin versions
2. Index configuration (mappings and settings)
3. Query example
4. Error messages or unexpected behavior
5. Relevant logs

**Example:**
```
Environment:
- OpenSearch: 3.5.0
- JVector Plugin: 3.5.0.0

Issue: Low recall on vector search

Configuration:
{
  "mappings": {
    "properties": {
      "embedding": {
        "type": "knn_vector",
        "dimension": 128,
        "method": {
          "name": "disk_ann",
          "engine": "jvector",
          "space_type": "cosinesimil",
          "parameters": {
            "ef_construction": 100,
            "m": 16
          }
        }
      }
    }
  }
}

Expected: Recall > 90%
Actual: Recall ~70%
```