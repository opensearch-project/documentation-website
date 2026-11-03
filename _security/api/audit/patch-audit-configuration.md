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

<!-- spec_insert_start
api: security.patch_audit_configuration
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/audit
```
<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the configuration write and reload to complete. When `false`, the API returns a task ID after validation. Default is `true`. |

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

If you set `wait_for_completion` to `false`, a successful submission returns HTTP status `200`, and the response contains a task ID instead of the completed result:

```json
{
  "task": "oTUltX4IQMOUUVeiohTt8A:1234"
}
```

Use the [Get Task API]({{site.url}}{{site.baseurl}}/api-reference/tasks/get-tasks/) to retrieve the task's status and result.

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the request. A successful request returns `OK`. |
| `message` | String | A message describing the result of the operation. |
| `task` | String | The ID of the task that performs the update. Returned instead of `status` and `message` when `wait_for_completion` is `false`. |
