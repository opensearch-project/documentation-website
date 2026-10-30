---
layout: default
title: Get all certificates
parent: Certificate APIs
grand_parent: Security APIs
nav_order: 20
---

# Get All Certificates API
**Introduced 2.15**
{: .label .label-purple }

Retrieves the certificates in use on every node in the cluster, grouped by node. To retrieve the certificates in use on one node, use the [Get Node Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-node-certificates/).

This API is reserved for a superadmin. Authenticate with an admin certificate rather than with a user name and password. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).
{: .note}

<!-- spec_insert_start
api: security.get_all_certificates
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/certificates
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_all_certificates
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cert_type` | String | The type of certificates (`HTTP`, `TRANSPORT`, or `ALL`) to retrieve from all nodes. |
| `timeout` | String | The maximum duration, in seconds, to spend retrieving certificates from all nodes before a timeout. |

<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/certificates
```
{% include copy-curl.html security=true %}

## Example response

The response is abbreviated here:

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "opensearch-cluster",
  "nodes": {
    "DOlaf_0NSe-HkUXbca8-xA": {
      "name": "opensearch-node1",
      "certificates": {
        "http": [
          {
            "format": "pem",
            "alias": null,
            "subject_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
            "san": "",
            "serial_number": "76447790750572770562330390669309351583040514274",
            "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
            "has_private_key": false,
            "not_after": "2034-02-17T17:00:36Z",
            "not_before": "2034-02-17T17:00:36Z"
          },
          {
            "format": "pem",
            "alias": null,
            "subject_dn": "CN=node-0.example.com,OU=node,O=node,L=test,C=de",
            "san": "[[2, localhost], [2, node-0.example.com], [7, 0:0:0:0:0:0:0:1], [7, 127.0.0.1], [8, 1.2.3.4.5.5]]",
            "serial_number": "602402108696974692907516685054550755684962846902",
            "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
            "has_private_key": true,
            "not_after": "2034-02-17T17:03:25Z",
            "not_before": "2034-02-17T17:03:25Z"
          }
        ],
        "transport": [ ... ],
        "transport_client": [ ... ]
      }
    }
  }
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_nodes` | Object | The number of nodes that the request reached, along with the number that succeeded and failed. |
| `cluster_name` | String | The name of the cluster. |
| `nodes` | Object | The certificates on each node, keyed by node ID. |
| `nodes.<node_id>.name` | String | The name of the node. |
| `nodes.<node_id>.certificates` | Object | The node's certificates, grouped into `http`, `transport`, and `transport_client` lists. |

Each certificate contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `format` | String | The format of the certificate, such as `pem`. |
| `alias` | String | The alias of the certificate in the keystore, or `null` when the certificate has no alias. |
| `subject_dn` | String | The distinguished name of the certificate's subject. |
| `issuer_dn` | String | The distinguished name of the certificate authority that issued the certificate. |
| `san` | String | The subject alternative names in the certificate. |
| `serial_number` | String | The serial number of the certificate. |
| `has_private_key` | Boolean | Whether the node holds the private key for the certificate. |
| `not_before` | String | The date and time when the certificate becomes valid. |
| `not_after` | String | The date and time when the certificate expires. |
