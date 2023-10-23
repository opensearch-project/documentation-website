---
layout: default
title: Delete Script
parent: Script APIs
nav_order: 4
---

# Delete script
**Introduced 1.0**
{: .label .label-purple }

Deletes a stored script

## Path parameters

Path parameters are optional. 

| Parameter | Data type | Description | 
:--- | :--- | :---
| script-id | String | ID of script to delete. |

## Query parameters

| Parameter | Data type | Description | 
:--- | :--- | :---
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the cluster manager. Optional, defaults to `30s`. |
| timeout | Time | The period of time to wait for a response. If a response is not received before the timeout value, the request will be dropped.

#### Example request

The following request deletes the `my-first-script` script:

````json
DELETE _scripts/my-script
````
{% include copy-curl.html %}

#### Example response

The `DELETE _scripts/my-first-script` request returns the following field:

````json
{
  "acknowledged" : true
}
````

To determine whether the stored script was successfully deleted, use the [Get stored script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-stored-script/) API, passing the script name as the `script` path parameter.

## Response fields

The <HTTP METHOD> <endpoint> request returns the following response fields:

| Field | Data type | Description | 
:--- | :--- | :---
| acknowledged | Boolean | Whether the delete script request was received. |