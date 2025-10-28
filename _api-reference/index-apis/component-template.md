---
layout: default
title: Component template APIs
parent: Index templates
grand_parent: Index APIs
nav_order: 60
---

# Component template APIs

You can use the Component Template APIs to create, retrieve, update, and delete component templates. A component template is a reusable building block that defines settings, mappings, and aliases that can be shared across multiple index templates. 

An index template can be constructed using multiple component templates. To incorporate a component template into an index template, you need to list it in the `composed_of` section of the index template. Component templates are only applied to newly created data streams and indexes that match the criteria specified in the index template.

If any settings or mappings are directly defined in the index template or the index creation request, those settings will take precedence over the settings or mappings specified in a component template.

Component templates are used solely during the process of index creation. For data streams, this includes the creation of the data stream itself and the creation of the backing indexes that support the stream. Modifications made to component templates will not affect existing indexes, including the backing indexes of a data stream.

## Endpoints

```json
PUT _component_template/<component-template-name>
GET _component_template/<component-template-name>
DELETE _component_template/<component-template-name>
HEAD _component_template/<component-template-name>
```

- `PUT`: Creates or updates a component template. Accepts both query parameters and a request body.
- `GET`: Retrieves information about an existing component template. Accepts only query parameters.
- `DELETE`: Deletes an existing component template. Accepts only query parameters.
- `HEAD`: Returns whether a component template exists. Returns only HTTP status codes.

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`component-template-name` | String | The name of the component template. Required for PUT, HEAD, and DELETE operations. Optional for GET operations.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description | Supported operations
:--- | :--- | :--- | :---
`create` | Boolean | When true, the API cannot replace or update any existing component templates. Default is `false`. | PUT
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`. | PUT, GET, DELETE

## Create or update a component template

Use the PUT operation to create a new component template or update an existing one.

### Endpoints

```json
PUT _component_template/<component-template-name>
```

### Request body fields

The following table lists the available request body fields.


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

The field mappings that exist in the index. For more information, see [Mappings and field types]({{site.url}}{{site.baseurl}}/mappings/). Optional.

#### `settings`

Any configuration options for the index. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

### Example request: Create a component template with index aliases

The following example request creates a component template including index aliases:

<!-- spec_insert_start
component: example_code
rest: PUT /_component_template/alias_template
body: |
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
-->
{% capture step1_rest %}
PUT /_component_template/alias_template
{
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


response = client.cluster.put_component_template(
  name = "alias_template",
  body =   {
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

### Example request: Add component versioning

The following example adds a `version` number to a component template which simplifies template management for external systems:

<!-- spec_insert_start
component: example_code
rest: PUT /_component_template/version_template
body: |
{
  "template": {
    "settings" : {
        "number_of_shards" : 1
    }
  },
  "version": 3
}
-->
{% capture step1_rest %}
PUT /_component_template/version_template
{
  "template": {
    "settings": {
      "number_of_shards": 1
    }
  },
  "version": 3
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_component_template(
  name = "version_template",
  body =   {
    "template": {
      "settings": {
        "number_of_shards": 1
      }
    },
    "version": 3
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Example request: Add template metadata

The following example request uses the `_meta` parameter to add metadata to the component template. All metadata is stored in the cluster state.

<!-- spec_insert_start
component: example_code
rest: PUT /_component_template/meta_template
body: |
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
-->
{% capture step1_rest %}
PUT /_component_template/meta_template
{
  "template": {
    "settings": {
      "number_of_shards": 1
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


response = client.cluster.put_component_template(
  name = "meta_template",
  body =   {
    "template": {
      "settings": {
        "number_of_shards": 1
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

## Retrieve component template

Use the GET operation to retrieve one or more component templates and their information.

### Endpoints

```
GET /_component_template/<component-template-name>
GET /_component_template
```

### Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`component-template-name` | String | The name of the component template to retrieve. Supports wildcard expressions (`*`). If not specified, all component templates are returned.

### Example request: Retrieve a component template by name

<!-- spec_insert_start
component: example_code
rest: GET /_component_template/my_template
-->
{% capture step1_rest %}
GET /_component_template/my_template
{% endcapture %}

{% capture step1_python %}


response = client.cluster.get_component_template(
  name = "my_template"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Example request: Retrieve component templates using a wildcard pattern

<!-- spec_insert_start
component: example_code
rest: GET /_component_template/my_template*
-->
{% capture step1_rest %}
GET /_component_template/my_template*
{% endcapture %}

{% capture step1_python %}


response = client.cluster.get_component_template(
  name = "my_template*"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Example request: Retrieveall component templates

<!-- spec_insert_start
component: example_code
rest: GET /_component_template
-->
{% capture step1_rest %}
GET /_component_template
{% endcapture %}

{% capture step1_python %}

response = client.cluster.get_component_template()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Delete component template

Use the DELETE operation to remove a component template from the cluster.

**Important considerations:**
- Deleting a component template does not affect existing indexes that were created using the template.
- You cannot delete a component template that is currently referenced by an index template.
- The operation is irreversible.

### Endpoints

```
DELETE _component_template/<component-template-name>
```

### Example request

<!-- spec_insert_start
component: example_code
rest: DELETE /_component_template/my_template
-->
{% capture step1_rest %}
DELETE /_component_template/my_template
{% endcapture %}

{% capture step1_python %}


response = client.cluster.delete_component_template(
  name = "my_template"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Check if component template exists

Use the HEAD operation to check whether a component template exists without retrieving its contents. This operation returns only HTTP status codes and headers, with no response body.

### Endpoints

```
HEAD _component_template/<component-template-name>
```

### Example request

<!-- spec_insert_start
component: example_code
rest: HEAD /_component_template/my_template
-->
{% capture step1_rest %}
HEAD /_component_template/my_template
{% endcapture %}

{% capture step1_python %}


response = client.cluster.exists_component_template(
  name = "my_template"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Response codes

- `200`: The component template exists.
- `404`: The component template does not exist.
