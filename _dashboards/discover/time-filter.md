---
layout: default
title: Time filter
parent: Exploring data with Discover
grand_parent: Exploring data
nav_order: 10
redirect_from:
  - /dashboards/get-started/time-filter/
---

# Using the time filter

The time filter is located at the top of the **Dashboard**, **Discover**, and **Visualize** applications.

Use the time filter to select the time interval for the data that is displayed in the applications. The filter supports intervals in seconds, minutes, hours, days, weeks, months, or years.

This page uses the terms _time range_ and _time interval_ interchangeably to refer generically to a filter interval, no matter what the magnitude, from seconds to years. _Time_ or _time value_ refers to the endpoint of a relative time interval in seconds, minutes, or hours, as distinct from date values in days, weeks, months, or years.
{: .note}

You can select a _relative_ time interval (a fixed window of time relative to _now_), or an _absolute_ time interval (between two fixed times). A _refresh interval_ determines how often a relative time interval refreshes. The refresh interval is configurable, and defaults to one second (1 s). Absolute time intervals are unaffected by the refresh interval.

While most applications (data logs, for example), deal with past dates and times, relative and absolute time intervals can encompass both past and future dates and times. For example, a relative time interval could be set to span _now_ to 24 hours in the future.

The default time range is a relative interval of **Last 15 minutes**. You can change the default at [**Dashboards Management** > **Advanced Settings** > **Time filter defaults**]({{site.url}}{{site.baseurl}}/dashboards/management/advanced-settings/#general-settings), or select a time range at the application level as described in [Selecting a time range](#selecting-a-time-range).
{: .note}

## Navigating the time filter

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/time-filter-callouts.png" alt="Time filter interface">

The following components make up the time filter.

- The _shortcut selector_ (A) opens a dialog from which you can select a relative time interval or a recently used time interval, and set the time refresh interval.
- The _time range display_ (B) shows the selected time range in absolute (for example, _Mar 22, 2024 @12:00:01.000 → now_) or relative (for example, _Last 2 years_) terms.
- The **Show dates** link (C) forces the _time range display_ to show the time interval in _from → to_ format.
- The **Refresh** button (D) updates the data displayed in the application based on new filter or query values. **Refresh** updates query and data filters as well as the time filter.


## Selecting a time range

You can select a [relative](#selecting-a-relative-time-interval) or [absolute](#selecting-an-absolute-time-interval) interval as the time range at the application level. Or, you can select a relative or absolute interval using the [shortcut selector](#using-the-time-interval-shortcuts).


### Selecting an absolute time interval

To select an absolute time interval, follow these steps:

1. If necessary to display the interval in **from → to** form, select  **Show dates**.

1. Select the displayed start time.

1. In In the time selection popover, choose the **Absolute** tab as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/absolute-time-filter.png" width="56%" alt="Absolute time filter"/>

1. Use the calendar and time scroll tools to choose a start time, or edit the start time in the **Start date** text box.

1. Select the displayed end time.

1. In the time selection popover, choose the **Absolute** tab.

1. Use the calendar and time scroll tools to choose an end date and time, or edit the end date and time in the **End date** text box.

1. Choose the **Update** button to apply changes.

   The data tables and visualizations displayed in the application automatically updates to reflect the new time interval filter.


### Selecting a relative time interval

To select a relative time interval, follow these steps:

1. If necessary to display the interval in **from → to** form, select  **Show dates**.

1. Select the displayed start time.

1. In In the time selection popover, choose the **Relative** tab as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/relative-time-filter.png" width="56%" alt="Relative time filter"/>

1. In the number combo box, select or enter the interval quantity.

1. In the interval dropdown, select the past (**ago**) or future (**from now**) start of the relative interval.

   You can choose **Now** as the start time. In this case, the relative end time must be in the future (**from now**).
   {: .note}

1. (Optional) Activate the **Round to** toggle. This rounds the start time to the beginning of the specified interval rather than calculating it as an offset from the exact time on the system clock.

1. Select the displayed end time.

1. Do one of the following:

   Many, perhaps most, applications require a relative interval ending at the present. In this case, do the immediately following instructions.

   1. Select the **Now** tab.

   1. In the **Now** popover, select **Set end date and time to now**.

   If your application requires a relative end time that is not **now**, do the following:

   1. In In the time selection popover, choose the **Relative** tab.

   1. In the number combo box, select or enter the interval quantity.

   1. In the interval dropdown, select the past (**ago**) or future (**from now**) start of the relative interval.

      The end time must be after the start time. The interval displays in red if the interval is illegal.
      {: .note}

   1. (Optional) Activate the **Round to ...** toggle. This rounds the start time to the beginning of the specified interval rather than calculating it from the exact time on the system clock.

1. Choose the **Update** button to apply changes.

   The application updates the data in data tables and visualizations to reflect the new time interval filter.


### Using the time interval shortcuts

To select a time interval from common or previous interval values, follow these steps:

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-icon.png" class="inline-icon" alt="calendar icon"/>{:/} (calendar) or {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/clock-icon.png" class="inline-icon" alt="clock icon"/>{:/} (clock) icon on the right of the search bar.

1. From the shortcut popover, select one of the time filter options, as shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/time-range.png" alt="Time range interface" width="59%"/>

   - **Quick select**: Choose an interval spanning _now_ to a past (**Last**) or future (**Next**) time.

      1. In the **Last/Next** dropdown, select **Last** (past) or **Next** (future).

      1. In the number combo box, select or enter the interval quantity.

      1. In the interval dropdown, select the units for the relative interval.

      1. Choose **Apply**.

   - **Commonly used**: Choose a common time range, for example **Today**, **Last 7 days**, or **Last 30 days**.

   - **Recently used date ranges**: Select a previously used time range. The time range can be relative or absolute.

- (Optional) Change the refresh interval:

   1. In the **Refresh every** panel, select or enter the interval quantity in the number combo box.

   1. In the interval dropdown, select the interval unit (**seconds**, **minutes**, or **hours**).

   1. Select **Refresh**.

## Starting and stopping data refresh

To start or stop the time interval refresh, follow these steps:

1. From an OpenSearch Dashboards application (**Discover**, **Dashboards**, or **Visualize**), select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-icon.png" class="inline-icon" alt="calendar icon"/>{:/} (calendar) or {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/clock-icon.png" class="inline-icon" alt="clock icon"/>{:/} (clock) icon on the right of the search bar.

1. In the **Refresh every** panel, select **Start** or **Stop**.

   - If the time interval is relative:

      - Starting data refresh causes the data selection to be updated approximately every _refresh interval_.
      - Stopping data refresh "freezes" the selection interval until data refresh is restarted.

   - If the time interval is absolute, then starting or stopping data refresh has no effect on the data selection.

1. Select **Refresh**.

   The shortcut selector shows the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-icon.png" class="inline-icon" alt="calendar icon"/>{:/} (calendar) icon if the time interval refresh is stopped, or the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/clock-icon.png" class="inline-icon" alt="clock icon"/>{:/} (clock) icon if the time interval refresh is running.
   {: .note}
