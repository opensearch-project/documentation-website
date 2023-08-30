---
layout: default
title: Advanced settings
parent: Dashboards Management
nav_order: 40
---

# Advanced settings

Use the **Advanced settings** page to modify settings that govern OpenSearch Dashboards behavior. For example, you can use the page to enable or disable the dark mode, change the default language, change the default number of results displayed on a dashboard, or change the default time zone. See the following sections to learn more about the specific settings.

To modify settings in Advanced Settings, follow these steps:

1. Open the OpenSearch Dashboards main menu, then select **Dashboards Management** > **Advanced settings**.
2. Search for the setting you want to modify.
3. Enter a new value for the setting. 
4. Select **Save changes**.

## Required permissions

<To access Advanced settings in OpenSearch Dashboards, you must have the **Advanced settings** privilege. You can add this privilege to a role by opening the menu, selecting **Dashboards Management**, and then selecting **Roles**.><This is example text and needs to be tailored for Dashboards.>

## General settings

The following table describes the **General** settings:

Setting | Description
:--- | :---
`csv:quoteValues`  | Encloses values containing special characters or multiline values with a double quotation mark `"`. Default is `On`.  |
`csv:separator`  | Uses specific character or string to delimit exported values. Default is `,`.  |
`dateFormat`  | Defines format for displaying dates. Default is `MMM D, YYYY @ HH:mm:ss.SSS`.  |
`dateFormat:dow`  | Defines the day on which to start the week. Default is `Sunday`.  |
`dateFormat:scaled`  | Defines timestamp format. The timestamps change depending on the time between measurements (hour, minutes, seconds, and milliseconds). The keys are time periods in [ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DD`.   |
`theme:darkMode` | Sets option for light or dark mode. Default is `Off`. Dark mode is available only in OpenSearch Dashboards version 2.10 or later. |
`dateFormat:tz`  | Sets time zone for OpenSearch Dashboards. Default is the time zone detected by your browser.  |
`dateNanosFormat`  | Represents date with nanoseconds. Default is `MMM D, YYYY @ HH:mm:ss.SSSSSSSSS`.  |
`defaultIndex`  | Applies the default index to all indexes in an OpenSearch cluster unless overridden by a specific index setting. Default is `null`.  |
`defaultRoute`  | Specifies the gateway point. Use this setting to modify the landing page for OpenSearch Dashboards. The setting must be a relative URL. Default is `/app/home`. |
`fields:popularLimit` | Set the number of N fields to be displayed. Default is `10`.  |
`filterEditor:suggestValues` | Defines whether the filter editor suggests field values. Default is `Off`.  |
`filters:pinnedByDefault`  | Specifies whether filters are automatically pinned. Default is `Off.`  |
`format:bytes:defaultPattern`  | Sets the default numeral format for the bytes format. Default is `0,0.[0]b`.  |
`format:currency:defaultPattern` | Sets the default numeral format for the currency format. Default is `($0,0.[00])`.  |
`format:defaultTypeMap` | Defines the default format name for each field type using a mapping. If the field type isn't specified, `_default_` is used.  |
`format:number:defaultLocale`  | Sets the language locale for numerals. Default is `en`.  |
`format:number:defaultPattern`  | Sets the default numeral format for the number format. Default is `0,0.[000]`.  |
`format:percent:defaultPattern`  | Sets the default numeral format for the percent format. Default is `0,0.[000]%`.  |
`histogram:barTarget`  |  Defines a specified number of bars for date histograms that use the `auto` interval. Default is `50`.  |
`histogram:maxBars`  | Defines the maximum number of bars to show in date histograms. Default is `100`.  |
`history:limit` | Sets the history limit to a specified number of the most recent values. Default is `10`.  |
`indexPattern:placeholder`  | Defines the placeholder value to use when creating index patterns.  |
`metaFields` | Merges fields that are not part of the `_source` field into the document. Default is `_source`, `_id`, `_type`, `_index`, and `_score`.  |
`metrics:max_buckets` | Sets the maximum number of buckets that a single data source can return. Default is `2000`.  |




 

