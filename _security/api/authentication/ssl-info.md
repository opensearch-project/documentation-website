---
layout: default
title: SSL Info API
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

<!-- spec_insert_start
api: security.get_sslinfo
component: example_code
rest: GET /_opendistro/_security/sslinfo
-->
{% capture step1_rest %}
GET /_opendistro/_security/sslinfo
{% endcapture %}

{% capture step1_python %}

response = client.security.get_sslinfo()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_sslinfo
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `peer_certificates` | **Required** | Float or String | The number of certificates. |
| `principal` | **Required** | NULL or String | The user's principal. |
| `ssl_cipher` | **Required** | NULL or String | The cipher for this SSL setup. |
| `ssl_protocol` | **Required** | NULL or String | The protocol for this SSL setup. |
| `ssl_provider_http` | **Required** | NULL or String | Returns the HTTP provider's name. |
| `ssl_provider_transport_client` | **Required** | String | Returns the transport client's name. |
| `ssl_provider_transport_server` | **Required** | String | Returns the transport server's name. |
| `local_certificates_list` | _Optional_ | Array of Strings | A list of domain names from local certificates. |
| `peer_certificates_list` | _Optional_ | Array of Strings | A list of domain names from peer certificates. |
| `ssl_openssl_available` | _Optional_ | Boolean | Whether OpenSSL is available. |
| `ssl_openssl_non_available_cause` | _Optional_ | NULL or String | The reason OpenSSL is unavailable. |
| `ssl_openssl_supports_hostname_validation` | _Optional_ | Boolean | Whether the hostname validation is supported. |
| `ssl_openssl_supports_key_manager_factory` | _Optional_ | Boolean | Whether `KMF` is supported. |
| `ssl_openssl_version` | _Optional_ | Float or String | Version of OpenSSL. |
| `ssl_openssl_version_string` | _Optional_ | NULL or String | The full version string for the OpenSSL version. |

<!-- spec_insert_end -->
