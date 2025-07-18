---
layout: default
title: Get template (deprecated)
parent: Index APIs
nav_order: 96
---

Get template API is deprecated. Please use the new [get index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index-template/) API.
{: .warning}

# Get template

The get template API operation is used to retrieve one or more index templates created using the legacy `/_template` endpoint.

## Endpoints

```json
GET /_template
GET /_template/<template-name>
```

## Path parameters

The following table lists the available path parameters. All parameters are optional.

| Parameter       | Type   | Description                                                                      |
| :-------------- | :----- | :------------------------------------------------------------------------------- |
| `template-name` | String | The name of the index template to retrieve. Accepts wildcard expressions. |

## Query parameters

The following table lists the available query parameters. All parameters are optional.

| Parameter        | Type    | Description                                                                                          |
| :--------------- | :------ | :--------------------------------------------------------------------------------------------------- |
| `flat_settings`  | Boolean | If true, returns settings in flat format. Defaults to `false`.                                       |
| `local`          | Boolean | If true, the request does not retrieve the state from the cluster manager node. Defaults to `false`. |
| `cluster_manager_timeout` | Time    | Specifies the time to wait for a connection to the cluster manager node. Default is `30s`.           |

## Example request

```json
GET /_template/sample-template
```
{% include copy-curl.html %}

## Example response

```json
{
  "sample-template": {
    "order": 1,
    "index_patterns": [
      "sample-*"
    ],
    "settings": {
      "number_of_shards": "1"
    },
    "mappings": {
      "properties": {
        "timestamp": {
          "type": "date"
        }
      }
    },
    "aliases": {}
  }
}
```

## Response fields

The response object contains the following fields.

| Field            | Type             | Description                                                                    |
| ---------------- | ---------------- | ------------------------------------------------------------------------------ |
| `order`          | Integer          | The execution order of the template. Templates with higher order are applied last. |
| `index_patterns` | Array of strings | The index name patterns the template applies to.  |
| `settings`       | Object           | The index-level settings defined in the template. |
| `mappings`       | Object           | The field mappings defined for indexes that match the pattern. |
| `aliases`        | Object           | The aliases to associate with matching indexes. |

