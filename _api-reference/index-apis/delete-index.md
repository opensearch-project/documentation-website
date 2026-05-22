---
layout: default
title: Delete index
parent: Core index APIs
grand_parent: Index APIs
nav_order: 20
redirect_from:
  - /opensearch/rest-api/index-apis/delete-index/
---

# Delete Index API
**Introduced 1.0**
{: .label .label-purple }

The delete index API operation deletes one or more indexes from your cluster.

**Warning**: Deleting an index is a permanent operation. All data in the index is lost and cannot be recovered. Always verify that you have backups or that the data is no longer needed before deleting an index.
{: .warning}

<!-- spec_insert_start
api: indices.delete
component: endpoints
-->
## Endpoints
```json
DELETE /{index}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the index to delete. You can specify a single index name, a comma-separated list of index names, or a wildcard expression. Wildcard expressions (`*`) match only open, concrete indexes. You cannot delete an index using an alias. To delete all indexes, use `_all` or `*`. To prevent accidental deletion of all indexes using `_all` or wildcard expressions, set the `action.destructive_requires_name` cluster setting to `true`. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `allow_no_indices` | Boolean | Specifies whether to ignore wildcards that do not match any indexes. If `false`, the request returns an error when wildcards do not match any indexes. | `true` |
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Match all indexes, including hidden indexes. <br> - `open`: Match open indexes. <br> - `closed`: Match closed indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. | `open` |
| `ignore_unavailable` | Boolean | Specifies whether to ignore indexes that are unavailable (missing or closed). If `true`, missing or closed indexes are not included in the response. | `false` |
| `cluster_manager_timeout` | String | The amount of time to wait for a connection to the cluster manager node. | `30s` |
| `timeout` | String | The amount of time to wait for a response. If no response is received before the timeout expires, the request fails and returns an error. | `30s` |

## Example: Deleting a single index

The following example request deletes a single index named `sample-index`:

<!-- spec_insert_start
component: example_code
rest: DELETE /sample-index
-->
{% capture step1_rest %}
DELETE /sample-index
{% endcapture %}

{% capture step1_python %}


response = client.indices.delete(
  index = "sample-index"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Deleting multiple indexes

The following example request deletes multiple indexes by specifying them in a comma-separated list:

<!-- spec_insert_start
component: example_code
rest: DELETE /logs-2024-01,logs-2024-02,logs-2024-03
-->
{% capture step1_rest %}
DELETE /logs-2024-01,logs-2024-02,logs-2024-03
{% endcapture %}

{% capture step1_python %}


response = client.indices.delete(
  index = "logs-2024-01,logs-2024-02,logs-2024-03"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Deleting indexes using wildcard patterns

The following example request deletes all indexes that match the pattern `logs-2024-*`:

<!-- spec_insert_start
component: example_code
rest: DELETE /logs-2024-*
-->
{% capture step1_rest %}
DELETE /logs-2024-*
{% endcapture %}

{% capture step1_python %}


response = client.indices.delete(
  index = "logs-2024-*"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Deleting all indexes

**Warning**: The following operation is extremely destructive and will delete all indexes in your cluster. Use with extreme caution and only in development or testing environments.
{: .warning}

The following example request deletes all indexes in the cluster:

<!-- spec_insert_start
component: example_code
rest: DELETE /*
-->
{% capture step1_rest %}
DELETE /*
{% endcapture %}

{% capture step1_python %}


response = client.indices.delete(
  index = "*"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To prevent accidental deletion of all indexes, you can set the `action.destructive_requires_name` cluster setting to `true`. When this setting is enabled, you must specify explicit index names and cannot use `_all` or wildcard patterns to delete all indexes. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

## Example response

OpenSearch returns the following response when the delete operation is successful:

```json
{
  "acknowledged": true
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`acknowledged` | Boolean | Indicates whether the delete request was received by the cluster. A value of `true` means the indexes were successfully deleted.
