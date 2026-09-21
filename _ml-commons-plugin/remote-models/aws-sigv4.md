---
layout: default
title: AWS Signature Version 4 authentication
has_children: false
nav_order: 50
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# AWS Signature Version 4 authentication

Connectors that use the `aws_sigv4` protocol sign each request with AWS Signature Version 4. AWS services, such as Amazon SageMaker, Amazon Bedrock, Amazon Comprehend, and Amazon Textract, use this protocol. The protocol signs each request with the credentials that you provide and adds the required `Authorization` header, so you don't need to specify one.

The following request creates a standalone connector that uses the `aws_sigv4` protocol. It shows the `credential` and `parameters` fields that the protocol requires. The `url` and `request_body` fields are specific to the service and model that you're calling:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "sagemaker: embedding",
    "description": "Connector for a SageMaker embedding model",
    "version": 1,
    "protocol": "aws_sigv4",
    "credential": {
        "access_key": "<access_key>",
        "secret_key": "<secret_key>",
        "session_token": "<session_token>"
    },
    "parameters": {
        "region": "us-west-2",
        "service_name": "sagemaker"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "url": "https://runtime.sagemaker.${parameters.region}.amazonaws.com/endpoints/<endpoint_name>/invocations",
            "request_body": "[\"${parameters.inputs}\"]"
        }
    ]
}
```
{% include copy-curl.html %}

For a complete request for your service and model, including the `url`, `request_body`, and any processing functions, see the blueprint for your platform and model in [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).

## Request body fields

When `protocol` is set to `aws_sigv4`, the `credential` object supports the following fields.

| Field | Data type | Required/Optional | Description |
|:---|:---|:---|:---|
| `access_key` | String | Required | The access key for the AWS account. |
| `secret_key` | String | Required | The secret key for the AWS account. |
| `session_token` | String | Optional | A temporary session token for the AWS account. |

When `protocol` is set to `aws_sigv4`, the `parameters` object supports the following fields.

| Field | Data type | Required/Optional | Description |
|:---|:---|:---|:---|
| `region` | String | Required | The AWS Region in which the service is hosted. |
| `service_name` | String | Required | The name of the AWS service that the connector calls. |

## Next steps

- To find the blueprint for your service and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).
- To register and deploy a model that uses this connector, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
