---
layout: default
title: Stop Policy API
parent: Snapshot Management APIs
nav_order: 40
---

# Stop Policy API
**Introduced 2.4**
{: .label .label-purple }

The Stop Policy API disables an active snapshot management policy. When stopped, the policy will no longer create new snapshots or perform deletion operations, regardless of its configured schedule. This API is useful when you need to temporarily suspend snapshot operations for maintenance, troubleshooting, or resource management.

Stopping a policy does not affect existing snapshots or delete any configuration. The policy can be restarted later using the Start Policy API, at which point it will resume operations according to its schedule.

<!-- spec_insert_start
api: sm.stop_policy
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_sm/policies/{policy_name}/_start
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: sm.stop_policy
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
POST /_plugins/_sm/policies/daily-snapshots/_stop
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```



