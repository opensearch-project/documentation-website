---
layout: default
title: Delete Snapshot
parent: Snapshot APIs
grand_parent: REST API reference
nav_order: 7
---

## Delete snapshot

Deletes a snapshot from a repository.

* To learn more about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index).

* To view a list of your repositories, see [cat repositories]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/cat-repositories).

* To view a list of your snapshots, see [cat snapshots]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/cat-snapshots).

### Path parameters

Parameter | Data Type | Description
:--- | :--- | :---
repository | String | Repostory that contains the snapshot. |
snapshot | String | Snapshot to delete. |

#### Sample request

The following request deletes a snapshot called `my-first-snapshot` from the `my-opensearch-repo` repository.

`DELETE _snapshot/my-opensearch-repo/my-first-snapshot`

#### Sample response

Upon success, the response returns the following JSON object:

```json
{
  "acknowledged": true
}
```

To verify that the snapshot was deleted, use the [Get snapshot API]({{site.url}}{{site.baseurl}}/opensearch/rest-api/snapshots/get-snapshot), passing the snapshot name as the `snapshot` path parameter.
{: .note}
