---
layout: default
title: Notifications API
nav_order: 50
parent: Notifications
redirect_from:
  - /notifications-plugin/api/
---

# Notifications API

Use the Notifications REST API to programmatically create, retrieve, update, and delete notification configurations, to send test messages, and to send messages to existing channels. Defining channels through the API lets you version and reuse your channel definitions.

A notification configuration is one of the following types:

- A channel that receives notifications: `slack`, `chime`, `microsoft_teams`, `webhook`, `email`, or `sns`.
- An email sender that an `email` channel uses to send messages: `smtp_account` or `ses_account`.
- An email recipient group that an `email` channel sends messages to: `email_group`.

---

#### Table of contents
1. TOC
{:toc}

---

## List supported channel configurations

To retrieve a list of all supported notification configuration types, send a GET request to the `features` resource.

### Endpoints

```json
GET /_plugins/_notifications/features
```

### Example request

```json
GET /_plugins/_notifications/features
```
{% include copy-curl.html %}

### Example response

```json
{
  "allowed_config_type_list" : [
    "slack",
    "chime",
    "microsoft_teams",
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

### Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`allowed_config_type_list` | Array of strings | The configuration types that the cluster allows. Set by the `opensearch.notifications.core.allowed_config_types` setting.
`plugin_features` | Object | Plugin features and their values. Contains `tooltip_support`, which is set by the `opensearch.notifications.core.tooltip_support` setting.

## List all notification channels

To retrieve a list of all notification channels, send a GET request to the `channels` resource. The response contains configurations of the `slack`, `chime`, `microsoft_teams`, `webhook`, `email`, and `sns` types. Email senders and email recipient groups are not channels, so the response omits them. This endpoint does not accept query parameters.

### Endpoints

```json
GET /_plugins/_notifications/channels
```

### Example request

```json
GET /_plugins/_notifications/channels
```
{% include copy-curl.html %}

### Example response

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

To retrieve a list of notification configurations of all types, send a GET request to the `configs` resource.

### Endpoints

```json
GET /_plugins/_notifications/configs
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional. Unrecognized query parameters are rejected.

Parameter | Data type | Description
:--- | :--- | :---
`config_id` | String | Returns the configuration with this ID.
`config_id_list` | String | Returns the configurations with these IDs. Specify a comma-separated list of configuration IDs. If you specify `config_id` or `config_id_list`, the request ignores all filter parameters.
`from_index` | Integer | The starting index of the results. Default is `0`.
`max_items` | Integer | The maximum number of configurations to return. Default is `1000`.
`sort_field` | String | The field to sort results by. Valid values are the names of the filter parameters in the following two tables, except `email.recipient_list.recipient` and `email_group.recipient_list.recipient`. Default is `last_updated_time_ms`.
`sort_order` | String | The sort direction. Valid values are `asc` and `desc`. Default is `asc`.
`query` | String | Searches all keyword and text filter fields using query string syntax.
`text_query` | String | Searches all text filter fields using query string syntax.

The following filter parameters match configurations whose field exactly equals the specified value. Where noted, specify multiple comma-separated values to match any of them.

Parameter | Data type | Description
:--- | :--- | :---
`last_updated_time_ms` | String | The time at which the configuration was last updated, in epoch milliseconds. Specify an exact value or a range in the `<from>..<to>` format.
`created_time_ms` | String | The time at which the configuration was created, in epoch milliseconds. Specify an exact value or a range in the `<from>..<to>` format.
`is_enabled` | Boolean | Whether the configuration is enabled.
`config_type` | String | The configuration type. Specify one or more comma-separated values. Valid values are `slack`, `chime`, `microsoft_teams`, `webhook`, `email`, `sns`, `smtp_account`, `ses_account`, and `email_group`.
`email.email_account_id` | String | The ID of the email sender that an `email` channel uses. Accepts a comma-separated list.
`email.email_group_id_list` | String | The ID of an email recipient group that an `email` channel uses. Accepts a comma-separated list.
`smtp_account.method` | String | The encryption method of an SMTP sender. Accepts a comma-separated list.
`ses_account.region` | String | The AWS Region of an Amazon Simple Email Service (Amazon SES) sender. Accepts a comma-separated list.

The following filter parameters match configurations whose field contains the specified text.

Parameter | Data type | Description
:--- | :--- | :---
`name` | String | The configuration name.
`description` | String | The configuration description.
`email.recipient_list.recipient` | String | A recipient email address of an `email` channel.
`email_group.recipient_list.recipient` | String | A recipient email address of an email recipient group.
`slack.url` | String | The Slack incoming webhook URL. Must contain `hooks.slack.com/services/` or `hooks.gov-slack.com/services/`.
`chime.url` | String | The Amazon Chime incoming webhook URL. Must contain `hooks.chime.aws/incomingwebhooks/` and a `?token=` parameter.
`microsoft_teams.url` | String | The Microsoft Teams webhook URL. The URL's domain must be `webhook.office.com`, `powerplatform.com`, or `logic.azure.com`.
`webhook.url` | String | The custom webhook URL.
`smtp_account.host` | String | The host of an SMTP sender.
`smtp_account.from_address` | String | The sender email address of an SMTP sender.
`sns.topic_arn` | String | The Amazon Simple Notification Service (Amazon SNS) topic ARN.
`sns.role_arn` | String | The IAM role ARN used to publish to the Amazon SNS topic.
`ses_account.role_arn` | String | The IAM role ARN of an Amazon SES sender.
`ses_account.from_address` | String | The sender email address of an Amazon SES sender.

### Example request

```json
GET /_plugins/_notifications/configs
```
{% include copy-curl.html %}

The following request returns the first 10 Slack and Amazon Chime configurations, sorted by name:

```json
GET /_plugins/_notifications/configs?config_type=slack,chime&sort_field=name&sort_order=asc&max_items=10
```
{% include copy-curl.html %}

### Example response

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

### Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`start_index` | Integer | The starting index of the returned results.
`total_hits` | Integer | The total number of configurations that match the request.
`total_hit_relation` | String | Whether `total_hits` is exact (`eq`) or a lower bound (`gte`).
`config_list` | Array of objects | The matching configurations.

Each object in the `config_list` array contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`config_id` | String | The configuration ID.
`last_updated_time_ms` | Long | The time at which the configuration was last updated, in epoch milliseconds.
`created_time_ms` | Long | The time at which the configuration was created, in epoch milliseconds.
`config` | Object | The configuration. Contains the same fields as the `config` object in the [create request](#request-body-fields).

## Create channel configuration

To create a notification configuration, send a POST request to the `configs` resource. Use this request to create channels, email senders, and email recipient groups.

If you omit `config_id`, OpenSearch generates an ID. If you specify a `config_id` that already exists, the request fails with a `409 Conflict` status. To modify an existing configuration, use the [Update channel configuration](#update-channel-configuration) API.
{: .note}

### Endpoints

```json
POST /_plugins/_notifications/configs
```

### Request body fields

The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`config_id` | String | The configuration ID. Valid characters are letters, digits, `+`, `/`, `_`, and `-`. Optional. If omitted, OpenSearch generates an ID.
`config` | Object | The configuration. Required.

The `config` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`name` | String | The configuration name. Required.
`description` | String | The configuration description. Optional. Default is an empty string.
`config_type` | String | The configuration type. Valid values are `slack`, `chime`, `microsoft_teams`, `webhook`, `email`, `sns`, `smtp_account`, `ses_account`, and `email_group`. Required.
`is_enabled` | Boolean | Whether the channel is enabled. OpenSearch does not send notifications to a disabled channel. Optional. Default is `true`.
`<config_type>` | Object | The settings for the configuration type. The field name must match the `config_type` value, for example, `"slack": { ... }` when `config_type` is `slack`. Required. The fields for each type are described in the following sections.

#### Slack, Amazon Chime, and Microsoft Teams

The `slack`, `chime`, and `microsoft_teams` objects contain the following field.

Field | Data type | Description
:--- | :--- | :---
`url` | String | The incoming webhook URL. Required. A Slack URL must contain `hooks.slack.com/services/` or `hooks.gov-slack.com/services/`. An Amazon Chime URL must contain `hooks.chime.aws/incomingwebhooks/` and a `?token=` parameter. A Microsoft Teams URL's domain must be `webhook.office.com`, `powerplatform.com`, or `logic.azure.com`.

#### Custom webhook

The `webhook` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`url` | String | The webhook URL. Must use the `http` or `https` protocol. Required.
`header_params` | Object | The HTTP headers to send with each request, specified as header name and value pairs. Optional.
`method` | String | The HTTP method. Valid values are `POST`, `PUT`, and `PATCH`. Optional. Default is `POST`. Unrecognized values are stored as `POST`.

#### Email channel

The `email` object contains the following fields. The sender and recipient groups must exist before you create the channel.

Field | Data type | Description
:--- | :--- | :---
`email_account_id` | String | The ID of the `smtp_account` or `ses_account` configuration that sends the emails. Required.
`recipient_list` | Array of objects | The recipients. Each object contains a `recipient` field that specifies an email address. Optional.
`email_group_id_list` | Array of strings | The IDs of `email_group` configurations to send emails to. Optional.

#### Amazon SNS

The `sns` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`topic_arn` | String | The ARN of the Amazon SNS topic, in the `arn:aws:sns:<region>:<account_id>:<topic_name>` format. Required.
`role_arn` | String | The ARN of the IAM role that OpenSearch assumes to publish to the topic. Optional. If omitted, OpenSearch uses the AWS credentials available on the cluster nodes. For more information, see [Amazon SNS as a channel type]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/#amazon-sns-as-a-channel-type).

#### SMTP sender

The `smtp_account` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`host` | String | The SMTP server host. Required.
`port` | Integer | The SMTP server port. Must be a positive integer. Required.
`method` | String | The encryption method. Valid values are `none`, `ssl`, and `start_tls`. Required. Unrecognized values are stored as `none`. To use `ssl` or `start_tls`, add the sender credentials to the OpenSearch keystore. For more information, see [Authenticate sender account]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/#authenticate-sender-account).
`from_address` | String | The sender email address. Required.

#### Amazon SES sender

The `ses_account` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`region` | String | The AWS Region of the Amazon SES account. Required.
`role_arn` | String | The ARN of the IAM role that OpenSearch assumes to send emails. Optional.
`from_address` | String | The sender email address. Required.

#### Email recipient group

The `email_group` object contains the following field.

Field | Data type | Description
:--- | :--- | :---
`recipient_list` | Array of objects | The recipients. Each object contains a `recipient` field that specifies an email address. Required.

### Example: Creating a Slack channel

```json
POST /_plugins/_notifications/configs
{
  "config_id": "sample-id",
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
{% include copy-curl.html %}

### Example: Creating a custom webhook channel

```json
POST /_plugins/_notifications/configs
{
  "config_id": "sample-webhook-id",
  "config": {
    "name": "Sample Webhook Channel",
    "config_type": "webhook",
    "webhook": {
      "url": "https://custom-webhook-test-url.com:8888/test-path?params1=value1&params2=value2",
      "header_params": {
        "Content-Type": "application/json"
      },
      "method": "POST"
    }
  }
}
```
{% include copy-curl.html %}

### Example: Creating an email channel

An email channel requires an email sender. The following request creates an SMTP sender:

```json
POST /_plugins/_notifications/configs
{
  "config_id": "sample-smtp-id",
  "config": {
    "name": "sample-smtp-sender",
    "config_type": "smtp_account",
    "smtp_account": {
      "host": "smtp.example.com",
      "port": 587,
      "method": "start_tls",
      "from_address": "alerts@example.com"
    }
  }
}
```
{% include copy-curl.html %}

The following request creates an email recipient group:

```json
POST /_plugins/_notifications/configs
{
  "config_id": "sample-email-group-id",
  "config": {
    "name": "sample-email-group",
    "config_type": "email_group",
    "email_group": {
      "recipient_list": [
        {
          "recipient": "test-email1@test.com"
        },
        {
          "recipient": "test-email2@test.com"
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The following request creates an email channel that sends messages through the SMTP sender to one recipient and to the recipient group:

```json
POST /_plugins/_notifications/configs
{
  "config_id": "sample-email-id",
  "config": {
    "name": "Sample Email Channel",
    "description": "Sample email description",
    "config_type": "email",
    "is_enabled": true,
    "email": {
      "email_account_id": "sample-smtp-id",
      "recipient_list": [
        {
          "recipient": "sample@email.com"
        }
      ],
      "email_group_id_list": ["sample-email-group-id"]
    }
  }
}
```
{% include copy-curl.html %}

To use an Amazon SES sender, create an `ses_account` configuration and specify its ID in `email_account_id`. The following request creates an Amazon SES sender:

```json
POST /_plugins/_notifications/configs
{
  "config_id": "sample-ses-id",
  "config": {
    "name": "sample-ses-sender",
    "config_type": "ses_account",
    "ses_account": {
      "region": "us-east-1",
      "role_arn": "arn:aws:iam::012345678912:role/NotificationsSESRole",
      "from_address": "test@email.com"
    }
  }
}
```
{% include copy-curl.html %}

### Example: Creating an Amazon SNS channel

```json
POST /_plugins/_notifications/configs
{
  "config_id": "sample-sns-id",
  "config": {
    "name": "Sample SNS Channel",
    "config_type": "sns",
    "sns": {
      "topic_arn": "arn:aws:sns:us-east-1:012345678912:sample-topic",
      "role_arn": "arn:aws:iam::012345678912:role/NotificationsSNSRole"
    }
  }
}
```
{% include copy-curl.html %}

### Example response

The response contains the configuration ID:

```json
{
  "config_id" : "sample-id"
}
```

## Get channel configuration

To get a notification configuration by its ID, send a GET request and specify the `config_id` as a path parameter.

### Endpoints

```json
GET /_plugins/_notifications/configs/{config_id}
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`config_id` | String | The configuration ID. Required.

### Example request

```json
GET /_plugins/_notifications/configs/sample-id
```
{% include copy-curl.html %}

### Example response

The response has the same format as the [List all notification configurations](#list-all-notification-configurations) response:

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

To update an existing notification configuration, send a PUT request to the `configs` resource and specify the configuration's `config_id` as a path parameter. The request body contains the `config` object, which has the same fields as in the [create request](#create-channel-configuration). The update replaces the entire configuration, so specify all fields, including the ones you don't change. Fields that you omit are reset to their default values.

You cannot change the `config_type` of an existing configuration. A request that specifies a different `config_type` fails with a `409 Conflict` status. If the `config_id` does not exist, the request fails with a `404 Not Found` status. To create a configuration, use the [Create channel configuration](#create-channel-configuration) API.
{: .note}

### Endpoints

```json
PUT /_plugins/_notifications/configs/{config_id}
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`config_id` | String | The ID of the configuration to update. Required.

### Example request

```json
PUT /_plugins/_notifications/configs/sample-id
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
{% include copy-curl.html %}

### Example response

```json
{
  "config_id" : "sample-id"
}
```

## Delete channel configuration

To delete one or more notification configurations, send a DELETE request to the `configs` resource. Specify one ID as a path parameter or specify a comma-separated list of IDs in the `config_id_list` query parameter. If any of the specified configurations does not exist, the request fails and OpenSearch does not delete any of them.

OpenSearch does not check whether other configurations use the configuration you delete. For example, you can delete an email sender that an email channel uses.

### Endpoints

```json
DELETE /_plugins/_notifications/configs/{config_id}
DELETE /_plugins/_notifications/configs?config_id_list=<config_id1>,<config_id2>
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`config_id` | String | The ID of the configuration to delete.

### Query parameters

The following table lists the available query parameters.

Parameter | Data type | Description
:--- | :--- | :---
`config_id_list` | String | A comma-separated list of the IDs of the configurations to delete. If you specify this parameter, OpenSearch ignores the `config_id` path parameter.

### Example request

```json
DELETE /_plugins/_notifications/configs/sample-id
```
{% include copy-curl.html %}

### Example response

```json
{
  "delete_response_list" : {
    "sample-id" : "OK"
  }
}
```

### Example: Deleting multiple configurations

```json
DELETE /_plugins/_notifications/configs?config_id_list=sample-id,sample-id2,sample-id3
```
{% include copy-curl.html %}

#### Example response

```json
{
  "delete_response_list" : {
    "sample-id" : "OK",
    "sample-id2" : "OK",
    "sample-id3" : "OK"
  }
}
```

## Send test notification

To send a test message to a channel, send a POST request to the `feature/test` resource and specify the channel's `config_id` as a path parameter. The channel must be enabled and must be of the `slack`, `chime`, `microsoft_teams`, `webhook`, `email`, or `sns` type. Email senders and email recipient groups cannot receive test messages.

The test message title is `Test Message Title-<config_id>`, and the message body is `Test message content body for config id <config_id>`.

If OpenSearch delivers the message, the request returns a `200 OK` status. If delivery fails, for example, because the destination is unreachable or rejects the message, the request returns an error. The error contains the delivery status that the destination returned.

### Endpoints

```json
POST /_plugins/_notifications/feature/test/{config_id}
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`config_id` | String | The ID of the channel to send the test message to. Required.

### Example request

```json
POST /_plugins/_notifications/feature/test/sample-webhook-id
```
{% include copy-curl.html %}

### Example response

```json
{
  "event_source" : {
    "title" : "Test Message Title-sample-webhook-id",
    "reference_id" : "sample-webhook-id",
    "severity" : "info",
    "tags" : [ ]
  },
  "status_list" : [
    {
      "config_id" : "sample-webhook-id",
      "config_type" : "webhook",
      "config_name" : "Sample Webhook Channel",
      "email_recipient_status" : [ ],
      "delivery_status" : {
        "status_code" : "200",
        "status_text" : "ok"
      }
    }
  ]
}
```

### Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`event_source` | Object | Information about the test message.
`status_list` | Array of objects | The delivery status for each channel.

The `event_source` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`title` | String | The message title.
`reference_id` | String | The ID of the message source. For a test message, this is the channel ID.
`severity` | String | The message severity.
`tags` | Array of strings | The message tags.

Each object in the `status_list` array contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`config_id` | String | The channel ID.
`config_type` | String | The channel type.
`config_name` | String | The channel name.
`email_recipient_status` | Array of objects | For an email channel, the delivery status for each recipient. Each object contains a `recipient` field and a `delivery_status` object. Empty for other channel types.
`delivery_status` | Object | The delivery status.

The `delivery_status` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`status_code` | String | The status code that the destination returned.
`status_text` | String | The response text that the destination returned.

## Send notification
**Introduced 3.10**
{: .label .label-purple }

To send a message to an existing channel, send a POST request to the `feature/send` resource and specify the channel's `config_id` as a path parameter. Delivery uses the channel's configuration, so the message is formatted and sent the same way as an alert notification. To send to several channels, send one request per channel.

### Endpoints

```json
POST /_plugins/_notifications/feature/send/{config_id}
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`config_id` | String | The ID of the channel to send the message to. Required.

### Request body fields

The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`event_source` | Object | The message source. Required.
`channel_message` | Object | The message content. Required.

The `event_source` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`title` | String | The message title. Required.
`reference_id` | String | An identifier of the event that the message reports, such as a job ID. Required.
`severity` | String | The message severity. Valid values are `critical`, `high`, `info`, and `none`. Optional. Default is `info`.
`tags` | Array of strings | The tags for the message. Optional.

The `channel_message` object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`text_description` | String | The message body. Required.
`html_description` | String | An HTML message body, used by email channels. Optional.

The message is always sent on behalf of the authenticated user. You cannot specify another user in the request.

### Example request

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

### Example response

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

### Response body fields

The response contains the same fields as the [Send test notification](#send-test-notification) response.

### Permissions

If you use the Security plugin, the caller needs the `cluster:admin/opensearch/notifications/channel/send` permission, which is granted by the `notifications_send_access` and `notifications_full_access` roles. The caller must also have access to the channel:

- When [resource sharing]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/notification-access-control/) is enabled, the channel must be shared with the caller at an access level that includes `cluster:admin/opensearch/notifications/channel/send`, such as `notifications_read_write` or `notifications_full_access`. For an email channel, the caller also needs the same access to the channel's sender account and recipient groups. If it does not, the request is rejected with `403`.
- When filtering by backend roles is enabled, the caller's backend roles must match the channel's backend roles.

If you don't use the Security plugin, any user that can reach the cluster can send messages through any channel.
{: .warning}
