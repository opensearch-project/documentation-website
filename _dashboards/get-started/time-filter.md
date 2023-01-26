---
layout: default
title: Setting the time filter
parent: Understanding the core concepts of OpenSearch Dashboards
nav_order: 10
---

# Setting the time filter

You can change the time range to display dashboard data over minutes, hours, days, weeks, months, or years.

The default time range is **Last 15 minutes**. You can change the time range at the dashboard level or under **Stack Management > Advanced Settings > Time filter defaults**. 
{: .note}

To change the time range at the dashboard level, perform the following steps:

1. Select the calendar icon.
1. Choose one of the following:
   - **Quick select:** Choose a time based on the last or next number of seconds, minutes, hours, days, or other time unit. 
   - **Commonly used:** Choose a common time range like **Today**, **Last 7 days**, and **Last 30 days**. 
   - **Recently used date ranges:** Select a previously used time range.
   - **Refresh every:** Set an automatic refresh period.
  
   <img src="{{site.url}}{{site.baseurl}}/images/time-range.png" alt="Time range interface" width="400"/>

1. Select **Show dates** to set start and end times, and then select inside the toolbar to access the time filter pop-up window.

   <img src="{{site.url}}{{site.baseurl}}/images/time-filter-popup.png" alt="Time filter pop-up window" width="400"/>

1. Choose **Absolute**, **Relative**, or **Now** and specify ranges.
1. Select **Update** to apply changes.

   <img src="{{site.url}}{{site.baseurl}}/images/start-end-time.png" alt="Start and end times interface" width="400"/>
