---
layout: default
title: Creating correlation rules
parent: Setting up Security Analytics
nav_order: 16
---

# Creating correlation rules

The correlation engine is an experimental feature released in OpenSearch 2.7. Therefore, we do not recommend enabling the feature in a production environment at this time. For updates on the progress of correlation engine, see [Security Analytics Correlation Engine](https://github.com/opensearch-project/security-analytics/issues/369) at GitHub. To share ideas and provide feedback, join the [Security Analytics forum](https://forum.opensearch.org/c/plugins/security-analytics/73).
{: .warning }

Correlation rules allow you to define threat scenarios involving multiple systems in an infrastructure by relating potential events of interest in the logs of individual systems and making connections between their findings. Once the rule contains at least two different log sources and the preferred fields and field values that define an intended threat secenario, the correlation engine can query the indexes specified in the correlation rule and draw any correlations found between the findings.


## Configuring rules

Follow the steps in this section to create a correlation rule.

1. Begin by selecting **Security Analytics** in the Dashboards home page menu. Then select **Correlation rules** from the Security Analytics menu on the left side of the screen. The **Correlation rules** page is displayed.
   <img src="{{site.url}}{{site.baseurl}}/images/Security/sec-analytics/create-corr-rule.png" alt="The correlation rules page" width="85%">
1. Select **Create correlation rule**. The **Create correlation rule** window opens.
1. In the **Correlation rule details** field, enter a name for the rule.
1. In the **Correlation queries** field, specify a data source and select the index field and field values to be used for the query.
   A minimum of two queries are required for each correlation rule. Having at least two data sources is the basis for making connections between different systems in an infrastructure and identifying correlations. You can also include more than two queries to better define a threat scenario and look for correlations between multiple systems.
   {: .note }
   * For the data source, use the **Select index** dropdown menu to specify an index or index pattern. Use the **Log type** dropdown menu to specify the log type associated with the index.
   * For fields, use the **Field** dropdown menu to specify a log's field. In the **Field value** text box, enter a value for the field.
   * Select **Add field** to add a second field to the query. You can add multiple fields to a single query.
   <img src="{{site.url}}{{site.baseurl}}/images/Security/sec-analytics/c-rule-query1.png" alt="Correlation rule query configuration" width="40%">
1. After configuring the first query, follow instructions in the previous step to configure a second query. You can select **Add query** at the bottom of the window to add more queries for the rule.
1. Once the rule is complete, select **Create correlation rule** in the lower right corner of the window. OpenSearch creates a new rule, the screen returns to the **Correlation rules** window, and the new rule appears in the table of correlation rules.

## Setting a time window

The Cluster Settings API allows you to set a window of time to focus the correlation of findings. For example, if your time window is three minutes, the system attempts to correlate findings defined in the threat scenario only when they occur within three minutes of one another. By default, the time window is five minutes. For more information about the Cluster Settings API, see [Cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/).

### Example request

```json
PUT /_cluster/settings
{
  "transient": {
    "plugins.security_analytics.correlation_time_window": "2m"
  }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "acknowledged": true,
  "persistent": {},
  "transient": {
    "plugins": {
      "security_analytics": {
        "correlation_time_window": "2m"
      }
    }
  }
}
```

## What's next

Following creation of detectors and correlation rules, you can use the correlation graph to observe the correlations between findings from differernt log sources. For information about working with the correlation graph, see [Working with the correlation graph]({{site.url}}{{site.baseurl}}/security-analytics/usage/correlation-graph/). 

