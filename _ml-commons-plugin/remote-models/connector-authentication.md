---
layout: default
title: Connector authentication
has_children: false
nav_order: 30
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# Connector authentication

A connector authenticates to an externally hosted model using the values in its `credential` object. The authentication method is specified in the connector's `protocol` field and is determined by the platform you are connecting to. Each protocol has its own credential fields and cluster prerequisites.

The following table lists the available protocols.

| Protocol | Platforms | Documentation |
|:---|:---|:---|
| `http` | Platforms without a dedicated protocol, including OpenAI, Cohere, Azure OpenAI, DeepSeek, Ollama, Aleph Alpha, and Yandex Cloud | [HTTP authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/http-authentication/) |
| `aws_sigv4` | AWS services, such as Amazon SageMaker, Amazon Bedrock, Amazon Comprehend, and Amazon Textract | [AWS Signature Version 4 authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/aws-sigv4/) |
| `google_cloud` | Google Cloud Vertex AI | [Google Cloud authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/google-cloud/) |

The `aws_sigv4` and `google_cloud` protocols generate and refresh short-lived access tokens for you, so you don't supply or rotate a token by hand. The `http` protocol passes the credentials you provide, most often a token such as an API key. To find the protocol for your platform and model, see [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/).

Endpoints that require mutual TLS (mTLS) accept a client certificate instead of a token. This applies only to connectors that use the `http` protocol. For more information, see [Client certificate authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/http-authentication/#client-certificate-authentication).

## Next steps

- For descriptions of all connector fields, including the `client_config` object, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).
- To change the credentials on an existing connector, see [Updating connector credentials]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#updating-connector-credentials).
