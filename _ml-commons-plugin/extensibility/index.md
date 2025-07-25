---
layout: default
title: ML extensibility 
has_children: true
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/remote-models/index/
---

# ML extensibility

Machine learning (ML) extensibility enables ML developers to create integrations with other ML services, such as Amazon SageMaker or OpenAI. These integrations provide system administrators and data scientists the ability to run ML workloads outside of their OpenSearch cluster. 

To get started with ML extensibility, choose from the following options:

- If you're an ML developer wanting to integrate with your specific ML services, see [Building blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/blueprints/).
- If you're a system administrator or data scientist wanting to create a connection to an ML service, see [Creating connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).

## Prerequisites

If you're an admin deploying an ML connector, make sure that the target model of the connector has already been deployed on your chosen platform. Furthermore, make sure that you have permissions to send and receive data to the third-party API for your connector. 

When access control is enabled on your third-party platform, you can enter your security settings using the `authorization` or `credential` settings inside the connector API.

### Adding trusted endpoints

To configure connectors in OpenSearch, add the trusted endpoints to your cluster settings using the `plugins.ml_commons.trusted_connector_endpoints_regex` setting, which supports Java regex expressions, as shown in the following example:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.trusted_connector_endpoints_regex": [
          "^https://runtime\\.sagemaker\\..*[a-z0-9-]\\.amazonaws\\.com/.*$",
          "^https://api\\.openai\\.com/.*$",
          "^https://api\\.cohere\\.ai/.*$"
        ]
    }
}
```
{% include copy-curl.html %}



### Setting up connector access control

If you plan on using a remote connector, make sure to use an OpenSearch cluster with the Security plugin enabled. Using the Security plugin gives you access to connector access control, which is required when using a remote connector.
{: .warning}

If you require granular access control for your connectors, use the following cluster setting:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.connector_access_control_enabled": true
    }
}
```
{% include copy-curl.html %}

When access control is enabled, you can install the [Security plugin]({{site.url}}{{site.baseurl}}/security/index/). This makes the `backend_roles`, `add_all_backend_roles`, or `access_model` options required in order to use the connector API. If successful, OpenSearch returns the following response:

```json
{
  "acknowledged": true,
  "persistent": {
    "plugins": {
      "ml_commons": {
        "connector_access_control_enabled": "true"
      }
    }
  },
  "transient": {}
}
```

### Node settings

Remote models based on external connectors consume fewer resources. Therefore, you can deploy any model from a standalone connector using data nodes. To make sure that your standalone connection uses data nodes, set `plugins.ml_commons.only_run_on_ml_node` to `false`, as shown in the following example:

```json
PUT /_cluster/settings
{
    "persistent": {
        "plugins.ml_commons.only_run_on_ml_node": false
    }
}

```
{% include copy-curl.html %}

## Next steps

- For more information about managing ML models in OpenSearch, see [ML Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework/).
- For more information about interacting with ML models in OpenSearch, see [Managing ML models in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-dashboard/)



