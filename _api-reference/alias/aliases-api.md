---
layout: default
title: Manage aliases
parent: Alias APIs
grand_parent: Index APIs
nav_order: 50
redirect_from:
 - /opensearch/rest-api/alias/
 - /api-reference/index-apis/alias/
---

# Manage Aliases API
**Introduced 1.0**
{: .label .label-purple }

The Manage aliases API performs multiple index alias operations in a single atomic transaction. Use this API when you need to add or remove multiple aliases, switch an alias from one index to another, or delete indexes while managing their aliases simultaneously. This API accepts an array of actions, making it ideal for complex alias operations that must happen atomically.

This API is distinct from the [Create or update alias API]({{site.url}}{{site.baseurl}}/api-reference/alias/create-alias/), which operates on a single alias at a time and uses different request parameters. Use the Manage aliases API for bulk operations and atomic transactions involving multiple aliases or indexes.

For conceptual information about index aliases, including use cases and examples, see [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/).


## Endpoints

```json
POST _aliases
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for a response from the cluster. Default is `30s`.

## Request body fields

The following table lists the available request body fields.

Field | Data type | Description | Required
:--- | :--- | :--- | :---
`actions` | Array | Set of actions you want to perform on the index. Valid options are: `add`, `remove`, and `remove_index`. You must have at least one action in the array. | Yes
`add` | N/A | Adds an alias to the specified index. | No
`remove` | N/A | Removes an alias from the specified index. | No
`remove_index` | N/A | Deletes an index. | No
`index` | String | Name of the index you want to associate with the alias. Supports wildcard expressions. | Yes if you don't supply an `indices` field in the body.
`indices` | Array | Array of index names you want to associate with the alias. | Yes if you don't supply an `index` field in the body.
`alias` | String | The name of the alias. | Yes if you don't supply an `aliases` field in the body.
`aliases` | Array | Array of alias names. | Yes if you don't supply an `alias` field in the body.
`filter` | Object | A filter to use with the alias, so the alias points to a filtered part of the index. | No
`is_hidden` | Boolean | Specifies whether the alias should be hidden from results that include wildcard expressions | No
`must_exist` | Boolean | Specifies whether the alias to remove must exist. | No
`is_write_index` | Boolean | Specifies whether the index should be a write index. An alias can only have one write index at a time. If a write request is submitted to a alias that links to multiple indexes, OpenSearch executes the request only on the write index. **Important**: Aliases that don't explicitly set `is_write_index: true` for an index and only reference one index will have that index behave as the write index until another index is referenced. At that point, there will be no write index and writes will be rejected. | No
`routing` | String | Used to assign a custom value to a shard for specific operations. | No
`index_routing` | String | Assigns a custom value to a shard only for index operations. | No
`search_routing` | String | Assigns a custom value to a shard only for search operations. | No

## Example: Add an alias

The following request creates an alias called `logs_current` that points to the `application_logs_2024` index:

<!-- spec_insert_start
component: example_code
rest: POST /_aliases
body: |
{
  "actions": [
    {
      "add": {
        "index": "application_logs_2024",
        "alias": "logs_current"
      }
    }
  ]
}
-->
{% capture step1_rest %}
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "application_logs_2024",
        "alias": "logs_current"
      }
    }
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.update_aliases(
  body =   {
    "actions": [
      {
        "add": {
          "index": "application_logs_2024",
          "alias": "logs_current"
        }
      }
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Remove an alias

The following request removes the `logs_current` alias from the `application_logs_2024` index:

<!-- spec_insert_start
component: example_code
rest: POST /_aliases
body: |
{
  "actions": [
    {
      "remove": {
        "index": "application_logs_2024",
        "alias": "logs_current"
      }
    }
  ]
}
-->
{% capture step1_rest %}
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "application_logs_2024",
        "alias": "logs_current"
      }
    }
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.update_aliases(
  body =   {
    "actions": [
      {
        "remove": {
          "index": "application_logs_2024",
          "alias": "logs_current"
        }
      }
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Rename an alias

You can atomically rename an alias by removing it from one index and adding it to another in the same request. The following example moves the `primary_data` alias from `dataset_v1` to `dataset_v2`:

```json
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "dataset_v1",
        "alias": "primary_data"
      }
    },
    {
      "add": {
        "index": "dataset_v2",
        "alias": "primary_data"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Alias operations are atomic, meaning there's no moment when `primary_data` points to both indexes or to neither index.
{: .important}

## Example: Add an alias to multiple indexes

You can associate a single alias with multiple indexes using separate `add` actions:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "products_electronics",
        "alias": "all_products"
      }
    },
    {
      "add": {
        "index": "products_clothing",
        "alias": "all_products"
      }
    },
    {
      "add": {
        "index": "products_books",
        "alias": "all_products"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Example: Use the indices array

Alternatively, you can specify multiple indexes in a single action using the `indices` array:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "indices": ["products_electronics", "products_clothing", "products_books"],
        "alias": "all_products"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Example: Use wildcard patterns

You can use wildcard patterns to add multiple indexes that match a naming pattern. The following example creates an alias for all indexes that start with `sales_2024`:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "sales_2024_*",
        "alias": "current_year_sales"
      }
    }
  ]
}
```
{% include copy-curl.html %}

This creates a point-in-time alias that includes all indexes matching the pattern at the time of creation. It does not automatically include new indexes created later that match the pattern.
{: .note}

It is an error to write to an alias that points to multiple indexes unless you specify a write index.
{: .important}

## Example: Index swapping

You can atomically replace an index with a new one without downtime. This is useful for reindexing operations:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "customer_data_new",
        "alias": "customer_data"
      }
    },
    {
      "remove_index": {
        "index": "customer_data_old"
      }
    }
  ]
}
```
{% include copy-curl.html %}

This operation adds the new index to the alias and deletes the old index in a single atomic operation.

## Example: Filtered aliases

Filtered aliases enable you to segment data within an index by applying query filters. This allows you to create focused subsets of your data accessible through separate alias names. First, ensure your index has the necessary field mappings:

```json
PUT /user_activity
{
  "mappings": {
    "properties": {
      "user_type": {
        "type": "keyword"
      },
      "timestamp": {
        "type": "date"
      },
      "action": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Then create filtered aliases to segment your data:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "user_activity",
        "alias": "premium_users",
        "filter": {
          "term": {
            "user_type": "premium"
          }
        }
      }
    },
    {
      "add": {
        "index": "user_activity",
        "alias": "recent_activity",
        "filter": {
          "range": {
            "timestamp": {
              "gte": "now-7d"
            }
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

These aliases apply the specified filters automatically to all search, count, and delete by query operations.

## Example: Basic routing

Routing allows you to direct operations to specific shards, improving performance by reducing the number of shards that need to be queried.

The following example creates an alias with a routing value:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "customer_orders",
        "alias": "region_east_orders",
        "routing": "east"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Example: Separate routing for index and search operations

You can specify different routing values for indexing and searching:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "user_sessions",
        "alias": "mobile_sessions",
        "index_routing": "mobile",
        "search_routing": "mobile,tablet"
      }
    }
  ]
}
```
{% include copy-curl.html %}

In this example, all documents indexed through the alias go to the "mobile" shard, but searches can query both "mobile" and "tablet" shards.

When you perform a search with both alias routing and a routing parameter, OpenSearch uses the intersection of both values. For example, if you search `GET /mobile_sessions/_search?routing=tablet,mobile`, only the "mobile" routing value will be used since it's the intersection of the alias routing (`mobile,tablet`) and the search parameter (`tablet,mobile`).
{: .note}

## Example: Setting a write index

When an alias points to multiple indexes, you must specify which index should handle write operations.

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "logs_2024_01",
        "alias": "active_logs",
        "is_write_index": true
      }
    },
    {
      "add": {
        "index": "logs_2024_02",
        "alias": "active_logs",
        "is_write_index": false
      }
    }
  ]
}
```
{% include copy-curl.html %}

Now you can write to the alias, and all write operations will go to `logs_2024_01`:

```json
POST /active_logs/_doc
{
  "timestamp": "2024-01-15T10:30:00",
  "level": "INFO",
  "message": "Application started successfully"
}
```
{% include copy-curl.html %}

## Example: Switch the write index

You can atomically switch which index serves as the write index:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "logs_2024_01",
        "alias": "active_logs",
        "is_write_index": false
      }
    },
    {
      "add": {
        "index": "logs_2024_02",
        "alias": "active_logs",
        "is_write_index": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

> Keep the following important considerations in mind when working with write indexes:
> - An alias can have only one write index at a time
> - If an alias points to multiple indexes without a designated write index, write operations will be rejected
> - For aliases pointing to a single index, that index automatically serves as the write index
{: .important}

## Example: Use the must_exist parameter

OpenSearch provides a `must_exist` parameter for remove operations that controls error handling when removing non-existent aliases:

```json
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "application_logs_2024",
        "alias": "logs_current",
        "must_exist": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

- `must_exist: true` - Throws an error if the alias doesn't exist
- `must_exist: false` - Silently succeeds even if the alias doesn't exist
- `must_exist: null` (default) - Throws an error only if none of the specified aliases exist

## Example response

All successful alias operations return the same response format:

```json
{
    "acknowledged": true
}
```

## Related documentation

For more information about index aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/).