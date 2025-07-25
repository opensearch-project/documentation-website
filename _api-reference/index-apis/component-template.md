---
layout: default
title: Create or update component template
parent: Index APIs
nav_order: 29
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/component-template/
---

# Create or update component template

You can use the Component Template API to create or update a component template. A component template is a reusable building block that defines settings, mappings, and aliases that can be shared across multiple index templates. 

An index template can be constructed using multiple component templates. To incorporate a component template into an index template, you need to list it in the `composed_of` section of the index template. Component templates are only applied to newly created data streams and indexes that match the criteria specified in the index template.

If any settings or mappings are directly defined in the index template or the index creation request, those settings will take precedence over the settings or mappings specified in a component template.

Component templates are used solely during the process of index creation. For data streams, this includes the creation of the data stream itself and the creation of the backing indexes that support the stream. Modifications made to component templates will not affect existing indexes, including the backing indexes of a data stream.

## Path and HTTP methods

The PUT method adds a component template and accepts both query parameters and a request body. The GET method retrieves information about an existing component template and accepts only query parameters:

```json
PUT _component_template/<component-template-name>
GET _component_template/<component-template-name>
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`component-template-name` | String | The name of the component template.

## Query parameters

The following optional query parameters are supported.

Parameter | Data type | Description
:--- | :--- | :---
`create` | Boolean | When true, the API cannot replace or update any existing index templates. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time for the operation to wait for a response. Default is `30s`.

## Request body fields

The following options can be used in the request body to customize the index template.


Parameter | Data type | Description
:--- | :--- | :---
`template` | Object | The template that includes the `aliases`, `mappings`, or `settings` for the index. For more information, see [#template]. Required.
`version` | Integer | The version number used to manage index templates. Version numbers are not automatically set by OpenSearch. Optional.
`_meta` | Object | The metadata that provides details about the index template. Optional.
`allow_auto_create` | Boolean | When `true`, indexes can be automatically created with this template even if the `actions.auto_create_index` is disabled. When `false`, indexes and data streams matching the template cannot be automatically created. Optional.
`deprecated` | Boolean | When `true`, the component template is deprecated. If deprecated, OpenSearch will output a warning whenever the template is referenced.


### Template

You can use the following objects with the `template` option in the request body.

#### `alias`

The name of the alias to associate with the template as a key. Required when the `template` option exists in the request body. This option supports multiple aliases.

The object body contains the following optional alias parameters.

Parameter | Data type | Description
:--- | :--- | :---
`filter` | Query DSL object | The query that limits the number of documents that the alias can access.
`index_routing` | String | The value that routes the indexing operations to a specific shard. When specified, overwrites the `routing` value for the indexing operations.
`is_hidden` | Boolean | When `true`, the alias is hidden. Default is false. All alias indexes must have matching values for this setting.
`is_write_index` | Boolean | When `true`, the index is the write index for the alias. Default is `false`.
`routing` | String | The value used to route index and search operations to a specific shard.
`search_routing` | String | The value used to write search operations to a specific shard. When specified, this option overwrites the `routing` value for the search operations.

#### `mappings`

The field mappings that exist in the index. For more information, see [Mappings and field types](https://docs.opensearch.org/latest/field-types/). Optional.

#### `settings`

Any configuration options for the index. For more information, see [Index settings](https://docs.opensearch.org/latest/install-and-configure/configuring-opensearch/index-settings/).

## Example requests

The following example requests show how to use the Component Template API.

### Create with index aliases

The following example request creates a component template including index aliases:

```json
PUT _component_template/alias_template
{
  "template": {
    "settings" : {
        "number_of_shards" : 1
    },
    "aliases" : {
        "alias1" : {},
        "alias2" : {
            "filter" : {
                "term" : {"user.id" : "hamlet" }
            },
            "routing" : "shard-1"
        },
        "{index}-alias" : {} 
    }
  }
}
```

### Adding component versioning


The following example adds a `version` number to a component template which simplifies template management for external systems:

```json
PUT /_component_template/version_template
{
  "template": {
    "settings" : {
        "number_of_shards" : 1
    }
  },
  "version": 3
}
```
{% include copy-curl.html %}

## Adding template metadata

The following example request uses the `meta` parameter to add metadata to the index template. All metadata is stored in the cluster state.

```json
PUT /_component_template/meta_template
{
  "template": {
    "settings" : {
        "number_of_shards" : 1
    }
  },
  "_meta": {
    "description": "Where art thou",
    "serialization": {
      "class": "MyIndexTemplate",
      "id": 12
    }
  }
}
```



