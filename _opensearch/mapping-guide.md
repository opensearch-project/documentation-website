---
layout: default
title: Mapping
nav_order: 14
---

# About Mapping with OpenSearch

You can define how documents and their fields are stored and indexed by creating a mapping. 

Each field has its own data type. The mapping definition defines metadata fields that specify how to 

This section provides an example for how to create an index mapping, and how to add a document to it that will get ip_range validated.


---

#### Table of contents
1. TOC
{:toc}


---
## Dynamic mapping

When you index a document, OpenSearch adds fields automatically. You can also explicitly add fields to an index mapping. The following example shows how to add the ip_range field and specify `ignore_malformed` parameter to prevent ip addresses that do not conform to your ip_range data type.

### Create an index with ip_range mapping

To create an index, use a PUT request:

```json
PUT _index_ip
{
  "mappings": {
    "dynamic_templates": [
      {
        "ip_range": {
        "match": "*ip_range",
        "mapping": {
           "type": "ip_range",
           "ignore_malformed": true
          }
        }
      }
     ]
   }
}
```

You can add a document to your index that has an ip_range specified:

```json
PUT _index_ip/_doc/<id>
{
  "source_ip_range": "192.168.1.1/32"
}
```

This indexed ip_range does not throw an error because `ignore_malformed` is set to true.



<!---## Index alias options

You can specify the options shown in the following table.

Option | Valid values | Description | Required
:--- | :--- | :---
`index` | String | The name of the index that the alias points to. | Yes
`alias` | String | The name of the alias. | No
`filter` | Object | Add a filter to the alias. | No
`routing` | String | Limit search to an associated shard value. You can specify `search_routing` and `index_routing` independently. | No
`is_write_index` | String | Specify the index that accepts any write operations to the alias. If this value is not specified, then no write operations are allowed. | No
