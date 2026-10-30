---
layout: default
title: Dynamic header substitution
has_children: false
nav_order: 70
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# Dynamic header substitution
**Introduced 3.7**
{: .label .label-purple }

By default, connector headers are resolved once at connector creation time. Dynamic connector headers allow you to use `${parameters.*}` placeholders in header values so that per-request values are substituted at prediction time. This is useful for passing request-scoped metadata such as transaction IDs, correlation IDs, or trace tokens to the externally hosted model endpoint.

## Configuring dynamic headers

To configure a dynamic header, define the header with a `${parameters.*}` placeholder in the connector's `actions[].headers` field. You can optionally set a default value for the parameter in the top-level `parameters` field.

The following example uses the placeholder endpoint `api.example.com`. Connector URLs must match a pattern in `plugins.ml_commons.trusted_connector_endpoints_regex`, so replace the endpoint with your model's endpoint or add it to the trusted endpoints. For more information, see [Adding trusted endpoints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#adding-trusted-endpoints).

To create a connector containing a dynamic header, send the following request:

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

Before substitution, OpenSearch JSON-escapes the parameter values in the `_predict` request. A newline in a runtime value reaches the header as the two characters `\n`, and other control characters reach it as escape sequences such as `\u0001`. The following values are substituted without escaping:

- Values of parameters listed in the `no_escape_params` parameter of the `_predict` request
- Values that are valid JSON objects or arrays
- Default values from the connector's `parameters` field

At prediction time, substituted header values are validated before the request is sent to the model endpoint. A prediction request whose headers fail any of the following checks returns a 400 error:

- Header values that contain a carriage return (`\r`), a line feed (`\n`), or another control character (`0x00–0x1F`, except tab, and `0x7F`) are rejected to prevent HTTP response splitting. Because runtime values are escaped, this applies only to values substituted without escaping.
- Each header, including its name and value, must not exceed 8 KB (8,192 characters).
- The combined size of all header names and values must not exceed 64 KB (65,536 characters).

The size limits apply to the escaped values, so escape sequences count toward them. For example, a `"` character in a runtime value counts as two characters (`\"`).

## Next steps

- For descriptions of all connector fields, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).
- For information about supplying authentication credentials to a connector, see the authentication method for your platform's protocol in [Connector authentication]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connector-authentication/).
