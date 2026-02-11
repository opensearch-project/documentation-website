---
layout: default
title: Create or update index template
parent: Index templates
grand_parent: Index APIs
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/create-index-template/
---

# Create Or Update Index Template API

You can use the Create or Update Index Template API to create indexes with predefined mappings and settings as well as update existing index templates.

## Endpoints

```json
PUT _index_template/<template-name>
POST _index_template/<template-name>
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`template-name` | String | The name of the index template.

## Query parameters

The following optional query parameters are supported.

Parameter | Data type | Description
:--- | :--- | :---
`create` | Boolean | When true, the API cannot replace or update any existing index templates. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.

## Request body fields

The following options can be used in the request body to customize the index template.


Parameter | Type | Description
:--- | :--- | :---
`index_patterns` | String array | An array of wildcard expressions that match the names of data streams and indexes created during template creation. Required.
`composed_of` | String array | An ordered list of component template names. These templates are merged using the specified order. For more information, see [Using multiple component templates](#using-multiple-component-templates). Optional.
`data_stream` | Object | When used, the request creates data streams and any backing indexes based on the template. This setting requires a matching index template. It can also be used with the `hidden` setting, which, when set to `true`, hides the data stream backing indexes. Optional.
`_meta` | Object | Optional metadata that provides details about the index template. Optional.
`priority` | Integer | A number that determines which index templates take precedence during the creation of a new index or data stream. OpenSearch chooses the template with the highest priority. When no priority is given, the template is assigned a `0`, signifying the lowest priority. Optional.
`template` | Object | The template that includes the `aliases`, `mappings`, or `settings` for the index. For more information, see [#template]. Optional.
`version` | Integer | The version number used to manage index templates. Version numbers are not automatically set by OpenSearch. Optional.
`context` | Object | (Experimental) The `context` parameter provides use-case-specific predefined templates that can be applied to an index. Among all settings and mappings declared for a template, context templates hold the highest priority. For more information, see [index-context]({{site.url}}{{site.baseurl}}/im-plugin/index-context/).

### Template

You can use the following objects with the `template` option in the request body.

#### `alias`

The name of the alias to associate with the template as a key. Required when the `template` option exists in the request body. This option supports multiple aliases.

The object body contains the following optional alias parameters.

Parameter | Data type | Description
:--- | :--- | :---
`filter` | Query DSL object | The query that limits the number of documents that the alias can access.
`index_routing` | String | The value that routes indexing operations to a specific shard. When specified, overwrites the `routing` value for indexing operations.
`is_hidden` | Boolean | When `true`, the alias is hidden. Default is `false`. All alias indexes must have matching values for this setting.
`is_write_index` | Boolean | When `true`, the index is the write index for the alias. Default is `false`.
`routing` | String | The value used to route index and search operations to a specific shard.
`search_routing` | String | The value used to write specific search operations to a specific shard. When specified, this option overwrites the `routing` value for search operations.

#### `mappings`

The field mappings that exist in the index. For more information, see [Mappings and field types]({{site.url}}{{site.baseurl}}/mappings/). Optional.

#### `settings`

Any configuration options for the index. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

## Example requests

The following examples show how to use the Create or Update Index Template API.

### Index template with index aliases

The following example request includes index aliases in the template:

<!-- spec_insert_start
component: example_code
rest: PUT /_index_template/alias-template
body: |
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
-->
{% capture step1_rest %}
PUT /_index_template/alias-template
{
  "index_patterns": [
    "sh*"
  ],
  "template": {
    "settings": {
      "number_of_shards": 1
    },
    "aliases": {
      "alias1": {},
      "alias2": {
        "filter": {
          "term": {
            "user.id": "hamlet"
          }
        },
        "routing": "shard-1"
      },
      "{index}-alias": {}
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_index_template(
  name = "alias-template",
  body =   {
    "index_patterns": [
      "sh*"
    ],
    "template": {
      "settings": {
        "number_of_shards": 1
      },
      "aliases": {
        "alias1": {},
        "alias2": {
          "filter": {
            "term": {
              "user.id": "hamlet"
            }
          },
          "routing": "shard-1"
        },
        "{index}-alias": {}
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Using multiple matching templates

When multiple index templates match the name of a new index or data stream, the template with the highest priority is used. For example, the following two requests create index templates with different priorities: 

```json
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

For indexes that start with `ha`, the `_source` is enabled. Because only `template_two` is applied, the index will have two primary shards and one replica.

Overlapping index patterns given the same priority are not allowed. An error will occur when attempting to create a template matching an existing index template with identical priorities.
{: .note}

### Adding template versioning

The following example request adds a `version` number to an index template, which simplifies template management for external systems:

<!-- spec_insert_start
component: example_code
rest: PUT /_index_template/template_one
body: |
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
-->
{% capture step1_rest %}
PUT /_index_template/template_one
{
  "index_patterns": [
    "mac",
    "cheese"
  ],
  "priority": 0,
  "template": {
    "settings": {
      "number_of_shards": 1
    }
  },
  "version": 1
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_index_template(
  name = "template_one",
  body =   {
    "index_patterns": [
      "mac",
      "cheese"
    ],
    "priority": 0,
    "template": {
      "settings": {
        "number_of_shards": 1
      }
    },
    "version": 1
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


### Adding template metadata

The following example request uses the `meta` parameter to add metadata to the index template. All metadata is stored in the cluster state:

<!-- spec_insert_start
component: example_code
rest: PUT /_index_template/template_one
body: |
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
-->
{% capture step1_rest %}
PUT /_index_template/template_one
{
  "index_patterns": [
    "rom",
    "juliet"
  ],
  "template": {
    "settings": {
      "number_of_shards": 2
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
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_index_template(
  name = "template_one",
  body =   {
    "index_patterns": [
      "rom",
      "juliet"
    ],
    "template": {
      "settings": {
        "number_of_shards": 2
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
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Data stream definition

Include a `data_stream` object to use an index template for data streams, as shown in the following example request:

<!-- spec_insert_start
component: example_code
rest: PUT /_index_template/template_1
body: |
{
  "index_patterns": ["logs-*"],
  "data_stream": { }
}
-->
{% capture step1_rest %}
PUT /_index_template/template_1
{
  "index_patterns": [
    "logs-*"
  ],
  "data_stream": {}
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_index_template(
  name = "template_1",
  body =   {
    "index_patterns": [
      "logs-*"
    ],
    "data_stream": {}
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Using multiple component templates

When using multiple component templates with the `composed_of` field, the component templates are merged in the specified order. Next, all mappings, settings, and aliases from the parent index template of the component are merged. Lastly, any configuration options added to the index requests are merged.

In the following example request, an index with `h*` has two merged primary shards. If the order in the request body were reversed, then the index would have one primary shard:

```json
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


Recursive merging is used for mapping definition and root options such as `dynamic_templates` and `meta`, meaning that when an earlier component contains a `meta` block, new `meta` entries are added to the end of the metadata in the index. Any entries containing a preexisting key are overwritten.


