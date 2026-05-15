---
layout: default
title: Managing aliases with Dashboards
parent: Index aliases
nav_order: 10
---


# Managing aliases with OpenSearch Dashboards

An alias is a virtual index name that can point to one or more indexes. If your data is spread across multiple indexes, rather than keeping track of which indexes to query, you can create an alias and query it instead. See [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/aliases/index/).

This page shows to use OpenSearch Dashboards to create and manage aliases. It includes the following procedures:

- [Viewing aliases](#viewing-aliases)
- [Creating an alias](#creating-an-alias)
- [Editing an alias](#editing-an-alias)
- [Deleting an alias](#deleting-an-alias)
- [Refreshing an alias](#refreshing-aliases)
- [Flushing an alias](#flushing-aliases)
- [Clearing an alias cache](#clearing-an-alias-cache)
- [Rolling over an alias](#rolling-over-an-alias)
- [Force merging aliases](#force-merging-aliases)


## Viewing aliases

You can view the list of aliases on your cluster.

To view the list of indexes in your cluster, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. Select **Aliases** to view a list of existing aliases in your OpenSearch cluster. The list provides the following information about each index:

    - **Alias name**: The name of the index.
    - **Write index**: The writable backing index for the alias, if any.
    - **Index name**: A list of backing indexes for the alias.


## Creating an alias

To create an alias, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. Select **Aliases** in the **Index Management** navigation panel.

1. Choose **Create alias**.

1. In the **Create alias** dialog, enter or select one or more indexes and index patterns in the **Indexes or index patterns** combo box.

1. Choose **Create alias**.


## Editing an alias

To edit an alias, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. Select **Aliases** in the **Index Management** navigation panel.

1. In the *Aliases* table, select the alias you want to edit from the **Alias name** column.

1. In the **Update alias** dialog, delete, enter, or select one or more indexes and index patterns in the **Indexes or index patterns** combo box.

   You cannot change the name of an existing alias.
   {: .note}

1. Choose **Save changes**.

## Deleting an alias

To delete an alias, follow these steps:

Deleted aliases are not recoverable.
{: .warning}

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. Select **Aliases** in the **Index Management** navigation panel.

1. In the *Aliases* table, select the checkboxes for one or more aliases that you want to delete.

1. Select **Actions**.

1. In the **Actions** drop-down, select **Delete**.

1. In the Delete aliases confirmation dialog, type `delete` in the text box.

1. Select **Delete**.


## Refreshing aliases

Refreshing an alias makes new operations (since the last refresh) visible to search operations. See the description in [Refresh API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/).

The refresh operation can be applied only to open indexes associated with the specified aliases.

To refresh one or more aliases, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. Select **Aliases** in the **Index Management** navigation panel.

1. (Optional) In the **Aliases** table, select the checkboxes for one or more aliases that you want to refresh.

   If you do not select any aliases, all aliases are refreshed.

1. Select the **Actions** button at the upper right of the Aliases panel.

1. Select **Refresh** from the drop-down.

1. In the confirmation dialog, select the **Refresh** button.


## Flushing aliases

The flush operation performs a Lucene commit, writing segments to disk and starting a new transaction log. See the description in [Flush API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/).

The flush operation can be applied only to open indexes associated with the specified aliases.

To flush one or more aliases, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. Select **Aliases** in the **Index Management** navigation panel.

1. (Optional) In the **Aliases** table, select the checkboxes for one or more aliases that you want to flush.

   If you do not select any aliases, all aliases are flushed.

1. Select the **Actions** button at the upper right of the **Aliases** panel.

1. Select **Flush** from the drop-down.

1. In the confirmation dialog, select the **Flush** button.


## Clearing an alias cache

The clear cache API operation clears the caches of one or more indexes. For data streams, the API clears the caches of the stream’s backing indexes. See the description in [Clear Cache API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/).

The clear cache operation can be applied only to open indexes associated with the specified aliases.

To clear the caches of the indexes in one or more aliases, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. Select **Aliases** in the **Index Management** navigation panel.

1. (Optional) In the **Aliases** table, select the checkboxes for one or more aliases for which you want to clear the caches.

   If you do not select any aliases, all aliases are cleared.

1. Select the **Actions** button at the upper right of the **Aliases** panel.

1. Select **Clear cache** from the drop-down.

1. In the confirmation dialog, select the **Clear cache** button.


## Rolling over an alias
Introduced 2.6
{: .label .label-purple }

To perform a rollover operation on an alias, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Alias**.

1. Choose **Actions**.

1. From the **Actions** drop-down, choose **Roll over**.

1. In the **Configure source** panel, select the source alias on which you want to perform the rollover operation from the **Select an alias or data stream** drop-down.

   The panel displays the alias's write index under the heading **Assigned source index**.

1. In the Configure new rollover index panel, follow these steps to configure the new writing index for the rollover:

   1. (Optional) Import the configuration from the old write index.

      To use the same configuration as the old write index, select the **Import from old write index** button.

   1. Enter a name for the new index in the **Index name** box.

   1. Enter (or modify) the definition, settings, and mapping for the new write index. See the description of definitions, settings, and mappings in [Creating an index]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/).

1. Select the **Roll over** button at the lower right of the page.

   Note that the write index has changed the **Backing indexes** column in the **Aliases** table.


## Force merging aliases

You can force-merge the backing indexes of one or more aliases by applying force-merge to the aliases. See [Force merge API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/).

To perform a force merge operation on one or more aliases, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Aliases**.

1. Choose **Actions**.

1. From the **Actions** drop-down, choose **Force merge**.

1. In the **Configure source index** panel, enter or select one or more aliases containing the backing indexes you want to force merge in the **Select source indexes or data streams** combo box.

1. (Optional) Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) icon in the **Advanced settings** panel.

   1. Set one or more advanced options:

      - **Index segments**: Select **Manually set number of segments** to specify the number of segments to merge to. To fully merge indexes, set the number of segments to 1.
      - Select **Flush indexes** to flush indexes after the force merge. See the description in [Flush API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/).
      - Select **Remove deleted documents** to expunge deleted documents. See [Force merge API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/).
      - **Notifications**: You can set notifications for the force merge depending on outcome. Select one or both of **Has failed / timed out** or **Has completed**.

1. Choose the **Force merge** button in the lower right of the **Force merge** page.
