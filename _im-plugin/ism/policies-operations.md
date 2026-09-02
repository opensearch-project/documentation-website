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

```json
{
  "force_merge": {
    "max_num_segments": 1
  }
}
```

## Read only

Sets a managed index to be read only.

```json
{
  "read_only": {}
}
```

Set the index setting `index.blocks.write` to `true` for a managed index. ***Note:** this block does not prevent the index from refreshing.

## Read write

Sets a managed index to be writeable.

```json
{
  "read_write": {}
}
```

## Replica count

Sets the number of replicas to assign to an index.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`number_of_replicas` | Defines the number of replicas to assign to an index. | Integer | Yes

```json
{
  "replica_count": {
    "number_of_replicas": 2
  }
}
```

For information about setting replicas, see [Primary and replica shards]({{site.url}}{{site.baseurl}}/intro/#primary-and-replica-shards).

## Shrink

Allows you to reduce the number of primary shards in your indexes. With this action, you can specify:

- The number of primary shards that the target index should contain.
- A max shard size for the primary shards in the target index.
- Specify a percentage to shrink the number of primary shards in the target index.

```json
"shrink": {
    "num_new_shards": 1,
    "target_index_name_template": {
        "source": "{{ctx.index}}_shrunken"
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

Parameter | Description | Type | Example | Required
:--- | :--- |:--- |:--- |
`num_new_shards` | The maximum number of primary shards in the shrunken index. | Integer | `5` | Yes. It, however, cannot be used with `max_shard_size` or `percentage_of_source_shards`.
`max_shard_size` | The maximum size in bytes of a shard for the target index. | Keyword | `5gb` | Yes, however, it cannot be used with `num_new_shards` or `percentage_of_source_shards`.
`percentage_of_source_shards` | Percentage of the number of original primary shards to shrink. This parameter indicates the minimum percentage to use when shrinking the number of primary shards. Must be between 0.0 and 1.0, exclusive.  | Percentage | `0.5` | Yes, however it cannot be used with `max_shard_size` or `num_new_shards`
`target_index_name_template` | The name of the shrunken index. Accepts strings and the Mustache variables `{% raw %}{{ctx.index}}{% endraw %}` and `{% raw %}{{ctx.indexUuid}}{% endraw %}`. | String or Mustache template | `{"source": "{% raw %}{{ctx.index}}_shrunken"}{% endraw %}` | No
`aliases` | Aliases to add to the new index. | Object | `myalias` | No. It must be an array of alias objects.
`switch_aliases` | If `true`, copies the aliases from the source index to the target index. If there is a name conflict with an alias from the `aliases` field, the alias in the `aliases` field is used instead of the name. | Boolean | `true` | No. The default implicit value is `false`, which means no aliases are copied by default.
`force_unsafe` | If `true`, shrinks the index even if it has no replicas. | Boolean | `false` | No

If you want to add `aliases` to the action, the parameter must include an array of [alias objects]({{site.url}}{{site.baseurl}}/api-reference/alias/). For example,

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
  },
]
```

## Close

Closes the managed index.

```json
{
  "close": {}
}
```

Closed indexes remain on disk, but consume no CPU or memory. You can't read from, write to, or search closed indexes.

Closing an index is a good option if you need to retain data for longer than you need to actively search it and have sufficient disk space on your data nodes. If you need to search the data again, reopening a closed index is simpler than restoring an index from a snapshot.

## Open

Opens a managed index.

```json
{
  "open": {}
}
```

## Delete

Deletes a managed index.

```json
{
  "delete": {}
}
```

## Rollover

Rolls an alias over to a new index when the managed index meets one of the rollover conditions.

<p id="important-note"></p>

> **IMPORTANT**
>
>ISM checks the conditions for operations on **every execution of the policy** based on the **set interval**, _not_ continuously. The rollover will be performed if the value **has reached** or _has exceeded_ the configured limit **when the check is performed**. For example, with `min_size` configured to a value of 100 GiB, ISM might check the index at 99 GiB and not perform the rollover. However, if the index has grown past the limit by the next check (for example, to 105 GiB), the operation is performed.
{: .important}

If you need to skip the rollover action, you can set the index setting `index.plugins.index_state_management.rollover_skip` to `true`. For example, if you receive the error message "Missing alias or not the write index...", you can set the `index.plugins.index_state_management.rollover_skip` parameter to `true` and retry to skip rollover action.

The index format must match the pattern: `^.*-\d+$`. For example, `(logs-000001)`.
Set `index.plugins.index_state_management.rollover_alias` as the alias to rollover.

Parameter | Description | Type | Example | Required
:--- | :--- |:--- |:--- |
`min_size` | The minimum size of the total primary shard storage (not counting replicas) required to roll over the index. For example, if you set `min_size` to 100 GiB and your index has 5 primary shards and 5 replica shards of 20 GiB each, the total size of all primary shards is 100 GiB, so the rollover occurs. See [**Important** note](#important-note). | String | `20gb` or `5mb` | No
`min_primary_shard_size` | The minimum storage size of a **single primary shard** required to roll over the index. For example, if you set `min_primary_shard_size` to 30 GiB and **one of** the primary shards in the index has a size greater than the condition, the rollover occurs. See [**Important** note](#important-note). | String | `20gb` or `5mb` | No
`min_doc_count` |  The minimum number of documents required to roll over the index. See [**Important** note](#important-note). | Integer | `2000000` | No
`min_index_age` |  The minimum age required to roll over the index. Index age is the time between its creation and the present. Supported units are `d` (days), `h` (hours), `m` (minutes), `s` (seconds), `ms` (milliseconds), and `micros` (microseconds). See [**Important** note](#important-note). | String | `5d` or `7h` | No
`copy_alias` | Controls whether to copy over all aliases from the current index to a newly created index. Defaults to `false`.  | `boolean` | `true` or `false` | No

```json
{
  "rollover": {
    "min_size": "50gb"
  }
}
```

```json
{
  "rollover": {
    "min_primary_shard_size": "30gb"
  }
}
```

```json
{
  "rollover": {
    "min_doc_count": 100000000
  }
}
```

```json
{
  "rollover": {
    "min_index_age": "30d"
  }
}
```

## Notification

Sends you a notification.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`destination` | The destination URL. | `Slack, Amazon Chime, or webhook URL` | Yes
`message_template` |  The text of the message. You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). | `object` | Yes

The destination system **must** return a response otherwise the notification operation throws an error.

### Example 1: Chime notification

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

### Example 2: Custom webhook notification

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

### Example 3: Slack notification

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

You can use `ctx` variables in your message to represent a number of policy parameters based on the past executions of your policy. For example, if your policy has a rollover action, you can use `{% raw %}{{ctx.action.name}}{% endraw %}` in your message to represent the name of the rollover.

The following `ctx` variable options are available for every policy:

### Guaranteed variables

Parameter | Description | Type
:--- | :--- |:--- |:--- |
`index` | The name of the index. | String
`index_uuid` | The UUID of the index. | String
`policy_id` | The name of the policy. | String

## Snapshot

Back up your cluster’s indexes and state. For more information about snapshots, see [Take and restore snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/).

The `snapshot` operation has the following parameters.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`repository` | The repository name that you register through the native snapshot API operations.  | String | Yes | -
`snapshot` | The name of the snapshot. Accepts strings and the Mustache variables `{% raw %}{{ctx.index}}{% endraw %}` and `{% raw %}{{ctx.indexUuid}}{% endraw %}`. If the Mustache variables are invalid, then the snapshot name defaults to the index's name. | String or Mustache template | Yes | -

```json
{
  "snapshot": {
    "repository": "my_backup",
    "snapshot": "{% raw %}{{ctx.indexUuid}}{% endraw %}"
  }
}
```

## Convert index to remote

Converts an existing index into a searchable snapshot by restoring it from a remote snapshot repository. This action reduces storage costs by moving infrequently accessed data to remote storage while keeping it searchable. After the restore request is accepted, the original index is automatically deleted, ensuring that only the remote snapshot-backed index remains.

The `convert_index_to_remote` operation has the following parameters.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`repository` | The repository name registered through the native snapshot API operations. Must be a remote repository (for example, S3, Azure, or GCS).  | String | Yes | N/A
`snapshot` | The name of the snapshot created by the snapshot action.  | String | Yes | N/A
`include_aliases` | Whether to include index aliases during the restore operation. If `true`, all aliases associated with the original index are restored with the remote index. If your application accesses the index using aliases, set this parameter to `true`. | Boolean | No | `false`
`ignore_index_settings` | A comma-separated list of index settings to ignore during the restore operation. For example, `index.refresh_interval,index.number_of_replicas`. This is useful when you want to apply different settings to the restored remote index than the ones configured in the original index. | String | No | Empty string
`number_of_replicas` | The number of replicas to configure for the restored remote index. This allows you to control replica allocation during the conversion process without requiring a separate update operation. Setting `number_of_replicas` during conversion helps prevent the cluster from entering a yellow state or creating unnecessary load during replica assignment. | Integer | No | `0`
`rename_pattern` | The naming pattern for the restored searchable snapshot index. Use `$1` as a placeholder for the original index name. For example, `remote_$1` renames `my-index` to `remote_my-index`. | String | No | `$1_remote`

### Prerequisites

Before using the `convert_index_to_remote` action, ensure the following:

- A remote repository (S3, Azure, or GCS) is registered and accessible.
- A snapshot of the index exists in the specified repository, typically created using the `snapshot` action.
- The repository name matches the one used in the snapshot action.

### Usage notes

Note the following to ensure a smooth and predictable conversion when restoring an index as a searchable snapshot:

- The original index is automatically deleted after the remote snapshot restore is successfully accepted. This ensures that only the searchable snapshot version remains, completing the conversion process.
- The repository name used in the `convert_index_to_remote` operation must match the repository name specified during the snapshot action.
- You can reference the snapshot using Mustache variables like `{% raw %}{{ctx.index}}{% endraw %}` or `{% raw %}{{ctx.indexUuid}}{% endraw %}` for dynamic naming.
- Consider your cluster's capacity when setting `number_of_replicas`. If there aren't enough eligible nodes for replica restoration, the cluster may enter a yellow state.

### Basic example

The following example shows a basic conversion using the minimum required parameters:

```json
{
   "snapshot": {
      "repository": "my_backup",
      "snapshot": "{% raw %}{{ctx.index}}{% endraw %}"
   }, 
   "convert_index_to_remote": {
      "repository": "my_backup",
      "snapshot": "{% raw %}{{ctx.index}}{% endraw %}"
   }
}
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

```json
"actions": [
  {
    "index_priority": {
      "priority": 50
    }
  }
]
```

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

```json
"actions": [
  {
    "allocation": {
      "require": { "temp": "warm" }
    }
  }
]
```

## Rollup

[Index rollup]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/) lets you periodically reduce data granularity by rolling up old data into summarized indexes.

Rollup jobs can be continuous or non-continuous. A rollup job created using an ISM policy can only be non-continuous.
{: .note }

## Stop replication

Stops replication and converts the follower index to a regular index.

```json
{
  "stop_replication": {}
}
```

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

If the index is already in search-only mode, the action completes successfully without making any changes.

You can manually enable or disable `search_only` mode outside of ISM policies by calling the [Scale API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/scale/).
{: .tip}

The following example policy transitions an index to `search_only` mode after 7 days:

```json
{
  "policy": {
    "policy_id": "hot-warm-search-only",
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

### Endpoints

````bash
PUT _plugins/_rollup/jobs/{rollup_id}
GET _plugins/_rollup/jobs/{rollup_id}
DELETE _plugins/_rollup/jobs/{rollup_id}
POST _plugins/_rollup/jobs/{rollup_id}/_start
POST _plugins/_rollup/jobs/{rollup_id}/_stop
GET _plugins/_rollup/jobs/{rollup_id}/_explain
````

### Sample ISM rollup policy

````json
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
````

### Request body fields

Request fields are required when creating an ISM policy. You can reference the [Index rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/api-rollup/#create-or-update-an-index-rollup-job) page for request field options.

### Adding a rollup policy in Dashboards

To add a rollup policy in Dashboards, follow the steps below.

- Select the menu button on the upper-left of the Dashboards user interface.
- In the Dashboards menu, select `Index Management`.
- On the next screen select `Rollup jobs`.
- Select the `Create rollup` button.
- Follow the steps in the `Create rollup job` wizard.
- Add a name for the policy in the `Name` box.
- You can reference the [Index rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/api-rollup/#create-or-update-an-index-rollup-job) page to configure the rollup policy.
- Finally, select the `Create` button on the lower-right of the Dashboards user interface.
