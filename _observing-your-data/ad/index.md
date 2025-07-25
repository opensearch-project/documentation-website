---
layout: default
title: Anomaly detection
nav_order: 80
has_children: true
redirect_from:
  - /monitoring-plugins/ad/
  - /monitoring-plugins/ad/index/
canonical_url: https://docs.opensearch.org/latest/observing-your-data/ad/index/
---

# Anomaly detection

An anomaly in OpenSearch is any unusual behavior change in your time-series data. Anomalies can provide valuable insights into your data. For example, for IT infrastructure data, an anomaly in the memory usage metric might help you uncover early signs of a system failure.

It can be challenging to discover anomalies using conventional methods such as creating visualizations and dashboards. You could configure an alert based on a static threshold, but this requires prior domain knowledge and isn't adaptive to data that exhibits organic growth or seasonal behavior.

Anomaly detection automatically detects anomalies in your OpenSearch data in near real-time using the Random Cut Forest (RCF) algorithm. RCF is an unsupervised machine learning algorithm that models a sketch of your incoming data stream to compute an `anomaly grade` and `confidence score` value for each incoming data point. These values are used to differentiate an anomaly from normal variations. For more information about how RCF works, see [Random Cut Forests](https://www.semanticscholar.org/paper/Robust-Random-Cut-Forest-Based-Anomaly-Detection-on-Guha-Mishra/ecb365ef9b67cd5540cc4c53035a6a7bd88678f9).

You can pair the Anomaly Detection plugin with the [Alerting plugin]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) to notify you as soon as an anomaly is detected.

To get started, choose **Anomaly Detection** in OpenSearch Dashboards.
To first test with sample streaming data, you can try out one of the preconfigured detectors with one of the sample datasets.

## Step 1: Define a detector

A detector is an individual anomaly detection task. You can define multiple detectors, and all the detectors can run simultaneously, with each analyzing data from different sources.

1. Choose **Create detector**.
1. Add in the detector details.
   - Enter a name and brief description. Make sure the name is unique and descriptive enough to help you to identify the purpose of the detector.
1. Specify the data source.   
   - For **Data source**, choose the index you want to use as the data source. You can optionally use index patterns to choose multiple indexes.
   - (Optional) For **Data filter**, filter the index you chose as the data source. From the **Data filter** menu, choose **Add data filter**, and then design your filter query by selecting **Field**, **Operator**, and **Value**, or choose **Use query DSL** and add your own JSON filter query. Only [Boolean queries]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/) are supported for query domain-specific language (DSL).

#### Example filter using query DSL
The query is designed to retrieve documents in which the `urlPath.keyword` field matches one of the following specified values:
   
   - /domain/{id}/short
   - /sub_dir/{id}/short
   - /abcd/123/{id}/xyz

   ```json
   {
      "bool": {
         "should": [
               {
                  "term": {
                     "urlPath.keyword": "/domain/{id}/short"
                  }
               },
               {
                  "term": {
                     "urlPath.keyword": "/sub_dir/{id}/short"
                  }
               },
               {
                  "term": {
                     "urlPath.keyword": "/abcd/123/{id}/xyz"
                  }
               }
         ]
      }
   }
   ```

1. Specify a timestamp.    
   - Select the **Timestamp field** in your index.
1. Define operation settings.
   - For **Operation settings**, define the **Detector interval**, which is the time interval at which the detector collects data.
      - The detector aggregates the data in this interval, then feeds the aggregated result into the anomaly detection model.
      The shorter you set this interval, the fewer data points the detector aggregates.
      The anomaly detection model uses a shingling process, a technique that uses consecutive data points to create a sample for the model. This process needs a certain number of aggregated data points from contiguous intervals.

      - We recommend setting the detector interval based on your actual data. If it's too long it might delay the results, and if it's too short it might miss some data. It also won't have a sufficient number of consecutive data points for the shingle process.

   - (Optional) To add extra processing time for data collection, specify a **Window delay** value.
      - This value tells the detector that the data is not ingested into OpenSearch in real time but with a certain delay. Set the window delay to shift the detector interval to account for this delay.
      - For example, say the detector interval is 10 minutes and data is ingested into your cluster with a general delay of 1 minute. Assume the detector runs at 2:00. The detector attempts to get the last 10 minutes of data from 1:50 to 2:00, but because of the 1-minute delay, it only gets 9 minutes of data and misses the data from 1:59 to 2:00. Setting the window delay to 1 minute shifts the interval window to 1:49--1:59, so the detector accounts for all 10 minutes of the detector interval time.
1. Specify custom results index.
   - The Anomaly Detection plugin allows you to store anomaly detection results in a custom index of your choice. To enable this, select **Enable custom results index** and provide a name for your index, for example, `abc`. The plugin then creates an alias prefixed with `opensearch-ad-plugin-result-` followed by your chosen name, for example, `opensearch-ad-plugin-result-abc`. This alias points to an actual index with a name containing the date and a sequence number, like `opensearch-ad-plugin-result-abc-history-2024.06.12-000002`, where your results are stored.

   You can use the dash “-” sign to separate the namespace to manage custom results index permissions. For example, if you use `opensearch-ad-plugin-result-financial-us-group1` as the results index, you can create a permission role based on the pattern `opensearch-ad-plugin-result-financial-us-*` to represent the "financial" department at a granular level for the "us" area.
   {: .note }

   - When the Security plugin (fine-grained access control) is enabled, the default results index becomes a system index and is no longer accessible through the standard Index or Search APIs. To access its content, you must use the Anomaly Detection RESTful API or the dashboard. As a result, you cannot build customized dashboards using the default results index if the Security plugin is enabled. However, you can create a custom results index in order to build customized dashboards.
   - If the custom index you specify does not exist, the Anomaly Detection plugin will create it when you create the detector and start your real-time or historical analysis.
   - If the custom index already exists, the plugin will verify that the index mapping matches the required structure for anomaly results. In this case, ensure that the custom index has a valid mapping as defined in the [`anomaly-results.json`](https://github.com/opensearch-project/anomaly-detection/blob/main/src/main/resources/mappings/anomaly-results.json) file.
   - To use the custom results index option, you need the following permissions:
      - `indices:admin/create` - The Anomaly Detection plugin requires the ability to create and roll over the custom index.
      - `indices:admin/aliases` - The Anomaly Detection plugin requires access to create and manage an alias for the custom index.
      - `indices:data/write/index` - You need the `write` permission for the Anomaly Detection plugin to write results into the custom index for a single-entity detector.
      - `indices:data/read/search` - You need the `search` permission because the Anomaly Detection plugin needs to search custom results indexes to show results on the Anomaly Detection UI.
      - `indices:data/write/delete` - Because the detector might generate a large number of anomaly results, you need the `delete` permission to delete old data and save disk space.
      - `indices:data/write/bulk*` -  You need the `bulk*` permission because the Anomaly Detection plugin uses the bulk API to write results into the custom index.
   - Managing the custom results index:
      - The anomaly detection dashboard queries all detectors’ results from all custom results indexes. Having too many custom results indexes might impact the performance of the Anomaly Detection plugin.
      - You can use [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/) to rollover old results indexes. You can also manually delete or archive any old results indexes. We recommend reusing a custom results index for multiple detectors.
      - The Anomaly Detection plugin also provides lifecycle management for custom indexes. It rolls an alias over to a new index when the custom results index meets any of the conditions in the following table.

      Parameter | Description | Type | Unit | Example | Required
      :--- | :--- |:--- |:--- |:--- |:---
      `result_index_min_size` | The minimum total primary shard size (excluding replicas) required for index rollover. If set to 100 GiB and the index has 5 primary and 5 replica shards of 20 GiB each, then the total primary shard size is 100 GiB, triggering the rollover. | `integer` | `MB` | `51200` | No
      `result_index_min_age` |  The minimum index age required for rollover, calculated from its creation time to the current time. | `integer` |`day` | `7` | No
      `result_index_ttl` | The minimum age required to permanently delete rolled-over indexes. | `integer` | `day` | `60` | No

1. Choose **Next**.   

After you define the detector, the next step is to configure the model.

## Step 2: Configure the model

#### Add features to your detector

A feature is the field in your index that you want to check for anomalies. A detector can discover anomalies across one or more features. You must choose an aggregation method for each feature: `average()`, `count()`, `sum()`, `min()`, or `max()`. The aggregation method determines what constitutes an anomaly.

For example, if you choose `min()`, the detector focuses on finding anomalies based on the minimum values of your feature. If you choose `average()`, the detector finds anomalies based on the average values of your feature.

A multi-feature model correlates anomalies across all its features. The [curse of dimensionality](https://en.wikipedia.org/wiki/Curse_of_dimensionality) makes it less likely for multi-feature models to identify smaller anomalies as compared to a single-feature model. Adding more features might negatively impact the [precision and recall](https://en.wikipedia.org/wiki/Precision_and_recall) of a model. A higher proportion of noise in your data might further amplify this negative impact. Selecting the optimal feature set is usually an iterative process. By default, the maximum number of features for a detector is 5. You can adjust this limit with the `plugins.anomaly_detection.max_anomaly_features` setting.
{: .note }

To configure an anomaly detection model based on an aggregation method, follow these steps:

1. On the **Configure Model** page, enter the **Feature name** and check **Enable feature**.
1. For **Find anomalies based on**, select **Field Value**.
1. For **aggregation method**, select either **average()**, **count()**, **sum()**, **min()**, or **max()**.
1. For **Field**, select from the available options.

To configure an anomaly detection model based on a JSON aggregation query, follow these steps:
1. On the **Configure Model** page, enter the **Feature name** and check **Enable feature**.
1. For **Find anomalies based on**, select **Custom expression**. You will see the JSON editor window open up.
1. Enter your JSON aggregation query in the editor.

For acceptable JSON query syntax, see [OpenSearch Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/)
{: .note }

#### (Optional) Set category fields for high cardinality

You can categorize anomalies based on a keyword or IP field type.

The category field categorizes or slices the source time series with a dimension like IP addresses, product IDs, country codes, and so on. This helps to see a granular view of anomalies within each entity of the category field to isolate and debug issues.

To set a category field, choose **Enable a category field** and select a field. You can’t change the category fields after you create the detector.

Only a certain number of unique entities are supported in the category field. Use the following equation to calculate the recommended total number of entities supported in a cluster:

```
(data nodes * heap size * anomaly detection maximum memory percentage) / (entity model size of a detector)
```

To get the entity model size of a detector, use the [profile detector API]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/api/#profile-detector). You can adjust the maximum memory percentage with the `plugins.anomaly_detection.model_max_size_percent` setting.

Consider a cluster with 3 data nodes, each with 8 GB of JVM heap size and the default 10% memory allocation. With an entity model size of 1 MB, the following formula calculates the estimated number of unique entities: 

```
(8096 MB * 0.1 / 1 MB ) * 3 = 2429
```

If the actual total number of unique entities is higher than the number that you calculate (in this case, 2,429), the anomaly detector will attempt to model the extra entities. The detector prioritizes entities that occur more often and are more recent.

This formula serves as a starting point. Make sure to test it with a representative workload. You can find more information in the [Improving Anomaly Detection: One million entities in one minute](https://opensearch.org/blog/one-million-enitities-in-one-minute/) blog post.
{: .note }

#### (Advanced settings) Set a shingle size

Set the number of aggregation intervals from your data stream to consider in a detection window. It’s best to choose this value based on your actual data to see which one leads to the best results for your use case.

The anomaly detector expects the shingle size to be in the range of 1 and 60. The default shingle size is 8. We recommend that you don't choose 1 unless you have two or more features. Smaller values might increase [recall](https://en.wikipedia.org/wiki/Precision_and_recall) but also false positives. Larger values might be useful for ignoring noise in a signal.

#### Preview sample anomalies

Preview sample anomalies and adjust the feature settings if needed.
For sample previews, the Anomaly Detection plugin selects a small number of data samples---for example, one data point every 30 minutes---and uses interpolation to estimate the remaining data points to approximate the actual feature data. It loads this sample dataset into the detector. The detector uses this sample dataset to generate a sample preview of anomaly results.

Examine the sample preview and use it to fine-tune your feature configurations (for example, enable or disable features) to get more accurate results.

1. Choose **Preview sample anomalies**.
    - If you don't see any sample anomaly result, check the detector interval and make sure you have more than 400 data points for some entities during the preview date range.
1. Choose **Next**.

## Step 3: Set up detector jobs

To start a real-time detector to find anomalies in your data in near real-time, check **Start real-time detector automatically (recommended)**.

Alternatively, if you want to perform historical analysis and find patterns in long historical data windows (weeks or months), check **Run historical analysis detection** and select a date range (at least 128 detection intervals).

Analyzing historical data helps you get familiar with the Anomaly Detection plugin. You can also evaluate the performance of a detector with historical data to further fine-tune it.

We recommend experimenting with historical analysis with different feature sets and checking the precision before moving on to real-time detectors.

## Step 4: Review and create

Review your detector settings and model configurations to make sure that they're valid and then select **Create detector**.

![Anomaly detection results]({{site.url}}{{site.baseurl}}/images/review_ad.png)

If you see any validation errors, edit the settings to fix the errors and then return back to this page.
{: .note }

## Step 5: Observe the results

Choose the **Real-time results** or **Historical analysis** tab. For real-time results, you need to wait for some time to see the anomaly results. If the detector interval is 10 minutes, the detector might take more than an hour to start, because its waiting for sufficient data to generate anomalies. 

A shorter interval means the model passes the shingle process more quickly and starts to generate the anomaly results sooner.
Use the [profile detector]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/api#profile-detector) operation to make sure you have sufficient data points.

If you see the detector pending in "initialization" for longer than a day, aggregate your existing data using the detector interval to check for any missing data points. If you find a lot of missing data points from the aggregated data, consider increasing the detector interval.

Choose and drag over the anomaly line chart to zoom in and see a more detailed view of an anomaly.
{: .note }

Analyze anomalies with the following visualizations:

- **Live anomalies** (for real-time results) displays live anomaly results for the last 60 intervals. For example, if the interval is 10, it shows results for the last 600 minutes. The chart refreshes every 30 seconds.
- **Anomaly overview** (for real-time results) / **Anomaly history**  (for historical analysis in the **Historical analysis** tab)  plots the anomaly grade with the corresponding measure of confidence. This pane includes:
    - The number of anomaly occurrences based on the given data-time range. 
    - The **Average anomaly grade**, a number between 0 and 1 that indicates how anomalous a data point is. An anomaly grade of 0 represents “not an anomaly,” and a non-zero value represents the relative severity of the anomaly. 
    - **Confidence** estimate of the probability that the reported anomaly grade matches the expected anomaly grade. Confidence increases as the model observes more data and learns the data behavior and trends. Note that confidence is distinct from model accuracy.
    - **Last anomaly occurrence** is the time at which the last anomaly occurred.

Underneath **Anomaly overview**/**Anomaly history** are:

- **Feature breakdown** plots the features based on the aggregation method. You can vary the date-time range of the detector. Selecting a point on the feature line chart shows the **Feature output**, the number of times a field appears in your index, and the **Expected value**, a predicted value for the feature output. Where there is no anomaly, the output and expected values are equal.

    ![Anomaly detection results]({{site.url}}{{site.baseurl}}/images/feature-contribution-ad.png)

- **Anomaly occurrences** shows the `Start time`, `End time`, `Data confidence`, and `Anomaly grade` for each detected anomaly.

Selecting a point on the anomaly line chart shows **Feature Contribution**, the percentage of a feature that contributes to the anomaly

![Anomaly detection results]({{site.url}}{{site.baseurl}}/images/feature-contribution-ad.png)


If you set the category field, you see an additional **Heat map** chart. The heat map correlates results for anomalous entities. This chart is empty until you select an anomalous entity. You also see the anomaly and feature line chart for the time period of the anomaly (`anomaly_grade` > 0).


If you have set multiple category fields, you can select a subset of fields to filter and sort the fields by. Selecting a subset of fields lets you see the top values of one field that share a common value with another field.

For example, if you have a detector with the category fields `ip` and `endpoint`, you can select `endpoint` in the **View by** dropdown menu. Then select a specific cell to overlay the top 20 values of `ip` on the charts. The Anomaly Detection plugin selects the top `ip` by default. You can see a maximum of 5 individual time-series values at the same time.

## Step 6: Set up alerts

Under **Real-time results**, choose **Set up alerts** and configure a monitor to notify you when anomalies are detected. For steps to create a monitor and set up notifications based on your anomaly detector, see [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/).

If you stop or delete a detector, make sure to delete any monitors associated with it.

## Step 7: Adjust the model

To see all the configuration settings for a detector, choose the **Detector configuration** tab.

1. To make any changes to the detector configuration, or fine tune the time interval to minimize any false positives, go to the **Detector configuration** section and choose **Edit**.
- You need to stop real-time and historical analysis to change its configuration. Confirm that you want to stop the detector and proceed.
1. To enable or disable features, in the **Features** section, choose **Edit** and adjust the feature settings as needed. After you make your changes, choose **Save and start detector**.

## Step 8: Manage your detectors

To start, stop, or delete a detector, go to the **Detectors** page.

1. Choose the detector name.
2. Choose **Actions** and select **Start real-time detectors**, **Stop real-time detectors**, or **Delete detectors**.
