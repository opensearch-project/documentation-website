---
layout: default
title: Triggers
nav_order: 40
grand_parent: Alerting
parent: Monitors
---

# Triggers

How you create a trigger differs depending on the monitor method selected when the monitor was created. The monitor methods are **Visual editor**, **Extraction query editor**, and **Anomaly detector**. Learn more about each type in the following sections.

## Creating triggers

To create a trigger:

1. In the **Create monitor** window, select **Add trigger**.
2. Enter the trigger name, severity level, and trigger condition. Severity levels, which range from 1 (highest) to 5 (lowest) help manage alerts. For example, a trigger with a high severity level (for example, 1 or 2) may notify a specific individual, whereas a trigger with a low severity level (4 or 5) might notify a chat room. Trigger conditions include "IS ABOVE," "IS BELOW," and "IS EXACTLY."

Query-level monitors run your trigger's script once against the query's results, and bucket-level monitors run your trigger's script on each bucket. Create a trigger that best fits the monitor method. To run multiple scripts, you must create multiple triggers.
{: .note}

## Visual editor

For a query-level monitor's trigger condition, specify a threshold for the aggregation and time frame you chose when you created the monitor (for example, "IS BELOW 1,000" or "IS EXACTLY 10"). The line moves up and down as you increase or decrease the threshold. Once this line is crossed, the trigger evaluates to `true`.

For a bucket-level monitor, you must specify a threshold and value for the aggregation and time frame. You can use a maximum of five conditions to refine your trigger. Optionally, you can also use a keyword filter to filter for a specific field in your index.

For document-level monitors, use tags that represent multiple queries connected by the logical `OR` operator. To create a multiple-query trigger:

1. Select **Per document monitor**.
2. Select a data source. 
3. Enter the query name and field information. For example, set the query to search for the `region` field with either the operator "is" or "is not" and the value "us-west-2".
4. Select **Add tag** and enter a tag name.
5. Create the second query by selecting **Add another query** and add the same tag to it.

Now you can create the trigger condition and specify the tag name. This creates a combination trigger that checks two queries that both contain the same tag. The monitor checks both queries with a logical `OR` operation, and if either query's conditions are met, the alert notification is generated.

## Extraction query editor

For a query-level monitor, specify a Painless script that returns `true` or `false`. Painless is the default OpenSearch scripting language and has a syntax similar to Groovy.

Trigger condition scripts revolve around the `ctx.results[0]` variable, which corresponds to the extraction query response. For example, the script might reference `ctx.results[0].hits.total.value` or `ctx.results[0].hits.hits[i]._source.error_code`.

A return value of `true` means that the trigger condition has been met and the trigger should run its actions. Test the script using the **Run** button.

The **Info** link next to **Trigger condition** contains a useful summary of the variables and results available to your query.
{: .tip }

Bucket-level monitors require you to specify more information in your trigger condition. At a minimum, you must have the following fields:

- `buckets_path`: Maps variable names to metrics to use in your script.
- `parent_bucket_path`: The path to a multi-bucket aggregation. The path can include single-bucket aggregations, but the last aggregation must be multi-bucket. For example, if you have a pipeline such as `agg1>agg2>agg3`, `agg1` and `agg2` are single-bucket aggregations, but `agg3` must be a multi-bucket aggregation.
- `script`: The script that OpenSearch runs to evaluate whether to trigger any alerts.

The following is an example script:

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

After mapping the `count_var` variable to the `_count` metric, you can use `count_var` in your script and reference `_count` data. The `composite_agg` is a path to a multi-bucket aggregation.

## Anomaly detector

To use the anomaly detector method:

1. For **Trigger type**, choose **Anomaly detector grade and confidence**. 
2. Specify the **Anomaly grade condition** for the aggregation and time frame you chose when you created the monitor, for example, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly grade* is a number between 0 and 1 that indicates how anomalous a data point is.
3. Specify the **Anomaly confidence condition** for the aggregation and time frame you chose earlier, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly confidence* is an estimate of the probability that the reported anomaly grade matches the expected anomaly grade. The line moves up and down as you increase and decrease the threshold. Once this line is crossed, the trigger evaluates to `true`.

### Sample scripts


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

#### Trigger variables

Variable | Data type | Description
:--- | :--- | : ---
`ctx.trigger.id` | String | The trigger ID.
`ctx.trigger.name` | String | The trigger name.
`ctx.trigger.severity` | String | The trigger severity.
`ctx.trigger.condition`| Object | Contains the Painless script used when the monitor was created.
`ctx.trigger.condition.script.source` | String | The language used to define the script. Must be Painless.
`ctx.trigger.condition.script.lang` | String | The script used to define the trigger.
`ctx.trigger.actions`| Array | An array with one element that contains information about the action the monitor needs to trigger.

#### Other variables

Variable | Data type | Description
:--- | :--- : :---
`ctx.results` | Array | An array with one element (`ctx.results[0]`). Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.last_update_time` | Milliseconds | Unix epoch time of when the monitor was last updated.
`ctx.periodStart` | String | Unix timestamp for the beginning of the period during which the alert was triggered. For example, if a monitor runs every 10 minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | String | The end of the period during which the alert triggered.
`ctx.error` | String | The error message displayed if the trigger was unable to retrieve results or could not be evaluated, typically due to a compile error or null pointer exception. Null otherwise.
`ctx.alert` | Object | The current, active alert (if it exists). Includes `ctx.alert.id`, `ctx.alert.version`, and `ctx.alert.isAcknowledged`. Null if no alert is active. Only available with query-level monitors.
`ctx.dedupedAlerts` | Object | Alerts that have been triggered. OpenSearch keeps the existing alert to prevent the plugin from creating endless numbers of the same alert. Only available with bucket-level monitors.
`ctx.newAlerts` | Object | Newly created alerts. Only available with bucket-level monitors.
`ctx.completedAlerts` | Object | Alerts that are no longer ongoing. Only available with bucket-level monitors.
`bucket_keys` | String | Comma-separated list of the monitor's bucket key values. Available only for `ctx.dedupedAlerts`, `ctx.newAlerts`, and `ctx.completedAlerts`. Accessed through `ctx.dedupedAlerts[0].bucket_keys`.
`parent_bucket_path` | String | The parent bucket path of the bucket that triggered the alert. Accessed through `ctx.dedupedAlerts[0].parent_bucket_path`.
