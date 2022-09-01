---
layout: default
title: Delete Script
parent: Script APIs
grand_parent: REST API reference
nav_order: 4
---

## Delete script

Deletes a stored script

### Path parameters

Path parameters are optional. 

| Parameter | Data Type | Description | 
:--- | :--- | :---
| script-id | String | ID of script to delete. |

### Query parameters

| Parameter | Data Type | Description | 
:--- | :--- | :---
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the master node. Optional, defaults to `30s`. |
| timeout | Time | The period of time to wait for a response. If a response is not received before the timeout value, the requ

#### Sample request

The following request deletes the `books` index.:

````json
DELETE /books
````

#### Sample response

The `DELETE /books` request returns the following field:

````json
{
  "acknowledged" : true
}
````

To determine whether the stored script was successfully deleted, use the [Get stored script]({{site.url}}{{site.baseurl}}/opensearch/rest-api/_script-apis/get-stored-script/) API, passing the script name as the `script` path parameter.

### Response fields

The <HTTP METHOD> <endpoint> request returns the following response fields:

| Field | Data Type | Description | 
:--- | :--- | :---
| acknowledged | Boolean | Whether the request was received. |