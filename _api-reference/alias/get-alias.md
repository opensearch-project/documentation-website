---
layout: default
title: Get index alias
parent: Alias APIs
nav_order: 3
---

# Get index alias API
**Introduced 1.0**
{: .label .label-purple }

Returns information about one or more index aliases.

An alias is a virtual index name that can point to one or more physical indexes. Creating and updating aliases are atomic operations, so you can reindex your data and point an alias at it without any downtime.

## Endpoints

```json
GET /_alias
GET /_alias/<alias>
GET /<index>/_alias/<alias>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<alias>` | String | Comma-separated list or wildcard expression of alias names to retrieve. To retrieve information for all index aliases, use `_all` or `*`. |
| `<index>` | String | Comma-separated list or wildcard expression of index names used to limit the request. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`. |
| `expand_wildcards` | String | Type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `all`. |
| `ignore_unavailable` | Boolean | Whether to ignore unavailable indexes. Default is `false`. |
| `local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`. |

## Example requests

### Get all aliases for an index

You can add index aliases during index creation using a create index API request.

The following create index API request creates the `logs_20302801` index with two aliases:

- `current_day`
- `2030`, which only returns documents in the `logs_20302801` index with a `year` field value of `2030`

```json
PUT /logs_20302801
{
  "aliases" : {
    "current_day" : {},
    "2030" : {
      "filter" : {
          "term" : {"year" : 2030 }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following get index alias API request returns all aliases for the index `logs_20302801`:

```json
GET /logs_20302801/_alias/*
```
{% include copy-curl.html %}

### Get a specific alias

The following index alias API request returns the `2030` alias:

```json
GET /_alias/2030
```
{% include copy-curl.html %}

### Get aliases based on a wildcard

The following index alias API request returns any alias that begins with `20`:

```json
GET /_alias/20*
```
{% include copy-curl.html %}

## Example response

```json
{
 "logs_20302801" : {
   "aliases" : {
    "current_day" : {
    },
     "2030" : {
       "filter" : {
         "term" : {
           "year" : 2030
         }
       }
     }
   }
 }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `<index>` | Object | Contains aliases for the index. |
| `<index>.aliases` | Object | Contains alias information for the index. |
| `<index>.aliases.<alias>` | Object | Contains configuration for the alias. |
| `<index>.aliases.<alias>.filter` | Object | Query used to limit documents the alias can access. |
| `<index>.aliases.<alias>.index_routing` | String | Routing value used for indexing operations. |
| `<index>.aliases.<alias>.search_routing` | String | Routing value used for search operations. |
| `<index>.aliases.<alias>.is_write_index` | Boolean | Whether the index is the write index for the alias. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/aliases/get`.