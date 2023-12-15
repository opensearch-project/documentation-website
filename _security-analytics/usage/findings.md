---
layout: default
title: Working with findings
parent: Using Security Analytics
nav_order: 35
---

# Working with findings

The **Findings** window includes features for viewing and working with findings. The two main features are:
* The bar graph with findings information arranged by count, date, and log type or rule severity.
* The **Findings** list arranged by time, finding ID, rule name, and other details.

You can choose **Refresh** at any time to refresh information on the **Findings** page.

---
## The Findings graph

The findings graph can display findings by log type or rule severity. Use the **Group by** dropdown list to specify either log type or rule severity.

To specify the date range you would like the graph to display, first select the calendar dropdown list. The date selector window opens.

<img src="{{site.url}}{{site.baseurl}}/images/Security/find-date-pick.png" alt="Date selector for findings graph" width="55%">

You can use the **Quick select** settings to specify an exact window of time.
* Select either **Last** or **Next** in the first dropdown list to set the window of time behind the current setting or ahead of the current setting.
* Select a number in the second dropdown list to define a value for the range.
* Select a unit of time in the third dropdown list. Available options are seconds, minutes, hours, days, weeks, months, and years.
Choose **Apply** to apply the range of dates to the graph. Information on the graph changes accordingly, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/Security/quickset.png" alt="Quick select settings example" width="40%">

You can use the left and right arrows to move the window of time behind the current range of dates or ahead of the current range of dates. When you use these arrows, the start and end dates appear in the date range field. You can then select each one to set an absolute, relative, or current date and time. For absolute and relative changes, choose **Update** to apply the changes.

<img src="{{site.url}}{{site.baseurl}}/images/Security/date-pick.png" alt="Altering date range" width="55%">

As an alternative, you can select an option in the **Commonly used** section (see the preceding image of the calendar dropdown list) to conveniently set a window of time. Options include date ranges such as **Today**, **Yesterday**, **this week**, and **week to date**. 

When one of the commonly used windows of time is selected, you can choose **Show dates** in the date range field to populate the range of dates. Following that, you can select either the start date or end date to specify an absolute, relative, or current date and time setting. For absolute and relative changes, choose **Update** to apply the changes.

As one more alternative, you can select an option from the **Recently used date ranges** section to go back to a previous setting.

---
## The Findings list

The **Findings** list displays all findings according to the time of the finding, the finding ID, the rule name that generated the finding, the detector that captured the finding, and other details, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/Security/finding-list.png" alt="A list of all findings" width="85%">

Use the **Rule severity** dropdown list to filter the list of findings by severity. Use the **log type** dropdown list to filter the list by log type.

The **Actions** column includes two options for each finding:
* The diagonal arrow provides a way to open the [**Finding details**](#finding-details) pane, which describes the finding according to parameters defined when creating the detector and includes the document that generated the finding.
* The bell icon allows you to open the **Create detector alert trigger** pane, where you can quickly set up an alert for the specific finding and modify rules and their conditions as required.
For information about setting up alerts, see [Step 2. Set up alerts]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/#step-2-set-up-alerts) in the detector creation documentation.

### Finding details

Each finding in the list also includes a **Finding ID**. In addition to using the diagonal arrow in **Actions**, you can select the ID to open the **Finding details** pane. An example of **Finding details** is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/Security/findings1.png" alt="Finding details pane" width="60%">

#### Viewing surrounding documents

The **Finding details** pane contains specific information about the finding, including the document that generated the finding. To investigate the series of events that led to the finding or followed the finding, you can select **View surrounding documents** to open the document in the **Discover** panel and view other documents preceding or following it.

1. Open **Finding details** by selecting the **Finding ID** in the **Findings** list.
1. In the **Documents** section, select **View surrounding documents**. If an index pattern already exists for the document, the **Discover** panel opens and displays the document. If an index pattern does not exist, the **Create index pattern to view documents** window opens and prompts you to create an index pattern, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/Security/findings2.png" alt="popup window prompting users to create an index pattern" width="60%">

1. In the **Create index pattern to view documents** window, the index pattern name is automatically populated. Enter the appropriate time field from the log index used to determine the timing for log events. Choose **Create index pattern**. The **Create index pattern to view documents** confirmation window opens.
1. Select **View surrounding documents** in the confirmation window. The **Discover** panel opens, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/Security/findings4.png" alt="Discover panel with surrounding documents" width="85%">
    
The **Discover** panel displays the document that generated the finding with a highlighted background. Other documents that came either before or after the event are also displayed.

For details about working with **Discover** in OpenSearch Dashboards, see [Exploring data]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).

#### Viewing correlated findings

To see how the finding is correlated with other findings, select the **Correlations** tab. Correlations are relationships between findings that express a particular threat scenario involving multiple log types. Information in the **Correlated findings** table shows the time at which a correlated finding was generated, a finding's ID, the log type used to generate the finding, its threat severity, and the correlation score---a measure of its proximity to the reference finding---as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/Security/corr-details-findings.png" alt="A table of correlated findings with respect to the reference finding" width="60%">

You can select **View correlations graph** to visualize correlations between the findings. For more information about using the correlation graph, see [Working with the correlation graph]({{site.url}}{{site.baseurl}}/security-analytics/usage/correlation-graph/).
