---
layout: default
title: Notifications
nav_order: 90
has_children: true
redirect_from:
  - /notifications-plugin/
  - /notifications-plugin/index/
---

# Notifications

The Notifications plugin provides a central location for all of your notifications from OpenSearch plugins. Using the plugin, you can configure which communication service you want to use and see relevant statistics and troubleshooting information. Currently, the Alerting and ISM plugins have integrated with the Notifications plugin.

You can use either OpenSearch Dashboards or the REST API to configure notifications. Dashboards offers a more organized way of selecting a channel type and selecting which OpenSearch plugin sources you want to use, whereas the REST API lets you programmatically define your notification channels for better versioning and reuse later on.

1. Use the Dashboards UI to first create a channel that receives notifications from other plugins. Supported communication channels include Amazon Chime, Amazon Simple Notification Service (Amazon SNS), Amazon Simple Email Service (Amazon SES), email through SMTP, Slack, Microsoft Teams, and custom webhooks. After you’ve configured your channel and plugin sources, send messages and start tracking your notifications from the Notifications plugin's dashboard.

2. Use the Notifications REST API to configure all of your channel's settings. To use the API, you must have your notification's name, description, channel type, which OpenSearch plugins to use as sources, and other associated URLs or groups.

## Create a channel

In OpenSearch Dashboards, choose **Notifications**, **Channels**, and **Create channel**.

1. In the **Name and description** section, specify a name and optional description for your channel.
2. In the **Configurations** section, select the channel type and enter the necessary information for each type. For more information about configuring a channel that uses Amazon SNS or email, refer to the sections below. If you want to use Amazon Chime or Slack, you need to specify the webhook URL. For more information about using webhooks, see the documentation for [Slack](https://api.slack.com/messaging/webhooks), [Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/what-are-webhooks-and-connectors), or [Amazon Chime](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html).

If you want to use custom webhooks, you must specify more information: parameters and headers. For example, if your endpoint requires basic authentication, you might need to add a header with an authorization key and a value of `Basic <Base64-encoded-credential-string>`. You might also need to change `Content-Type` to whatever your webhook requires. Popular values are `application/json`, `application/xml`, and `text/plain`.

This information is stored in plain text in the OpenSearch cluster. We will improve this design in the future, but for now, the encoded credentials (which are neither encrypted nor hashed) might be visible to other OpenSearch users.

1. In the **Availability** section, select the OpenSearch plugins you want to use with the notification channel.
2. Choose **Create**.

### Amazon SNS as a channel type

OpenSearch supports Amazon SNS for notifications. This integration with Amazon SNS means that, in addition to the other channel types, the Notifications plugin can send email messages, text messages, and even run AWS Lambda functions using SNS topics. For more information about Amazon SNS, see the [Amazon Simple Notification Service Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/welcome.html).

The Notifications plugin currently supports two ways to authenticate users:

1. Provide the user with full access to Amazon SNS.
2. Let the user assume an AWS Identity and Access Management (IAM) role that has permissions to access Amazon SNS. Once you configure the notification channel to use the right Amazon SNS permissions, select the OpenSearch plugins that can trigger notifications.

### Provide full Amazon SNS access permissions

If you want to provide full Amazon SNS access to the IAM user, ensure that the user has the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sns:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
```

### Assuming an IAM role with Amazon SNS permissions

If you want to let the user send notifications without directly having full permissions to Amazon SNS, let the user assume a role that does have the necessary permissions.

The IAM user must have the following permissions to assume a role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "iam:ListRoles",
        "sts:AssumeRole"
      ],
      "Resource": "*"
    }
  ]
}
```

Then add this policy into the IAM user’s trust relationship to actually assume the role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
  {
    "Effect": "Allow",
    "Principal": {
    "AWS": "arn:aws:iam::<arn_number>:user/<iam_username>",
    },
    "Action": "sts:AssumeRole"
  }
  ]
}
```


## Email as a channel type

To send or receive notifications with email, choose **Email** as the channel type. Next, select at least one sender and default recipient. To send notifications to more than a few people at a time, specify multiple email addresses or select a recipient group. If the Notifications plugin doesn’t currently have the necessary senders or groups, you can add them by first selecting **SMTP sender** and then choosing **Create SMTP sender** or **Create recipient group**. Choose **SES sender** to use Amazon Simple Email Service (Amazon SES).

### Create email sender

1. Specify a unique name to associate with the sender.
2. Enter an email address and, if applicable, its host (for example, smtp.gmail.com) and the port. If you're using Amazon SES, enter the IAM role Amazon Resource Name (ARN) of the AWS account to send notifications from, along with the AWS Region.
3. Choose an encryption method. Most email providers require Secure Sockets Layer (SSL) or Transport Layer Security (TLS), which require a user name and password in the OpenSearch keystore. See [Authenticate sender account](#authenticate-sender-account) to learn more. Selecting an encryption method is only applicable if you're creating an SMTP sender.
4. Choose **Create** to save the configuration and create the sender. You can create a sender before you add your credentials to the OpenSearch keystore; however, you must [authenticate each sender account](#authenticate-sender-account) before you use the sender in your channel configuration.

### Create email recipient group

1. After choosing **Create recipient group**, enter a unique name to associate with the email group and an optional description.
2. Select or enter the email addresses you want to add to the recipient group.
3. Choose **Create**.

### Authenticate sender account

If your email provider requires SSL or TLS, you must authenticate each sender account before you can send an email. Enter the sender account credentials in the OpenSearch keystore using the command line interface (CLI). Run the following commands (in your OpenSearch directory) to enter your user name and password. The &lt;sender_name&gt; is the name you entered for **Sender** earlier.

```json
opensearch.notifications.core.email.<sender_name>.username
opensearch.notifications.core.email.<sender_name>.password
```

To change or update your credentials (after you’ve added them to the keystore on every node), call the reload API to automatically update those credentials without restarting OpenSearch.

```json
POST _nodes/reload_secure_settings
{
  "secure_settings_password": "1234"
}
```
