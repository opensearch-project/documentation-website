---
layout: default
title: Monitors
nav_order: 1
parent: Alerting
has_children: false
redirect_from:
  - /monitoring-plugins/alerting/monitors/
canonical_url: https://docs.opensearch.org/latest/observing-your-data/alerting/monitors/
---

# Monitors

#### Table of contents
- TOC
{:toc}

---

## Monitor types

The OpenSearch Dashboard Alerting plugin provides four monitor types:
* **per query** – This monitor runs a query and generates alert notifications based on criteria that matches.
* **per bucket** – This monitor runs a query that evaluates trigger criteria based on aggregated values in the dataset.
* **per cluster metrics** – This monitor runs API requests on the cluster to monitor its health.
* **per document** – This monitor runs a query (or multiple queries combined by a tag) that returns individual documents that match the alert notification trigger condition.

## Key terms

Term | Definition
:--- | :---
Monitor | A job that runs on a defined schedule and queries OpenSearch indexes. The results of these queries are then used as input for one or more *triggers*.
Trigger | Conditions that, if met, generate *alerts*.
Tag | A label that can be applied to multiple queries to combine them with the logical OR operation in a per document monitor. You cannot use tags with other monitor types.
Alert | An event associated with a trigger. When an alert is created, the trigger performs *actions*, which can include sending a notification.
Action | The information that you want the monitor to send out after being triggered. Actions have a *destination*, a message subject, and a message body.
Destination | A reusable location for an action. Supported locations are Amazon Chime, Email, Slack, or custom webhook.
Finding | An entry for an individual document found by a per document monitor query that contains the document ID, index name, and timestamp. Findings are stored in the Findings index: `.opensearch-alerting-finding*`.
Channel | A notification channel to use in an action. See [notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index) for more information.

## Per document monitors

Introduced 2.0
{: .label .label-purple }

The per query and per bucket monitors can only run a single query with one trigger condition. Per document monitors allow you to combine multiple query trigger conditions by adding a tag to the queries. Then you can add the tag as a single trigger condition instead of specifying a single query. The Alerting plugin processes the trigger conditions from all queries as a logical OR operation, so if any of the query conditions are met, it triggers an alert. Next, the Alerting plugin tells the Notifications plugin to send the notification to a channel.

The Alerting plugin also creates a list of document findings that contains metadata about which document matches each query. Security analytics can use the document findings data to keep track of and analyze the query data separately from the alert processes.


The Alerting API provides a document-level monitor that programmatically accomplishes the same function as the per document monitor in the OpenSearch Dashboards. To learn more, see [Document-level monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/api/#document-level-monitors).
{: .note}

### Document findings

When a per document monitor executes a query that matches a document in an index, a finding is created. OpenSearch provides a Findings index: `.opensearch-alerting-finding*` that contains findings data for all per document monitor queries. You can search the findings index with the Alerting API search operation. To learn more, see [Search for monitor findings]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/api/#search-for-monitor-findings).

The following metadata is provided for each document finding entry:

* **Document** – The document ID and index name. For example: `Re5akdirhj3fl | test-logs-index`.
* **Query** – The query name that matched the document.
* **Time found** – The timestamp that indicates when the document was found during the runtime.

It is possible to configure an alert notification for each finding, however we don't recommend this unless rules are well defined to prevent a huge volume of findings in a high ingestion cluster.

---

## Create destinations

1. Choose **Alerting**, **Destinations**, **Add destination**.
1. Specify a name for the destination so that you can identify it later.
1. For **Type**, choose Slack, Amazon Chime, custom webhook, or [email](#email-as-a-destination).

For Email, refer to the [Email as a destination](#email-as-a-destination) section below. For all other types, specify the webhook URL. See the documentation for [Slack](https://api.slack.com/incoming-webhooks) and [Amazon Chime](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html) to learn more about webhooks.

If you're using custom webhooks, you must specify more information: parameters and headers. For example, if your endpoint requires basic authentication, you might need to add a header with a key of `Authorization` and a value of `Basic <Base64-encoded-credential-string>`. You might also need to change `Content-Type` to whatever your webhook requires. Popular values are `application/json`, `application/xml`, and `text/plain`.

This information is stored in plain text in the OpenSearch cluster. We will improve this design in the future, but for now, the encoded credentials (which are neither encrypted nor hashed) might be visible to other OpenSearch users.


### Email as a destination

To send or receive an alert notification as an email, choose **Email** as the destination type. Next, add at least one sender and recipient. We recommend adding email groups if you want to notify more than a few people of an alert. You can configure senders and recipients using **Manage senders** and **Manage email groups**.

#### Manage senders

You need to specify an email account from which the Alerting plugin can send notifications.

To configure a sender email, do the following:

1. After you choose **Email** as the destination type, choose **Manage senders**.
1. Choose **Add sender**, **New sender** and enter a unique name.
1. Enter the email address, SMTP host (e.g. `smtp.gmail.com` for a Gmail account), and the port.
1. Choose an encryption method, or use the default value of **None**. However, most email providers require SSL or TLS, which require a username and password in OpenSearch keystore. Refer to [Authenticate sender account](#authenticate-sender-account) to learn more.
1. Choose **Save** to save the configuration and create the sender. You can create a sender even before you add your credentials to the OpenSearch keystore. However, you must [authenticate each sender account](#authenticate-sender-account) before you use the destination to send your alert.

You can reuse senders across many different destinations, but each destination only supports one sender.


#### Manage email groups or recipients

Use email groups to create and manage reusable lists of email addresses. For example, one alert might email the DevOps team, whereas another might email the executive team and the engineering team.

You can enter individual email addresses or an email group in the **Recipients** field.

1. After you choose **Email** as the destination type, choose **Manage email groups**. Then choose **Add email group**, **New email group**.
1. Enter a unique name.
1. For recipient emails, enter any number of email addresses.
1. Choose **Save**.


#### Authenticate sender account

If your email provider requires SSL or TLS, you must authenticate each sender account before you can send an email. Enter these credentials in the OpenSearch keystore using the CLI. Run the following commands (in your OpenSearch directory) to enter your username and password. The `<sender_name>` is the name you entered for **Sender** earlier.

```bash
./bin/opensearch-keystore add plugins.alerting.destination.email.<sender_name>.username
./bin/opensearch-keystore add plugins.alerting.destination.email.<sender_name>.password
```

Note: Keystore settings are node-specific. You must run these commands on each node.
{: .note}

To change or update your credentials (after you've added them to the keystore on every node), call the reload API to automatically update those credentials without restarting OpenSearch:

```json
POST _nodes/reload_secure_settings
{
  "secure_settings_password": "1234"
}
```


---

## Create a monitor

1. Choose **Alerting**, **Monitors**, **Create monitor**.
1. Specify a name for the monitor.
1. Choose either **Per query monitor**, **Per bucket monitor**, **Per cluster metrics monitor**, or **Per document monitor**.

Per query monitors run your specified query and then check whether the query's results trigger any alerts. Per bucket monitors let you select which fields to create buckets and categorize your results into those buckets. The Alerting plugin runs each bucket's unique results against a script you define later, so you have finer control over which results should trigger alerts. Each of those buckets can trigger an alert, but query-level monitors can only trigger one alert at a time.

1. Decide how you want to define your query and triggers. You can use any of the following methods: visual editor, query editor, or anomaly detector.

   - Visual definition works well for monitors that you can define as "some value is above or below some threshold for some amount of time."

   - Query definition gives you flexibility in terms of what you query for (using [OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index)) and how you evaluate the results of that query (Painless scripting).

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

    To define a monitor visually, choose **Visual editor**. Then choose a source index, a timeframe, an aggregation (for example, `count()` or `average()`), a data filter if you want to monitor a subset of your source index, and a group-by field if you want to include an aggregation field in your query. At least one group-by field is required if you're defining a bucket-level monitor. Visual definition works well for most monitors.

    If you use the Security plugin, you can only choose indexes that you have permission to access. For details, see [Alerting security]({{site.url}}{{site.baseurl}}/security/).

    To use a query, choose **Extraction query editor**, add your query (using [OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index)), and test it using the **Run** button.

    The monitor makes this query to OpenSearch as often as the schedule dictates; check the **Query Performance** section and make sure you're comfortable with the performance implications.

    To use an anomaly detector, choose **Anomaly detector** and select your **Detector**.

    The anomaly detection option is for pairing with the anomaly detection plugin. See [Anomaly Detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/).
    For anomaly detector, choose an appropriate schedule for the monitor based on the detector interval. Otherwise, the alerting monitor might miss reading the results.

    For example, assume you set the monitor interval and the detector interval as 5 minutes, and you start the detector at 12:00. If an anomaly is detected at 12:05, it might be available at 12:06 because of the delay between writing the anomaly and it being available for queries. The monitor reads the anomaly results between 12:00 and 12:05, so it does not get the anomaly results available at 12:06.

    To avoid this issue, make sure the alerting monitor is at least twice the detector interval.
    When you create a monitor using OpenSearch Dashboards, the anomaly detector plugin generates a default monitor schedule that's twice the detector interval.

    Whenever you update a detector’s interval, make sure to update the associated monitor interval as well, as the anomaly detection plugin does not do this automatically.

    **Note**: Anomaly detection is available only if you are defining a per query monitor.
    {: .note}

1. Choose how frequently to run your monitor. You can run it either by time intervals (minutes, hours, or days) or on a schedule. If you run it on a daily, weekly or monthly schedule or according to a custom [custom cron expression]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/), then you need to also provide the time zone.

1. Add a trigger to your monitor.

---
## Create triggers

Steps to create a trigger differ depending on whether you chose **Visual editor**, **Extraction query editor**, or **Anomaly detector** when you created the monitor.

You begin by specifying a name and severity level for the trigger. Severity levels help you manage alerts. A trigger with a high severity level (e.g. 1) might page a specific individual, whereas a trigger with a low severity level might message a chat room.

Remember that query-level monitors run your trigger's script just once against the query's results, but bucket-level monitors execute your trigger's script on each bucket, so you should create a trigger that best fits the monitor you chose. If you want to execute multiple scripts, you must create multiple triggers.

### Visual editor

For a query-level monitor's **Trigger condition**, specify a threshold for the aggregation and timeframe you chose earlier, such as "is below 1,000" or "is exactly 10."

The line moves up and down as you increase and decrease the threshold. Once this line is crossed, the trigger evaluates to true.

Bucket-level monitors also require you to specify a threshold and value for your aggregation and timeframe, but you can use a maximum of five conditions to better refine your trigger. Optionally, you can also use a keyword filter to filter for a specific field in your index.

Document-level monitors provide the added option to use tags that represent multiple queries connected by the logical OR operator.

To create a multiple query combination trigger, do the following steps:

1. Create a per document monitor with more than one query.
2. Create the first query with a field, an operator, and a value. For example, set the query to search for the `region` field with either operator: "is" or "is not", and set the value "us-west-2".
3. Select **Add Tag** and give the tag a name.
3. Create the second query and add the same tag to it.
4. Now you can create the trigger condition and specify the tag name. This creates a combination trigger that checks two queries that both contain the same tag. The monitor checks both queries with a logical OR operation and if either query's conditions are met, then it will generate the alert notification.

### Extraction query

If you're using a query-level monitor, specify a Painless script that returns true or false. Painless is the default OpenSearch scripting language and has a syntax similar to Groovy.

Trigger condition scripts revolve around the `ctx.results[0]` variable, which corresponds to the extraction query response. For example, your script might reference `ctx.results[0].hits.total.value` or `ctx.results[0].hits.hits[i]._source.error_code`.

A return value of true means the trigger condition has been met, and the trigger should execute its actions. Test your script using the **Run** button.

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

Specify the **Anomaly grade condition** for the aggregation and timeframe you chose earlier, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly grade* is a number between 0 and 1 that indicates the level of severity of how anomalous a data point is.

Specify the **Anomaly confidence condition** for the aggregation and timeframe you chose earlier, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly confidence* is an estimate of the probability that the reported anomaly grade matches the expected anomaly grade.

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

Below are some variables you can include in your message using Mustache templates to see more information about your monitors.

### Available variables

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
`ctx.trigger.condition.script.source` | String | The language used to define the script. Must be painless.
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
`ctx.trigger.actions.subject_template.lang` | String | The scripting language used to define the subject. Must be mustache.

#### Other variables

Variable | Data type | Description
:--- | :--- : :---
`ctx.results` | Array | An array with one element (i.e. `ctx.results[0]`). Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.last_update_time` | Milliseconds | Unix epoch time of when the monitor was last updated.
`ctx.periodStart` | String | Unix timestamp for the beginning of the period during which the alert triggered. For example, if a monitor runs every ten minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | String | The end of the period during which the alert triggered.
`ctx.error` | String | The error message if the trigger was unable to retrieve results or unable to evaluate the trigger, typically due to a compile error or null pointer exception. Null otherwise.
`ctx.alert` | Object | The current, active alert (if it exists). Includes `ctx.alert.id`, `ctx.alert.version`, and `ctx.alert.isAcknowledged`. Null if no alert is active. Only available with query-level monitors.
`ctx.dedupedAlerts` | Object | Alerts that have already been triggered. OpenSearch keeps the existing alert to prevent the plugin from creating endless amounts of the same alerts. Only available with bucket-level monitors.
`ctx.newAlerts` | Object | Newly created alerts. Only available with bucket-level monitors.
`ctx.completedAlerts` | Object | Alerts that are no longer ongoing. Only available with bucket-level monitors.
`bucket_keys` | String | Comma-separated list of the monitor's bucket key values. Available only for `ctx.dedupedAlerts`, `ctx.newAlerts`, and `ctx.completedAlerts`. Accessed through `ctx.dedupedAlerts[0].bucket_keys`.
`parent_bucket_path` | String | The parent bucket path of the bucket that triggered the alert. Accessed through `ctx.dedupedAlerts[0].parent_bucket_path`.



---

## Add actions

The final step in creating a monitor is to add one or more actions. Actions send notifications when trigger conditions are met. See the [Notifications plugin]({{site.url}}{{site.baseurl}}/notifications-plugin/index) to see what communication channels are supported.

If you don't want to receive notifications for alerts, you don't have to add actions to your triggers. Instead, you can periodically check OpenSearch Dashboards.
{: .tip }

1. Specify a name for the action.
1. Choose a [notification channel]({{site.url}}{{site.baseurl}}/notifications-plugin/index).
1. Add a subject and body for the message.

   You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). You have access to `ctx.action.name`, the name of the current action, as well as all [trigger variables](#available-variables).

   If your destination is a custom webhook that expects a particular data format, you might need to include JSON (or even XML) directly in the message body:

   ```json
   {% raw %}{ "text": "Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}" }{% endraw %}
   ```

   In this case, the message content must conform to the `Content-Type` header in the [custom webhook]({{site.url}}{{site.baseurl}}/notifications-plugin/index).
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

A: To continue using the notification action in the Alerting plugin, you need to install the backend plugins `notifications-core` and `notifications`. You can also install the Notifications Dashboards plugin to manage Notification channels via OpenSearch Dashboards.

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
Error | An error occurred while executing the trigger---usually the result of a a bad trigger or destination.
Deleted | Someone deleted the monitor or trigger associated with this alert while the alert was ongoing.

---

## Create cluster metrics monitor

In addition to monitoring conditions for indexes, the Alerting plugin allows monitoring conditions for clusters. Alerts can be set by cluster metrics to watch for the following conditions:

- The health of your cluster reaches a status of yellow or red
- Cluster-level metrics, such as CPU usage and JVM memory usage, reach specified thresholds
- Node-level metrics, such as available disk space, JVM memory usage, and CPU usage, reach a specified threshold
- The total number of documents stores reaches a specified amount

To create a cluster metrics monitor:

1. Select **Alerting** > **Monitors** > **Create monitor**.
2. Select the **Per cluster metrics monitor** option.
3. In the Query section, pick the **Request type** from the dropdown.
4. (Optional) If you want to filter the API response to use only certain path parameters, enter those parameters under **Query parameters**. Most APIs that can be used to monitor cluster status support path parameters as described in their documentation (e.g., comma-separated lists of index names).
5. In the Triggers section, indicate what conditions trigger an alert. The trigger condition autopopulates a painless ctx variable. For example, a cluster monitor watching for Cluster Stats uses the trigger condition `ctx.results[0].indices.count <= 0`, which triggers an alert based on the number of indexes returned by the query. For more specificity, add any additional painless conditions supported by the API. To see an example of the condition response, select **Preview condition response**.
6. In the Actions section, indicate how you want your users to be notified when a trigger condition is met.
7. Select **Create**. Your new monitor appears in the **Monitors** list.

### Supported APIs

Trigger conditions use responses from the following cat API endpoints. Most APIs that can be used to monitor cluster status support path parameters as described in their documentation (e.g., comma-separated lists of index names). However, they do not support query parameters.

1. [_cluster/health]({{site.url}}{{site.baseurl}}/api-reference/cluster-health/)
2. [_cluster/stats]({{site.url}}{{site.baseurl}}/api-reference/cluster-stats/)
3. [_cluster/settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings/)
4. [_nodes/stats]({{site.url}}{{site.baseurl}}/opensearch/popular-api/#get-node-statistics)
5. [_cat/pending_tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-pending-tasks/)
6. [_cat/recovery]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/)
7. [_cat/snapshots]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-snapshots/)
8. [_cat/tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-tasks/)

### Restrict API fields

If you want to hide fields from the API response that you do not want exposed for alerting, reconfigure the [supported_json_payloads.json](https://github.com/opensearch-project/alerting/blob/main/alerting/src/main/resources/org/opensearch/alerting/settings/supported_json_payloads.json) file inside the Alerting plugin. The file functions as an allow list for the API fields you want to use in an alert. By default, all APIs and their parameters can be used for monitors and trigger conditions.

However, you can modify the file so that cluster metric monitors can only be created for APIs referenced. Furthermore, only fields referenced in the supported files can create trigger conditions. This `supported_json_payloads.json` allows for a cluster metrics monitor to be created for the `_cluster/stats` API, and triggers conditions for the `indices.shards.total` and `indices.shards.index.shards.min` fields.

```json
"/_cluster/stats": {
  "indices": [
    "shards.total",
    "shards.index.shards.min"
  ]
}
```

### Painless triggers

Painless scripts define triggers for cluster metrics monitors, similar to query or bucket-level monitors that are defined using the extraction query definition option. Painless scripts are comprised of at least one statement and any additional functions you wish to execute.

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
- Users with permissions to create monitors are not blocked from creating monitors for resources for which they do not have permissions; however, those monitors will not execute.
