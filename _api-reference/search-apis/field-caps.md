---
layout: default
title: Field capabilities
parent: Search APIs
nav_order: 45
---

# Field capabilities API

The `_field_caps` API provides information about the capabilities of fields across one or more indexes. It is typically used by clients to determine how fields are mapped and whether they can be used for search, sorting, and aggregations across multiple indexes.

This API is particularly useful when indexes have varying mappings and a query needs to evaluate field compatibility across them.

## Endpoints

```json
GET  /_field_caps
POST /_field_caps
GET  /{index}/_field_caps
POST /{index}/_field_caps
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | List or String | A comma-separated list of data streams, indexes, and aliases used to limit the request. Supports wildcards (*). To target all data streams and indexes, omit this parameter or use * or `_all`. _Optional_. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `allow_no_indices` | Boolean | If `false`, the request returns an error if any wildcard expression, index alias, or `_all` value targets only missing or closed indexes. This behavior applies even if the request targets other open indexes. For example, a request targeting `foo*,bar*` returns an error if an index starts with foo but no index starts with bar. Default is `true`. |
| `expand_wildcards` | List or String | The type of index that wildcard patterns can match. If the request can target data streams, this argument determines whether wildcard expressions match hidden data streams. Supports comma-separated values, such as `open,hidden`. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with open, closed, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. <br> Default is `open`. |
| `fields` | List or String | A comma-separated list of fields to retrieve capabilities for. Wildcard (`*`) expressions are supported. |
| `ignore_unavailable` | Boolean | If `true`, missing or closed indexes are not included in the response. Default is `false`. |
| `include_unmapped` | Boolean | If `true`, unmapped fields are included in the response. Default is `false`. |

## Request body fields

The following table lists the available request body fields.

| Field          | Data type | Description                                                             |
| :------------- | :-------- | :---------------------------------------------------------------------- |
| `index_filter` | Object    | A query DSL object used to filter indexes included in the request. See [example using index filter](#example-using-an-index-filter). _Optional_.|

## Example

Create two indexes with different mappings for the same field:

```json
PUT /store-west
{
  "mappings": {
    "properties": {
      "product": { "type": "text" },
      "price": { "type": "float" }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /store-east
{
  "mappings": {
    "properties": {
      "product": { "type": "keyword" },
      "price": { "type": "float" }
    }
  }
}
```
{% include copy-curl.html %}

Query field capabilities across both indexes:

```json
GET /store-west,store-east/_field_caps?fields=product,price
```
{% include copy-curl.html %}

### Example response

The response provides capabilities of the available fields:

```json
{
  "indices": [
    "store-east",
    "store-west"
  ],
  "fields": {
    "product": {
      "text": {
        "type": "text",
        "searchable": true,
        "aggregatable": false,
        "indices": [
          "store-west"
        ]
      },
      "keyword": {
        "type": "keyword",
        "searchable": true,
        "aggregatable": true,
        "indices": [
          "store-east"
        ]
      }
    },
    "price": {
      "float": {
        "type": "float",
        "searchable": true,
        "aggregatable": true
      }
    }
  }
}
```

## Example: Using an index filter

You can restrict the indexes considered using an `index_filter`. The `index_filter` filters out indexes based on field-level metadata, not actual document content. The following request limits the index selection to those that contain mappings containing a `product` field, even if there are no documents indexed:

```json
POST /_field_caps?fields=product,price
{
  "index_filter": {
    "term": {
      "product": "notebook"
    }
  }
}
```
{% include copy-curl.html %}

### Example response

The response only includes the field from indexes that contain a `product` field with a value of `notebook`:

```json
{
  "indices": [
    "store-east",
    "store-west"
  ],
  "fields": {
    "product": {
      "text": {
        "type": "text",
        "searchable": true,
        "aggregatable": false,
        "indices": [
          "store-west"
        ]
      },
      "keyword": {
        "type": "keyword",
        "searchable": true,
        "aggregatable": true,
        "indices": [
          "store-east"
        ]
      }
    },
    "price": {
      "float": {
        "type": "float",
        "searchable": true,
        "aggregatable": true
      }
    }
  }
}
```

### Response body fields

The following table lists all response body fields.

| Field                                            | Data type    | Description                                                                                                              |
| :----------------------------------------------- | :----------- | :----------------------------------------------------------------------------------------------------------------------- |
| `indices`                                        | List         | The list of indexes included in the response.                                                                            |
| `fields`                                         | Object       | A map  of types to field capabilities, where each key is a field name and its value is an object.                  |
| `fields.<field>.<type>.type`                     | String       | The data type of the field (for example, `float`, `text`, `keyword`).                                                           |
| `fields.<field>.<type>.searchable`               | Boolean      | Whether the field is indexed and searchable.                                                                             |
| `fields.<field>.<type>.aggregatable`             | Boolean      | Whether the field can be used in aggregations like `sum` or `terms`.                                                  |
| `fields.<field>.<type>.indices`                  | List         | A list of indexes where this field appears with the corresponding type.                                                  |
| `fields.<field>.<type>.non_searchable_indices`   | List or null | A list of indexes where the field is *not* searchable. `null` means that the field is not searchable in any index.                                   |
| `fields.<field>.<type>.non_aggregatable_indices` | List or null | A list of indexes where the field is *not* aggregatable. `null` means that the field is not aggregatable in any index.                               |
| `fields.<field>.<type>.meta`                     | Object       | Merged metadata values from all mappings. Keys are custom metadata keys, and values are arrays of values across indexes. |
