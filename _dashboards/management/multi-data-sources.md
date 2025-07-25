---
layout: default
title: Configuring and using multiple data sources
parent: Data sources
nav_order: 10
redirect_from:
  - /dashboards/discover/multi-data-sources/
canonical_url: https://docs.opensearch.org/latest/dashboards/management/multi-data-sources/
---

# Configuring and using multiple data sources

You can ingest, process, and analyze data from multiple data sources in OpenSearch Dashboards. You configure the data sources in the **Dashboards Management** > **Data sources** app, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/data_sources_management.png" alt="Dashboards Management Data sources main screen" width="700">

## Getting started

The following tutorial guides you through configuring and using multiple data sources.

### Step 1: Modify the YAML file settings

To use multiple data sources, you must enable the `data_source.enabled` setting. It is disabled by default. To enable multiple data sources:

1. Open your local copy of the OpenSearch Dashboards configuration file, `opensearch_dashboards.yml`. If you don't have a copy, [`opensearch_dashboards.yml`](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml) is available on GitHub.
2. Set `data_source.enabled:` to `true` and save the YAML file.
3. Restart the OpenSearch Dashboards container.
4. Verify that the configuration settings were configured properly by connecting to OpenSearch Dashboards and viewing the **Dashboards Management** navigation menu. **Data sources** appears in the sidebar. You'll see a view similar to the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/data_sources_management.png" alt="Data sources in sidebar within Dashboards Management" width="700">

### Step 2: Create a new data source connection

A data source connection specifies the parameters needed to connect to a data source. These parameters form a connection string for the data source.

To create a new data source connection:

1. From the OpenSearch Dashboards main menu, select **Dashboards Management** > **Data sources** > **Create data source connection**.
 
2. Add the required information to each field to configure the **Connection Details** and **Authentication Method**.

    - Under **Connection Details**, enter a title and endpoint URL. For this tutorial, use the URL `https://localhost:9200/`. Entering a description is optional.

    - Under **Authentication Method**, select an authentication method from the dropdown list. Once an authentication method is selected, the applicable fields for that method appear. You can then enter the required details. The authentication method options are:
        - **No authentication**: No authentication is used to connect to the data source.
        - **Username & Password**: A basic username and password are used to connect to the data source.
        - **AWS SigV4**: An AWS Signature Version 4 authenticating request is used to connect to the data source. AWS Signature Version 4 requires an access key and a secret key.
            - For AWS Signature Version 4 authentication, first specify the **Region**. Next, select the OpenSearch service from the **Service Name** list. The options are **Amazon OpenSearch Service** and **Amazon OpenSearch Serverless**. Last, enter the **Access Key** and **Secret Key** for authorization.

      For information about available AWS Regions for AWS accounts, see [Available Regions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions). For more information about AWS Signature Version 4 authentication requests, see [Authenticating Requests (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html).
      {: .note}

    - After you have entered the appropriate details in all of the required fields, the **Test connection** and **Create data source** buttons become active. You can select **Test connection** to confirm that the connection is valid.

3. Select **Create data source** to save your settings. The connection is created, and the new data source appears in the list on the **Data Sources** main page. The first data source you create is marked as your default. 

4. Edit or update a data source connection.

    - On the **Data Sources** main page, select the connection you want to modify. The **Connection Details** window opens.

    - To mark the selected data source as the default, select the **Set as default** option. 

    - To make changes to **Connection Details**, edit one or both of the **Title** and **Description** fields and select **Save changes** in the lower-right corner of the screen. You can also cancel changes here. To change the **Authentication Method**, choose a different authentication method, enter your credentials (if applicable), and then select **Save changes** in the lower-right corner of the screen. The changes are saved.
        
        - When **Username & Password** is the selected authentication method, you can update the password by choosing **Update stored password** next to the **Password** field. In the pop-up window, enter a new password in the first field and then enter it again in the second field to confirm. Select **Update stored password** in the pop-up window. The new password is saved. Select **Test connection** to confirm that the connection is valid.
        - When **AWS SigV4** is the selected authentication method, you can update the credentials by selecting **Update stored AWS credential**. In the pop-up window, enter a new access key in the first field and a new secret key in the second field. Select **Update stored AWS credential** in the pop-up window. The new credentials are saved. Select **Test connection** in the upper-right corner of the screen to confirm that the connection is valid.

5. Delete the data source connection by selecting the check box to the left of the title and then choosing **Delete 1 connection**. Selecting multiple check boxes for multiple connections is supported. Alternatively, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/} icon.

An example data source connection screen is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/data_source_connection.png" alt="Data source connection screen" width="700">

### Selecting multiple data sources through the Dev Tools console

Alternatively, you can select multiple data sources through the [Dev Tools]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index-dev/) console. This option allows you to work with a broader range of data and gaining a deeper understanding of your code and applications.

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

5. From the **Data source** dropdown menu, select a data source and then query the source.
6. Repeat the preceding steps for each data source you want to select.

### Upload saved objects to a dashboard from connected data sources

To upload saved objects from connected data sources to a dashboard with multiple data sources, export them as an NDJSON file from the data source's **Saved object management** page. Then upload the file to the dashboard's **Saved object management** page. This method can simplify the transfer of saved objects between dashboards. The following 20-second video shows this feature in action.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/import_saved_objects_with_file_upload.gif" alt="Multiple data sources in Saved object management">{: .img-fluid}

#### Import saved objects from a connected data source

Follow these steps to import saved objects from a connected data source:

1. Locate your `opensearch_dashboards.yml` file and open it in your preferred text editor.
2. Set `data_source.enabled` to `true`.
3. Connect to OpenSearch Dashboards and go to **Dashboards Management** > **Saved objects**.
4. Select **Import** > **Select file** and upload the file acquired from the connected data source.
5. Choose the appropriate **Data source** from the dropdown menu, set your **Conflict management** option, and then select the **Import** button.

### Show or hide authentication methods for multiple data sources
Introduced 2.13
{: .label .label-purple }

A feature flag in your `opensearch_dashboards.yml` file allows you to show or hide authentication methods within the `data_source` plugin. The following example setting, shown in a 10-second demo, hides the authentication method for `AWSSigV4`. 

````
# Set enabled to false to hide the authentication method from multiple data source in OpenSearch Dashboards.
# If this setting is commented out, then all three options will be available in OpenSearch Dashboards.
# The default value will be considered as true.
data_source.authTypes:
   NoAuthentication:
     enabled: true
   UsernamePassword:
     enabled: true
   AWSSigV4:
     enabled: false
````

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/multidata-hide-show-auth.gif" alt="Multiple data sources hide and show authentication">{: .img-fluid}

### Hide the local cluster option for multiple data sources
Introduced 2.13
{: .label .label-purple }

A feature flag in your `opensearch_dashboards.yml` file allows you to hide the local cluster option within the `data_source` plugin. This option hides the local cluster from the data source dropdown menu and index creation page, which is ideal for environments with or without a local OpenSearch cluster. The following example setting, shown in a 20-second demo, hides the local cluster. 

````
# hide local cluster in the data source dropdown and index pattern creation page. 
data_source.hideLocalCluster: true
````

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/multidata-hide-localcluster.gif" alt="Multiple data sources hide local cluster">{: .img-fluid}

## Using multiple data sources with external dashboards plugins
Introduced 2.14
{: .label .label-purple }

The following plugins now support multiple data sources

### Index management

When the data source feature is enabled, you can navigate to **Index Management** under the **Management** menu. Using indexes as an example, you can view all connected data sources and select a specific one from the navigation bar on the upper right. By default, the indexes from the designated default data source are displayed. However, you can select any connected data source to view its corresponding indexes. The following GIF illustrates these steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/ism_mds1.gif" alt="Multiple data sources in ISM list page"/>

To perform operations on a specific index within a data source, select the individual index from the list. To create a new index, select the **Create Index** button, which opens a form. Fill in the required information and select the **Create** button. The index is created within the selected data source. The following GIF illustrates these steps. 

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/ism_mds2.gif" alt="Multiple data sources in ISM create page"/>

### Anomaly detection

When the data source feature is enabled, you can navigate to **Anomaly Detection** under the **OpenSearch Plugins** menu. On the navigation bar on the upper right, you can view all connected data sources and select a specific data source to view the dashboard from that source if it has detectors. If the selected data source does not have any detectors, the page prompts you to **Create detector**. The following GIF illustrates these steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/ad_mds1.gif" alt="Multiple data sources in Anomaly Detection dashboard page"/>

When you select **Detectors** from the side bar, the page displays the detectors currently configured for the selected data source. You can view and configure individual detectors by selecting them from the list. The following GIF illustrates these steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/ad_mds2.gif" alt="Multiple data sources in Anomaly Detection detector page"/>

### Security

When the data source feature is enabled, you can navigate to **Security** under the **Management** menu. Using role management as an example, you can view all connected data sources in the navigation bar on the upper right and select a specific data source to view its existing roles. To create a new role, select the **Create role** button, which takes you to a new page. Enter the required information and select **Create** to add the new role to the selected data source. The following GIF illustrates these steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/security_mds1.gif" alt="Multiple data sources in Security plugin"/>

### Maps

When the data source feature is enabled, you can navigate to **Maps** under the **OpenSearch Plugins** menu. To edit an existing map, select it from the maps list page, which opens the edit page. On the edit page, you can view all available data sources and the ones currently used in the map. To add a new layer, select **Add layer**, and then select **Documents** from the prompt, which opens a flyout. In the flyout, select the index pattern and geospatial field. Note that the data source name is prefixed to the index pattern name. After selecting **Update**, the new layer is added. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/database-icon.png" class="inline-icon" alt="database icon"/>{:/} icon to verify that a new data source is now being used in the map. The following GIF illustrates these steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/maps_mds1.gif" alt="Multiple data sources in Maps plugin"/>

### Machine learning

When the data source feature is enabled, you can navigate to **Machine Learning** under the **OpenSearch Plugins** menu. Initially, the models within the default data source are displayed. To view models from a different data source, switch to that data source from the navigation bar. To inspect the details of a specific model, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/inspect-icon.png" class="inline-icon" alt="inspect icon"/>{:/} icon to the right of the model entry. The following GIF illustrates these steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/ml_mds1.gif" alt="Multiple data sources in Machine Learning Plugin"/>

### Notifications

When the data source feature is enabled, you can navigate to **Notifications** under the **Management** menu. The page displays the notification channels configured for the currently selected data source. To view channels from a different data source, select the desired data source from the menu. To view or edit the details of an existing channel, select it from the list, which opens the channel details page. The following GIF illustrates these steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/notification_mds1.gif" alt="Multiple data sources in Notification plugin"/>

### Search relevance

When the data source feature is enabled, you can navigate to **Search Relevance** under the **OpenSearch Plugins** menu. On the navigation bar on the upper right, you can view all available data sources. To compare search results between indexes from different data sources, first select a data source and an index for **Query 1**, and then select a data source and an index for **Query 2**. Select **Search** to run the queries. The following GIF illustrates these steps. 

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/searchrelevance_mds1.gif" alt="Multiple data sources in Search Relevance plugin"/>

## Next steps 

After configuring multiple data sources, you can analyze the data from each source. Refer to the following resources for more information:

- Learn about [managing index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/) through OpenSearch Dashboards.
- Learn about [indexing data using Index Management]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/) through OpenSearch Dashboards.
- Learn about how to [connect OpenSearch and Amazon S3 through OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/management/S3-data-source/).
- Learn about the [Integrations tool]({{site.url}}{{site.baseurl}}/integrations/index/), which gives you the flexibility to use various data ingestion methods and connect data from the Dashboards UI.

## Limitations

The following features are not supported when using multiple data sources:

* Timeline visualization types
* Some external plugins, such as the `gantt-chart` plugin
