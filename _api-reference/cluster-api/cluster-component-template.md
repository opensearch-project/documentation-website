---
layout: default
title: Cluster component template
nav_order: 25
parent: Cluster APIs
---

# Cluster component template
**Introduced 1.0**
{: .label .label-purple }

The Cluster component template APIs creates and updates the cluster's component templates

# Endpoints

The `GET` method returns one or more component templates:

<!-- spec_insert_start
api: cluster.get_component_template
component: endpoints
omit_header: true
-->
```json
GET /_component_template
GET /_component_template/{name}
```
<!-- spec_insert_end -->

The `EXISTS` method returns information about whether a component template exists:

<!-- spec_insert_start
api: cluster.exists_component_template
component: endpoints
omit_header: true
-->
```json
HEAD /_component_template/{name}
```
<!-- spec_insert_end -->

The `PUT` method creates or updates a component template:

<!-- spec_insert_start
api: cluster.put_component_template
component: endpoints
omit_header: true
-->
```json
POST /_component_template/{name}
PUT  /_component_template/{name}
```
<!-- spec_insert_end -->

The `DELETE` method deletes a component template:

<!-- spec_insert_start
api: cluster.delete_component_template
component: endpoints
omit_header: true
-->
```json
DELETE /_component_template/{name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.put_component_template
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | The name of the component template to create. OpenSearch includes the following built-in component templates: `logs-mappings`; `logs-settings`; `metrics-mappings`; `metrics-settings`; `synthetics-mapping`; `synthetics-settings`. OpenSearch uses these templates to configure backing indexes for its data streams. If you want to overwrite one of these templates, set the replacement template `version` to a higher value than the current version. If you want to disable all built-in component and index templates, set `stack.templates.enabled` to `false` using the Cluster Update Settings API. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.put_component_template
columns: Parameter, Data type, Description, Default
include_deprecated: false
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |
| `create` | Boolean | When `true`, this request cannot replace or update existing component templates. | `false` |
| `timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |

<!-- spec_insert_end -->

## Example request

```json
POST /_component_template/logs_template
{
  "template": {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "timestamp": {
          "type": "date"
        },
        "message": {
          "type": "text"
        },
        "level": {
          "type": "keyword"
        },
        "service": {
          "type": "keyword"
        }
      }
    },
    "aliases": {
      "logs_alias": {}
    }
  },
  "version": 1,
  "meta": {
    "description": "Component template for log data"
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
