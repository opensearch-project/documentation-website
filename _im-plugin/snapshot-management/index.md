---
layout: default
title: Snapshot management
nav_order: 55
has_children: true
redirect_from: /im-plugin/snapshot-management/
has_toc: false
---

# Snapshot management

Snapshot Management (SM) is a feature of the Index Management Plugin that lets you automate [taking snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshot-restore#take-snapshots). Snapshots are incremental, and have minimal overhead, since they store only incremental changes since the last snapshot. To set up automatic snapshots, you have to create an SM policy with a desired SM schedule and configuration. 

SM policies have to obey the following rules:

- SM policies must have unique names. 

- You cannot update the policy name after its creation. 

Each policy has associated metadata about the status of snapshot creation. The metadata is saved into the system index. The metadata is read before every scheduled job is run, so that SM can continue to execute from the previous job run. You can view the metadata with the `explain` [API](#API).

The cluster’s global metadata must be readable. To include an index in a snapshot, the index and its metadata must also be readable.
{: .note}

An SM schedule is a custom [cron]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron) expression that specifies the frequency of taking snapshots, and the timing of creating and deleting snapshots. 

An SM configuration includes the indices and repository for these snapshots, and has all parameters you can define when [creating a snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshot-restore#take-snapshots) manually. 

An SM configuration can have more than one index.
{: .note}

## Performance 

One snapshot can contain as many indices as there are in the cluster. We expect at most dozens of SM policies in one cluster, but a snapshot repository can safely scale to thousands of snapshots. However, to manage its metadata, a large repository requires more memory on the cluster manager node. 

Snapshot management depends on the job scheduler plugin to schedule a job that is run periodically. Each SM policy corresponds to one SM scheduled job. The scheduled job is lightweight, so the burden of SM depends on the snapshot creation frequency and the burden of running snapshot operation itself. However, too many pending SM tasks can block other high-priority tasks in the cluster.

## Concurrency 

- Taking a snapshot doesn’t block indexing or other requests. However, the snapshot won’t include changes made after the snapshot process starts. 

- Snapshot deletion doesn't block snapshot creation.

- Taking a snapshot can temporarily pause shard allocations. 

We don't recommend creating several SM policies with the same schedule and overlapping indices in one cluster, since it hinders performance. 
{: .warning }

We don't recommend setting up the same repository for multiple SM policies in different clusters, since it hinders performance. 
{: .warning }

## Failure management

If snapshot creation fails, it is retried for a maximum of three times. The failure message is saved into metadata and is removed if a subsequent snapshot creation attempt succeeds. Possible reasons for failure include red indices, and shard reallocation.

## Security

SM follows the OpenSearch plugin security model:

- The system index is only accessible to super admin (who uses the cluster SSL credential directly). Even the admin user can not access the system index.
    
- Each API plugin added is checked at transport layer by the security plugin. The security plugin checks the security roles of the calling user, if the roles contain the permission associated with this API.
    
- The API called within the plugin can be impersonated as the user. For example, SM will save the user security roles, and impersonate the user using these roles later when calling the snapshot APIs. And this call will also be checked by security plugin at transport layer 2 as described.

Security plugin provides role-based access control for OpenSearch. The role associated with user contains [permissions]({{site.url}}{{site.baseurl}}/security-plugin/access-control/permissions) for this user. Security plugin checks the security role of the user during API calling.

To use SM, the user’s role is must have the following permissions.

- SM APIs. For example, the role must have the permission `cluster:admin/opensearch/snapshot_management/put` for SM index policy API. Users without necessary permissions will be blocked when calling the SM API.

- Get/create/delete snapshot APIs For example, the user must have the permission `cluster:admin/snapshot/get` for get snapshot API. If the user does not have the necessary permissions, SM will fail to perform these snapshot operations at runtime.

The following table lists the required permissions for each function of SM.

Function | API | Permission
:--- | :--- | :---
Get policy | GET _plugins/_sm/policies<br>GET _plugins/_sm/policies/`policy_name` | cluster:admin/opensearch/snapshot_management/policy/get<br>cluster:admin/opensearch/snapshot_management/policy/search 
Create/update policy | POST _plugins/_sm/policies/`policy_name`<br> PUT _plugins/_sm/policies/`policy_name`?if_seq_no=1&if_primary_term=1 | cluster:admin/opensearch/snapshot_management/policy/write
Delete policy | DELETE  _plugins/_sm/policies/`policy_name` | cluster:admin/opensearch/snapshot_management/policy/delete
Explain | GET _plugins/_sm/policies/`policy_names`/_explain | cluster:admin/opensearch/snapshot_management/policy/explain
Start | POST  _plugins/_sm/policies/`policy_name`/_start | cluster:admin/opensearch/snapshot_management/policy/start
Stop| POST  _plugins/_sm/policies/`policy_name`/_stop | cluster:admin/opensearch/snapshot_management/policy/stop


## API

The following table lists all API functions of SM.

Function | API | Description
:--- | :--- | :---
Get all policies | GET _plugins/_sm/policies | Returns all SM policies.
Get the policy `policy_name` | GET _plugins/_sm/policies/`policy_name` | Returns the `policy_name` SM policy.
Create policy | POST _plugins/_sm/policies/`policy_name` | Creates an SM policy.
Update policy | PUT _plugins/_sm/policies/`policy_name`?if_seq_no=1&if_primary_term=1 | Modifies the `policy_name` policy.
Delete policy | DELETE  _plugins/_sm/policies/`policy_name` | Deletes the `policy_name` policy.
Explain | GET _plugins/_sm/policies/`policy_names`/_explain | Provides the enabled/disabled status and the metadata for all policies specified by `policy_names`.
Start | POST  _plugins/_sm/policies/`policy_name`/_start | Starts the `policy_name` policy.
Stop| POST  _plugins/_sm/policies/`policy_name`/_stop | Stops the `policy_name` policy.