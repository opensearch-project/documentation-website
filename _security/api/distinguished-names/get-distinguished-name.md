---
layout: default
title: Get Distinguished Name API
parent: Distinguished Name APIs
grand_parent: Security APIs
nav_order: 20
---

# Get Distinguished Name API
**Introduced 1.0**
{: .label .label-purple }

Retrieves all node distinguished names. Requires super admin or REST API permissions.

<!-- spec_insert_start
api: security.get_distinguished_name
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/nodesdn/{cluster_name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_distinguished_name
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `cluster_name` | **Required** | String | The name of the cluster to retrieve that cluster's nodes DN settings. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: security.get_distinguished_name
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `show_all` | Boolean | Whether to include or exclude any static node's DN settings from the final result. |

<!-- spec_insert_end -->

## Example request

<!-- spec_insert_start
api: security.get_distinguished_name
component: example_code
rest: GET /_plugins/_security/api/nodesdn/{cluster_name}
-->
{% capture step1_rest %}
GET /_plugins/_security/api/nodesdn/{cluster_name}
{% endcapture %}

{% capture step1_python %}


response = client.security.get_distinguished_name(
  cluster_name = "{cluster_name}"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
