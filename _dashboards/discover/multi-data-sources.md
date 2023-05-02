---
layout: default
title: Adding multiple data sources
parent: Exploring data
nav_order: 20
---

# Adding multiple data sources

The multiple data sources feature is an experimental feature released in OpenSearch 2.4. It can't be used in a production environment. For updates on the feature’s progress or to leave feedback on improving the feature, see the [OpenSearch Forum discussion](https://forum.opensearch.org/t/feedback-experimental-feature-connect-to-external-data-sources/11144).
{: .warning }

 OpenSearch Dashboards allows you to dynamically manage data sources, create index patterns based on those data sources, run queries against a specific data source, and combine visualizations in one dashboard.

In this tutorial we provide the steps for enabling the `data_source` setting in Dashboards; adding credentials, data source connections, and index patterns; and combining visualizations in a single dashboard.

## Enabling the multiple data sources feature

This tutorial uses a preconfigured data source and index pattern, and you aren’t required to configure settings. However, you’ll need to enable the `data_source` setting in the configuration file before before getting started with exploring this feature.
{: .note }

The multiple data sources feature is experimental and can't be deployed into production. You can try it out with a sample data source and a sample index pattern. Before getting started, you must first edit the YAML configuration. The following section provides the steps for enabling the feature.

## Modifying the YAML file settings for multiple data sources

Dashboards is configured in the cluster settings, and the multiple data sources feature is disabled by default. To enable it, you need to edit the configuration in `opensearch_dashboards.yml` and then restart the cluster.

To enable the feature:

1. Navigate to your Dashboards home directory; for example, in Docker, `/usr/share/opensearch-dashboards`.
2. Open your local copy of the Dashboards configuration file, `opensearch_dashboards.yml`. If you don't have a copy, get one from GitHub: [`opensearch_dashboards.yml`](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml).
3. Set `data_source.enabled: false` to  `data_source.enabled: true` and save the configuration.
4. Restart the Dashboards container.
5. Verify the feature configuration settings were created and configured properly by connecting to Dashboards through [http://localhost:5601](http://localhost:5601/) and viewing the **Stack Management** console. **Data Sources `Experimental`** will appear in the sidebar. Alternatively, you can open on [http://localhost:5601/app/management/opensearch-dashboards/dataSources](http://localhost:5601/app/management/opensearch-dashboards/dataSource).

## Creating a data source connection

A data source connection specifies the parameters needed to connect to a data source. These parameters form a connection string for the data source. In Dashboards, you can add new data source connections or edit existing connections.

To create a new data source connection:

1. Open Dashboards. If you’re not running the security plugin, go to [`http://localhost:5601`](http://localhost:5601/). If you’re running the security plugin, go to [`https://localhost:5601`](https://localhost:5601/) and log in with the username `admin` and password `admin`.

1. Under **Management** in the OpenSearch Dashboards main menu, choose **Stack Management**, **Data Sources `Experimental`**, **Data Sources**, and then choose **Create data source connection**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-1.png" width=500 alt="Data sources user interface">

1. Add information to each field to configure **Connection Details**, **Endpoint URL**, and **Authentication Method**, as shown in the following image. For this tutorial, the **Endpoint URL** is `http://localhost:5601/app/management/opensearch-dashboards/dataSources`.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-2.png" width=500 alt="Create a data source connection user interface">

    In **Connection Details**, enter a title for the connection and the endpoint URL used to connect to the data source. A description of the connection is optional. 
    
    For **Authentication Method**, first select the type of authentication:
    * **No authentication**: No authentication is used to connect to the data source.
    * **Username & Password**: A basic username and password are used to connect to the data source.
    * **AWS SigV4**: An AWS Signature Version 4 authenticating request is used to connect to the data source. AWS SigV4 requires an access key ID and a secret access key. First specify the **Region**, and then enter the **Access Key** and **Secret Key** for authorization. For information on available Regions for AWS accounts, see [Available Regions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions). For more on SigV4 authentication requests, see [Authenticating Requests (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html).
    
    When you select the authentication method, the applicable fields appear for the selected method. Enter the required details.

    After you have entered the appropriate details in all of the required fields, the **Test connection** and **Create data source connection** buttons become active. You can choose **Test connection** to confirm that the connection is valid.

1. Choose **Create data source connection** to save your settings. The connection is created. The active window returns to the **Data Sources** main page, and the new connection appears in the list of data sources.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-3.png" width=500 alt="Data sources list user interface">

    You can also delete the data source connection from this page by selecting the check box to the left of the title and then choosing **Delete 1 connection** to the right of the search bar. Selecting multiple check boxes for multiple connections is also supported.
    {: .note }

### Editing and updating a data source connection

To make changes to the data source connection, select a connection in the list on the **Data Sources** main page. The connection details window opens, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-3.5.png" width=500 alt="Data sources settings verification and editing user interface">

To make changes to **Connection Details**, edit one or both of the **Title** and **Description** fields and choose **Save changes** in the lower-right corner of the screen. You can also cancel changes here. To change the **Authentication Method**, choose a different authentication method, enter your credentials if applicable, and then choose **Save changes** in the lower-right corner of the screen. The changes are saved.

When **Username & Password** is the selected authentication method, you can update the password by choosing **Update stored password** next to the **Password** field. In the pop-up window, enter a a new password in the first field and then enter it again in the second field to confirm. Choose **Update stored password** in the pop-up window. The new password is saved. Choose **Test connection** in the upper-right corner of the screen to confirm that the connection is valid.

When **AWS SigV4** is the selected authentication method, you can update the credentials by choosing **Update stored AWS credential**. In the pop-up window, enter a new  access key in the first field and a new secret key in the second field. Choose **Update stored AWS credential** in the pop-up window. The new credentials are saved. Choose **Test connection** in the upper-right corner of the screen to confirm that the connection is valid.

To delete the data source connection, choose the red trash can icon in the upper-right corner of the screen.

## Creating an index pattern

Index patterns allow you to access the OpenSearch data that you want to explore. An index pattern selects the data to use and allows you to define the field properties. Learn how to load your own data and create an index pattern following these steps. This tutorial uses the preconfigured index pattern `opensearch_dashboards_sample_data_ecommerce Default`.

1. In the Dashboards console, choose **Index Patterns** > **Create index pattern**, as shown in the following image.
   
    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-5.png" width=500 alt="Index pattern user interface">

1. Choose **Use external data source connection**.
1. Start typing in the **Search data sources** field to search for the data source you created earlier and then select the data source and **Next step**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-6.png" width=500 alt="Index pattern search user interface">

1. Add an **Index pattern name** to define the index pattern and then choose **Next step**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-7.png" width=500 alt="Index pattern define user interface">

1. Select an option for the **Time field** and then choose **Create index pattern**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-8.png" width=500 alt="Index pattern time field user interface">

## Searching data

Before you start searching for data, set up the time filter. The sample index pattern used for this tutorial contains time-based data. You can set a time filter that displays only the data within a specified time range, and you can choose the time filter to change the time range or select a specific time range in the histogram.

### Adjusting the time filter

To adjust the time filter:

1. In the Dashboards console, choose **Discover** and confirm that the index pattern being used is `opensearch_dashboards_sample_data_ecommerce`.
2. Choose the calendar icon to change the time field. The default is **Last 15 minutes**.
3. Change the time field to **Last 7 days** and choose **Refresh**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-9.png" alt="Time filter user interface">

4. To set the start and end times, choose the bar next to the time filter. In the popup, select **Absolute**, **Relative**, or **Now** and then specify the required options, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-10.png" width=300 alt="Start and end times user interface">

### Selecting a time range from the histogram

To select a time range for the histogram, you can do one of the following:

* Select the bar that represents the time range you want to zoom in on.
* Select the bar and drag to view a specific time range. You must start the selection with the cursor over the background of the chart (the cursor changes to a plus sign when you hover over a valid start point).
* Select the dropdown and then select an interval.

The following image shows a date histogram with an interval dropdown list.

<img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-11.jpg" alt="Histogram user interface">

## Selecting multiple data sources in the Dev Tools console

Selecting multiple data sources in the Dev Tools console allows you to work with a broader range of data and gain deeper insights into your code and applications. You can follow these steps:

1. Open `opensearch_dashboards.yml` in the editor of your choice. 
2. Set `data_source.enabled:` to `true`, as shown in the following example:
    
    ```
    # Set the value of this setting to true to enable the experimental multiple data source
    # support feature. Use with caution.
    data_source.enabled: true
    ```

3. Connect to OpenSearch Dashboards and select **Dev Tools** in the menu.
5. Enter the following query in the editor pane of the **Console** and then select the play button:

    ```json
    GET /_cat/indices
    ```

6. From the **DataSource** dropdown menu, select a data source and then query the source.
7. Repeat the preceding steps for each data source you want to select.

For an overview of this process, watch the following 15-second video.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/multidata-dev-tools.gif" alt="Multiple data sources in Dev Tools demo">{: .img-fluid}

## Creating data visualizations for a dashboard

Follow these steps to learn how to create data visualizations for a dashboard:

1. In the Dashboards console, choose **Visualize** > **Create visualization**.
2. Select the visualization type. For this tutorial, choose **Line**.
3. Select a source. For this tutorial, choose the index pattern `opensearch_dashboards_sample_data_ecommerce`.
4. Under **Buckets**, choose **Add** > **X-axis**.
5. In the **Aggregation** field, choose **Date Histogram** and then choose **Update**.
6. Optional: Choose **Save** and add the file name. This tutorial uses preconfigured data visualizations, so you can't save the file for this tutorial.

## Connecting visualizations in a single dashboard

Follow these steps to connect your visualizations in a single dashboard: 

1. In the Dashboards console, choose **Dashboard** > **Create dashboard**. 
2. Choose **Add an existing** and then select the data you want to add.
3. Choose **Save** and add the dashboard name in the **Title field**. This tutorial uses preconfigured dashboards, so you won’t be able to save your dashboard.
4. Click on the white space left of **Add panels** to view the visualizations in a single dashboard.

Your dashboard might look like the one in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/multi-data-sources-12.jpg" width=700 alt="Example dashboard using data visualizations from many data sources">

You have now explored the data sources experimental feature. To provide feedback on how this feature can be improved ahead of its release for production use, comment in the [OpenSearch forum](https://forum.opensearch.org/).

## Understanding feature limitations

The following limitations apply to this experimental feature:

* The multiple data sources feature is supported for index-pattern-based visualizations only.
* The visualization types Time Series Visual Builder (TSVB), Vega and Vega-Lite, and timeline are not supported.
* External plugins, such as Gantt chart, and non-visualization plugins, such as the developer console, are not supported.

## Related topics

* [OpenSearch Forum](https://forum.opensearch.org/)
