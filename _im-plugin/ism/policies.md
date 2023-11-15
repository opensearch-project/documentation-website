---
layout: default
title: Policies
nav_order: 1
parent: Index State Management
has_children: false
---

# Policies

Policies are JSON documents that define the following:

- The *states* that an index can be in, including the default state for new indexes. For example, you might name your states "hot," "warm," "delete," and so on. For more information, see [States](#states).
- Any *actions* that you want the plugin to take when an index enters a state, such as performing a rollover. For more information, see [Actions](#actions).
- The conditions that must be met for an index to move into a new state, known as *transitions*. For example, if an index is more than eight weeks old, you might want to move it to the "delete" state. For more information, see [Transitions](#transitions).

In other words, a policy defines the *states* that an index can be in, the *actions* to perform when in a state, and the conditions that must be met to *transition* between states.

You have complete flexibility in the way you can design your policies. You can create any state, transition to any other state, and specify any number of actions in each state.

This table lists the relevant fields of a policy.

Field | Description | Type | Required | Read Only
:--- | :--- |:--- |:--- |
`policy_id` |  The name of the policy. | `string` | Yes | Yes
`description` |  A human-readable description of the policy. | `string` | Yes | No
`ism_template` | Specify an ISM template to automatically apply the policy to the newly created index. | `nested list of objects` | No | No
`ism_template.index_patterns` | Specify a pattern that matches the newly created index name. | `list of strings` | No | No
`ism_template.priority` | Specify a priority to disambiguate when multiple policies match the newly created index name. | `number` | No | No
`last_updated_time`  |  The time the policy was last updated. | `timestamp` | Yes | Yes
`error_notification` |  The destination and message template for error notifications. The destination could be Amazon Chime, Slack, or a webhook URL. | `object` | No | No
`default_state` | The default starting state for each index that uses this policy. | `string` | Yes | No
`states` | The states that you define in the policy. | `nested list of objects` | Yes | No

---

#### Table of contents
1. TOC
{:toc}


---

## States

A state is the description of the status that the managed index is currently in. A managed index can be in only one state at a time. Each state has associated actions that are executed sequentially on entering a state and transitions that are checked after all the actions have been completed.

This table lists the parameters that you can define for a state.

Field | Description | Type | Required
:--- | :--- |:--- |:--- |
`name` |  The name of the state. | `string` | Yes
`actions` | The actions to execute after entering a state. For more information, see [Actions](#actions). | `nested list of objects` | Yes
`transitions` | The next states and the conditions required to transition to those states. If no transitions exist, the policy assumes that it's complete and can now stop managing the index. For more information, see [Transitions](#transitions). | `nested list of objects` | Yes

---

## Actions

Actions are the steps that the policy sequentially executes on entering a specific state.

ISM executes actions in the order in which they are defined. For example, if you define actions [A,B,C,D], ISM executes action A, and then goes into a sleep period based on the cluster setting `plugins.index_state_management.job_interval`. Once the sleep period ends, ISM continues to execute the remaining actions. However, if ISM cannot successfully execute action A, the operation ends, and actions B, C, and D do not get executed.

Optionally, you can define an action's timeout period, which, if exceeded, forcibly fails the action. For example, if timeout is set to `1d`, and ISM has not completed the action within one day, even after retries, the action fails.

This table lists the parameters that you can define for an action.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`timeout` |  The timeout period for the action. Accepts time units for minutes, hours, and days. | `time unit` | No | -
`retry` | The retry configuration for the action. | `object` | No | Specific to action

The `retry` operation has the following parameters:

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`count` | The number of retry counts. | `number` | Yes | -
`backoff` | The backoff policy type to use when retrying. Valid values are Exponential, Constant, and Linear. | `string` | No | Exponential
`delay` | The time to wait between retries. Accepts time units for minutes, hours, and days. | `time unit` | No | 1 minute

The following example action has a timeout period of one hour. The policy retries this action three times with an exponential backoff policy, with a delay of 10 minutes between each retry:

```json
"actions": {
  "timeout": "1h",
  "retry": {
    "count": 3,
    "backoff": "exponential",
    "delay": "10m"
  }
}
```

For a list of available unit types, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## ISM supported operations

ISM supports the following operations:

- [force_merge](#force_merge)
- [read_only](#read_only)
- [read_write](#read_write)
- [replica_count](#replica_count)
- [shrink](#shrink)
- [close](#close)
- [open](#open)
- [delete](#delete)
- [rollover](#rollover)
- [notification](#notification)
- [snapshot](#snapshot)
- [index_priority](#index_priority)
- [allocation](#allocation)
- [rollup](#rollup)

### force_merge

Reduces the number of Lucene segments by merging the segments of individual shards. This operation attempts to set the index to a `read-only` state before starting the merging process.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`max_num_segments` | The number of segments to reduce the shard to. | `number` | Yes
wait_for_completion | Boolean | When set to `false`, the request returns immediately instead of after the operation is finished. To monitor the operation status, use the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/) with the task ID returned by the request. Default is `true`.
task_execution_timeout | Time | The explicit task execution timeout. Only useful when wait_for_completion is set to `false`. Default is `1h`. | No

```json
{
  "force_merge": {
    "max_num_segments": 1
  }
}
```

### read_only

Sets a managed index to be read only.

```json
{
  "read_only": {}
}
```

Set the index setting `index.blocks.write` to `true` for a managed index. ***Note:** this block does not prevent the index from refreshing.

### read_write

Sets a managed index to be writeable.

```json
{
  "read_write": {}
}
```

### replica_count

Sets the number of replicas to assign to an index.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`number_of_replicas` | Defines the number of replicas to assign to an index. | `number` | Yes

```json
{
  "replica_count": {
    "number_of_replicas": 2
  }
}
```

For information about setting replicas, see [Primary and replica shards]({{site.url}}{{site.baseurl}}/opensearch#primary-and-replica-shards).

### shrink

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
    "force_unsafe": false
}
```

Parameter | Description | Type | Example | Required
:--- | :--- |:--- |:--- |
`num_new_shards` | The maximum number of primary shards in the shrunken index. | integer | `5` | Yes, however it cannot be used with `max_shard_size` or `percentage_of_source_shards`
`max_shard_size` | The maximum size in bytes of a shard for the target index. | keyword | `5gb` | Yes, however it cannot be used with `num_new_shards` or `percentage_of_source_shards`
`percentage_of_source_shards` | Percentage of the number of original primary shards to shrink. This parameter indicates the minimum percentage to use when shrinking the number of primary shards. Must be between 0.0 and 1.0, exclusive.  | Percentage | `0.5` | Yes, however it cannot be used with `max_shard_size` or `num_new_shards`
`target_index_name_template` | The name of the shrunken index. Accepts strings and the Mustache variables `{{ctx.index}}` and `{{ctx.indexUuid}}`. | `string` or Mustache template | `{"source": "{{ctx.index}}_shrunken"}` | No
`aliases` | Aliases to add to the new index. | object | `myalias` | No, but must be an array of alias objects
`force_unsafe` | If true, executes the shrink action even if there are no replicas. | boolean | `false` | No

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

### close

Closes the managed index.

```json
{
  "close": {}
}
```

Closed indexes remain on disk, but consume no CPU or memory. You can't read from, write to, or search closed indexes.

Closing an index is a good option if you need to retain data for longer than you need to actively search it and have sufficient disk space on your data nodes. If you need to search the data again, reopening a closed index is simpler than restoring an index from a snapshot.

### open

Opens a managed index.

```json
{
  "open": {}
}
```

### delete

Deletes a managed index.

```json
{
  "delete": {}
}
```

### rollover

Rolls an alias over to a new index when the managed index meets one of the rollover conditions.

ISM checks the conditions for operations on **every execution of the policy** based on the **set interval**, _not_ continuously. The rollover will be performed if the value **has reached** or _has exceeded_ the configured limit **when the check is performed**. For example with `min_size` configured to a value of 100GiB, ISM might check the index at 99 GiB and not perform the rollover. However, if the index has grown past the limit (e.g., 105GiB) by the next check, the operation is performed.

If you need to skip the rollover action, you can set the index setting `index.plugins.index_state_management.rollover_skip` to `true`. For example, if you receive the error message "Missing alias or not the write index...", you can set the `index.plugins.index_state_management.rollover_skip` parameter to `true` and retry to skip rollover action.

The index format must match the pattern: `^.*-\d+$`. For example, `(logs-000001)`.
Set `index.plugins.index_state_management.rollover_alias` as the alias to rollover.

Parameter | Description | Type | Example | Required
:--- | :--- |:--- |:--- |
`min_size` | The minimum size of the total primary shard storage (not counting replicas) required to roll over the index. For example, if you set `min_size` to 100 GiB and your index has 5 primary shards and 5 replica shards of 20 GiB each, the total size of all primary shards is 100 GiB, so the rollover occurs. See **Important** note above. | `string` | `20gb` or `5mb` | No
`min_primary_shard_size` | The minimum storage size of a **single primary shard** required to roll over the index. For example, if you set `min_primary_shard_size` to 30 GiB and **one of** the primary shards in the index has a size greater than the condition, the rollover occurs. See **Important** note above. | `string` | `20gb` or `5mb` | No
`min_doc_count` |  The minimum number of documents required to roll over the index. See **Important** note above. | `number` | `2000000` | No
`min_index_age` |  The minimum age required to roll over the index. Index age is the time between its creation and the present. Supported units are `d` (days), `h` (hours), `m` (minutes), `s` (seconds), `ms` (milliseconds), and `micros` (microseconds). See **Important** note above. | `string` | `5d` or `7h` | No
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

### notification

Sends you a notification.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`destination` | The destination URL. | `Slack, Amazon Chime, or webhook URL` | Yes
`message_template` |  The text of the message. You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). | `object` | Yes

The destination system **must** return a response otherwise the notification operation throws an error.

#### Example 1: Chime notification

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

#### Example 2: Custom webhook notification

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

#### Example 3: Slack notification

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

#### Guaranteed variables

Parameter | Description | Type
:--- | :--- |:--- |:--- |
`index` | The name of the index. | `string`
`index_uuid` | The uuid of the index. | `string`
`policy_id` | The name of the policy. | `string`

### snapshot

Back up your cluster’s indexes and state. For more information about snapshots, see [Take and restore snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore).

The `snapshot` operation has the following parameters:

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`repository` | The repository name that you register through the native snapshot API operations.  | `string` | Yes | -
`snapshot` | The name of the snapshot. Accepts strings and the Mustache variables `{{ctx.index}}` and `{{ctx.indexUuid}}`. If the Mustache variables are invalid, then the snapshot name defaults to the index's name. | `string` or Mustache template | Yes | -

```json
{
  "snapshot": {
    "repository": "my_backup",
    "snapshot": "{{ctx.indexUuid}}"
  }
}
```

### index_priority

Set the priority for the index in a specific state. Unallocated shards of indexes are recovered in the order of their priority, whenever possible. The indexes with higher priority values are recovered first followed by the indexes with lower priority values.

The `index_priority` operation has the following parameter:

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |:---
`priority` | The priority for the index as soon as it enters a state. | `number` | Yes | 1

```json
"actions": [
  {
    "index_priority": {
      "priority": 50
    }
  }
]
```

### allocation

Allocate the index to a node with a specific attribute set [like this]({{site.url}}{{site.baseurl}}/opensearch/cluster/#advanced-step-7-set-up-a-hot-warm-architecture).
For example, setting `require` to `warm` moves your data only to "warm" nodes.

The `allocation` operation has the following parameters:

Parameter | Description | Type | Required
:--- | :--- |:--- |:---
`require` | Allocate the index to a node with a specified attribute. | `string` | Yes
`include` | Allocate the index to a node with any of the specified attributes. | `string` | Yes
`exclude` | Don’t allocate the index to a node with any of the specified attributes. | `string` | Yes
`wait_for` | Wait for the policy to execute before allocating the index to a node with a specified attribute. | `string` | Yes

```json
"actions": [
  {
    "allocation": {
      "require": { "temp": "warm" }
    }
  }
]
```

### rollup

[Index rollup]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/) lets you periodically reduce data granularity by rolling up old data into summarized indexes.

Rollup jobs can be continuous or non-continuous. A rollup job created using an ISM policy can only be non-continuous.
{: .note }

#### Path and HTTP methods

````bash
PUT _plugins/_rollup/jobs/<rollup_id>
GET _plugins/_rollup/jobs/<rollup_id>
DELETE _plugins/_rollup/jobs/<rollup_id>
POST _plugins/_rollup/jobs/<rollup_id>/_start
POST _plugins/_rollup/jobs/<rollup_id>/_stop
GET _plugins/_rollup/jobs/<rollup_id>/_explain
````

#### Sample ISM rollup policy

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

#### Request fields

Request fields are required when creating an ISM policy. You can reference the [Index rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/rollup-api/#create-or-update-an-index-rollup-job) page for request field options.

#### Adding a rollup policy in Dashboards

To add a rollup policy in Dashboards, follow the steps below.

- Select the menu button on the top-left of the Dashboards user interface.
- In the Dashboards menu, select `Index Management`.
- On the next screen select `Rollup jobs`.
- Select the `Create rollup` button.
- Follow the steps in the `Create rollup job` wizard.
- Add a name for the policy in the `Name` box.
- You can reference the [Index rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/rollup-api/#create-or-update-an-index-rollup-job) page to configure the rollup policy.
- Finally, select the `Create` button on the bottom-right of the Dashboards user interface.

---

## Transitions

Transitions define the conditions that need to be met for a state to change. After all actions in the current state are completed, the policy starts checking the conditions for transitions.

ISM evaluates transitions in the order in which they are defined. For example, if you define transitions: [A,B,C,D], ISM iterates through this list of transitions until it finds a transition that evaluates to `true`, it then stops and sets the next state to the one defined in that transition. On its next execution, ISM dismisses the rest of the transitions and starts in that new state.

If you don't specify any conditions in a transition and leave it empty, then it's assumed to be the equivalent of always true. This means that the policy transitions the index to this state the moment it checks.

This table lists the parameters you can define for transitions.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`state_name` |  The name of the state to transition to if the conditions are met. | `string` | Yes
`conditions` |  List the conditions for the transition. | `list` | Yes

The `conditions` object has the following parameters:

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`min_index_age` | The minimum age of the index required to transition. | `string` | No
`min_rollover_age` | The minimum age required after a rollover has occurred to transition to the next state. | `string` | No
`min_doc_count` | The minimum document count of the index required to transition. | `number` | No
`min_size` | The minimum size of the total primary shard storage (not counting replicas) required to transition. For example, if you set `min_size` to 100 GiB and your index has 5 primary shards and 5 replica shards of 20 GiB each, the total size of all primary shards is 100 GiB, so your index is transitioned to the next state. | `string` | No
`cron` | The `cron` job that triggers the transition if no other transition happens first. | `object` | No
`cron.cron.expression` | The `cron` expression that triggers the transition. | `string` | Yes
`cron.cron.timezone` | The timezone that triggers the transition. | `string` | Yes

The following example transitions the index to a `cold` state after a period of 30 days:

```json
"transitions": [
  {
    "state_name": "cold",
    "conditions": {
      "min_index_age": "30d"
    }
  }
]
```

ISM checks the conditions on every execution of the policy based on the set interval.

This example uses the `cron` condition to transition indexes every Saturday at 5:00 PT:

```json
"transitions": [
  {
    "state_name": "cold",
    "conditions": {
      "cron": {
        "cron": {
          "expression": "* 17 * * SAT",
          "timezone": "America/Los_Angeles"
        }
      }
    }
  }
]
```

Note that this condition does not execute at exactly 5:00 PM; the job still executes based off the `job_interval` setting. Due to this variance in start time and the amount of time that it can take for actions to complete prior to checking transition conditions, we recommend against overly narrow cron expressions. For example, don't use `15 17 * * SAT` (5:15 PM on Saturday).

A window of an hour, which this example uses, is generally sufficient, but you might increase it to 2--3 hours to avoid missing the window and having to wait a week for the transition to occur. Alternately, you could use a broader expression such as `* * * * SAT,SUN` to have the transition occur at any time during the weekend.

For information on writing cron expressions, see [Cron expression reference]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/).

---

## Error notifications

The `error_notification` operation sends you a notification if your managed index fails.
It notifies a single destination or [notification channel]({{site.url}}{{site.baseurl}}/notifications-plugin/index) with a custom message.

Set up error notifications at the policy level:

```json
{
  "policy": {
    "description": "hot warm delete workflow",
    "default_state": "hot",
    "schema_version": 1,
    "error_notification": { },
    "states": [ ]
  }
}
```

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`destination` | The destination URL. | `Slack, Amazon Chime, or webhook URL` | Yes if `channel` isn't specified
`channel` | A notification channel's ID | `string` | Yes if `destination` isn't specified
`message_template` |  The text of the message. You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). | `object` | Yes

The destination system **must** return a response otherwise the `error_notification` operation throws an error.

#### Example 1: Chime notification

```json
{
  "error_notification": {
    "destination": {
      "chime": {
        "url": "<url>"
      }
    },
    "message_template": {
      "source": "The index {% raw %}{{ctx.index}}{% endraw %} failed during policy execution."
    }
  }
}
```

#### Example 2: Custom webhook notification

```json
{
  "error_notification": {
    "destination": {
      "custom_webhook": {
        "url": "https://<your_webhook>"
      }
    },
    "message_template": {
      "source": "The index {% raw %}{{ctx.index}}{% endraw %} failed during policy execution."
    }
  }
}
```

#### Example 3: Slack notification

```json
{
  "error_notification": {
    "destination": {
      "slack": {
        "url": "https://hooks.slack.com/services/xxx/xxxxxx"
      }
    },
    "message_template": {
      "source": "The index {% raw %}{{ctx.index}}{% endraw %} failed during policy execution."
    }
  }
}
```

#### Example 4: Using a notification channel

```json
{
  "error_notification": {
    "channel": {
      "id": "some-channel-config-id"
    },
    "message_template": {
      "source": "The index {% raw %}{{ctx.index}}{% endraw %} failed during policy execution."
    }
  }
}
```

You can use the same options for `ctx` variables as the [notification](#notification) operation.

## Sample policy with ISM template for auto rollover

The following sample template policy is for a rollover use case.

If you want to skip rollovers for an index, set `index.plugins.index_state_management.rollover_skip` to `true` in the settings of that index.

1. Create a policy with an `ism_template` field:

   ```json
   PUT _plugins/_ism/policies/rollover_policy
   {
     "policy": {
       "description": "Example rollover policy.",
       "default_state": "rollover",
       "states": [
         {
           "name": "rollover",
           "actions": [
             {
               "rollover": {
                 "min_doc_count": 1
               }
             }
           ],
           "transitions": []
         }
       ],
       "ism_template": {
         "index_patterns": ["log*"],
         "priority": 100
       }
     }
   }
   ```

   You need to specify the `index_patterns` field. If you don't specify a value for `priority`, it defaults to 0.

2. Set up a template with the `rollover_alias` as `log` :

   ```json
   PUT _index_template/ism_rollover
   {
     "index_patterns": ["log*"],
     "template": {
      "settings": {
       "plugins.index_state_management.rollover_alias": "log"
      }
    }
   }
   ```

3. Create an index with the `log` alias:

   ```json
   PUT log-000001
   {
     "aliases": {
       "log": {
         "is_write_index": true
       }
     }
   }
   ```

4. Index a document to trigger the rollover condition:

   ```json
   POST log/_doc
   {
     "message": "dummy"
   }
   ```

5. Verify if the policy is attached to the `log-000001` index:

   ```json
   GET _plugins/_ism/explain/log-000001?pretty
   ```

## Example policy with ISM templates for the alias action

The following example policy is for an alias action use case.

In the following example, the first job will trigger the rollover action, and a new index will be created. Next, another document is added to the two indexes. The new job will then cause the second index to point to the log alias, and the older index will be removed due to the alias action.

First, create an ISM policy:

```json
PUT /_plugins/_ism/policies/rollover_policy?pretty
{
  "policy": {
    "description": "Example rollover policy.",
    "default_state": "rollover",
    "states": [
      {
        "name": "rollover",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 1
            }
          }
        ],
        "transitions": [{
            "state_name": "alias",
            "conditions": {
              "min_doc_count": "2"
            }
          }]
      },
      {
        "name": "alias",
        "actions": [
          {
            "alias": {
              "actions": [
                {
                  "remove": {
                      "alias": "log"
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    "ism_template": {
      "index_patterns": ["log*"],
      "priority": 100
    }
  }
}
```

Next, create an index template on which to enable the policy:

```json
PUT /_index_template/ism_rollover?
{
  "index_patterns": ["log*"],
  "template": {
   "settings": {
    "plugins.index_state_management.rollover_alias": "log"
   }
 }
}
```
{% include copy-curl.html %}

Next, change the cluster settings to trigger jobs every minute:

```json
PUT /_cluster/settings?pretty=true
{
  "persistent" : {
    "plugins.index_state_management.job_interval" : 1
  }
}
```
{% include copy-curl.html %}

Next, create a new index:

```json
PUT /log-000001
{
  "aliases": {
    "log": {
      "is_write_index": true
    }
  }
}
```
{% include copy-curl.html %}

Finally, add a document to the index to trigger the job:

```json
POST /log-000001/_doc
{
  "message": "dummy"
}
```
{% include copy-curl.html %}

You can verify these steps using the Alias and Index API:

```json
GET /_cat/indices?pretty
```
{% include copy-curl.html %}

```json
GET /_cat/aliases?pretty
```
{% include copy-curl.html %}

Note: The `index` and `remove_index` parameters are not allowed with alias action policies. Only the `add` and `remove` alias action parameters are allowed.
{: .warning }

## Example policy

The following example policy implements a `hot`, `warm`, and `delete` workflow. You can use this policy as a template to prioritize resources to your indexes based on their levels of activity.

In this case, an index is initially in a `hot` state. After a day, it changes to a `warm` state, where the number of replicas increases to 5 to improve the read performance.

After 30 days, the policy moves this index into a `delete` state. The service sends a notification to a Chime room that the index is being deleted, and then permanently deletes it.

```json
{
  "policy": {
    "description": "hot warm delete workflow",
    "default_state": "hot",
    "schema_version": 1,
    "states": [
      {
        "name": "hot",
        "actions": [
          {
            "rollover": {
              "min_index_age": "1d",
              "min_primary_shard_size": "30gb"
            }
          }
        ],
        "transitions": [
          {
            "state_name": "warm"
          }
        ]
      },
      {
        "name": "warm",
        "actions": [
          {
            "replica_count": {
              "number_of_replicas": 5
            }
          }
        ],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "30d"
            }
          }
        ]
      },
      {
        "name": "delete",
        "actions": [
          {
            "notification": {
              "destination": {
                "chime": {
                  "url": "<URL>"
                }
              },
              "message_template": {
                "source": "The index {% raw %}{{ctx.index}}{% endraw %} is being deleted"
              }
            }
          },
          {
            "delete": {}
          }
        ]
      }
    ],
    "ism_template": {
      "index_patterns": ["log*"],
      "priority": 100
    }
  }
}
```

This diagram shows the `states`, `transitions`, and `actions` of the above policy as a finite-state machine. For more information about finite-state machines, see [Wikipedia](https://en.wikipedia.org/wiki/Finite-state_machine).

![Policy State Machine]({{site.baseurl}}/images/ism.png)
