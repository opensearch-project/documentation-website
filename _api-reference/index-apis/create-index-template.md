---
layout: default
title: Create or Update Index Template
parent: Index APIs
nav_order: 26
---

# Create or update an index template

The Create/update index template API lets you initialize indexes with predefined mappings and settings, as well as update existing index template.

## Path and HTTP methods

```
PUT _index_template/<template-name>
POST _index_template/<template-name>
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
`template-name` | String | Name of the index template.

## Query parameters

The following optional query parameters are supported:

Parameter | Type | Description
:--- | :--- | :---
`create` | Boolean | When true, the API cannot replace or update any existing index templates. Default is `false`.
`cluster_manager_timeout` | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.

## Request body options

The following options can be used in the request body to customize the index template:


Parameter | Type | Description
:--- | :--- | :---
`index_patterns` | String array | An array of wildcard expressions which match the names of data streams and indexes during template creation. Required.
`composed_of` | String array | An ordered list of component template names. These templates are merged using the order specified. For more information, see [Using multiple component templates](#using-multiple-component-templates). Optional.
`data_stream` | Object | When used, the request creates data streams and any backing indexes based on the template. This setting requires a matching index template. It can as be used with the `hidden` setting, which, when set to `true` hides the data streams backing indexes. Optional.
`_meta` | Object | The optional metadata that gives details about the index template. Optional.
`priority` | Integer | A number which determines which index templates take precedence during the creation of a new index or data stream. OpenSearch chooses the template with highest priority. When no priority is given, the template is assigned a `0`, signifying the lowest priority.  Optional.
`template` | Object | The template which includes the `aliases`, `mappings`, or `settings` for the index. For more information, see [#template]. Optional.
`version` | Integer | The version number used to manage index templates. Version numbers are not automatically set by OpenSearch. Optional.


### Template

You can use the following objects with the `template` option in the request body:

#### `alias`

The alias name as the key. Required when the `template` option exists in the request body.

The object body contains the following optional options for the alias:

Parameter | Type | Description
:--- | :--- | :---
`filter` | Query DSL object | The query that limits documents the alias can access.
`index_routing` | String | The value which routes indexing operations to a specific shard. When specified, overwrites the `routing` value for indexing operations.
`is_hidden` | Boolean | When `true`, the alias is hidden. Default is false. All indexes for the alias must have matching values for this setting.
`is_write_index` | Boolean | When `true`, the index is the [write index] for the alias. Default is `false`.
`routing` | String | The value used to route index and search operations to a specific shard.
`search_routing` | String | The value used to write specifically search operations to a specific shard. When specified, this option overwrites the `routing` value for search operations.

#### `mappings`

The field mappings that exist in the index. For more information, see [Mappings and field types](https://opensearch.org/docs/latest/field-types/). Optional.

#### `settings`

Any configuration options for the index. For more information, see [Index settings](https://opensearch.org/docs/latest/install-and-configure/configuring-opensearch/index-settings/).

## Example requests

The following examples show how to use the Create Index Template API.

### Index template with index aliases

The following example includes index aliases inside the template:

```
PUT _index_template/alias-template
{
  "index_patterns" : ["sh*"],
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
{% include copy-curl.html %}

### Using multiple matching templates

When multiple index templates match the name of a new index or data stream, the template with the highest priority is used. For example, the following two Create Template requests create index templates with different priorities: 

```
PUT /_index_template/template_one
{
  "index_patterns" : ["h*"],
  "priority" : 0,
  "template": {
    "settings" : {
      "number_of_shards" : 1,
      "number_of_replicas": 0
    },
    "mappings" : {
      "_source" : { "enabled" : false }
    }
  }
}

PUT /_index_template/template_two
{
  "index_patterns" : ["ha*"],
  "priority" : 1,
  "template": {
    "settings" : {
      "number_of_shards" : 2
    },
    "mappings" : {
      "_source" : { "enabled" : true }
    }
  }
}
```
{% include copy-curl.html %}

For indexes that start with `ha`, the `_source` is enabled. Since only `template_two` is applied, the index will have two primary shards and one replica.

Overlapping index patterns given the same priority are not allowed. An error will occur when attempting to create a template matching an existing index template at identical priorities.
{: .note}

### Adding template versioning

The following example adds a `version` number to an index template which simplifies template management for external systems:

```
PUT /_index_template/template_one
{
  "index_patterns" : ["mac", "cheese"],
  "priority" : 0,
  "template": {
    "settings" : {
        "number_of_shards" : 1
    }
  },
  "version": 1
}
```
{% include copy-curl.html %}


### Adding template metadata

The following example uses the `meta` parameter to add metadata to the index template. All metadata is stored in the cluster state:

```
PUT /_index_template/template_one
{
  "index_patterns": ["rom", "juliet"],
  "template": {
    "settings" : {
        "number_of_shards" : 2
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

### Data stream definition

Include a `data_stream` object to use an index template for data streams, as shown in the following example:

```
PUT /_index_template/template_1
{
  "index_patterns": ["logs-*"],
  "data_stream": { }
}
```

## Using multiple component templates

When using multiple component templates with the `composed_of` field, the component templates merged in the order specified, with later component template superseding earlier templates in the request body. Next, all mappings, settings, or aliases from the parent index template of the component are merged. Lastly, any configuration options added into the index requests are merged.

In the following example, an index with `h*` has two primary shards merged. If the order in the request body were reversed, the index would have one primary shard:

```
PUT /_component_template/template_with_1_shard
{
  "template": {
    "settings": {
      "index.number_of_shards": 1
    }
  }
}

PUT /_component_template/template_with_2_shards
{
  "template": {
    "settings": {
      "index.number_of_shards": 2
    }
  }
}

PUT /_index_template/template_1
{
  "index_patterns": ["h*"],
  "composed_of": ["template_with_1_shard", "template_with_2_shards"]
}
```
{% include copy-curl.html %}


Recurse merging is used for mapping definition and root options such as `dynamic_templates` and `meta`, meaning that one an earlier component contains a `meta` block, then new `meta` entries are added to the end of metadata in the index. Any entries with the same key that already exist are overwritten.


