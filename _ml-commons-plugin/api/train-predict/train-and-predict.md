---
layout: default
title: Train and predict 
parent: Train and Predict APIs
grand_parent: ML Commons API
has_children: true
nav_order: 10
---

## Train and predict

Use to train and then immediately predict against the same training dataset. Can only be used with unsupervised learning models and the following algorithms:

- `BATCH_RCF`
- `FIT_RCF`
- `k-means`

#### Example request: Train and predict with indexed data

```json
POST /_plugins/_ml/_train_predict/kmeans
{
    "parameters": {
        "centroids": 2,
        "iterations": 10,
        "distance_type": "COSINE"
    },
    "input_query": {
        "query": {
            "bool": {
                "filter": [
                    {
                        "range": {
                            "k1": {
                                "gte": 0
                            }
                        }
                    }
                ]
            }
        },
        "size": 10
    },
    "input_index": [
        "test_data"
    ]
}
```
{% include copy-curl.html %}

#### Example request: Train and predict with data directly

```json
POST /_plugins/_ml/_train_predict/kmeans
{
    "parameters": {
        "centroids": 2,
        "iterations": 1,
        "distance_type": "EUCLIDEAN"
    },
    "input_data": {
        "column_metas": [
            {
                "name": "k1",
                "column_type": "DOUBLE"
            },
            {
                "name": "k2",
                "column_type": "DOUBLE"
            }
        ],
        "rows": [
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 1.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 2.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 1.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 4.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 1.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 0.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 10.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 2.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 10.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 4.00
                    }
                ]
            },
            {
                "values": [
                    {
                        "column_type": "DOUBLE",
                        "value": 10.00
                    },
                    {
                        "column_type": "DOUBLE",
                        "value": 0.00
                    }
                ]
            }
        ]
    }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "status" : "COMPLETED",
  "prediction_result" : {
    "column_metas" : [
      {
        "name" : "ClusterID",
        "column_type" : "INTEGER"
      }
    ],
    "rows" : [
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 1
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      },
      {
        "values" : [
          {
            "column_type" : "INTEGER",
            "value" : 0
          }
        ]
      }
    ]
  }
}
```