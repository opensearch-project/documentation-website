---
layout: default
title: ISM error prevention resolutions
parent: ISM error prevention
nav_order: 5
---

# ISM error prevention resolutions

---

#### Table of contents
1. TOC
{:toc}


---

## The index is not the write index

To confirm if one index is a write index, run the following request:

```bash
GET <index>/_alias?pretty
```

If the response does not contain `"is_write_index" : true`, the index is not a write index:

```json
{
  "<index>" : {
    "aliases" : {
      "<index_alias>" : { 
        "is_write_index" : true
      }
    }
  }
}
```

To set an index as write index, run the following request:

```bash
PUT <index>
{
  "aliases": {
    "<index_alias>" : {
        "is_write_index" : true
    }
  }
}
```

## The index does not have an alias

If the index does not have an alias, you can add an alias to the index by running the following request:

```bash
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "<target_index>",
        "alias": "<index_alias>"
      }
    }
  ]
}
```

## Skipping rollover action is true

In the event that skipping a rollover action occurs, run the following request:

```bash
 GET <target_index>/_settings?pretty
```

If the response includes:

```json
{
  "index": {
    "opendistro.index_state_management.rollover_skip": true
  }
}
```

You can reset it by running the following request:

```bash
PUT <target_index>/_settings
{
    "index": {
      "index_state_management.rollover_skip": false
  }
}
```

## This index has already been rolled over successfully

Remove the [rollover policy from the index]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#remove-policy-from-index) to prevent this error from recurring. 

## The rollover policy misses rollover_alias index setting

Add a `rollover_alias` index setting to the rollover policy to resolve this issue. Run the following request:

```bash
PUT _index_template/ism_rollover
{
  "index_patterns": ["<index_patterns_in_rollover_policy>"],
  "template": {
   "settings": {
    "plugins.index_state_management.rollover_alias": "<rollover_alias>"
   }
 }
}
```

## Data too large and exceeding the threshold

Check the [JVM information]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) and increase the heap memory.

## Maximum shards exceeded

The limit of shards per node, or per index, causes this issue to occur. Check if there is a `total_shards_per_node` limit by running the following request:

```bash
GET /_cluster/settings
```

If the response contains `total_shards_per_node`, increase the value of it temporally by running the following request:

```bash
PUT _cluster/settings
{
   "transient":{
      "cluster.routing.allocation.total_shards_per_node":100
   }
}
```

To check if there is limit of shards for an index, run the following request:

```bash
GET <index>/_settings/index.routing-
```

If the response contains the setting below: 

```json
"index" : {
        "routing" : {
          "allocation" : {
            "total_shards_per_node" : "10"
          }
        }
      }
```

Increase the value or set it to `-1` for unlimited:

```bash
PUT <index>/_settings
{"index.routing.allocation.total_shards_per_node":-1}
```

## The index is write index for some data stream

If you still want to delete the index, please check your [data stream]({{site.url}}{{site.baseurl}}/opensearch/data-streams/) settings and change the write index.

## The index is blocked

Generally, the index is blocked because disk usage has exceeded flood-stage watermark and the index has a `read-only-allow-delete` block. To resolve this issue, you can:

1. Remove the `-index.blocks.read_only_allow_delete-` parameter.
1. Temporarily increase the disk watermarks.
1. Temporally disable the disk allocation threshold.

To avoid the issue from reoccurring, it is better to reduce the usage of the disk by increasing disk space, adding new nodes, or by removing data or indexes that are no longer needed. 

Remove `-index.blocks.read_only_allow_delete-` by running the following request:

```bash
PUT <index>/_settings
{
    "index.blocks.read_only_allow_delete": null
}
```

Increase the low disk watermarks by running the following request:

```bash
PUT _cluster/settings
{
    "transient": {
        "cluster": {
            "routing": {
                "allocation": {
                    "disk": {
                        "watermark": {
                            "low": "25.0gb"
                        }
                    }
                }
            }
        }
    }
}
```

Disable the disk allocation threshold by running the following request:

```bash
PUT _cluster/settings
{
    "transient": {
        "cluster": {
            "routing": {
                "allocation": {
                    "disk": {
                        "threshold_enabled" : false
                    }
                }
            }
        }
    }
}
```