---
layout: default
title: Create or update index template
parent: Index templates
grand_parent: Index APIs
nav_order: 10
---

# Create Or Update Index Template API
**Introduced 1.0**
{: .label .label-purple }

Use the Create or Update Index Template API to create indexes with predefined mappings and settings as well as update existing index templates.

## Endpoints

```json
PUT _index_template/{template-name}
POST _index_template/{template-name}
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
`cause` | String | The reason for creating or updating the index template. Default is `api`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.

## Request body fields

The following options can be used in the request body to customize the index template.


Parameter | Type | Description
:--- | :--- | :---
`index_patterns` | String array | An array of wildcard expressions used to match the names of data streams and indexes when they are created. Required.
`composed_of` | String array | An ordered list of component template names. These templates are merged using the specified order. For more information, see [Using multiple component templates](#using-multiple-component-templates). Optional.
`data_stream` | Object | When specified, the index template becomes a data stream template, and data streams with matching names can be created using it. The data stream backing indexes are always hidden. The object can contain a `timestamp_field` object, whose `name` field specifies the timestamp field for the data stream. Default `name` is `@timestamp`. Optional.
`_meta` | Object | Optional metadata that provides details about the index template. Optional.
`priority` | Long | A number that determines which index templates take precedence during the creation of a new index or data stream. OpenSearch chooses the template with the highest priority. When no priority is given, the template is assigned a `0`, signifying the lowest priority. Must be `0` or greater. Index templates with overlapping index patterns cannot have the same priority. Optional.
`template` | Object | The template that includes the `aliases`, `mappings`, or `settings` for the index. For more information, see [Template](#template). Optional.
`version` | Long | The version number used to manage index templates. Version numbers are not automatically set by OpenSearch. Optional.
`context` | Object | (Experimental) The `context` parameter provides use-case-specific predefined templates that can be applied to an index. Among all settings and mappings declared for a template, context templates hold the highest priority. Requires the `cluster.application_templates.enabled` setting to be `true`. The object contains the `name` (String, required) of the context, the context template `version` (String, default `_latest`), and optional `params` (Object). For more information, see [Index context]({{site.url}}{{site.baseurl}}/im-plugin/index-context/). Optional.

### Template

You can use the following objects with the `template` option in the request body.

#### `aliases`

The name of the alias to associate with the template as a key. This option supports multiple aliases. The alias name can include `{index}`, which is replaced with the name of the index when the index is created.

The object body contains the following optional alias parameters.

Parameter | Data type | Description
:--- | :--- | :---
`filter` | Query DSL object | The query that limits the number of documents that the alias can access.
`index_routing` | String | The value that routes indexing operations to a specific shard. When specified, overwrites the `routing` value for indexing operations.
`is_hidden` | Boolean | When `true`, the alias is hidden. Default is `false`. All alias indexes must have matching values for this setting.
`is_write_index` | Boolean | When `true`, the index is the write index for the alias. Default is `false`.
`routing` | String | The value used to route index and search operations to a specific shard.
`search_routing` | String | The value used to route search operations to a specific shard. When specified, this option overwrites the `routing` value for search operations.

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

When multiple index templates match the name of a new index or data stream, the template with the highest priority is used. For example, the following two requests create index templates with different priorities.

The first request creates a template with priority `0` that matches index names starting with `h`:

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
```
{% include copy-curl.html %}

The second request creates a template with priority `1` that matches the narrower set of index names starting with `ha`:

```json
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
rest: PUT /_index_template/versioned-template
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
PUT /_index_template/versioned-template
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
  name = "versioned-template",
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

The following example request uses the `_meta` parameter to add metadata to the index template. All metadata is stored in the cluster state:

<!-- spec_insert_start
component: example_code
rest: PUT /_index_template/metadata-template
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
PUT /_index_template/metadata-template
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
  name = "metadata-template",
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
rest: PUT /_index_template/logs-template
body: |
{
  "index_patterns": ["logs-*"],
  "data_stream": { }
}
-->
{% capture step1_rest %}
PUT /_index_template/logs-template
{
  "index_patterns": [
    "logs-*"
  ],
  "data_stream": {}
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_index_template(
  name = "logs-template",
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

When using multiple component templates with the `composed_of` field, the component templates are merged in the specified order. The settings, mappings, and aliases in the index template's own `template` object are merged after the component templates and override them. Settings specified in the create index request override both.

In the following example, an index matching `my-index-*` has two merged primary shards. If the order in the `composed_of` array were reversed, then the index would have one primary shard.

First, create a component template that sets one primary shard:

```json
PUT /_component_template/template_with_1_shard
{
  "template": {
    "settings": {
      "index.number_of_shards": 1
    }
  }
}
```
{% include copy-curl.html %}

Next, create a component template that sets two primary shards:

```json
PUT /_component_template/template_with_2_shards
{
  "template": {
    "settings": {
      "index.number_of_shards": 2
    }
  }
}
```
{% include copy-curl.html %}

Finally, create an index template that composes both component templates in order:

```json
PUT /_index_template/composed-template
{
  "index_patterns": ["my-index-*"],
  "composed_of": ["template_with_1_shard", "template_with_2_shards"]
}
```
{% include copy-curl.html %}


Recursive merging is used for mapping definition and root options such as `dynamic_templates` and `meta`, meaning that when an earlier component contains a `meta` block, new `meta` entries are added to the end of the metadata in the index. Any entries containing a preexisting key are overwritten.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/index_template/put`.
