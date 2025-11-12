---
layout: default
title: Similarity
nav_order: 37
---

# Similarity

A similarity defines how matching documents are scored and ranked during search operations. OpenSearch uses similarity algorithms to calculate relevance scores that determine the order of search results. 

Each field can have its own similarity configuration, allowing fine-tuned control over how different types of content are scored. You can define custom similarity algorithms in your index settings at the index level. Once configured, you can apply these algorithms to specific fields using the [`similarity` mapping parameter]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/similarity/).

Configuring custom similarity settings is an advanced feature. The built-in similarities are sufficient for most use cases.

## Configuring similarity at the index level

OpenSearch uses BM25 as the default similarity for all fields. You can change the default similarity for an index to apply a single similarity algorithm to all fields in that index.

### Setting default similarity at index creation

You can set the default similarity when creating an index:

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

When you use the special `default` name, the similarity is automatically applied to all fields in the index. You don't need to specify the similarity in individual field mappings.

### Changing default similarity after index creation

To change the default similarity after index creation, you must close the index, update the settings, and reopen it:

```json
POST /product_catalog/_close
```
{% include copy-curl.html %}

```json
PUT /product_catalog/_settings
{
  "index": {
    "similarity": {
      "default": {
        "type": "DFR",
        "basic_model": "g",
        "after_effect": "l",
        "normalization": "h2",
        "normalization.h2.c": "3.0"
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
POST /product_catalog/_open
```
{% include copy-curl.html %}

To verify that the default similarity has changed, send the following request:

```json
GET /product_catalog/_settings
```
{% include copy-curl.html %}

The response confirms that the default similarity has been updated:

```json
{
  "product_catalog": {
    "settings": {
      "index": {
        "replication": {
          "type": "DOCUMENT"
        },
        "number_of_shards": "1",
        "provided_name": "product_catalog",
        "similarity": {
          "default": {
            "basic_model": "g",
            "type": "DFR",
            "normalization": "h2",
            "after_effect": "l",
            "normalization.h2": {
              "c": "3.0"
            }
          }
        },
        "creation_date": "1761328470322",
        "number_of_replicas": "1",
        "uuid": "YFr9ts8VSaSV-YkHZP3mYQ",
        "version": {
          "created": "137227827"
        }
      }
    }
  }
}
```

### Parameter persistence when changing similarity types

When changing from one similarity type to another, OpenSearch retains parameters from the previous configuration. If the new similarity type doesn't support these parameters, you'll encounter errors.

For example, if you try to change from `DFR` similarity to `boolean` similarity, you'll get an error such as the following:

```
"Unknown settings for similarity of type [boolean]: [normalization.h2.c, normalization, after_effect, basic_model]"
```

To resolve this, explicitly set the old parameters to `null` when updating:

```json
PUT /product_catalog/_settings
{
  "index": {
    "similarity": {
      "default": {
        "type": "boolean",
        "basic_model": null,
        "after_effect": null,
        "normalization": null,
        "normalization.h2.c": null
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuring a built-in similarity at the field level

OpenSearch provides built-in similarity algorithms (`BM25` and `boolean`) that can be used directly in field mappings. To configure a similarity at the field level, apply it to the field when creating the index. The following example applies a `boolean` similarity to the `content` field:

```json
PUT /blog_posts_2/
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "similarity": "boolean"
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, only the `content` field uses a `boolean` similarity. Other fields in the index will use the default `BM25` similarity.

## Configuring a custom similarity

For more advanced use cases, you can define named custom similarities that can be applied to specific fields. This approach provides greater flexibility when different fields in your index need different scoring algorithms.

Configuring named custom similarities requires a two-step process:

1. Define the similarity in the index settings with a custom name.
2. Apply the similarity to specific fields in mappings.

### Step 1: Define a custom similarity

The following example creates an index with a custom `DFR` similarity configuration:

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

### Step 2: Apply the custom similarity to fields

After defining the similarity, you must explicitly apply it to specific fields in your mappings. Unlike the default similarity, custom similarities are not automatically applied to all fields:

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

In this example, only the `content` field uses the custom `blog_similarity`. Other fields in the index (if any) continue using the default `BM25` similarity unless explicitly configured otherwise.

## Available similarity types

OpenSearch supports the following similarity types.

### BM25 similarity (default)

`BM25` similarity is a TF/IDF-based similarity with built-in term frequency normalization. It works well for most text fields, particularly shorter fields like titles and names.

`BM25` similarity supports the following parameters.

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `k1` | Controls non-linear term frequency normalization (saturation). | `1.2` | No |
| `b` | Controls how much document length normalizes term frequency values. | `0.75` | No |
| `discount_overlaps` | Determines whether overlap tokens (tokens with 0 position increment) are ignored when computing norms. | `true` (ignore overlap tokens when computing norms) | No |

### Boolean similarity

`boolean` similarity is a built-in similarity that assigns all matching documents the same constant score, making it useful for only determining whether documents match rather than how relevant they are. This similarity ignores term frequency, document length, and other scoring factors.

`boolean` similarity does not support parameters.

### DFR similarity

`DFR` similarity implements the [divergence from randomness](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/DFRSimilarity.html) framework for document scoring.

`DFR` similarity supports the following parameters.

| Parameter | Description | Valid values | Required |
|-----------|-------------|------------------|----------|
| `basic_model` | Basic model for the DFR framework. | [`g`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelG.html), [`if`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelIF.html), [`in`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelIn.html), [`ine`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/BasicModelIne.html) | Yes |
| `after_effect` | After effect model for the DFR framework. | [`b`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/AfterEffectB.html), [`l`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/AfterEffectL.html) | Yes |
| `normalization` | Normalization model for the DFR framework. All options except `no` require a normalization value. | [`no`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/Normalization.NoNormalization.html), [`h1`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationH1.html), [`h2`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationH2.html), [`h3`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationH3.html), [`z`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/NormalizationZ.html) | Yes |

### DFI similarity

`DFI` similarity implements the divergence from independence (DFI) model.

`DFI` similarity supports the following parameters.

| Parameter | Description | Valid values | Required |
|-----------|-------------|------------------|----------|
| `independence_measure` | Independence measure for the DFI model. | [`standardized`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IndependenceStandardized.html), [`saturated`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IndependenceSaturated.html), [`chisquared`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IndependenceChiSquared.html) | Yes |

When using `DFI` similarity, avoid removing stop words for optimal relevance. Terms with a frequency that is lower than expected will receive a score of 0.

### IB similarity

`IB` similarity uses the [information-based model](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/IBSimilarity.html), which analyzes the repetitive usage of basic elements in symbolic distributions.

`IB` similarity supports the following parameters.

| Parameter | Description | Valid values | Required |
|-----------|-------------|------------------|----------|
| `distribution` | Distribution model for the IB framework. | [`ll`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/DistributionLL.html), [`spl`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/DistributionSPL.html) | Yes |
| `lambda` | Lambda model for the IB framework. | [`df`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LambdaDF.html), [`ttf`](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LambdaTTF.html) | Yes |
| `normalization` | Normalization model for the IB framework. | Same options as `DFR` similarity | Yes |

### LM Dirichlet similarity

`LMDirichlet` similarity uses [language model similarity](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LMDirichletSimilarity.html) with Dirichlet smoothing.

`LMDirichlet` similarity supports the following parameters.

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `mu` | Smoothing parameter. | `2000` | No |

Terms with fewer occurrences than predicted by the language model receive a score of 0.

### LM Jelinek Mercer similarity

`LMJelinekMercer` similarity uses [language model similarity](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/similarities/LMJelinekMercerSimilarity.html) with Jelinek-Mercer smoothing.

`LMJelinekMercer` similarity supports the following parameters.

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `lambda` | Interpolation parameter. Values around `0.1` work well for title queries, while `0.7` is better for longer queries. | `0.1` | No |

### Scripted similarity

`scripted` similarity allows custom scoring logic using OpenSearch's scripting capabilities.

When writing scripts for `scripted` similarities, you have access to the following variables. These variables allow you to implement custom scoring algorithms based on term frequency, document frequency, field statistics, and document characteristics.

| Variable | Description |
|----------|-------------|
| `weight` | A document-independent weight (obtained from the `weight_script` if provided, otherwise `1.0`). |
| `query.boost` | A query-level boost factor applied to the term. |
| `field.docCount` | The total number of documents that have this field. |
| `field.sumDocFreq` | The sum of document frequencies across all terms in this field. |
| `field.sumTotalTermFreq` | The sum of total term frequencies across all terms in this field. |
| `term.docFreq` | The number of documents containing this specific term. |
| `term.totalTermFreq` | The total number of occurrences of this term across all documents. |
| `doc.freq` | The frequency of this term in the current document. |
| `doc.length` | The total number of terms in the current document. |

To ensure correct search behavior, `scripted` similarities must follow these rules:

- Returned scores must be positive.
- Scores must not decrease when `doc.freq` increases and all other variables remain the same.
- Scores must not increase when `doc.length` increases and all other variables remain the same.

The following example shows a custom TF-IDF implementation.

First, create an index and define a script to calculate similarity:

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
```
{% include copy-curl.html %}

```json
PUT /research_papers/_doc/2
{
  "abstract": "data analysis statistical methods"
}
```
{% include copy-curl.html %}

Refresh the index:

```json
POST /research_papers/_refresh
```
{% include copy-curl.html %}

Now you can search the index and request scoring explanations:

```json
GET /research_papers/_search?explain=true
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "abstract": "machine"
          }
        }
      ],
      "boost": 2.0
    }
  }
}
```
{% include copy-curl.html %}

The response shows the custom TF-IDF calculation with a score of `1.2570862` for the matching document. The `_explanation` section reveals all the variables available to your script and their values for this specific search:

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.2570862,
    "hits": [
      {
        "_shard": "[research_papers][0]",
        "_node": "KfEEGG7_SsKZVFqI4ko2FA",
        "_index": "research_papers",
        "_id": "1",
        "_score": 1.2570862,
        "_source": {
          "abstract": "machine learning algorithms data mining"
        },
        "_explanation": {
          "value": 1.2570862,
          "description": "weight(abstract:machine in 0) [PerFieldSimilarity], result of:",
          "details": [
            {
              "value": 1.2570862,
              "description": "score from ScriptedSimilarity(weightScript=[null], script=[Script{type=inline, lang='painless', idOrCode='double tf = Math.sqrt(doc.freq); double idf = Math.log((field.docCount+1.0)/(term.docFreq+1.0)) + 1.0; double norm = 1/Math.sqrt(doc.length); return query.boost * tf * idf * norm;', options={}, params={}}]) computed from:",
              "details": [
                {
                  "value": 1,
                  "description": "weight",
                  "details": []
                },
                {
                  "value": 2,
                  "description": "query.boost",
                  "details": []
                },
                {
                  "value": 2,
                  "description": "field.docCount",
                  "details": []
                },
                {
                  "value": 9,
                  "description": "field.sumDocFreq",
                  "details": []
                },
                {
                  "value": 9,
                  "description": "field.sumTotalTermFreq",
                  "details": []
                },
                {
                  "value": 1,
                  "description": "term.docFreq",
                  "details": []
                },
                {
                  "value": 1,
                  "description": "term.totalTermFreq",
                  "details": []
                },
                {
                  "value": 1,
                  "description": "doc.freq",
                  "details": []
                },
                {
                  "value": 5,
                  "description": "doc.length",
                  "details": []
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

You can improve performance by separating document-independent calculations into another script named `weight_script`. For queries matching many documents, the `weight_script` runs once per term, while the main `script` runs once per document The score produced by the `weight_script` is available in the `weight` variable:

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

After indexing the same sample documents and searching using the same query, the response shows how the optimized similarity works:

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.2570862,
    "hits": [
      {
        "_shard": "[research_papers][0]",
        "_node": "KfEEGG7_SsKZVFqI4ko2FA",
        "_index": "research_papers",
        "_id": "1",
        "_score": 1.2570862,
        "_source": {
          "abstract": "machine learning algorithms data mining"
        },
        "_explanation": {
          "value": 1.2570862,
          "description": "weight(abstract:machine in 0) [PerFieldSimilarity], result of:",
          "details": [
            {
              "value": 1.2570862,
              "description": "score from ScriptedSimilarity(weightScript=[Script{type=inline, lang='painless', idOrCode='double idf = Math.log((field.docCount+1.0)/(term.docFreq+1.0)) + 1.0; return query.boost * idf;', options={}, params={}}], script=[Script{type=inline, lang='painless', idOrCode='double tf = Math.sqrt(doc.freq); double norm = 1/Math.sqrt(doc.length); return weight * tf * norm;', options={}, params={}}]) computed from:",
              "details": [
                {
                  "value": 2.8109303,
                  "description": "weight",
                  "details": []
                },
                {
                  "value": 2,
                  "description": "query.boost",
                  "details": []
                },
                {
                  "value": 2,
                  "description": "field.docCount",
                  "details": []
                },
                {
                  "value": 9,
                  "description": "field.sumDocFreq",
                  "details": []
                },
                {
                  "value": 9,
                  "description": "field.sumTotalTermFreq",
                  "details": []
                },
                {
                  "value": 1,
                  "description": "term.docFreq",
                  "details": []
                },
                {
                  "value": 1,
                  "description": "term.totalTermFreq",
                  "details": []
                },
                {
                  "value": 1,
                  "description": "doc.freq",
                  "details": []
                },
                {
                  "value": 5,
                  "description": "doc.length",
                  "details": []
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

In this optimized example:

- The `weight_script` calculates the score of `2.8109303` (IDF + query boost, same for all documents).
- The main `script` calculates document-specific factors using the precalculated `weight` value.
- The final score is `1.2570862` (identical to the single-script approach but more efficient).

The `weight_script` parameter name is reserved and cannot be changed. The result is always available in the `weight` variable within your main script.
{: .note}

## Related documentation

- [`similarity` mapping parameter]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/similarity/)