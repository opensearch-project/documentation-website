---
layout: default
title: Get Stored Script
parent: Script APIs
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
| master_timeout | Time | Amount of time to wait for a connection to the master node. Optional, defaults to `30s`. |

#### Sample request

The following retrieves the `my-first-script` stored script.

````json
GET _scripts/my-first-script
````

#### Sample response

The `GET _scripts/my-first-script` request returns the following fields:

````json
{
  "_id" : "my-first-script",
  "found" : true,
  "script" : {
    "lang" : "painless",
    "source" : """
          int total = 0;
          for (int i = 0; i < doc['ratings'].length; ++i) {
            total += doc['ratings'][i];
          }
          return total;
        """
  }
}
````

### Response fields

The `GET _scripts/my-first-script` request returns the following response fields:

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