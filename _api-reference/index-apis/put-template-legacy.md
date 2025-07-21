---
layout: default
title: Put template (deprecated)
parent: Index APIs
nav_order: 107
---

Put Template API is deprecated. Use the new [Create or Update Index Template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index-template/) API.
{: .warning}

# Put template

The put template API operation is used to create or update an index template. Templates define settings, mappings, and aliases applied automatically when a matching index is created.

## Endpoints

```json
PUT /_template/<template-name>
```

## Path parameters

All path parameters are required.

| Parameter       | Type   | Description                                     |
| :-------------- | :----- | :---------------------------------------------- |
| `template-name` | String | The name of the index template to create or update. |

## Query parameters

All query parameters are optional.

| Parameter        | Type    | Description                                                                                                       |
| :--------------- | :------ | :---------------------------------------------------------------------------------------------------------------- |
| `order`          | Integer | The order in which to apply the template if multiple templates match. Higher values are applied last. Default is `0`. |
| `create`         | Boolean | If `true`, the operation will fail if a template with the same name already exists. Default is `false`.             |
| `cluster_manager_timeout` | Time    | The time to wait for connection to the cluster manager node. Default is `30s`.                                        |

## Request body

The request body must define one or more of the following components.

| Field            | Type   | Description                                                          |
| :--------------- | :----- | :------------------------------------------------------------------- |
| `index_patterns` | Array  | The list of index name patterns to which the template applies. Required. |
| `settings`       | Object | The index settings to apply to matching indexes.                         |
| `mappings`       | Object | The mappings for fields in the index.                                    |
| `aliases`        | Object | The aliases to assign to matching indexes.                               |
| `version`        | Integer          | The optional version number to identify the template.                   |

## Example request

```json
PUT /_template/logs_template
{
  "index_patterns": ["logs-*"],
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "@timestamp": { "type": "date" },
      "message": { "type": "text" }
    }
  },
  "aliases": {
    "logs": {}
  }
}
```

{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```
