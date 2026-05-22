---
layout: default
title: Clone index
parent: Index operations
grand_parent: Index APIs
nav_order: 20
redirect_from:
  - /opensearch/rest-api/index-apis/clone/
---

# Clone Index API
**Introduced 1.0**
{: .label .label-purple }

The clone index API clones an existing index into a new index, where each original primary shard is cloned into a new primary shard in the target index.

Use this API in the following scenarios:

- Creating a backup copy of an index with the same number of shards before making destructive changes.
- Testing configuration changes on a cloned copy while preserving the original index.
- Duplicating an index for parallel processing workflows with different settings or aliases.

The clone operation follows a three-step process to efficiently duplicate index data:

1. OpenSearch creates a target index with the same definition as the source index, including mappings and settings.
2. The system creates hard links from the source index segments to the target index. If the file system does not support hard linking, OpenSearch copies all segments to the target index, which requires more time and disk space.
3. OpenSearch recovers the target index as if it were a closed index that has been reopened, making it available for use.

## Prerequisites

Before cloning an index, you must prepare the source index by marking it as read-only and ensuring the cluster is healthy:

- The source index must have the `index.blocks.write` setting set to `true` to prevent write operations during the cloning process. Metadata changes, such as deleting the index, are still allowed.
- The cluster health status must be `green` to ensure all primary and replica shards are available.

The following example request sets the `products` index to read-only mode so that it can be cloned:

<!-- spec_insert_start
component: example_code
rest: PUT /products/_settings
body: |
{
  "settings": {
    "index.blocks.write": true
  }
}
-->
{% capture step1_rest %}
PUT /products/_settings
{
  "settings": {
    "index.blocks.write": true
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_settings(
  index = "products",
  body =   {
    "settings": {
      "index.blocks.write": true
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->



<!-- spec_insert_start
api: indices.clone
component: endpoints
-->
## Endpoints
```json
POST /{index}/_clone/{target}
PUT  /{index}/_clone/{target}
```
<!-- spec_insert_end -->

## Requirements

An index can only be cloned if it meets the following requirements:

- The target index must not already exist.
- The source index must have the same number of primary shards as the target index.
- The source index must be marked as read-only by setting `index.blocks.write` to `true`.
- The cluster health status must be `green`.
- The node handling the clone process must have sufficient free disk space to accommodate a second copy of the index if hard linking is not supported by the file system.

## Index naming restrictions

OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the source index to clone. |
| `target` | **Required** | String | The name of the target index to create. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a connection to the cluster manager node. | `30s` |
| `task_execution_timeout` | String | The amount of time to wait for the task to complete. Only applicable when `wait_for_completion` is set to `false`. | `1h` |
| `timeout` | String | The amount of time to wait for a response. If no response is received before the timeout expires, the request fails and returns an error. | `30s` |
| `wait_for_active_shards` | String | The number of active shard copies required for the operation to proceed. Specify `all` or any positive integer up to the total number of shards in the index (`number_of_replicas+1`). | `1` (only the primary shard) |
| `wait_for_completion` | Boolean | Specifies whether to wait for the operation to complete before returning a response. | `true` |

## Request body fields

The clone index API creates a new target index, so you can specify index settings and aliases to apply to the target index in the request body. The request body is optional.

Field | Data type | Description
:--- | :--- | :---
`settings` | Object | Configuration options for the target index. For a list of index settings, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/). Optional.
`settings.index.number_of_shards` | Integer | The number of primary shards in the target index. This value must equal the number of primary shards in the source index. Optional. Default is the same as the source index.
`settings.index.number_of_replicas` | Integer | The number of replica shards for each primary shard in the target index. Optional. Default is the same as the source index.
`aliases` | Object | Index aliases to apply to the target index. Each key is an alias name, and the value is an alias configuration object. For more information, see [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/). Optional.

**Note**: You cannot specify mappings in the clone request. The mappings from the source index are automatically used for the target index.
{: .note}

## Example: Cloning an index

The following example request clones the `products` index into a new index named `products-clone`:

<!-- spec_insert_start
component: example_code
rest: POST /products/_clone/products-clone
body: {}
-->
{% capture step1_rest %}
POST /products/_clone/products-clone
{}
{% endcapture %}

{% capture step1_python %}


response = client.indices.clone(
  index = "products",
  target = "products-clone",
  body =   {}
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Cloning an index with settings and aliases

The following example request clones the `products` index into a new index named `products-clone-configured` with custom settings and an alias:

<!-- spec_insert_start
component: example_code
rest: POST /products/_clone/products-clone-configured
body: |
{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "aliases": {
    "products-search": {}
  }
}
-->
{% capture step1_rest %}
POST /products/_clone/products-clone-configured
{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "aliases": {
    "products-search": {}
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.clone(
  index = "products",
  target = "products-clone-configured",
  body =   {
    "settings": {
      "index": {
        "number_of_shards": 2,
        "number_of_replicas": 1
      }
    },
    "aliases": {
      "products-search": {}
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

OpenSearch returns the following response when the clone request is successful. The `index` field contains the name of the target index that was created:

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "products-clone"
}
```

The response returns immediately once the target index has been added to the cluster state. It does not wait for the clone operation to complete.

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`acknowledged` | Boolean | Indicates whether the clone request was received by the cluster. A value of `true` means the request was received.
`shards_acknowledged` | Boolean | Indicates whether the number of shard copies specified by the `wait_for_active_shards` setting became active before the operation timed out. A value of `true` means the target number of shard copies became active. A value of `false` means that the operation timed out before the target number of shard copies became active.
`index` | String | The name of the newly created target index.

## Monitoring the cloning process

The clone API returns immediately after adding the target index to the cluster state, before any shards are allocated. At this point, all shards are in the `unassigned` state. If the target index cannot be allocated for any reason, its primary shards will remain `unassigned` until they can be allocated on a node.

Once a primary shard is allocated, it transitions to the `initializing` state, and the clone operation begins. When the clone operation completes, the shard becomes `active`. OpenSearch then attempts to allocate any replicas and may relocate the primary shard to another node.

You can monitor the cloning process using one of the following methods:

- Use the [CAT recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/) to view the progress of shard recovery and cloning.
- Use the [Cluster health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) with the `wait_for_status` parameter set to `yellow` to wait until all primary shards have been allocated.

The following example request monitors the recovery process for the cloned index:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/recovery/products-clone?v
-->
{% capture step1_rest %}
GET /_cat/recovery/products-clone?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.recovery(
  index = "products-clone",
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Wait for active shards

Because the clone operation creates a new index, the `wait_for_active_shards` setting for index creation also applies to the clone operation. This setting determines how many shard copies must be active before the operation returns a response. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).
