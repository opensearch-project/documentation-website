---
layout: default
title: Delete snapshot repository
parent: Snapshot APIs
nav_order: 30
---

# Delete Snapshot Repository API
**Introduced 1.0**
{: .label .label-purple }

Deletes a snapshot repository registration from the cluster. The storage location and the snapshots in it are not deleted. To use the snapshots again, register the repository again using the [Create or Update Snapshot Repository API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository/).

## Endpoints

```json
DELETE _snapshot/{repository}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`repository` | String | Repository to delete. |

## Example request

The following request deletes the `my-opensearch-repo` repository:

<!-- spec_insert_start
component: example_code
rest: DELETE /_snapshot/my-opensearch-repo
-->
{% capture step1_rest %}
DELETE /_snapshot/my-opensearch-repo
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.delete_repository(
  repository = "my-opensearch-repo"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

Upon success, the response returns the following JSON object:

````json
{
  "acknowledged" : true
}
````

To verify that the repository was deleted, use the [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository/) API, passing the repository name as the `repository` path parameter.
{: .note}

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/repository/delete`.
