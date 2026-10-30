---
layout: default
title: Predict
parent: Model APIs
grand_parent: ML APIs
nav_order: 60
---

# Predict API

Sends input to a model and returns the model's output (inference). The request body fields depend on the model type:

- Models trained using the [Train API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/) predict from indexed data or from a data frame provided in the request.
- Local models, such as text embedding, sparse encoding, text similarity, and question answering models, accept text input.
- Externally hosted models accept the input fields defined in their connector.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
POST /_plugins/_ml/_predict/{algorithm_name}/{model_id}
POST /_plugins/_ml/models/{model_id}/_predict
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `model_id` | String | The model ID. Required. |
| `algorithm_name` | String | The algorithm name, for example, `kmeans`, `text_embedding`, or `remote`. The name is not case sensitive. If you use the `/_plugins/_ml/models/{model_id}/_predict` endpoint, OpenSearch uses the model's algorithm. |

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :---
`parameters` | Object | Optional | Model-specific parameters for prediction.
`parameters.input_processors` | Array | Optional | A list of processors used to transform the input data before sending it to the model. For more information, see [Processor chain]({{site.url}}{{site.baseurl}}/ml-commons-plugin/processor-chain/).
`parameters.output_processors` | Array | Optional | A list of processors used to transform the model's output data. For more information, see [Processor chain]({{site.url}}{{site.baseurl}}/ml-commons-plugin/processor-chain/).
`input_index` | Array | Optional | For models trained using the [Train API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/), a list of indexes containing the data to predict.
`input_query` | Object | Optional | For models trained using the Train API, a search query that selects the documents from `input_index`.
`input_data` | Object | Optional | For models trained using the Train API, the data to predict, provided directly as a data frame containing `column_metas` and `rows`.
`text_docs` | Array | Optional | For local text embedding, sparse encoding, and text similarity models, a list of input texts.
`query_text` | String | Optional | For text similarity models, the query text compared with each entry in `text_docs`.
`return_number` | Boolean | Optional | For local text embedding models, whether to return the embedding as numbers. Default is `true`.
`target_response` | Array | Optional | For local text embedding models, a list of model output names to return, for example, `sentence_embedding`.
`question` | String | Optional | For question answering models, the question to answer.
`context` | String | Optional | For question answering models, the text containing the answer.

For externally hosted models, the actual input fields depend on the model's connector configuration. For more information, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

## Example request

```json
POST /_plugins/_ml/_predict/kmeans/{model-id}
{
    "input_query": {
        "_source": ["petal_length_in_cm", "petal_width_in_cm"],
        "size": 10000
    },
    "input_index": [
        "iris_data"
    ]
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
