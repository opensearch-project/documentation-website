---
layout: default
title: Delete Snapshot
parent: Snapshot APIs
nav_order: 7
---

## Delete snapshot
**Introduced 1.0**
{: .label .label-purple }

The Delete Snapshot API permanently removes a snapshot from a repository. Deleting snapshots that are no longer needed helps free up storage space and keep your repository organized.

* For more information about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/).
* To view a list of your repositories, see [Cat Repositories]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-repositories/).
* To view a list of your snapshots, see [Cat Snapshots]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-snapshots/).

<!-- spec_insert_start
api: snapshot.delete
component: endpoints
-->
## Endpoints
```json
DELETE /_snapshot/{repository}/{snapshot}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.delete
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository containing the snapshot to delete. |
| `snapshot` | **Required** | String | A comma-separated list of snapshot names to delete from the repository. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.delete
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.delete
component: request_body_parameters
-->
<!-- API snapshot.delete does NOT have a request_body_parameters component -->
<!-- spec_insert_end -->

## Example request

The following request deletes a snapshot called `my-first-snapshot` from the `my-opensearch-repo` repository:

```json
DELETE _snapshot/my-opensearch-repo/my-first-snapshot
```
{% include copy-curl.html %}

## Example response

Upon success, the response returns the following JSON object:

```json
{
  "acknowledged": true
}
```

To verify that the snapshot was deleted, use the [Get Snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/) API, passing the repository name and snapshot name as path parameters.
{: .note}
