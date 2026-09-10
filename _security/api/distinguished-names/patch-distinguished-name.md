---
layout: default
title: Patch Distinguished Name API
parent: Distinguished Name APIs
grand_parent: Security APIs
nav_order: 40
---

# Patch Distinguished Name API
**Introduced 1.0**
{: .label .label-purple }

Updates the distinguished cluster name for the specified cluster. Requires super admin or REST API permissions.

<!-- spec_insert_start
api: security.patch_distinguished_name
component: endpoints
-->
## Endpoints
```json
PATCH /_plugins/_security/api/nodesdn/{cluster_name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.patch_distinguished_name
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `cluster_name` | **Required** | String | The cluster name to update the `nodesDn` value. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.patch_distinguished_name
component: example_code
rest: PATCH /_plugins/_security/api/nodesdn/{cluster_name}
-->
{% capture step1_rest %}
PATCH /_plugins/_security/api/nodesdn/{cluster_name}
{% endcapture %}

{% capture step1_python %}


response = client.security.patch_distinguished_name(
  cluster_name = "{cluster_name}",
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.patch_distinguished_name
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `message` | String | The message returned as part of an `OK` response. |
| `status` | Float or String |  |

<!-- spec_insert_end -->
