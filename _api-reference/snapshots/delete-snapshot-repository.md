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

<!-- spec_insert_start
api: snapshot.delete_repository
component: endpoints
-->
## Endpoints
```json
DELETE /_snapshot/{repository}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.delete_repository
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | List or String | The name of the snapshot repository to unregister. Wildcard (`*`) patterns are supported. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.delete_repository
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `timeout` | String | The amount of time to wait for a response. |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Explicit operation timeout for connection to cluster-manager node |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.delete_repository
component: request_body_parameters
-->
<!-- API snapshot.delete_repository does NOT have a request_body_parameters component -->
<!-- spec_insert_end -->


## Example request

The following request deletes the `my-opensearch-repo` repository:

````json
DELETE _snapshot/my-opensearch-repo
````
{% include copy-curl.html %}

## Example response

Upon success, the response returns the following JSON object:

````json
{
  "acknowledged" : true
}
````

To verify that the repository was deleted, use the [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository) API, passing the repository name as the `repository` path parameter.
{: .note}

