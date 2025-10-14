---
layout: default
title: Get template (deprecated)
parent: Index APIs
nav_order: 96
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/get-template-legacy/
---

# Get template

The Get Template API has been deprecated. Use the new [Get Index Template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index-template/) API.
{: .warning}

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
| `flat_settings`  | Boolean | If true, returns settings in flat format. Default is `false`.                                       |
| `local`          | Boolean | If true, the request does not retrieve the state from the cluster manager node. Default is `false`. |
| `cluster_manager_timeout` | Time    | Specifies how long to wait for a connection to the cluster manager node. Default is `30s`.           |

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
| `order`          | Integer          | An integer that determines the priority of the template when multiple templates match an index. Templates with a higher order value have higher precedence and are applied after lower-order templates, allowing them to override conflicting settings or mappings. |
| `index_patterns` | Array of strings | The list of index name patterns to which the template applies.  |
| `settings`       | Object           | The index-level settings defined in the template. |
| `mappings`       | Object           | The field mappings defined for indexes that match the pattern. |
| `aliases`        | Object           | The aliases to associate with matching indexes. |

