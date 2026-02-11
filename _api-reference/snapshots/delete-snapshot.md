---
layout: default
title: Delete snapshot
parent: Snapshot APIs
nav_order: 7
canonical_url: https://docs.opensearch.org/latest/api-reference/snapshots/delete-snapshot/
---

## Delete snapshot
**Introduced 1.0**
{: .label .label-purple }

Deletes a snapshot from a repository.

Deleting a snapshot that is in progress stops the snapshot operation and deletes the partially created snapshot.

* To learn more about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index).

* To view a list of your repositories, see [cat repositories]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-repositories).

* To view a list of your snapshots, see [cat snapshots]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-snapshots).

## Path and HTTP method

```json
DELETE _snapshot/<repository>/<snapshot>
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
repository | String | Repository that contains the snapshot. |
snapshot | String | Snapshot to delete. |

## Example request

The following request deletes a snapshot called `my-first-snapshot` from the `my-opensearch-repo` repository:

<!-- spec_insert_start
component: example_code
rest: DELETE /_snapshot/my-opensearch-repo/my-first-snapshot
-->
{% capture step1_rest %}
DELETE /_snapshot/my-opensearch-repo/my-first-snapshot
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.delete(
  repository = "my-opensearch-repo",
  snapshot = "my-first-snapshot"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

Upon success, the response returns the following JSON object:

```json
{
  "acknowledged": true
}
```

To verify that the snapshot was deleted, use the [Get snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot) API, passing the snapshot name as the `snapshot` path parameter.
{: .note}
