---
layout: default
title: API
nav_order: 50
has_children: false
redirect_from:
---

# Notifications API

If you want to programmatically define your notifications channels and sources for versioning and reuse, you can use the REST API to  define, configure, and delete notification channels, as well as send test messages.

---

#### Table of contents
1. TOC
{:toc}

---

## List supported channel types

Lists supported channel types.

#### Sample Request

```json
GET /_plugins/_notifications/features
```

#### Sample Response

```json
{
  "allowed_config_type_list" : [
    "slack",
    "chime",
    "webhook",
    "email",
    "sns",
    "ses_account",
    "smtp_account",
    "email_group"
  ],
  "plugin_features" : {
    "tooltip_support" : "true"
  }
}
```

## List all configurations

Lists all configurations.

#### Sample Request

```json
GET _plugins/_notifications/configs
```

#### Sample Response

```json
{
  "start_index" : 0,
  "total_hits" : 2,
  "total_hit_relation" : "eq",
  "config_list" : [
    {
      "config_id" : "sample-id",
      "last_updated_time_ms" : 1652760532774,
      "created_time_ms" : 1652760532774,
      "config" : {
        "name" : "Sample Slack Channel",
        "description" : "This is a Slack channel",
        "config_type" : "slack",
        "is_enabled" : true,
        "slack" : {
          "url" : "https://sample-slack-webhook"
        }
      }
    },
    {
      "config_id" : "sample-id2",
      "last_updated_time_ms" : 1652760735380,
      "created_time_ms" : 1652760735380,
      "config" : {
        "name" : "Test chime channel",
        "description" : "A test chime channel",
        "config_type" : "chime",
        "is_enabled" : true,
        "chime" : {
          "url" : "https://sample-chime-webhook"
        }
      }
    }
  ]
}
```

You can include query parameters in your request path to filter the notification channels this request returns. All parameters are optional.

Parameter	| Description
:--- | :---
config_id | identifier of a channel.
config_id_list | Comma-separated list of channel IDs.
from_index | The starting index to search from.
max_items | The maximum amount of items to return in your request.
sort_order | Specifies the direction to sort results in. Valid options are asc and desc.
sort_field | Field to sort results with.
last_updated_time_ms | The unix time in milliseconds of when the channel was last updated.
created_time_ms | The unix time in milliseconds of when the channel was created.
is_enabled | Whether the channel is enabled.
config_type | The channel type. Valid options are `sns`, `slack`, `chime`, `webhook`, `smtp_account`, `ses_account`, `email_group`, `email`.
name | The channel's name.
description	| The channel's description.
email.email_account_id | The sender emails the channel uses.
email.email_group_id_list | The email groups the channel uses.
email.recipient_list | The channel's recipient list.
email_group.recipient_list | The channel's list of email recipient groups.
smtp_account.method | The email encryption method.
slack.url	| The Slack channel's URL.
chime.url	| The Amazon Chime connection's URL.
webhook.url	| The webhook's URL.
smtp_account.host	| The domain of the smtp account.
smtp_account.from_address	| The email account's sender address.
smtp_account.method | The smtp account's encryption method.
sns.topic_arn	| The Amazon SNS topic's ARN.
sns.role_arn | The Amazon SNS topic's role ARN.
ses_account.region | The Amazon SES account's region.
ses_account.role_arn | The Amazon SES account's role ARN.
ses_account.from_address | The Amazon SES account's sender email address.

## Create channel configuration

Creates a notification channel.

#### Sample Request

```json
POST /_plugins/_notifications/configs/
{
  "config_id": "sample-id",
  "name": "sample-name",
  "config": {
    "name": "Sample Slack Channel",
    "description": "This is a Slack channel",
    "config_type": "slack",
    "is_enabled": true,
    "slack": {
      "url": "https://sample-slack-webhook"
    }
  }
}
```

The create channel API operation accepts the following fields in its request body:

Field |	Data Type |	Description |	Required
:--- | :--- | :--- | :---
config_id | String | The config's custom ID. | No
config | Object |	Contains all of relevant information such as channel name, configuration type, and plugin source. |	Yes
name | String |	Name of the channel. | Yes
description |	String | The channel's description. | No
config_type |	String | The destination of your notification. Valid options are `sns`, `slack`, `chime`, `webhook`, `smtp_account`, `ses_account`, `email_group`, `email`. | Yes
is_enabled | Boolean | Whether to enable to channel for sending and receiving notifications. Default is true.	| No

The create channel operation accepts multiple `config_types` as possible notification destinations, so follow the format for your preferred `config_type`.

```json
"sns": {
  "topic_arn": "<arn>",
  "role_arn": "<arn>" //optional
}
"slack": {
  "url": "https://sample-chime-webhoook"
}
"chime": {
  "url": "https://sample-amazon-chime-webhoook"
}
"webhook": {
      "url": "https://custom-webhook-test-url.com:8888/test-path?params1=value1&params2=value2"
}
"smtp_account": {
  "host": "test-host.com",
  "port": 123,
  "method": "start_tls",
  "from_address": "test@email.com"
}
"ses_account": {
  "region": "us-east-1",
  "role_arn": "arn:aws:iam::012345678912:role/NotificationsSESRole",
  "from_address": "test@email.com"
}
"email_group": { //Email recipient group
  "recipient_list": [
    {
      "recipient": "test-email1@test.com"
    },
    {
      "recipient": "test-email2@test.com"
    }
  ]
}
"email": { //The channel that sends emails
  "email_account_id": "<smtp or ses account config id>",
  "recipient_list": [
    {
      "recipient": "custom.email@test.com"
    }
  ],
  "email_group_id_list": []
}
```

The following example demonstrates how to create a channel using email as a `config_type`:

```json
POST /_plugins/_notifications/configs/
{
  "id": "sample-email-id",
  "name": "sample-name",
  "config": {
    "name": "Sample Email Channel",
    "description": "Sample email description",
    "config_type": "email",
    "is_enabled" : true,
    "email" : {
    "email_account_id" : "<email_account_id>",
    "recipient_list" : [
      "sample@email.com"
    ]
  }
  }
}
```

#### Sample Response

```json
{
  "config_id" : "<config_id>"
}
```


## Get channel configuration

Get a channel’s configuration by config_id.

#### Sample Request

```json
GET _plugins/_notifications/configs/<config_id>
```

#### Sample Response

```json
{
  "start_index" : 0,
  "total_hits" : 1,
  "total_hit_relation" : "eq",
  "config_list" : [
    {
      "config_id" : "sample-id",
      "last_updated_time_ms" : 1652760532774,
      "created_time_ms" : 1652760532774,
      "config" : {
        "name" : "Sample Slack Channel",
        "description" : "This is a Slack channel",
        "config_type" : "slack",
        "is_enabled" : true,
        "slack" : {
          "url" : "https://sample-slack-webhook"
        }
      }
    }
  ]
}
```


## Update channel configuration

Updates a channel’s configuration.

#### Sample Request

```json
PUT _plugins/_notifications/configs/<config_id>
{
  "config": {
    "name": "Slack Channel",
    "description": "This is an updated channel configuration",
    "config_type": "slack",
    "is_enabled": true,
    "slack": {
      "url": "https://hooks.slack.com/sample-url"
    }
  }
}
```

#### Sample Response

```json
{
  "config_id" : "<config_id>"
}
```


## Delete channel configuration

Deletes a channel.

#### Sample Request

```json
DELETE /_plugins/_notifications/configs/<config_id>
```

#### Sample Response*

```json
{
  "delete_response_list" : {
  "<config_id>" : "OK"
  }
}
```

You can also submit a comma-separated list of channel IDs you want to delete, and OpenSearch deletes all of the specified notification channels.

#### Sample Request

```json
DELETE /_plugins/_notifications/configs/?config_id_list=<config_id1>,<config_id2>,<config_id3>...
```

#### Sample Response

```json
{
  "delete_response_list" : {
  "<config_id1>" : "OK",
  "<config_id2>" : "OK",
  "<config_id3>" : "OK"
  }
}
```


## Send test notification

Sends a test notification to a channel.

#### Sample Request

```json
GET _plugins/_notifications/feature/test/<config_id>
```

#### Sample Response

```json
{
  "event_source" : {
    "title" : "Test Message Title-0Jnlh4ABa4TCWn5C5H2G",
    "reference_id" : "0Jnlh4ABa4TCWn5C5H2G",
    "severity" : "info",
    "tags" : [ ]
  },
  "status_list" : [
    {
      "config_id" : "0Jnlh4ABa4TCWn5C5H2G",
      "config_type" : "slack",
      "config_name" : "sample-id",
      "email_recipient_status" : [ ],
      "delivery_status" : {
        "status_code" : "200",
        "status_text" : """<!doctype html>
<html>
<head>
</head>
<body>
<div>
    <h1>Example Domain</h1>
    <p>Sample paragraph.</p>
    <p><a href="sample.example.com">TO BE OR NOT TO BE, THAT IS THE QUESTION</a></p>
</div>
</body>
</html>
"""
      }
    }
  ]
}

```
