---
layout: default
title: Delete Snapshot Repository
parent: Snapshot APIs
grand_parent: REST API reference
nav_order: 5
---

## Delete Snapshot Repository

Deletes a repository.

### Path parameters

Parameter | Data Type | Description
:--- | :--- | :---
repository | String | Repository to delete. |


### Query parameters

None

#### Sample request

The following request deletes the `my-opensearch-repo` repository:

````json
DELETE _snapshot/my-opensearch-repo
````

#### Sample response

Upon success, the response returns the following JSON object:

````json
{
  "acknowledged" : true
}
````
To verify that the repository was deleted, use the [Get snapshot repository API]({{site.url}}{{site.baseurl}}/opensearch/rest-api/snapshots/get-snapshot-repository), passing the repository name as the `repository` path parameter.
{: .note}

### Request body

The get delete snapshot repository API does not accept a request body.