---
layout: default
title: Long-running operation notifications
nav_order: 70
redirect_from:
  - /im-plugin/notifications/
  - /dashboards/im-dashboards/notifications/
  - /dashboards/admin-ui-index/notifications/
---

# Long-running operation notifications

Introduced 2.8
{: .label .label-purple }

Reindex, resize, force merge, and open operations can run for minutes or hours. When you send one of these requests with `wait_for_completion` set to `false`, it returns a task ID immediately instead of blocking. Configure a notification against that task ID, or against the operation type, to be told when the work finishes or fails rather than polling for it.

Notifications are delivered through the channels configured in the [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) application, which supports Amazon Chime, Amazon Simple Notification Service (Amazon SNS), Amazon Simple Email Service (Amazon SES), email through SMTP, Slack, and custom webhooks.

## Configuring notification settings

An `lron_config` object takes either a `task_id` or an `action_name`, and the choice determines how long the setting lives:

- Provide `task_id` for a one-time setting. It is deleted automatically when the task ends. If you provide both `task_id` and `action_name`, `action_name` is ignored, though it can help you search for and debug your notification settings.
- Provide `action_name` without `task_id` for a global, persistent setting that applies to every operation of that type.

The following table lists the parameters for long-running index operation notifications. 

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `lron_config` | Object | Long-running index operation notification configuration. |
| `task_id` | String | The task ID of the task that you want to be notified about. Optional. One of `task_id` and `action_name` must be specified.|
| `action_name` | String | The operation type that you want to be notified about. Provide `action_name` but not `task_id` to be notified of all operations of this type. Supported values are `indices:data/write/reindex`, `indices:admin/resize`, `indices:admin/forcemerge`, and `indices:admin/open`. Optional. One of `task_id` and `action_name` must be specified. |
| `lron_condition` | Object | Specifies which events you want to be notified about. Optional. If not provided, you'll be notified of both the operation success and failure. |
| `lron_condition.success` | Boolean | Set this parameter to `true` to be notified when the operation succeeds. Optional. Default is `true`. |
| `lron_condition.failure` | Boolean | Set this parameter to `true` to be notified when the operation fails or times out. Optional. Default is `true`. |
| `channels` | Object | Supported communication channels include Amazon Chime, Amazon Simple Notification Service (Amazon SNS), Amazon Simple Email Service (Amazon SES), email through SMTP, Slack, and custom webhooks. If either `lron_condition.success` or `lron_condition.failure` is `true`, `channels` must contain at least one channel. Learn how to configure notification channels in [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/). |

### Create notification settings 

The following example request sets up notifications on a failure of a reindex task:

```json
POST /_plugins/_im/lron
{
  "lron_config": {
      "task_id":"dQlcQ0hQS2mwF-AQ7icCMw:12354",
      "action_name":"indices:data/write/reindex",
      "lron_condition": {
        "success": false,
        "failure": true
      },
      "channels":[
          {"id":"channel1"},
          {"id":"channel2"}
      ]
  }
}
```
{% include copy-curl.html %}

The preceding request results in the following response:

```json
{
  "_id": "LRON:dQlcQ0hQS2mwF-AQ7icCMw:12354",
  "lron_config": {
    "lron_condition": {
      "success": false,
      "failure": true
    },
    "task_id": "dQlcQ0hQS2mwF-AQ7icCMw:12354",
    "action_name": "indices:data/write/reindex",
    "channels": [
      {
        "id": "channel1"
      },
      {
        "id": "channel2"
      }
    ]
  }
}
```

### Notification setting ID

The response returns an ID for the notification setting in the `_id` field. You can use this ID to read, update, or delete this notification setting. For a global `lron_config`, the ID is in the form `LRON:<action_name>` (for example, `LRON:indices:data/write/reindex`). 

The `action_name` may contain a slash character (`/`), which must be HTTP encoded as `%2F` if you use it the Dev Tools console. For example, `LRON:indices:data/write/reindex` becomes `LRON:indices:data%2Fwrite%2Freindex`.
{: .important}

For a task `lron_config`, the ID is in the form `LRON:<task ID>`.

## Retrieve notification settings 

The following examples retrieve the current configured notification settings. 

Use the following request to retrieve a notification setting with the specified [notification setting ID](#notification-setting-id):

```json
 GET /_plugins/_im/lron/{lronID}
```
{% include copy-curl.html %}

For example, the following request retrieves the notification setting for the `reindex` operation:

```json
{
  "lron_configs": [
    {
      "_id": "LRON:indices:data/write/reindex",
      "lron_config": {
        "lron_condition": {
          "success": false,
          "failure": true
        },
        "action_name": "indices:data/write/reindex",
        "channels": [
          {
            "id": "my_chime"
          }
        ]
      }
    }
  ],
  "total_number": 1
}
```
{% include copy-curl.html %}

Use the following request to retrieve all notification settings:

```json
GET /_plugins/_im/lron
```
{% include copy-curl.html %}

The response contains all configured notification settings with their IDs: 

```json
{
  "lron_configs": [
    {
      "_id": "LRON:indices:admin/open",
      "lron_config": {
        "lron_condition": {
          "success": false,
          "failure": false
        },
        "action_name": "indices:admin/open",
        "channels": []
      }
    },
    {
      "_id": "LRON:indices:data/write/reindex",
      "lron_config": {
        "lron_condition": {
          "success": false,
          "failure": true
        },
        "action_name": "indices:data/write/reindex",
        "channels": [
          {
            "id": "my_chime"
          }
        ]
      }
    }
  ],
  "total_number": 2
}
```

## Update notification settings 

The following example modifies an existing notification setting with the specified [notification setting ID](#notification-setting-id):

```json
PUT /_plugins/_im/lron/{lronID}
{
  "lron_config": {
      "task_id":"dQlcQ0hQS2mwF-AQ7icCMw:12354",
      "action_name":"indices:data/write/reindex",
      "lron_condition": {
        "success": false,
        "failure": true
      },
      "channels":[
          {"id":"channel1"},
          {"id":"channel2"}
      ]
  }
}
```
{% include copy-curl.html %}

The response contains the updated setting:

```json
{
  "_id": "LRON:dQlcQ0hQS2mwF-AQ7icCMw:12354",
  "lron_config": {
    "lron_condition": {
      "success": false,
      "failure": true
    },
    "task_id": "dQlcQ0hQS2mwF-AQ7icCMw:12354",
    "action_name": "indices:data/write/reindex",
    "channels": [
      {
        "id": "channel1"
      },
      {
        "id": "channel2"
      }
    ]
  }
}
```

## Delete notification settings 

The following example removes a notifications setting with the specified [notification setting ID](#notification-setting-id):

```json
DELETE /_plugins/_im/lron/{lronID}
```
{% include copy-curl.html %}

For example, the following request deletes the notification setting for the `reindex` operation:

```json
DELETE _plugins/_im/lron/LRON:indices:data%2Fwrite%2Freindex
```
{% include copy-curl.html %}

## Notifications in OpenSearch Dashboards

To reach the **Index Management** page, go to **Management > Index Management** on the top menu.

### Creating a notification channel

A notification setting needs at least one channel to deliver to:

1. In **Index Management**, select **Manage channels**. The **Channels** page opens in a separate window.
1. Select **Create channel**.
1. Enter a name for the channel and, optionally, a description.
1. In **Configurations**, select a **Channel type**. The settings that follow depend on the type: an email channel asks for a sender type, a sender, and recipients, while a Slack channel asks for a webhook URL.
1. Enter the settings for the channel type.
1. Optionally, select **Send test message** to confirm that the channel works.
1. Select **Create**.

### Setting defaults for all operations

Default settings apply to every reindex, shrink, split, clone, force merge, and open operation in the cluster:

1. In **Index Management**, select **Notification settings**.
1. In **Defaults for index operations**, select **Has failed**, **Has completed**, or both for each of **Reindex**, **Shrink, split, clone**, **Force merge**, and **Open**.
1. For each operation that you selected a notification for, select one or more channels from **Notification channels**.
1. Select **Save**.

Viewing or changing default notification settings requires permission to read them.

### Sending additional notifications

Reindex, split, shrink, and force merge operations can carry their own notification settings in addition to the defaults:

1. In **Index Management**, select **Indexes**.
1. Select the index that the operation applies to.
1. Select **Actions**, and then select the operation, such as **Reindex**.
1. Expand **Advanced settings**. The **Notifications** section lists the defaults currently in effect.
1. Select **Send additional notifications**.
1. Select **Has failed / timed out**, **Has completed**, or both.
1. Select a channel from **Notification channels**.
1. Select the button for the operation, such as **Reindex**.

## Related documentation

- [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/)
- [Index maintenance]({{site.url}}{{site.baseurl}}/im-plugin/index-maintenance/)
- [Reindexing data]({{site.url}}{{site.baseurl}}/im-plugin/reindex-data/)
- [ISM API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/)
