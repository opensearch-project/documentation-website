---
layout: default
title: API
nav_order: 50
has_children: false
redirect_from:
---

# Notifications API

If you don’t want to use OpenSearch Dashboards, you can use the REST API to create, configure, and delete notification channels, email senders, and email recipient groups, as well as send test messages.

If you want to programmatically define your notifications channels and sources for versioning and reuse, you can use the REST API to create, configure, and delete notification channels, email senders, and email recipient groups, as well as send test messages.

---

#### Table of contents
1. TOC
{:toc}

---

## List supported features

Lists supported channel types and email limitations, such as accepted file sizes and connect timeouts.

#### Sample Request

```json
GET /_plugins/_notifications/features
```

#### Sample Response

```json
{
  "config_type_list" : [
  "slack",
  "chime",
  "webhook",
  "email",
  "sns",
  "smtp_account",
  "email_group"
  ],
  "plugin_features" : {
  "opensearch.notifications.spi.email.sizeLimit" : "10000000",
  "opensearch.notifications.spi.email.minimumHeaderLength" : "160",
  "opensearch.notifications.spi.http.maxConnections" : "60",
  "opensearch.notifications.spi.http.maxConnectionPerRoute" : "20",
  "opensearch.notifications.spi.http.connectionTimeout" : "5000",
  "opensearch.notifications.spi.http.socketTimeout" : "50000",
  "opensearch.notifications.spi.tooltip_support" : "false"
  }
}
```

## Create channel

Creates a notification channel.

#### Sample Request

```json
POST /_plugins/_notifications/configs/
{
  "id": "sample-id",
  "name": "sample-name",
  "config": {
    "name": "Sample Slack Channel",
    "description": "This is a Slack channel",
    "config_type": "slack",
    "feature_list": [
      "reports"
    ],
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
config | Object |	Contains all of relevant information such as channel name, configuration type, and plugin source. |	Yes
name | String |	Name of the channel. | Yes
description |	String | The channel's description. | No
config_type |	String | The destination of your notification. Valid options are `chime`, `sns`, `slack`, `email`, and `webhook`. | Yes
feature_list | Array of strings |	The OpenSearch plugins you want to associate with the channel. Valid options are `alerting`, `reports`, and `index_management`. | Yes
is_enabled | Boolean | Whether to enable to channel to receive and send notifications. Default is true.	| No

The create channel operation accepts multiple `config_types` as possible notification destinations, so just follow the format for your preferred `config_type`.

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
"webhook" : {
  "url" : "https://sample-webhook",
  "header_params" : {
    "Content-Type" : "application/json"
  },
  "method" : "POST"
}
"email" : {
  "email_account_id" : "<sample-email-account-id>",
  "recipient_list" : [
    "sample@email.com"
  ],
  "email_group_id_list" : [
    "<email-group-id>"
  ]
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
    "feature_list": [
      "reports"
    ],
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

## Send test notification

Sends a test notification.

#### Sample Request

```json
GET _plugins/_notifications/events
```

#### Sample Response

```json
{
  "event_id" : "<event_id>"
}
```

## List all sent notifications

Lists all sent notifications.

#### Sample Request

```json
GET _plugins/_notifications/events
```

#### Sample Response

```json
{
  "start_index" : 0,
  "total_hits" : 10,
  "total_hit_relation" : "eq",
  "event_list" : [
  {
    "event_id" : "<event_id>",
    "last_updated_time_ms" : 1629226098683,
    "created_time_ms" : 1629226098222,
    "tenant" : "__user__",
    "event" : {
    "event_source" : {
      "title" : "Sample notification event",
      "reference_id" : "<reference_id>",
      "feature" : "reporting",
      "severity" : "info",
      "tags" : [ ]
    },
    "status_list" : [
      {
      "config_id" : "<config_id>",
      "config_type" : "webhook",
      "config_name" : "This is a config name",
      "email_recipient_status" : [ ],
      "delivery_status" : {
        "status_code" : "200",
        "status_text" : "Example status text"
      }
      }
    ]
    }
  }
  ]
}
```

To filter down your results, specify the following parameters in your request path. All parameters are optional.

Parameter	| Description
:--- | :---
event_id_list |	Comma-separated list of notification event IDs to retrieve.
from_index | The starting index to search from.
max_items	| The maximum number of items the request should return.
sort_order | Specifies the direction to sort results in. Valid options are asc and desc.
sort_field | Field to sort results with.
last_updated_time_ms | The unix time in milliseconds of when the channel was last updated.
created_time_ms | The unix time in milliseconds of when the channel was created.
event_source.reference_id | The notification event's reference ID.
event_source.feature | The OpenSearch plugin that triggered the notification event.
event_source.severity | The severity of the of the notification event. Valid options are info and high.
event_source.tags | Any tags associated with the notification event.
event_source.title | The notification event's title.
status_list.config_id	| The channel's config ID.
status_list.config_type	| The channel's notification type. Valid options are slack, chime, sns, email, and webhook.
status_list.config_name	| The channel's name.
status_list.delivery_status.status_code	| The notification event's delivery status code.
status_list.delivery_status.status_text	| Status text related to the notification's delivery status.
status_list.email_recipient_status.recipient | Any statuses associated with email recipients.
status_list.email_recipient_status.delivery_status.status_code | Any status codes associated with email recipients.
status_list.email_recipient_status.delivery_status.status_text | Status text related to email recipients' delivery statuses.

For example, the following request returns a notification sent to Slack that was triggered by the Alerting plugin.

#### Sample Request

```json
GET _plugins/_notifications/events?status_list.config_type=slack&event_source.feature=alerting
```

#### Sample Response

```json
{
  "start_index" : 0,
  "total_hits" : 1,
  "total_hit_relation" : "eq",
  "event_list" : [
  {
    "event_id" : "<event_id>",
    "last_updated_time_ms" : 1630354617088,
    "created_time_ms" : 1630354617082,
    "tenant" : "__user__",
    "event" : {
    "event_source" : {
      "title" : "Sample notification event",
      "reference_id" : "<reference_id>",
      "feature" : "alerting",
      "severity" : "info",
      "tags" : [ ]
    },
    "status_list" : [
      {
      "config_id" : "<config_id>",
      "config_type" : "slack",
      "config_name" : "Sample Slack Channel",
      "email_recipient_status" : [ ],
      "delivery_status" : {
        "status_code" : "200",
        "status_text" : "Example status text"
      }
      }
    ]
    }
  }
  ]
}
```

## List all channels

Lists all notification channels.

#### Sample Request

```json
GET _plugins/_notifications/configs
```

#### Sample Response*

```json
{
  "start_index" : 0,
  "total_hits" : 3,
  "total_hit_relation" : "eq",
  "config_list" : [
  {
    "config_id" : "f8gxMnsBgleqOc4sp278",
    "last_updated_time_ms" : 1628634720251,
    "created_time_ms" : 1628634720251,
    "tenant" : "__user__",
    "config" : {
    "name" : "Testing Gmail Channel",
    "description" : "",
    "config_type" : "smtp_account",
    "feature_list" : [
      "alerting",
      "index_management",
      "reports"
    ],
    "is_enabled" : true,
    "smtp_account" : {
      "host" : "smtp.gmail.com",
      "port" : 80,
      "method" : "ssl",
      "from_address" : "example@gmail.com"
    }
    }
  },
  {
    "config_id" : "g20bN3sBUeso9oKNgb8C",
    "last_updated_time_ms" : 1628717154562,
    "created_time_ms" : 1628717154562,
    "tenant" : "__user__",
    "config" : {
    "name" : "Slack Channel 1",
    "description" : "This is an optional description",
    "config_type" : "slack",
    "feature_list" : [
      "reports"
    ],
    "is_enabled" : true,
    "slack" : {
      "url" : "https://hooks.slack.com/a-sample-url"
    }
    }
  },
  {
    "config_id" : "0W0kN3sBUeso9oKNur-_",
    "last_updated_time_ms" : 1628717759167,
    "created_time_ms" : 1628717759167,
    "tenant" : "__user__",
    "config" : {
    "name" : "Another Sample Slack Channel",
    "description" : "Sample description",
    "config_type" : "slack",
    "feature_list" : [
      "reports"
    ],
    "is_enabled" : true,
    "slack" : {
      "url" : "https://hooks.slack.com/another-sample-url"
    }
    }
  }
  ]
}
```

You can include query parameters in your request path to filter the notification channels this request returns. All parameters are optional.

Parameter	| Description
:--- | :---
config_id	Unique | identifier of a channel.
config_id_list | Comma-separated list of channel IDs.
from_index | The starting index to search from.
max_items | The maximum amount of items to return in your request.
sort_order | Specifies the direction to sort results in. Valid options are asc and desc.
sort_field | Field to sort results with.
last_updated_time_ms | The unix time in milliseconds of when the channel was last updated.
created_time_ms | The unix time in milliseconds of when the channel was created.
is_enabled | Whether the channel is enabled.
config_type | The channel type. Valid options are slack, chime, sns, email, and webhook.
feature_list | The OpenSearch plugin associated with the channel.
name | The channel's name.
description	| The channel's description.
email.email_account_id | The sender emails the channel uses.
email.email_group_id_list | The email groups the channel uses.
smtp_account.method | The email encryption method.
slack.url	| The Slack channel's URL.
chime.url	| The Amazon Chime connection's URL.
webhook.url	| The webhook's URL.
email.recipient_list | The channel's recipient list.
email_group.recipient_list | The channel's list of email recipient groups.
smtp_account.host	| The domain of the smtp account.
smtp_account.from_address	| The email account's sender address.
smtp_account.recipient_list	| The channel's recipient list.
sns.topic_arn	| The Amazon SNS topic's ARN.
sns.role_arn | The Amazon SNS topic's role ARN.
ses_account.region | The Amazon SES account's region.
ses_account.role_arn | The Amazon SES account's role ARN.
ses_account.from_address | The Amazon SES account's sender email address.

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
    "config_id" : "<config_id>",
    "last_updated_time_ms" : 1628634720251,
    "created_time_ms" : 1628634720251,
    "tenant" : "__user__",
    "config" : {
    "name" : "Testing Gmail Channel",
    "description" : "",
    "config_type" : "smtp_account",
    "feature_list" : [
      "alerting",
      "index_management",
      "reports"
    ],
    "is_enabled" : true,
    "smtp_account" : {
      "host" : "smtp.gmail.com",
      "port" : 80,
      "method" : "ssl",
      "from_address" : "example@gmail.com"
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
    "feature_list": [
      "index_management"
    ],
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

#### Delete channel

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

#### Create email sender

Creates an email sender for use when creating an email channel.

#### Sample Request

```json
POST _plugins/_notifications/configs
{
  "config": {
  "name": "test_email_08-20-2021",
  "config_type": "smtp_account",
   "feature_list" : [
    "alerting"
   ],
  "is_enabled" : true,
  "smtp_account": {
     "host": "smtp.gmail.com",
    "port": 465,
    "method": "ssl",
    "from_address": "test@gmail.com"
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

## Get email sender

Retrieves an email sender.

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
    "config_id" : "6j2jZXsBnB7tlos71NNu",
    "last_updated_time_ms" : 1629497886595,
    "created_time_ms" : 1629497840749,
    "tenant" : "__user__",
    "config" : {
    "name" : "Sample_Email_2021",
    "description" : "",
    "config_type" : "smtp_account",
    "feature_list" : [
      "alerting"
    ],
    "is_enabled" : true,
    "smtp_account" : {
      "host" : "smtp.gmail.com",
      "port" : 465,
      "method" : "ssl",
      "from_address" : "address@gmail.com"
    }
    }
  }
  ]
}
```

## Update email sender

Updates an email sender with new fields.

#### Sample Request

```json
PUT _plugins/_notifications/configs/<config_id>
{
  "config": {
  "name": "This is a new name",
  "config_type": "smtp_account",
   "feature_list" : [
    "alerting"
   ],
  "is_enabled" : false,
  "smtp_account": {
     "host": "smtp.gmail.com",
    "port": 587,
    "method": "ssl",
    "from_address": "new_address@gmail.com"
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

## Delete email sender

Deletes an email sender.

#### Sample Request

```json
DELETE _plugins/_notifications/configs/<config_id>
```

#### Sample Response

```json
{
  "delete_response_list" : {
  "<config_id>" : "OK"
  }
}
```

To delete multiple email senders, specify all of the necessary IDs in a comma-separated list.

#### Sample Request

```json
DELETE _plugins/_notifications/configs/?config_id_list=<config_id1>,<config_id2>,<config_id3>
```

#### Sample Response

```json
{
  "delete_response_list" : {
  "<config_id1>" : "OK",
  "<config_id2>" : "OK",
  "<config_id3>" : "OK",
  "<config_id4>" : "OK"
  }
}
```

## Create email recipient group

Creates an email recipient group

#### Sample Request

```json
POST _plugins/_notifications/configs/
{
  "config": {
    "name": "Sample Email Group Name",
    "description": "This is an email group",
    "config_type": "email_group",
    "feature_list": [
      "alerting"
    ],
    "is_enabled": true,
    "email_group": {
      "recipient_list": [
        "some_address@email.com"
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

## Get email recipient group

Returns an email recipient group

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
    "config_id" : "<config_id>",
    "last_updated_time_ms" : 1630106022155,
    "created_time_ms" : 1630106022155,
    "tenant" : "__user__",
    "config" : {
    "name" : "Sample Email Group Name",
    "description" : "This is an email group",
    "config_type" : "email_group",
    "feature_list" : [
      "alerting"
    ],
    "is_enabled" : true,
    "email_group" : {
      "recipient_list" : [
      "some_address@email.com"
      ]
    }
    }
  }
  ]
}
```

## Update email recipient group

Updates an email recipient group

#### Sample Request

```json
PUT _plugins/_notifications/configs/<config_id>
{
  "config": {
    "name": "This is an updated email group",
    "description": "This is an updated description",
    "config_type": "email_group",
    "feature_list": [
      "alerting"
    ],
    "is_enabled": true,
    "email_group": {
      "recipient_list": [
        "some_address@email.com"
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

## Delete email recipient group

Deletes an email recipient group

#### Sample Request

```json
DELETE _plugins/_notifications/configs/<congid_id>
```

#### Sample Response

```json
{
  "delete_response_list" : {
  "<config_id>" : "OK"
  }
}
```

The delete email group operation also supports deleting multiple email groups with one request.

#### Sample Request

```json
DELETE _plugins/_notifications/configs/?config_id_list=<config_id1>,<config_id2>
```

#### Sample Response

```json
{
  "delete_response_list" : {
  "<config_id1>" : "OK",
  "<config_id2>" : "OK"
  }
}
```
