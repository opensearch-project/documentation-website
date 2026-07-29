---
layout: default
title: Modify data stream
parent: Index APIs
nav_order: 85
---

# Modify Data Stream API
**Introduced 3.8**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/8271).
{: .warning}

The Modify Data Stream API adds or removes backing indexes of a [data stream]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/). It is a metadata-only operation: all actions in a request are applied atomically in a single cluster-state update, and no shards are created, deleted, restored, or relocated. Use this API to migrate a pre-existing regular index into a data stream or to detach a backing index without deleting its data.

## Endpoints

```json
POST /_data_stream/_modify
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`. |
| `timeout` | Time | The amount of time to wait for a response from the cluster. Default is `30s`. |

## Request body fields

The request body must contain an `actions` array in which each element is a single-key object specifying one action. The following table lists the available request body fields.

| Field | Data type | Description | Required |
| :--- | :--- | :--- | :--- |
| `actions` | Array | A list of actions to perform. Each element is an object with exactly one action: `add_backing_index` or `remove_backing_index`. You must provide at least one action. | Yes |
| `actions[].add_backing_index` | Object | Adds an existing index to the data stream as a backing index. | No |
| `actions[].add_backing_index.data_stream` | String | The name of the data stream to modify. | Yes |
| `actions[].add_backing_index.index` | String | The name of the index to add as a backing index. | Yes |
| `actions[].remove_backing_index` | Object | Removes a backing index from the data stream. | No |
| `actions[].remove_backing_index.data_stream` | String | The name of the data stream to modify. | Yes |
| `actions[].remove_backing_index.index` | String | The name of the backing index to remove. | Yes |

## Behavior

Keep the following behavior in mind when modifying a data stream:

- Add and remove actions change only the data stream metadata; the index and its data are not modified.
- You can include multiple add and remove actions in a request. The actions are applied atomically, and the result is independent of the action order.
- The data stream generation is derived from its backing indexes (the highest backing-index counter is the write index) and cannot be set directly.
- The write index cannot be removed, and removing the last backing index is rejected.
- An added index must map the data stream's timestamp field as a `date` or `date_nanos`. An added index is marked as hidden; a removed index is made visible again.
- An added index need not follow the `.ds-<data_stream>-NNNNNN` naming convention, which allows you to migrate a pre-existing regular index into a data stream.
- An index cannot be a backing index of more than one data stream.

## Example request

The following request removes a backing index from the `logs-foo` data stream and adds the pre-existing `legacy-logs-2023` index to it in a single atomic operation:

```json
POST /_data_stream/_modify
{
  "actions": [
    {
      "remove_backing_index": {
        "data_stream": "logs-foo",
        "index": ".ds-logs-foo-000001"
      }
    },
    {
      "add_backing_index": {
        "data_stream": "logs-foo",
        "index": "legacy-logs-2023"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```

## Response body fields

The following table lists all available response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Whether the request was acknowledged and the cluster-state update was applied. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/data_stream/modify`.

## Related documentation

- [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/)
- [Data Stream Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/data-stream-stats/)
