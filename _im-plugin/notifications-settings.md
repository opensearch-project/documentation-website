---
layout: default
title: Configuring notifications settings
parent: Managing indexes
nav_order: 100
---

## Configuring notifications settings

Introduced 2.8
{: .label .label-purple }

Notifications settings allow users to control how they receive notifications about index events. You can use either OpenSearch Dashboards or the REST API to configure notifications. Supported communication channels include Amazon Chime, Amazon Simple Notification Service (Amazon SNS), Amazon Simple Email Service (Amazon SES), email through SMTP, Slack, and custom webhooks. Supported index operations include resize, reindex, open, and force merge. See [Notifications](https://opensearch.org/docs/latest/observing-your-data/notifications/index/) for further details. 

To configure configure the notifications settings for long-running index operations using OpenSearch Dashboards, go to **Dev Tools** under the main menu. When creating notifications using the API, the LRON setting can be configured two ways: as a concrete task or as a global and persistent task. The LRON setting with `task_id` is ad hoc and automatically deletes when the task ends. The LRON setting using `action_name` is global and persists and applies to all operations of this action type.

## Create, read, update, and delete (CRUD) operations

The following examples show how to configure notifications settings for long-running index operations.

### Create 

The following example request creates the notification using the `channels` field:

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
