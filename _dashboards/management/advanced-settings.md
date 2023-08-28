---
layout: default
title: Advanced Settings
parent: Dashboards Management
nav_order: 40
---

# Advanced Settings

The **Advanced Settings** interface is where you modify settings that govern OpenSearch Dashboards behavior. For instance, you can adjust the date display format, define the default index pattern, and establish a level of precision for decimal values shown.

To modify settings in Advanced Settings, follow these steps:

1. Open the OpenSearch Dashboards main menu, then select **Dashboards Management** > **Advanced Settings**.
2. Search for the setting you want to modify.
3. Enter a new value for the setting. 
4. Select **Save changes**.

## Required permissions

<To access Advanced Settings in OpenSearch Dashboards, you must have the **Advanced Settings** privilege. You can add this privilege to a role by opening the menu, selecting **Dashboards Management**, and then selecting **Roles**.><This is example text and needs to be tailored for Dashboards.>

## General settings

The following table describes the **General** settings:

Setting  | Description  |
---------|--------------|
`csv:quoteValues`  |  The quote characters that are used to enclose values that contain special characters or multiline values. Default quote character is `"`.  |
`csv:separator`  | A character or string that is used to separate Default is `,`.  |
`dateFormat`  | The format used to display dates. Default is `MMM D, YYYY @ HH:mm:ss.SSS`.  |
`dateFormat:dow`  | The day on which to start the week. Default is `Sunday`.  |
`dateFormat:scaled`  | A set of values that define the format of timestamps. The timestamps change depending on the time between measurements (hour, minutes, seconds, and milliseconds). The keys are time periods in [ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DD`.   |
`theme:darkMode` | A feature available in OpenSearch Dashboards version 2.10 or later that reduces eye strain and improves readability. Default is `Off`.  |
`dateFormat:tz`  | The time zone that set for OpenSearch Dashboards. Default is the time zone detected by your browser.  |
`dateNanosFormat`  | The date represented with nanoseconds. Default is `MMM D, YYYY @ HH:mm:ss.SSSSSSSSS`.  |
`defaultIndex`  | The default index applied to all indexes in an OpenSearch cluster unless overridden by a specific index setting. Default is `null`.  |
`defaultRoute`  | The setting that specifies the point to a gateway. You can use this setting to modify the landing page for OpenSearch Dashboards. The setting must be a relative URL.  |
 

