---
layout: default
title: Get certificates
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Certificates API
**Introduced 2.0**
{: .label .label-purple }

Retrieves the HTTP and transport certificates in use on the node that receives the request. To retrieve the certificates in use on every node in the cluster, use the [Get All Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-all-certificates/).

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.get_certificates
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/ssl/certs
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/ssl/certs
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "http_certificates_list": [
    {
      "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
      "subject_dn": "CN=node-0.example.com,OU=node,O=node,L=test,C=de",
      "san": "[[2, localhost], [2, node-0.example.com], [7, 0:0:0:0:0:0:0:1], [7, 127.0.0.1], [8, 1.2.3.4.5.5]]",
      "not_before": "2024-02-20T17:03:25Z",
      "not_after": "2034-02-17T17:03:25Z"
    }
  ],
  "transport_certificates_list": [
    {
      "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
      "subject_dn": "CN=node-0.example.com,OU=node,O=node,L=test,C=de",
      "san": "[[2, localhost], [2, node-0.example.com], [7, 0:0:0:0:0:0:0:1], [7, 127.0.0.1], [8, 1.2.3.4.5.5]]",
      "not_before": "2024-02-20T17:03:25Z",
      "not_after": "2034-02-17T17:03:25Z"
    }
  ]
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `http_certificates_list` | Array of objects | The certificates that secure the REST layer. |
| `transport_certificates_list` | Array of objects | The certificates that secure the transport layer. |

Each certificate contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `issuer_dn` | String | The distinguished name of the certificate authority that issued the certificate. |
| `subject_dn` | String | The distinguished name of the certificate's subject. |
| `san` | String | The subject alternative names in the certificate. |
| `not_before` | String | The date and time when the certificate becomes valid. |
| `not_after` | String | The date and time when the certificate expires. |
