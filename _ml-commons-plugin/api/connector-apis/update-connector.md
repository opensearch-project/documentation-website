---
layout: default
title: Update connector
parent: Connector APIs
grand_parent: ML Commons APIs
nav_order: 27
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/connector-apis/update-connector/
---

# Update a connector
**Introduced 2.12**
{: .label .label-purple }

Use this API to update a standalone connector based on the `model_ID`. To update a connector created within a specific model, use the [Update Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/update-model/).

Before updating a standalone connector, you must undeploy all models that use the connector. For information about undeploying a model, see [Undeploy Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/undeploy-model/).
{: .note}

Using this API, you can update the connector fields listed in the [Request fields](#request-body-fields) section and add optional fields to your connector. You cannot delete fields from a connector using this API.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
PUT /_plugins/_ml/connectors/<connector_id>
```

## Request body fields

The following table lists the updatable fields. For more information about all connector fields, see [Blueprint configuration parameters]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints#configuration-parameters).

| Field | Data type   | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| :---  |:------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name` | String      | The name of the connector.                                                                                                                                                                                                                                                                                                                                                                    |
| `description` | String      | A description of the connector.                                                                                                                                                                                                                                                                                                                                                               |
| `version` | Integer     | The connector version.                                                                                                                                                                                                                                                                                                                                                                 |
| `protocol` | String      | The protocol for the connection. For AWS services, such as Amazon SageMaker and Amazon Bedrock, use `aws_sigv4`. For all other services, use `http`.                                                                                                                                                                                                                                          |
| `parameters` | JSON object | The default connector parameters, including `endpoint` and `model`. Any parameters included in this field can be overridden by parameters specified in a predict request.                                                                                                                                                                                                                     |
| `credential` | JSON object | Defines any credential variables required in order to connect to your chosen endpoint. ML Commons uses **AES/GCM/NoPadding** symmetric encryption to encrypt your credentials. When the connection to the cluster first starts, OpenSearch creates a random 32-byte encryption key that persists in OpenSearch's system index. Therefore, you do not need to manually set the encryption key. |
| `actions` | JSON array  | Defines which actions can run within the connector. If you're an administrator creating a connection, add the [blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/) for your desired connection.                                                                                                                                                              |
| `backend_roles` | JSON array  | A list of OpenSearch backend roles. For more information about setting up backend roles, see [Assigning backend roles to users]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#assigning-backend-roles-to-users).                                                                                                                                                        |
| `access_mode` | String      | Sets the access mode for the model, either `public`, `restricted`, or `private`. Default is `private`. For more information about `access_mode`, see [Model groups]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control#model-groups).                                                                                                                                        |
| `parameters.skip_validating_missing_parameters`  | Boolean     | When set to `true`, this option allows you to send a request using a connector without validating any missing parameters. Default is `false`.                                                                                                                                                                                                                                                                     |



#### Example request

```json
PUT /_plugins/_ml/connectors/u3DEbI0BfUsSoeNTti-1
{
  "description": "The connector to public OpenAI model service for GPT 3.5"
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index": ".plugins-ml-connector",
  "_id": "u3DEbI0BfUsSoeNTti-1",
  "_version": 2,
  "result": "updated",
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 2,
  "_primary_term": 1
}
```