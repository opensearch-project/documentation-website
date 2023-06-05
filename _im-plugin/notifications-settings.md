---
layout: default
title: Configuring notifications settings
parent: Managing indexes
nav_order: 100
---

## Configuring notifications settings

Introduced 2.8
{: .label .label-purple }

Notifications settings allow users to control how they receive notifications about index events. You can use either OpenSearch Dashboards or the REST API to configure notifications. Supported communication channels include Amazon Chime, Amazon Simple Notification Service (Amazon SNS), Amazon Simple Email Service (Amazon SES), email through SMTP, Slack, and custom webhooks. Supported index operations include resize, reindex, open, and force merge. See [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) and [Configuring notifications through Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/notifications) for further details. 

Configuring notifications settings is useful for long-running index operations. When creating long-running operation notifications using the API, you can configure the `lron_config` setting in two ways:

- As a one-time task: If you pass a `task_id` in the `lron_config` object, the task is one-time and the setting automatically deletes when the task ends.
- As a global and persistent task: If you pass an `action_name` in the `lron_config` object, the task is global, persistent, and applies to all operations of this action type.

## Create, read, update, and delete (CRUD) operations

The following examples show how to configure notifications settings for long-running index operations.

### Create 

The following example request creates the notification:

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

which results in the following response: 

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

## Read

The following examples retrieve the current notifications settings for a user or group. This information can be used to determine what types of notifications the user or group is currently receiving, and to make changes to the notifications settings as needed. 


The following example shows how to get one document:

```json
 GET /_plugins/_im/lron/<lronID>
```

The following example shows how to get all documents:

```bash
GET /_plugins/_im/lron
```

which result in the following response: 

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

## Update

The following example modifies an existing notifications setting:

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

which results in the following response:

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

## Delete 

The following example shows how to remove a notifications setting:

```json
DELETE /_plugins/_im/lron/<lronID>
```

## Next steps

- Learn more about the [ISM API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/).
- Learn more about the [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) application. 
