---
layout: default
title: Notification settings
parent: Index management in Dashboards
nav_order: 60
---

# Notification settings

You can configure default notification settings for index operations globally on the **Notification settings** page.  You can also configure additional notification settings for individual index operations.

## Configuring default notification settings

On the **Notification settings** page, you can configure the default notification settings for the following index operations that may take longer time to complete:

- Open
- Reindex
- Split
- Shrink
- Clone
- Force merge

To get started, from the top menu, select **OpenSearch Plugins** > **Index Management**. Under **Index Management**, select **Notification settings**.

You can choose to be notified when the operation has completed or failed. Additionally, you can select the notification channels for this notification, as shown in the following image:

![Default notification settings]({{site.url}}{{site.baseurl}}/images/admin-ui-index/notifications.png)

If you don't have permissions to view notification settings, you will not be able to view the default settings. 
{: .note}

## Configuring notification settings for an individual operation

You can view default notification settings when you perform an indexing operation. You can also set up additional notifications. For example, if you want to configure additional notification for a reindex operation, perform the following steps:

1. From the top menu, select **OpenSearch Plugins** > **Index Management**.
1. Under **Index Management**, select **Indices**.
1. Select the index you want to reindex.
1. In the **Actions** dropdown list, select **Reindex**.
1. After selecting all reindex options, expand **Advanced settings**. Under **Notify on reindex status**, default notifications are listed. 
    
    If you don't have permissions to view notification settings, you will not be able to view the default settings. 
    {: .note}
1. To receive additional notifications, select **Send additional notifications**, as shown in the following image.

    ![Individual notification settings]({{site.url}}{{site.baseurl}}/images/admin-ui-index/notification-individual.png)
1. Select the options to be notified when the operation has failed or completed.
1. In the **Notification channels** dropdown list, select the channel where you want to be notified. If you want to configure a new notification channel, select **Manage channels**.
1. Select the **Reindex** button.

