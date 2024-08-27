---
layout: default
title: Connecting Prometheus to OpenSearch
parent: Data sources
nav_order: 20
---

# Connecting Prometheus to OpenSearch

This documentation focuses on using the OpenSeach Dashboards interface to connect to Prometheus. 

## Prerequisites and permissions

Make sure you followed and configured [Prerequisites]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/#prerequisites) and [Permissions]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/#permissions).


## Creating a Prometheus data source connection

A data source connection specifies the parameters needed to connect to a data source. These parameters form a connection string for the data source. Using Dashboards, you can add new **Amazon S3** or **Prometheus** data source connections or manage existing ones.

The following steps guide you through the basics of creating a **Prometheus** data source connection:

1. From the OpenSearch Dashboards main menu, select **Management** > **Data sources** > **New data source** > **Prometheus**. 

2. Create the data source connection by entering the appropriate information into the **Configure Prometheus data source** fields. 
   
   - Under **Data source details**, enter a title and, optionally, a description for this data source.
   - Under **Prometheus data location**, enter the Prometheus URI
   - Under **Authentication details**, select an authentication method from the dropdown list. Once an authentication method is selected, the applicable fields for that method appear. You can then enter the required details. The authentication method options are:
       - **Basic authentication**: A basic username and password are used to connect to the data source.
       - **AWS Signature Version 4**: An AWS Signature Version 4 authenticating request is used to connect to the data source. AWS Signature Version 4 requires an access key and a secret key. 
         - For AWS Signature Version 4 authentication, first specify the **Region**. Next, select the OpenSearch service in the **Service Name** list. The options are **Amazon OpenSearch Service** and **Amazon OpenSearch Serverless**. Lastly, enter the **Access Key** and **Secret Key** for authorization.
   - Under **Query permissions**, choose which role is needed to search and index data from this data source. If **Restricted** is selected, additional field will become available which is used to configure the required role.

3. When you have entered all the details, select **Review Configuration** > **Connect to Prometheus** to save your settings. The connection is created. The active window returns to the **Data sources** main page, and the new connection appears in the list of data sources.

### Modifying a data source connection

To make changes to a data source connection, select a connection in the list on the **Data sources** main page. The **Connection Details** window opens.

To make changes to **Connection Details**, edit one or both of the **Title** and **Description** fields and select **Save changes** in the lower-right corner of the screen. You can also cancel changes here. To change the **Authentication Method**, choose a different authentication method, enter your credentials (if applicable), and then select **Save changes** in the lower-right corner of the screen. The changes are saved.

When **Username & Password** is the selected authentication method, you can update the password by choosing **Update stored password** next to the **Password** field. In the pop-up window, enter a new password in the first field and then enter it again in the second field to confirm. Select **Update stored password** in the pop-up window. The new password is saved. Select **Test connection** to confirm that the connection is valid.

When **AWS Signature Version 4** is the selected authentication method, you can update the credentials by selecting **Update stored AWS credential**. In the pop-up window, enter a new access key in the first field and a new secret key in the second field. Select **Update stored AWS credential** in the pop-up window. The new credentials are saved. Select **Test connection** in the upper-right corner of the screen to confirm that the connection is valid.

To delete the data source connection, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/trash-can-icon.png" class="inline-icon" alt="delete icon"/>{:/} icon.

## Creating an index pattern

Once you've created a data source connection, you can create an index pattern for the data source. An _index pattern_ is a template that OpenSearch uses to create indexes for data from the data source. See [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/) for more information and a tutorial. 
