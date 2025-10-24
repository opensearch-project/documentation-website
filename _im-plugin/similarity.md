---
layout: default
title: Similarity
nav_order: 80
---

# Similarity

A similarity defines how matching documents are scored and ranked during search operations. OpenSearch uses similarity algorithms to calculate relevance scores that determine the order of search results. Each field can have its own similarity configuration, allowing fine-tuned control over how different types of content are scored.

This page covers index-level similarity configuration, where you define custom similarity algorithms in your index settings. Once configured, you can apply these algorithms to specific fields using the [`similarity` mapping parameter]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/similarity/). The mapping parameter allows you to specify which similarity algorithm each field should use for scoring.

Configuring custom similarity settings is considered an advanced feature. The built-in similarities are sufficient for most use cases.

## Configuring similarity

Similarity configuration is a two-step process:

1. **Define the similarity algorithm** in your index settings (covered on this page)
2. **Apply the similarity to specific fields** using the [`similarity` mapping parameter]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/similarity/)

Most similarity algorithms have configuration options that can be set through index settings. You can configure similarity settings when creating an index or when updating index settings.

The following example creates an index with a custom DFR similarity configuration:

```json
PUT /blog_posts
{
  "settings": {
    "index": {
      "similarity": {
        "blog_similarity": {
          "type": "DFR",
          "basic_model": "g",
          "after_effect": "l",
          "normalization": "h2",
          "normalization.h2.c": "3.0"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

After configuring the similarity, you can reference it in field mappings:

```json
PUT /blog_posts/_mapping
{
  "properties": {
    "content": {
      "type": "text",
      "similarity": "blog_similarity"
    }
  }
}
```
{% include copy-curl.html %}

## Available similarity types

### BM25 similarity (default)

BM25 is a TF/IDF-based similarity with built-in term frequency normalization. It works well for most text fields, particularly shorter fields like titles and names.

**Configuration options:**

- `k1`: Controls non-linear term frequency normalization (saturation). Default is `1.2`.
- `b`: Controls how much document length normalizes term frequency values. Default is `0.75`.
- `discount_overlaps`: Determines whether overlap tokens (tokens with 0 position increment) are ignored when computing norms. Default is `true`.

**Type name:** `BM25`

### DFR similarity

Implements the [divergence from randomness](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/DFRSimilarity.html) framework for document scoring.

**Configuration options:**

- `basic_model`: Available values are [`g`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelG.html), [`if`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelIF.html), [`in`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelIn.html), and [`ine`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelIne.html).
- `after_effect`: Available values are [`b`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/AfterEffectB.html) and [`l`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/AfterEffectL.html).
- `normalization`: Available values are [`no`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/Normalization.NoNormalization.html), [`h1`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationH1.html), [`h2`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationH2.html), [`h3`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationH3.html), and [`z`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationZ.html).

All normalization options except `no` require a normalization value.

**Type name:** `DFR`

### DFI similarity

Implements the divergence from independence model.

**Configuration options:**

- `independence_measure`: Available values are [`standardized`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IndependenceStandardized.html), [`saturated`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IndependenceSaturated.html), and [`chisquared`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IndependenceChiSquared.html).

When using DFI similarity, avoid removing stop words for optimal relevance. Terms with frequency less than expected will receive a score of 0.

**Type name:** `DFI`

### IB similarity

[Information-based model](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IBSimilarity.html) that analyzes the repetitive usage of basic elements in symbolic distributions.

**Configuration options:**

- `distribution`: Available values are [`ll`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/DistributionLL.html) and [`spl`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/DistributionSPL.html).
- `lambda`: Available values are [`df`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LambdaDF.html) and [`ttf`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LambdaTTF.html).
- `normalization`: Same options as DFR similarity.

**Type name:** `IB`

### LM Dirichlet similarity

[Language model similarity](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LMDirichletSimilarity.html) using Dirichlet smoothing.

**Configuration options:**

- `mu`: Smoothing parameter. Default is `2000`.

Terms with fewer occurrences than predicted by the language model receive a score of 0.

**Type name:** `LMDirichlet`

### LM Jelinek Mercer similarity

[Language model similarity](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LMJelinekMercerSimilarity.html) using Jelinek-Mercer smoothing.

**Configuration options:**

- `lambda`: Interpolation parameter. Default is `0.1`. Values around `0.1` work well for title queries, while `0.7` is better for longer queries.

**Type name:** `LMJelinekMercer`

### Scripted similarity

Allows custom scoring logic using OpenSearch's scripting capabilities. The following example shows a custom TF-IDF implementation:

```json
PUT /research_papers
{
  "settings": {
    "number_of_shards": 1,
    "similarity": {
      "custom_tfidf": {
        "type": "scripted",
        "script": {
          "source": "double tf = Math.sqrt(doc.freq); double idf = Math.log((field.docCount+1.0)/(term.docFreq+1.0)) + 1.0; double norm = 1/Math.sqrt(doc.length); return query.boost * tf * idf * norm;"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "abstract": {
        "type": "text",
        "similarity": "custom_tfidf"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index sample documents:

```json
PUT /research_papers/_doc/1
{
  "abstract": "machine learning algorithms data mining"
}

PUT /research_papers/_doc/2
{
  "abstract": "data analysis statistical methods"
}
```
{% include copy-curl.html %}

After refreshing the index, you can search with scoring explanations:

```json
POST /research_papers/_refresh

GET /research_papers/_search?explain=true
{
  "query": {
    "match": {
      "abstract": "machine^2.0"
    }
  }
}
```
{% include copy-curl.html %}

#### Scripted similarity requirements

Scripted similarities must follow these rules to ensure correct search behavior:

- Returned scores must be positive
- Scores must not decrease when `doc.freq` increases (all other variables equal)
- Scores must not increase when `doc.length` increases (all other variables equal)

#### Performance optimization with weight scripts

You can improve performance by separating document-independent calculations into a `weight_script`:

```json
PUT /research_papers
{
  "settings": {
    "number_of_shards": 1,
    "similarity": {
      "optimized_tfidf": {
        "type": "scripted",
        "weight_script": {
          "source": "double idf = Math.log((field.docCount+1.0)/(term.docFreq+1.0)) + 1.0; return query.boost * idf;"
        },
        "script": {
          "source": "double tf = Math.sqrt(doc.freq); double norm = 1/Math.sqrt(doc.length); return weight * tf * norm;"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "abstract": {
        "type": "text",
        "similarity": "optimized_tfidf"
      }
    }
  }
}
```
{% include copy-curl.html %}

**Type name:** `scripted`

## Default similarity configuration

OpenSearch uses BM25 as the default similarity for all fields. You can change the default similarity for an index:

```json
PUT /product_catalog
{
  "settings": {
    "index": {
      "similarity": {
        "default": {
          "type": "boolean"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

To change the default similarity after index creation, you must close the index, update the settings, and reopen it:

```json
POST /product_catalog/_close

PUT /product_catalog/_settings
{
  "index": {
    "similarity": {
      "default": {
        "type": "boolean"
      }
    }
  }
}

POST /product_catalog/_open
```
{% include copy-curl.html %}