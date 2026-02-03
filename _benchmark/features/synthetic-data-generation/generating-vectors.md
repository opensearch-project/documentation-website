---
layout: default
title: Generating vectors
nav_order: 40
parent: Synthetic data generation
grand_parent: Additional features
---

# Generating vectors

You can generate synthetic dense and sparse vectors from mappings using OpenSearch Benchmark's synthetic data generator.

## Dense vectors

Dense vectors (represented by the [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/) field type in OpenSearch) are numerical representations of data, such as text or images, in which most or all dimensions have non-zero values. These vectors typically contain floating-point numbers between -1.0 and 1.0, with each dimension contributing to the overall meaning.

Example embedding for the word "dog":

```json
{
  "embedding": [0.234, -0.567, 0.123, 0.891, -0.234, 0.456, ..., 0.789]
}
```

## Sparse vectors

Sparse vectors (represented by the [`sparse_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/sparse-vector/) field type in OpenSearch) are vectors in which most dimensions are zero, represented as key-value pairs of non-zero token IDs and their weights.

Example text: "Korean jindos are hunting dogs that have a reputation for being loyal, independent, and confident."

Sparse vector representation of example text:

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

## Basic usage

The following examples show how to generate vectors with minimal configuration using only OpenSearch index mappings.

### Generating dense vectors

Generate random 128-dimensional vectors with minimal configuration.

**1. Create a mapping file** (`simple-knn-mapping.json`):

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
{% include copy.html %}

**2. Generate data**:

```bash
opensearch-benchmark generate-data \
  --index-name my-vectors \
  --index-mappings simple-knn-mapping.json \
  --output-path ./output \
  --total-size 1
```
{% include copy.html %}

#### Generated output

In each of the generated documents, the `my_embedding` field might appear as follows:

```json
{
  "title": "Sample text 42",
  "my_embedding": [0.234, -0.567, 0.123, ..., 0.891]  // 128 random floats [-1.0, 1.0]
}
```

### Generating sparse vectors

Generate sparse vectors with the default configuration (10 tokens).

**1. Create a mapping file** (`simple-sparse-mapping.json`):

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
{% include copy.html %}

**2. Generate data** (same command pattern):

```bash
opensearch-benchmark generate-data \
  --index-name my-sparse \
  --index-mappings simple-sparse-mapping.json \
  --output-path ./output \
  --total-size 1
```
{% include copy.html %}

#### Generated output

In each of the generated documents, the `sparse_embedding` field might appear as follows:

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

Using only an OpenSearch index mapping, OpenSearch Benchmark can generate synthetic dense and sparse vectors. However, this produces basic synthetic vectors. For more realistic distributions and clusterings, we recommend configuring the parameters described in the following section.

---

## Dense vector (k-NN vector) parameters

The following are parameters that you can add to your synthetic data generation configuration file (YAML configuration) to fine-tune the generation of dense vectors. These parameters are used in the `field_overrides` section with the `generate_knn_vector` generator. For complete configuration details, see [Advanced configuration](/benchmark/features/synthetic-data-generation/mapping-sdg/#advanced-configuration).

#### dimension

This parameter specifies the number of dimensions in the vector. Optional. 

**How to specify**: The `dimension` must be defined in your OpenSearch index mapping file. You can optionally override this value in your YAML configuration using the `dimension` parameter in `field_overrides`.

**Impact**:
- **Memory**: Higher dimensions = more storage
  - 128D ≈ 0.5 KB per vector
  - 768D ≈ 3 KB per vector
  - 1536D ≈ 6 KB per vector
- **Performance**: More dimensions = slower indexing and search
- **Quality**: Must match your actual embedding model's output

The following table shows common dimension values and their typical use cases.

| Dimension | Use case | Example models |
|-----------|----------|----------------|
| 128 | Lightweight, custom models | Custom embeddings, fast search |
| 384 | General purpose | sentence-transformers/all-MiniLM-L6-v2 |
| 768 | Standard NLP | BERT-Base, DistilBERT, MPNet |
| 1,024 | High-quality NLP | BERT-Large |
| 1,536 | OpenAI standard | text-embedding-ada-002, text-embedding-3-small |
| 3,072 | OpenAI premium | text-embedding-3-large |

**Example**:

```yaml
field_overrides:
  my_embedding:
    generator: generate_knn_vector
    params:
      dimension: 768  # Override mapping dimension if needed
```
{% include copy.html %}

**Best practice**: This parameter must match your embedding model's dimension.

---

#### sample_vectors

This parameter provides base vectors to which the generator adds noise, creating realistic variations and clusters. Optional but highly recommended. 

Without sample vectors, OpenSearch Benchmark's synthetic data generator generates random uniform vectors across the entire space, which is unrealistic and offers poor search quality. Providing sample vectors allows OpenSearch Benchmark's synthetic data generator to create more realistic and natural clusters.

After you prepare a list of sample vectors, insert them as a **list of lists**, in which each inner list is a complete vector. The following example provides sample vectors in the synthetic data generation configuration file:

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
{% include copy.html %}

Use the following guidelines to determine the number of vectors that you provide:

- **Minimum**: 3--5 for basic clustering
- **Recommended**: 5--10 for realistic distribution
- **Maximum**: 20+ for complex multi-cluster scenarios

**How to obtain sample vectors**:

**Option 1 (Recommended): Using actual embeddings from your domain**: Use actual embeddings from your domain, representing different semantic clusters. Random generation without sample vectors produces unrealistic data unsuitable for search quality testing.

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
print(embeddings.tolist())  # Copy to your synthetic data generation configuration file (YAML config)
```
{% include copy.html %}

---

#### distribution_type

This parameter specifies the type of noise distribution. Optional. Default is `gaussian`. 

**Valid values**:
- `gaussian`: Normal distribution N(0, `noise_factor`)
  - Most realistic (natural variation with occasional outliers)
  - Produces smooth clusters
  - Some values can extend beyond expected range

- `uniform`: Uniform distribution [-`noise_factor`, +`noise_factor`]
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
{% include copy.html %}

**Best practice**: Use `gaussian` for production-like benchmarks.

---

#### noise_factor

This parameter controls the amount of noise added to base vectors:
- For `gaussian`: Standard deviation of normal distribution
- For `uniform`: Range of uniform distribution (±`noise_factor`)

Optional. Default is `0.1`. 

The following table shows how different `noise_factor` values impact the generated data.

| `noise_factor` | Effect | Use case |
|--------------|--------|----------|
| 0.01--0.05 | Tight clustering, minimal variation | Duplicate detection, near-exact matches |
| 0.1--0.2 | Natural variation within topic | General semantic search, recommendations |
| 0.3--0.5 | Wide dispersion, diverse concepts | Broad topic matching, discovery |
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
{% include copy.html %}

**Best practice**: Start with `0.1`, then adjust based on search recall or precision requirements.

---

#### normalize

This parameter normalizes vectors after noise addition, making their magnitude (length) exactly `1.0`. Optional. Default is `false`. 

The following table shows when to set `normalize` to `true` based on your index configuration.

| `space_type` in the index mapping | `normalize` value | Explanation                                                                                                                                             |
| --------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cosinesimil`                     | `true`            | Cosine similarity depends only on vector direction. Pre-normalizing improves performance because the dot product directly represents cosine similarity. |
| `l2`                              | `false`           | L2 distance relies on vector magnitude. Normalizing removes magnitude information and reduces accuracy.                                                 |
| `innerproduct`                    | `false`           | Inner product incorporates vector magnitude into the similarity score, so normalization would change the intended scoring behavior.                     |

**Real-world model guidance**:

* **OpenAI embeddings**: These vectors are pre-normalized, so set `normalize` to `true`.
* **sentence-transformers**: Many models output normalized vectors. Review the model documentation; in most cases, `normalize` should be set to `true`.
* **BERT (raw output)**: Raw BERT embeddings are not normalized. Set `normalize` to `false` and rely on the index configuration to perform normalization if needed.

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
{% include copy.html %}

**Best practice**: Match your OpenSearch index's `space_type` setting.

---

## Sparse vector parameters

The following are parameters that you can add to your synthetic data generation configuration file to fine-tune how sparse vectors are generated. These parameters are used in the `field_overrides` section with the `generate_sparse_vector` generator. For complete configuration details, see [Advanced configuration](/benchmark/features/synthetic-data-generation/mapping-sdg/#advanced-configuration).

#### num_tokens

This parameter specifies the number of token-weight pairs to generate per vector. Optional. Default is `10`. 

**Impact**:
- **Low (5--10)**: Very sparse, fast search; may miss some relevant documents
- **Medium (10--25)**: Balanced performance and recall
- **High (50--100)**: Dense sparse representation; comprehensive but slower

The following table shows typical `num_tokens` values for different models and approaches.

| Model/Approach | Typical `num_tokens` | Use case |
|----------------|-------------------|----------|
| SPLADE v1 | 10--15 | Standard sparse neural search |
| SPLADE v2 | 15--25 | Improved recall |
| DeepImpact | 8--12 | Efficient sparse search |
| Custom/Hybrid | 20--50 | Rich representations |

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
{% include copy.html %}

**Best practice**: Start with `10--15`; increase if recall is insufficient.

---

#### min_weight and max_weight

These parameters define the range of token importance weights. Optional. Default `min_weight` is `0.01`; default `max_weight` is `1.0`. 

**Impact**:
- `min_weight`: Excludes low-importance tokens from generation. Tokens with weights below this value are not included.
- `max_weight`: Limits the upper bound of token influence to prevent any single token from dominating the vector.

The following table shows common weight range configurations and their use cases.

| Configuration | `min_weight` | `max_weight` | Use case |
|---------------|-----|-----|----------|
| Standard SPLADE | `0.01` | `1.0` | Default, balanced importance |
| Narrow range | `0.1` | `0.9` | More uniform importance |
| Wide range | `0.01` | `2.0` | Strong importance signals |
| High threshold | `0.05` | `1.0` | Filters low-confidence tokens |

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
{% include copy.html %}

**Constraints**:
- `min_weight` must be > `0.0` (OpenSearch requires positive weights).
- `max_weight` must be > `min_weight`.
- Weights are rounded to `4` decimal places.

**Best practice**: Keep `min_weight` small (`0.01--0.05`) to allow nuanced weighting.

---

#### token_id_start and token_id_step

These parameters define how token IDs are assigned during vector generation:

- `token_id_start`: Sets the starting token ID in the generated sequence. Default is `1000`.

- `token_id_step`: Specifies the increment applied between each consecutive token ID. Default is `100`.

**Generated sequence**: `start, start+step, start+2*step, ...`

**Example** with `start=1000`, `step=100`, `num_tokens=5`:

```json
{
  "1000": 0.3421,  // token_id_start
  "1100": 0.5234,  // start + 1*step
  "1200": 0.7821,  // start + 2*step
  "1300": 0.1523,  // start + 3*step
  "1400": 0.9102   // start + 4*step
}
```
{% include copy.html %}

The following table shows different token ID configurations and their use cases.

| Configuration               | `token_id_start`  | `token_id_step` | Use case                                                           |
| --------------------------- | ----------------- | --------------- | ------------------------------------------------------------------ |
| Default testing             | `1000`            | `100`           | Helps visually distinguish generated token ranges.                 |
| Realistic vocabulary        | `0`               | `1`             | Aligns token IDs with a real model's vocabulary indexes.           |
| Multi-field generation      | `1000`, `5000`, `10000` | `1`             | Keeps token ID ranges separate across different fields.            |
| Large vocabulary simulation | `0`               | `1`             | Supports generation scenarios with vocabularies of `50,000`+ tokens. |

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
{% include copy.html %}

**Note**: Token IDs in the generated data are sequential. In real sparse vectors, IDs may be non-sequential based on the actual vocabulary. This difference does not impact OpenSearch indexing or search functionality.

**Best practice**: Use a larger `token_id_step` (for example, `100`) for debugging, and set `token_id_step` to `1` for production-like data.

---

## Choosing simple or complex generation approaches

The following table outlines when to use simple generation versus a more complex, configurable approach based on your testing goals.

| Scenario                  | Recommended approach                            | Rationale                                                                                     |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Learning or quick testing | Simple generation (no additional configuration) | Provides the fastest setup and is sufficient for basic validation.                            |
| Load testing              | Simple generation                               | Prioritizes data volume and throughput over vector realism.                                   |
| Realistic benchmarks      | Complex generation (with configuration)         | Requires realistic vector clustering and distributions to reflect real-world behavior.        |
| Production simulation     | Complex generation                              | Needs vector characteristics that closely match those produced by the actual embedding model. |
| Search quality testing    | Complex generation                              | Requires meaningful vector clusters to evaluate recall and precision accurately.              |


**Recommendation**: For search quality testing or algorithm comparisons, use a complex configuration with sample vectors to ensure realistic data distributions.
