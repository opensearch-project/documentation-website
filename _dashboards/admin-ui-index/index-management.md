---
layout: default
title: Index Management
parent: Admin UI for index operations in OpenSearch Dashboards
nav_order: 10
---

# Index Management

The Index Management section in the admin UI allows you to preform the operations available in the [Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/) from OpenSearch Dashboards' web UI.
Introduced 2.5
{: .label .label-purple }

## Index Policies

[Policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/) are are configurations (JSON documents can also be uploaded) that define the following:

* The states that an index can be in, including the default state for new indexes. For example, you might name your states “hot,” “warm,” “delete,” and so on. For more information, see [States]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#states).
* Any actions that you want the plugin to take when an index enters a state, such as performing a rollover. For more information, see [Actions]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#actions).
* The conditions that must be met for an index to move into a new state, known as transitions. For example, if an index is more than eight weeks old, you might want to move it to the “delete” state. For more information, see [Transitions]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#transitions).

In other words, a policy defines the states that an index can be in, the actions to perform when in a state, and the conditions that must be met to transition between states.

You have complete flexibility in the way you can design your policies. You can create any state, transition to any other state, and specify any number of actions in each state.

To attach policies to indices:

* `Index policies` under `Index Management`.
* Choose the index or indexes that you want to attach your policy to.
* Choose Apply policy.
* From the Policy ID menu, choose the policy that you created. * You can see a preview of your policy.
* If your policy includes a rollover operation, specify a rollover alias. Make sure that the alias that you enter already exists. For more information about the rollover operation, see rollover.
* Choose Apply.
* After you attach a policy to an index, ISM creates a job that runs every 5 minutes by default to perform policy actions, check conditions, and transition the index into different states. To change the default time interval for this job, see Settings.

(Screenshots)

Policy jobs are not run if the cluster state is red.
{: .note}

## Managed Indices

To attach policies to indicies:

* `Manage Indices` under `Index Management`.
* Choose the index or indices that you want to attach your policy to.
* Select the `Change policy` button.
* Choose Apply policy.

(Screenshots)

## Indices

Displays a list of indices in your OpenSearch cluster. Various properties are listed for each index including Heath (Green, Yellow, Red), if the index is managed by a policy, status, total size, size of primaries, total documents, deleted documents, primaries and replicas.

(Screenshot)

#### Create Index

While you can [create an index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/) by using a document as a base, you can also just create an empty index for use later. 

To create an index, select the blue `Create Index` button located under the `Indices` section of `Index Management`. Then, define the index by setting the following:

* Index name.
* Number of primary shards.
* Number of replicas.
* Refresh interval.
* Add fields and objects using either the visual editor or the JSON editor.

`Advanced settings` allows you to upload a JSON configuration.

(Screenshot)

#### Apply policy

If you analyze time-series data, you likely prioritize new data over old data. You might periodically perform certain operations on older indices, such as reducing replica count or deleting them.

[Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/) (ISM) is a plugin that lets you automate these periodic, administrative operations by triggering them based on changes in the index age, index size, or number of documents. The admin UI uses the ISM plugin to define policies that automatically handle index rollovers or deletions to fit your use case.

For example, you can define a policy that moves your index into a `read_only` state after 30 days and then deletes it after a set period of 90 days. You can also set up the policy to send you a notification message when the index is deleted.

You might want to perform an index rollover after a certain amount of time or run a `force_merge` operation on an index during off-peak hours to improve search performance during peak hours.

To apply a policy, select the index you want to apply the policy to in the `Indices` list under `Index Management`. Then select the `Actions` button, and select `Apply policiy` from the drop-down menu.

(Screenshot)

#### Close

The [close]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index/) operation closes an index. Once an index is closed, you cannot add data to it or search for any data within the index.

To close an index, select the index you want to close in the `Indices` list under `Index Management`. Then select the `Actions` button, and select `Close` from the drop-down menu.

(Screenshot)

#### Open

The [open]({{site.url}}{{site.baseurl}}/api-reference/index-apis/open-index/) index operation opens a closed index, letting you add or search for data within the index.

To open an index, select the index you want to open in the `Indices` list under `Index Management`. Then select the `Actions` button, and select `Open` from the drop-down menu.

(Screenshot)

#### Reindex

The [reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) operation lets you copy all or a subset of your data from a source index into a destination index.

To reindex an index, select the index you want to reindex in the `Indices` list under `Index Management`. Then select the `Actions` button, and select `Reindex` from the drop-down menu.

(Screenshot)

#### Shrink

The [shrink]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shrink-index/) index operation moves all of your data in an existing index into a new index with fewer primary shards.

To shrink an index, select the index you want to shrink in the `Indices` list under `Index Management`. Then select the `Actions` button, and select `Shrink` from the drop-down menu.

(Screenshot)

#### Split

The [split]({{site.url}}{{site.baseurl}}/api-reference/index-apis/split/) index operation splits an existing read-only index into a new index, cutting each primary shard into some amount of primary shards in the new index.

To split an index, select the index you want to split in the `Indices` list under `Index Management`. Then select the `Actions` button, and select `Split` from the drop-down menu.

(Screenshot)

#### Delete

If you no longer need an index, you can use the [delete]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index/) index operation to delete it.

To delete an index, select the index you want to delete in the `Indices` list under `Index Management`. Then select the `Actions` button, and select `Delete` from the drop-down menu.

(Screenshot)

## Templates

[Index templates]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) let you initialize new indices with predefined mappings and settings. For example, if you continuously index log data, you can define an index template so that all of these indices have the same number of shards and replicas.

To create a template, select the blue `Create template` button on the `Templates` page under `Index Management`.

Next, define the template:

* Enter the template name.
* Select the template type.
* Specify any index patterns you would like to use.
* Set the priority of the template.
* Select an index alias.
* Set the number of primary shards.
* Set the number of replicas.
* Set the refresh intervals.
* Add fields and objects for your index mapping using either the visual editor or the JSON editor.

(Screenshots)

## Aliases

An alias is a virtual index name that can point to one or more indexes. If your data is spread across multiple indexes, rather than keeping track of which indexes to query, you can create an alias and query it instead.

To create an alias:

* Select the blue `Create Alias` button on the `Aliases` page under `Index Management`.
* Specify the alias name.
* Enter the index, or index patterns to be part of the alias.
* Select `Create alias`.

To edit an alias:

* Select the alias you want to edit.
* Select the `Actions` button.
* Select `Edit` from the drop-down menu.

To delete an alias:

* Select the alias you want to edit.
* Select the `Actions` button.
* Select `Delete` from the drop-down menu.

(Screenshots)

## Rollup Jobs

The `Rollup Jobs` section under `Index Management` allows you to create or update index rollup jobs.

To create a rollup job:

* Select the blue `Create rollup job` button on the `Rollup Jobs` page under `Index Management`.
* Set the name, source index, and target index.
* Select `Next`.
* Set the timestamp field and interval type.
* Optionally you can set additional aggregations and additional metrics.
* Select `Next`.
* Under `Schedule`, check or uncheck `Enable job by default`.
* Set the Continuous, execution frequency, rollup interval and page per execution settings.
* Additionally, you can set an execution delay.
* Select `Next`.
* Review the settings for the rollup job and select `Create`.

You can also disable and enable rollup jobs by selecting the corresponding buttons on the `Rollup Jobs` page.

(Screenshots)

## Transform Jobs

Using the admin UI in OpenSearch Dashboards, you can create, start, stop, and complete operations with [transform]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/transforms-apis/) jobs.

To create a transform job:

* Select the blue `Create transform job` button on the `Transform Jobs` page under `Index Management`.
* Set the name, source index, and target index.
* Select `Next`.
* Select the fields to transform. From the table above, select a field you want to transform by clicking `+` next to the field name.
* Select `Next`.
* Check or uncheck `Job enabled by default`.
* Set wheter the schedule is continuous and the transform execution interval.
* Optionally you can set pages per execution under the `Advanced` drop-down.
* Select `Next`.
* Review the settings for the rollup job and select `Create`.

You can also disable and enable rollup jobs by selecting the corresponding buttons on the `Transform Jobs` page.

(Screenshots)

## Long running operation status check 

Certain index operations take time to complete (usually more than 30 secs, but could take tens of minutes or hours). This is tracked on the index status on indices page.

For reindex, shrink, and split operations as they are one-time operations and not recursive, you can check the new index status for the progress of these operations.

## Security Integration

  Permission control is managed with existing [permissions]({{site.url}}{{site.baseurl}}/security-plugin/access-control/permissions/) or action groups that are enforced at the API level. There is currently no UI level permission control. Whoever can access the ISM plugin is able to view new pages, but whether they can make changes depends on whether they have permission to run the related APIs.

## Error Handling

Similar to API calls, if the operation fails immediately, you will be notified with an error message. However, if it is a long running operation, you will be notified of the failure at the time of failure, or you can check the index status on the `Indices` page.

(Screenshot)

## Notifications

The admin UI uses the notification plugin to inform you of the completion of long running operations such as split, shrink, and reindex.
