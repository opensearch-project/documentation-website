---
layout: default
title: Reload Transport Certificates API
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 40
---

# Reload Transport Certificates API
**Introduced 2.8**
{: .label .label-purple }

Reload transport layer communication certificates. These REST APIs let a super admin (or a user with sufficient permissions to access this API) reload transport layer certificates.


### Example request

```bash
curl -X PUT "https://your-opensearch-cluster/_plugins/_security/api/ssl/transport/reloadcerts"
```
{% include copy-curl.html %}

### Example response

```json
{
  "status": "OK",
  "message": "updated transport certs"
}
```

<!-- spec_insert_start
api: security.reload_transport_certificates
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/ssl/transport/reloadcerts
```
<!-- spec_insert_end -->

## Response body fields

| Field   | Data type | Description                                                                       |
|:--------|:----------|:----------------------------------------------------------------------------------|
| status  | String    | Indicates the status of the operation. Possible values: "OK" or an error message. |
| message | String    | Additional information about the operation.                                       |


## Reload HTTP certificates

Reload HTTP layer communication certificates. These REST APIs let a super admin (or a user with sufficient permissions to access this API) reload HTTP layer certificates.

## Endpoints

```json
PUT /_plugins/_security/api/ssl/http/reloadcerts
```
{% include copy-curl.html %}


### Example request

```
curl -X PUT "https://your-opensearch-cluster/_plugins/_security/api/ssl/http/reloadcerts"
```
{% include copy-curl.html %}

### Example response

```json
{
  "status": "OK",
  "message": "updated http certs"
}
```

## Response body fields

| Field   | Data type | Description                                                         |
|:--------|:----------|:--------------------------------------------------------------------|
| status  | String    | The status of the API operation. Possible value: "OK".              |
| message | String    | A message indicating that the HTTP certificates have been updated.  |

---
