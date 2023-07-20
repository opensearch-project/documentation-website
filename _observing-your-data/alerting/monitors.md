---
layout: default
title: Monitors
nav_order: 1
parent: Alerting
has_children: true
redirect_from:
  - /monitoring-plugins/alerting/monitors/
---

# Monitors

Proactively monitor your data in OpenSearch with alerting and anomaly detection. Set up alerts to receive notifications when your data exceeds certain thresholds. Anomaly detection uses machine learning (ML) to automatically detect any outliers in your streaming data. You can pair anomaly detection with alerting to ensure that you're notified as soon as an anomaly is detected.

See [Creating monitors](#creating-monitors), [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/), [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/), and [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) to learn more about the use of these alerting features in OpenSearch. 

The Alerting plugin provides four monitor types:

1. **per query**: Runs a query and generates alert notifications based on the matching criteria.
1. **per bucket**: Runs a query that evaluates trigger criteria based on aggregated values in the dataset.
1. **per cluster metrics**: Runs API requests on the cluster to monitor its health.
1. **per document**: Runs a query (or multiple queries combined by a tag) that returns individual documents that match the alert notification trigger condition.

![Monitor types in OpenSearch]({{site.url}}{{site.baseurl}}/images/monitors.png)

## Creating monitors

To create a monitor:

1. In the **OpenSearch Plugins** main menu, choose **Alerting**.
1. Choose **Create monitor**.
1. Enter the **Monitor details**, including monitor type, method, and schedule.  
1. Select a data source from the dropdown list.
1. Define the metrics in the Query section.
1. Add a [trigger]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/).
1. Select **Create**.

The maximum number of monitors you can create is 1,000. You can change the default maximum number of alerts for your cluster by updating the `plugins.alerting.monitor.max_monitors` setting using the [cluster settings API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/).
{: .note} 

## Monitor variables

The following table lists the variables you can use to customize your monitors.

Variable | Data type | Description
:--- | :--- | :---
`ctx.monitor` | Object | Includes `ctx.monitor.name`, `ctx.monitor.type`, `ctx.monitor.enabled`, `ctx.monitor.enabled_time`, `ctx.monitor.schedule`, `ctx.monitor.inputs`, `triggers` and `ctx.monitor.last_update_time`.
`ctx.monitor.user` | Object | Includes information about the user who created the monitor. Includes `ctx.monitor.user.backend_roles` and `ctx.monitor.user.roles`, which are arrays that contain the backend roles and roles assigned to the user. See [alerting security]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/) for more information.
`ctx.monitor.enabled` | Boolean | Whether the monitor is enabled.
`ctx.monitor.enabled_time` | Milliseconds | Unix epoch time of when the monitor was last enabled.
`ctx.monitor.schedule` | Object | Contains a schedule of how often or when the monitor should run.
`ctx.monitor.schedule.period.interval` | Integer | The interval at which the monitor runs.
`ctx.monitor.schedule.period.unit` | String | The interval's unit of time.
`ctx.monitor.inputs` | Array | An array that contains the indexes and definition used to create the monitor.
`ctx.monitor.inputs.search.indices` | Array | An array that contains the indexes the monitor observes.
`ctx.monitor.inputs.search.query` | N/A | The definition used to define the monitor.

## Creating per document monitors
Introduced 2.0
{: .label .label-purple }

Per document monitors allow you to define up to 10 queries that compare a selected field with a desired value. You can define supported field data types using the following operators:

- `is` 
- `is not`
- `is greater than`
- `is greater than equal`
- `is less than`
- `is less than equal`

You can query each trigger using up to 10 tags, adding the tag as a single trigger condition instead of specifying a single query. The Alerting plugin processes the trigger conditions from all queries as a logical `OR` operation, so if any of the query conditions are met, it triggers an alert. The Alerting plugin then tells the Notifications plugin to send the alert notification to a channel.

The Alerting plugin also creates a list of document findings that contain metadata about which document matches each query. Security Analytics can use the document findings data to keep track of and analyze the query data separately from the alert processes.

The Alerting API provides a _document-level monitor_ that programmatically accomplishes the same function as the _per document monitor_ in OpenSearch Dashboards. See [Document-level monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/api/#document-level-monitors) to learn more.
{: .note}

### Searching document findings

When a per document monitor runs a query that matches a document in an index, a finding is created. OpenSearch provides a findings index, `.opensearch-alerting-finding*`, that contains findings data for all per document monitor queries. You can search the findings index with the Alerting API search operation. See [Search the findings index]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/api/#search-the-findings-index) for more information.

The following metadata is provided for each document findings entry:

* **Document** – The document ID and index name. For example: `Re5akdirhj3fl | test-logs-index`.
* **Query** – The query name that matched the document.
* **Time found** – The timestamp that indicates when the document was found during the runtime.

To prevent a large volume of findings in a high-ingestion cluster, configuring alert notifications for each finding is not recommended unless rules are well defined.
{: .important}

## Creating cluster metrics monitors

In addition to monitoring conditions for indexes, the Alerting plugin allows monitoring conditions for clusters. Alerts can be set by cluster metrics to watch for the following conditions:

- The cluster health status is yellow or red.
- Cluster-level metrics, such as CPU usage and JVM memory usage, reach a specified threshold.
- Node-level metrics, such as available disk space, JVM memory usage, and CPU usage, reach a specified threshold.
- The total number of documents stores reaches a specified threshold.

To create a cluster metrics monitor:

1. In the **OpenSearch Plugins** main menu, select **Alerting**. 
1. Select **Monitors**, then **Create monitor**.
1. Select **Per cluster metrics monitor**.
1. In the Query section, select **Request type** from the dropdown.
1. To filter the API response to use only certain path parameters, enter those parameters in the **Query parameters** field. Most APIs that can be used to monitor cluster status support path parameters, as described in their respective documentation (for example, comma-separated lists of index names).
1. In the Triggers section, define the conditions that will trigger an alert. The trigger condition auto-populates a Painless `ctx` variable. For example, a cluster monitor watching for cluster stats uses the trigger condition `ctx.results[0].indices.count <= 0`, which triggers an alert based on the number of indexes returned by the query. For more specificity, add any additional Painless conditions supported by the API. To preview the condition response, select **Preview condition response**.
1. In the Actions section, indicate how users are to be notified when a trigger condition is met.
1. Select **Create**. The new monitor is listed under **Monitors**.

### Supported APIs

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

### Restricting API fields

To hide fields from being exposed in the API response, reconfigure the [supported_json_payloads.json](https://github.com/opensearch-project/alerting/blob/main/alerting/src/main/resources/org/opensearch/alerting/settings/supported_json_payloads.json) file inside the Alerting plugin. The file functions as an allow list for the API fields you want to use in an alert. By default, all APIs and their parameters can be used for monitors and trigger conditions.

You can modify the file so that cluster metric monitors can only be created for referenced APIs. Only fields referenced in the supported files can create trigger conditions. The `supported_json_payloads.json` file allows for a cluster metrics monitor to be created for the `_cluster/stats` API and triggers conditions for the `indices.shards.total` and `indices.shards.index.shards.min` fields.

#### Example

```json
"/_cluster/stats": {
  "indices": [
    "shards.total",
    "shards.index.shards.min"
  ]
}
```

### Painless triggers

Painless scripts define triggers for cluster metrics monitors, similar to query- or bucket-level monitors that are defined using the extraction query definition option. Painless scripts comprise at least one statement and any additional functions you want to run. The cluster metrics monitor supports up to **10** triggers.

In the following example, a JSON object defines a trigger that sends an alert when the cluster health is yellow. `script` points the `source` to the Painless script `ctx.results[0].status == \"yellow\`.

#### Example

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

### Limitations

The cluster metrics monitor has the following limitations:

- Monitors cannot be created for remote clusters.
- The OpenSearch cluster must be in a state where an index's conditions can be monitored and actions can be run against the index.
- Removing resource permissions from a user does not prevent that user’s preexisting monitors for that resource from running.
- Users with permissions to create monitors are not blocked from creating monitors for resources for which they do not have permissions. While the monitors will run, they will not be able to run the API calls, and a permissions alert will be generated, for example, `no permissions for [cluster:monitor/health]`.   

## Next steps

- Learn about [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/).
- Learn about [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/).
- Learn about [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/).
