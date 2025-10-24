---
layout: default
title: Delete snapshot repository
parent: Snapshot APIs
nav_order: 3
---

# Delete Snapshot Repository Configuration API
**Introduced 1.0**
{: .label .label-purple }

Deletes a snapshot repository configuration.  
 
A repository in OpenSearch is simply a configuration that maps a repository name to a type (file system or s3 repository) along with other information depending on the type. The configuration is backed by a file system location or an s3 bucket. When you invoke the API, the physical file system or s3 bucket itself is not deleted. Only the configuration is deleted.

To learn more about repositories, see [Register or update snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository).

## Endpoints

```json
DELETE _snapshot/<repository>
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
repository | String | Repository to delete. |

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

To verify that the repository was deleted, use the [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository) API, passing the repository name as the `repository` path parameter.
{: .note}