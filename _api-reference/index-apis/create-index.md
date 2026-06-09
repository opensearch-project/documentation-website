---
layout: default
title: Create index
parent: Core index APIs
grand_parent: Index APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/index-apis/create-index/
  - /opensearch/rest-api/create-index/
---

# Create Index API
**Introduced 1.0**
{: .label .label-purple }

The Create Index API creates a new index in an OpenSearch cluster.

You can use the Create Index API to specify the following index configurations:

- Index settings that control the index behavior, such as the number of shards and replicas.
- Field mappings that define the data types and properties for fields in documents stored in the index.
- Index aliases that provide alternate names for querying the index.

<!-- spec_insert_start
api: indices.create
component: endpoints
-->
## Endpoints
```json
PUT /{index}
```
<!-- spec_insert_end -->

## Index naming restrictions

OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

<!-- spec_insert_start
api: indices.create
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the index you wish to create. |

<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a connection to the cluster manager node. |
| `timeout` | String | The amount of time to wait for a response. If no response is received before the timeout expires, the request fails and returns an error. |
| `wait_for_active_shards` | Integer or String or NULL or String | The number of shard copies that must be active before proceeding with the operation.  Set to `all` or any positive integer up to the total number of shards in the index (`number_of_replicas+1`). <br> Valid values are: <br> - `all`: Wait for all shards to be active. |

## Request body fields

You can include the following request body fields to configure the new index. All request body fields are optional.

Field | Data type | Description
:--- | :--- | :---
`settings` | Object | Index-level settings for the index. For a list of index settings, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/). Optional.
`settings.index.number_of_shards` | Integer | The number of primary shards in the index. Default is `1`. Optional.
`settings.index.number_of_replicas` | Integer | The number of replica shards for each primary shard. Default is `1`. Optional.
`settings.number_of_shards` | Integer | Simplified syntax for specifying the number of primary shards without the `index` prefix. Optional.
`settings.number_of_replicas` | Integer | Simplified syntax for specifying the number of replica shards without the `index` prefix. Optional.
`mappings` | Object | Field mappings for documents in the index. Defines the data type and properties for each field. For more information, see [Mappings]({{site.url}}{{site.baseurl}}/field-types/). Optional.
`mappings.properties` | Object | Defines the fields and their data types in documents. Each key is a field name, and each value is a field definition object. Optional.
`aliases` | Object | Index aliases for the index. Each key is an alias name, and each value is an alias definition object. For more information, see [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/). Optional.

**Note**: You do not have to explicitly specify the `index` section inside the `settings` section. You can use the simplified syntax instead.
{: .note}

## Example: Creating a basic index

You typically do not need to explicitly create an empty index. OpenSearch automatically creates an index when you index a document into a non-existent index. However, explicitly creating an index is useful when you want to configure specific settings, mappings, or aliases before indexing data.

The following example request creates an index named `sample-index` without any settings, mappings, or aliases:

<!-- spec_insert_start
component: example_code
rest: PUT /sample-index
body: {}
-->
{% capture step1_rest %}
PUT /sample-index
{}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "sample-index",
  body =   {}
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Creating an index with settings

The following example request creates an index named `books` with specific settings for the number of shards and replicas:

<!-- spec_insert_start
component: example_code
rest: PUT /books
body: |
{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  }
}
-->
{% capture step1_rest %}
PUT /books
{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "books",
  body =   {
    "settings": {
      "index": {
        "number_of_shards": 2,
        "number_of_replicas": 1
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Creating an index with simplified settings

The following example request creates an index named `books-simplified` using the simplified settings syntax without the `index` prefix:

<!-- spec_insert_start
component: example_code
rest: PUT /books-simplified
body: |
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 1
  }
}
-->
{% capture step1_rest %}
PUT /books-simplified
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 1
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "books-simplified",
  body =   {
    "settings": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Creating an index with mappings

The following example request creates an index named `employees` with field mappings:

<!-- spec_insert_start
component: example_code
rest: PUT /employees
body: |
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "age": {
        "type": "integer"
      },
      "department": {
        "type": "keyword"
      }
    }
  }
}
-->
{% capture step1_rest %}
PUT /employees
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "age": {
        "type": "integer"
      },
      "department": {
        "type": "keyword"
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "employees",
  body =   {
    "mappings": {
      "properties": {
        "name": {
          "type": "text"
        },
        "age": {
          "type": "integer"
        },
        "department": {
          "type": "keyword"
        }
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Creating an index with aliases

The following example request creates an index named `orders` with two aliases, including a filtered alias:

<!-- spec_insert_start
component: example_code
rest: PUT /orders
body: |
{
  "aliases": {
    "current-orders": {},
    "recent-orders": {
      "filter": {
        "range": {
          "timestamp": {
            "gte": "now-7d"
          }
        }
      }
    }
  }
}
-->
{% capture step1_rest %}
PUT /orders
{
  "aliases": {
    "current-orders": {},
    "recent-orders": {
      "filter": {
        "range": {
          "timestamp": {
            "gte": "now-7d"
          }
        }
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "orders",
  body =   {
    "aliases": {
      "current-orders": {},
      "recent-orders": {
        "filter": {
          "range": {
            "timestamp": {
              "gte": "now-7d"
            }
          }
        }
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

OpenSearch returns the following response when the create index request is successful:

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "books"
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`acknowledged` | Boolean | Indicates whether the index was successfully created in the cluster. A value of `true` means the cluster state was successfully updated with the new index. A value of `false` means the request timed out before the cluster state was updated, but the index will likely be created.
`shards_acknowledged` | Boolean | Indicates whether the number of shard copies specified by the `wait_for_active_shards` setting became active before the operation timed out. A value of `true` means the target number of shard copies became active. A value of `false` means that the operation timed out before the target number of shard copies became active, regardless of whether the cluster state was successfully updated (that is, `acknowledged` is `true`).
`index` | String | The name of the newly created index.

## Wait for active shards

By default, the create index operation returns a response to the client only after the primary copies of each shard have been started or the request times out. You can use the response fields to understand the result of the operation.

The `acknowledged` field indicates whether the index was successfully created in the cluster state. The `shards_acknowledged` field indicates whether the target number of shard copies became active before the timeout. Both fields can be `false` if the operation times out, but the index creation may still succeed.

If `acknowledged` is `false`, the cluster state update timed out, but the index will likely be created soon. If `shards_acknowledged` is `false`, the target number of shard copies did not become active before the timeout, regardless of whether the cluster state was updated successfully.

You can change the default behavior of waiting only for primary shards to start by using one of the following methods:

- Set the `index.write.wait_for_active_shards` index setting when creating the index. This setting also affects the `wait_for_active_shards` behavior for subsequent write operations.
- Use the `wait_for_active_shards` query parameter in the create index request.

### Example: Using the index.write.wait_for_active_shards setting

The following example request creates an index with the `index.write.wait_for_active_shards` setting, which waits for two shard copies to be active before returning. This setting also affects subsequent write operations on the index:

<!-- spec_insert_start
component: example_code
rest: PUT /inventory
body: |
{
  "settings": {
    "index.write.wait_for_active_shards": "2",
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
-->
{% capture step1_rest %}
PUT /inventory
{
  "settings": {
    "index.write.wait_for_active_shards": "2",
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "inventory",
  body =   {
    "settings": {
      "index.write.wait_for_active_shards": "2",
      "number_of_shards": 1,
      "number_of_replicas": 1
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Example: Using the wait_for_active_shards query parameter

The following example request creates an index and uses the `wait_for_active_shards` query parameter to wait for two shard copies (primary and one replica) to be active before returning:

<!-- spec_insert_start
component: example_code
rest: PUT /catalog?wait_for_active_shards=2
body: |
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
-->
{% capture step1_rest %}
PUT /catalog?wait_for_active_shards=2
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "catalog",
  params = { "wait_for_active_shards": "2" },
  body =   {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
