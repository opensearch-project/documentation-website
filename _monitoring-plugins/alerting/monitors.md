---
layout: default
title: Monitors
nav_order: 1
parent: Alerting
has_children: false
canonical_url: https://docs.opensearch.org/latest/observing-your-data/alerting/monitors/
---

# Monitors

#### Table of contents
- TOC
{:toc}


---

## Key terms

Term | Definition
:--- | :---
Monitor | A job that runs on a defined schedule and queries OpenSearch. The results of these queries are then used as input for one or more *triggers*.
Trigger | Conditions that, if met, generate *alerts*.
Alert | An event associated with a trigger. When an alert is created, the trigger performs *actions*, which can include sending a notification.
Action | The information that you want the monitor to send out after being triggered. Actions have a *destination*, a message subject, and a message body.
Destination | A reusable location for an action, such as Amazon Chime, Slack, or a webhook URL.


---

## Create destinations

1. Choose **Alerting**, **Destinations**, **Add destination**.
1. Specify a name for the destination so that you can identify it later.
1. For **Type**, choose Slack, Amazon Chime, custom webhook, or [email](#email-as-a-destination).

For Email type, refer to [Email as a destination](#email-as-a-destination) section below. For all other types, specify the webhook URL. For more information about webhooks, see the documentation for [Slack](https://api.slack.com/incoming-webhooks) and [Amazon Chime](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html).

For custom webhooks, you must specify more information: parameters and headers. For example, if your endpoint requires basic authentication, you might need to add a header with a key of `Authorization` and a value of `Basic <Base64-encoded-credential-string>`. You might also need to change `Content-Type` to whatever your webhook requires. Popular values are `application/json`, `application/xml`, and `text/plain`.

This information is stored in plain text in the OpenSearch cluster. We will improve this design in the future, but for now, the encoded credentials (which are neither encrypted nor hashed) might be visible to other OpenSearch users.


### Email as a destination

To send or receive an alert notification as an email, choose **Email** as the destination type. Next, add at least one sender and recipient. We recommend adding email groups if you want to notify more than a few people of an alert. You can configure senders and recipients using **Manage senders** and **Manage email groups**.


#### Manage senders

Senders are email accounts from which the alerting plugin sends notifications.

To configure a sender email, do the following:

1. After you choose **Email** as the destination type, choose **Manage senders**.
1. Choose **Add sender**, **New sender** and enter a unique name.
1. Enter the email address, SMTP host (e.g. `smtp.gmail.com` for a Gmail account), and the port.
1. Choose an encryption method, or use the default value of **None**. However, most email providers require SSL or TLS, which requires a username and password in OpenSearch keystore. Refer to [Authenticate sender account](#authenticate-sender-account) to learn more.
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

**Note**: Keystore settings are node-specific. You must run these commands on each node.
{: .note}

To change or update your credentials (after you've added them to the keystore on every node), call the reload API to automatically update those credentials without restarting OpenSearch:

```json
POST _nodes/reload_secure_settings
{
  "secure_settings_password": "1234"
}
```


---

## Create monitors

1. Choose **Alerting**, **Monitors**, **Create monitor**.
1. Specify a name for the monitor.

The anomaly detection option is for pairing with the anomaly detection plugin. See [Anomaly Detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/).
For anomaly detector, choose an appropriate schedule for the monitor based on the detector interval. Otherwise, the alerting monitor might miss reading the results.

For example, assume you set the monitor interval and the detector interval as 5 minutes, and you start the detector at 12:00. If an anomaly is detected at 12:05, it might be available at 12:06 because of the delay between writing the anomaly and it being available for queries. The monitor reads the anomaly results between 12:00 and 12:05, so it does not get the anomaly results available at 12:06.

To avoid this issue, make sure the alerting monitor is at least twice the detector interval.
When you create a monitor using OpenSearch Dashboards, the anomaly detector plugin generates a default monitor schedule that's twice the detector interval.

Whenever you update a detector’s interval, make sure to update the associated monitor interval as well, as the anomaly detection plugin does not do this automatically.

1. Choose one or more indices. You can also use `*` as a wildcard to specify an index pattern.

   If you use the security plugin, you can only choose indices that you have permission to access. For details, see [Alerting security]({{site.url}}{{site.baseurl}}/security-plugin/).

1. Define the monitor in one of three ways: visually, using a query, or using an anomaly detector.

   - Visual definition works well for monitors that you can define as "some value is above or below some threshold for some amount of time."

   - Query definition gives you flexibility in terms of what you query for (using [the OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text)) and how you evaluate the results of that query (Painless scripting).

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


1. To define a monitor visually, choose **Define using visual graph**. Then choose an aggregation (for example, `count()` or `average()`), a set of documents, and a timeframe. Visual definition works well for most monitors.

   To use a query, choose **Define using extraction query**, add your query (using [the OpenSearch query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/)), and test it using the **Run** button.

   The monitor makes this query to OpenSearch as often as the schedule dictates; check the **Query Performance** section and make sure you're comfortable with the performance implications.

   To use an anomaly detector, choose **Define using Anomaly detector** and select your **Detector**.
1. Choose a frequency and timezone for your monitor. Note that you can only pick a timezone if you choose Daily, Weekly, Monthly, or [custom cron expression]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/) for frequency.
1. Choose **Create**.


---

## Create triggers

The next step in creating a monitor is to create a trigger. These steps differ depending on whether you chose **Define using visual graph** or **Define using extraction query** or **Define using Anomaly detector** when you created the monitor.

Either way, you begin by specifying a name and severity level for the trigger. Severity levels help you manage alerts. A trigger with a high severity level (e.g. 1) might page a specific individual, whereas a trigger with a low severity level might message a chat room.


### Visual graph

For **Trigger condition**, specify a threshold for the aggregation and timeframe you chose earlier, such as "is below 1,000" or "is exactly 10."

The line moves up and down as you increase and decrease the threshold. Once this line is crossed, the trigger evaluates to true.


### Extraction query

For **Trigger condition**, specify a Painless script that returns true or false. Painless is the default OpenSearch scripting language and has a syntax similar to Groovy.

Trigger condition scripts revolve around the `ctx.results[0]` variable, which corresponds to the extraction query response. For example, your script might reference `ctx.results[0].hits.total.value` or `ctx.results[0].hits.hits[i]._source.error_code`.

A return value of true means the trigger condition has been met, and the trigger should execute its actions. Test your script using the **Run** button.

The **Info** link next to **Trigger condition** contains a useful summary of the variables and results available to your query.
{: .tip }


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

Variable | Data Type | Description
:--- | :--- | :---
`ctx.monitor` | JSON | Includes `ctx.monitor.name`, `ctx.monitor.type`, `ctx.monitor.enabled`, `ctx.monitor.enabled_time`, `ctx.monitor.schedule`, `ctx.monitor.inputs`, `triggers` and `ctx.monitor.last_update_time`.
`ctx.monitor.user` | JSON | Includes information about the user who created the monitor. Includes `ctx.monitor.user.backend_roles` and `ctx.monitor.user.roles`, which are arrays that contain the backend roles and roles assigned to the user. See [alerting security]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/) for more information.
`ctx.monitor.enabled` | Boolean | Whether the monitor is enabled.
`ctx.monitor.enabled_time` | Milliseconds | Unix epoch time of when the monitor was last enabled.
`ctx.monitor.schedule` | JSON | Contains a schedule of how often or when the monitor should run.
`ctx.monitor.schedule.period.interval` | Integer | The interval at which the monitor runs.
`ctx.monitor.schedule.period.unit` | String | The interval's unit of time.
`ctx.monitor.inputs` | Array | An array that contains the indices and definition used to create the monitor.
`ctx.monitor.inputs.search.indices` | Array | An array that contains the indices the monitor observes.
`ctx.monitor.inputs.search.query` | N/A | The definition used to define the monitor.

#### Trigger variables

Variable | Data Type | Description
:--- | :--- | : ---
`ctx.trigger.id` | String | The trigger's ID.
`ctx.trigger.name` | String | The trigger's name.
`ctx.trigger.severity` | String | The trigger's severity.
`ctx.trigger.condition`| JSON | Contains the Painless script used when creating the monitor.
`ctx.trigger.condition.script.source` | String | The language used to define the script. Must be painless.
`ctx.trigger.condition.script.lang` | String | The script used to define the trigger.
`ctx.trigger.actions`| Array | An array with one element that contains information about the action the monitor needs to trigger.

#### Action variables

Variable | Data Type | Description
:--- | :--- | : ---
`ctx.trigger.actions.id` | String | The action's ID.
`ctx.trigger.actions.name` | String | The action's name.
`ctx.trigger.actions.destination_id`| String | The alert destination's ID.
`ctx.trigger.actions.message_template.source` | String | The message to send in the alert.
`ctx.trigger.actions.message_template.lang` | String | The scripting language used to define the message. Must be Mustache.
`ctx.trigger.actions.throttle_enabled` | Boolean | Whether throttling is enabled for this trigger. See [adding actions](#add-actions) for more information about throttling.
`ctx.trigger.actions.subject_template.source` | String | The message's subject in the alert.
`ctx.trigger.actions.subject_template.lang` | String | The scripting language used to define the subject. Must be mustache.

#### Other variables

Variable | Data Type | Description
:--- | :--- : :---
`ctx.results` | Array | An array with one element (i.e. `ctx.results[0]`). Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.last_update_time` | Milliseconds | Unix epoch time of when the monitor was last updated.
`ctx.periodStart` | String | Unix timestamp for the beginning of the period during which the alert triggered. For example, if a monitor runs every ten minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | String | The end of the period during which the alert triggered.
`ctx.error` | String | The error message if the trigger was unable to retrieve results or unable to evaluate the trigger, typically due to a compile error or null pointer exception. Null otherwise.
`ctx.alert` | JSON | The current, active alert (if it exists). Includes `ctx.alert.id`, `ctx.alert.version`, and `ctx.alert.isAcknowledged`. Null if no alert is active.


---

## Add actions

The final step in creating a monitor is to add one or more actions. Actions send notifications when trigger conditions are met and support [Slack](https://slack.com/), [Amazon Chime](https://aws.amazon.com/chime/), and webhooks.

If you don't want to receive notifications for alerts, you don't have to add actions to your triggers. Instead, you can periodically check OpenSearch Dashboards.
{: .tip }

1. Specify a name for the action.
1. Choose a destination.
1. Add a subject and body for the message.

   You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). You have access to `ctx.action.name`, the name of the current action, as well as all [trigger variables](#available-variables).

   If your destination is a custom webhook that expects a particular data format, you might need to include JSON (or even XML) directly in the message body:

   ```json
   {% raw %}{ "text": "Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}" }{% endraw %}
   ```

   In this case, the message content must conform to the `Content-Type` header in the [custom webhook](#create-destinations).

1. (Optional) Use action throttling to limit the number of notifications you receive within a given span of time.

   For example, if a monitor checks a trigger condition every minute, you could receive one notification per minute. If you set action throttling to 60 minutes, you receive no more than one notification per hour, even if the trigger condition is met dozens of times in that hour.

1. Choose **Create**.

After an action sends a message, the content of that message has left the purview of the security plugin. Securing access to the message (e.g. access to the Slack channel) is your responsibility.


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
