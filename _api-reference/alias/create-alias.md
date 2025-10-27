---
layout: default
title: Create or update alias
parent: Alias APIs
nav_order: 2
redirect_from:
  - /api-reference/index-apis/update-alias/
---

# Create Or Update Alias API

**Introduced 1.0**
{: .label .label-purple }

The Create or Update Alias API adds one or more indexes to an alias or updates the settings for an existing alias. For more information about aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/).

The Create or Update Alias API is distinct from the [Alias API]({{site.url}}{{site.baseurl}}/opensearch/rest-api/alias/), which supports the addition and removal of aliases and the removal of alias indexes. In contrast, the following API only supports adding or updating an alias without updating the index itself. Each API also uses different request body parameters.
{: .note}

## Endpoints

```json
POST /<target>/_alias/<alias-name>
PUT /<target>/_alias/<alias-name>
POST /_alias/<alias-name>
PUT /_alias/<alias-name>
POST /<target>/_aliases/<alias-name>
PUT /<target>/_aliases/<alias-name>
POST /_aliases/<alias-name>
PUT /_aliases/<alias-name>
PUT /<target>/_alias
PUT /<target>/_aliases
PUT /_alias
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Type | Description |
:--- | :--- | :---
| `target` | String | A comma-delimited list of indexes. Wildcard expressions (`*`) are supported. To target all indexes in a cluster, use `_all` or `*`. Optional. |
| `alias-name` | String | The alias name to be created or updated. Optional. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for a response from the cluster. Default is `30s`.

## Request body

The following table lists the available request body fields.

Field | Type | Description
:--- | :--- | :--- | :---
`index` | String | A comma-delimited list of indexes that you want to associate with the alias. If this field is set, it will override the index name specified in the URL path.
`alias` | String | The name of the alias. If this field is set, it will override the alias name specified in the URL path.
`is_write_index` | Boolean | Specifies whether the index should be a write index. An alias can only have one write index at a time. If a write request is submitted to an alias that links to multiple indexes, then OpenSearch runs the request only on the write index.
`routing` | String | Assigns a custom value to a shard for specific operations. 
`index_routing` | String | Assigns a custom value to a shard only for index operations. 
`search_routing` | String | Assigns a custom value to a shard only for search operations. 
`filter` | Object | A filter to use with the alias so that the alias points to a filtered part of the index.

## Example requests

### Add a simple alias

The following request creates a basic alias for an index:

<!-- spec_insert_start
component: example_code
rest: PUT /products-2024/_alias/current-products
-->
{% capture step1_rest %}
PUT /products-2024/_alias/current-products
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_alias(
  name = "current-products",
  index = "products-2024",
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Add a time-based alias

The following request creates an alias `quarterly-2024` for the `sales-q1-2024` index:

<!-- spec_insert_start
component: example_code
rest: PUT /sales-q1-2024/_alias/quarterly-2024
-->
{% capture step1_rest %}
PUT /sales-q1-2024/_alias/quarterly-2024
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_alias(
  name = "quarterly-2024",
  index = "sales-q1-2024",
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Add a filtered alias with routing

First, create an index with appropriate mappings:

<!-- spec_insert_start
component: example_code
rest: PUT /customer-data
body: |
{
    "mappings" : {
        "properties" : {
            "customer_id" : {"type" : "integer"},
            "region" : {"type" : "keyword"}
        }
    }
}
-->
{% capture step1_rest %}
PUT /customer-data
{
  "mappings": {
    "properties": {
      "customer_id": {
        "type": "integer"
      },
      "region": {
        "type": "keyword"
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "customer-data",
  body =   {
    "mappings": {
      "properties": {
        "customer_id": {
          "type": "integer"
        },
        "region": {
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

Then add the index alias for a specific customer with routing and filtering:

<!-- spec_insert_start
component: example_code
rest: PUT /customer-data/_alias/customer-123
body: |
{
    "routing" : "west",
    "filter" : {
        "term" : {
            "customer_id" : 123
        }
    }
}
-->
{% capture step1_rest %}
PUT /customer-data/_alias/customer-123
{
  "routing": "west",
  "filter": {
    "term": {
      "customer_id": 123
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_alias(
  name = "customer-123",
  index = "customer-data",
  body =   {
    "routing": "west",
    "filter": {
      "term": {
        "customer_id": 123
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Add an alias during index creation

You can add an alias when creating an index using the create index API:

<!-- spec_insert_start
component: example_code
rest: PUT /inventory-2024
body: |
{
    "mappings" : {
        "properties" : {
            "category" : {"type" : "keyword"}
        }
    },
    "aliases" : {
        "current-inventory" : {},
        "electronics" : {
            "filter" : {
                "term" : {"category" : "electronics" }
            }
        }
    }
}
-->
{% capture step1_rest %}
PUT /inventory-2024
{
  "mappings": {
    "properties": {
      "category": {
        "type": "keyword"
      }
    }
  },
  "aliases": {
    "current-inventory": {},
    "electronics": {
      "filter": {
        "term": {
          "category": "electronics"
        }
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "inventory-2024",
  body =   {
    "mappings": {
      "properties": {
        "category": {
          "type": "keyword"
        }
      }
    },
    "aliases": {
      "current-inventory": {},
      "electronics": {
        "filter": {
          "term": {
            "category": "electronics"
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

```json
{
    "acknowledged": true
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/aliases`.

For more information about aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/).
