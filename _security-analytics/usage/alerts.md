---
layout: default
title: Working with alerts
parent: Using Security Analytics
nav_order: 46
---

# Working with alerts

The Alerts window includes features for viewing and working with alerts. The two main features are:
* The bar graph with alert information arranged by count, date, and alert status or alert severity.
* The Alerts list arranged by time of the alert, the alert's trigger name, which detector triggered it, and other details.

You can select the **Refresh** button at any time to refresh information on the Alerts page.

---
## The Alerts graph

The Alerts graph can display alerts by their status or severity. Use the **Group by** dropdown list to specify either Alert status or Alert severity.

To specify the date range you would like the graph to display, first select the calendar dropdown arrow. The date selector window opens.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/find-date-pick.png" alt="Date selector for findings graph" width="55%">

You can use the **Quick select** settings to specify an exact window of time.
* Select either **Last** or **Next** in the first dropdown list to set the window of time behind the current setting or ahead of the current setting.
* Select a number in the second dropdown list to define a value for the range.
* Select a unit of time in the third dropdown list. Available options are seconds, minutes, hours, days, weeks, months, and years.
Select the **Apply** button to apply the range of dates to the graph. Information on the graph changes accordingly.

<img src="{{site.url}}{{site.baseurl}}/images/Security/quickset.png" alt="Quick select settings example" width="40%">

You can use the left and right arrows to move the window of time behind the current range of dates or ahead of the current range of dates. When you use these arrows, the start date and end date appear in the date range field. You can then select each one to set an absolute, relative, or current date and time. For absolute and relative changes, select the **Update** button to apply the changes.

<img src="{{site.url}}{{site.baseurl}}/images/Security/date-pick.png" alt="Altering date range" width="55%">

As an alternative, you can select an option in the **Commonly used** section (see the preceding image of the calendar dropdown list) to conveniently set a window of time. Options include date ranges such as **Today**, **Yesterday**, **this week**, and **week to date**. 

When one of the commonly used windows of time is selected, you can select the **Show dates** label in the date range field to populate the range of dates. Following that, you can select either the start date or end date to specify by an absolute, relative, or current date and time setting. For absolute and relative changes, select the **Update** button to apply the changes.

As one more alternative, you can select an option from the **Recently used date ranges** section to go back to a previous setting.

---
## The Alerts list

The Alerts list displays all findings according to the time when the alert was triggered, the alert's trigger name, the detector that triggered the alert, the alert status, and alert severity.
Use the **Alert severity** dropdown list to filter the list of alerts by severity. Use the **Status** dropdown list to filter the list by alert status.

