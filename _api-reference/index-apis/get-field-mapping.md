---
layout: default
title: Get field mapping
parent: Index settings and mappings
grand_parent: Index APIs
nav_order: 25
---

# Get Field Mapping API
**Introduced 1.0**
{: .label .label-purple }

The Get Field Mapping API retrieves mapping definitions for one or more specific fields. This is useful when you need to inspect how particular fields are configured without retrieving the full index mapping, especially for indexes with many fields.

## Endpoints

```json
GET /_mapping/field/{field}
GET /{index}/_mapping/field/{field}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | Optional | String | A comma-separated list of index names or wildcard expressions. Use `_all` or omit to target all indexes. |
| `field` | Required | String | A comma-separated list of field names or wildcard expressions. Use dot notation for nested fields (for example, `author.name`). |

## Query parameters

The following table lists the available query parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `include_defaults` | Optional | Boolean | When `true`, the response includes default mapping parameter values that are normally omitted. Default is `false`. |
| `allow_no_indices` | Optional | Boolean | When `true`, the request does not return an error if a wildcard expression or `_all` resolves to no indexes. Default is `true`. |
| `expand_wildcards` | Optional | String | Controls which index types wildcard expressions expand to. Valid values are `open`, `closed`, `hidden`, `none`, `all`. Default is `open`. |
| `ignore_unavailable` | Optional | Boolean | When `true`, missing or closed indexes are ignored rather than returning an error. Default is `false`. |

## Example request

The following request retrieves the mapping for the `customer_gender` field:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_mapping/field/customer_gender
```
{% include copy-curl.html %}

## Example response

The response contains the field's full name and its mapping configuration:

```json
{
  "opensearch_dashboards_sample_data_ecommerce" : {
    "mappings" : {
      "customer_gender" : {
        "full_name" : "customer_gender",
        "mapping" : {
          "customer_gender" : {
            "type" : "keyword"
          }
        }
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `{index}.mappings` | Object | A map of field names to their mapping details for the specified index. |
| `{field}.full_name` | String | The fully qualified field name, including any parent object path. |
| `{field}.mapping` | Object | The mapping configuration for the field, including its type and any parameters. |
