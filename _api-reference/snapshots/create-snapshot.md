---
layout: default
title: Create snapshot
parent: Snapshot APIs
nav_order: 50
---

# Create Snapshot API
**Introduced 1.0**
{: .label .label-purple }

Creates a snapshot within an existing repository. To view a list of registered repositories, use the [Get Snapshot Repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository/).

Snapshots are incremental: each snapshot copies only the index files that are not already stored in the repository by an earlier snapshot. Indexing and search requests can continue while a snapshot is in progress. The snapshot contains the data as it existed when the snapshot started, so documents indexed after that point are not included.

By default, a snapshot includes all open indexes and data streams in the cluster, including hidden indexes. Closed indexes are included only if you specify them in the `indices` field.

## Endpoints

```json
PUT /_snapshot/{repository}/{snapshot}
POST /_snapshot/{repository}/{snapshot}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`repository` | String | The repository name to store the snapshot.
`snapshot` | String | The name of the snapshot to create.

The snapshot name must be unique in the repository. To include the current date in the name, use a date math expression and URL-encode it. For an example, see [Request using date math in the snapshot name](#request-using-date-math-in-the-snapshot-name).

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`wait_for_completion` | Boolean | Whether to wait for snapshot creation to complete before continuing. If `true`, the request returns the snapshot definition after the snapshot completes. If `false`, the request returns `{"accepted": true}` when the snapshot starts. In a large repository, the request can take some time to return even when `wait_for_completion` is `false` because OpenSearch loads information about existing snapshots when the snapshot starts. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`.

## Request body fields

The request body is optional. The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`indices` | String or Array of strings | The data streams and indexes you want to include in the snapshot. You can use `,` to create a list of indexes, `*` to specify an index pattern, and `-` to exclude certain indexes. Don't put spaces between items. You can also specify the indexes as an array of strings. Default is all indexes.
`ignore_unavailable` | Boolean | If an index from the `indices` list doesn't exist, whether to ignore it rather than fail the snapshot. Default is `false`.
`include_global_state` | Boolean | Whether to include cluster state in the snapshot. The cluster state includes persistent cluster settings, index templates, legacy index templates, and ingest pipelines. Transient cluster settings and registered snapshot repositories are not included. For information about restoring the cluster state, see [Restore Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/). Default is `true`.
`partial` | Boolean | Whether to allow partial snapshots. If `false`, the entire snapshot fails if any index in the snapshot does not have all primary shards available. If `true`, OpenSearch takes a snapshot of the available shards, sets the snapshot `state` to `PARTIAL`, and lists the unavailable shards in the `failures` array. Default is `false`.
`metadata` | Object | Custom information to store with the snapshot, such as the user who took the snapshot and the reason for taking it. The metadata is returned by the [Get Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/). Must be smaller than 1,024 bytes.

## Example requests

The following examples demonstrate how to create a snapshot.

### Request without a body

The following request creates a snapshot called `my-first-snapshot` in an S3 repository called `my-s3-repository`. A request body is not included because it is optional.

<!-- spec_insert_start
component: example_code
rest: POST /_snapshot/my-s3-repository/my-first-snapshot
-->
{% capture step1_rest %}
POST /_snapshot/my-s3-repository/my-first-snapshot
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.create(
  repository = "my-s3-repository",
  snapshot = "my-first-snapshot"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Request with a body

You can also add a request body to include or exclude certain indexes or specify other settings. The following request also stores custom information about the snapshot in the `metadata` object:

<!-- spec_insert_start
component: example_code
rest: PUT /_snapshot/my-s3-repository/pre-upgrade
body: |
{
  "indices": "opensearch_dashboards*,my-index*,-my-index-2016",
  "ignore_unavailable": true,
  "include_global_state": false,
  "partial": false,
  "metadata": {
    "taken_by": "ops-team",
    "reason": "Backup before upgrading to 3.9"
  }
}
-->
{% capture step1_rest %}
PUT /_snapshot/my-s3-repository/pre-upgrade
{
  "indices": "opensearch_dashboards*,my-index*,-my-index-2016",
  "ignore_unavailable": true,
  "include_global_state": false,
  "partial": false,
  "metadata": {
    "taken_by": "ops-team",
    "reason": "Backup before upgrading to 3.9"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.create(
  repository = "my-s3-repository",
  snapshot = "pre-upgrade",
  body =   {
    "indices": "opensearch_dashboards*,my-index*,-my-index-2016",
    "ignore_unavailable": true,
    "include_global_state": false,
    "partial": false,
    "metadata": {
      "taken_by": "ops-team",
      "reason": "Backup before upgrading to 3.9"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Request using date math in the snapshot name

The following request creates a snapshot whose name contains the current date, such as `nightly-2026.10.12`. The non-encoded snapshot name is `<nightly-{now/d}>`. The `<`, `{`, `/`, `}`, and `>` characters must be URL-encoded in the request path:

```json
PUT /_snapshot/my-s3-repository/%3Cnightly-%7Bnow%2Fd%7D%3E
```
{% include copy-curl.html %}

For more information about date math expressions, see [Date math]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/#date-math).

## Example responses

Upon success, the response content depends on the value of the `wait_for_completion` query parameter.

<!-- vale off -->
### wait_for_completion is false
<!-- vale on -->

```json
{
  "accepted": true
}
```

To verify that the snapshot was created, use the [Get Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/), passing the snapshot name as the `snapshot` path parameter.
{: .note}

<!-- vale off -->
### wait_for_completion is true
<!-- vale on -->

The following response is returned for the [Request with a body](#request-with-a-body) example:

```json
{
  "snapshot" : {
    "snapshot" : "pre-upgrade",
    "uuid" : "AsDQXjhOQViYaPzbSo8nJw",
    "version_id" : 137307827,
    "version" : "3.9.0",
    "remote_store_index_shallow_copy" : false,
    "indices" : [
      "opensearch_dashboards_sample_data_logs",
      "opensearch_dashboards_sample_data_flights",
      "opensearch_dashboards_sample_data_ecommerce"
    ],
    "data_streams" : [ ],
    "include_global_state" : false,
    "metadata" : {
      "taken_by" : "ops-team",
      "reason" : "Backup before upgrading to 3.9"
    },
    "state" : "SUCCESS",
    "start_time" : "2026-10-12T18:33:50.705Z",
    "start_time_in_millis" : 1791830030705,
    "end_time" : "2026-10-12T18:33:50.906Z",
    "end_time_in_millis" : 1791830030906,
    "duration_in_millis" : 201,
    "failures" : [ ],
    "shards" : {
      "total" : 3,
      "failed" : 0,
      "successful" : 3
    }
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `snapshot` | String | Snapshot name. |
| `uuid` | String | Snapshot's universally unique identifier (UUID). |
| `version_id` | Integer | Build ID of the OpenSearch version that created the snapshot. |
| `version` | String | OpenSearch version that created the snapshot. |
| `indices` | Array | Indexes in the snapshot. |
| `data_streams` | Array | Data streams in the snapshot. |
| `include_global_state` | Boolean | Whether the current cluster state is included in the snapshot. |
| `metadata` | Object | The custom information stored with the snapshot. Returned only if the request included `metadata`. |
| `start_time` | String | The date and time when the snapshot creation process began. |
| `start_time_in_millis` | Long | Time (in milliseconds) when the snapshot creation process began. |
| `end_time` | String | The date and time when the snapshot creation process ended. |
| `end_time_in_millis` | Long | Time (in milliseconds) when the snapshot creation process ended. |
| `duration_in_millis` | Long | Total time (in milliseconds) that the snapshot creation process lasted. |
| `failures` | Array | Failures, if any, that occurred during snapshot creation. |
| `shards` | Object | Total number of shards created along with number of successful and failed shards. |
| `state` | String | Snapshot status. Possible values: `IN_PROGRESS`, `SUCCESS`, `FAILED`, `PARTIAL`. |
| `remote_store_index_shallow_copy` | Boolean | Whether the snapshots of the remote store indexes are captured as shallow copies. Default is `false`. |
| `pinned_timestamp` | Long | A timestamp (in milliseconds) pinned by the snapshot for the implicit locking of remote store files referenced by the snapshot. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/snapshot/create`.
