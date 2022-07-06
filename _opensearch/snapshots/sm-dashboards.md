---
layout: default
title: Snapshot Management in OpenSearch Dashboards
parent: Snapshots
nav_order: 35
has_children: false
---

# Using Snapshot Management in OpenSearch Dashboards

You can set up Snapshot Management (SM) in OpenSearch Dashboards.

## Create a repository

Before you create an SM policy, you need to set up a repository for snapshots. 

1. On the top menu bar, go to **OpenSearch Plugins > Snapshot Management**.
1. In the left panel, under **Snapshot Management**, select **Repositories**.
1. Select the **Create Repository** button.
1. Enter the repository name, type, and location. 
1. (Optional) Select **Advanced Settings** and enter additional settings for this repository as a JSON object. Example:
```json
{
    "chunk_size": null,
    "compress": false,
    "max_restore_bytes_per_sec": "40m",
    "max_snapshot_bytes_per_sec": "40m",
    "readonly": false
}
```
1. Select the **Add** button.

## Create an SM policy

Create an SM policy to set up automatic snapshots. An SM policy defines an automated snapshot creation schedule and an optional automated deletion schedule.

1. On the top menu bar, go to **OpenSearch Plugins > Snapshot Management**.
1. In the left panel, under **Snapshot Management**, select **Snapshot Policies**.
1. Select the **Create Policy** button.
1. In the **Policy settings** section:
    1. Enter the policy name.
    1. (Optional) Enter the policy description.
1. In the **Source and destination** section:
    1. Select or enter source indexes either as a list or as an index pattern.
    1. Select a repository for snapshots. To [create a new repository](#create-a-repository), select the **Create** button.
1. In the **Snapshot schedule** section:
    1. Select the desired snapshot frequency or enter a custom cron expression for snapshot frequency.
    1. Select the start time and time zone.
1. In the **Retention period** section:
    1. Choose to retain all snapshots or specify retention conditions (the maximum age of retained snapshots).
    1. (Optional) In **Additional settings**, select the minimum and maximum number of retained snapshots, deletion frequency, and deletion start time.
1. In the **Notifications** section, select the snapshot activities you want to be notified about.
1. (Optional) In the **Advanced settings** section, select the desired options:
    - **Include cluster state in snapshots**
    - **Ignore unavailable indices**
    - **Allow partial snapshots**
1. Select the **Create** button.

## View, edit, or delete an SM policy

You can view, edit, or delete an SM policy on the policy details page.

1. On the top menu bar, go to **OpenSearch Plugins > Snapshot Management**.
1. In the left panel, under **Snapshot Management**, select **Snapshot Policies**.
1. Click on the **Policy name** of the policy you want to view, edit, or delete. <br>
The policy settings, snapshot schedule, snapshot retention period, notifications, and last creation and deletion are displayed in the policy details page. <br> If a snapshot creation or deletion fails, you can view information about the failure in the **Last Creation/Deletion** section. To view the failure message, click on the **cause** in the **Info** column. 
1. To edit or delete the SM policy, select the **Edit** or **Delete** button.

## Enable, disable, or delete SM policies

1. On the top menu bar, go to **OpenSearch Plugins > Snapshot Management**.
1. In the left panel, under **Snapshot Management**, select **Snapshot Policies**.
1. Select one or more policies in the list.
1. To enable or disable selected SM policies, select the **Enable** or **Disable** button. To delete selected SM policies, in the **Actions** list, select the **Delete** option.

## View snapshots

1. On the top menu bar, go to **OpenSearch Plugins > Snapshot Management**.
1. In the left panel, under **Snapshot Management**, select **Snapshots**.
All automatically or manually taken snapshots appear in the list.
1. To view a snapshot, click on its **Name**.

## Take a snapshot

Use the steps below to take a snapshot manually. If you need to restore a snapshot, use the [restore snapshot API operation]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#restore-snapshots).

1. On the top menu bar, go to **OpenSearch Plugins > Snapshot Management**.
1. In the left panel, under **Snapshot Management**, select **Snapshots**.
1. Select the **Take snapshot** button.
1. Enter the snapshot name.
1. Select or enter source indexes either as a list or as an index pattern.
1. Select a repository for the snapshot.
1. (Optional) In the **Advanced options** section, select the desired options:
    - **Include cluster state in snapshots**
    - **Ignore unavailable indices**
    - **Allow partial snapshots**
1. Select the **Add** button.
