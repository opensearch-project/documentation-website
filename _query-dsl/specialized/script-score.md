---
layout: default
title: Script score
parent: Specialized queries
nav_order: 60
---

# Script score query

Use a `script_score` query to replace the relevance score of each matching document with a value computed by a script. The wrapped query determines which documents match, and the script runs only on those documents. This makes the `script_score` query a good fit for scoring logic that is too expensive to run against the whole index.

Use a `script_score` query in the following scenarios:

- Combining text relevance with a numeric signal stored in the document, such as popularity, rating, or rank.
- Favoring documents whose dates, locations, or numeric values are close to a target value by using a decay function.
- Implementing a custom ranking formula based on term statistics or vector similarity.
- Reproducing the scoring functions of a [`function_score`]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score/) query in a single script.

## Example

The following request creates an index containing one document:

```json
PUT testindex1/_doc/1
{
  "name": "John Doe",
  "multiplier": 0.5
}
```
{% include copy-curl.html %}

The following `match` query returns all documents that contain `John` in the `name` field:

```json
GET testindex1/_search
{
  "query": {
    "match": {
      "name": "John"
    }
  }
}
```
{% include copy-curl.html %}

In the response, document 1 has a score of `0.13076457`:

```json
{
  "took": 1,
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
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 0.13076457,
        "_source": {
          "name": "John Doe",
          "multiplier": 0.5
        }
      }
    ]
  }
}
```

To change the document score, wrap the `match` query in a `script_score` query. Inside the script, the `_score` variable holds the relevance score calculated by the wrapped query, and `doc['multiplier'].value` reads the `multiplier` field value. The following query multiplies the two values:

```json
GET testindex1/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": { 
            "name": "John" 
        }
      },
      "script": {
        "source": "_score * doc['multiplier'].value"
      }
    }
  }
}
```
{% include copy-curl.html %}

In the response, the score for document 1 is half of the original score:

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
    "max_score": 0.06538229,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 0.06538229,
        "_source": {
          "name": "John Doe",
          "multiplier": 0.5
        }
      }
    ]
  }
}
```

## Parameters

The `script_score` query supports the following top-level parameters.

Parameter | Data type | Description
:--- | :--- | :---
`query` | Object | The query that selects the documents to score. Required.
`script` | Object | The script used to calculate the score of the documents returned by the `query`. Supports inline and stored scripts. For more information, see [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/). Required.
`min_score` | Float | Excludes documents with a score lower than `min_score` from the results. The score is compared to `min_score` after `boost` is applied. Optional.
`boost` | Float | Multiplies the score returned by the script. Values less than 1.0 decrease relevance, and values greater than 1.0 increase relevance. Default is 1.0.

Pass changing values to the script in the `params` object and keep them out of `source`. OpenSearch caches compiled scripts by their source, so a script whose source stays the same is compiled only once, even when its parameter values change. For more information, see [Compilation limits and caching]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#compilation-limits-and-caching).

The relevance scores calculated by the `script_score` query cannot be negative. If a script returns a negative value, the search fails with an error similar to `script_score script returned an invalid score [-1.0] for doc [0]. Must be a non-negative score!`.
{: .important}

If a script reads a field that is missing from a document, `doc['<field>'].value` throws an error. To handle missing values, check `doc['<field>'].size() == 0` before reading the value. For an example, see [The field value factor function](#the-field-value-factor-function).

## Customizing score calculation with built-in functions

To customize score calculation, you can use one of the built-in Painless functions. For every function, OpenSearch provides one or more Painless methods you can access in the script score context. You can call the Painless methods listed in the following sections directly without using a class name or instance name qualifier. For more information, see [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/).

When a built-in function covers your use case, prefer it to an equivalent formula written in Painless. The built-in functions are implemented in Java, and the decay functions parse their origin, scale, and offset once and do not repeat this work for every document.

### Saturation

The saturation function calculates saturation as `score = value /(value + pivot)`, where `value` is the field value and `pivot` is chosen so that the score is greater than 0.5 if `value` is greater than `pivot` and less than 0.5 if `value` is less than `pivot`. The score is in the (0, 1) range. To apply a saturation function, call the following Painless method:

- `double saturation(double <field-value>, double <pivot>)`
    
#### Example

The following example query searches for the text `neural search` in the `articles` index. It combines the original document relevance score with the `article_rank` value, which is first transformed with a saturation function:

```json
GET articles/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": { "article_name": "neural search" }
      },
      "script" : {
        "source" : "_score + saturation(doc['article_rank'].value, 11)"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Sigmoid

Similarly to the saturation function, the sigmoid function calculates the score as `score = value^exp/ (value^exp + pivot^exp)`, where `value` is the field value, `exp` is an exponent scaling factor, and `pivot` is chosen so that the score is greater than 0.5 if `value` is greater than `pivot` and less than 0.5 if `value` is less than `pivot`. To apply a sigmoid function, call the following Painless method:

- `double sigmoid(double <field-value>, double <pivot>, double <exp>)`

#### Example

The following example query searches for the text `neural search` in the `articles` index. It combines the original document relevance score with the `article_rank` value, which is first transformed with a sigmoid function:

```json
GET articles/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": { "article_name": "neural search" }
      },
      "script" : {
        "source" : "_score + sigmoid(doc['article_rank'].value, 11, 2)"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Random score

The random score function generates uniformly distributed random scores in the [0, 1) range. To learn how the function works, see [The random score function]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score#the-random-score-function). To apply a random score function, call one of the following Painless methods:

- `double randomScore(int <seed>)`: Uses the internal Lucene document IDs as the source of randomness.
- `double randomScore(int <seed>, String <field-name>)`: Uses the values of the specified field as the source of randomness.

Choose the source of randomness based on the following considerations:

- Internal Lucene document IDs are fast to read, but segment merges can renumber them. As a result, the same seed can produce a different order over time.
- Documents in the same shard that have the same field value receive the same score, so choose a field whose values are unique within each shard.
- The `_seq_no` field is unique within a shard, but its value changes each time a document is updated. An updated document therefore receives a new random score.

#### Example

The following query uses the `random_score` function with a `seed` and a `field`:

```json
GET articles/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": { "article_name": "neural search" }
      },
      "script" : {
          "source" : "randomScore(20, '_seq_no')"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Decay functions

With decay functions, you can score results based on proximity or recency. To learn more, see [Decay functions]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score#decay-functions). You can calculate scores using an exponential, Gaussian, or linear decay curve. To apply a decay function, call one of the following Painless methods, depending on the field type:

- [Numeric]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/) fields: 
    - `double decayNumericGauss(double <origin>, double <scale>, double <offset>, double <decay>, double <field-value>)`
    - `double decayNumericExp(double <origin>, double <scale>, double <offset>, double <decay>, double <field-value>)`
    - `double decayNumericLinear(double <origin>, double <scale>, double <offset>, double <decay>, double <field-value>)`
- [Geopoint]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-point/) fields: 
    - `double decayGeoGauss(String <origin>, String <scale>, String <offset>, double <decay>, GeoPoint <field-value>)`
    - `double decayGeoExp(String <origin>, String <scale>, String <offset>, double <decay>, GeoPoint <field-value>)`
    - `double decayGeoLinear(String <origin>, String <scale>, String <offset>, double <decay>, GeoPoint <field-value>)`
- [Date]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/) fields: 
    - `double decayDateGauss(String <origin>, String <scale>, String <offset>, double <decay>, JodaCompatibleZonedDateTime <field-value>)`
    - `double decayDateExp(String <origin>, String <scale>, String <offset>, double <decay>, JodaCompatibleZonedDateTime <field-value>)`
    - `double decayDateLinear(String <origin>, String <scale>, String <offset>, double <decay>, JodaCompatibleZonedDateTime <field-value>)`

#### Example: Numeric fields

The following query uses the exponential decay function on a numeric field:

```json
GET articles/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": {
          "article_name": "neural search"
        }
      },
      "script": {
        "source": "decayNumericExp(params.origin, params.scale, params.offset, params.decay, doc['article_rank'].value)",
        "params": {
          "origin": 50,
          "scale": 20,
          "offset": 30,
          "decay": 0.5
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example: Geopoint fields

The following query uses the Gaussian decay function on a geopoint field:

```json
GET hotels/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": {
          "name": "hotel"
        }
      },
      "script": {
        "source": "decayGeoGauss(params.origin, params.scale, params.offset, params.decay, doc['location'].value)",
        "params": {
          "origin": "40.71,74.00",
          "scale":  "300ft",
          "offset": "200ft",
          "decay": 0.25
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example: Date fields

The following query uses the linear decay function on a date field:

```json
GET blogs/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": {
          "name": "opensearch"
        }
      },
      "script": {
        "source": "decayDateLinear(params.origin, params.scale, params.offset, params.decay, doc['date_posted'].value)",
        "params": {
          "origin":  "2022-04-24",
          "scale":  "6d",
          "offset": "1d",
          "decay": 0.25
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The date decay functions have the following limitations:

- The origin must be a fixed date. Date math expressions that use `now` are not supported and cause the search to fail with a `could not read the current timestamp` error. To score by recency, calculate the current date in your application and pass it in `params.origin`.
- The origin must use the default `strict_date_optional_time||epoch_millis` format, even if the date field is mapped using a custom `format`. An origin without a time zone offset is interpreted as UTC.

### Vector functions

The k-NN plugin provides Painless functions that calculate the distance or similarity between a query vector and a vector field, such as `l2Squared`, `cosineSimilarity`, and `hamming`. Use these functions in a `script_score` query to run an exact k-NN search on the documents returned by the wrapped query. For more information, see [Painless extensions]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/painless-functions/).

### Term frequency functions

Term frequency functions expose term-level statistics in the score script source. You can use these statistics to implement custom information retrieval and ranking algorithms, like query-time multiplicative or additive score boosting by popularity. To apply a term frequency function, call one of the following Painless methods:

- `int termFreq(String <field-name>, String <term>)`: Retrieves the number of times the term appears in the field of the current document.
- `long totalTermFreq(String <field-name>, String <term>)`: Retrieves the number of times the term appears in the field across all documents in the shard. This value is the same for every document in the shard.
- `long sumTotalTermFreq(String <field-name>)`: Retrieves the total number of terms in the field across all documents in the shard. This value is the same for every document in the shard.

#### Example

The following query iterates through the `fields` list and finds the first field name that is not `null`. It then calculates the score as the total term frequency of the term `ai` in that field multiplied by the `multiplier` value. If no field name is found, the script returns `default_value`:

```json
GET /demo_index_v1/_search
{
  "query": {
    "script_score": {
      "query": {
        "match_all": {}
      },
      "script": {
        "source": """
          for (int x = 0; x < params.fields.length; x++) {
            String field = params.fields[x];
            if (field != null) {
              return params.multiplier * totalTermFreq(field, params.term);
            }
          }
          return params.default_value;
        """,
        "params": {
          "fields": ["title", "description"],
          "term": "ai",
          "multiplier": 2,
          "default_value": 1
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Late interaction score

The `lateInteractionScore` function is a Painless script scoring function that calculates document relevance using token-level vector matching. It compares each query vector against all document vectors, finds the maximum similarity for each query vector, and sums these maximum scores to produce the final document score.

**Example score calculation**:
- Query vectors: `[[0.8, 0.1], [0.2, 0.9]]`
- Document vectors: `[[0.7, 0.2], [0.1, 0.8], [0.3, 0.4]]`
- Query vector 1 → finds best match among document vectors → score A
- Query vector 2 → finds best match among document vectors → score B
- Final score = A + B

This approach enables fine-grained semantic matching between queries and documents, making it particularly effective for reranking search results.

#### Index mapping requirements

The vector field must be mapped as either an `object` (recommended) or `float` type.

We recommend mapping the vector field as an `object` with `"enabled": false` because it stores raw vectors without parsing, improving performance:

```json
{
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "object",
        "enabled": false
      }
    }
  }
}
```

Alternatively, you can map the vector field as a `float`:

```json
{
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "float"
      }
    }
  }
}
```

#### Example

The following example demonstrates using the `lateInteractionScore` function with cosine similarity to measure vector similarity based on direction rather than distance:

```json
GET my_index/_search
{
  "query": {
    "script_score": {
      "query": { "match_all": {} },
      "script": {
        "source": "lateInteractionScore(params.query_vectors, 'my_vector', params._source, params.space_type)",
        "params": {
          "query_vectors": [[1.0, 0.0], [0.0, 1.0]],
          "space_type": "cosinesimil"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Parameters

The `lateInteractionScore` function supports the following parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `query_vectors` | Array of arrays | Yes | Query vectors for similarity matching. |
| `vector_field` | String | Yes | The name of the document field containing vectors. |
| `doc` | Map | Yes | Document source (use `params._source`). |
| `space_type` | String | No | The similarity metric. Default is `l2`. |

The `space_type` parameter determines how similarity is calculated and accepts the following valid values.

| Space type | Description | Higher score means |
| :--- | :--- | :--- |
| `innerproduct` | Dot product | More similar vectors |
| `cosinesimil` | Cosine similarity | More similar direction |
| `l2` (default) | Euclidean distance | Closer vectors (inverted) |

For a complete example, see [Reranking by a field using an externally hosted late interaction model]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field-late-interaction/).

## Replicating function score functions

Each scoring function of the [`function_score`]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score/) query has a `script_score` equivalent. Use the following mappings when you need to combine several of these functions in one formula:

- `script_score`: Copy the script from the `script_score` function into the `script` parameter of the `script_score` query without changes.
- `weight`: Multiply the relevance score by a constant, for example, `params.weight * _score`.
- `random_score`: Call the [`randomScore` function](#random-score).
- `field_value_factor`: Read the field value and apply the factor and modifier in Painless. For more information, see [The field value factor function](#the-field-value-factor-function).
- Decay functions: Call the corresponding [decay function](#decay-functions).

### The field value factor function

The following query reproduces a `field_value_factor` function that has a `factor` of `5`, a `log` modifier, and a `missing` value of `1`. For documents that have no `likes` value, the script uses `1`:

```json
GET articles/_search
{
  "query": {
    "script_score": {
      "query": {
        "match": {
          "article_name": "neural search"
        }
      },
      "script": {
        "source": "Math.log10((doc['likes'].size() == 0 ? 1 : doc['likes'].value) * params.factor)",
        "params": {
          "factor": 5
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `field_value_factor` function multiplies the field value by `factor` and then applies the modifier. The following table lists the Painless expression that corresponds to each modifier, where `v` is `params.factor * doc['<field>'].value`.

Modifier | Painless expression
:--- | :---
`none` | `v`
`log` | `Math.log10(v)`
`log1p` | `Math.log10(v + 1)`
`log2p` | `Math.log10(v + 2)`
`ln` | `Math.log(v)`
`ln1p` | `Math.log(v + 1)`
`ln2p` | `Math.log(v + 2)`
`square` | `Math.pow(v, 2)`
`sqrt` | `Math.sqrt(v)`
`reciprocal` | `1.0 / v`

## Explaining script scores

The [Explain API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/explain/) shows how the score of a document was calculated. By default, the explanation for a `script_score` query contains only the script source. To add a readable description of the calculation, call `explanation.set()` in the script.

The `explanation` variable is set only in an explain request. In a regular search request, it is `null`, and calling `explanation.set()` causes the search to fail. Always check for `null` before calling `explanation.set()`.

The following request explains the score of article 1:

```json
GET articles/_explain/1
{
  "query": {
    "script_score": {
      "query": {
        "match": {
          "article_name": "neural search"
        }
      },
      "script": {
        "source": """
          long likes = doc['likes'].value;
          double normalizedLikes = likes / 10.0;
          if (explanation != null) {
            explanation.set('normalized likes = likes / 10 = ' + likes + ' / 10 = ' + normalizedLikes);
          }
          return normalizedLikes;
        """
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the description set by the script:

```json
{
  "_index" : "articles",
  "_id" : "1",
  "matched" : true,
  "explanation" : {
    "value" : 12.0,
    "description" : "normalized likes = likes / 10 = 120 / 10 = 12.0",
    "details" : [ ]
  }
}
```

## Faster alternatives

The `script_score` query runs its script for every document that matches the wrapped query. The following queries can skip documents that cannot reach the top results, so they are faster for common boosting tasks:

- To boost documents based on a static numeric value, such as popularity or page rank, use the [`rank_feature`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/rank-feature/) query.
- To boost documents that are close to a date or geographic point, use the [`distance_feature`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/distance-feature/) query.

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, `script_score` queries are not executed.
{: .important}