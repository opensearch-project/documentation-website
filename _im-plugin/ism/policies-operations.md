---
layout: default
title: ISM supported operations
nav_order: 10
parent: Policies
grand_parent: Index State Management
has_children: false
---


# ISM supported operations

ISM supports the following operations:

- [Force merge](#force-merge)
- [Read only](#read-only)
- [Read write](#read-write)
- [Publish field domains](#publish-field-domains)
- [Replica count](#replica-count)
- [Shrink](#shrink)
- [Close](#close)
- [Open](#open)
- [Delete](#delete)
- [Rollover](#rollover)
- [Notification](#notification)
- [Snapshot](#snapshot)
- [Convert index to remote](#convert-index-to-remote)
- [Index priority](#index-priority)
- [Allocation](#allocation)
- [Rollup](#rollup)
- [Stop replication](#stop-replication)
- [Search only](#search-only)

## Force merge

Reduces the number of Lucene segments by merging the segments of individual shards. This operation attempts to set the index to a `read-only` state before starting the merging process.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`max_num_segments` | The number of segments to reduce the shard to. | Integer | Yes

The following example merges the segments of each shard into a single segment:

```json
{
  "force_merge": {
    "max_num_segments": 1
  }
}
```
{% include copy.html %}

## Read only

Sets a managed index to be read only.

The `read_only` operation takes no parameters:

```json
{
  "read_only": {}
}
```
{% include copy.html %}

Set the index setting `index.blocks.write` to `true` for a managed index.

The `index.blocks.write` block does not prevent the index from refreshing.
{: .note}

## Read write

Sets a managed index to be writeable.

The `read_write` operation takes no parameters:

```json
{
  "read_write": {}
}
```
{% include copy.html %}

## Publish field domains
**Introduced 3.9**
{: .label .label-purple }

Computes the field domains for a managed index and publishes them to the index metadata. OpenSearch uses field domains for [index-level search pruning]({{site.url}}{{site.baseurl}}/search-plugins/index-level-search-pruning/).

A field domain contains the minimum and maximum values for a field in one index. The `date_range` field domain type applies to `date` and `date_nanos` fields. For `date` fields, ISM stores the bounds in epoch milliseconds; for `date_nanos` fields, ISM stores the bounds in epoch nanoseconds.

Before computing field domains, ISM refreshes the index. It then computes the minimum and maximum values for each configured field and publishes them to the index's `index_field_domains` metadata. If a configured field has no values in the index, ISM does not publish a field domain for that field, and if no field domains are produced, the action completes without publishing any field domains.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`fields` | The fields for which ISM computes and publishes field domains. | Array | Yes
`fields.field` | The field name. | String | Yes
`fields.type` | The field domain type. Valid value is `date_range`. | String | Yes

The following example publishes a `date_range` field domain for the `@timestamp` field:

```json
{
  "publish_field_domains": {
    "fields": [
      {
        "field": "@timestamp",
        "type": "date_range"
      }
    ]
  }
}
```
{% include copy.html %}

The managed index must be write blocked before this action runs, so add a `read_only` action before `publish_field_domains`:

```json
{
  "actions": [
    {
      "read_only": {}
    },
    {
      "publish_field_domains": {
        "fields": [
          {
            "field": "@timestamp",
            "type": "date_range"
          }
        ]
      }
    }
  ]
}
```
{% include copy.html %}

Use this action only for indexes that remain write blocked after publishing. If writes resume, a new document can fall outside the published field domain, and pruning can skip an index that holds matching documents, silently dropping results from searches.
{: .important}

If the Security plugin is enabled, the ISM execution user must have permission to publish field domains using the `indices:admin/field_domains/put` action.

## Replica count

Sets the number of replicas to assign to an index.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`number_of_replicas` | Defines the number of replicas to assign to an index. | Integer | Yes

The following example assigns two replicas to the index:

```json
{
  "replica_count": {
    "number_of_replicas": 2
  }
}
```
{% include copy.html %}

For information about setting replicas, see [Primary and replica shards]({{site.url}}{{site.baseurl}}/intro/#primary-and-replica-shards).

## Shrink

Allows you to reduce the number of primary shards in your indexes. With this action, you can specify:

- The number of primary shards that the target index should contain.
- A max shard size for the primary shards in the target index.
- Specify a percentage to shrink the number of primary shards in the target index.

The following example shrinks the index to one primary shard, names the target index by appending `_shrunken` to the source index name, and adds the `my-alias` alias:

```json
"shrink": {
    "num_new_shards": 1,
    "target_index_name_template": {
        "source": "{% raw %}{{ctx.index}}{% endraw %}_shrunken"
    },
    "aliases": [
      {
        "my-alias": {}
      }
    ],
    "switch_aliases": true,
    "force_unsafe": false
}
```
{% include copy.html %}

Parameter | Description | Type | Example | Required
:--- | :--- |:--- |:--- |
`num_new_shards` | The maximum number of primary shards in the shrunken index. | Integer | `5` | Yes. It, however, cannot be used with `max_shard_size` or `percentage_of_source_shards`.
`max_shard_size` | The maximum size in bytes of a shard for the target index. | Keyword | `5gb` | Yes, however, it cannot be used with `num_new_shards` or `percentage_of_source_shards`.
`percentage_of_source_shards` | Percentage of the number of original primary shards to shrink. This parameter indicates the minimum percentage to use when shrinking the number of primary shards. Must be between 0.0 and 1.0, exclusive.  | Percentage | `0.5` | Yes, however it cannot be used with `max_shard_size` or `num_new_shards`
`target_index_name_template` | The name of the shrunken index. Accepts strings and the Mustache variables `{% raw %}{{ctx.index}}{% endraw %}` and `{% raw %}{{ctx.indexUuid}}{% endraw %}`. | String or Mustache template | `{"source": "{% raw %}{{ctx.index}}_shrunken"}{% endraw %}` | No
`aliases` | Aliases to add to the new index. | Object | `myalias` | No. It must be an array of alias objects.
`switch_aliases` | If `true`, copies the aliases from the source index to the target index. If there is a name conflict with an alias from the `aliases` field, the alias in the `aliases` field is used instead of the name. | Boolean | `true` | No. The default implicit value is `false`, which means no aliases are copied by default.
`force_unsafe` | If `true`, shrinks the index even if it has no replicas. | Boolean | `false` | No

If you want to add `aliases` to the action, the parameter must include an array of [alias objects]({{site.url}}{{site.baseurl}}/api-reference/alias/), as in the following example:

```json
"aliases": [
  {
    "my-alias": {}
  },
  {
    "my-second-alias": {
      "is_write_index": false,
      "filter": {
        "multi_match": {
          "query": "QUEEN",
          "fields": ["speaker", "text_entry"]
        }
      },
      "index_routing" : "1",
      "search_routing" : "1"
    }
  }
]
```
{% include copy.html %}

## Close

Closes the managed index.

The `close` operation takes no parameters:

```json
{
  "close": {}
}
```
{% include copy.html %}

Closed indexes remain on disk, but consume no CPU or memory. You can't read from, write to, or search closed indexes.

Closing an index is a good option if you need to retain data for longer than you need to actively search it and have sufficient disk space on your data nodes. If you need to search the data again, reopening a closed index is simpler than restoring an index from a snapshot.

## Open

Opens a managed index.

The `open` operation takes no parameters:

```json
{
  "open": {}
}
```
{% include copy.html %}

## Delete

Deletes a managed index.

The `delete` operation takes no parameters:

```json
{
  "delete": {}
}
```
{% include copy.html %}

## Rollover

Rolls an alias over to a new index when the managed index meets one of the rollover conditions.

<p id="important-note"></p>

> **IMPORTANT**
>
>ISM checks the conditions for operations on **every execution of the policy** based on the **set interval**, _not_ continuously. The rollover will be performed if the value **has reached** or _has exceeded_ the configured limit **when the check is performed**. For example, with `min_size` configured to a value of 100 GiB, ISM might check the index at 99 GiB and not perform the rollover. However, if the index has grown past the limit by the next check (for example, to 105 GiB), the operation is performed.
{: .important}

If you need to skip the rollover action, you can set the index setting `index.plugins.index_state_management.rollover_skip` to `true`. For example, if you receive the error message "Missing alias or not the write index...", you can set the `index.plugins.index_state_management.rollover_skip` parameter to `true` and retry to skip the rollover action.

The index format must match the pattern: `^.*-\d+$`. For example, `(logs-000001)`.
Set `index.plugins.index_state_management.rollover_alias` as the alias to rollover.

The `rollover` operation has the following parameters, all of which are optional.

Parameter | Description | Type | Example
:--- | :--- |:--- |:---
`min_size` | The minimum size of the total primary shard storage (not counting replicas) required to roll over the index. For example, if you set `min_size` to 100 GiB and your index has 5 primary shards and 5 replica shards of 20 GiB each, the total size of all primary shards is 100 GiB, so the rollover occurs. See [**Important** note](#important-note). | String | `20gb` or `5mb`
`min_primary_shard_size` | The minimum storage size of a **single primary shard** required to roll over the index. For example, if you set `min_primary_shard_size` to 30 GiB and **one of** the primary shards in the index has a size greater than the condition, the rollover occurs. See [**Important** note](#important-note). | String | `20gb` or `5mb`
`min_doc_count` |  The minimum number of documents required to roll over the index. See [**Important** note](#important-note). | Integer | `2000000`
`min_index_age` |  The minimum age required to roll over the index. Index age is the time between its creation and the present. Supported units are `d` (days), `h` (hours), `m` (minutes), `s` (seconds), `ms` (milliseconds), and `micros` (microseconds). See [**Important** note](#important-note). | String | `5d` or `7h`
`copy_alias` | Controls whether to copy over all aliases from the current index to a newly created index. Default is `false`.  | Boolean | `true` or `false`
`prevent_empty_rollover` | Controls whether to skip the rollover when the index contains no documents. When `true`, an empty index does not roll over. Default is `false`. | Boolean | `true` or `false`
`any_of` | A list of condition groups. Each group is an object containing one or more of `min_size`, `min_primary_shard_size`, `min_doc_count`, and `min_index_age`. Within a group, the conditions are combined with AND; the groups are combined with OR. Mutually exclusive with the conditions set directly on the `rollover` object. Specifying both, an empty list, or an empty group returns an error. | Array | `[{"min_index_age": "7d"}]`

Conditions set directly on the `rollover` object are combined with a logical OR, so the rollover occurs as soon as one of them is met. The following rollover action rolls the index over when the index is at least 7 days old or at least 50 GiB in size:

```json
{
  "rollover": {
    "min_index_age": "7d",
    "min_size": "50gb"
  }
}
```
{% include copy.html %}

To require that several conditions be met together, use `any_of`. This parameter takes a list of condition groups. The conditions within a group are combined with AND, and the groups are combined with OR, so the rollover occurs when every condition in at least one group is met. 

The following rollover action rolls the index over when it is at least 7 days old and at least 50 GiB in size, or when it reaches 100,000,000 documents:

```json
{
  "rollover": {
    "any_of": [
      {
        "min_index_age": "7d",
        "min_size": "50gb"
      },
      {
        "min_doc_count": 100000000
      }
    ]
  }
}
```
{% include copy.html %}

In a mixed-version cluster, every node must be running OpenSearch 3.7 or later to evaluate grouped conditions. Nodes running earlier versions do not process `any_of`.
{: .note}

## Notification

Sends you a notification.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`destination` | The destination URL. | Slack, Amazon Chime, or webhook URL | Yes
`message_template` |  The text of the message. You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). | Object | Yes

The destination system **must** return a response otherwise the notification operation throws an error.

### Example 1: Chime notification

The following notification operation sends a message to an Amazon Chime webhook:

```json
{
  "notification": {
    "destination": {
      "chime": {
        "url": "<url>"
      }
    },
    "message_template": {
      "source": "the index is {% raw %}{{ctx.index}}{% endraw %}"
    }
  }
}
```
{% include copy.html %}

### Example 2: Custom webhook notification

The following notification operation sends a message to a custom webhook:

```json
{
  "notification": {
    "destination": {
      "custom_webhook": {
        "url": "https://<your_webhook>"
      }
    },
    "message_template": {
      "source": "the index is {% raw %}{{ctx.index}}{% endraw %}"
    }
  }
}
```
{% include copy.html %}

### Example 3: Slack notification

The following notification operation sends a message to a Slack webhook:

```json
{
  "notification": {
    "destination": {
      "slack": {
        "url": "https://hooks.slack.com/services/xxx/xxxxxx"
      }
    },
    "message_template": {
      "source": "the index is {% raw %}{{ctx.index}}{% endraw %}"
    }
  }
}
```
{% include copy.html %}

You can use `ctx` variables in your message to represent a number of policy parameters based on the past executions of your policy. For example, if your policy has a rollover action, you can use `{% raw %}{{ctx.action.name}}{% endraw %}` in your message to represent the name of the rollover.

The following `ctx` variable options are available for every policy:

### Guaranteed variables

Parameter | Description | Type
:--- | :--- |:--- |:--- |
`index` | The name of the index. | String
`index_uuid` | The UUID of the index. | String
`policy_id` | The name of the policy. | String

## Snapshot

Back up your cluster's indexes and state. For more information about snapshots, see [Take and restore snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/).

The `snapshot` operation has the following parameters.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`repository` | The repository name that you register through the native snapshot API operations.  | String | Yes | -
`snapshot` | The name of the snapshot. Accepts strings and the Mustache variables `{% raw %}{{ctx.index}}{% endraw %}` and `{% raw %}{{ctx.indexUuid}}{% endraw %}`. If the Mustache variables are invalid, then the snapshot name defaults to the index's name. | String or Mustache template | Yes | -

The following example takes a snapshot of the index in the `my_backup` repository and names the snapshot using the index UUID:

```json
{
  "snapshot": {
    "repository": "my_backup",
    "snapshot": "{% raw %}{{ctx.indexUuid}}{% endraw %}"
  }
}
```
{% include copy.html %}

## Convert index to remote

Converts an existing index into a searchable snapshot by restoring it from a remote snapshot repository. This action reduces storage costs by moving infrequently accessed data to remote storage while keeping it searchable. Set `delete_original_index` to `true` to remove the original index once the restore request is accepted, so that only the remote snapshot-backed index remains.

The `convert_index_to_remote` operation has the following parameters.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`repository` | The repository name registered through the native snapshot API operations. Must be a remote repository (for example, S3, Azure, or GCS).  | String | Yes | N/A
`snapshot` | The name of the snapshot created by the snapshot action.  | String | Yes | N/A
`include_aliases` | Whether to include index aliases during the restore operation. If `true`, all aliases associated with the original index are restored with the remote index. If your application accesses the index using aliases, set this parameter to `true`. | Boolean | No | `false`
`ignore_index_settings` | A comma-separated list of index settings to ignore during the restore operation. For example, `index.refresh_interval,index.number_of_replicas`. This is useful when you want to apply different settings to the restored remote index than the ones configured in the original index. | String | No | Empty string
`number_of_replicas` | The number of replicas to configure for the restored remote index. This allows you to control replica allocation during the conversion process without requiring a separate update operation. Setting `number_of_replicas` during conversion helps prevent the cluster from entering a yellow state or creating unnecessary load during replica assignment. | Integer | No | `0`
`rename_pattern` | The naming pattern for the restored searchable snapshot index. Use `$1` as a placeholder for the original index name. For example, `remote_$1` renames `my-index` to `remote_my-index`. | String | No | `$1_remote`
`delete_original_index` | Whether to delete the original index after the restore request is accepted. | Boolean | No | `false`

### Prerequisites

Before using the `convert_index_to_remote` action, ensure the following:

- A remote repository (S3, Azure, or GCS) is registered and accessible.
- A snapshot of the index exists in the specified repository, typically created using the `snapshot` action.
- The repository name matches the one used in the snapshot action.

### Usage notes

Note the following to ensure a smooth and predictable conversion when restoring an index as a searchable snapshot:

- The original index is deleted after the remote snapshot restore is successfully accepted only if you set `delete_original_index` to `true`. By default, the original index remains alongside the searchable snapshot version.
- The repository name used in the `convert_index_to_remote` operation must match the repository name specified during the snapshot action.
- Each object in the `actions` array holds one action. Putting `snapshot` and `convert_index_to_remote` in the same object is accepted, but only one of them is stored, so the snapshot is never taken. List each one in its own object.
- You can reference the snapshot using Mustache variables like `{% raw %}{{ctx.index}}{% endraw %}` or `{% raw %}{{ctx.indexUuid}}{% endraw %}` for dynamic naming.
- Consider your cluster's capacity when setting `number_of_replicas`. If there aren't enough eligible nodes for replica restoration, the cluster may enter a yellow state.

### Basic example

The following example shows a basic conversion using the minimum required parameters. The `snapshot` action creates the snapshot that `convert_index_to_remote` then restores, so each one is a separate object in the `actions` array:

```json
"actions": [
  {
    "snapshot": {
      "repository": "my_backup",
      "snapshot": "{% raw %}{{ctx.index}}{% endraw %}"
    }
  },
  {
    "convert_index_to_remote": {
      "repository": "my_backup",
      "snapshot": "{% raw %}{{ctx.index}}{% endraw %}"
    }
  }
]
```
{% include copy.html %}

### Advanced configuration example

The following example demonstrates using all available configuration options. This configuration includes aliases, ignores certain index settings during restore, and configures two replicas for the searchable snapshot:

```json
{
   "convert_index_to_remote": {
      "repository": "my_backup",
      "snapshot": "daily-snapshot",
      "include_aliases": true,
      "ignore_index_settings": "index.refresh_interval,index.number_of_replicas",
      "number_of_replicas": 0,
      "rename_pattern": "remote_$1"
   }
}
```
{% include copy.html %}

### Complete policy example

The following policy moves indexes older than 30 days to searchable snapshots with optimized settings for cost efficiency:

```json
{
  "policy": {
    "description": "Convert old indexes to searchable snapshots",
    "default_state": "active",
    "states": [
      {
        "name": "active",
        "actions": [],
        "transitions": [
          {
            "state_name": "archive",
            "conditions": {
              "min_index_age": "30d"
            }
          }
        ]
      },
      {
        "name": "archive",
        "actions": [
          {
            "snapshot": {
              "repository": "remote-repo",
              "snapshot": "{% raw %}{{ctx.index}}{% endraw %}"
            }
          },
          {
            "convert_index_to_remote": {
              "repository": "remote-repo",
              "snapshot": "{% raw %}{{ctx.index}}{% endraw %}",
              "include_aliases": true,
              "ignore_index_settings": "index.refresh_interval,index.number_of_replicas",
              "number_of_replicas": 0
            }
          }
        ],
        "transitions": []
      }
    ]
  }
}
```
{% include copy.html %}

## Index priority

Set the priority for the index in a specific state. Unallocated shards of indexes are recovered in the order of their priority, whenever possible. The indexes with higher priority values are recovered first followed by the indexes with lower priority values.

The `index_priority` operation has the following parameter.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |:---
`priority` | The priority for the index as soon as it enters a state. | Integer | Yes | 1

The following example sets the index priority to `50`:

```json
"actions": [
  {
    "index_priority": {
      "priority": 50
    }
  }
]
```
{% include copy.html %}

## Allocation

Allocate the index to a node with a specific attribute set [like this]({{site.url}}{{site.baseurl}}/opensearch/cluster/#advanced-step-7-set-up-a-hot-warm-architecture).
For example, setting `require` to `warm` moves your data only to "warm" nodes.

The `allocation` operation has the following parameters. At least one of `require`, `include`, or `exclude` must be specified.

Parameter | Description | Type | Required
:--- | :--- |:--- |:---
`require` | Allocate the index to a node with a specified attribute. | Object | No
`include` | Allocate the index to a node with any of the specified attributes. | Object | No
`exclude` | Don't allocate the index to a node with any of the specified attributes. | Object | No
`wait_for` | Wait for the policy to execute before allocating the index to a node with a specified attribute. | Boolean | No. Default is `false`.

The following example allocates the index to nodes whose `temp` attribute is set to `warm`:

```json
"actions": [
  {
    "allocation": {
      "require": { "temp": "warm" }
    }
  }
]
```
{% include copy.html %}

## Rollup

[Index rollup]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/) lets you periodically reduce data granularity by rolling up old data into summarized indexes. Define the job in an `ism_rollup` object. For the fields it accepts, see [Create or update an index rollup job]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/rollup-api/#create-or-update-an-index-rollup-job).

Rollup jobs can be continuous or non-continuous. A rollup job created using an ISM policy can only be non-continuous.
{: .note }

The following policy rolls the `opensearch_dashboards_sample_data_ecommerce` fields up into hourly buckets in a `target` index:

```json
PUT _plugins/_ism/policies/sample_rollup_policy
{
    "policy": {
        "description": "Sample rollup" ,
        "default_state": "rollup",
        "states": [
            {
                "name": "rollup",
                "actions": [
                    {
                        "rollup": {
                            "ism_rollup": {
                                "description": "Creating rollup through ISM",
                                "target_index": "target",
                                "target_index_settings":{
                                    "index.number_of_shards": 1,
                                    "index.number_of_replicas": 1,
                                    "index.codec": "best_compression"
                                 },
                                "page_size": 1000,
                                "dimensions": [
                                    {
                                        "date_histogram": {
                                            "fixed_interval": "60m",
                                            "source_field": "order_date",
                                            "target_field": "order_date",
                                            "timezone": "America/Los_Angeles"
                                        }
                                    },
                                    {
                                        "terms": {
                                            "source_field": "customer_gender",
                                            "target_field": "customer_gender"
                                        }
                                    },
                                    {
                                        "terms": {
                                            "source_field": "day_of_week",
                                            "target_field": "day_of_week"
                                        }
                                    }
                                ],
                                "metrics": [
                                    {
                                        "source_field": "taxless_total_price",
                                        "metrics": [
                                            {
                                                "sum": {}
                                            }
                                        ]
                                    },
                                    {
                                        "source_field": "total_quantity",
                                        "metrics": [
                                            {
                                                "avg": {}
                                            },
                                            {
                                                "max": {}
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                "transitions": []
            }
        ]
    }
}
```
{% include copy-curl.html %}

To create a rollup job in OpenSearch Dashboards, see [Creating a rollup job]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/#creating-a-rollup-job).

## Stop replication

Stops replication and converts the follower index to a regular index.

The `stop_replication` operation takes no parameters:

```json
{
  "stop_replication": {}
}
```
{% include copy.html %}

When cross-cluster replication is enabled, the follower index becomes read-only, preventing all write operations. To manage replicated indexes on a follower cluster, you can perform the `stop_replication` action before performing other write operations. For example, you can define a policy that first runs `stop_replication` and then deletes the index by running a `delete` action.

If security is enabled, in addition to [stop replication permissions]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/permissions/#replication-permissions), you must have the `indices:internal/plugins/replication/index/stop` permission in order to use the `stop_replication` action.
{: .note}

## Search only

When an index enters `search_only` mode, OpenSearch removes its primary and regular replica shards while retaining search replicas for query operations. All write operations to the index are blocked. This is useful for log lifecycle management where older indexes no longer need write capability but should remain searchable.

> This action requires the following prerequisites:
> - Remote store must be enabled on the cluster.
> - Segment replication must be enabled on the index.
> - Search replicas must be configured on the index.
>
> For more information about search-only mode and reader/writer separation, see [Separate index and search workloads]({{site.url}}{{site.baseurl}}/tuning-your-cluster/separate-index-and-search-workloads/).
{: .note}

Set an index to search-only mode using the following action:

```json
{
  "search_only": {}
}
```
{% include copy.html %}

If the index is already in search-only mode, the action completes successfully without making any changes.

You can manually enable or disable `search_only` mode outside of ISM policies by calling the [Scale API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/scale/).
{: .tip}

The following example policy transitions an index to `search_only` mode after 7 days:

```json
PUT _plugins/_ism/policies/hot-warm-search-only
{
  "policy": {
    "description": "Move indexes to search-only mode after 7 days",
    "default_state": "hot",
    "states": [
      {
        "name": "hot",
        "actions": [],
        "transitions": [
          {
            "state_name": "warm",
            "conditions": {
              "min_index_age": "7d"
            }
          }
        ]
      },
      {
        "name": "warm",
        "actions": [
          {
            "search_only": {}
          }
        ],
        "transitions": []
      }
    ]
  }
}
```
{% include copy-curl.html %}
