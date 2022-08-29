---
layout: default
title: Get Stored Script
parent: Script APIs
grand_parent: REST API reference
nav_order: 3
---

## Get stored script

Retrieves a stored script.

### Path parameters

| Parameter | Data Type | Description | 
:--- | :--- | :---
| script | String | Stored script or search template name. Required.|

### Query parameters

| Parameter | Data Type | Description | 
:--- | :--- | :---
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the master node. Optional, defaults to `30s`. |

#### Sample request

The following retrieves the `my-script` stored script.

````json
GET _scripts/my-script
````

#### Sample response

The `GET _scripts/my-script` request returns the following fields:

````json
{
  "_id" : "my-script",
  "found" : true,
  "script" : {
    "lang" : "painless",
    "source" : "Math.log(_score * 2) + params['my_modifier']"
  }
}
````

### Response fields

The `GET _scripts/my-script` request returns the following response fields:

| Field | Data Type | Description | 
:--- | :--- | :---
| _id | String | The script's name. |
| found | Boolean | The requested script exists and was retrieved. |
| script | Object | The script definition. See [Script object](#script-object).  |

#### Script object

| Field | Data Type | Description | 
:--- | :--- | :---
| lang | String | The script's language. |
|  source | String | The script's body. |