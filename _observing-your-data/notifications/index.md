---
layout: default
title: Notifications
nav_order: 140
has_children: true
redirect_from:
  - /notifications-plugin/
  - /notifications-plugin/index/
  - /observing-your-data/notifications/
---

# Notifications

Notifications provides a central location for configuring the channels that OpenSearch plugins, such as Alerting and Index State Management (ISM), use to send notifications. Supported channel types are Amazon Chime, Amazon Simple Notification Service (Amazon SNS), email through SMTP or Amazon Simple Email Service (Amazon SES), Slack, Microsoft Teams, and custom webhooks.

## Configuring notifications

Use OpenSearch Dashboards or the REST API to configure notifications. Dashboards guides you through selecting a channel type and entering its settings. The REST API lets you define channels programmatically so that you can version and reuse them. For more information about the API, see [Notifications API]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/api/).

## Create a channel

To create a channel in OpenSearch Dashboards, follow these steps:

1. On the top menu, go to **Management** > **Notifications**.
1. Select **Channels**, and then select **Create channel**.
1. In the **Name and description** section, enter a name and an optional description for the channel.
1. In the **Configurations** section, select the **Channel type** and enter the settings for that type. You cannot change the channel type after you create the channel. For Slack, Amazon Chime, and Microsoft Teams, enter the webhook URL. For more information about obtaining a webhook URL, see the documentation for [Slack](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/), [Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/what-are-webhooks-and-connectors), or [Amazon Chime](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html). For other channel types, see the following sections.
1. (Optional) To verify the configuration, select **Send test message**.
1. Select **Create**.

### Custom webhooks

For a custom webhook, in **Define endpoints by**, select **Webhook URL** to enter the full URL or **Custom attributes URL** to enter the type, host, port, and path separately. Then select the HTTP **Method** and add any **Query parameters** and **Webhook headers** that your endpoint requires. For example, if your endpoint requires basic authentication, add an `Authorization` header with a value of `Basic <Base64-encoded-credential-string>`. You might also need to set `Content-Type` to the value your webhook requires, such as `application/json`, `application/xml`, or `text/plain`.

Webhook settings, including headers, are stored in plain text in the OpenSearch cluster. Encoded credentials in headers are neither encrypted nor hashed and might be visible to other OpenSearch users.
{: .warning}

### Amazon SNS as a channel type

Notifications can publish messages to Amazon SNS topics. Through SNS topic subscriptions, you can deliver notifications as email messages or text messages or use them to invoke AWS Lambda functions. For more information about Amazon SNS, see the [Amazon Simple Notification Service Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/welcome.html).

To create an Amazon SNS channel, enter the **SNS topic ARN** and, optionally, the **IAM role ARN**. OpenSearch uses the AWS credentials available on each node through the default AWS credential provider chain, for example, environment variables or an Amazon EC2 instance profile. If you don't specify an IAM role ARN, these credentials must grant permission to publish to the topic. If you specify an IAM role ARN, OpenSearch uses these credentials to assume the role and then publishes to the topic using the role's permissions.

#### Publishing using the node credentials

To publish to the topic using the node credentials, grant the IAM user or role whose credentials the nodes use the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sns:Publish",
      "Resource": "arn:aws:sns:<region>:<account_id>:<topic_name>"
    }
  ]
}
```

#### Publishing by assuming an IAM role

To publish to the topic without granting the node credentials direct access to Amazon SNS, create an IAM role that has the `sns:Publish` permission shown in the preceding section, and enter its ARN in **IAM role ARN**.

The IAM user or role whose credentials the nodes use must have permission to assume the role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::<account_id>:role/<role_name>"
    }
  ]
}
```

The role's trust policy must allow that user or role to assume it. In `Principal`, specify the ARN of the IAM user (`arn:aws:iam::<account_id>:user/<user_name>`) or role (`arn:aws:iam::<account_id>:role/<role_name>`) whose credentials the nodes use:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "<node_principal_arn>"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

## Email as a channel type

To send notifications by email, select **Email** as the channel type. Then select a **Sender type**, a sender, and at least one default recipient. A channel uses one sender, either an **SMTP sender** or an **SES sender** that sends email through Amazon SES. In **Default recipients**, enter email addresses or select a recipient group to send notifications to multiple people. If the sender or recipient group doesn't exist yet, select **Create SMTP sender**, **Create SES sender**, or **Create recipient group** to create one.

You can also manage senders and recipient groups on the **Email senders** and **Email recipient groups** pages in Notifications.

### Create email sender

To create an email sender, follow these steps:

1. Enter a **Sender name**. The name must contain 2 to 50 characters. Valid characters are lowercase letters, digits, hyphens (`-`), and underscores (`_`). For SMTP senders, this name is also part of the keystore setting names described in [Authenticate sender account](#authenticate-sender-account).
1. Enter the sender's **Email address**.
1. For an SMTP sender, enter the **Host** (for example, `smtp.gmail.com`) and **Port**, and then select an **Encryption method**: **SSL/TLS**, **STARTTLS**, or **None**. Most email providers require SSL/TLS or STARTTLS. To use either one, you must add the sender's user name and password to the OpenSearch keystore. For more information, see [Authenticate sender account](#authenticate-sender-account).
1. For an SES sender, enter the **IAM Role ARN** of the role that OpenSearch assumes to send email and the **AWS region**.
1. Select **Create**.

You can create an SMTP sender before you add its credentials to the OpenSearch keystore. However, you must [authenticate the sender account](#authenticate-sender-account) before a channel can send email through it.

An SES sender's email address must be a verified identity in Amazon SES in the sender's AWS Region. If your account is in the Amazon SES sandbox, recipient addresses must also be verified. OpenSearch sends email using the `ses:SendRawEmail` action. The IAM role that you specify in **IAM Role ARN** must have the following permission, and its trust policy must allow the node credentials to assume it, as described in [Publishing by assuming an IAM role](#publishing-by-assuming-an-iam-role):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ses:SendRawEmail",
      "Resource": "arn:aws:ses:<region>:<account_id>:identity/<sender_email_address>"
    }
  ]
}
```

### Create email recipient group

To create an email recipient group, follow these steps:

1. Select **Create recipient group**.
1. Enter a unique **Name** for the group and an optional description.
1. In **Emails**, select or enter the email addresses that you want to add to the group.
1. Select **Create**.

### Authenticate sender account

If an SMTP sender uses the SSL/TLS or STARTTLS encryption method, you must add the sender account's credentials to the OpenSearch keystore before the sender can send email. OpenSearch does not use keystore credentials for senders whose encryption method is None.

On every node, run the following commands from the OpenSearch home directory, replacing `<sender_name>` with the sender name that you entered when creating the sender. Each command prompts you for the value:

```bash
./bin/opensearch-keystore add opensearch.notifications.core.email.<sender_name>.username
./bin/opensearch-keystore add opensearch.notifications.core.email.<sender_name>.password
```

To apply new or updated credentials without restarting OpenSearch, call the Nodes Reload Secure Settings API after you update the keystore on every node:

```json
POST _nodes/reload_secure_settings
```
{% include copy-curl.html %}

If your keystore is password protected, provide the password in the request body:

```json
POST _nodes/reload_secure_settings
{
  "secure_settings_password": "<keystore_password>"
}
```

For more information, see [Nodes Reload Secure Settings API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-reload-secure/).

## Host deny list

To prevent OpenSearch nodes from sending notifications to specific hosts, add the hosts to the `opensearch.notifications.core.http.host_deny_list` setting. The deny list applies to channels that send HTTP requests: Slack, Amazon Chime, Microsoft Teams, and custom webhooks. Each entry can be a hostname, an IP address, or an IP address range in CIDR notation. OpenSearch rejects a message if the destination hostname matches an entry or if any IP address that the hostname resolves to falls within an entry. The setting is dynamic and is empty by default.

The following request adds an IP address range and a hostname to the deny list:

```json
PUT _cluster/settings
{
  "persistent": {
    "opensearch.notifications.core.http.host_deny_list": ["10.0.0.0/8", "internal.example.com"]
  }
}
```
{% include copy-curl.html %}

For more information about Notifications plugin settings, see [Notifications plugin settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/plugin-settings/#notifications-plugin-settings).
