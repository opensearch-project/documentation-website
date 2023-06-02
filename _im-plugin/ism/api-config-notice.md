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

## Create, read, update, and delete (CRUD)

The following code examples show how to configure notifications settings for monitoring long-running index operations.

### Create 


## Next steps

- Learn more about the ISM API.
- Learn more about the [Notifications](observing-your-data/notifications/index/) application. 
