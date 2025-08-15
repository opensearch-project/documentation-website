---
layout: default
title: UBI in AWS Managed Services tutorial
parent: User Behavior Insights
has_children: false
nav_order: 24
---


# UBI in AWS Managed Services Tutorial

This tutorial walks you through the steps for collecting queries and events when you are using AWS's Managed Service for OpenSearch.  At the end of this tutorial you will be able to send authenticated events to both S3 for long term storage and OpenSearch using the Curl command line tool.  This sets you up for integrating UBI event collection into your applications.

The tutorial makes the following assumptions:

1. You are using AWS Managed Service OpenSearch version 2.19.
1. You are not using the UBI Plugin for OpenSearch, which isn't available until OpenSearch 3.1 in Managed Service.
1. You are writing UBI data to OpenSearch via [OpenSearch Ingestion](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ingestion.html) (managed version of Data Prepper).


## 1. Set Up UBI OpenSearch Indexes

Log into Managed Service OpenSearch Dashboard.  We will use the DevTools console to create two indexes for storing data: `ubi_queries` and `ubi_events`.  

Navigate to **Management > Dev Tools**

Create the overall index creation command:

```json
PUT ubi_events
{
  "mappings": 
}
```

You will see a syntax warning after typing this in, that's okay.

Then, go to https://github.com/opensearch-project/user-behavior-insights/blob/main/src/main/resources/events-mapping.json and copy the entire JSON text and paste it in after the `"mappings":` line in the Dev Tools console.   You will have something similar to:

```json
PUT ubi_events
{
  "mappings": {
    "properties": {
      "application": {
        "type": "keyword",
        "ignore_above": 256
      },
      "action_name": {
        "type": "keyword",
        "ignore_above": 100
      },
      CUT FOR LENGTH
```

Go ahead and run that command and make sure it runs successfully.

You will do the same thing for `ubi_queries`.

```json
PUT ubi_queries
{
  "mappings": 
}
```

This time go to https://github.com/opensearch-project/user-behavior-insights/blob/main/src/main/resources/queries-mapping.json and copy the entire JSON text and paste it in after the `"mappings":` line in the Dev Tools console.  Run the command.

> If you are using OpenSearch 3.1 or newer then the UBI Plugin is already enabled for you.  Instead of manually creating the indexes you can instead use the UBI plugin to create them:
>
> ```json
> POST /_plugins/ubi/initialize
> ```
{: .note}

You now have the OpenSearch indexes that will recieve UBI data.

## 2. Set up S3 Storage

## 3. Set up OpenSearch Ingestion Pipeline


## 4. Test with sample events

## Where Next?

In OpenSearch Management, navigate to **Dashboards Management > Index patterns** or navigate using a URL, such as `http://{server}:5601/app/management/OpenSearch-dashboards/indexPatterns`.

OpenSearch Dashboards accesses your indexes using index patterns. To visualize your users' online search behavior, you must create an index pattern in order to access the indexes that UBI creates. For more information, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).

After you select **Create index pattern**, a list of indexes in your OpenSearch instance is displayed. The UBI stores may be hidden by default, so make sure to select **Include system and hidden indexes**, as shown in the following image. 
![Index Patterns]({{site.url}}{{site.baseurl}}/images/ubi/index_pattern2.png)

You can group indexes into the same data source for your dashboard using wildcards. For this tutorial you'll combine the query and event stores into the `ubi_*` pattern.

OpenSearch Dashboards prompts you to filter on any `date` field in your schema so that you can look at things like trending queries over the last 15 minutes. However, for your first dashboard, select **I don't want to use the time filter**, as shown in the following image. 
<img src="{{site.url}}{{site.baseurl}}/images/ubi/index_pattern3.png" alt="Index Patterns" width="400"/>


After selecting **Create index pattern**, you're ready to start building a dashboard that displays the UBI store data.

## 3. Create a new dashboard

To create a new dashboard, on the top menu, select **OpenSearch Dashboards > Dashboards** and then **Create > Dashboard** > **Create new**.
If you haven't previously created a dashboard, you are presented with the option to create a new dashboard. Otherwise, previously created dashboards are displayed.


In the **New Visualization** window, select **Pie** to create a new pie chart. Then select the index pattern you created in step 2.

Most visualizations require some sort of aggregate function on a bucket/facet/aggregatable field (numeric or keyword). You'll add a `Terms` aggregation to the `action_name` field so that you can view the distribution of event names. Change the **Size** to the number of slices you want to display, as shown in the following image.
![Pie Chart]({{site.url}}{{site.baseurl}}/images/ubi/pie.png)

Save the visualization so that it's added to your new dashboard. Now that you have a visualization displayed on your dashboard, you can save the dashboard.

## 4. Add a tag cloud visualization

Now you'll add a word cloud for trending searches by creating a new visualization, similarly to the previous step.  

In the **New Visualization** window, select **Tag Cloud**, and then select the index pattern you created in step 2. Choose the tag cloud visualization of the terms in the `message` field where the JavaScript client logs the raw search text. Note: The true query, as processed by OpenSearch with filters, boosting, and so on, resides in the `ubi_queries` index. However, you'll view the `message` field of the `ubi_events` index, where the JavaScript client captures the text that the user actually typed. 

The following image shows the tag cloud visualization on the `message` field.
![Word Cloud]({{site.url}}{{site.baseurl}}/images/ubi/tag_cloud1.png)

The underlying queries can be found at [SQL trending queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/#trending-queries).
{: .note} 


The resulting visualization may contain different information than you're looking for. The `message` field is updated with every event, and as a result, it can contain error messages, debug messages, click information, and other unwanted data.
To view only search terms for query events, you need to add a filter to your visualization. Because during setup you provided a `message_type` of `QUERY` for each search event, you can filter by that message type to isolate the specific users' searches. To do this, select **Add filter** and then select **QUERY** in the **Edit filter** panel, as shown in the following image. 
![Word Cloud]({{site.url}}{{site.baseurl}}/images/ubi/tag_cloud2.png)

There should now be two visualizations (the pie chart and the tag cloud) displayed on your dashboard, as shown in the following image.
![UBI Dashboard]({{site.url}}{{site.baseurl}}/images/ubi/dashboard2.png)

## 5. Add a histogram of item clicks

Now you'll add a histogram visualization to your dashboard, similarly to the previous step. In the **New Visualization** window, select **Vertical Bar**. Then select the index pattern you created in step 2. 

Examine the `event_attributes.position.ordinal` data field. This field contains the position of the item in a list selected by the user. For the histogram visualization, the x-axis represents the ordinal number of the selected item (n). The y-axis represents the number of times that the nth item was clicked, as shown in the following image. 

![Vertical Bar Chart]({{site.url}}{{site.baseurl}}/images/ubi/histogram.png)

## 6. Filter the displayed data

Now you can further filter the displayed data. For example, you can see how the click position changes when a purchase occurs. Select **Add filter** and then select the `action_name:product_purchase` field, as shown in the following image.
![Product Purchase]({{site.url}}{{site.baseurl}}/images/ubi/product_purchase.png)


You can filter event messages containing the word `*laptop*` by adding wildcards, as shown in the following image.
![Laptop]({{site.url}}{{site.baseurl}}/images/ubi/laptop.png).
