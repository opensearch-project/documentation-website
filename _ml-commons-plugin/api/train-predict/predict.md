---
layout: default
title: Predict
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 60
---

# Predict API

ML Commons can predict new data with your trained model either from indexed data or a data frame. To use the Predict API, the `model_id` is required.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
POST /_plugins/_ml/_predict/<algorithm_name>/<model_id>
```

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :---
`parameters` | Object | Optional | Model-specific parameters for prediction.
`parameters.input_processors` | Array | Optional | A list of processors used to transform the input data before sending it to the model. For more information, see [Processor chain]({{site.url}}{{site.baseurl}}/ml-commons-plugin/processor-chain/).
`parameters.output_processors` | Array | Optional | A list of processors used to transform the model's output data. For more information, see [Processor chain]({{site.url}}{{site.baseurl}}/ml-commons-plugin/processor-chain/).

For externally hosted models, the actual input fields depend on the model's connector configuration. For more information, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

## Example request

```json
POST /_plugins/_ml/_predict/kmeans/<model-id>
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
