---
layout: default
title: API
nav_order: 50
parent: Notifications
redirect_from:
  - /notifications-plugin/api/
---

# Notifications API

If you want to programmatically define your notification channels and sources for versioning and reuse, you can use the Notifications REST API to define, configure, and delete notification channels, send test messages, and send messages to existing channels.

---

#### Table of contents
1. TOC
{:toc}

---

## List supported channel configurations

To retrieve a list of all supported notification configuration types, send a GET request to the `features` resource.

#### Example request

```json
GET /_plugins/_notifications/features
```

#### Example response

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
    "email_group",
    "microsoft_teams"
  ],
  "plugin_features" : {
    "tooltip_support" : "true"
  }
}
```

## List all notification channels

To retrieve a list of all notification channels, send a GET request to the `channels` resource.

#### Example request

```json
GET /_plugins/_notifications/channels
```

#### Example response

```json
{
  "start_index" : 0,
  "total_hits" : 2,
  "total_hit_relation" : "eq",
  "channel_list" : [
    {
      "config_id" : "sample-id",
      "name" : "Sample Slack Channel",
      "description" : "This is a Slack channel",
      "config_type" : "slack",
      "is_enabled" : true
    },
    {
      "config_id" : "sample-id2",
      "name" : "Test chime channel",
      "description" : "A test chime channel",
      "config_type" : "chime",
      "is_enabled" : true
    }
  ]
}
```

## List all notification configurations

To retrieve a list of all notification configurations, send a GET request to the `configs` resource.

#### Example request

```json
GET _plugins/_notifications/configs
```

#### Example response

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
          "url" : "https://hooks.slack.com/services/<webhook-path>"
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
          "url" : "https://hooks.chime.aws/incomingwebhooks/<webhook-id>?token=<token>"
        }
      }
    }
  ]
}
```

To filter the notification configuration types this request returns, you can refine your query with the following optional path parameters.

Parameter	| Description
:--- | :---
`config_id` | Specifies the channel identifier.
`config_id_list` | Specifies a comma-separated list of channel IDs.
`from_index` | The starting index to search from.
`max_items` | The maximum amount of items to return in your request.
`sort_order` | Specifies the direction to sort results in. Valid options are `asc` and `desc`.
`sort_field` | Field to sort results with.
`last_updated_time_ms` | The Unix time in milliseconds of when the channel was last updated.
`created_time_ms` | The Unix time in milliseconds of when the channel was created.
`is_enabled` | Indicates whether the channel is enabled.
`config_type` | The channel type. Valid values are `sns`, `slack`, `chime`, `webhook`, `smtp_account`, `ses_account`, `email_group`, `email`, and `microsoft_teams`.
name | The channel name.
description	| The channel description.
`email.email_account_id` | The sender email addresses the channel uses.
`email.email_group_id_list` | The email groups the channel uses.
`email.recipient_list` | The channel recipient list.
`email_group.recipient_list` | The channel list of email recipient groups.
`smtp_account.method` | The email encryption method.
`slack.url`	| The Slack incoming webhook URL. Must contain `hooks.slack.com/services/` or `hooks.gov-slack.com/services/`.
`chime.url`	| The Amazon Chime incoming webhook URL. Must contain `hooks.chime.aws/incomingwebhooks/` and a `?token=` parameter.
`webhook.url`	| The webhook URL.
`smtp_account.host`	| The domain of the SMTP account.
`smtp_account.from_address`	| The email account's sender address.
`smtp_account.method` | The SMTP account's encryption method.
`sns.topic_arn`	| The Amazon Simple Notification Service (SNS) topic's ARN.
`sns.role_arn` | The Amazon SNS topic's role ARN.
`ses_account.region` | The Amazon Simple Email Service (SES) account's AWS Region.
`ses_account.role_arn` | The Amazon SES account's role ARN.
`ses_account.from_address` | The Amazon SES account's sender email address.
`microsoft_teams.url` | The Microsoft Teams webhook URL. The URL's domain must be `webhook.office.com`, `powerplatform.com`, or `logic.azure.com`.

## Create channel configuration

To create a notification channel configuration, send a POST request to the `configs` resource.

**Note:** If you specify a `config_id` that already exists, the request will fail with a 409 Conflict error. In this case, either choose a different `config_id` or use the [Update channel configuration](#update-channel-configuration) API with a PUT request to modify the existing channel. If you omit the `config_id`, OpenSearch will generate one automatically.
{: .note}

#### Example request

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
      "url": "https://hooks.slack.com/services/<webhook-path>"
    }
  }
}
```

The create channel API operation accepts the following fields in its request body:

Field |	Data type |	Description |	Required
:--- | :--- | :--- | :---
`config_id` | String | The configuration's custom ID. | No
`config` | Object |	Contains all relevant information, such as channel name, configuration type, and plugin source. |	Yes
name | String |	Name of the channel. | Yes
description |	String | The channel's description. | No
`config_type` |	String | The destination of your notification. Valid options are `sns`, `slack`, `chime`, `webhook`, `smtp_account`, `ses_account`, `email_group`, `email`, and `microsoft_teams`. | Yes
`is_enabled` | Boolean | Indicates whether the channel is enabled for sending and receiving notifications. Default is `true`.	| No

The create channel operation accepts multiple `config_types` as possible notification destinations, so follow the format for your preferred `config_type`.

```json
"sns": {
  "topic_arn": "<arn>",
  "role_arn": "<arn>" //optional
}
"slack": {
  "url": "https://hooks.slack.com/services/<webhook-path>"
}
"chime": {
  "url": "https://hooks.chime.aws/incomingwebhooks/<webhook-id>?token=<token>"
}
"webhook": {
  "url": "https://custom-webhook-test-url.com:8888/test-path?params1=value1&params2=value2"
}
"microsoft_teams": {
  "url": "https://example.webhook.office.com/<webhook-path>"
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
  "config_id": "sample-email-id",
  "name": "sample-name",
  "config": {
    "name": "Sample Email Channel",
    "description": "Sample email description",
    "config_type": "email",
    "is_enabled": true,
    "email": {
      "email_account_id": "<email_account_id>",
      "recipient_list": [
        {
          "recipient": "sample@email.com"
        }
      ]
    }
  }
}
```

#### Example response

```json
{
  "config_id" : "<config_id>"
}
```


## Get channel configuration

To get a channel configuration by `config_id`, send a GET request and specify the `config_id` as a path parameter.

#### Example request

```json
GET _plugins/_notifications/configs/{config_id}
```

#### Example response

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
          "url" : "https://hooks.slack.com/services/<webhook-path>"
        }
      }
    }
  ]
}
```


## Update channel configuration

To update an existing channel configuration, send a PUT request to the `configs` resource and specify the channel's `config_id` as a path parameter. Specify the new configuration details in the request body.

**Note**: The PUT method only updates existing configurations. To create a new channel, use the [Create channel configuration](#create-channel-configuration) API with a POST request. If you try to use PUT with a nonexistent `config_id`, the request will fail.
{: .note}

#### Example request

```json
PUT _plugins/_notifications/configs/{config_id}
{
  "config": {
    "name": "Slack Channel",
    "description": "This is an updated channel configuration",
    "config_type": "slack",
    "is_enabled": true,
    "slack": {
      "url": "https://hooks.slack.com/services/<webhook-path>"
    }
  }
}
```

#### Example response

```json
{
  "config_id" : "<config_id>"
}
```


## Delete channel configuration

To delete a channel configuration, send a DELETE request to the `configs` resource and specify the `config_id` as a path parameter.

#### Example request

```json
DELETE /_plugins/_notifications/configs/{config_id}
```

#### Example response

```json
{
  "delete_response_list" : {
  "<config_id>" : "OK"
  }
}
```

You can also submit a comma-separated list of channel IDs you want to delete, and OpenSearch deletes all of the specified notification channels.

#### Example request

```json
DELETE /_plugins/_notifications/configs/?config_id_list={config_id1},{config_id2},{config_id3}...
```

#### Example response

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

To send a test notification, send a POST request to `/feature/test/` and specify the channel configuration's `config_id` as a path parameter.

#### Example request

```json
POST _plugins/_notifications/feature/test/{config_id}
```

#### Example response

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

## Send notification
**Introduced 3.10**
{: .label .label-purple }

To send a message to an existing channel, send a POST request to `/feature/send/<config_id>`. Delivery uses the channel's configuration, so the message is formatted and sent the same way as an alert notification. To send to several channels, send one request per channel.

#### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`config_id` | String | The `config_id` of the channel to send the message to.

#### Request body fields

The following table lists the available request body fields.

Field | Data type | Required | Description
:--- | :--- | :--- | :---
`event_source` | Object | Yes | The source of the message.
`event_source.title` | String | Yes | The message title.
`event_source.reference_id` | String | Yes | An identifier for the event that the message reports, such as a job ID.
`event_source.severity` | String | No | The message severity. Valid values are `critical`, `high`, `info`, and `none`. Default is `info`.
`event_source.tags` | Array of strings | No | Tags for the message.
`channel_message` | Object | Yes | The message content.
`channel_message.text_description` | String | Yes | The message body.
`channel_message.html_description` | String | No | An HTML message body, used by email channels.

#### Example request

```json
POST /_plugins/_notifications/feature/send/sample-id
{
  "event_source": {
    "title": "Weekly sales report",
    "reference_id": "report-123",
    "severity": "info",
    "tags": ["scheduled-report"]
  },
  "channel_message": {
    "text_description": "Your report is ready: https://dashboards.example.com/reports/abc"
  }
}
```
{% include copy-curl.html %}

#### Example response

The response contains the channel's delivery status:

```json
{
  "event_source": {
    "title": "Weekly sales report",
    "reference_id": "report-123",
    "severity": "info",
    "tags": ["scheduled-report"]
  },
  "status_list": [
    {
      "config_id": "sample-id",
      "config_type": "slack",
      "config_name": "Sample Slack Channel",
      "email_recipient_status": [],
      "delivery_status": {
        "status_code": "200",
        "status_text": "ok"
      }
    }
  ]
}
```

If delivery fails, the request returns the error status of the channel. A muted channel returns `423`.

#### Permissions

If you use the Security plugin, the caller needs the `cluster:admin/opensearch/notifications/feature/send` permission, which is granted by the `notifications_send_access` and `notifications_full_access` roles. The caller must also have access to the channel:

- When [resource sharing]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/notification-access-control/) is enabled, the channel must be shared with the caller at an access level that includes `cluster:admin/opensearch/notifications/feature/send`. If it is not, the request is rejected with `403`.
- When filtering by backend roles is enabled, the caller's backend roles must match the channel's backend roles.

The message is sent on behalf of the authenticated caller, so the request body cannot specify a user context.

If you do not use the Security plugin, these checks do not run and any caller that can reach the cluster can send through any channel on it.
