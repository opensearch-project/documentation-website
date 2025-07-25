---
layout: default
title: Building blueprints
has_children: false
nav_order: 65
parent: ML extensibility 
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/remote-models/blueprints/
---

# Building blueprints

All connectors consist of a JSON blueprint created by machine learning (ML) developers. The blueprint allows administrators and data scientists to make connections between OpenSearch and an AI service or model-serving technology. 

The following example shows a blueprint that connects to Amazon SageMaker:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "<YOUR CONNECTOR NAME>",
  "description": "<YOUR CONNECTOR DESCRIPTION>",
  "version": "<YOUR CONNECTOR VERSION>",
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "<ADD YOUR AWS ACCESS KEY HERE>",
    "secret_key": "<ADD YOUR AWS SECRET KEY HERE>",
    "session_token": "<ADD YOUR AWS SECURITY TOKEN HERE>"
  },
  "parameters": {
    "region": "<ADD YOUR AWS REGION HERE>",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "url": "<ADD YOUR Sagemaker MODEL ENDPOINT URL>",
      "request_body": "<ADD YOUR REQUEST BODY. Example: ${parameters.inputs}>"
    }
  ]
}
```


## Example blueprints

You can find blueprints for each connector in the [ML Commons repository](https://github.com/opensearch-project/ml-commons/tree/2.x/docs/remote_inference_blueprints). 

## Configuration options

The following configuration options are **required** in order to build a connector blueprint. These settings can be used for both external and local connectors.

| Field | Data type | Description |
| :---  | :--- | :--- |
| `name` | String | The name of the connector. |
| `description` | String | A description of the connector. |
| `version` | Integer | The version of the connector. |
| `protocol` | String | The protocol for the connection. For AWS services such as Amazon SageMaker and Amazon Bedrock, use `aws_sigv4`. For all other services, use `http`. |
| `parameters` | JSON object | The default connector parameters, including `endpoint` and `model`. Any parameters indicated in this field can be overridden by parameters specified in a predict request. |
| `credential` | `Map<string, string>` | Defines any credential variables required to connect to your chosen endpoint. ML Commons uses **AES/GCM/NoPadding** symmetric encryption to encrypt your credentials. When the connection to the cluster first starts, OpenSearch creates a random 32-byte encryption key that persists in OpenSearch's system index. Therefore, you do not need to manually set the encryption key. |
| `actions` | JSON array | Define what actions can run within the connector. If you're an administrator making a connection, add the [blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/blueprints/) for your desired connection. |
| `backend_roles` | JSON array | A list of OpenSearch backend roles. For more information about setting up backend roles, see [Assigning backend roles to users]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#assigning-backend-roles-to-users). |
| `access_mode` | String | Sets the access mode for the model, either `public`, `restricted`, or `private`. Default is `private`. For more information about `access_mode`, see [Model groups]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#model-groups). |
| `add_all_backend_roles` | Boolean | When set to `true`, adds all `backend_roles` to the access list, which only a user with admin permissions can adjust. When set to `false`, non-admins can add `backend_roles`. |

The `action` parameter supports the following options.

| Field | Data type | Description |
| :---  | :--- | :--- |
| `action_type` | String | Required. Sets the ML Commons API operation to use upon connection. As of OpenSearch 2.9, only `predict` is supported. |
| `method` | String | Required. Defines the HTTP method for the API call. Supports `POST` and `GET`. |
| `url` | String | Required. Sets the connection endpoint at which the action takes place. This must match the regex expression for the connection used when [adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index#adding-trusted-endpoints). |
| `headers` | JSON object | Sets the headers used inside the request or response body. Default is `ContentType: application/json`. If your third-party ML tool requires access control, define the required `credential` parameters in the `headers` parameter. |
| `request_body` | String | Required. Sets the parameters contained inside the request body of the action. The parameters must include `\"inputText\`, which specifies how users of the connector should construct the request payload for the `action_type`. |

## Next step

To see how system administrators and data scientists use blueprints for connectors, see [Creating connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).