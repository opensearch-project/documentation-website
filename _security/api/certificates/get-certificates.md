---
layout: default
title: Get Certificates API
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Certificates API
**Introduced 2.0**
{: .label .label-purple }

Retrieves the cluster's security certificates.

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
{% include copy-curl.html %}

## Example response

```json
{
  "http_certificates_list": [
    {
      "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
      "subject_dn": "CN=node-0.example.com,OU=node,O=node,L=test,DC=de",
      "san": "[[8, 1.2.3.4.5.5], [2, node-0.example.com]",
      "not_before": "2018-04-22T03:43:47Z",
      "not_after": "2028-04-19T03:43:47Z"
    }
  ],
  "transport_certificates_list": [
    {
      "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
      "subject_dn": "CN=node-0.example.com,OU=node,O=node,L=test,DC=de",
      "san": "[[8, 1.2.3.4.5.5], [2, node-0.example.com]",
      "not_before": "2018-04-22T03:43:47Z",
      "not_after": "2028-04-19T03:43:47Z"
    }
  ]
}
```
