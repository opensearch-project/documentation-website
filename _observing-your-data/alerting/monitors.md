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

Proactively monitor your data in OpenSearch with alerting and anomaly detection. Set up alerts to receive notifications when your data exceeds certain thresholds. Anomaly detection uses machine learning to automatically detect any outliers in your streaming data. You can pair anomaly detection with alerting to ensure you're notified as soon as an anomaly is detected.

## Monitor types

The OpenSearch Dashboard Alerting plugin provides four monitor types:
1. **per query**: Runs a query and generates alert notifications based on the matching criteria.
1. **per bucket**: Runs a query that evaluates trigger criteria based on aggregated values in the dataset.
1. **per cluster metrics**: Runs API requests on the cluster to monitor its health.
1. **per document**: Runs a query (or multiple queries combined by a tag) that returns individual documents that match the alert notification trigger condition.

## Key terms

Term | Definition
:--- | :---
Monitor | A job that runs on a defined schedule and queries OpenSearch indexes. The results of these queries are then used as input for one or more *triggers*.
Trigger | Conditions that, if met, generate *alerts*.
Tag | A label that can be applied to multiple queries to combine them with the logical `OR` operation in a per document monitor. You cannot use tags with other monitor types.
Alert | An event associated with a trigger. When an alert is created, the trigger performs *actions*, which can include sending a notification.
Action | The information that you want the monitor to send out after being triggered. Actions have a *channel*, a message subject, and a message body.
Channel | A notification channel to use in an action. Supported channels are Amazon Chime, Slack, Amazon  Simple Notification Service (Amazon SNS), email, or custom webhook. See [notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/) for more information.
Finding | An entry for an individual document found by a per document monitor query that contains the document ID, index name, and timestamp. Findings are stored in the Findings index `.opensearch-alerting-finding*`.

#### Topics

- Creating monitors
- Creating triggers
- Adding actions
- Working with alerts
- Creating per document monitors
- Creating per cluster metrics monitors 

## Create notifications

Alerting integrates with Notifications, which is a unified system for OpenSearch notifications. Notifications let you configure which communication service you want to use and see relevant statistics and troubleshooting information. For comprehensive documentation, see [Notifications](https://opensearch.org/docs/latest/observing-your-data/notifications/index/) in the OpenSearch documentation.

Your domain must be running OpenSearch version 2.3 or later to use notifications.

1. In the **OpenSearch Plugins** menu, choose **Notifications**, then **Channel**, **Create channel**.
1. Enter a channel name.
1. Configure the channel. For **Channel type**, choose Slack, Amazon Chime, Amazon SNS, custom webhook, or [email](#email-as-a-destination).

For email, refer to the [Email as a destination](#email-as-a-destination) section. For all other types, specify the webhook URL. See the documentation for [Slack](https://api.slack.com/incoming-webhooks/), [Amazon Chime](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html/), and [Amazon SNS as a channel type]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/#amazon-sns-as-a-channel-type) to learn more about webhooks.

If you're using custom webhooks, you must specify more information: parameters and headers. For example, if your endpoint requires basic authentication, you may need to add a header with a key of `Authorization` and a value of `Basic <Base64-encoded-credential-string>`. You may also need to change `Content-Type` to whatever your webhook requires. Popular values are `application/json`, `application/xml`, and `text/plain`.

This information is stored in plain text in the OpenSearch cluster. The encoded credentials (which are neither encrypted nor hashed) may be visible to other OpenSearch users.

### Email as a notification channel

To send or receive an alert notification as an email, choose **Email** as the channel type. Next, add at least one sender and recipient. Creating email groups is recommended if you want to notify several people of an alert. To configure senders and recipients, choose **Create SMTP sender** or **Create SES sender** and **Create recipient group** in the Configurations panel.

#### Create email senders

Specify an email account from which the Alerting plugin can send notifications.

To configure a sender email:

1. Select **Email senders** in the Notifications menu and then choose **Create SMTP sender** or **Create SES sender**.
1. Enter the email address, host (for example, `smtp.gmail.com` for a Gmail account), and port.
1. Choose an encryption method, or use the default value of **None**. Most email providers require SSL or TLS, which require a username and password in OpenSearch keystore. Refer to [Authenticate sender account](#authenticate-sender-account) to learn more.
1. Choose **Create** to save the configuration and create the sender. You can create a sender before you add your credentials to the OpenSearch keystore. However, you must [authenticate each sender account](#authenticate-sender-account) before you use the channel to send your alert.

You can reuse senders across the different channels, but each channel only supports one sender.

#### Create email groups

Use email groups to create and manage reusable lists of email addresses. For example, one alert might email the DevOps team, whereas another might email the executive team and the engineering team.

To create a recipient group:

1. Select **Email recipient group** in the Notifications menu and then choose **Create email recipients**. Then configure the recipient group.
1. Enter a name for the email group.
1. For recipient emails, enter any number of email addresses.
1. Choose **Create**.

#### Authenticate sender account

If your email provider requires SSL or TLS, you must authenticate each sender account before you can send an email. Enter these credentials in the OpenSearch keystore using the command line interface (CLI). Run the following commands (in your OpenSearch directory) to enter your username and password. The `<sender_name>` is the name you entered for **Sender name** earlier.

```bash
./bin/opensearch-keystore add plugins.alerting.destination.email.<sender_name>.username
./bin/opensearch-keystore add plugins.alerting.destination.email.<sender_name>.password
```

Note: Keystore settings are node-specific. You must run these commands on each node.
{: .note}

To change or update your credentials (after you've added them to the keystore on every node), call the [reload secure settings API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-reload-secure/) to automatically update those credentials without restarting OpenSearch:

```json
POST _nodes/reload_secure_settings
{
  "secure_settings_password": "1234"
}
```

---


---

## Add actions

The final step in creating a monitor is to add one or more actions. Actions send notifications when trigger conditions are met. See [Notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/) to learn more about the supported communication channels.

If you don't want to receive notifications for alerts, you don't have to add actions to your triggers. Instead, you can periodically check OpenSearch Dashboards.
{: .tip }

1. Specify a name for the action.
1. Choose a [notification channel]({{site.url}}{{site.baseurl}}/notifications-plugin/index/).
1. Add a subject and body for the message.

   You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html/). You have access to `ctx.action.name`, the name of the current action, and all [trigger variables](#available-variables).

   If your notification channel is a custom webhook that expects a particular data format, you may need to include JSON (or XML) directly in the message body:

   ```json
   {% raw %}{ "text": "Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}" }{% endraw %}
   ```

   In this case, the message content must conform to the `Content-Type` header in the [custom webhook]({{site.url}}{{site.baseurl}}/notifications-plugin/index/).

1. If you're using a bucket-level monitor, you can choose whether the monitor should perform an action for each execution or for each alert.

1. (Optional) Use action throttling to limit the number of notifications you receive within a given span of time.

   For example, if a monitor checks a trigger condition every minute, you could receive one notification per minute. If you set action throttling to 60 minutes, you receive no more than one notification per hour, even if the trigger condition is met dozens of times in that hour.

1. Choose **Create**.

After an action sends a message, the content of that message has left the purview of the Security plugin. Securing access to the message (e.g. access to the Slack channel) is your responsibility.


#### Sample message

```mustache
{% raw %}Monitor {{ctx.monitor.name}} just entered an alert state. Please investigate the issue.
- Trigger: {{ctx.trigger.name}}
- Severity: {{ctx.trigger.severity}}
- Period start: {{ctx.periodStart}}
- Period end: {{ctx.periodEnd}}{% endraw %}
```

If you want to use the `ctx.results` variable in a message, use `{% raw %}{{ctx.results.0}}{% endraw %}` rather than `{% raw %}{{ctx.results[0]}}{% endraw %}`. This difference is due to how Mustache handles bracket notation.
{: .note }

### Questions about destinations

Q: What plugins do I need installed besides Alerting?

A: To continue using the notification action in the Alerting plugin, you need to install the backend plugins `notifications-core` and `notifications`. You can also install the Notifications Dashboards plugin to manage Notification channels using OpenSearch Dashboards.

Q: Can I still create destinations?
A: No, destinations have been deprecated and can no longer be created/edited.

Q: Will I need to move my destinations to the Notifications plugin?
A: No. To upgrade users, a background process will automatically move destinations to notification channels. These channels will have the same ID as the destinations, and monitor execution will choose the correct ID, so you don't have to make any changes to the monitor's definition. The migrated destinations will be deleted.

Q: What happens if any destinations fail to migrate?
A: If a destination failed to migrate, the monitor will continue using it until the monitor is migrated to a notification channel. You don't need to do anything in this case.

Q: Do I need to install the Notifications plugins if monitors can still use destinations?
A: Yes. The fallback on destination is to prevent failures in sending messages if migration fails; however, the Notification plugin is what actually sends the message. Not having the Notification plugin installed will lead to the action failing.


---

## Work with alerts

Alerts persist until you resolve the root cause and have the following states:

State | Description
:--- | :---
Active | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely.
Acknowledged | Someone has acknowledged the alert, but not fixed the root cause.
Completed | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to false.
Error | An error occurred while executing the trigger---usually the result of a bad trigger or destination.
Deleted | Someone deleted the monitor or trigger associated with this alert while the alert was ongoing.

---

## Create cluster metrics monitor

In addition to monitoring conditions for indexes, the Alerting plugin allows monitoring conditions for clusters. Alerts can be set by cluster metrics to watch for the following conditions:

- Cluster health status reaches yellow or red
- Cluster-level metrics, such as CPU usage and JVM memory usage, reach specified thresholds
- Node-level metrics, such as available disk space, JVM memory usage, and CPU usage, reach a specified threshold
- Total number of documents stored reaches a specified amount

To create a cluster metrics monitor:

1. In the **OpenSearch Plugins** menu, select **Alerting**.
2. Select the **Monitors** tab and then **Create monitor**.
3. Select **Per cluster metrics monitor**.
4. In the Query pane, choose a **Request type** from the dropdown.
5. (Optional) To filter the API response to use only certain path parameters, enter those parameters under **Path parameters**. Most APIs that can be used to monitor cluster status support path parameters, as described in their respective documentation (for example, comma-separated lists of index names). To see an example of the response, select **Preview query**.
6. In the Triggers pane, add conditions to trigger an alert. The trigger condition autopopulates a Painless ctx variable. For example, a cluster monitor watching for cluster stats uses the trigger condition `ctx.results[0].indices.count <= 0`, which triggers an alert based on the number of indexes returned by the query. For more specificity, add any additional Painless conditions supported by the API. To see an example of the condition response, select **Preview condition response**.
7. In the Actions pane, define how users are to be notified when a trigger condition is met.
8. Select **Create**. The new monitor appears in the **Monitors** list.

### Supported APIs

Trigger conditions use responses from the following cat API endpoints. Most APIs that can be used to monitor cluster status support path parameters, as described in their respective documentation (for example, comma-separated lists of index names). They do not support query parameters.

- [_cluster/health]({{site.url}}{{site.baseurl}}/api-reference/cluster-health/)
- [_cluster/stats]({{site.url}}{{site.baseurl}}/api-reference/cluster-stats/)
- [_cluster/settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings/)
- [_nodes/stats]({{site.url}}{{site.baseurl}}/opensearch/popular-api/#get-node-statistics/)
- [_cat/indices](https://opensearch.org/docs/latest/api-reference/cat/cat-indices/)
- [_cat/pending_tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-pending-tasks/)
- [_cat/recovery]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/)
- [_cat/shards]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-shards/)
- [_cat/snapshots]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-snapshots/)
- [_cat/tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-tasks/) 

### Restrict API fields

To hide fields from the API response that you do not want exposed for alerting, reconfigure the [supported_json_payloads.json](https://github.com/opensearch-project/alerting/blob/main/alerting/src/main/resources/org/opensearch/alerting/settings/supported_json_payloads.json/) file inside the Alerting plugin. The file functions as an allow list for the API fields you want to use in an alert. By default, all APIs and their parameters can be used for monitors and trigger conditions.

You can modify the file so that cluster metric monitors can only be created for APIs referenced. Only fields referenced in the supported files can create trigger conditions. The file `supported_json_payloads.json` allows for a cluster metrics monitor to be created for the `_cluster/stats` API, and triggers conditions for the `indices.shards.total` and `indices.shards.index.shards.min` fields.

```json
"/_cluster/stats": {
  "indices": [
    "shards.total",
    "shards.index.shards.min"
  ]
}
```

### Painless triggers

Painless scripts define triggers for cluster metrics monitors, similar to query or bucket-level monitors that are defined using the extraction query definition option. Painless scripts comprise at least one statement and any additional functions you want to run.

The cluster metrics monitor supports up to **ten** triggers.

In this example, a JSON object creates a trigger that sends an alert when the Cluster Health is yellow. `script` points the `source` to the painless script `ctx.results[0].status == \"yellow\`.

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

See [trigger variables](#trigger-variables) for more painless ctx options.

### Limitations

Currently, the cluster metrics monitor has the following limitations:

- You cannot create monitors for remote clusters.
- The OpenSearch cluster must be in a state where an index's conditions can be monitored and actions can be executed against the index.
- Removing resource permissions from a user will not prevent that user’s preexisting monitors for that resource from executing.
- Users with permissions to create monitors are not blocked from creating monitors for resources for which they do not have permissions; however, those monitors will not run.
