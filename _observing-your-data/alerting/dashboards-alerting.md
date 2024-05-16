---
layout: default
title: Alerting dashboards and visualizations 
parent: Alerting
nav_order: 50
---

# Alerting dashboards and visualizations
Introduced 2.9
{: .label .label-purple }

OpenSearch Dashboards provides a consolidated view for creating, managing, and taking action on alerts through the **Dashboards** application. This feature allows you to identify and resolve issues quickly by visualizing alerts and their associated data on dashboards. 

## Getting started 

Before working with alerting dashboards and visualizations, ensure that you have:

- Installed OpenSearch and OpenSearch Dashboards version 2.9 or later. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).
- Installed the Alerting, Anomaly Detection, and Notifications Dashboards plugins. See [Managing OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/).
- Started your local environment. The [OpenSearch Playground](https://playground.opensearch.org/app/home) is read-only, so you should use your local environment to perform the steps in the following tutorials.

## Configuring admin settings

Access to alerting dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards permissions. You can only access, create, or manage alerts on resources for which you have appropriate permissions.

The alerting dashboards and visualizations setting is enabled by default and can be configured from **Dashboards Management** > **Advanced Settings** > **Visualization**. 

To disable the setting at the cluster level, set `vis_augmenter.pluginAugmentationEnabled: false` in your `opensearch-dashboards.yml` file. If the setting is disabled, the feature does not appear in the settings pane. 

## General requirements for alerting visualizations

Alerting visualizations are displayed as time-series charts that provide a visual representation of alerts, their status, last updated time, and the reason for the alert.

Consider the following general requirements for setting up or creating alerting visualizations: 

- The visualization must use the [Vizlib Line Chart](https://documentation.insightsoftware.com/vizlibdocumentation/Content/Library/Line_Chart/Vizlib_Line_Chart_-_Overview.htm) extension.
- The visualization must contain at least a Y-axis metric aggregation.
- The visualization must not have non-Y-axis metric aggregation types.
- The visualization must use the date histogram aggregation type for the X-axis bucket.
- The visualization must have an X-axis on the bottom.
- The visualization must define one X-axis aggregation bucket.
- The visualization must have a valid time-based X-axis.
- You can display up to 10 metric on the chart, with each series shown as a line.

## Creating alerting monitors from within visualizations

By default, when you begin to create an alert monitor workflow using OpenSearch Dashboards, you are presented with a menu-driven interface. This interface provides a range of options that are displayed in full screen, in pop-ups, in pull-downs, or in dropdowns. These options are used to define the metrics that can be monitored, set thresholds, customize triggers that automate workflows, and generate actions when conditions are met. 

You can only create [per query and per bucket monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/) from within visualizations. Follow these steps:

1. Save your dashboard. If you are unfamiliar with saving dashboards, see [Saving dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/#saving-dashboards).
2. Select **Alerting** from the **Options** dropdown menu.

<insert-visual-representation-of-these-steps>

## Associating monitors with visualizations

You can associate certain monitor types with a visualization using **Dashboards** instead of the plugin page, This association links the monitor to automatically display alerts on the related visualization chart. 

Continuing with the alerting visualization created in the preceding section, associate a monitor with an altering visualization by following these steps: 

1. From the visualization panel, choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/} icon.
2. Select **Associated monitors**.
3. From the **Select monitor to associate** dropdown menu, select the monitor. Only eligible monitors are listed in the dropdown menu. 
4. View the monitor's basic information. To view comprehensive details, select **View monitor page** to open the Alerting plugin page.
5. Select **Associate monitor**. An existing monitor is associated with the visualization.

<insert-visual-representation-of-these-steps>

##  Configuring alerts through OpenSearch Dashboards

To configure alerts, follow these steps:

1. Open the alerting dashboard. Alerts are indicated on the visualization with a {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/triangle-icon.png" class="inline-icon" alt="triangle icon"/>{:/} icon. 
2. Hover over the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/triangle-icon.png" class="inline-icon" alt="triangle icon"/>{:/} icon to view high-level data, such as number of alerts. To investigate alert details, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/triangle-icon.png" class="inline-icon" alt="triangle icon"/>{:/} icon to open a flyout with more detailed monitor information. Alternatively, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/} icon in the visualization panel and choose **View events**.
3. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/} icon, then **Alerting** > **Associated monitors**.
4. Choose an alerting monitor from the list. Information such as history, alerts, and associated visualizations is shown within the visualization panel.
5. Unlink or edit a monitor. 
   1. Unlink a monitor from the visualization by selecting the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/link-icon.png" class="inline-icon" alt="link icon"/>{:/} icon under **Actions**. This only unlinks the monitor from the visualization; it does not delete the monitor.
   2. Edit the monitor's metrics by selecting the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/edit-icon.png" class="inline-icon" alt="edit icon"/>{:/} icon.

<insert-visual-representation-of-these-steps>

## Building alerting quieries

An alerting query consists of the monitor, triggers, and actions: 

- The monitor determines the frequency at which the query is executed. 
- Triggers define the specific conditions that, when met, cause an alert to be raised. 
- Actions specify the notifications that are sent when an alert is triggered. 

The monitor runs the query, triggers evaluate the results for the defined conditions, and actions initiate the specified notifications when those conditions are satisfied. This structure enables you to establish flexible alerting rules that continuously monitor your OpenSearch data and promptly notify you of significant events.

### Alerting query structure

Here is an example of the alerting query structure:

```json
{
  "name": "Query Name",
  "description": "Query Description",
  "schedule": {
    "interval": {
      "period": 10,
      "unit": "MINUTES"
    }
  },
  "trigger": {
    "condition": {
      "script": {
        "source": "
          // Trigger condition logic
        "
      }
    }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["index-name"],
        "body": {
          // Search query
        }
      }
    }
  },
  "actions": [
    {
      "name": "Action Name",
      "type": "action-type",
      "action-type": {
        // Action configuration
      }
    }
  ]
}
```
{% include copy-curl.html %}

In this example:

- The `monitor` runs every 10 minutes (`"period": 10, "unit": "MINUTES"`).
- The `trigger` object specifies the conditions that, when met, raise an alert. The condition is defined using a script, which can access the search query results through the `ctx.payload` object.
- The `input` object contains the search query that will be executed by the monitor. The query is defined using [OpenSearch Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) and can include aggregations, filters, and other query components.
- The `actions` array specifies the notifications that are sent when the trigger condition is met. Each action has a type (Slack, email, webhook) and a corresponding configuration object. 

#### Query examples

The following example queries show how you can use the alerting query structure to monitor various metrics and conditions in your OpenSearch data. By adjusting the trigger conditions, input queries, and actions, you can create tailored alerting rules to suit your specific monitoring needs.

**High CPU usage alert**
```json
{
  "name": "High CPU Usage Alert",
  "description": "Alerts when the average CPU usage exceeds 80% in the last hour",
  "schedule": {
    "interval": {
      "period": 1,
      "unit": "HOURS"
    }
  },
  "trigger": {
    "condition": {
      "script": {
        "source": "
          double avgCpuUsage = ctx.payload.aggregations.avg_cpu_usage.value;
          return avgCpuUsage > 80;
        "
      }
    }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["system-metrics"],
        "body": {
          "size": 0,
          "aggs": {
            "avg_cpu_usage": {
              "avg": {
                "field": "cpu_usage"
              }
            }
          }
        }
      }
    }
  },
  "actions": [
    {
      "name": "Notify on Slack",
      "type": "slack",
      "slack": {
        "message": "High CPU usage detected: {{ctx.payload.aggregations.avg_cpu_usage.value}}%"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Low disk space alert**
```json
{
  "name": "Low Disk Space Alert",
  "description": "Alerts when the available disk space falls below 20%",
  "schedule": {
    "interval": {
      "period": 30,
      "unit": "MINUTES"
    }
  },
  "trigger": {
    "condition": {
      "script": {
        "source": "
          double diskUsagePercentage = ctx.payload.aggregations.disk_usage_percentage.value;
          return diskUsagePercentage > 80;
        "
      }
    }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["system-metrics"],
        "body": {
          "size": 0,
          "aggs": {
            "disk_usage_percentage": {
              "script": {
                "source": "
                  double totalDiskSpace = doc['disk_total'].value;
                  double usedDiskSpace = doc['disk_used'].value;
                  return (usedDiskSpace / totalDiskSpace) * 100;
                "
              }
            }
          }
        }
      }
    }
  },
  "actions": [
    {
      "name": "Notify on Email",
      "type": "email",
      "email": {
        "to": ["ops@example.com"],
        "subject": "Low Disk Space Alert",
        "message": "Available disk space is below 20%: {{ctx.payload.aggregations.disk_usage_percentage.value}}%"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Viewing alerting events

To view alerting events, follow these steps:

1. Open your local instance of OpenSearch Dashboards. This is typically `http://localhost:5601/app/home#/`.
2. Navigate to **Alerting** from the main menu. You should see a list of all the alerting monitors you have configured. Select the monitor for which you want to view alerts.
3. In the monitor details view, you'll see several tabs. Select the **Alerts** tab.  
4. Explore events. The **Alerts** tab displays a list of all the alert instances that have been triggered for this monitor. Each alert shows details such as start and end time, status (Active, Acknowledged, Resolved), reason, and severity.
5. Filter and search events based on specific criteria. For example, you can filter alerts by status using the filter dropdown at the top of the alerts table. 
6. To view more details about a specific alter instance, select the alert in the table. This opens a flyout panel with additional information such as duration, context, history, and actions taken. 
7. Acknowledge or resolve an alert if it is in an active state.

<insert-visual-representation-of-these-steps>

You can also access alerting events from the main OpenSearch Dashboards interface. Follow these steps:

1. Open a dashboard or visualization that has an associated alerting monitor.
2. If there are active alerts for the associated monitor, then an alerting indicator (triangle icon) is shown on the visualization.
3. Hover over the alert indicator to see a summary of the active alerts.
4. Select the alert indicator to open the alert details flyout, which provides the same information as the **Alerts** tab in the Alerting plugin.

Here's an example an alerting events dashboard.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/alerting-dashboard.png" alt="Example alerting visualization">

## Next steps

See the following resources:

- [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/)
- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/)
- [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/)
- [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/)
- [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/)
- [Overlaying anomalies and alerts on OpenSearch Dashboards visualizations](https://opensearch.org/blog/alert-anomaly-visual/)
