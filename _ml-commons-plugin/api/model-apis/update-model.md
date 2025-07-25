---
layout: default
title: Update model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/model-apis/update-model/
---

# Update a model
**Introduced 2.12**
{: .label .label-purple }

Updates a model based on the `model_ID`.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Path and HTTP methods

```json
PUT /_plugins/_ml/models/<model_id>
```

## Request fields

The following table lists the updatable fields. Not all request fields are applicable to all models. To determine whether the field is applicable to your model type, see [Register Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/).

Field | Data type |  Description
:---  | :--- | :--- 
`connector` | Object | Contains specifications for a connector for a model hosted on a third-party platform. For more information, see [Creating a connector for a specific model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-connector-for-a-specific-model). For information about the updatable fields within a connector, see [Update Connector API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/update-connector/#request-fields).
`connector_id` | Optional | The connector ID of a standalone connector for a model hosted on a third-party platform. For more information, see [Standalone connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-standalone-connector). To update a standalone connector, you must undeploy the model, update the connector, and then redeploy the model.
`description` | String | The model description. 
`is_enabled`| Boolean | Specifies whether the model is enabled. Disabling the model makes it unavailable for Predict API requests, regardless of the model's deployment status. Default is `true`.
`model_config` | Object | The model's configuration, including the `model_type`, `embedding_dimension`, and `framework_type`. `all_config` is an optional JSON string that contains all model configurations. For more information, see [The `model_config` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model#the-model_config-object). |
`model_group_id` | String | The model group ID of the model group to which to register this model. 
`name`| String | The model name. 
`rate_limiter` | Object | Limits the number of times any user can call the Predict API on the model. For more information, see [Rate limiting inference calls]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#rate-limiting-inference-calls).
`rate_limiter.limit` | Integer | The maximum number of times any user can call the Predict API on the model per `unit` of time. By default, there is no limit on the number of Predict API calls. Once you set a limit, you cannot reset it to no limit. As an alternative, you can specify a high limit value and a small time unit, for example, 1 request per nanosecond.
`rate_limiter.unit` | String | The unit of time for the rate limiter. Valid values are `DAYS`, `HOURS`, `MICROSECONDS`, `MILLISECONDS`, `MINUTES`, `NANOSECONDS`, and `SECONDS`.
`guardrails`| Object | The guardrails for the model.
`interface`| Object | The interface for the model.

#### Example request: Disabling a model

```json
PUT /_plugins/_ml/models/MzcIJX8BA7mbufL6DOwl
{
    "is_enabled": false
}
```
{% include copy-curl.html %}

#### Example request: Rate limiting inference calls for a model

The following request limits the number of times you can call the Predict API on the model to 4 Predict API calls per minute:

```json
PUT /_plugins/_ml/models/T_S-cY0BKCJ3ot9qr0aP
{
  "rate_limiter": {
    "limit": "4",
    "unit": "MINUTES"
  }
}
```
{% include copy-curl.html %}

#### Example request: Updating the guardrails

```json
PUT /_plugins/_ml/models/MzcIJX8BA7mbufL6DOwl
{
  "guardrails": {
    "input_guardrail": {
      "stop_words": [
        {
          "index_name": "updated_stop_words_input",
          "source_fields": ["updated_title"]
        }
      ],
      "regex": ["updated_regex1", "updated_regex2"]
    },
    "output_guardrail": {
      "stop_words": [
        {
          "index_name": "updated_stop_words_output",
          "source_fields": ["updated_title"]
        }
      ],
      "regex": ["updated_regex1", "updated_regex2"]
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index": ".plugins-ml-model",
  "_id": "MzcIJX8BA7mbufL6DOwl",
  "_version": 10,
  "result": "updated",
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 48,
  "_primary_term": 4
}
```

