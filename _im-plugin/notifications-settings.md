---
layout: default
title: Notification settings
nav_order: 100
---

# Notification settings

Introduced 2.8
{: .label .label-purple }

You can use notification settings to configure notifications about long-running index operations. Set up automatic [notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) when long-running index operations are complete by [using Notifications in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/notifications/) or through the API.

Configuring notification settings is useful for long-running index operations, such as `open`, `reindex`, `resize`, and `force merge`. When you send a request for those operations and set the `wait_for_completion` parameter to `false`, the operation returns immediately and the response contains a task ID. You can use that task ID to configure notifications for this operation.

## Configuring notification settings

You can configure long-running operation notifications through the API by using the `task_id` and `action_name` parameters:

- **One-time setting**: If you pass `task_id` in the `lron_config` object, the task runs one time and the setting is automatically deleted when the task ends. If you pass both `task_id` and `action_name`, `action_name` is ignored but may be useful to you for searching and debugging notification settings.
- **Global, persistent setting**: If you pass `action_name` and not `task_id` in the `lron_config` object, the task is global and persistent and applies to all operations of this action type.

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

### Notification setting ID

The response returns an ID for the notification setting in the `_id` field. You can use this ID to read, update, or delete this notification setting. For a global `lron_config`, the ID is in the form `LRON:<action_name>` (for example, `LRON:indices:data/write/reindex`). 

The `action_name` may contain a slash character (`/`), which must be HTTP encoded as `%2F` if you use it the Dev Tools console. For example, `LRON:indices:data/write/reindex` becomes `LRON:indices:data%2Fwrite%2Freindex`.
{: .important}

For a task `lron_config`, the ID is in the form `LRON:<task ID>`.

## Retrieve notification settings 

The following examples retrieve the current configured notification settings. 

Use the following request to retrieve a notification setting with the specified [notification setting ID](#notification-setting-id):

```json
 GET /_plugins/_im/lron/<lronID>
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
DELETE /_plugins/_im/lron/<lronID>
```
{% include copy-curl.html %}

For example, the following request deletes the notification setting for the `reindex` operation:

```json
DELETE _plugins/_im/lron/LRON:indices:data%2Fwrite%2Freindex
```
{% include copy-curl.html %}

## Next steps

- Learn more about the [ISM API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/).
- Learn more about the [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) application. 
