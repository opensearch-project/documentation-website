---
layout: default
title: Reload transport certificates
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 40
---

# Reload Transport Certificates API
**Introduced 2.8**
{: .label .label-purple }

Reloads the transport layer communication certificates without restarting the node.

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.reload_transport_certificates
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/ssl/transport/reloadcerts
```
<!-- spec_insert_end -->

## Example request

```json
PUT _plugins/_security/api/ssl/transport/reloadcerts
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "message": "updated transport certs"
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | A message confirming that the transport certificates were updated. |
