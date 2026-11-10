---
layout: default
title: Train and predict 
parent: Model APIs
grand_parent: ML APIs
nav_order: 75
---

# Train and Predict API

Use to train and then immediately predict against the same training dataset. Can only be used with unsupervised learning models. The following table lists the supported algorithms and the value to specify in the `algorithm` path parameter.

| Algorithm | `algorithm` value |
| :--- | :--- |
| [Batch RCF]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/#batch-rcf) | `batch_rcf` |
| [Fixed in time (FIT) RCF]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/#fit-rcf) | `fit_rcf` |
| [k-means]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/#k-means) | `kmeans` |
| [RCF Summarize]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/#rcf-summarize) | `rcf_summarize` |

## Endpoints

```json
POST /_plugins/_ml/_train_predict/{algorithm}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `algorithm` | String | The name of the algorithm, for example, `kmeans`. The name is not case sensitive. Required. |

## Request body fields

The following table lists the available request body fields. Provide the data using either `input_index` and `input_query` or `input_data`.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `parameters` | Object | The algorithm hyperparameters. The available parameters depend on the algorithm. For the parameters of each algorithm, see [Supported algorithms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/). Optional. |
| `input_index` | Array | A list of indexes containing the data. |
| `input_query` | Object | A search query that selects the documents from `input_index`. |
| `input_data` | Object | The data provided directly as a data frame, containing `column_metas` and `rows`. |

## Example request: Train and predict with indexed data

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

## Example request: Train and predict with data directly

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

## Example response

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