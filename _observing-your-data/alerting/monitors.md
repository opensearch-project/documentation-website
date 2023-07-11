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

## Create a monitor

1. Choose **Alerting** and then **Create monitor**.
1. Specify a name for the monitor.
1. Choose either **Per query monitor**, **Per bucket monitor**, **Per cluster metrics monitor**, or **Per document monitor**.

OpenSearch supports the following monitor types:

- **Per query monitor** runs a specified query and then checks whether the query's results trigger any alerts. Per query monitors can only trigger one alert at a time. 
- **Per bucket monitor** creates buckets based on selected fields and then categorizes the results into those buckets. The Alerting plugin runs each bucket's unique results against a script you define later, so you have finer control over which results should trigger alerts. Each bucket can trigger an alert.

The maximum number of monitors you can create is 1,000. You can change the default maximum number of alerts for your cluster by calling the [cluster settings API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/) `plugins.alerting.monitor.max_monitors`.

1. Define the query and triggers. You can use any of the following methods: visual editor, extraction query editor, or anomaly detector.

   - Visual definition works well for monitors that you can define as "some value is above or below some threshold for some amount of time."

   - Query definition gives you flexibility in terms of what you query for (using [OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index/)) and how you evaluate the results of that query (Painless scripting).

     This example averages the `cpu_usage` field:

     ```json
     {
       "size": 0,
       "query": {
         "match_all": {}
       },
       "aggs": {
         "avg_cpu": {
           "avg": {
             "field": "cpu_usage"
           }
         }
       }
     }
     ```

     You can even filter query results using `{% raw %}{{period_start}}{% endraw %}` and `{% raw %}{{period_end}}{% endraw %}`:

     ```json
     {
       "size": 0,
       "query": {
         "bool": {
           "filter": [{
             "range": {
               "timestamp": {
                 "from": "{% raw %}{{period_end}}{% endraw %}||-1h",
                 "to": "{% raw %}{{period_end}}{% endraw %}",
                 "include_lower": true,
                 "include_upper": true,
                 "format": "epoch_millis",
                 "boost": 1
               }
             }
           }],
           "adjust_pure_negative": true,
           "boost": 1
         }
       },
       "aggregations": {}
     }
     ```

    "Start" and "end" refer to the interval at which the monitor runs. See [Available variables](#available-variables).

    To define a monitor visually, choose **Visual editor**. Then choose a source index, a time frame, an aggregation (for example, `count()` or `average()`), a data filter if you want to monitor a subset of your source index, and a group-by field if you want to include an aggregation field in your query. At least one group-by field is required if you're defining a bucket-level monitor. Visual definition works well for most monitors.

    If you use the Security plugin, you can only choose indexes that you have permission to access. For details, see [Alerting security]({{site.url}}{{site.baseurl}}/security/).

    To use a query, choose **Extraction query editor**, add your query (using [OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index/)), and test it using the **Run** button.

    The monitor makes this query to OpenSearch as often as the schedule dictates; check the **Query Performance** section and make sure you're comfortable with the performance implications.

    To use an anomaly detector, choose **Anomaly detector** and select your **Detector**.

    The anomaly detection option is for pairing with the anomaly detection plugin. See [Anomaly Detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/). For anomaly detector, choose an appropriate schedule for the monitor based on the detector interval. Otherwise, the alerting monitor might miss reading the results.

    For example, assume you set the monitor interval and the detector interval as 5 minutes and you start the detector at 12:00. If an anomaly is detected at 12:05, it might be available at 12:06 because of the delay between writing the anomaly and it being available for queries. The monitor reads the anomaly results between 12:00 and 12:05, so it does not get the anomaly results available at 12:06.

    To avoid this issue, make sure the alerting monitor is at least twice the detector interval.
    When you create a monitor using OpenSearch Dashboards, the anomaly detector plugin generates a default monitor schedule that's twice the detector interval.

    Whenever you update a detector’s interval, make sure to also update the associated monitor interval, as the anomaly detection plugin does not do this automatically.

   Anomaly detection is available only if you are defining a per query monitor.
    {: .note}

1. Choose how frequently to run your monitor. You can run it either by time intervals (minutes, hours, or days) or on a schedule. If you run it on a daily, weekly, or monthly schedule or according to a [custom cron expression]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/), then you need to also provide the time zone.

1. Add a trigger to your monitor.

---
## Create triggers

Steps to create a trigger differ depending on whether you chose **Visual editor**, **Extraction query editor**, or **Anomaly detector** when you created the monitor.

You begin by specifying a name and severity level for the trigger. Severity levels help you manage alerts. A trigger with a high severity level (for example, 1) might page a specific individual, whereas a trigger with a low severity level might message a chat room.

Remember that query-level monitors run your trigger's script once against the query's results, but bucket-level monitors run your trigger's script on each bucket, so you should create a trigger that best fits the monitor you chose. If you want to run multiple scripts, you must create multiple triggers.

### Visual editor

For a query-level monitor's **Trigger condition**, specify a threshold for the aggregation and time frame you chose earlier, such as "is below 1,000" or "is exactly 10."

The line moves up and down as you increase and decrease the threshold. Once this line is crossed, the trigger evaluates to true.

Bucket-level monitors also require you to specify a threshold and value for your aggregation and time frame. You can use a maximum of five conditions to better refine your trigger. Optionally, you can also use a keyword filter to filter for a specific field in your index.

Document-level monitors provide the added option to use tags that represent multiple queries connected by the logical `OR` operator.

To create a multiple query combination trigger:

1. Select **Per document monitor**.
1. Select a data source. 
2. Enter the query name and field information. For example, set the query to search for the `region` field with either operator "is" or "is not" and value "us-west-2".
3. Select **Add tag** and enter a tag name.
3. Create the second query by selecting **Add another query** and add the same tag to it.
4. Now you can create the trigger condition and specify the tag name. This creates a combination trigger that checks two queries that both contain the same tag. The monitor checks both queries with a logical `OR` operation, and if either query's conditions are met, it will generate the alert notification.

### Extraction query

If you're using a query-level monitor, specify a Painless script that returns true or false. Painless is the default OpenSearch scripting language and has a syntax similar to Groovy.

Trigger condition scripts revolve around the `ctx.results[0]` variable, which corresponds to the extraction query response. For example, your script might reference `ctx.results[0].hits.total.value` or `ctx.results[0].hits.hits[i]._source.error_code`.

A return value of true means the trigger condition has been met, and the trigger should run its actions. Test your script using the **Run** button.

The **Info** link next to **Trigger condition** contains a useful summary of the variables and results available to your query.
{: .tip }

Bucket-level monitors require you to specify more information in your trigger condition. At a minimum, you must have the following fields:

- `buckets_path`, which maps variable names to metrics to use in your script.
- `parent_bucket_path`, which is a path to a multi-bucket aggregation. The path can include single-bucket aggregations, but the last aggregation must be multi-bucket. For example, if you have a pipeline such as `agg1>agg2>agg3`, `agg1` and `agg2` are single-bucket aggregations, but `agg3` must be a multi-bucket aggregation.
- `script`, which is the script that OpenSearch runs to evaluate whether to trigger any alerts.

For example, you might have a script that looks like the following:

```json
{
  "buckets_path": {
    "count_var": "_count"
  },
  "parent_bucket_path": "composite_agg",
  "script": {
    "source": "params.count_var > 5"
  }
}
```

After mapping the `count_var` variable to the `_count` metric, you can use `count_var` in your script and reference `_count` data. Finally, `composite_agg` is a path to a multi-bucket aggregation.

### Anomaly detector

For **Trigger type**, choose **Anomaly detector grade and confidence**.

Specify the **Anomaly grade condition** for the aggregation and time frame you chose earlier, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly grade* is a number between 0 and 1 that indicates the level of severity of how anomalous a data point is.

Specify the **Anomaly confidence condition** for the aggregation and time frame you chose earlier, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly confidence* is an estimate of the probability that the reported anomaly grade matches the expected anomaly grade.

The line moves up and down as you increase and decrease the threshold. Once this line is crossed, the trigger evaluates to true.


#### Sample scripts

{::comment}
These scripts are Painless, not Groovy, but calling them Groovy in Jekyll gets us syntax highlighting in the generated HTML.
{:/comment}

```groovy
// Evaluates to true if the query returned any documents
ctx.results[0].hits.total.value > 0
```

```groovy
// Returns true if the avg_cpu aggregation exceeds 90
if (ctx.results[0].aggregations.avg_cpu.value > 90) {
  return true;
}
```

```groovy
// Performs some crude custom scoring and returns true if that score exceeds a certain value
int score = 0;
for (int i = 0; i < ctx.results[0].hits.hits.length; i++) {
  // Weighs 500 errors 10 times as heavily as 503 errors
  if (ctx.results[0].hits.hits[i]._source.http_status_code == "500") {
    score += 10;
  } else if (ctx.results[0].hits.hits[i]._source.http_status_code == "503") {
    score += 1;
  }
}
if (score > 99) {
  return true;
} else {
  return false;
}
```

### Available variables

Following are variables you can include in your message using Mustache templates to see more information about your monitors.

#### Monitor variables

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

#### Trigger variables

Variable | Data type | Description
:--- | :--- | : ---
`ctx.trigger.id` | String | The trigger's ID.
`ctx.trigger.name` | String | The trigger's name.
`ctx.trigger.severity` | String | The trigger's severity.
`ctx.trigger.condition`| Object | Contains the Painless script used when creating the monitor.
`ctx.trigger.condition.script.source` | String | The language used to define the script. Must be Painless.
`ctx.trigger.condition.script.lang` | String | The script used to define the trigger.
`ctx.trigger.actions`| Array | An array with one element that contains information about the action the monitor needs to trigger.

#### Action variables

Variable | Data type | Description
:--- | :--- | : ---
`ctx.trigger.actions.id` | String | The action's ID.
`ctx.trigger.actions.name` | String | The action's name.
`ctx.trigger.actions.message_template.source` | String | The message to send in the alert.
`ctx.trigger.actions.message_template.lang` | String | The scripting language used to define the message. Must be Mustache.
`ctx.trigger.actions.throttle_enabled` | Boolean | Whether throttling is enabled for this trigger. See [adding actions](#add-actions) for more information about throttling.
`ctx.trigger.actions.subject_template.source` | String | The message's subject in the alert.
`ctx.trigger.actions.subject_template.lang` | String | The scripting language used to define the subject. Must be Mustache.

#### Other variables

Variable | Data type | Description
:--- | :--- : :---
`ctx.results` | Array | An array with one element (`ctx.results[0]`). Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.last_update_time` | Milliseconds | Unix epoch time of when the monitor was last updated.
`ctx.periodStart` | String | Unix timestamp for the beginning of the period during which the alert triggered. For example, if a monitor runs every 10 minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | String | The end of the period during which the alert triggered.
`ctx.error` | String | The error message if the trigger was unable to retrieve results or unable to evaluate the trigger, typically due to a compile error or null pointer exception. Null otherwise.
`ctx.alert` | Object | The current, active alert (if it exists). Includes `ctx.alert.id`, `ctx.alert.version`, and `ctx.alert.isAcknowledged`. Null if no alert is active. Only available with query-level monitors.
`ctx.dedupedAlerts` | Object | Alerts that have been triggered. OpenSearch keeps the existing alert to prevent the plugin from creating endless amounts of the same alerts. Only available with bucket-level monitors.
`ctx.newAlerts` | Object | Newly created alerts. Only available with bucket-level monitors.
`ctx.completedAlerts` | Object | Alerts that are no longer ongoing. Only available with bucket-level monitors.
`bucket_keys` | String | Comma-separated list of the monitor's bucket key values. Available only for `ctx.dedupedAlerts`, `ctx.newAlerts`, and `ctx.completedAlerts`. Accessed through `ctx.dedupedAlerts[0].bucket_keys`.
`parent_bucket_path` | String | The parent bucket path of the bucket that triggered the alert. Accessed through `ctx.dedupedAlerts[0].parent_bucket_path`.

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
