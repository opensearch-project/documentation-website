---
layout: default
title: Data sources
nav_order: 110
has_children: true
---

# Data sources

OpenSearch data sources are the applications that OpenSearch can connect to and ingest data from. Once your data sources have been connected and your data has been ingested, it can be indexed, searched, and analyzed using [REST APIs]({{site.url}}{{site.baseurl}}/api-reference/index/) or the OpenSearch Dashboards UI. 

This documentation focuses on using the OpenSeach Dashboards interface to connect and manage your data sources. For information about using an API to connect data sources, see the developer resources linked under [Next steps](#next-steps).

## Prerequisites

The first step in connecting your data sources to OpenSearch is to install OpenSearch and OpenSearch Dashboards on your system. You can follow the installation instructions in the [OpenSearch documentation]({{site.url}}{{site.baseurl}}/install-and-configure/index/) to install these tools.

Once you have installed OpenSearch and OpenSearch Dashboards, you can use Dashboards to connect your data sources to OpenSearch and then use Dashboards to manage data sources, create index patterns based on those data sources, run queries against a specific data source, and combine visualizations in one dashboard.

Configuration of the [YAML files]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/#configuration-file) and installation of the `dashboards-observability` and `opensearch-sql` plugins is necessary. For more information, see [OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## Create a data source connection

A data source connection specifies the parameters needed to connect to a data source. These parameters form a connection string for the data source. Using Dashboards, you can add new data source connections or manage existing ones.

The following steps guide you through the basics of creating a data source connection:

1. From the OpenSearch Dashboards main menu, select **Dashboards Management** > **Data sources** > **Create data source connection**. The UI is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/data-source-UI.png" alt="Connecting a data source UI" width="700"/>

2. Create the data source connection by entering the appropriate information into the **Connection Details** and **Authentication Method** fields. 
   
   - Under **Connection Details**, enter a title and endpoint URL. For this tutorial, use the URL `http://localhost:5601/app/management/opensearch-dashboards/dataSources`. Entering a description is optional.

   - Under **Authentication Method**, select an authentication method from the dropdown list. Once an authentication method is selected, the applicable fields for that method appear. You can then enter the required details. The authentication method options are:
       - **No authentication**: No authentication is used to connect to the data source.
       - **Username & Password**: A basic username and password are used to connect to the data source.
       - **AWS SigV4**: An AWS Signature Version 4 authenticating request is used to connect to the data source. AWS Signature Version 4 requires an access key and a secret key. 
         - For AWS Signature Version 4 authentication, first specify the **Region**. Next, select the OpenSearch service in the **Service Name** list. The options are **Amazon OpenSearch Service** and **Amazon OpenSearch Serverless**. Lastly, enter the **Access Key** and **Secret Key** for authorization.

    After you have populated the required fields, the **Test connection** and **Create data source** buttons become active. You can select **Test connection** to confirm that the connection is valid.

3. Select **Create data source** to save your settings. The connection is created. The active window returns to the **Data sources** main page, and the new connection appears in the list of data sources.

4. To delete a data source connection, select the checkbox to the left of the data source **Title** and then select the **Delete 1 connection** button. Selecting multiple checkboxes for multiple connections is supported. An example UI is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/delete-data-source.png" alt="Deleting a data source UI" width="700"/>

### Modify a data source connection

To make changes to a data source connection, select a connection in the list on the **Data sources** main page. The **Connection Details** window opens.

To make changes to **Connection Details**, edit one or both of the **Title** and **Description** fields and select **Save changes** in the lower-right corner of the screen. You can also cancel changes here. To change the **Authentication Method**, choose a different authentication method, enter your credentials (if applicable), and then select **Save changes** in the lower-right corner of the screen. The changes are saved.

When **Username & Password** is the selected authentication method, you can update the password by choosing **Update stored password** next to the **Password** field. In the pop-up window, enter a new password in the first field and then enter it again in the second field to confirm. Select **Update stored password** in the pop-up window. The new password is saved. Select **Test connection** to confirm that the connection is valid.

When **AWS SigV4** is the selected authentication method, you can update the credentials by selecting **Update stored AWS credential**. In the pop-up window, enter a new access key in the first field and a new secret key in the second field. Select **Update stored AWS credential** in the pop-up window. The new credentials are saved. Select **Test connection** in the upper-right corner of the screen to confirm that the connection is valid.

To delete the data source connection, select the delete icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/trash-can-icon.png" class="inline-icon" alt="delete icon"/>{:/}).

## Create an index pattern

Once you've created a data source connection, you can create an index pattern for the data source. An _index pattern_ is a template that OpenSearch uses to create indexes for data from the data source. See [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/) for more information and a tutorial. 

## Next steps

- Learn about [managing index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/) through OpenSearch Dashboards.
- Learn about [indexing data using Index Management]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/) through OpenSearch Dashboards.
- Learn about how to connect [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/).
- Learn about how to [connect OpenSearch and Amazon S3 through OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/management/S3-data-source/).
- Learn about the [Integrations]({{site.url}}{{site.baseurl}}/integrations/index/) tool, which gives you the flexibility to use various data ingestion methods and connect data from the Dashboards UI.

