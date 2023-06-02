---
layout: default
title: Configuring ISM notifications settings
parent: ISM API
grand_parent: Index State Management
nav_order: 10
---

## Configuring ISM notifications settings

Introduced 2.8
{: .label .label-purple }

Notifications settings are configured globally, so they do not need to be configured manually for each operation. Notifications settings allow users to control how they receive notifications about index events. For example, you can choose to receive email notifications, Slack channel notifications, or both. This documentation is intended for IT administrators as a guide to configuring notifications settings.

### Email notifications

When email notifications are enabled, you receive email notifications about index events. The email notifications are sent to the email address that is associated with the user's account.

### Slack channel notifications

When Slack channel notifications are enable, you recieve notifications in the designated Slack channel. For example, your OpenSearch domain must be able to connect to the internet to notify a Slack channel or send a custom webhook to a third-party server. The custom webhook must have a public IP address in order for an OpenSearch domain to send alerts to it.

## Create, read, update, and delete (CRUD) operations

The following code examples show how to configure notifications settings for monitoring long-running index operations.

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

The following GET request examples retrieve the current notifications settings for a user or group. This information can be used to determine what types of notifications the user or group is currently receiveing, and to make changes to the notifications settings as needed. 


Get one document

```bash
 GET /_plugins/_im/lron/{lronID}
```

Get all documents

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

The following code example modifies an existing notifications setting:

```json
PUT /_plugins/_im/lron/{lronID}
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

## Delete 

The following DELETE request example removes the notifications setting:

DELETE /_plugins/_im/lron/{lronID}

## Next steps

- Learn more about the ISM API.
- Learn more about the [Notifications](observing-your-data/notifications/index/) application. 
