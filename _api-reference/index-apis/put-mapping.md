---
layout: default
title: Create or update index mappings
parent: Index settings and mappings
grand_parent: Index APIs
nav_order: 30
redirect_from:
  - /opensearch/rest-api/index-apis/put-mapping/
  - /opensearch/rest-api/index-apis/update-mapping/
  - /opensearch/rest-api/update-mapping/
---

# Create or Update Index Mappings API
**Introduced 1.0**
{: .label .label-purple }

Use this API to introduce new fields into an existing index or modify the search settings of existing fields. This operation lets you evolve your index schema without recreating the index from scratch.

You cannot use this operation to change the mapping or field type of a field that already contains indexed data. Modifying an existing field's type risks making previously indexed data incompatible with the new mapping. If you need to change the type of an existing field, create a new index with the desired mappings and then use the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) operation to copy documents from the original index. To avoid downtime during reindexing, you can use [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/). For more information, see [Changing the type of an existing field](#example-changing-the-type-of-an-existing-field).

<!-- spec_insert_start
api: indices.put_mapping
component: endpoints
-->
## Endpoints
```json
POST /{index}/_mapping
PUT  /{index}/_mapping
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the index to update. You can specify a single index name, a comma-separated list of index names, or a wildcard expression. To update the mapping of all indexes, use `_all` or `*`. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `allow_no_indices` | Boolean | Specifies whether to ignore wildcards that do not match any indexes. If `false`, the request returns an error when wildcards do not match any indexes. | `true` |
| `cluster_manager_timeout` | String | The amount of time to wait for a connection to the cluster manager node. | `30s` |
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Match all indexes, including hidden indexes. <br> - `open`: Match open indexes. <br> - `closed`: Match closed indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. | `open` |
| `ignore_unavailable` | Boolean | Specifies whether to ignore indexes that are missing or closed. If `true`, missing or closed indexes are not included in the response. | `false` |
| `timeout` | String | The amount of time to wait for a response. If no response is received before the timeout expires, the request fails and returns an error. | `30s` |
| `write_index_only` | Boolean | If `true`, the mappings are applied only to the current write index for the target. | `false` |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `properties` | Object | Required. Defines the fields and their types for the index mapping. Each field can include a name, [field data type]({{site.url}}{{site.baseurl}}/field-types/index/), and [mapping parameters]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/). |
| `dynamic` | String | Controls whether new fields are added dynamically. Valid values are `true` (new fields are added automatically), `false` (new fields are ignored), and `strict` (requests that contain unmapped fields are rejected). Default is `true`. |

## Example: Adding fields to an index

The Create or Update Mappings API requires an existing index. The following example adds `description` and `price` fields to the `products` index:

<!-- spec_insert_start
component: example_code
rest: PUT /products/_mapping
body: |
{
  "properties": {
    "description": {
      "type": "text"
    },
    "price": {
      "type": "float"
    }
  }
}
-->
{% capture step1_rest %}
PUT /products/_mapping
{
  "properties": {
    "description": {
      "type": "text"
    },
    "price": {
      "type": "float"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_mapping(
  index = "products",
  body =   {
    "properties": {
      "description": {
        "type": "text"
      },
      "price": {
        "type": "float"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

You can verify the mapping was applied by using the [Get Mappings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-mapping/):

```json
GET /products/_mapping
```

## Example: Updating multiple indexes

You can apply a mapping update to multiple indexes in a single request by specifying a comma-separated list of index names. The following example adds `currency` and `tax_rate` fields to both a US and EU regional catalog:

<!-- spec_insert_start
component: example_code
rest: PUT /products-us,products-eu/_mapping
body: |
{
  "properties": {
    "currency": {
      "type": "keyword"
    },
    "tax_rate": {
      "type": "float"
    }
  }
}
-->
{% capture step1_rest %}
PUT /products-us,products-eu/_mapping
{
  "properties": {
    "currency": {
      "type": "keyword"
    },
    "tax_rate": {
      "type": "float"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_mapping(
  index = "products-us,products-eu",
  body =   {
    "properties": {
      "currency": {
        "type": "keyword"
      },
      "tax_rate": {
        "type": "float"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Adding properties to an existing object field

You can add new inner fields to an existing [object]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/object/) field. Suppose the `products` index already has a `manufacturer` object with a `name` field. The following example adds a `country` keyword field to the `manufacturer` object:

<!-- spec_insert_start
component: example_code
rest: PUT /products/_mapping
body: |
{
  "properties": {
    "manufacturer": {
      "properties": {
        "country": {
          "type": "keyword"
        }
      }
    }
  }
}
-->
{% capture step1_rest %}
PUT /products/_mapping
{
  "properties": {
    "manufacturer": {
      "properties": {
        "country": {
          "type": "keyword"
        }
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_mapping(
  index = "products",
  body =   {
    "properties": {
      "manufacturer": {
        "properties": {
          "country": {
            "type": "keyword"
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

You can confirm the nested structure by retrieving the mapping:

```json
GET /products/_mapping
```

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "products" : {
    "mappings" : {
      "properties" : {
        "description" : {
          "type" : "text"
        },
        "manufacturer" : {
          "properties" : {
            "country" : {
              "type" : "keyword"
            },
            "name" : {
              "type" : "text"
            }
          }
        },
        "price" : {
          "type" : "float"
        },
        "product_name" : {
          "type" : "text"
        }
      }
    }
  }
}
```
</details>

## Example: Adding multi-fields to an existing field

[Multi-fields]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/fields/) allow you to index the same field in different ways. For instance, a `text` field used for full-text search can also have a `keyword` sub-field for sorting or aggregations. The following example adds a `product_name.keyword` sub-field with `ignore_above` set to `256`, enabling exact-match filtering and sorting on product names:

<!-- spec_insert_start
component: example_code
rest: PUT /products/_mapping
body: |
{
  "properties": {
    "product_name": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    }
  }
}
-->
{% capture step1_rest %}
PUT /products/_mapping
{
  "properties": {
    "product_name": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_mapping(
  index = "products",
  body =   {
    "properties": {
      "product_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
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

You can verify the multi-field configuration:

```json
GET /products/_mapping
```

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "products" : {
    "mappings" : {
      "properties" : {
        "description" : {
          "type" : "text"
        },
        "manufacturer" : {
          "properties" : {
            "country" : {
              "type" : "keyword"
            },
            "name" : {
              "type" : "text"
            }
          }
        },
        "price" : {
          "type" : "float"
        },
        "product_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
      }
    }
  }
}
```
</details>

## Example: Changing supported mapping parameters

Some [mapping parameters]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/) can be updated for an existing field using the Create or Update Mappings API. For example, you can change the [`ignore_above`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/ignore-above/) value for a keyword field. The following example increases `ignore_above` from `20` to `50` for the `sku` field, allowing longer product codes to be indexed:

<!-- spec_insert_start
component: example_code
rest: PUT /products/_mapping
body: |
{
  "properties": {
    "sku": {
      "type": "keyword",
      "ignore_above": 50
    }
  }
}
-->
{% capture step1_rest %}
PUT /products/_mapping
{
  "properties": {
    "sku": {
      "type": "keyword",
      "ignore_above": 50
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_mapping(
  index = "products",
  body =   {
    "properties": {
      "sku": {
        "type": "keyword",
        "ignore_above": 50
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

You can confirm the updated parameter value:

```json
GET /products/_mapping
```

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "products" : {
    "mappings" : {
      "properties" : {
        "description" : {
          "type" : "text"
        },
        "manufacturer" : {
          "properties" : {
            "country" : {
              "type" : "keyword"
            },
            "name" : {
              "type" : "text"
            }
          }
        },
        "price" : {
          "type" : "float"
        },
        "product_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "sku" : {
          "type" : "keyword",
          "ignore_above" : 50
        }
      }
    }
  }
}
```
</details>

## Example: Renaming a field using an alias

Because renaming a field makes previously stored data inaccessible under the new name, use an [`alias`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/alias/) field type to provide an alternate way to reference the field. The following example creates an `item_id` alias that points to the existing `product_id` field, allowing queries to use either name:

<!-- spec_insert_start
component: example_code
rest: PUT /products/_mapping
body: |
{
  "properties": {
    "item_id": {
      "type": "alias",
      "path": "product_id"
    }
  }
}
-->
{% capture step1_rest %}
PUT /products/_mapping
{
  "properties": {
    "item_id": {
      "type": "alias",
      "path": "product_id"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_mapping(
  index = "products",
  body =   {
    "properties": {
      "item_id": {
        "type": "alias",
        "path": "product_id"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

You can verify the alias was created:

```json
GET /products/_mapping
```

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "products" : {
    "mappings" : {
      "properties" : {
        "description" : {
          "type" : "text"
        },
        "item_id" : {
          "type" : "alias",
          "path" : "product_id"
        },
        "manufacturer" : {
          "properties" : {
            "country" : {
              "type" : "keyword"
            },
            "name" : {
              "type" : "text"
            }
          }
        },
        "price" : {
          "type" : "float"
        },
        "product_id" : {
          "type" : "keyword"
        },
        "product_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "sku" : {
          "type" : "keyword",
          "ignore_above" : 50
        }
      }
    }
  }
}
```
</details>

## Example: Changing the type of an existing field

You cannot directly change the field type of a field that already contains indexed data. Instead, create a new index with the correct mapping and use the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API to copy documents from the original index.

The following example changes the `weight` field from `integer` to `float` so that fractional values (such as `0.75` kg) can be stored accurately.

First, create the new index with the updated field type:

<!-- spec_insert_start
component: example_code
rest: PUT /products-v2
body: |
{
  "mappings": {
    "properties": {
      "product_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "price": {
        "type": "float"
      },
      "weight": {
        "type": "float"
      }
    }
  }
}
-->
{% capture step1_rest %}
PUT /products-v2
{
  "mappings": {
    "properties": {
      "product_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "price": {
        "type": "float"
      },
      "weight": {
        "type": "float"
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create(
  index = "products-v2",
  body =   {
    "mappings": {
      "properties": {
        "product_name": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "price": {
          "type": "float"
        },
        "weight": {
          "type": "float"
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

Then reindex the data from the original index into the new one:

<!-- spec_insert_start
component: example_code
rest: POST /_reindex
body: |
{
  "source": {
    "index": "products"
  },
  "dest": {
    "index": "products-v2"
  }
}
-->
{% capture step1_rest %}
POST /_reindex
{
  "source": {
    "index": "products"
  },
  "dest": {
    "index": "products-v2"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.reindex(
  body =   {
    "source": {
      "index": "products"
    },
    "dest": {
      "index": "products-v2"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took" : 8,
  "timed_out" : false,
  "total" : 2,
  "updated" : 0,
  "created" : 2,
  "deleted" : 0,
  "batches" : 1,
  "version_conflicts" : 0,
  "noops" : 0,
  "retries" : {
    "bulk" : 0,
    "search" : 0
  },
  "throttled_millis" : 0,
  "requests_per_second" : -1.0,
  "throttled_until_millis" : 0,
  "failures" : [ ]
}
```
</details>

## Example response

A successful mapping update returns the following response:

```json
{
  "acknowledged": true
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Indicates whether the request was acknowledged by all relevant nodes in the cluster. |
