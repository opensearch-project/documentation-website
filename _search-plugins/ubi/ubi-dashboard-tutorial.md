---
layout: default
title: UBI Dashboard Tutorial
parent: User behavior insights
has_children: false
nav_order: 7
---

# Build an analytic dashboard for UBI
Whether you've been collecting user events and queries for a while, or [you uploaded some sample events](https://github.com/o19s/chorus-opensearch-edition/blob/main/katas/003_import_preexisting_event_data.md), now you're ready to visualize them in the dashboard using User Behavior Insights (UBI).


## 1) Fire up the OpenSearch dashboards
Depending on your configuration: http://localhost:5601/app/home#/
![Dashboard Home]({{site.url}}{{site.baseurl}}/images/ubi/home.png "Dashboards")

## 2) Create an index pattern
http://localhost:5601/app/management/opensearch-dashboards/indexPatterns
![Index Patterns]({{site.url}}{{site.baseurl}}/images/ubi/index_pattern1.png "Index Patterns")
Index patterns are how OpenSearch dashboards access your indexes. In this case, we want to access the *hidden* indexes that UBI creates, so that we can visualize your users' online, search behaviors.

After you click on "Create index pattern" you'll see a list of indexes in your OpenSearch instance. The UBI stores are hidden by default; so, be sure to click on "Include system and hidden indexes". 
![Index Patterns]({{site.url}}{{site.baseurl}}/images/ubi/index_pattern2.png "Index Patterns")

With wildcards you can group indexes into the same data source for your dashboard. Assuming the name of your UBI is `chorus`, we'll lump both the query and event stores together as `ubi_chorus*`.

It will prompt you to filter on any `date` field in your schema, so that you can look at things like trending queries over the last 15 minutes. However, for your first dashboard, do not filter on any date field. 
<img src="{{site.url}}{{site.baseurl}}/images/ubi/index_pattern3.png" alt="Index Patterns" width="400"/>


 Click on "Create index pattern", and you're ready to start building your dashboard pointing to your UBI store.

## 3) Create a new dashboard
http://localhost:5601/app/opensearch_dashboards_overview#/

![First Dashboard]({{site.url}}{{site.baseurl}}/images/ubi/first_dashboard.png "First Dashboard")

The screen will bring up an empty dashboard, ready for you to add some analytic widgets. We'll start with a pie chart. Click on "Create new" and select a pie chart visualization. Then select the index patter you made in Step 2.

|Create new|Visualizations|
|---|---|
|![New Chart]({{site.url}}{{site.baseurl}}/images/ubi/new_widget.png "New Chart")|<img src="{{site.url}}{{site.baseurl}}/images/ubi/visualizations.png" alt="Pie Chart" width="300"/>|

Most of the visualization require some sort of aggregate function on an bucket/facet/aggregatable field (i.e. numeric or keyword). We'll add a `Terms` aggregation on the field `action_name` so that we can see the distribution across event names. Change the size to the number of slices you want to display.
![Pie Chart]({{site.url}}{{site.baseurl}}/images/ubi/pie.png "Pie Chart")

Save that visualization and it will be added to your new dashboard. Now that you have a visualization on your dashboard, you can save your dashboard.

## 4) Add a "tag cloud" vizualization to your dashboard
Let's add a word cloud for trending searches. Choose the Tag Cloud visualization of the terms in the `message` field where the JavaScript client logs the raw text that the user searches on. (Note: the true query, as processed by OpenSearch with filters, boosting, and so on will be in the `.{store}_queries` index, but what we are looking at is the `message` field of the `.{store}_events` index, where the JavaScript client captures what the user actually typed. )
![Word Cloud]({{site.url}}{{site.baseurl}}/images/ubi/tag_cloud1.png "Word Cloud")

**But there's a problem!** The `message` field is on *every* event --not only query/search events-- and can be used in anyway the client developer decides to use it; so, it can contain error messages, debug messages, click information, and so on.
We need to add a filter to only see search terms on query events. Since the developer gave a `message_type` of `QUERY` for each search event, we will filter on that message type to isolate the specific users' searches. 
![Word Cloud]({{site.url}}{{site.baseurl}}/images/ubi/tag_cloud2.png "Word Cloud")

You should now have two visualizations on your dashboard.
![UBI Dashboard]({{site.url}}{{site.baseurl}}/images/ubi/dashboard2.png "UBI Dashboard")

## 5) Add one more visualization of a histogram of item clicks
To add a histogram, first, add a vertical bar chart.

<img src="{{site.url}}{{site.baseurl}}/images/ubi/visualizations2.png" alt="Vertical Bar Chart" width="300"/>

The data field we want to examine is `event_attributes.position.ordinal`, meaning the user clicked on the *n-th* item in a list. The y-axis will be the number of times that *n-th* was clicked. The x-axis will be the ordinal number itself that was clicked, using the `Histogram` aggregation.

![Vertical Bar Chart]({{site.url}}{{site.baseurl}}/images/ubi/histogram.png "Vertical Bar Chart")

## 6) Have fun slicing and dicing
For example, let's see how the click position changes when there is a purchase, by adding this filter `action_name:product_purchase`.
![Product Purchase]({{site.url}}{{site.baseurl}}/images/ubi/product_purchase.png "Product Purchase")

Or let's see what event messages include "\*UBI\*" somewhere between the wildcards.
![UBI]({{site.url}}{{site.baseurl}}/images/ubi/ubi.png "UBI")

You now have a basic dashboard that lets you look at the data. In the next kata we'll focus on some typical ecommerce driven scenarios.
