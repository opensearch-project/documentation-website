---
layout: default
title: Time filter
parent: Analyzing data with Discover
nav_order: 20
redirect_from:
  - /dashboards/get-started/time-filter/
canonical_url: https://docs.opensearch.org/latest/dashboards/discover/time-filter/
---

# Time filter

Use the **time filter** to set the time range of the data that is displayed in the **Dashboard** and **Discover** applications. The filter supports intervals in minutes, hours, days, weeks, months, or years.

The default time range is **Last 15 minutes**. You can change the default at [**Dashboards Management** > **Advanced Settings** > **Time filter defaults**]({{site.url}}{{site.baseurl}}/dashboards/management/advanced-settings/#general-settings), or select a time range at the application level.
{: .note}

## Selecting a time range


You can select a moving or static window as the time range at the application level.

### Selecting a moving time window

To select a moving time window, follow these steps:

1. From an OpenSearch Dashboards application (**Discover**, **Dashboards**, or **Visualize**), select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-icon.png" class="inline-icon" alt="calendar icon"/>{:/} (calendar) icon on the right of the search bar.

1. Select one of the time filter options, as shown in the following image:

   - **Quick select:** Choose a time based on the last or next number of seconds, minutes, hours, days, or another time unit.
   - **Commonly used:** Choose a common time range, for example **Today**, **Last 7 days**, or **Last 30 days**.
   - **Recently used date ranges:** Select a previously used time range.

1. Select an automatic refresh period from **Refresh every**.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/time-range.png" alt="Time range interface" width="400"/>

### Selecting a static time window

To select a static time window, follow these steps:

1. Choose **Show dates**.

1. Choose a start time:

   1. Select the currently displayed start time, as shown in the following image.

      <img src="{{site.url}}{{site.baseurl}}/images/dashboards/time-filter-popup.png" alt="Time filter pop-up window" width="400"/>

   1. Select **Absolute**, **Relative**, or **Now**.

   1. Using the selected framing, choose a start date and time.

1. Choose an end time:

   1. Select the currently displayed end time.

   1. Select **Absolute**, **Relative**, or **Now**.

   1. Using the selected framing, choose an end date and time.

1. Choose **Update** to apply changes, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/start-end-time.png" alt="Start and end times interface" width="400"/>

   The data table or visualization displayed in the application automatically updates to reflect the new time interval filter.