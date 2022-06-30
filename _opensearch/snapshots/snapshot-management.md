---
layout: default
title: Snapshot management
parent: Snapshots
nav_order: 20
has_children: false
---

# Snapshot management

Snapshot management (SM) lets you automate [taking snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#take-snapshots). To use this feature, you need to install [Index Management Plugin]({{site.url}}{{site.baseurl}}/im-plugin). Snapshots store only incremental changes since the last snapshot. Thus, while taking an initial snapshot may be a heavy operation, subsequent snapshots have minimal overhead. To set up automatic snapshots, you have to create an SM policy with a desired SM schedule and configuration. 

When you create an SM policy, its document ID is given the name `<policy_name>-sm-policy`. Because of this, SM policies have to obey the following rules:

- SM policies must have unique names. 

- You cannot update the policy name after its creation. 

SM-created snapshots have names in the format `<policy_name>-<date>-<random number>`. Two snapshots created by different policies at the same time always have different names because of the `<policy_name>` prefix. To avoid name collisions within the same policy, each snapshot's name contains a random string suffix.

Each policy has associated metadata that stores the policy status. Snapshot management saves SM policies and metadata in the system index, and reads them from the system index. Thus, snapshot management depends on the OpenSearch cluster's indexing and searching functions. The policy's metadata keeps information about the latest creation and deletion only. .The metadata is read before running every scheduled job, so that SM can continue execution from the previous job's state. You can view the metadata using the [explain API]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#explain).

An SM schedule is a custom [cron]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron) expression. It consists of two parts: a creation schedule, and a deletion schedule. You must set up a schedule that specifies the frequency and timing of taking snapshots. Optionally, you can set up a separate schedule for deleting snapshots.

An SM configuration includes the indices and repository for these snapshots, and has all parameters you can define when [creating a snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#take-snapshots) using the API. Additionally, you can define the format and time zone for the date used in the snapshot's name.


## Performance 

One snapshot can contain as many indices as there are in the cluster. We expect at most dozens of SM policies in one cluster, but a snapshot repository can safely scale to thousands of snapshots. However, to manage its metadata, a large repository requires more memory on the cluster manager node. 

Snapshot management depends on the job scheduler plugin to schedule a job that is run periodically. Each SM policy corresponds to one SM scheduled job. The scheduled job is lightweight, so the burden of SM depends on the snapshot creation frequency and the burden of running the snapshot operation itself. 

## Concurrency 

Inside one SM policy, we design SM to not support concurrent snapshot operations which may degrade the cluster if there are too many. Snapshot operations, creation or deletion, are performed asynchronously, and until the previous operation finishes, SM won't start a new operation.

We don't recommend creating several SM policies with the same schedule and overlapping indices in one cluster, because it leads to concurrent snapshot creation on same indices and hinders performance. 
{: .warning }


We don't recommend setting up the same repository for multiple SM policies with same schedule in different clusters, since it may bring a sudden spike of burden on this repository.
{: .warning }

## Failure management

If a snapshot operation fails, it is retried for a maximum of three times. The failure message is saved in metadata and is overwritten if a subsequent snapshot operation attempt succeeds. You can view the failure message using the [explain API]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#explain). When using Dashboards, you can view the failure message in the policy details page. Possible reasons for failure include red index status, and shard reallocation.

## Security

The security plugin has two built-in roles for snapshot management actions: `snapshot_management_full_access` and `snapshot_management_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/users-roles#predefined-roles).

The following table lists the required permissions for each API of snapshot management.

Function | API | Permission
:--- | :--- | :---
Get policy | GET _plugins/_sm/policies<br>GET _plugins/_sm/policies/`policy_name` | cluster:admin/opensearch/snapshot_management/policy/get<br>cluster:admin/opensearch/snapshot_management/policy/search 
Create/update policy | POST _plugins/_sm/policies/`policy_name`<br> PUT _plugins/_sm/policies/`policy_name`?if_seq_no=1&if_primary_term=1 | cluster:admin/opensearch/snapshot_management/policy/write
Delete policy | DELETE  _plugins/_sm/policies/`policy_name` | cluster:admin/opensearch/snapshot_management/policy/delete
Explain | GET _plugins/_sm/policies/`policy_names`/_explain | cluster:admin/opensearch/snapshot_management/policy/explain
Start | POST  _plugins/_sm/policies/`policy_name`/_start | cluster:admin/opensearch/snapshot_management/policy/start
Stop| POST  _plugins/_sm/policies/`policy_name`/_stop | cluster:admin/opensearch/snapshot_management/policy/stop


## API

The following table lists all [API functions]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api) of snapshot management.

Function | API | Description
:--- | :--- | :---
[Create policy]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#create-or-update-a-policy) | POST _plugins/_sm/policies/`policy_name` | Creates an SM policy.
[Update policy]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#create-or-update-a-policy) | PUT _plugins/_sm/policies/`policy_name`?if_seq_no=`sequence_number`&if_primary_term=`primary_term` | Modifies the `policy_name` policy.
[Get all policies]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#get-policies) | GET _plugins/_sm/policies | Returns all SM policies.
[Get the policy `policy_name`]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#get-policies) | GET _plugins/_sm/policies/`policy_name` | Returns the `policy_name` SM policy.
[Delete policy]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#delete-a-policy) | DELETE  _plugins/_sm/policies/`policy_name` | Deletes the `policy_name` policy.
[Explain]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#explain) | GET _plugins/_sm/policies/`policy_names`/_explain | Provides the enabled/disabled status and the metadata for all policies specified by `policy_names`.
[Start policy]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#start-a-policy) | POST  _plugins/_sm/policies/`policy_name`/_start | Starts the `policy_name` policy.
[Stop policy]({{site.url}}{{site.baseurl}}/opensearch/snapshots/sm-api#stop-a-policy)| POST  _plugins/_sm/policies/`policy_name`/_stop | Stops the `policy_name` policy.