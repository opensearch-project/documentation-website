---
layout: default
title: Core index operations
parent: Index operations
nav_order: 10
---


# Core index operations in OpenSearch Dashboards

Introduced 2.5
{: .label .label-purple }

You can use in OpenSearch Dashboards to perform the following core index operations:
- [Viewing indexes](#viewing-indexes)
- [Creating an index](#creating-an-index)
- [Creating an append-only index](#creating-an-append-only-index)
- [Modifying an index](#modifying-an-index)
- [Deleting an index](#deleting-an-index)
- [Opening and closing indexes](#opening-an-index)


## Viewing indexes

You can view the list of indexes on your cluster. You can also select an index from the list to view detailed information about a single index.


### Viewing the list of indexes

To view the list of indexes in your cluster, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. Select **Indexes** to view a list of existing indexes in your OpenSearch cluster. The list provides the following information about each index:

    - **Index**: The name of the index
    - **Health**: One of three replication status codes, as follows:
        - Green: All primary and replica shards are assigned.
        - Yellow: At least one replica shard is not assigned.
        - Red: At least one primary shard is not assigned.
    - **Managed by policy**: Whether the index is contained (directly, or indirectly through an alias) in a policy.
    - **Status**: Open or closed.
    - **Total size**: The sum of all storage used for the index over all primary and replica shards.
    - **Size of primaries**: The storage used for the index over all primary shards.
    - **Total documents**: The number of documents contained in the index.
    - **Deleted documents**: How many documents have been deleted from the index.
    - **Primaries**: How many primary shards the index uses.
    - **Replicas**: How many replica shards the index uses.


### Viewing index details

To view details about an index, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. Select **Indexes** to view the list of existing indexes.

1. In the Index column, select the name of the index you want to view.

   There might be more than one page of indexes in the list.
   {: .note}

   The index page shows an Overview panel with metrics about the index's status.

   You can modify the index on this page. See [Modifying an index](#modifying-an-index).

1. To return to the index list, select Index in the breadcrumb trail in the upper left next to the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/home-icon.png" class="inline-icon" alt="home icon"/>{:/} (home) icon.


## Creating an index

To create a new index, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. On the **Index Management** page, select the **Create index** button in the upper-right corner of the **Indexes** panel.

   The **Create index** dialog contains three panels:
   - **Define index**
   - **Index settings**
   - **Index mapping** (optional)

1. In the **Define index** panel, do the following:
    1. Enter a name for the index in the **Index name** box.
    1. (Optional) Select one or more aliases for the index from the **Index alias - _optional_** combo box. Or, enter the name of a new alias you want to create.

1. In the **Index settings** panel, do the following:
    1. In the **Number of primary shards** box, enter the number of primary shards for the index.
    1. In the **Number of replicas** box, enter the number of replicas for the index.
    1. In the **Refresh interval** box, enter how often the index should refresh to make new data available for search. The default interval is `1s`.
    1. (Optional) Select **Advanced settings** to upload configuration parameters in a flat JSON object. See [Index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#index-level-index-settings) and [Query parameters `flat_settings`]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui).

1. In the **Index mapping – _optional_** panel, do the following to add one or more index mappings.
   1. Select the **Visual editor** or the **JSON editor** button. We recommend using the Visual editor unless you're going to paste in an existing JSON mapping.
   1. Select **Add new field** or **Add new object**.
   1. In the **Field name** box, enter a name for the field or object.
   1. In the **Field type** drop-down, select a data type for the field.
   1. (Optional) If the field type is `object`, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} (plus) icon one or more times to add nested objects or fields.
   1. Repeat the preceding four steps to add as many fields as needed.

1. When all three panels have been completed, select the **Create** button to create the index.

   The system also creates any new aliases you specified in the **Define index** panel.
   {: .note}


## Creating an append-only index

To create an index with updates disabled, do the following:

1. Create an index on the **Index Management** page of OpenSearch Dashboards as described in [Creating an Index](#creating-an-index).
1. In the **Index settings** panel, add the following setting specifier to the **Advanced settings**:

```json
    "index.append_only.enabled": "true"
```
{% include copy.html %}

After an index is created as append-only, it cannot be changed to another index type.
{: .warning}


## Modifying an index

To modify an index, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. Select **Indexes** in the **Index Management** navigation panel.

1. In the **Index** list, select the index name in the **Index** column.

   There might be more than one page of indexes in the list.
   {: .note}

1. Select the tab containing one of the following aspects of the index that you want to edit:
   - **Settings** brings up the **Index settings** panel.
   - **Mapping** brings up the **Index mappings** panel.
   - **Alias** brings up the **Index alias** panel.

   1. In the **Index settings** panel, change one or both of the following:
      - Number of replicas
      - Refresh interval
      
      You cannot change the number of primary shards of an existing index.
      {: .note}

      - (Optional) In the **Index settings** panel, select **Advanced settings** to upload configuration parameters in a flat JSON object. See [Index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#index-level-index-settings) and [Query parameters `flat_settings`]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui).

   1. In the **Index mappings** panel you can add one or more new fields or objects.

       You cannot change the name or type of a field that already exists in an index.

   1. In the **Index alias** panel, you can do any or all of the following:
       - Enter one or more new aliases to the index.
       - Select one or more existing aliases from the **Index alias – _optional_** drop-down.
       - Remove one or more aliases from the index by selecting the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/cross-icon.png" class="inline-icon" alt="cross icon"/>{:/} (cross) icon next to the alias name.

1. When you are finished modifying the index in all three panels, select **Save**.


## Deleting an index

To delete one or more indexes, follow these steps:

Deleted indexes are not recoverable.
{: .warning}

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. Select **Indexes** in the **Index Management** navigation panel.

1. Select the check box next every index that you want to delete.

   There might be more than one page of indexes in the list.
   {: .note}

1. Select the **Actions** button at the upper right of the Indexes panel.

1. Select **Delete** from the drop-down.

1. In the confirmation dialog, enter `delete` in the text box.

1. Select the **Delete** button.


## Closing and opening indexes

To update a static index setting, you must close the index, update the setting, and then reopen the index. Closing an index prevents reading from the index or performing data operations on it. See [Index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#index-level-index-settings).

You can open and close indexes from the **Index Management** page of OpenSearch Dashboards.

### Closing an index

To close one or more indexes, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. Select **Indexes** in the **Index Management** navigation panel.

1. Select the check box next every index that you want to close.

   There might be more than one page of indexes in the list.
   {: .note}

1. Select the **Actions** button at the upper right of the Indexes panel.

1. Select **Close** from the drop-down.

1. In the confirmation dialog, enter `close` in the text box.

1. Select the **Close** button.

### Opening an index

To open one or more closed indexes, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. Select **Indexes** in the **Index Management** navigation panel.

1. Select the check box next every index that you want to open.

   There might be more than one page of indexes in the list.
   {: .note}

1. Select the **Actions** button at the upper right of the Indexes panel.

1. Select **Open** from the drop-down.

1. Select the **Open** button.


## Next steps

- To peform other index operations using OpenSearch Dashboards, see [Managing indexes in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-manage/).

- To perform core index operations programmatically instead, use the [Core index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/core-index-apis/).

Index state management (ISM) enables you to automate index management in your OpenSearch cluster. See [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/).
