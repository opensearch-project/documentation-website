---
layout: default
title: Delete Replication Rule API
parent: Replication APIs
nav_order: 60
---

# Delete Replication Rule API
Introduced 1.0
{: .label .label-purple }

The Delete Replication Rule API removes an existing auto-follow replication rule. When deleted, the rule will no longer trigger automatic replication for new indexes that match its pattern. However, existing replication relationships that were established by the rule will continue to operate until explicitly stopped.

<!-- spec_insert_start
api: replication.delete_replication_rule
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_replication/_autofollow
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: replication.delete_replication_rule
component: request_body_parameters
-->
## Request body fields

The request body is __required__. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `leader_alias` | String | The name of an index alias. |
| `name` | String | The name of the replication rule to delete. |

<!-- spec_insert_end -->

## Example request

The following example deletes a replication rule named "logs-rule":

```json
DELETE /_plugins/_replication/_autofollow?name=logs-rule
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response:

```json
{
  "acknowledged": true
}
```
