---
layout: default
title: Tasks API
has_children: yes
nav_order: 85
redirect_from:
 - /opensearch/rest-api/tasks/
 - /api-reference/tasks/
canonical_url: https://docs.opensearch.org/latest/api-reference/tasks/tasks/
---

# Tasks
**Introduced 1.0**
{: .label .label-purple }

A _task_ is any operation that you run in a cluster. For example, searching your data collection of books for a title or author name is a task. When you run OpenSearch, a task is automatically created to monitor your cluster's health and performance. For more information about all of the tasks currently executing in your cluster, you can use the `tasks` API operation.

## Attaching headers to tasks

To associate requests with tasks for better tracking, you can provide an `X-Opaque-Id:<ID_number>` header as part of the HTTPS request reader of your `curl` command. The API will attach the specified header in the returned result.

The following request returns tasks with an `X-Opaque-Id` of `111111`:

```bash
curl -i -H "X-Opaque-Id: 111111" "https://localhost:9200/_tasks" -u 'admin:<custom-admin-password>' --insecure
```
{% include copy.html %}

The `_tasks` operation returns the following result:

```json
HTTP/1.1 200 OK
X-Opaque-Id: 111111
content-type: application/json; charset=UTF-8
content-length: 768

{
  "nodes": {
    "Mgqdm0r9SEGClWxp_RbnaQ": {
      "name": "opensearch-node1",
      "transport_address": "172.18.0.4:9300",
      "host": "172.18.0.4",
      "ip": "172.18.0.4:9300",
      "roles": [
        "data",
        "ingest",
        "master",
        "remote_cluster_client"
      ],
      "tasks": {
        "Mgqdm0r9SEGClWxp_RbnaQ:30072": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 30072,
          "type": "direct",
          "action": "cluster:monitor/tasks/lists[n]",
          "start_time_in_millis": 1613166701725,
          "running_time_in_nanos": 245400,
          "cancellable": false,
          "parent_task_id": "Mgqdm0r9SEGClWxp_RbnaQ:30071",
          "headers": {
            "X-Opaque-Id": "111111"
          }
        },
        "Mgqdm0r9SEGClWxp_RbnaQ:30071": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 30071,
          "type": "transport",
          "action": "cluster:monitor/tasks/lists",
          "start_time_in_millis": 1613166701725,
          "running_time_in_nanos": 658200,
          "cancellable": false,
          "headers": {
            "X-Opaque-Id": "111111"
          }
        }
      }
    }
  }
}
```
This operation supports the same parameters as the `tasks` operation. The following example shows you how to associate `X-Opaque-Id` with specific tasks:

```bash
curl -i -H "X-Opaque-Id: 123456" "https://localhost:9200/_tasks?nodes=opensearch-node1" -u 'admin:<custom-admin-password>' --insecure
```
{% include copy.html %}
