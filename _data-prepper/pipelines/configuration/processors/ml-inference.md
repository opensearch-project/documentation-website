---
layout: default
title: ML inference
parent: Processors
grand_parent: Pipelines
nav_order: 210
---

# ML inference processor

The `ml_inference` processor allows you to use OpenSearch machine learning (ML) functionality within OpenSearch Data Prepper. By integrating ML models into Data Prepper pipelines, you can apply them during data ingestion into OpenSearch in order to power AI-driven search experiences such as vector search, semantic search, or conversational search. To explore OpenSearch AI-powered search types, see [AI search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/).

Using the `ml_inference` processor, you can invoke an OpenSearch-hosted ML model within your Data Prepper pipeline in order to process events. The processor supports both real-time invocations and asynchronous (offline) batch job invocations.

To use the `ml_inference` processor, you must have the ML Commons plugin installed on your cluster. The plugin is included by default in standard OpenSearch distributions. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).
{: .note}

## Configuration fields

The following table describes the configuration options for the `ml_inference` processor.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `host`             | Yes      | String | The name of the OpenSearch host.                                                                          |
| `action_type`      | Yes      | String | The type of action to perform. Currently, only `batch_predict` is supported. Default is `batch_predict`. |
| `model_id`         | Yes      | String | The ID of the ML model to invoke.                                             |
| `output_path`      | Yes      | String | The [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) location to which the offline batch job results will be written.                                      |
| `aws.region`       | Yes      | String | The AWS Region to which OpenSearch Service is deployed.                                                  |
| `aws.sts_role_arn` | No       | String | The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role to assume.                                  |
| `service_name`     | No       | String | The name of the AI service hosting the model used for inference. Default is `sagemaker` (Amazon SageMaker).  |
| `input_key`        | No       | String | The name of the event field to use as the S3 object key name when writing batch job results. This allows dynamic naming of output files based on event data.                                                              |
| `ml_when`          | No       | String | A conditional expression that determines when to invoke the `ml_inference` processor.                     |
| `tags_on_failure`  | No       | List   | A list of tags to add to events if the `ml_inference` processor fails or encounters an error.             |



#### Example configuration

The following example shows an example `map_to_list` processor configuration:

```yaml
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
{% include copy.html %}

## Usage

The processor supports `batch_predict` operations, which invoke the [Batch Predict API]({{site.url}}{{site.baseurl}}ml-commons-plugin/api/model-apis/batch-predict/) for offline batch processing.


## Behavior

For `batch_predict` operations, the `ml_inference` processor works best with the [S3 source]({{site.url}}{{site.baseurl}}data-prepper/pipelines/configuration/sources/s3/). To configure S3 to process metadata only, configure the S3 scan block as follows:

```yaml
scan:
  buckets:
    - bucket:
        name: test-offlinebatch
        data_selection: metadata_only
```
{% include copy.html %}

When `metadata_only` is enabled, the processor receives events in the following format:

```json
{"bucket":"test-offlinebatch","length":6234,"time":1738108982.000000000,"key":"input_folder/batch_input_1.json"}
```

To filter specific records for processing, use `ml_when` conditions.


## Monitoring the offline batch job status

Once an offline batch job is created by the Data Prepper pipeline, you can track its status using the AI provider's (Amazon SageMaker or Amazon Bedrock) native console.

Alternatively, you can check the job status by calling the [Search Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/search-task/). For example, to search for all currently running tasks, use the following request:

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
