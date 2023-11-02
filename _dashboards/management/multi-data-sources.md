---
layout: default
title: Configuring and using multiple data sources
parent: Data sources
nav_order: 10
redirect_from: 
  - /dashboards/discover/multi-data-sources/
---

# Configuring and using multiple data sources

You can ingest, process, and analyze data from multiple data sources in OpenSearch Dashboards. You configure the data sources in the **Dashboards Management** > **Data sources** app, as shown in the following image.


<img src="{{site.url}}{{site.baseurl}}/images/dashboards/data-sources-management.png" alt="Dashboards Management Data sources main screen" width="700">

## Getting started

The following tutorial guides you through configuring and using multiple data sources. 

### Step 1: Modify the YAML file settings

To use multiple data sources, you must enable the `data_source.enabled` setting. It is disabled by default. To enable multiple data sources:

1. Open your local copy of the OpenSearch Dashboards configuration file, `opensearch_dashboards.yml`. If you don't have a copy, [`opensearch_dashboards.yml`](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml) is available on GitHub.
2. Set `data_source.enabled:` to  `true` and save the YAML file.
3. Restart the OpenSearch Dashboards container.
4. Verify that the configuration settings were configured properly by connecting to OpenSearch Dashboards and viewing the **Dashboards Management** navigation menu. **Data sources** appears in the sidebar. You'll see a view similar to the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/multidatasources.png" alt="Data sources in sidebar within Dashboards Management" width="700">

### Step 2: Create a new data source connection

A data source connection specifies the parameters needed to connect to a data source. These parameters form a connection string for the data source.

To create a new data source connection:

1. From the OpenSearch Dashboards main menu, select **Dashboards Management** > **Data sources** > **Create data source connection**.
2. Add the required information to each field to configure **Connection Details** and **Authentication Method**. 
   
    - Under **Connection Details**, enter a title and endpoint URL. For this tutorial, use the URL `http://localhost:5601/app/management/opensearch-dashboards/dataSources`. Entering a description is optional.

    - Under **Authentication Method**, select an authentication method from the dropdown list. Once an authentication method is selected, the applicable fields for that method appear. You can then enter the required details. The authentication method options are:
      - **No authentication**: No authentication is used to connect to the data source.
      - **Username & Password**: A basic username and password are used to connect to the data source.
      - **AWS SigV4**: An AWS Signature Version 4 authenticating request is used to connect to the data source. AWS Signature Version 4 requires an access key and a secret key.
            - For AWS Signature Version 4 authentication, first specify the **Region**. Next, select the OpenSearch service in the **Service Name** list. The options are **Amazon OpenSearch Service** and **Amazon OpenSearch Serverless**. Last, enter the **Access Key** and **Secret Key** for authorization. 
      
      For information about available AWS Regions for AWS accounts, see [Available Regions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions). For more information about AWS Signature Version 4 authentication requests, see [Authenticating Requests (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html).
      {: .note}

    - After you have entered the appropriate details in all of the required fields, the **Test connection** and **Create data source** buttons become active. You can select **Test connection** to confirm that the connection is valid.

3. Select **Create data source** to save your settings. The connection is created. The active window returns to the **Data Sources** main page, and the new connection appears in the list of data sources.

4. Edit or update a data source connection.

    - To make changes to the data source connection, select a connection in the list on the **Data Sources** main page. The **Connection Details** window opens.

    - To make changes to **Connection Details**, edit one or both of the **Title** and **Description** fields and select **Save changes** in the lower-right corner of the screen. You can also cancel changes here. To change the **Authentication Method**, choose a different authentication method, enter your credentials (if applicable), and then select **Save changes** in the lower-right corner of the screen. The changes are saved.

        - When **Username & Password** is the selected authentication method, you can update the password by choosing **Update stored password** next to the **Password** field. In the pop-up window, enter a new password in the first field and then enter it again in the second field to confirm. Select **Update stored password** in the pop-up window. The new password is saved. Select **Test connection** to confirm that the connection is valid.

        - When **AWS SigV4** is the selected authentication method, you can update the credentials by selecting **Update stored AWS credential**. In the pop-up window, enter a new access key in the first field and a new secret key in the second field. Select **Update stored AWS credential** in the pop-up window. The new credentials are saved. Select **Test connection** in the upper-right corner of the screen to confirm that the connection is valid.

5. Delete the data source connection by selecting the check box to the left of the title and then choosing **Delete 1 connection**. Selecting multiple check boxes for multiple connections is supported. Alternatively, select the trash can icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/}).

An example data source connection screen is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/data-source-connection.png" alt="Data source connection screen" width="700">

### Selecting multiple data sources through the Dev Tools console

Alternatively, you can select multiple data sources through the [Dev Tools]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index-dev/) console. This option provides for working with a broader range of data and gaining deeper insight into your code and applications. 

Watch the following 10-second video to see it in action.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/multidata-dev-tools.gif" alt="Multiple data sources in Dev Tools demo">{: .img-fluid}

To select a data source through the Dev Tools console, follow these steps:

1. Locate your copy of `opensearch_dashboards.yml` and open it in the editor of your choice. 
2. Set `data_source.enabled` to `true`.
3. Connect to OpenSearch Dashboards and select **Dev Tools** in the menu.
4. Enter the following query in the editor pane of the **Console** and then select the play button:

    ```json
    GET /_cat/indices
    ```
    {% include copy-curl.html %}

5. From the **DataSource** dropdown menu, select a data source and then query the source.
6. Repeat the preceding steps for each data source you want to select.

## Next steps 

Once you've configured your multiple data sources, you can start exploring that data. See the following resources to learn more:

- Learn about [managing index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/) through OpenSearch Dashboards.
- Learn about [indexing data using Index Management]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/) through OpenSearch Dashboards.
- Learn about how to [connect OpenSearch and Amazon S3 through OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/management/S3-data-source/).
- Learn about the [Integrations tool]({{site.url}}{{site.baseurl}}/integrations/index/), which gives you the flexibility to use various data ingestion methods and connect data from the Dashboards UI.

## Limitations

This feature has some limitations:

* The multiple data sources feature is supported for index-pattern-based visualizations only.
* The visualization types Time Series Visual Builder (TSVB), Vega and Vega-Lite, and timeline are not supported.
* External plugins, such as Gantt chart, and non-visualization plugins, such as the developer console, are not supported.
