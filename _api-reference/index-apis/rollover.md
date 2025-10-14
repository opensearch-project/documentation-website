---
layout: default
title: Roll over index
parent: Index APIs
nav_order: 125
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/rollover/
---

# Roll Over Index API
Introduced 1.0
{: .label .label-purple }

The roll over index API operation creates a new index for a data stream or index alias based on the `wait_for_active_shards` setting.

## Endpoints

```json
POST /<rollover-target>/_rollover/
POST /<rollover-target>/_rollover/<target-index>
```

## Rollover types

You can roll over a data stream, an index alias with one index, or an index alias with a write index.

### Data stream

When you perform a rollover operation on a data stream, the API generates a fresh write index for that stream. Simultaneously, the stream's preceding write index transforms into a regular backing index. Additionally, the rollover process increments the generation count of the data stream. Data stream rollovers do not support specifying index settings in the request body.

### Index alias with one index

When initiating a rollover on an index alias associated with a single index, the API generates a new index and disassociates the original index from the alias.

### Index alias with a write index

When an index alias references multiple indexes, one index must be designated as the write index. During a rollover, the API creates a new write index with its `is_write_index` property set to `true` while updating the previous write index by setting its `is_write_index property` to `false.`

## Incrementing index names for an alias

During the index alias rollover process, if you don't specify a custom name and the current index's name ends with a hyphen followed by a number (for example, `my-index-000001` or `my-index-3`), then the rollover operation will automatically increment that number for the new index's name. For instance, rolling over `my-index-000001` will generate `my-index-000002`. The numeric portion is always padded with leading zeros to ensure a consistent length of six characters.

## Using date math with index rollovers

When using an index alias for time-series data, you can use [date math]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/) in the index name to track the rollover date. For example, you can create an alias pointing to `my-index-{now/d}-000001`. If you create an alias on June 11, 2029, then the index name would be `my-index-2029.06.11-000001`. For a rollover on June 12, 2029, the new index would be named `my-index-2029.06.12-000002`. See [Roll over an index alias with a write index](#rolling-over-an-index-alias-with-a-write-index) for a practical example.

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description 
:--- | :--- | :--- 
`<rollover-target>` | String | The name of the data stream or index alias to roll over. Required. |
`<target-index>` | String | The name of the index to create. Supports date math. Data streams do not support this parameter. If the name of the alias's current write index does not end with `-` and a number, such as `my-index-000001` or `my-index-2`, then the parameter is required. 

## Query parameters

The following table lists the available query parameters.

Parameter | Data type | Description 
:--- | :--- | :--- 
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for a response. Default is `30s`.
`wait_for_active_shards` | String | The number of active shards that must be available before OpenSearch processes the request. Default is `1` (only the primary shard). You can also set to `all` or a positive integer. Values greater than `1` require replicas. For example, if you specify a value of `3`, then the index must have two replicas distributed across two additional nodes in order for the operation to succeed.

## Request body fields

The following request body fields are supported.

### `alias`

The `alias` parameter specifies the alias name as the key. It is required when the `template` option exists in the request body. The object body contains the following optional parameters.


Parameter | Type | Description
:--- | :--- | :---
`filter` | Query DSL object | The query that limits the number of documents that the alias can access.
`index_routing` | String | The value that routes indexing operations to a specific shard. When specified, overwrites the `routing` value for indexing operations.
`is_hidden` | Boolean | Hides or unhides the alias. When `true`, the alias is hidden. Default is `false`. Indexes for the alias must have matching values for this setting.
`is_write_index` | Boolean | Specifies the write index. When `true`, the index is the write index for the alias. Default is `false`.
`routing` | String | The value used to route index and search operations to a specific shard.
`search_routing` | String | Routes search operations to a specific shard. When specified, it overwrites `routing` for search operations.

### `mappings`

The `mappings` parameter specifies the index field mappings. It is optional. See [Mappings and field types]({{site.url}}{{site.baseurl}}/field-types/) for more information.

### `conditions`

The `conditions` parameter is an optional object defining criteria for triggering the rollover. When provided, OpenSearch only rolls over if the current index satisfies one or more specified conditions. If omitted, then the rollover occurs unconditionally without prerequisites.

The object body supports the following parameters.

Parameter | Data type | Description 
:--- | :--- | :--- 
`max_age` | Time units | Triggers a rollover after the maximum elapsed time since index creation is reached. The elapsed time is always calculated since the index creation time, even if the index origination date is configured to a custom date, such as when using the `index.lifecycle.parse_origination_date` or `index.lifecycle.origination_date` settings. Optional. |
`max_docs` | Integer | Triggers a rollover after the specified maximum number of documents, excluding documents added since the last refresh and documents in replica shards. Optional. 
`max_size` | Byte units  | Triggers a rollover when the index reaches a specified size, calculated as the total size of all primary shards. Replicas are not counted. Use the `_cat indices` API and check the `pri.store.size` value to see the current index size. Optional.

### `settings`

The `settings` parameter specifies the index configuration options. See [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/) for more information.

## Example requests

The following examples illustrate using the Rollover Index API. A rollover occurs when one or more of the specified conditions are met:

- The index was created 5 or more days ago.
- The index contains 500 or more documents.
- The index is 100 GB or larger.

### Rolling over a data stream

The following request rolls over the data stream if the current write index meets any of the specified conditions:

<!-- spec_insert_start
component: example_code
rest: POST /my-alias/_rollover
body: |
{
  "conditions": {
    "max_age": "5d",
    "max_docs": 500,
    "max_size": "100gb"
  }
}
-->
{% capture step1_rest %}
POST /my-alias/_rollover
{
  "conditions": {
    "max_age": "5d",
    "max_docs": 500,
    "max_size": "100gb"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.rollover(
  alias = "my-alias",
  body =   {
    "conditions": {
      "max_age": "5d",
      "max_docs": 500,
      "max_size": "100gb"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Rolling over an index alias with a write index

The following request creates a date-time index and sets it as the write index for `my-alias`:

```json
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

The next request performs a rollover using the alias:

<!-- spec_insert_start
component: example_code
rest: POST /my-data-stream/_rollover
body: |
{
  "conditions": {
    "max_age": "5d",
    "max_docs": 500,
    "max_size": "100gb"
  }
}
-->
{% capture step1_rest %}
POST /my-data-stream/_rollover
{
  "conditions": {
    "max_age": "5d",
    "max_docs": 500,
    "max_size": "100gb"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.rollover(
  alias = "my-data-stream",
  body =   {
    "conditions": {
      "max_age": "5d",
      "max_docs": 500,
      "max_size": "100gb"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Specifying settings during a rollover

In most cases, you can use an index template to automatically configure the indexes created during a rollover operation. However, when rolling over an index alias, you can use the Rollover Index API to introduce additional index settings or override the settings defined in the template by sending the following request:

<!-- spec_insert_start
component: example_code
rest: POST /my-alias/_rollover
body: |
{
  "settings": {
    "index.number_of_shards": 4
  }
}
-->
{% capture step1_rest %}
POST /my-alias/_rollover
{
  "settings": {
    "index.number_of_shards": 4
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.rollover(
  alias = "my-alias",
  body =   {
    "settings": {
      "index.number_of_shards": 4
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response

OpenSearch returns the following response confirming that all conditions except `max_size` were met:

```json
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
    "[max_size: 100gb]": false
  }
}
```




