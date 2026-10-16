---
layout: default
title: Get index template
parent: Index templates
grand_parent: Index APIs
nav_order: 30
---

# Get Index Template API
**Introduced 1.0**
{: .label .label-purple }

The Get Index Template API returns information about one or more index templates.

## Endpoints

```json
GET /_index_template
GET /_index_template/{template-name}
HEAD /_index_template/{template-name}
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`template-name` | String | The name of the index template to return. Supports wildcard expressions (`*`). Comma-separated lists of names are not supported. If omitted, all index templates are returned.

## Query parameters

The following optional query parameters are supported.

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.

## Example requests

The following request creates an index template named `hotels-template` for indexes whose names start with `hotels-`:

```json
PUT /_index_template/hotels-template
{
  "index_patterns": ["hotels-*"],
  "priority": 50,
  "version": 1,
  "template": {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "name": { "type": "text" },
        "city": { "type": "keyword" },
        "rating": { "type": "float" }
      }
    },
    "aliases": {
      "hotels": {}
    }
  },
  "_meta": {
    "description": "Template for hotel listing indexes"
  }
}
```
{% include copy-curl.html %}

The following example request gets information about an index template by using a wildcard expression. If no index template matches the specified name, the API returns a `404` status code:

<!-- spec_insert_start
component: example_code
rest: GET /_index_template/h*
-->
{% capture step1_rest %}
GET /_index_template/h*
{% endcapture %}

{% capture step1_python %}


response = client.indices.get_index_template(
  name = "h*"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The following example request gets information about all index templates:

<!-- spec_insert_start
component: example_code
rest: GET /_index_template
-->
{% capture step1_rest %}
GET /_index_template
{% endcapture %}

{% capture step1_python %}

response = client.indices.get_index_template()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following response is returned for the `GET /_index_template/h*` request:

```json
{
  "index_templates": [
    {
      "name": "hotels-template",
      "index_template": {
        "index_patterns": [
          "hotels-*"
        ],
        "template": {
          "settings": {
            "index": {
              "number_of_shards": "1",
              "number_of_replicas": "1"
            }
          },
          "mappings": {
            "properties": {
              "city": {
                "type": "keyword"
              },
              "name": {
                "type": "text"
              },
              "rating": {
                "type": "float"
              }
            }
          },
          "aliases": {
            "hotels": {}
          }
        },
        "composed_of": [],
        "priority": 50,
        "version": 1,
        "_meta": {
          "description": "Template for hotel listing indexes"
        }
      }
    }
  ]
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`index_templates` | Array of objects | The index templates that match the request. Each object in the array contains the `name` and `index_template` fields.

Each object in the `index_templates` array contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`name` | String | The name of the index template.
`index_template` | Object | The index template definition.

The `index_template` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`index_patterns` | Array of strings | The index name patterns to which the template applies.
`template` | Object | The settings, mappings, and aliases applied to matching indexes. Contains the `settings`, `mappings`, and `aliases` objects. Only the objects defined in the template are returned. Returned only if set.
`composed_of` | Array of strings | The names of the component templates used to compose this index template. Returned only if set. May be empty.
`priority` | Integer | The priority of the template. When multiple templates match an index, the template with the highest priority is applied. Returned only if set.
`version` | Integer | The version number of the template. Returned only if set.
`_meta` | Object | Custom metadata stored with the template. Returned only if set.
`data_stream` | Object | The data stream configuration, such as the `timestamp_field`. Returned only if the template creates data streams.
`context` | Object | The context used to apply additional settings to matching indexes. Returned only if set.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/index_template/get`.
