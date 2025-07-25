---
layout: default
title: Setting the time filter
parent: Exploring data
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/dashboards/discover/time-filter/
---

# Setting the time filter

You can change the time range to display dashboard data over minutes, hours, days, weeks, months, or years.

The default time range is **Last 15 minutes**. You can change the time range at the dashboard level or under **Stack Management > Advanced Settings > Time filter defaults**. 
{: .note}

To change the time range at the dashboard level, perform the following steps:

1. From an OpenSearch Dashboards application (Discover, Dashboard, or Visualize), select the time clock or calendar icon.
2. Select one of the time filter options, as shown in the following image:
   - **Quick select:** Choose a time based on the last or next number of seconds, minutes, hours, days, or another time unit. 
   - **Commonly used:** Choose a common time range like **Today**, **Last 7 days**, or **Last 30 days**. 
   - **Recently used date ranges:** Select a previously used time range.
   - **Refresh every:** Set an automatic refresh period.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/time-range.png" alt="Time range interface" width="400"/>

3. Choose **Show dates** to set start and end times, and then select anywhere inside the toolbar to access the time filter pop-up window, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/time-filter-popup.png" alt="Time filter pop-up window" width="400"/>

4. Select **Absolute**, **Relative**, or **Now** and specify ranges.
5. Choose **Update** to apply changes, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/start-end-time.png" alt="Start and end times interface" width="400"/>
