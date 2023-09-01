---
layout: default
title: Managed indexes
nav_order: 3
parent: Index State Management
has_children: false
redirect_from: 
 - /im-plugin/ism/managedindices/
---

# Managed indexes

You can change or update a policy using the managed index operations.

This table lists the fields of managed index operations.

Parameter | Description | Type | Required | Read Only
:--- | :--- |:--- |:--- |
`name` |  The name of the managed index policy. | `string` | Yes | No
`index` | The name of the managed index that this policy is managing. | `string` | Yes | No
`index_uuid`  |  The uuid of the index. | `string` | Yes | No
`enabled` |  When `true`, the managed index is scheduled and run by the scheduler. | `boolean` | Yes | No
`enabled_time` | The time the managed index was last enabled. If the managed index process is disabled, then this is null. | `timestamp` | Yes | Yes
`last_updated_time` | The time the managed index was last updated.  | `timestamp` | Yes | Yes
`schedule` | The schedule of the managed index job. | `object` | Yes | No
`policy_id` | The name of the policy used by this managed index. | `string` | Yes | No
`policy_seq_no` | The sequence number of the policy used by this managed index. | `number` | Yes | No
`policy_primary_term` | The primary term of the policy used by this managed index. | `number` | Yes | No
`policy_version` | The version of the policy used by this managed index. | `number` | Yes | Yes
`policy` | The cached JSON of the policy for the `policy_version` that's used during runs. If the policy is null, it means that this is the first execution of the job and the latest policy document is read in/saved. | `object` | No | No
`change_policy` | The information regarding what policy and state to change to. | `object` | No | No
`policy_name` | The name of the policy to update to. To update to the latest version, set this to be the same as the current `policy_name`. | `string` | No | Yes
`state` | The state of the managed index after it finishes updating. If no state is specified, it's assumed that the policy structure did not change. | `string` | No | Yes

The following example shows a managed index policy:

```json
{
  "managed_index": {
    "name": "my_index",
    "index": "my_index",
    "index_uuid": "sOKSOfkdsoSKeofjIS",
    "enabled": true,
    "enabled_time": 1553112384,
    "last_updated_time": 1553112384,
    "schedule": {
      "interval": {
        "period": 1,
        "unit": "MINUTES",
        "start_time": 1553112384
      }
    },
    "policy_id": "log_rotation",
    "policy_version": 1,
    "policy": {...},
    "change_policy": null
  }
}
```

## Change policy

You can change any managed index policy, but ISM has a few constraints in place to make sure that policy changes don't break indexes.

If an index is stuck in its current state, never proceeding, and you want to update its policy immediately, make sure that the new policy includes the same state---same name, same actions, same order---as the old policy. In this case, even if the policy is in the middle of executing an action, ISM applies the new policy.

If you update the policy without including an identical state, ISM updates the policy only after all actions in the current state finish executing. Alternately, you can choose a specific state in your old policy after which you want the new policy to take effect.

To change a policy using OpenSearch Dashboards, do the following:

- Under **Index Management**, choose the indexes that you want to attach the new policy to.
- To attach the new policy to indexes in specific states, choose **Choose state filters**, and then choose those states.
- Under **Choose New Policy**, choose the new policy.
- To start the new policy for indexes in the current state, choose **Keep indices in their current state after the policy takes effect**.
- To start the new policy in a specific state, choose **Start from a chosen state after changing policies**, and then choose the default start state in your new policy.
