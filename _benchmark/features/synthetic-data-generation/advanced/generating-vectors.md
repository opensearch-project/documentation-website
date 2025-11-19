---
layout: default
title: Generating vectors
nav_order: 15
parent: Advanced
grand_parent: Synthetic Data Generation
---

# Generating vectors

This document covers how to generate synthetic dense and sparse vectors with OpenSearch Benchmark's synthetic data generator using mappings.

## Concepts

### KNN Vectors (Dense Vectors)

Dense vectors (known as knn_vector mapping field type in OpenSearch) are numerical representations of data like text or images where most or all dimensions have non-zero values.

**Example**: Embedding for the word "dog"
```json
{
  "embedding": [0.234, -0.567, 0.123, 0.891, -0.234, 0.456, ..., 0.789]
}
```

### Sparse Vectors

Think of sparse vectors as a dictionary of important words with their importance scores.

**Example text**: "Korean jindos are hunting dogs that have a reputation for being loyal, independent, and confident."

**Sparse vector representation of example text**:
```json
{
  "5432": 0.85,   // "korean" - very important (specific descriptor)
  "7821": 0.78,   // "jindos" - very important (breed name)
  "2": 0.45,      // "dog" - moderately important (general category)
  "9999": 0.32,   // "loyal" - somewhat important (characteristic)
  "1111": 0.12    // "things" - less important (common word)
}
```
---

## Basic Usage

### Generating dense vectors

Generate random 128-dimensional vectors with minimal configuration.

**1. Create mapping file** (`simple-knn-mapping.json`):
```json
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "title": {"type": "text"},
      "my_embedding": {
        "type": "knn_vector",
        "dimension": 128
      }
    }
  }
}
```

**2. Generate data**:
```bash
opensearch-benchmark generate-data \
  --index-name my-vectors \
  --index-mappings simple-knn-mapping.json \
  --output-path ./output \
  --total-size 1
```

**Generated document**:
Of the documents generated, the `my_embedding` field for one document might look like this:
```json
{
  "title": "Sample text 42",
  "my_embedding": [0.234, -0.567, 0.123, ..., 0.891]  // 128 random floats [-1.0, 1.0]
}
```

### Generating sparse vectors

Generate sparse vectors with default configuration (10 tokens).

**1. Create mapping file** (`simple-sparse-mapping.json`):
```json
{
  "mappings": {
    "properties": {
      "content": {"type": "text"},
      "sparse_embedding": {
        "type": "sparse_vector"
      }
    }
  }
}
```

**2. Generate data** (same command pattern):
```bash
opensearch-benchmark generate-data \
  --index-name my-sparse \
  --index-mappings simple-sparse-mapping.json \
  --output-path ./output \
  --total-size 1
```

**Generated output**:

Of the documents generated, a document with the `sparse_embedding` field might look like this:
```json
{
  "content": "Sample text content",
  "sparse_embedding": {
    "1000": 0.3421,
    "1100": 0.5234,
    "1200": 0.7821,
    "1300": 0.1523,
    "1400": 0.9102,
    "1500": 0.4567,
    "1600": 0.2341,
    "1700": 0.6789,
    "1800": 0.8123,
    "1900": 0.3456
  }
}
```

With just an OpenSearch index mapping, OSB can generate synthetic dense and sparse vectors. However, the output is the most basic form of synthetic vectors. To achieve more realistic distributions and clusterings, we recommend using parameters outlined in the following section.

---

## Dense Vectors (KNN Vector) Parameters

The following are parameters that users can add to their SDG Config (YAML Config) to finetune generation of dense vectors.

#### `dimension` (required)

**What it does**: Specifies the number of dimensions in the vector.

**Where to specify**: In the mapping (required) or in config params (optional override).

**Impact**:
- **Memory**: Higher dimensions = more storage
  - 128D ≈ 0.5 KB per vector
  - 768D ≈ 3 KB per vector
  - 1536D ≈ 6 KB per vector
- **Performance**: More dimensions = slower indexing and search
- **Quality**: Must match your actual embedding model's output

**Common values**:

| Dimension | Use Case | Example Models |
|-----------|----------|----------------|
| 128 | Lightweight, custom models | Custom embeddings, fast search |
| 384 | General purpose | sentence-transformers/all-MiniLM-L6-v2 |
| 768 | Standard NLP | BERT-Base, DistilBERT, MPNet |
| 1024 | High quality NLP | BERT-Large |
| 1536 | OpenAI standard | text-embedding-ada-002, text-embedding-3-small |
| 3072 | OpenAI premium | text-embedding-3-large |

**Example**:
```yaml
field_overrides:
  my_embedding:
    generator: generate_knn_vector
    params:
      dimension: 768  # Override mapping dimension if needed
```

**Best practice**: Always match your production embedding model's dimension.

---

#### `sample_vectors` (optional, highly recommended)

**What it does**: Provides base vectors that the generator will add noise to, creating realistic variations and clusters.

**Why it matters**:
- **Without**: Generates random uniform vectors across entire space (unrealistic, poor search quality)
- **With**: Creates natural clusters around sample vectors (realistic, good search quality)

**Format**: List of lists, where each inner list is a complete vector.

```yaml
field_overrides:
  product_embedding:
    generator: generate_knn_vector
    params:
      dimension: 768
      sample_vectors:
        - [0.12, -0.34, 0.56, ..., 0.23]  # Vector 1 (768 values)
        - [-0.23, 0.45, -0.12, ..., -0.15]  # Vector 2 (768 values)
        - [0.34, 0.21, -0.45, ..., 0.42]  # Vector 3 (768 values)
```

**How many sample vectors?**
- **Minimum**: 3-5 for basic clustering
- **Recommended**: 5-10 for realistic distribution
- **Maximum**: 20+ for complex multi-cluster scenarios

**How to obtain sample vectors**:

**Option 1: Using actual embeddings from your domain (Recommended)**: Use actual embeddings from your domain, representing different semantic clusters. Random generation without sample vectors produces unrealistic data unsuitable for search quality testing.

**Option 2: Using sentence-transformers** in Python:
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

# Create representative texts from different categories
texts = [
    "Electronics and gadgets",
    "Clothing and fashion",
    "Home and kitchen appliances",
    "Books and literature",
    "Sports and outdoor equipment"
]

embeddings = model.encode(texts)
print(embeddings.tolist())  # Copy to your SDG config (YAML config)
```

---

#### `noise_factor` (default: 0.1)

**What it does**: Controls the amount of noise added to base vectors.
- For **gaussian**: Standard deviation of normal distribution
- For **uniform**: Range of uniform distribution (±noise_factor)

**Impact on data**:

| noise_factor | Effect | Use Case |
|--------------|--------|----------|
| 0.01 - 0.05 | Tight clustering, minimal variation | Duplicate detection, near-exact matches |
| 0.1 - 0.2 | Natural variation within topic | General semantic search, recommendations |
| 0.3 - 0.5 | Wide dispersion, diverse concepts | Broad topic matching, discovery |
| > 0.5 | Very scattered, overlapping clusters | Testing edge cases, stress testing |

**Configuration**:
```yaml
field_overrides:
  tight_clustering:
    generator: generate_knn_vector
    params:
      sample_vectors: [...]
      noise_factor: 0.05  # Tight clusters

  diverse_results:
    generator: generate_knn_vector
    params:
      sample_vectors: [...]
      noise_factor: 0.2   # More variation
```

**Best practice**: Start with 0.1, then adjust based on search recall/precision requirements.

---

#### `distribution_type` (default: "gaussian")

**What it does**: Specifies the type of noise distribution.

**Options**:
- **`gaussian`**: Normal distribution N(0, noise_factor)
  - Most realistic (natural variation with occasional outliers)
  - Produces smooth clusters
  - Some values can extend beyond expected range

- **`uniform`**: Uniform distribution [-noise_factor, +noise_factor]
  - Bounded variation (no extreme outliers)
  - More predictable results
  - Flat probability across range

**Configuration**:
```yaml
field_overrides:
  realistic_embedding:
    generator: generate_knn_vector
    params:
      sample_vectors: [...]
      noise_factor: 0.1
      distribution_type: gaussian  # More realistic

  controlled_embedding:
    generator: generate_knn_vector
    params:
      sample_vectors: [...]
      noise_factor: 0.1
      distribution_type: uniform   # More predictable
```

**Best practice**: Use `gaussian` for production-like benchmarks.

---

#### `normalize` (default: false)

**What it does**: L2 normalizes vectors after noise addition, making their magnitude (length) exactly 1.0.

**When to use normalize=true**:

| Index Configuration | normalize Setting | Why |
|---------------------|-------------------|-----|
| `space_type: cosinesimil` | **true** | Cosine similarity only cares about direction; pre-normalizing makes search faster (dot product = cosine sim) |
| `space_type: l2` | **false** | L2 distance uses magnitude; normalizing loses information |
| `space_type: innerproduct` | **false** | Inner product uses magnitude as part of similarity |

**Real-world models**:
- **OpenAI embeddings**: Already normalized (set true)
- **sentence-transformers**: Often normalized (check model docs, usually true)
- **BERT raw output**: Not normalized (set false, then normalize in index config)

**Configuration**:
```yaml
field_overrides:
  # For cosine similarity search
  cosine_embedding:
    generator: generate_knn_vector
    params:
      dimension: 384
      sample_vectors: [...]
      normalize: true  # Required for accurate cosine similarity

  # For L2 distance search
  l2_embedding:
    generator: generate_knn_vector
    params:
      dimension: 768
      sample_vectors: [...]
      normalize: false  # Keep original magnitudes
```

**Best practice**: Match your OpenSearch index's `space_type` setting.

---

## Sparse Vectors Parameters

The following are parameters that users can add to their SDG config to finetune how sparse vectors are generated.

#### `num_tokens` (default: 10)

**What it does**: Number of token-weight pairs to generate per vector.

**Impact**:
- **Low (5-10)**: Very sparse, fast search, may miss some relevant docs
- **Medium (10-25)**: Balanced performance and recall
- **High (50-100)**: Dense sparse representation, comprehensive but slower

**Typical values by model**:

| Model/Approach | Typical num_tokens | Use Case |
|----------------|-------------------|----------|
| SPLADE v1 | 10-15 | Standard sparse neural search |
| SPLADE v2 | 15-25 | Improved recall |
| DeepImpact | 8-12 | Efficient sparse search |
| Custom/Hybrid | 20-50 | Rich representations |

**Configuration**:
```yaml
field_overrides:
  sparse_standard:
    generator: generate_sparse_vector
    params:
      num_tokens: 15  # Standard SPLADE-like

  sparse_rich:
    generator: generate_sparse_vector
    params:
      num_tokens: 30  # Richer representation
```

**Best practice**: Start with 10-15; increase if recall is insufficient.

---

#### `min_weight` and `max_weight` (defaults: 0.01, 1.0)

**What they do**: Define the range of token importance weights.

**Impact**:
- **min_weight**: Filters weak signals (tokens below this are never generated)
- **max_weight**: Caps maximum importance (prevents single token dominance)

**Common configurations**:

| Configuration | min | max | Use Case |
|---------------|-----|-----|----------|
| Standard SPLADE | 0.01 | 1.0 | Default, balanced importance |
| Narrow range | 0.1 | 0.9 | More uniform importance |
| Wide range | 0.01 | 2.0 | Strong importance signals |
| High threshold | 0.05 | 1.0 | Filter low-confidence tokens |

**Configuration**:
```yaml
field_overrides:
  sparse_balanced:
    generator: generate_sparse_vector
    params:
      num_tokens: 15
      min_weight: 0.01
      max_weight: 1.0

  sparse_uniform:
    generator: generate_sparse_vector
    params:
      num_tokens: 20
      min_weight: 0.2   # Higher minimum
      max_weight: 0.8   # Lower maximum
```

**Constraints**:
- min_weight must be > 0.0 (OpenSearch requires positive weights)
- max_weight must be > min_weight
- Weights are rounded to 4 decimal places

**Best practice**: Keep min_weight small (0.01-0.05) to allow nuanced weighting.

---

#### `token_id_start` and `token_id_step` (defaults: 1000, 100)

**What they do**:
- **token_id_start**: First token ID in the sequence
- **token_id_step**: Increment between consecutive token IDs

**Generated sequence**: `start, start+step, start+2*step, ...`

**Example** with start=1000, step=100, num_tokens=5:
```json
{
  "1000": 0.3421,  // token_id_start
  "1100": 0.5234,  // start + 1*step
  "1200": 0.7821,  // start + 2*step
  "1300": 0.1523,  // start + 3*step
  "1400": 0.9102   // start + 4*step
}
```

**Use cases**:

| Configuration | start | step | Use Case |
|---------------|-------|------|----------|
| Default testing | 1000 | 100 | Easy visual separation |
| Realistic vocab | 0 | 1 | Match actual vocab indices |
| Multi-field | 1000, 5000, 10000 | 1 | Separate vocabularies per field |
| Large vocab | 0 | 1 | Simulate 50K+ vocabulary |

**Configuration**:
```yaml
field_overrides:
  # Default: easy debugging
  sparse_debug:
    generator: generate_sparse_vector
    params:
      num_tokens: 10
      token_id_start: 1000
      token_id_step: 100

  # Realistic: actual vocab indices
  sparse_realistic:
    generator: generate_sparse_vector
    params:
      num_tokens: 15
      token_id_start: 0
      token_id_step: 1

  # Multiple fields: separate ranges
  sparse_field1:
    generator: generate_sparse_vector
    params:
      token_id_start: 1000

  sparse_field2:
    generator: generate_sparse_vector
    params:
      token_id_start: 5000
```

**Note**: Token IDs are currently sequential in the generated data. Real sparse vectors have non-sequential IDs based on actual vocabulary, but this doesn't affect OpenSearch indexing or search functionality.

**Best practice**: Use large step (100) for debugging; use step=1 for production-like data.

---

### When to Use Simple vs Complex Approaches

| Scenario | Approach | Why |
|----------|----------|-----|
| Learning / Quick Test | Simple (no config) | Fastest setup, good enough for basic testing |
| Load Testing | Simple | Volume matters more than realism |
| Realistic Benchmarks | Complex (with config) | Need realistic clustering and distributions |
| Production Simulation | Complex | Must match actual embedding model behavior |
| Search Quality Testing | Complex | Need proper vector clusters for recall/precision testing |

**Rule of thumb**: If you're testing search quality or comparing algorithms, use complex configuration with sample vectors.
