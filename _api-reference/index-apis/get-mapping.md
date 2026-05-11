---
layout: default
title: Get index mappings
parent: Index settings and mappings
grand_parent: Index APIs
nav_order: 20
---

# Get Index Mappings API
**Introduced 1.0**
{: .label .label-purple }

The Get Mappings API returns the mapping definitions for one or more indexes. Use this API to inspect how fields are configured in an index, verify that mapping updates were applied, or review the full schema before reindexing.

<!-- spec_insert_start
api: indices.get_mapping
component: endpoints
-->
## Endpoints
```json
GET /_mapping
GET /{index}/_mapping
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | A comma-separated list of index names to retrieve mappings for. Supports wildcard expressions. To retrieve mappings for all indexes, omit this parameter or use `_all` or `*`. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `allow_no_indices` | Boolean | Specifies whether to ignore wildcards that do not match any indexes. If `false`, the request returns an error when wildcards do not match any indexes. | `true` |
| `cluster_manager_timeout` | String | The amount of time to wait for a connection to the cluster manager node. | `30s` |
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Match all indexes, including hidden indexes. <br> - `open`: Match open indexes. <br> - `closed`: Match closed indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. | `open` |
| `ignore_unavailable` | Boolean | Specifies whether to ignore indexes that are missing or closed. If `true`, missing or closed indexes are not included in the response. | `false` |
| `local` | Boolean | Specifies whether to retrieve information from the local node only instead of from the cluster manager node. | `false` |

## Example: Retrieving mappings for a single index

The following example retrieves the mapping for the `products` index:

<!-- spec_insert_start
component: example_code
rest: GET /products/_mapping
-->
{% capture step1_rest %}
GET /products/_mapping
{% endcapture %}

{% capture step1_python %}


response = client.indices.get_mapping(
  index = "products"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Retrieving mappings for multiple indexes

You can retrieve mappings for multiple indexes in a single request by specifying a comma-separated list:

<!-- spec_insert_start
component: example_code
rest: GET /products,products-us/_mapping
-->
{% capture step1_rest %}
GET /products,products-us/_mapping
{% endcapture %}

{% capture step1_python %}


response = client.indices.get_mapping(
  index = "products,products-us"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Retrieving all mappings

To retrieve mappings for all indexes in the cluster, omit the index name:

<!-- spec_insert_start
component: example_code
rest: GET /_mapping
-->
{% capture step1_rest %}
GET /_mapping
{% endcapture %}

{% capture step1_python %}

response = client.indices.get_mapping()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "products" : {
    "mappings" : {
      "properties" : {
        "description" : {
          "type" : "text"
        },
        "item_id" : {
          "type" : "alias",
          "path" : "product_id"
        },
        "manufacturer" : {
          "properties" : {
            "country" : {
              "type" : "keyword"
            },
            "name" : {
              "type" : "text"
            }
          }
        },
        "price" : {
          "type" : "float"
        },
        "product_id" : {
          "type" : "keyword"
        },
        "product_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "sku" : {
          "type" : "keyword",
          "ignore_above" : 50
        },
        "weight" : {
          "type" : "integer"
        }
      }
    }
  }
}
```
</details>

## Response body fields

The response contains a JSON object where each key is an index name. The following table describes the fields within each index entry.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `mappings` | Object | The mapping definition for the index. |
| `mappings.properties` | Object | A map of field names to their mapping configurations, including type, parameters, and nested subfields. |
