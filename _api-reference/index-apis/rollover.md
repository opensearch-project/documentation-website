---
layout: default
title: Roll over index
parent: Index operations
grand_parent: Index APIs
nav_order: 70
---

# Roll Over Index API
**Introduced 1.0**
{: .label .label-purple }

The Roll Over Index API creates a new index for a data stream or index alias, either unconditionally or when the current write index meets the specified conditions.

## Endpoints

```json
POST /{rollover-target}/_rollover/
POST /{rollover-target}/_rollover/{target-index}
```

## Rollover types

You can roll over a data stream, an index alias with one index, or an index alias with a write index.

### Data stream

When you perform a rollover operation on a data stream, the API generates a fresh write index for that stream. Simultaneously, the stream's preceding write index transforms into a regular backing index. Additionally, the rollover process increments the generation count of the data stream. Data stream rollovers do not support the `target-index` path parameter or the `aliases`, `mappings`, and `settings` request body fields because the data stream names its backing indexes and its index template configures them.

### Index alias with one index

When initiating a rollover on an index alias associated with a single index, the API generates a new index and disassociates the original index from the alias.

### Index alias with a write index

When an index alias references multiple indexes, one index must be designated as the write index. During a rollover, the API creates a new write index with its `is_write_index` property set to `true` while updating the previous write index by setting its `is_write_index` property to `false`.

## Incrementing index names for an alias

During the index alias rollover process, if you don't specify a custom name and the current index's name ends with a hyphen followed by a number (for example, `my-index-000001` or `my-index-3`), then the rollover operation will automatically increment that number for the new index's name. For instance, rolling over `my-index-000001` will generate `my-index-000002`. The numeric portion is always padded with leading zeros to ensure a consistent length of six characters.

## Using date math with index rollovers

When using an index alias for time-series data, you can use [date math]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/) in the index name to track the rollover date. For example, you can create an alias pointing to `my-index-{now/d}-000001`. If you create an alias on June 11, 2029, then the index name would be `my-index-2029.06.11-000001`. For a rollover on June 12, 2029, the new index would be named `my-index-2029.06.12-000002`. See [Roll over an index alias with a write index](#rolling-over-an-index-alias-with-a-write-index) for a practical example. For the full date math index name syntax and the characters you must encode in request URLs, see [Date math in index names]({{site.url}}{{site.baseurl}}/api-reference/index-name-syntax/#date-math-in-index-names).

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description 
:--- | :--- | :--- 
`rollover-target` | String | The name of the data stream or index alias to roll over. Required. |
`target-index` | String | The name of the index to create. Supports date math. Data streams do not support this parameter. If the name of the alias's current write index does not end with `-` and a number, such as `my-index-000001` or `my-index-2`, then the parameter is required. 

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description 
:--- | :--- | :--- 
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`dry_run` | Boolean | If `true`, OpenSearch checks whether the current index meets the rollover conditions and returns the name of the index that would be created, but does not perform the rollover. Default is `false`.
`timeout` | Time | The amount of time to wait for a response. Default is `30s`.
`wait_for_active_shards` | String | The number of shard copies of the new index that must be active before OpenSearch returns a response. Default is `1` (only the primary shard). You can also set to `all` or a positive integer. Values greater than `1` require replicas. For example, if you specify a value of `3`, then the new index must have two replicas distributed across two additional nodes. The rollover is performed regardless of this setting. If the required shards are not active within the `cluster_manager_timeout` period, then the response contains `"shards_acknowledged": false`.

## Request body fields

The following request body fields are supported.

### `aliases`

The `aliases` parameter specifies the aliases to add to the new index. It is optional. The `aliases` object is keyed by alias name. Each alias object supports the following optional parameters.


Parameter | Type | Description
:--- | :--- | :---
`filter` | Query DSL object | The query that limits the number of documents that the alias can access.
`index_routing` | String | The value that routes indexing operations to a specific shard. When specified, overwrites the `routing` value for indexing operations.
`is_hidden` | Boolean | Hides or shows the alias. When `true`, the alias is hidden. Default is `false`. Indexes for the alias must have matching values for this setting.
`is_write_index` | Boolean | Specifies the write index. When `true`, the index is the write index for the alias. Default is `false`.
`routing` | String | The value used to route index and search operations to a specific shard.
`search_routing` | String | Routes search operations to a specific shard. When specified, it overwrites `routing` for search operations.

### `mappings`

The `mappings` parameter specifies the index field mappings. It is optional. See [Mappings and field types]({{site.url}}{{site.baseurl}}/mappings/) for more information.

### `conditions`

The `conditions` parameter is an optional object defining criteria for triggering the rollover. When provided, OpenSearch only rolls over if the current index satisfies one or more specified conditions. If omitted, then the rollover occurs unconditionally without prerequisites.

The object body supports the following parameters.

Parameter | Data type | Description 
:--- | :--- | :--- 
`max_age` | Time units | Triggers a rollover after the maximum elapsed time since index creation is reached. Optional. |
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

To create a data stream, first create an index template that enables data streams for indexes matching the `my-data-stream*` pattern:

```json
PUT _index_template/my-data-stream-template
{
  "index_patterns": ["my-data-stream*"],
  "data_stream": {}
}
```
{% include copy-curl.html %}

Then create the data stream:

```json
PUT _data_stream/my-data-stream
```
{% include copy-curl.html %}

For more information, see [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/).

The following request rolls over the data stream if the current write index meets any of the specified conditions:

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

### Rolling over an index alias with a write index

The following request creates a date-time index and sets it as the write index for `my-alias`. The index name must be URL encoded: `%3Cmy-index-%7Bnow%2Fd%7D-000001%3E` is the encoded form of `<my-index-{now/d}-000001>`, and `{now/d}` resolves to the current date:

```json
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

The following example response for the data stream rollover shows that all conditions except `max_size` were met. If the write index is newly created and meets none of the conditions, then the response contains `"rolled_over": false` and OpenSearch does not create the new index:

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "old_index": ".ds-my-data-stream-000001",
  "new_index": ".ds-my-data-stream-000002",
  "rolled_over": true,
  "dry_run": false,
  "conditions": {
    "[max_age: 5d]": true,
    "[max_docs: 500]": true,
    "[max_size: 100gb]": false
  }
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/rollover`.
