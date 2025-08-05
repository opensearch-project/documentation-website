---
layout: default
title: ml_inference
parent: Processors
grand_parent: Pipelines
nav_order: 11
---

# ml_commons integration for OpenSearch Data Prepper

The [ML Commons](https://docs.opensearch.org/latest/ml-commons-plugin/) is a plugin for OpenSearch that extends its capabilities to include machine learning functionalities. By integrating ml-commons into OpenSearch Data Prepper pipelines developers can seamlessly leverage various ML models directly for ingestion within OpenSearch Service to power a wide range of AI-driven search experiences like [Vector Search](https://docs.opensearch.org/latest/vector-search/), [Semantic Search](https://docs.opensearch.org/latest/vector-search/ai-search/semantic-search/), [Conversational Search](https://docs.opensearch.org/2.10/ml-commons-plugin/conversational-search/), and more.


## ml_inference processor configuration
The ml_inference processor enables invocation of a Ml-Commons hosted ML model within your Data Prepper pipeline in order to process events. It supports both realtime invocations and asynchronous offline batch job invocations based on your use case.

## Configuration fields

You can configure the ml_inference processor using the following configuration options.

Field                | Type    | Required | Description                                                                 
-------------------- | ------- | -------- | ---------------------------------------------------------------------------- 
`host`               | String  | Required | The name of the OpenSearch host that has the ml-commons plugin installed.
`action_type`        | String  | Required | Specifies the action type, only `batch_predict` is allowed now. Default is `batch_predict`.
`model_id`           | String  | Required | The ML model id to be invoked in ml-commons plugin
`output_path`        | String  | Required | The S3 location to write the offline batch job responses to.
`aws.region`         | String  | Required | The AWS Region in which the OpenSearch Service is located.
`aws.sts_role_arn`   | String  | Optional | The Amazon Resource Name (ARN) of the role to assume before invoking the ml-commons plugin.
`service_name`       | String  | Optional | AI service hosting the remote model for ML Commons predictions, default is `sagemaker`.             
`input_key`          | String  | Optional | The name of the field that defines the S3 key name.
`ml_when`            | String  | Optional | A conditional expression that determines when to invoke the ml_inference processor.
`tags_on_failure`    | List    | Optional | A list of tags to add to events when ml_inference plugin fails or encounters an unexpected error.

#### Example configuration

```
  processor:
    - ml_inference:
        host: "https://search-ml-inference-test.us-west-2.es.amazonaws.com"
        action_type: "batch_predict"
        service_name: "sagemaker"
        model_id: "9t4AbpYBQB1BoSOe8g8N"
        output_path: "s3://test-bucket/output"
        aws:
          region: "us-west-2"
          sts_role_arn: "arn:aws:iam::123456789012:role/my-inference-role"
        ml_when: /bucket == "offlinebatch"

```
{% include copy-curl.html %}

## Usage

The processor supports the following invocation types: 

- `batch_predict`: The processor invokes the [batch_predict](https://docs.opensearch.org/latest/ml-commons-plugin/api/model-apis/batch-predict/) API in ML-Commons for offline batch processing.
- `predict`: The processor invokes the [predict](https://docs.opensearch.org/latest/ml-commons-plugin/api/train-predict/predict/) API in ML-Commons for real-time inference. (Coming soon)


## Behavior

For batch_predict operations, the ml_inference processor works best with the [S3 Scan](https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sources/s3/) source. Configure S3 Scan to process metadata only by setting:

```
  scan:
    buckets:
      - bucket:
          name: test-offlinebatch
          data_selection: metadata_only
```
{% include copy-curl.html %}

When metadata_only is enabled, the processor receives events in this format:
```
{"bucket":"test-offlinebatch","length":6234,"time":1738108982.000000000,"key":"input_folder/batch_input_1.json"}
```
You can use ml_when conditions to filter specific records for processing.


## Monitor the offline batch jobs staus
Once offline batch jobs are created by the OpenSearch Data Prepper pipelines, you can track the status of offline batch jobs through the AI provider's native console (SageMaker/Bedrock) or ML-Commons GetTask API.
Example query to check job status in Ml-Commons:
```json
GET /_plugins/_ml/tasks/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "state": "RUNNING"
          }
        }
      ]
    }
  },
  "_source": ["model_id", "state", "task_type", "create_time", "last_update_time"]
}
```
{% include copy-curl.html %}
