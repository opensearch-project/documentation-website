---
layout: default
title: Snapshot Management
parent: Admin UI for index operations in OpenSearch Dashboards
nav_order: 20
---

# Snapshot Management

The Snapshot Management section in the admin UI allows you to preform operations available in the [Snapshots API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/index/) from OpenSearch Dashboards' web UI.
Introduced 2.5
{: .label .label-purple }

## Snapshot Policies

[Snapshot Management]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-management) (SM) lets you automate taking snapshots. To use this feature, you need to install the [Index Management (IM) Plugin]({{site.url}}{{site.baseurl}}/im-plugin/index/). Snapshots store only incremental changes since the last snapshot. Thus, while taking an initial snapshot may be a heavy operation, subsequent snapshots have minimal overhead. To set up automatic snapshots, you have to create a snapshot policy with a desired SM schedule and configuration.

When you create an SM policy, its document ID is given the name `<policy_name>-sm-policy`. Because of this, SM policies have to obey the following rules:

* SM policies must have unique names.
* You cannot update the policy name after its creation.

SM-created snapshots have names in the format `<policy_name>-<date>-<random number>`. Two snapshots created by different policies at the same time always have different names because of the `<policy_name>` prefix. To avoid name collisions within the same policy, each snapshot’s name contains a random string suffix.

Each policy has associated metadata that stores the policy status. Snapshot Management saves SM policies and metadata in the system index and reads them from the system index. Thus, Snapshot Management depends on the OpenSearch cluster’s indexing and searching functions. The policy’s metadata keeps information about the latest creation and deletion only. The metadata is read before running every scheduled job so that SM can continue execution from the previous job’s state. You can view the metadata using the explain API.

An SM schedule is a cron expression. It consists of two parts: a creation schedule and a deletion schedule. You must set up a creation schedule that specifies the frequency and timing of snapshot creation. Optionally, you can set up a separate schedule for deleting snapshots.

An SM configuration includes the indices and repository for the snapshots and supports all parameters you can define when creating a snapshot. Additionally, you can specify the format and time zone for the date used in the snapshot’s name.

To create a snapshot policy:

* Select the blue `Create policy` button in the `Snapshot Policies` section under `Snapshot Management`.
* Enter a policy name.
* Select your source index and snapshot repository.
* Configure your schedule. This can be set hourly, daily, weekly, monthly, or as a cron expression.
* Set your retention period.
* Choose whether or not to enable notifications.

(Screenshot)

Optional advanced settings include:

* Include cluster state in snapshots.
* Ignore unavailable indices.
* Allow partial snapshots.

(Screenshot)

You can also disable and enable snapshot policies using the corresponding buttons on the `Snapshot Policies` page.

(Screenshot)

## Snapshots

[Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/) are backups of a cluster’s indices and state. The state includes cluster settings, node information, index metadata (mappings, settings, templates, etc.), and shard allocation.

Snapshots have two main uses:

1. Recovering from failure

For example, if cluster health goes red, you might restore the red indexes from a snapshot.

2. Migrating from one cluster to another

For example, if you’re moving from a proof-of-concept to a production cluster, you might take a snapshot of the former and restore it on the latter.

You can take and restore snapshots using the admin UI in Dashboards.

If you need to automate taking snapshots, you can use the Snapshot policies feature as described in the previous section.

#### Take snapshot

To take a snapshot, navigate to the `Snapshots` section under `Snapshot management`. Then select the blue `Take snapshot` button. This [creates]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-snapshot/) a snapshot within an existing repository. To learn more about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index).

(Screenshot)

To view a list of your repositories, select the `Repositories` section under `Snapshot Management`.

(Screenshot)

#### Delete

[Deletes]({{site.url}}{{site.baseurl}}/api-reference/snapshots/delete-snapshot/) a snapshot from a repository.

* To view a list of your repositories, select `Repositories` under the `Snapshot Management` section.
* To view a list of your snapshots, select `Snapshots` under the `Snapshot Management` section.

(Screenshot)

#### Restore

[Restores]({{site.url}}{{site.baseurl}}/api-reference/snapshots/restore-snapshot/) a snapshot of a cluster or specified data streams and indices.

(Screenshot)

## Repositories

`Repositories` under the `Snapshot Management` section of the admin UI allows you to see all remote storage locations used to store snapshots configured in the cluster.

(Screenshot)

To add a repository, select the blue `Create repository` button. Then, enter the `Repository name`, `Repository type`, and `Location`.

(Screenshot)

You can also select the `Advanced settings` drop down to enter a JSON config roe a repository. Storage locations such as S3 will require this custom configuration.

(Screenshot)

#### Register snapshot repository

Before you can take a snapshot, you have to “[register]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository)” a snapshot repository. A snapshot repository is just a storage location: a shared file system, Amazon S3, Hadoop Distributed File System (HDFS), Azure Storage, etc.

To create a snapshot repository. select the blue `Create repository` button.

(Screenshot)

#### Delete snapshot repository configuration

To delete a snapshot repository configuration, select the repository in the `Repositories` list and select the `Delete` button above.

(Screenshot)