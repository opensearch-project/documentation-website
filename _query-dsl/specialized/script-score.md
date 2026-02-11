---
layout: default
title: Script score
parent: Specialized queries
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/query-dsl/specialized/script-score/
---

# Script score query

Use a `script_score` query to customize the score calculation by using a script. For an expensive scoring function, you can use a `script_score` query to calculate the score only for the returned documents that have been filtered.

## Example

For example, the following request creates an index containing one document:

```json
PUT testindex1/_doc/1
{
  "name": "John Doe",
  "multiplier": 0.5
}
```
{% include copy-curl.html %}

You can use a `match` query to return all documents that contain `John` in the `name` field:

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

In the response, document 1 has a score of `0.2876821`:

```json
{
  "took": 7,
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
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 0.2876821,
        "_source": {
          "name": "John Doe",
          "multiplier": 0.5
        }
      }
    ]
  }
}
```

Now let's change the document score by using a script that calculates the score as the value of the `_score` field multiplied by the value of the `multiplier` field. In the following query, you can access the current relevance score of a document in the `_score` variable and the `multiplier` value as `doc['multiplier'].value`:

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
  "took": 8,
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
    "max_score": 0.14384104,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 0.14384104,
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
`query` | Object | The query used for search. Required.
`script` | Object | The script used to calculate the score of the documents returned by the `query`. Required.
`min_score` | Float | Excludes documents with a score lower than `min_score` from the results. Optional.
`boost` | Float | Boosts the documents' scores by the given multiplier. Values less than 1.0 decrease relevance, and values greater than 1.0 increase relevance. Default is 1.0. 

The relevance scores calculated by the `script_score` query cannot be negative. 
{: .important}

## Customizing score calculation with built-in functions

To customize score calculation, you can use one of the built-in Painless functions. For every function, OpenSearch provides one or more Painless methods you can access in the script score context. You can call the Painless methods listed in the following sections directly without using a class name or instance name qualifier.

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

- `double randomScore(int <seed>)`: Uses the internal Lucene document IDs as seed values.
- `double randomScore(int <seed>, String <field-name>)`

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

### Term frequency functions

Term frequency functions expose term-level statistics in the score script source. You can use these statistics to implement custom information retrieval and ranking algorithms, like query-time multiplicative or additive score boosting by popularity. To apply a term frequency function, call one of the following Painless methods:

- `int termFreq(String <field-name>, String <term>)`: Retrieves the term frequency within a field for a specific term.
- `long totalTermFreq(String <field-name>, String <term>)`: Retrieves the total term frequency within a field for a specific term.
- `long sumTotalTermFreq(String <field-name>)`: Retrieves the sum of total term frequencies within a field.

#### Example

The following query calculates the score as the total term frequency for each field in the `fields` list multiplied by the `multiplier` value:

```json
GET /demo_index_v1/_search
{
  "query": {
    "function_score": {
      "query": {
        "match_all": {}
      },
      "script_score": {
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

The `lateInteractionFunction` supports the following parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `query_vectors` | Array of arrays | Yes | Query vectors for similarity matching |
| `vector_field` | String | Yes | Name of the document field containing vectors |
| `doc` | Map | Yes | Document source (use `params._source`) |
| `space_type` | String | No | Similarity metric. Default: `"l2"` |

The `space_type` parameter determines how similarity is calculated and accepts the following valid values.

| Space type | Description | Higher score means |
| :--- | :--- | :--- |
| `innerproduct` | Dot product | More similar vectors |
| `cosinesimil` | Cosine similarity | More similar direction |
| `l2` (default) | Euclidean distance | Closer vectors (inverted) |

For a complete example, see [Reranking by a field using an externally hosted late interaction model]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field-late-interaction/).

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, `script_score` queries are not executed.
{: .important}