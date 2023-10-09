---
layout: default
title: Data sources
parent: Dashboards Management
nav_order: 10
has_children: true
---

# Data sources
Introduced 2.11
{: .label .label-purple }

Data sources in OpenSearch are the system and applications that OpenSearch can connect to and ingest data from. Once your data sources have been connected and your data has been ingested, it can be indexed, searched, and analyzed using the _<which API>_ API or the OpenSearch Dashboards user interface. 

## Prerequisites

The first step in connecting your data sources and OpenSearch is to install OpenSearch and OpenSearch Dashboards on your system. You can follow the installation instructions in the [OpenSearch documentation]({{site.url}}{{site.baseurl}}/install-and-configure/index/) to install these tools.

Once you have installed OpenSearch and OpenSearch Dashboards, you can use Dashboards to connect your data sources and OpenSearch and then use Dashboards to manage data sources, create index patterns based on those data sources, run queries against a specific data source, and combine visualizations in one dashboard.

Configuration of the [YAML files]({{site.url}}{{site.baseurl}}/install-and-configure/configuration/#configuration-file) and installation of certain [OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) is necessary. The data sources feature flag `data_source.enabled:` must be set to `true`. The default is `false`. The following plugins also are required for integrating your data sources and OpenSearch: `opensearch-sql`, `opensearch-security`, and `opensearch-observability`. 

_<SME provide information: What are prerequisites? Do you need to have OpenSearch Service to use this feature? What YAML configuration is necessary? What settings need to be configured? Provide configuration examples.>_

## Creating a data source connection

A data source connection specifies the parameters needed to connect to a data source. These parameters form a connection string for the data source. Using Dashboards, you can add new data source connections or manage existing ones.

The following steps guide you through the basics of creating a data source connection:

1. From the OpenSearch Dashboards main menu, select **Dashboards Management** > **Data sources** > **Create data source connection**.
2. Add information to each field to configure **Connection Details** and **Authentication Method**. 
   
   Under **Connection Details**, enter a title and endpoint URL. For this tutorial, use the URL `http://localhost:5601/app/management/opensearch-dashboards/dataSources`. Entering a description is optional.

   Under **Authentication Method**, select an authentication method from the dropdown list. Once an authentication method is selected, the applicable fields for that method appear. You can then enter the required details. The authentication method options are:
    - **No authentication**: No authentication is used to connect to the data source.
    - **Username & Password**: A basic username and password are used to connect to the data source.
    - **AWS SigV4**: An AWS Signature Version 4 authenticating request is used to connect to the data source. AWS Signature Version 4 requires an access key and a secret key.

      For AWS Signature Version 4 authentication, first specify the **Region**. Next, select the OpenSearch service in the **Service Name** list. The options are **Amazon OpenSearch Service** and **Amazon OpenSearch Serverless**. Last, enter the **Access Key** and **Secret Key** for authorization.

    After you have entered the appropriate details in all of the required fields, the **Test connection** and **Create data source** buttons become active. You can select **Test connection** to confirm that the connection is valid.

4. Select **Create data source** to save your settings. The connection is created. The active window returns to the **Data Sources** main page, and the new connection appears in the list of data sources.

5. Delete the data source connection by selecting the check box to the left of the title and then choosing **Delete 1 connection**. Selecting multiple check boxes for multiple connections is supported.

## Connecting multiple or external data sources

See [Connecting multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) and [Speeding up external data ingestion]({{site.url}}{{site.baseurl}}dashboards/management/accelerate-external-data/).

## Modifying a data source connection

To make changes to the data source connection, select a connection in the list on the **Data Sources** main page. The **Connection Details** window opens.

To make changes to **Connection Details**, edit one or both of the **Title** and **Description** fields and select **Save changes** in the lower-right corner of the screen. You can also cancel changes here. To change the **Authentication Method**, choose a different authentication method, enter your credentials (if applicable), and then select **Save changes** in the lower-right corner of the screen. The changes are saved.

When **Username & Password** is the selected authentication method, you can update the password by choosing **Update stored password** next to the **Password** field. In the pop-up window, enter a new password in the first field and then enter it again in the second field to confirm. Select **Update stored password** in the pop-up window. The new password is saved. Select **Test connection** to confirm that the connection is valid.

When **AWS SigV4** is the selected authentication method, you can update the credentials by selecting **Update stored AWS credential**. In the pop-up window, enter a new access key in the first field and a new secret key in the second field. Select **Update stored AWS credential** in the pop-up window. The new credentials are saved. Select **Test connection** in the upper-right corner of the screen to confirm that the connection is valid.

To delete the data source connection, select the delete icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/trash-can-icon.png" class="inline-icon" alt="delete icon"/>{:/}).
