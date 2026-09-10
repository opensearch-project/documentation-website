---
layout: default
title: Patch audit configuration
parent: Audit log APIs
grand_parent: Security APIs
nav_order: 20
---

# Patch Audit Configuration API
**Introduced 1.0**
{: .label .label-purple }

Updates specified fields in the audit configuration. This method requires an operation, a path, and a value to complete a valid request. For details on using the `PATCH` method, see the [Patching resources](https://en.wikipedia.org/wiki/PATCH_%28HTTP%29#Patching_resources) description at Wikipedia.

Using the `PATCH` method also requires a user to have a security configuration that includes admin certificates for encryption. To find out more about these certificates, see [Configuring admin certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).

OpenSearch Dashboards Dev Tools do not currently support the `PATCH` method. You can use [cURL](https://curl.se/), [Postman](https://www.postman.com/), or another alternative process to update the configuration using this method. To follow the GitHub issue for support of the `PATCH` method in Dashboards, see [issue #2343](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2343).
{: .note}

<!-- spec_insert_start
api: security.patch_audit_configuration
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/audit
```
<!-- spec_insert_end -->

## Example request

```json
PATCH _plugins/_security/api/audit
[
  {
    "op": "replace",
    "path": "/config/audit/enable_rest",
    "value": true
  }
]
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "status": "OK",
  "message": "No updates required"
}
```

```bash
HTTP/1.1 200 OK
content-type: application/json; charset=UTF-8
content-length: 45
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns `OK`. |
| `message` | String | A message describing the result of the operation. |
