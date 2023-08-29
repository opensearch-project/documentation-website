---
layout: default
title: Advanced settings
parent: Dashboards Management
nav_order: 40
---

# Advanced settings

The **Advanced settings** interface is where you modify settings that govern OpenSearch Dashboards behavior. For instance, you can adjust the date display format, define the default index pattern, and establish a level of precision for decimal values shown.

To modify settings in Advanced Settings, follow these steps:

1. Open the OpenSearch Dashboards main menu, then select **Dashboards Management** > **Advanced settings**.
2. Search for the setting you want to modify.
3. Enter a new value for the setting. 
4. Select **Save changes**.

## Required permissions

<To access Advanced settings in OpenSearch Dashboards, you must have the **Advanced settings** privilege. You can add this privilege to a role by opening the menu, selecting **Dashboards Management**, and then selecting **Roles**.><This is example text and needs to be tailored for Dashboards.>

## General settings

The following table describes the **General** settings:

| Setting  | Description  |
|---------|--------------|
`csv:quoteValues`  | Enclose values containing special characters or multiline values with a double quotation mark `"`. Default is `On`.  |
`csv:separator`  | Use specific character or string to delimit exported values. Default is `,`.  |
`dateFormat`  | Define format for displaying dates. Default is `MMM D, YYYY @ HH:mm:ss.SSS`.  |
`dateFormat:dow`  | Define the day on which to start the week. Default is `Sunday`.  |
`dateFormat:scaled`  | Define timestamp format. The timestamps change depending on the time between measurements (hour, minutes, seconds, and milliseconds). The keys are time periods in [ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DD`.   |
`theme:darkMode` | Set option for light or dark mode. Default is `Off`. Dark mode is available only in OpenSearch Dashboards version 2.10 or later. |
`dateFormat:tz`  | Set time zone for OpenSearch Dashboards. Default is the time zone detected by your browser.  |
`dateNanosFormat`  | Represent date with nanoseconds. Default is `MMM D, YYYY @ HH:mm:ss.SSSSSSSSS`.  |
`defaultIndex`  | Apply the default index to all indexes in an OpenSearch cluster unless overridden by a specific index setting. Default is `null`.  |
`defaultRoute`  | Specify the gateway point. Use this setting to modify the landing page for OpenSearch Dashboards. The setting must be a relative URL. Default is `/app/home`. |
`fields:popularLimit` | Display the most popular N fields at top. Default is `10`.  |
`filterEditor:suggestValues` | Configure the filter editor to provide field value suggestions. Default is `Off`.  |
`filters:pinnedByDefault`  | Specify whether filters are automatically pinned. Default is `Off.`  |
`format:bytes:defaultPattern`  | Choose the default numeral format for the bytes format. Default is `0,0.[0]b`.  |
`format:currency:defaultPattern` | Choose the default numeral format for the currency format. Default is `($0,0.[00])`.  |
`format:defaultTypeMap` | Assign the default format name for each field type using a mapping. If the field type isn't specified, `_default_` is used.  |
`format:number:defaultLocale`  | Select the language locale for numerals. Default is `en`.  |
`format:number:defaultPattern`  | Choose the default numeral format for the number format. Default is `0,0.[000]`.  |
`format:percent:defaultPattern`  | Choose the default numeral format for the percent format. Default is `0,0.[000]%`.  |
`histogram:barTarget`  |  Generate a specified number of bars when date histograms use the `auto` interval. Default is `50`.  |
`histogram:maxBars`  | Show a maximum number of bars in date histograms. Default is `100`.  |
`history:limit` | Limit history to specified number of the most recent values. Default is `10`.  |
`indexPattern:placeholder`  | Define placeholder value used in **Dashboards Management** > **Index patterns** > **Create index pattern**.  |



 

