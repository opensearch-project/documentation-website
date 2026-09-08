---
layout: default
title: Dynamic header substitution
has_children: false
nav_order: 40
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# Dynamic header substitution
**Introduced 3.7**
{: .label .label-purple }

By default, connector headers are resolved once at connector creation time. Dynamic connector headers allow you to use `${parameters.*}` placeholders in header values so that per-request values are substituted at prediction time. This is useful for passing request-scoped metadata such as transaction IDs, correlation IDs, or trace tokens to the externally hosted model endpoint.

## Configuring dynamic headers

To configure a dynamic header, define the header with a `${parameters.*}` placeholder in the connector's `actions[].headers` field. You can optionally set a default value for the parameter in the top-level `parameters` field:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "My connector",
  "description": "Connector with dynamic headers",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "endpoint": "api.example.com",
    "request_id": "default-request-id"
  },
  "credential": {
    "api_key": "test-api-key"
  },
  "actions": [{
    "action_type": "predict",
    "method": "POST",
    "url": "https://${parameters.endpoint}/predict",
    "headers": {
      "Authorization": "${credential.api_key}",
      "X-Test-Request-Id": "${parameters.request_id}"
    },
    "request_body": "{ \"input\": \"${parameters.input}\" }"
  }]
}
```
{% include copy-curl.html %}

At prediction time, pass the runtime value in the `parameters` field of the `_predict` request:

```json
POST /_plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "request_id": "request-123",
    "input": "hello world"
  }
}
```
{% include copy-curl.html %}

The resulting HTTP request to the remote endpoint includes the substituted header:

```json
POST https://api.example.com/predict
Authorization: test-api-key
X-Test-Request-Id: request-123
```

If no runtime value is provided and no default is set in the connector's `parameters` field, the prediction request is rejected with a 400 error. To avoid this, define a default value for the parameter in the connector's `parameters` field. If no runtime value is provided, the default value is used.

## Security restrictions

The following headers cannot contain `${parameters.*}` placeholders. Using them returns a 400 error at connector creation or update time. Use `${credential.*}` for authentication headers instead:

- Credential headers:
  - `Authorization`
  - `Proxy-Authorization`
  - `Cookie`
  - `X-API-Key`
  - `X-Auth-Token`
  - `X-Auth-Header`

- IP and host spoofing headers:
  - `Host`
  - `X-Forwarded-Host`
  - `X-Forwarded-Server`
  - `X-Forwarded-For`
  - `Forwarded`
  - `X-Real-IP`
  - `X-Client-IP`
  - `CF-Connecting-IP`
  - `True-Client-IP`
  - `X-Originating-IP`

## Runtime validation

At prediction time, substituted header values are validated before the request is sent:

- Header values containing `\r` or `\n` characters are rejected to prevent HTTP response splitting.
- Values containing control characters (`0x00–0x1F`, except tab) are rejected.
- Each individual header value must not exceed 8 KB.
- The combined size of all headers must not exceed 64 KB.

## Next steps

- For descriptions of all connector parameters, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).
- For information about supplying authentication credentials to a connector, see [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/).
