---
layout: default
title: Delete Snapshot Repository
parent: Snapshot APIs
nav_order: 3
---

# Delete snapshot repository configuration
**Introduced 1.0**
{: .label .label-purple }

 Deletes a snapshot repository configuration.  
 
 A repository in OpenSearch is simply a configuration that maps a repository name to a type (file system or s3 repository) along with other information depending on the type. The configuration is backed by a file system location or an s3 bucket. When you invoke the API, the physical file system or s3 bucket itself is not deleted. Only the configuration is deleted.

 To learn more about repositories, see [Register or update snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-repository).

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
repository | String | Repository to delete. |

#### Example request

The following request deletes the `my-opensearch-repo` repository:

````json
DELETE _snapshot/my-opensearch-repo
````
{% include copy-curl.html %}

#### Example response

Upon success, the response returns the following JSON object:

````json
{
  "acknowledged" : true
}
````

To verify that the repository was deleted, use the [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository) API, passing the repository name as the `repository` path parameter.
{: .note}