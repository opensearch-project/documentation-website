---
layout: default
title: Connecting Prometheus to OpenSearch
parent: Data sources
nav_order: 20
---

# Connecting Prometheus to OpenSearch
Introduced 2.16
{: .label .label-purple }

This documentation covers the key steps to connect Prometheus to OpenSearch using the OpenSearch Dashboards interface, including setting up the data source connection, modifying the connection details, and creating an index pattern for the Prometheus data. 

## Prerequisites and permissions

Before connecting a data source, ensure you have met the [Prerequisites]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/#prerequisites) and have the necessary [Permissions]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/#permissions).

## Create a Prometheus data source connection

A data source connection specifies the parameters needed to connect to a data source. These parameters form a connection string for the data source. Using OpenSearch Dashboards, you can add new **Prometheus** data source connections or manage existing ones.

Follow these steps to connect your data source:

1. From the OpenSearch Dashboards main menu, go to **Management** > **Data sources** > **New data source** > **Prometheus**. 

2. From the **Configure Prometheus data source** section: 
   
   - Under **Data source details**, provide a title and optional description.
   - Under **Prometheus data location**, enter the Prometheus URI.
   - Under **Authentication details**, select the appropriate authentication method from the dropdown list and enter the required details:
       - **Basic authentication**: Enter a username and password.
       - **AWS Signature Version 4**: Specify the **Region**, select the OpenSearch service from the **Service Name** list (**Amazon OpenSearch Service** or **Amazon OpenSearch Serverless**), and enter the **Access Key** and **Secret Key**.
   - Under **Query permissions**, choose the role needed to search and index data. If you select **Restricted**, an additional field will become available to configure the required role.

3. Select **Review Configuration** > **Connect to Prometheus** to save your settings. The new connection will appear in the list of data sources.

## Modify a data source connection

To modify a data source connection, follow these steps: 

1. Select the desired connection from the list on the **Data sources** main page. This will open the **Connection Details** window.
2. Within the **Connection Details** window, edit the **Title** and **Description** fields. Select the **Save changes** button to apply the changes.
3. To update the **Authentication Method**, choose the method from the dropdown list and enter any necessary credentials. Select **Save changes** to apply the changes.
    - To update the **Basic authentication** authentication method, select the **Update stored password** button. Within the pop-up window, enter the updated password and confirm it and select **Update stored password** to save the changes. To test the connection, select the **Test connection** button.
    - To update the **AWS Signature Version 4** authentication method, select the **Update stored AWS credential** button. Within the pop-up window, enter the updated access and secret keys and select **Update stored AWS credential** to save the changes. To test the connection, select the **Test connection** button.

## Delete a data source connection

To delete the data source connection, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/trash-can-icon.png" class="inline-icon" alt="delete icon"/>{:/} icon.

## Create an index pattern

After creating a data source connection, the next step is to create an index pattern for that data source. For more information and a tutorial on index patterns, refer to [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/). 
