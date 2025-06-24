---
layout: default
title: Update model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 40
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/model-apis/update-model/
---

# Update a model
**Introduced 2.12**
{: .label .label-purple }

Updates a model based on the `model_ID`.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
PUT /_plugins/_ml/models/<model_id>
```

## Request body fields

The following table lists the updatable fields. Not all request fields are applicable to all models. To determine whether the field is applicable to your model type, see [Register Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/).

Field | Data type |  Description
:---  | :--- | :--- 
`connector` | Object | Contains specifications for a connector for a model hosted on a third-party platform. For more information, see [Creating a connector for a specific model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-connector-for-a-specific-model). For information about the updatable fields within a connector, see [Update Connector API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/update-connector/#request-body-fields).
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

#### Example requests: Updating the guardrails

```json
PUT /_plugins/_ml/models/MzcIJX8BA7mbufL6DOwl
{
  "guardrails": {
    "type": "local_regex",
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

```json
PUT /_plugins/_ml/models/9uGdCJABjaMXYrp14YRj
{
  "guardrails": {
    "type": "model",
    "input_guardrail": {
      "model_id": "V-G1CJABjaMXYrp1QoUC",
      "response_validation_regex": "^\\s*[Aa]ccept\\s*$"
    },
    "output_guardrail": {
      "model_id": "V-G1CJABjaMXYrp1QoUC",
      "response_validation_regex": "^\\s*[Aa]ccept\\s*$"
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

#### Example request: Updating the model interface 

You can update a model's interface to define input and output schemas. This is useful when working with models that lack a default interface or require customization. For more information about model interfaces, see [The `Interface` parameter]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-interface-parameter). 

The following example request specifies the output schema for an [AI21 Labs Jurassic model](https://aws.amazon.com/bedrock/ai21/) that was registered without a post-processing function:

```json
PUT /_plugins/_ml/models/IMcNB5UB7judm8f45nXo
{
    "interface": {
        "output": "{\n  \"type\": \"object\",\n  \"properties\": {\n    \"inference_results\": {\n      \"type\": \"array\",\n      \"items\": {\n        \"type\": \"object\",\n        \"properties\": {\n          \"output\": {\n            \"type\": \"array\",\n            \"items\": {\n              \"type\": \"object\",\n              \"properties\": {\n                \"name\": {\n                  \"type\": \"string\"\n                },\n                \"dataAsMap\": {\n                  \"type\": \"object\",\n                  \"properties\": {\n                    \"id\": {\n                      \"type\": \"number\"\n                    },\n                    \"prompt\": {\n                      \"type\": \"object\",\n                      \"properties\": {\n                        \"text\": {\n                          \"type\": \"string\"\n                        },\n                        \"tokens\": {\n                          \"type\": \"array\",\n                          \"items\": {\n                            \"type\": \"object\",\n                            \"properties\": {\n                              \"generatedToken\": {\n                                \"type\": \"object\",\n                                \"properties\": {\n                                  \"token\": {\n                                    \"type\": \"string\"\n                                  },\n                                  \"logprob\": {\n                                    \"type\": \"number\"\n                                  },\n                                  \"raw_logprob\": {\n                                    \"type\": \"number\"\n                                  }\n                                }\n                              },\n                              \"textRange\": {\n                                \"type\": \"object\",\n                                \"properties\": {\n                                  \"start\": {\n                                    \"type\": \"number\"\n                                  },\n                                  \"end\": {\n                                    \"type\": \"number\"\n                                  }\n                                }\n                              }\n                            }\n                          }\n                        }\n                      }\n                    },\n                    \"completions\": {\n                      \"type\": \"array\",\n                      \"items\": {\n                        \"type\": \"object\",\n                        \"properties\": {\n                          \"data\": {\n                            \"type\": \"object\",\n                            \"properties\": {\n                              \"text\": {\n                                \"type\": \"string\"\n                              },\n                              \"tokens\": {\n                                \"type\": \"array\",\n                                \"items\": {\n                                  \"type\": \"object\",\n                                  \"properties\": {\n                                    \"generatedToken\": {\n                                      \"type\": \"object\",\n                                      \"properties\": {\n                                        \"token\": {\n                                          \"type\": \"string\"\n                                        },\n                                        \"logprob\": {\n                                          \"type\": \"number\"\n                                        },\n                                        \"raw_logprob\": {\n                                          \"type\": \"number\"\n                                        }\n                                      }\n                                    },\n                                    \"textRange\": {\n                                      \"type\": \"object\",\n                                      \"properties\": {\n                                        \"start\": {\n                                          \"type\": \"number\"\n                                        },\n                                        \"end\": {\n                                          \"type\": \"number\"\n                                        }\n                                      }\n                                    }\n                                  }\n                                }\n                              }\n                            }\n                          },\n                          \"finishReason\": {\n                            \"type\": \"object\",\n                            \"properties\": {\n                              \"reason\": {\n                                \"type\": \"string\"\n                              },\n                              \"length\": {\n                                \"type\": \"number\"\n                              }\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          },\n          \"status_code\": {\n            \"type\": \"integer\"\n          }\n        }\n      }\n    }\n  }\n}"
    }
}
```
{% include copy-curl.html %}

If the model was registered using the [Amazon Bedrock AI21 Labs Jurassic blueprint](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_ai21labs_jurassic_blueprint.md), a default interface is applied automatically.
{: .note}

If the model interface is no longer needed, you can remove both the input and output schemas in order to bypass model schema validation:

```json
PUT /_plugins/_ml/models/IMcNB5UB7judm8f45nXo
{
  "interface": {
    "input": null,
    "output": null
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index": ".plugins-ml-model",
  "_id": "IMcNB5UB7judm8f45nXo",
  "_version": 2,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 379,
  "_primary_term": 5
}
```

