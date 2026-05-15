---
layout: default
title: With OpenSearch Dashboards
parent: Index notifications
nav_order: 10
---

# Setting up notifications using OpenSearch Dashboards

You can configure global default notification settings for index operations in [Notification settings](#configuring-default-notifications). You can also configure notification settings for individual index operations.

Notifications require the notifications plugin. See [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/).
{: .note}

## Prerequisites

All notification operations described here assume that you are on the **Index Management** page. To navigate to the **Index Management** page, do the following:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.


## Configuring default notifications

In the **Notification settings** interface, you can configure the default notification settings for index operations that may take longer to complete. These operations include the following:

- Open
- Reindex
- Split
- Shrink
- Clone
- Force merge

To configure default notifications, follow these steps:


1. In the **Index Management** panel, select **Notification settings**.

1. Set up one or more notification channels as described in [Creating a notification channel](#creating-a-notification-channel).

1. In the **Defaults for index operations** panel, select the checkboxes for all notifications you want to send.

   For each operation choice, you can separately select to be notified when the operation **Has failed** or **Has completed**.

   The operation choices are:
   - **Reindex**
   - **Shrink, split, clone**
   - **Force merge**
   - **Open**

   If you don't have permission to view notification settings, you cannot view or select the default settings.
   {: .note}

   When you select a notification, the operation choice displays a **Notification channels** drop-down.

1. For each operation choice with a selected notification, choose one or more channels from the **Notification channels** drop-down.

1. Select **Save** in the lower right corner of the **Notification settings** page.
   

## Sending additional notifications

You can view default notifications and send additional notifications when you perform one of the following operations:

- Reindex
- Split
- Shrink
- Force merge

To view default notifications and send additional notifications, follow these steps:

1. In the **Index Management** interface, select **Indexes**.

1. Select the index you want to perform the operation on.

1. Select the **Actions** button in the upper right of the index page.

1. Select the operation in the **Actions** dropdown list. For example, choose **Reindex** to perform the reindex operation.

1. In the operation page, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) icon next to  **Advanced settings**.
    
   If you don't have permission to view notification settings, you will not be able to view the default settings.
   {: .note}

   The **Advanced settings** panel lists the default notifications in the **Notifications** section.

1. (Optional) To send additional notifications for this operation only, select the **Send additional notifications** checkbox.

1. Select one or both of the **Has failed / timed out** or **Has completed** checkboxes.

1. Select a channel from the **Notification channels** drop-down.

1. Select the operation button in the lower right of the operation page. For example, if the operation is Reindex, select the **Reindex** button.


## Creating a notification channel

To create a new notification channel, follow these steps:

1. Select the **Manage channels** button in the upper right of the **Index Management** page.

    The notification manager opens a separate **Channels** window.

1. In the **Channels** page, Select the **Create channel** button.

1. In the **Name and description** panel, enter a name for the channel in the **Name** box.

1. (Optional) In the **Description – _optional_** box, enter a description of the channel.

1. In the **Configurations** panel, select a channel type in the **Channel type** drop-down.

   Channel settings depend on the channel type. Controls for the channel settings appear when you select a channel type.

1. Enter settings information for the channel type you have selected. For example, an email channel requires that you select a sender type, enter a sender, and specify recipients. A Slack channel requires you to enter a Slack webhook URL.

1. (Optional) To test the new channel, select **Send test message** in the lower left of the **Create channel** page.

1. Select **Create** in the lower left of the **Create channel** page.


## Next steps

- Learn more about the [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) application.
