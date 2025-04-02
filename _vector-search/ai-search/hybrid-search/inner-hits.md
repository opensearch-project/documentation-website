---
layout: default
title: Inner hits with hybrid query
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 30
---

# Inner hits with hybrid query
**Introduced 3.0-beta**
{: .label .label-purple }

Hybrid search users can retrieve the underlying nested inner objects or child documents information by adding an `inner_hits` clause in the search request. To know more about `inner_hits`, read [Retrieve inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).
During hybrid query execution, each subquery retrieves the parent documents based on the relevant hidden inner hits. Following that, parent documents from all the subqueries are normalized and combined. Then, relevant inner_hits for each parent document are fetched from the shards.

The major difference between inner hits with traditional query and hybrid query is as follows:
1. The parent documents order in the final search response of traditional query will be determined by the inner_hits relevancy.
2. The parent documents order in the final search response of hybrid query will be determined by the hybrid score (i.e. normalized score). However, the parent documents are fetched from the shard based on the inner hits relevancy. 

The inner hits will reflect the raw scores (i.e. scores prior to normalization) information and parent documents will reflect the hybrid score in the final search response.
{: .note}

Users can understand the relevancy between `inner_hits` score and hybrid score by passing `explain` flag with the hybrid query search request.

`explain` is an expensive operation in terms of both resources and time. For production clusters, we recommend using it sparingly for the purpose of troubleshooting.
{: .warning }

## Example

The following example shows the steps to use `inner_hits` feature with hybrid query. 

### Step 1: Create the index
The following index mapping contains two nested fields `user` and `location` respectively.
```json
PUT /my-nlp-index
{
    "settings": {
        "number_of_shards": 3,
        "number_of_replicas": 0
    },
    "mappings": {
        "properties": {
            "user": {
                "type": "nested",
                "properties": {
                    "name": {
                        "type": "text"
                    },
                    "age": {
                        "type": "integer"
                    }
                }
            },
            "location": {
                "type": "nested",
                "properties": {
                    "city": {
                        "type": "text"
                    },
                    "state": {
                        "type": "text"
                    }
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

### Step 2: Create search pipeline with normalization-processor
Configure a search pipeline with a normalization-processor, use the following request. The normalization technique in the processor is set to min_max, and the combination technique is set to arithmetic_mean.
```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {}
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest the documents into the index
To ingest documents into the index created in the previous step, send the following requests:
```json
PUT /my-nlp-index/_doc/1
{
    "user": [
        {
            "name": "John Alder",
            "age": 35
        },
        {
            "name": "Sammy",
            "age": 34
        },
        {
            "name": "Mike",
            "age": 32
        },
        {
            "name": "Maples",
            "age": 30
        }
    ],
    "location":[
        {
            "city":"Amsterdam",
            "state":"Netherlands"
        },
        {
            "city":"Udaipur",
            "state":"Rajasthan"
        },
        {
            "city":"Naples",
            "state":"Italy"
        }
    ]
}
```
{% include copy-curl.html %}
```json
PUT /my-nlp-index/_doc/2
{
    "user": [
        {
            "name": "John Wick",
            "age": 46
        },
        {
            "name": "John Snow",
            "age": 40
        },
        {
            "name": "Sansa Stark",
            "age": 22
        },
        {
            "name": "Arya Stark",
            "age": 20
        }
    ],
    "location":[
        {
            "city":"Tromso",
            "state":"Norway"
        },
        {
            "city":"Los Angeles",
            "state":"California"
        },
        {
            "city":"London",
            "state":"UK"
        }
    ]
}
```
{% include copy-curl.html %}

### Search the index using hybrid search and fetch inner hits
Combining search results on path `user` and path `location` by using hybrid query.

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
    "query": {
        "hybrid": {
            "queries": [
                {
                    "nested": {
                        "path": "user",
                        "query": {
                            "match": {
                                "user.name": "John"
                            }
                        },
                        "score_mode":"sum",
                        "inner_hits": {}
                    }
                },
                {
                    "nested": {
                        "path": "location",
                        "query": {
                            "match": {
                                "location.city": "Udaipur"
                            }
                        },
                        "inner_hits": {}
                    }
                }
            ]
        }
    }
}
```
{% include copy-curl.html %}

The response contain the relevant inner hits on both the paths `user` and `location`.
```json
{
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "user": [
            {
              "name": "John Alder",
              "age": 35
            },
            {
              "name": "Sammy",
              "age": 34
            },
            {
              "name": "Mike",
              "age": 32
            },
            {
              "name": "Maples",
              "age": 30
            }
          ],
          "location": [
            {
              "city": "Amsterdam",
              "state": "Netherlands"
            },
            {
              "city": "Udaipur",
              "state": "Rajasthan"
            },
            {
              "city": "Naples",
              "state": "Italy"
            }
          ]
        },
        "inner_hits": {
          "location": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 0.44583148,
              "hits": [
                {
                  "_index": "my-nlp-index",
                  "_id": "1",
                  "_nested": {
                    "field": "location",
                    "offset": 1
                  },
                  "_score": 0.44583148,
                  "_source": {
                    "city": "Udaipur",
                    "state": "Rajasthan"
                  }
                }
              ]
            }
          },
          "user": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 0.4394061,
              "hits": [
                {
                  "_index": "my-nlp-index",
                  "_id": "1",
                  "_nested": {
                    "field": "user",
                    "offset": 0
                  },
                  "_score": 0.4394061,
                  "_source": {
                    "name": "John Alder",
                    "age": 35
                  }
                }
              ]
            }
          }
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 5.0E-4,
        "_source": {
          "user": [
            {
              "name": "John Wick",
              "age": 46
            },
            {
              "name": "John Snow",
              "age": 40
            },
            {
              "name": "Sansa Stark",
              "age": 22
            },
            {
              "name": "Arya Stark",
              "age": 20
            }
          ],
          "location": [
            {
              "city": "Tromso",
              "state": "Norway"
            },
            {
              "city": "Los Angeles",
              "state": "California"
            },
            {
              "city": "London",
              "state": "UK"
            }
          ]
        },
        "inner_hits": {
          "location": {
            "hits": {
              "total": {
                "value": 0,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [

              ]
            }
          },
          "user": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": 0.31506687,
              "hits": [
                {
                  "_index": "my-nlp-index",
                  "_id": "2",
                  "_nested": {
                    "field": "user",
                    "offset": 0
                  },
                  "_score": 0.31506687,
                  "_source": {
                    "name": "John Wick",
                    "age": 46
                  }
                },
                {
                  "_index": "my-nlp-index",
                  "_id": "2",
                  "_nested": {
                    "field": "user",
                    "offset": 1
                  },
                  "_score": 0.31506687,
                  "_source": {
                    "name": "John Snow",
                    "age": 40
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```

## Understanding the relevancy between inner_hits and parent documents by passing `explain` flag
User can pass `explain` flag in the search request to understand the search response formation. To know more about using explain api with hybrid query, read [Hybrid score explanation processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/explanation-processor/) and [Hybrid search explain]({{site.url}}{{site.baseurl}}/_vector-search/ai-search/hybrid-search/explain/).
```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline&explain=true
{
    "query": {
        "hybrid": {
            "queries": [
                {
                    "nested": {
                        "path": "user",
                        "query": {
                            "match": {
                                "user.name": "John"
                            }
                        },
                        "score_mode":"sum",
                        "inner_hits": {}
                    }
                },
                {
                    "nested": {
                        "path": "location",
                        "query": {
                            "match": {
                                "location.city": "Udaipur"
                            }
                        },
                        "inner_hits": {}
                    }
                }
            ]
        }
    }
}
```
{% include copy-curl.html %}

The response contains the `explanation` details that show the relevant information about score mode, number of children contributing to the parent document, normalization, score combination techniques etc.
```json
{
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_shard": "[my-nlp-index][2]",
        "_node": "YNiGBqqRTOW9Khc_HK1QEQ",
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "user": [
            {
              "name": "John Alder",
              "age": 35
            },
            {
              "name": "Sammy",
              "age": 34
            },
            {
              "name": "Mike",
              "age": 32
            },
            {
              "name": "Maples",
              "age": 30
            }
          ],
          "location": [
            {
              "city": "Amsterdam",
              "state": "Netherlands"
            },
            {
              "city": "Udaipur",
              "state": "Rajasthan"
            },
            {
              "city": "Naples",
              "state": "Italy"
            }
          ]
        },
        "_explanation": {
          "value": 1.0,
          "description": "arithmetic_mean combination of:",
          "details": [
            {
              "value": 1.0,
              "description": "min_max normalization of:",
              "details": [
                {
                  "value": 0.4458314776420593,
                  "description": "combined score of:",
                  "details": [
                    {
                      "value": 0.4394061,
                      "description": "Score based on 1 child docs in range from 0 to 6, using score mode Avg",
                      "details": [
                        {
                          "value": 0.4394061,
                          "description": "weight(user.name:john in 0) [PerFieldSimilarity], result of:",
                          "details": [
                            {
                              "value": 0.4394061,
                              "description": "score(freq=1.0), computed as boost * idf * tf from:",
                              "details": [
                                {
                                  "value": 1.2039728,
                                  "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                                  "details": [
                                    {
                                      "value": 1,
                                      "description": "n, number of documents containing term",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 4,
                                      "description": "N, total number of documents with field",
                                      "details": [
                                        
                                      ]
                                    }
                                  ]
                                },
                                {
                                  "value": 0.36496347,
                                  "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                                  "details": [
                                    {
                                      "value": 1.0,
                                      "description": "freq, occurrences of term within document",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 1.2,
                                      "description": "k1, term saturation parameter",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 0.75,
                                      "description": "b, length normalization parameter",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 2.0,
                                      "description": "dl, length of field",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 1.25,
                                      "description": "avgdl, average length of field",
                                      "details": [
                                        
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "value": 0.44583148,
                      "description": "Score based on 1 child docs in range from 0 to 6, using score mode Avg",
                      "details": [
                        {
                          "value": 0.44583148,
                          "description": "weight(location.city:udaipur in 5) [PerFieldSimilarity], result of:",
                          "details": [
                            {
                              "value": 0.44583148,
                              "description": "score(freq=1.0), computed as boost * idf * tf from:",
                              "details": [
                                {
                                  "value": 0.98082924,
                                  "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                                  "details": [
                                    {
                                      "value": 1,
                                      "description": "n, number of documents containing term",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 3,
                                      "description": "N, total number of documents with field",
                                      "details": [
                                        
                                      ]
                                    }
                                  ]
                                },
                                {
                                  "value": 0.45454544,
                                  "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                                  "details": [
                                    {
                                      "value": 1.0,
                                      "description": "freq, occurrences of term within document",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 1.2,
                                      "description": "k1, term saturation parameter",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 0.75,
                                      "description": "b, length normalization parameter",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 1.0,
                                      "description": "dl, length of field",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 1.0,
                                      "description": "avgdl, average length of field",
                                      "details": [
                                        
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        "inner_hits": {
          "location": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 0.44583148,
              "hits": [
                {
                  "_index": "my-nlp-index",
                  "_id": "1",
                  "_nested": {
                    "field": "location",
                    "offset": 1
                  },
                  "_score": 0.44583148,
                  "_source": {
                    "city": "Udaipur",
                    "state": "Rajasthan"
                  }
                }
              ]
            }
          },
          "user": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 0.4394061,
              "hits": [
                {
                  "_index": "my-nlp-index",
                  "_id": "1",
                  "_nested": {
                    "field": "user",
                    "offset": 0
                  },
                  "_score": 0.4394061,
                  "_source": {
                    "name": "John Alder",
                    "age": 35
                  }
                }
              ]
            }
          }
        }
      },
      {
        "_shard": "[my-nlp-index][1]",
        "_node": "YNiGBqqRTOW9Khc_HK1QEQ",
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 5.0E-4,
        "_source": {
          "user": [
            {
              "name": "John Wick",
              "age": 46
            },
            {
              "name": "John Snow",
              "age": 40
            },
            {
              "name": "Sansa Stark",
              "age": 22
            },
            {
              "name": "Arya Stark",
              "age": 20
            }
          ],
          "location": [
            {
              "city": "Tromso",
              "state": "Norway"
            },
            {
              "city": "Los Angeles",
              "state": "California"
            },
            {
              "city": "London",
              "state": "UK"
            }
          ]
        },
        "_explanation": {
          "value": 5.0E-4,
          "description": "arithmetic_mean combination of:",
          "details": [
            {
              "value": 0.001,
              "description": "min_max normalization of:",
              "details": [
                {
                  "value": 0.3150668740272522,
                  "description": "combined score of:",
                  "details": [
                    {
                      "value": 0.31506687,
                      "description": "Score based on 2 child docs in range from 0 to 6, using score mode Avg",
                      "details": [
                        {
                          "value": 0.31506687,
                          "description": "weight(user.name:john in 0) [PerFieldSimilarity], result of:",
                          "details": [
                            {
                              "value": 0.31506687,
                              "description": "score(freq=1.0), computed as boost * idf * tf from:",
                              "details": [
                                {
                                  "value": 0.6931472,
                                  "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                                  "details": [
                                    {
                                      "value": 2,
                                      "description": "n, number of documents containing term",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 4,
                                      "description": "N, total number of documents with field",
                                      "details": [
                                        
                                      ]
                                    }
                                  ]
                                },
                                {
                                  "value": 0.45454544,
                                  "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                                  "details": [
                                    {
                                      "value": 1.0,
                                      "description": "freq, occurrences of term within document",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 1.2,
                                      "description": "k1, term saturation parameter",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 0.75,
                                      "description": "b, length normalization parameter",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 2.0,
                                      "description": "dl, length of field",
                                      "details": [
                                        
                                      ]
                                    },
                                    {
                                      "value": 2.0,
                                      "description": "avgdl, average length of field",
                                      "details": [
                                        
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "value": 0.0,
                      "description": "Not a match",
                      "details": [
                        
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        "inner_hits": {
          "location": {
            "hits": {
              "total": {
                "value": 0,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                
              ]
            }
          },
          "user": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": 0.31506687,
              "hits": [
                {
                  "_index": "my-nlp-index",
                  "_id": "2",
                  "_nested": {
                    "field": "user",
                    "offset": 0
                  },
                  "_score": 0.31506687,
                  "_source": {
                    "name": "John Wick",
                    "age": 46
                  }
                },
                {
                  "_index": "my-nlp-index",
                  "_id": "2",
                  "_nested": {
                    "field": "user",
                    "offset": 1
                  },
                  "_score": 0.31506687,
                  "_source": {
                    "name": "John Snow",
                    "age": 40
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```

## Sorting and Pagination with inner hits
1. To apply sorting, users can add `sort` sub-clause in the `inner_hits` clause.
2. To apply pagination users can pass `from` and `size` parameters in the `inner_hits` clause.
3. Users can also define custom name for the inner hits in the search response. This is useful in differentiating between multiple inner hits in a single query.
To know more about it, please read documentation [Inner hits parameter]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/#inner_hits-parameters)
