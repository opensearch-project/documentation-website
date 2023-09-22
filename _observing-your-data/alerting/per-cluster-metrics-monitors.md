---
layout: default
title: Per cluster metrics monitors
nav_order: 15
parent: Monitors
grand_parent: Alerting
has_children: false
---

# Per cluster metrics monitors

Per cluster metrics monitors are a type of alert monitor that collects and analyzes metrics from a single cluster, providing insights into the cluster's performance and health. You can set alerts to monitor certain conditions, such as when:

- Cluster health reaches yellow or red status.
- Cluster-level metrics---for example, CPU usage and JVM memory usage---reach specified thresholds.
- Node-level metrics---for example, available disk space, JVM memory usage, and CPU usage---reach specified thresholds.
- Total number of documents stored reaches specified thresholds.

## Create a cluster metrics monitor

To create a cluster metrics monitor, follow these steps:

1. Select **Alerting** > **Monitors** > **Create monitor**.
2. Select the **Per cluster metrics monitor** option.
3. In the Query section, pick the **Request type** from the dropdown list.
4. (Optional) If you want to filter the API response to use only certain path parameters, enter those parameters under **Query parameters**. Most APIs that can be used to monitor cluster status support path parameters as described in their documentation (for example, comma-separated lists of index names).
5. In the [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/) section, indicate which conditions will trigger an alert. The trigger condition autopopulates a `painless ctx` variable. For example, a cluster monitor watching for Cluster Stats uses the trigger condition `ctx.results[0].indices.count <= 0`, which triggers an alert based on the number of indexes returned by the query. For more specificity, add any additional Painless conditions supported by the API. To see an example of the condition response, select **Preview condition response**.
6. In the Actions section, indicate how you want your users to be notified when a trigger condition is met.
7. Select **Create**. Your new monitor appears in the **Monitors** list.

The following example shows a configuration of a cluster metrics monitor.

<img src="{{site.url}}{{site.baseurl}}/images/cluster-metrics.png" alt="Cluster metrics monitor" width="700"/>

## Supported APIs

Trigger conditions use responses from the following API endpoints. Most APIs that can be used to monitor cluster status support path parameters (for example, comma-separated lists of index names). They do not support query parameters.

- [_cluster/health]({{site.url}}{{site.baseurl}}/api-reference/cluster-health/)
- [_cluster/stats]({{site.url}}{{site.baseurl}}/api-reference/cluster-stats/)
- [_cluster/settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings/)
- [_nodes/stats]({{site.url}}{{site.baseurl}}/opensearch/popular-api/#get-node-statistics)
- [_cat/indices]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-indices/)
- [_cat/pending_tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-pending-tasks/)
- [_cat/recovery]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/)
- [_cat/shards]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-shards/)
- [_cat/snapshots]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-snapshots/)
- [_cat/tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-tasks/)

## Restrict API fields

If you want to hide fields from the API response and not expose them for alerting, reconfigure the [supported_json_payloads.json](https://github.com/opensearch-project/alerting/blob/main/alerting/src/main/resources/org/opensearch/alerting/settings/supported_json_payloads.json) file inside the Alerting plugin. The file functions as an allow list for the API fields you want to use in an alert. By default, all APIs and their parameters can be used for monitors and trigger conditions.

However, you can modify the file so that cluster metric monitors can only be created for APIs referenced. Furthermore, only fields referenced in the supported files can create trigger conditions. This `supported_json_payloads.json` allows for a cluster metrics monitor to be created for the `_cluster/stats` API, and triggers conditions for the `indices.shards.total` and `indices.shards.index.shards.min` fields.

```json
"/_cluster/stats": {
  "indices": [
    "shards.total",
    "shards.index.shards.min"
  ]
}
```

## Painless triggers

Painless scripts define triggers for cluster metrics monitors, similar to per query or per bucket monitors, which are defined using the extraction query definition option. Painless scripts are composed of at least one statement and any additional functions you wish to run.

The cluster metrics monitor supports up to **ten** triggers.

In the following example, a JSON object creates a trigger that sends an alert when the cluster health is yellow. `script` points the `source` to the Painless script `ctx.results[0].status == \"yellow\`.

```json
{
  "name": "Cluster Health Monitor",
  "type": "monitor",
  "monitor_type": "query_level_monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "unit": "MINUTES",
      "interval": 1
    }
  },
  "inputs": [
    {
      "uri": {
        "api_type": "CLUSTER_HEALTH",
        "path": "_cluster/health/",
        "path_params": "",
        "url": "http://localhost:9200/_cluster/health/"
      }
    }
  ],
  "triggers": [
    {
      "query_level_trigger": {
        "id": "Tf_L_nwBti6R6Bm-18qC",
        "name": "Yellow status trigger",
        "severity": "1",
        "condition": {
          "script": {
            "source": "ctx.results[0].status == \"yellow\"",
            "lang": "painless"
          }
        },
        "actions": []
      }
    }
  ]
}
```

See [Trigger variables]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/#trigger-variables) for more `painless ctx` variable options.

### Limitations

Per cluster metrics monitors have the following limitations:

- You cannot create monitors for remote clusters.
- The OpenSearch cluster must be in a state where an index's conditions can be monitored and actions can be executed against the index.
- Removing resource permissions from a user will not prevent that user’s preexisting monitors for that resource from executing.
- Users with permissions to create monitors are not blocked from creating monitors for resources for which they do not have permissions; however, those monitors will not run.
