---
layout: default
title: Notification settings
parent: Managing indexes
nav_order: 100
---

# Notification settings

Introduced 2.8
{: .label .label-purple }

Notification settings allow users to control how they receive notifications about index events. Set up automatic [notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) when long-running index operations are complete by [using Notifications in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/notifications/) or through the API.

Configuring notification settings is useful for long-running index operations, such as `open`, `reindex`, `resize`, and `force merge`. When you send a request for those operations and set the `wait_for_completion` parameter to `false`, the operation will return immediately and the response will contain a task ID.  

## Configuring notification settings

When creating long-running operation notifications using the API, you can configure the `lron_config` using the `task_id` and `action_name` parameters as follows:

- **One-time task**: If you pass a `task_id` in the `lron_config` object, the task is one-time and the setting is automatically deleted when the task ends. If you pass both `task_id` and `action_name`, `action_name` is ignored but may be useful to you for searching and debugging notification settings.
- **Global, persistent task**: If you pass an `action_name` and don't pass a `task_id` in the `lron_config` object, the task is global, persistent, and applies to all operations of this action type.

The following table lists the parameters for long-running index operations. 

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `lron_config` | Object | Long-running index operation notification configuration. |
| `task_id` | String | The task ID of the task that you want to be notified about. Optional. One of `task_id` and `action_name` must be specified.|
| `action_name` | String | The operation type that you want to be notified about. Provide `action_name` but not `task_id` to be notified of all operations of this type. Supported values are `indices:data/write/reindex`, `indices:admin/resize`, `indices:admin/forcemerge`, and `indices:admin/open`. Optional. One of `task_id` and `action_name` must be specified. |
| `lron_condition` | Object | Specifies which events you want to be notified about. Optional. If not provided, you'll be notified of the operation success and failure. |
| `lron_condition.success` | Boolean | Set to `true` to be notified when the operation succeeds. Optional. Default is `true`. |
| `lron_condition.failure` | Boolean | Set to `true` to be notified when the operation fails or times out. Optional. Default is `true`. |
| `channels` | Object | Supported communication channels include Amazon Chime, Amazon Simple Notification Service (Amazon SNS), Amazon Simple Email Service (Amazon SES), email through SMTP, Slack, and custom webhooks. If either `lron_condition.success` or `lron_condition.failure` is `true`, `channels` must contain at least one channel. |

## Create notification settings 

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

### Notification settings ID

The response returns an ID for the notification settings in the `_id` field. You can use this ID to read, update, or delete these notification settings. For global `lron_config`, the ID is in the form `LRON:<action_name>` (for example, `LRON:indices:data/write/reindex`). 

Because `action_name` may contain a slash character (`/`), the slash must be HTTP encoded if you use it the Dev Tools console. Use `%2F` in place of the slash. For example, `LRON:indices:data/write/reindex` becomes `LRON:indices:data%2Fwrite%2Freindex`.
{: .important}

For a task `lron_config`, the ID is in the form `LRON:<task ID>`.

## Read notification settings 

The following examples retrieve the current notification settings for a user or group. This information can be used to determine what types of notifications the user or group is currently receiving, and to make changes to the notification settings as needed. 

Use the following request to retrieve notification settings with the specified [notification settings ID](#notification-settings-id):

```json
 GET /_plugins/_im/lron/<lronID>
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
      "_id": "LRON:dQlcQ0hQS2mwF-AQ7icCMw:12354",
      "lron_config": {
           xxxxxxxxx
      }
    },
   {
      "_id": "LRON:dQlcQ0hQS2mwF-AQ7icCMw:12355",
      "lron_config": {
           xxxxxxxxx
      }
    }
  ],
  "total_number": 2
}
```

## Update notification settings 

The following example modifies existing notifications settings with the specified [notification settings ID](#notification-settings-id):

```json
PUT /_plugins/_im/lron/<lronID>
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

The response contains the updated settings:

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

The following example shows how to remove a notifications settings with the specified [notification settings ID](#notification-settings-id):

```json
DELETE /_plugins/_im/lron/<lronID>
```
{% include copy-curl.html %}

## Next steps

- Learn more about the [ISM API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/).
- Learn more about the [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) application. 
