---
layout: default
title: Create index
parent: Index APIs
nav_order: 25
redirect_from:
  - /opensearch/rest-api/index-apis/create-index/
  - /opensearch/rest-api/create-index/
---

# Create index
**Introduced 1.0**
{: .label .label-purple }

While you can create an index by using a document as a base, you can also create an empty index for later use.

When creating an index, you can specify its mappings, settings, and aliases. 

## Path and HTTP methods

```
PUT <index-name>
```

## Index naming restrictions

OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## Path parameters

| Parameter | Description |
:--- | :--- 
| index | String | The index name. Must conform to the [index naming restrictions](#index-naming-restrictions). Required. |

## Query parameters

You can include the following query parameters in your request. All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for the request to return. Default is `30s`.

## Request body

As part of your request, you can optionally specify [index settings]({{site.url}}{{site.baseurl}}/im-plugin/index-settings/), [mappings]({{site.url}}{{site.baseurl}}/field-types/index/), and [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/) for your newly created index. 

#### Example request

```json
PUT /sample-index1
{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "mappings": {
    "properties": {
      "age": {
        "type": "integer"
      }
    }
  },
  "aliases": {
    "sample-alias1": {}
  }
}
```
