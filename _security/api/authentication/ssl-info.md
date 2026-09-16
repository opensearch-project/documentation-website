---
layout: default
title: SSL info
parent: Authentication APIs
grand_parent: Security APIs
nav_order: 50
---

# SSL Info API
**Introduced 1.0**
{: .label .label-purple }

Retrieves information about the SSL configuration.

<!-- spec_insert_start
api: security.get_sslinfo
component: endpoints
-->
## Endpoints
```json
GET /_opendistro/_security/sslinfo
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_sslinfo
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `show_dn` | Boolean or String | Whether to include all domain names in the response. |

<!-- spec_insert_end -->

## Example request

```json
GET _opendistro/_security/sslinfo
```
{% include copy-curl.html security=true %}

## Example response

```json
{
  "principal": null,
  "peer_certificates": "0",
  "ssl_protocol": "TLSv1.3",
  "ssl_cipher": "TLS_AES_128_GCM_SHA256",
  "ssl_provider_http": "JDK",
  "ssl_provider_transport_server": "JDK",
  "ssl_provider_transport_client": "JDK"
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `principal` | String | The distinguished name of the client certificate that authenticated the request, or `null` when the request authenticated another way. |
| `peer_certificates` | String | The number of certificates that the client presented, returned as a string. A request that presents no client certificate returns `0`. |
| `ssl_protocol` | String | The TLS protocol version negotiated for the request. |
| `ssl_cipher` | String | The cipher suite negotiated for the request. |
| `ssl_provider_http` | String | The TLS provider in use on the HTTP layer. |
| `ssl_provider_transport_server` | String | The TLS provider in use for incoming transport layer connections. |
| `ssl_provider_transport_client` | String | The TLS provider in use for outgoing transport layer connections. |
| `peer_certificates_list` | Array of Strings | The distinguished names of the certificates that the client presented, or `null` when the client presented none. Returned only when `show_dn` is `true`. |
| `local_certificates_list` | Array of Strings | The distinguished names of the certificates that the node presented. Returned only when `show_dn` is `true`. |
