---
layout: default
title: Policies
nav_order: 10
parent: Index State Management
has_children: true
---

# ISM policies

Policies are entities (stored as JSON documents) that define the following:

- The *states* that an index can be in, including the default state for new indexes. For example, you might name your states "hot," "warm," "delete," and so on. For more information, see [States](#states).
- Any *actions* that you want the plugin to take when an index enters a state, such as performing a rollover. For more information, see [Actions](#actions).
- The conditions that must be met for an index to move into a new state, known as *transitions*. For example, if an index is more than eight weeks old, you might want to move it to the "delete" state. For more information, see [Transitions](#transitions).

Actions and transitions are associated with states. A condition (such as index size or age) triggers a transition to a new state, and entering a state triggers its actions. 

You have complete flexibility in the way you can design your policies. You can create any state, transition to any other state, and specify any number of actions in each state.

The following table lists the fields of a policy.

Field | Description | Type | Required | Read Only
:--- | :--- |:--- |:--- |
`policy_id` |  The name of the policy. | String | Yes | Yes
`description` |  A human-readable description of the policy. | String | Yes | No
`ism_template` | An ISM template to automatically apply the policy to the newly created index. | `nested list of objects` | No | No
`ism_template.index_patterns` | A pattern that matches the newly created index name. | `list of strings` | No | No
`ism_template.priority` | A priority used to choose which policy to apply when multiple policies match a newly created index name. | Integer | No | No
`last_updated_time`  |  The time the policy was last updated. | `timestamp` | Yes | Yes
`error_notification` |  The destination and message template for error notifications. The destination could be Amazon Chime, Slack, or a webhook URL. | `object` | No | No
`default_state` | The default starting state for each index that uses this policy. | String | Yes | No
`states` | The states that you define in the policy. | `nested list of objects` | Yes | No


## States

A state defines the status of a managed index. A managed index can be in only one state at a time. A state's actions are executed sequentially on entering a state. A state's transitions are checked periodically after all the actions have been completed.

The following table lists the parameters that you can define for a state.

Field | Description | Type | Required
:--- | :--- |:--- |:--- |
`name` |  The name of the state. | String | Yes
`actions` | The actions to execute after entering a state. For more information, see [Actions](#actions). | `nested list of objects` | Yes
`transitions` | The next states and the conditions required to transition to those states. If no transitions exist, the policy assumes that it's complete and can now stop managing the index. For more information, see [Transitions](#transitions). | `nested list of objects` | Yes


## Actions

Actions are [operations]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies-operations) that a policy can execute upon entering a specific state.

ISM executes actions in the order in which they are defined. If an action fails, the state actions are abandoned, and remaining actions are not executed.

For example, if you define actions `[A,B,C,D]`, ISM does the following:
1. Executes action `A`.
2. Sleeps for a period based on the cluster setting `plugins.index_state_management.job_interval`. 
3. Executes action `B`.

And so on.

If ISM cannot successfully execute action `A`, actions `B`, `C`, and `D` do not get executed.

Optionally, you can define an action's timeout period, which, if exceeded, forcibly fails the action. For example, if timeout is set to `1d`, and ISM has not completed the action within one day, even after retries, the action fails.

The following table lists the parameters that you can define for an action.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`timeout` |  The timeout period for the action. Accepts time units for minutes, hours, and days. | `time unit` | No | -
`retry` | The retry configuration for the action. | `object` | No | Specific to action

The `retry` operation has the following parameters.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`count` | The number of retry counts. | Integer | Yes | -
`backoff` | The backoff policy type to use when retrying. Valid values are Exponential, Constant, and Linear. | String | No | Exponential
`delay` | The time to wait between retries. Accepts time units for minutes, hours, and days. | `time unit` | No | 1 minute

### Example action

The following example `read_only` action has a timeout period of one hour. The policy retries this action three times with an exponential backoff policy, with a delay of 10 minutes between each retry:

```json
"actions": [
  {
    "timeout": "1h",
    "retry": {
      "count": 3,
      "backoff": "exponential",
      "delay": "10m"
    },
    "read_only": {}
  }
]
```

For a list of available unit types, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## Transitions

Transitions define the conditions that trigger a state to change. After all actions in the current state are completed, the policy starts checking the conditions for transitions.

ISM evaluates transitions in the order in which they are defined. It uses the first transition that evaluates to `true`.

If you don't specify any conditions in a transition, then it always evaluates to `true`. If the policy checks such a transition, it immediately transitions the index to the state defined in the transition.

For example, assume you've defined the transitions: `[A,B,C,D]`, and that transitions `A`, `B`, and `C` currently evaluate to `false` and that `D` has no conditions. ISM iterates through the list in order and sets the next state to the one defined in transition `D`. On its next execution, ISM starts in the state defined by `D`.

This table lists the parameters you can define for transitions.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`state_name` |  The name of the state to transition to if the conditions are met. | String | Yes
`conditions` |  List the conditions for the transition. | `list` | Yes

The `conditions` object has the following parameters.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`min_index_age` | The minimum age of the index required to transition. | String | No
`min_rollover_age` | The minimum age required after a rollover has occurred to transition to the next state. | String | No
`min_state_age` | The minimum amount of time the index must spend in the current state before transitioning. | String | No
`min_doc_count` | The minimum document count of the index required to transition. | Integer | No
`min_size` | The minimum size of the total primary shard storage (not counting replicas) required to transition. For example, if you set `min_size` to 100 GiB and your index has 5 primary shards and 5 replica shards of 20 GiB each, the total size of all primary shards is 100 GiB, so your index is transitioned to the next state. | String | No
`no_alias` | Controls transition based on alias presence. If `true`, transition occurs only when the index has **no aliases**. If `false`, transition occurs only when at least **one alias exists**. | `boolean` | No
`cron` | The `cron` job that triggers the transition if no other transition happens first. | `object` | No
`cron.cron.expression` | The `cron` expression that triggers the transition. | String | Yes
`cron.cron.timezone` | The time zone for the triggering `cron` expression triggers the transition. | String | Yes

All time-based values (`min_index_age`, `min_rollover_age`, `min_state_age`) use [standard OpenSearch time units]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units).
{: .note}


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

ISM checks the conditions on every execution of the policy based on the `job_interval` [setting]({{site.url}}{{site.baseurl}}/im-plugin/ism/settings/).

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

Note that this condition does not execute at exactly 5:00 PM; the job still executes as defined by the `job_interval` setting. Due to this variance in start time and the amount of time that it can take for actions to complete prior to checking transition conditions, we recommend against overly narrow cron expressions. For example, don't use `15 17 * * SAT` (5:15 PM on Saturday).

A window of an hour, which this example uses, is generally sufficient, but you might increase it to 2 or 3 hours to avoid missing the window and having to wait a week for the transition to occur. Alternately, you could use a broader expression such as `* * * * SAT,SUN` to have the transition occur at any time during the weekend.

For information about writing cron expressions, see the [Cron expression reference]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/).


## Error notifications

An error notification can be set up at the policy level as shown in the following example:

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

An `error_notification` sends a notification if your managed index fails.

An error notification sends to a single destination or [notification channel]({{site.url}}{{site.baseurl}}/notifications-plugin/index/) with a custom message.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`destination` | The destination URL. | `Slack, Amazon Chime, or webhook URL` | Yes if `channel` isn't specified
`channel` | A notification channel's ID | String | Yes if `destination` isn't specified
`message_template` |  The text of the message. You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). | `object` | Yes

The destination system **must** return a response otherwise the `error_notification` operation throws an error.

### Example 1: Chime notification

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

### Example 2: Custom webhook notification

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

### Example 3: Slack notification

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

### Example 4: Using a notification channel

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

You can use the same options for `ctx` variables as the [Notification]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies-operations/#notification) operation.

