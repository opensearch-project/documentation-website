---
layout: default
title: Start Policy API
parent: Snapshot Management APIs
nav_order: 30
---

# Start Policy API
**Introduced 2.4**
{: .label .label-purple }

The Start Policy API enables a snapshot management policy that is currently disabled. Once enabled, the policy will begin creating and managing snapshots according to its configured schedule. This API is useful when you need to resume snapshot operations after temporarily disabling a policy or when activating a newly created policy that was initially disabled.

When you start a policy, the system records the enabled time and begins monitoring the schedule to determine when to create the next snapshot. If the policy includes deletion rules, these will also become active, potentially triggering the cleanup of old snapshots based on the configured conditions.

<!-- spec_insert_start
api: sm.start_policy
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_sm/policies/{policy_name}/_start
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: sm.start_policy
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `policy_name` | **Required** | String | The name of the snapshot management policy to start. |

<!-- spec_insert_end -->

## Example request

```bash
POST /_plugins/_sm/policies/daily-snapshots/_start
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true,
}
```

