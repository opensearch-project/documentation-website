---
layout: default
title: Rollover Index
parent: Index APIs
nav_order: 63
---

# Rollover Index
Introduced 1.0
{: .label .label-purple }

The Rollover Index API creates a new index for a data stream or index alias is subject to the `wait_for_active_shards` setting.

## Path and HTTP methods

```json
POST /<rollover-target>/_rollover/
POST /<rollover-target>/_rollover/<target-index>
```

## Types of rollovers

You can rollover a data stream, an index alias with one index, or an index alias with a write index.

### A data stream

When you perform a rollover operation on a data stream, the API generates a fresh write index for that stream. Simultaneously, the stream's preceding write index transitions into a regular backing index. Additionally, the rollover process increments the generation count of the data stream. Data Stream rollovers do not support specifying index settings in the request body.

### An index alias with one index

When you initiate a rollover on an index alias that is associated with a single index, the API will generate a brand-new index for that alias. Then, it will disassociate the original index from the alias.

### An index alias with a write index

In cases where an index alias references multiple indexes, one of those indexes must be designated as the **write** index. When performing a rollover on such an alias, the API will create a fresh index to serve as the new write index, with its `is_write_index` property set to `true`. Simultaneously, the API will update the previous write index by setting its `is_write_index` property to `false`.

## Incrementing index names for an alias

During the rollover process of an index alias, you have the option to provide a custom name for the new index being created. However, if you choose not to specify a name and the current index's name ends with a hyphen followed by a number, for example, `my-index-000001` or `my-index-3`, the rollover operation will automatically increment that number for the new index's name. For instance, if you roll over an alias with a current index named `my-index-000001`, the rollover will generate a new index named `my-index-000002`. It's important to note that this numeric portion is always padded with leading zeros to ensure a consistent length of six characters, regardless of the previous index's name format.

## Using date math with index rollovers

When utilizing an index alias for time-series data, you can leverage [date math](https://opensearch.org/docs/latest/field-types/supported-field-types/date/) in the index name to keep track of the rollover date. For instance, you could create an alias that points to an index named `my-index-{now/d}-000001`. If you create this index on June 11, 2029, the resulting index name would be my-index-2029.06.11-000001. Subsequently, if you perform a rollover on this alias on June 12, 2029, the new index created would be named my-index-2029.06.12-000002. For a practical example demonstrating this concept, see [Roll over an index alias with a write index](#rolling-over-an-index-alias-with-a-write-index).

## Path parameters

The Rollover Index API supports the following parameters.

Parameter | Type | Description 
:--- | :--- | :--- 
`<rollover-target>` | String | The name of the data stream or index alias to roll over. Required. |
`<target-index>` | String | The name of the index to create. Supports date math. Data streams do not support this parameter. If the name of the alias's current write index does not end with - and a number, such as `my-index-000001` or `my-index-2`, this parameter is required. 

## Query parameters

The following query parameters are supported.

Parameter | Type | Description 
:--- | :--- | :--- 
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`
`timeout` | Time | How long to wait for a response. Default is `30s`.
`wait_for_active_shards` | String | The number of active shards that must be available before OpenSearch processes the request. Default is `1` (only the primary shard). You can also set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed.

## Request body

The following request body options are supported.

### `alias`

The alias name as the key. Required when the `template` option exists in the request body.

The object body contains the following optional options for the alias:

Parameter | Type | Description
:--- | :--- | :---
`filter` | Query DSL object | The query that limits documents the alias can access.
`index_routing` | String | The value which routes indexing operations to a specific shard. When specified, overwrites the `routing` value for indexing operations.
`is_hidden` | Boolean | When `true`, the alias is hidden. Default is false. All indexes for the alias must have matching values for this setting.
`is_write_index` | Boolean | When `true`, the index is the [write index] for the alias. Default is `false`.
`routing` | String | The value used to route index and search operations to a specific shard.
`search_routing` | String | The value used to write specifically search operations to a specific shard. When specified, this option overwrites the `routing` value for search operations.

### `mappings`

The field mappings that exist in the index. For more information, see [Mappings and field types](https://opensearch.org/docs/latest/field-types/). Optional.

### `conditions`

The conditions parameter is an optional object that allows you to define specific criteria for triggering the rollover operation. When provided, OpenSearch only runs the rollover if the current index satisfies one or more of the specified conditions. However, if this parameter is omitted, OpenSerch will perform the rollover unconditionally, without any prerequisite conditions.

The object body supports the following options.

Parameter | Type | Description 
:--- | :--- | :--- 
| `max_age` | Time units | Triggers a rollover after the maximum elapsed time from index creation is reached. The elapsed time is always calculated since the index creation time, even if the index origination date is configured to a custom date, such as when using the `index.lifecycle.parse_origination_date` or `index.lifecycle.origination_date` settings. Optional. |
`max_docs` | Integer | Triggers a rollover after the specified maximum number of documents is reached. Documents added since the last refresh are not included in the document count. The document count does not include documents in replica shards. Optional 
`max_size` | Byte units  | Triggers rollover when the index reaches a certain size. This is the total size of all primary shards in the index. Replicas are not counted toward the maximum index size. To see the current index size, use the `_cat indices` API. The `pri.store.size` value shows the combined size of all primary shards. Optional.
`max_primary_shard_size` | Byte units  | Triggers rollover when the largest primary shard in the index reaches a certain size. This is the maximum size of the primary shards in the index. As with `max_size`, replicas are ignored. To see the current shard size, use the `_cat shards` API. The `store` value shows the size of each shard, and `prirep` indicates whether a shard is a primary (`p`) or a replica (`r`). Optional.

### `settings`

Any configuration options for the index. For more information, see [Index settings](https://opensearch.org/docs/latest/install-and-configure/configuring-opensearch/index-settings/).

## Examples

The following example requests and responses illustrate how to use the Rollover Index API. All examples use the following roll over conditions, if one or more of which are met, a roll over occurs:

- The index was created 5 or more days ago.
- The index contains 500 or more documents.
- The index’s largest primary shard is 100GB or larger.

### Rolling over a data stream

The following request only rolls over the data stream if the current write index:

```
POST my-data-stream/_rollover
{
  "conditions": {
    "max_age": "5d",
    "max_docs": 500,
    "max_primary_shard_size": "100gb"
  }
}
```
{% include copy-curl.html %}

### Rolling over an index alias with a write index

The following request creates a data time index and sets it as the write index for my-alias:

```
PUT <my-index-{now/d}-000001>
PUT %3Cmy-index-%7Bnow%2Fd%7D-000001%3E
{
  "aliases": {
    "my-alias": {
      "is_write_index": true
    }
  }
}
```
{% include copy-curl.html %}

Than, the next request creates a rollover based off of the alias:

```
POST my-alias/_rollover
{
  "conditions": {
    "max_age": "5d",
    "max_docs": 500,
    "max_primary_shard_size": "100gb"
  }
}
```
{% include copy-curl.html %}

### Specifying settings during a rollover

In most cases, you can use an index template to automatically configure the indexes created during a rollover operation. However, when rolling over an index alias, you can use the Rollover Index API to introduce additional index settings or override the settings defined in the template, as shown in the following example:

```
POST my-alias/_rollover
{
  "settings": {
    "index.number_of_shards": 4
  }
}
```
{% include copy-curl.html %}


## Example Response

OpenSearch returns the following response, where all conditions were met as true:

```
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "old_index": ".ds-my-data-stream-2029.06.11-000001",
  "new_index": ".ds-my-data-stream-2029.06.12-000002",
  "rolled_over": true,
  "dry_run": false,
  "conditions": {
    "[max_age: 5d]": true,
    "[max_docs: 500]": true,
    "[max_primary_shard_size: 100gb]": false
  }
}
```




