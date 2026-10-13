---
layout: default
title: Index State Management
nav_order: 40
has_children: true
redirect_from:
  - /im-plugin/ism/
has_toc: false
---

# Index State Management

Index State Management (ISM) runs administrative operations on an index for you, triggered by the index's age, size, or document count. Use it for the periodic work that time-series data creates: rolling over an index once it reaches a size, reducing its replica count as it ages, force merging it during off-peak hours, taking a snapshot of it, and deleting it when it is no longer needed.

For example, a policy can move an index into a `read_only` state after 30 days, snapshot it after 60, delete it after 90, and send you a notification each time it changes state.

## Policies, states, actions, and transitions

A *policy* is a JSON document that describes how an index is managed. It is a state machine built from three parts:

- A *state* is a status that a managed index can be in, such as `hot`, `warm`, or `delete`. An index is in exactly one state at a time.
- An *action* is an operation that ISM runs when the index enters a state, such as `rollover`, `force_merge`, or `snapshot`. Actions run in the order in which you define them.
- A *transition* is a condition that moves the index from one state to the next, such as reaching a minimum age or document count.

A policy can define any number of states, any number of actions in each state, and a transition between any two states, including from a state to itself. For the full policy structure, see [Policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).

After a policy is attached to an index, ISM creates a job that runs every 5 minutes by default. Each run performs the actions of the current state, evaluates the transition conditions, and moves the index to its next state. To change the interval, see [Settings]({{site.url}}{{site.baseurl}}/im-plugin/ism/settings/). ISM does not run jobs while the cluster state is red.

## Attaching a policy to new indexes

Add an `ism_template` object to a policy so that ISM attaches the policy to each new index whose name matches one of the patterns. The following policy is attached to every index created with a name beginning with `index_name-`:

```json
PUT _plugins/_ism/policies/example_policy
{
  "policy": {
    "description": "Example policy.",
    "default_state": "hot",
    "states": [
      {
        "name": "hot",
        "actions": [],
        "transitions": []
      }
    ],
    "ism_template": {
      "index_patterns": ["index_name-*"],
      "priority": 100
    }
  }
}
```
{% include copy-curl.html %}

An index pattern cannot contain any of the following characters: `:`, `"`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`. When more than one template matches the name of a new index, ISM applies the template with the highest `priority`.

For a complete example, see [Sample policy with ISM template for auto rollover]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies-examples/#sample-policy-with-ism-template-for-auto-rollover).

An `ism_template` applies only to indexes created after it. To attach a policy to indexes that already exist, see [Managed indexes]({{site.url}}{{site.baseurl}}/im-plugin/ism/managedindexes/) or [Applying a policy]({{site.url}}{{site.baseurl}}/im-plugin/index-operations/#applying-a-policy).

The `opendistro.index_state_management.policy_id` index setting, which attached a policy through an index template, is deprecated. Use `ism_template` instead.
{: .note}

## In this section

| Topic | Description |
| :--- | :--- |
| [Policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/) | The structure of a policy, the operations that an action can perform, and complete policy examples. |
| [Managed indexes]({{site.url}}{{site.baseurl}}/im-plugin/ism/managedindexes/) | Change, remove, and retry the policy that manages an index. |
| [ISM API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/) | Create policies, attach and detach them, and explain the state of a managed index. |
| [ISM error prevention]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/index/) | Validate actions before they run and resolve the validation messages. |
| [Settings]({{site.url}}{{site.baseurl}}/im-plugin/ism/settings/) | Cluster settings that control the job interval, history, and validation. |

## Related documentation

- [Index maintenance]({{site.url}}{{site.baseurl}}/im-plugin/index-maintenance/)
- [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/)
- [Snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/index/)
- [Index management security]({{site.url}}{{site.baseurl}}/im-plugin/security/)
