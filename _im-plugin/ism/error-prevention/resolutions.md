---
layout: default
title: ISM error prevention resolutions
parent: ISM error prevention
grand_parent: Index State Management
nav_order: 10
---

# ISM error prevention resolutions

Resolutions of errors for each validation rule action are listed in the following sections.

---

#### Table of contents
1. TOC
{:toc}


---

## The index is not the write index

To confirm that the index is a write index, run the following request:

```json
GET {index}/_alias?pretty
```
{% include copy-curl.html %}

The following example response shows that the index is a write index:

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

If `is_write_index` is not `true`, the index is not a write index. To set the index as a write index, run the following request:

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "<index>",
        "alias": "<index_alias>",
        "is_write_index": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

## The index does not have an alias

If the index does not have an alias, you can add one by running the following request:

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "<index>",
        "alias": "<index_alias>"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Skipping rollover action is true

If the rollover action is being skipped, check the index settings by running the following request:

```json
GET {index}/_settings?pretty
```
{% include copy-curl.html %}

The following example response shows that rollover is set to be skipped:

```json
{
  "<index>" : {
    "settings" : {
      "index" : {
        "plugins" : {
          "index_state_management" : {
            "rollover_skip" : "true"
          }
        },
        ...
      }
    }
  }
}
```

To reset the setting, run the following request:

```json
PUT {index}/_settings
{
  "index": {
    "plugins.index_state_management.rollover_skip": false
  }
}
```
{% include copy-curl.html %}

## This index has already been rolled over successfully

Remove the [rollover policy from the index]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#remove-policy-from-index) to prevent this error from reoccurring.

## The rollover policy misses rollover_alias index setting

Add a `rollover_alias` index setting to the rollover policy to resolve this issue. Run the following request:

```json
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
{% include copy-curl.html %}

## Data too large and exceeding the threshold

Check the [JVM information]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) and increase the heap memory.

## Maximum shards exceeded

The shard limit per node, or per index, causes this issue to occur. Check whether there is a `total_shards_per_node` limit by running the following request:

```json
GET /_cluster/settings
```
{% include copy-curl.html %}

If the response contains `total_shards_per_node`, increase its value temporarily by running the following request:

```json
PUT _cluster/settings
{
  "transient": {
    "cluster.routing.allocation.total_shards_per_node": 100
  }
}
```
{% include copy-curl.html %}

To check whether there is a shard limit for an index, run the following request:

```json
GET {index}/_settings/index.routing.*
```
{% include copy-curl.html %}

The following example response shows a limit of 10 shards per node:

```json
{
  "<index>" : {
    "settings" : {
      "index" : {
        "routing" : {
          "allocation" : {
            "total_shards_per_node" : "10"
          }
        }
      }
    }
  }
}
```

To increase the limit, or to set it to `-1` for unlimited shards, run the following request:

```json
PUT {index}/_settings
{
  "index.routing.allocation.total_shards_per_node": -1
}
```
{% include copy-curl.html %}

## The index is a write index for some data stream

If you still want to delete the index, check your [data stream]({{site.url}}{{site.baseurl}}/opensearch/data-streams/) settings and change the write index.

## The index is blocked

Generally, the index is blocked because disk usage has exceeded the flood-stage watermark and the index has a `read-only-allow-delete` block. To resolve this issue, you can:

1. Remove the `index.blocks.read_only_allow_delete` parameter.
1. Temporarily increase the disk watermarks.
1. Temporarily disable the disk allocation threshold.

To prevent the issue from reoccurring, it is better to reduce the usage of the disk by increasing disk space, adding new nodes, or removing data or indexes that are no longer needed. 

Remove `index.blocks.read_only_allow_delete` by running the following request:

```json
PUT {index}/_settings
{
  "index.blocks.read_only_allow_delete": null
}
```
{% include copy-curl.html %}

Increase the low disk watermarks by running the following request:

```json
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
{% include copy-curl.html %}

Disable the disk allocation threshold by running the following request:

```json
PUT _cluster/settings
{
  "transient": {
    "cluster": {
      "routing": {
        "allocation": {
          "disk": {
            "threshold_enabled": false
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Remote store is not enabled

The `search_only` action requires remote store to be enabled on the cluster. Remote store must be enabled at cluster creation time and cannot be enabled on an existing cluster. For more information, see [Remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/).

## Segment replication is not enabled

The `search_only` action requires segment replication to be enabled for the index. Segment replication must be configured at index creation time. For more information, see [Segment replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/).

## No search replicas configured

The `search_only` action requires at least one search replica. For more information about configuring search replicas, see [Separate index and search workloads]({{site.url}}{{site.baseurl}}/tuning-your-cluster/separate-index-and-search-workloads/).
