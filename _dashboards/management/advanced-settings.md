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
`csv:quoteValues`  | Defines whether to Enclose values containing special characters or multiline values with a double quotation mark `"`. Default is `On`.  |
`csv:separator`  | Defines whether to use a specific character or string to delimit exported values. Default is `,`.  |
`dateFormat`  | Defines the format for displaying dates. Default is `MMM D, YYYY @ HH:mm:ss.SSS`.  |
`dateFormat:dow`  | Defines the day on which to start the week. Default is `Sunday`.  |
`dateFormat:scaled`  | Defines the format for timestamps. The timestamps format changes depending on the time between measurements (hour, minutes, seconds, and milliseconds). The keys are time periods in [ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DD`.   |
`dateFormat:tz`  | Defines the time zone for OpenSearch Dashboards. Default is the time zone detected by your browser.  |
`dateNanosFormat`  | Defines the format for representing dates with nanoseconds. Default is `MMM D, YYYY @ HH:mm:ss.SSSSSSSSS`.  |
`defaultIndex`  | Defines the default index for all indexes in an OpenSearch cluster. Default is `null`.  |
`defaultRoute`  | Defines the gateway point. Use this setting to change the landing page for OpenSearch Dashboards. The setting must be a relative URL. Default is `/app/home`. |
`fields:popularLimit` | Defines the number of N fields to be displayed. Default is `10`.  |
`filterEditor:suggestValues` | Defines whether the filter editor suggests field values. Default is `Off`.  |
`filters:pinnedByDefault`  | Defines whether filters are automatically pinned. Default is `Off.`  |
`format:bytes:defaultPattern`  | Defines the default numeral format for the bytes format. Default is `0,0.[0]b`.  |
`format:currency:defaultPattern` | Defines the default numeral format for the currency format. Default is `($0,0.[00])`.  |
`format:defaultTypeMap` | Defines the default format name for each field type using a mapping. If the field type isn't specified, `_default_` is used.  |
`format:number:defaultLocale`  | Defines the language locale for numerals. Default is `en`.  |
`format:number:defaultPattern`  | Defines the default numeral format for the number format. Default is `0,0.[000]`.  |
`format:percent:defaultPattern`  | Defines the default numeral format for the percent format. Default is `0,0.[000]%`.  |
`histogram:barTarget`  |  Defines a specified number of bars for date histograms that use the `auto` interval. Default is `50`.  |
`histogram:maxBars`  | Defines the maximum number of bars to show in date histograms. Default is `100`.  |
`history:limit` | Defines how many of the most recent values to store in the history. Default is `10`.  |
`indexPattern:placeholder`  | Defines the placeholder value to use when creating index patterns.  |
`metaFields` | Enables fields that are not part of the `_source` field to be merged into the document. Default is `_source`, `_id`, `_type`, `_index`, and `_score`.  |
`metrics:max_buckets` | Defines the maximum number of buckets that a single data source can return. Default is `2000`.  |
`pageNavigation`  | Defines the navigation pane style. Default is `Modern`.  |
`query:allowLeadingWildcards`  | Defines whether `*` is allowed as the first character in a query clause. Default is `On`.  | 
`query:queryString:options`  |  Defines the options for the Lucene query string parser. Default is `true`.  |
`reporting:useFOR`  | Enables or disables `ForeignObject` rendering for embedding of external content into reports. Default is `On`.  |
`reporting:useOcr`  | Enables or disables optical character recognition (OCR) to be run on PRF reports. Default is `Off`.  |
`savedObjects:listingLimit`  | Defines the number of objects to fetch when viewing a listing page. Default is `1000`.  |
`savedObjects:perPage`  | Defines the number of objects to display on each page of the load dialog. Default is `20`.  |
 `search:queryLanguage`  | Defines the query language for OpenSearch Dashboards. Default is `DQL`.  |
 `shortDots:enable`  | Enables or disables the shortening of long fields. Default is `Off`.  |
 `sort:options`  | Defines the options for the sort parameter. Default is `boolean`.  |
 `state:storeInSessionStorage`  | Enables or disables the storing of URLs. Default is `Off`.  |
 `theme:darkMode` | Enables or disables dark mode. Default is `Off`. Dark mode is available only in OpenSearch Dashboards version 2.10 or later. |
 `timepicker:quickRanges`  | Defines the quick-select time ranges to display in the time filter.  |
`timepicker:refreshIntervalDefaults` | Defines the time filter's default refresh interval in milliseconds. Default is `0`.  |
`timepicker:timeDefaults`  | Defines the default time period to analyze data. Default is `Last 15 minutes`.  |
`truncate:maxHeight`  | Defines the maximum height of a table cell. Default is `115` pixels.

## Accessibility settings

The following table describes the **Accessibility** settings:

Setting | Description
:--- | :---
`accessibility:disableAnimations`  | Enables or disables animations. Default is `Off`.  |

## Discover settings

The following table describes settings for the **Discover** application:

Setting | Description
:--- | :---
`context:defaultSize`  | Defines the number of surrounding entries to show in the context view. Default is `5`.  |
`context:step`  | Defines the number by which to increment or decrement the context size. Default is `5`.  |
`context:tieBreakerFields`  | Defines the fields that are used to break a tie between document that have the same timestamp value. The first field that is present and sortable in the current index pattern is used. Default is `_doc`.  |
`defaultColumns`  | Defines the columns that appear by default on the **Discover** page. Default is `_source`.  |
`discover:aggs:terms:size`  | Defines the number of terms that are visualized when selecting the **Visualize** button in the field drop down. Default is `20`.  |
`discover:modifyColumnsOnSwitch`  | Defines whether unavailable columns are removed from a new index pattern. Default is `On`.  |
`discover:sampleSize`  | Defines the number of rows to show in a table. Default is `20`.  |
`discover:searchOnPageLoad`  | Defines whether a search is run when **Discover** first loads. The settings does not affect loading a saved search. Default is `On`.  |
`discover:sort:defaultOrder`  | Defines how to sort time-based index patterns. Default is `Descending`.  |
`doc_table:hideTimeColumn`  | Defines whether to hide the `Time` column in the **Discover** application and in all saved searches on dashboards. Default is `Off`.  |
`doc_table:highlight`  | Defines whether to highlight results in the **Discover** application and saved searches on dashboards. Highlighting can make it easier to find and identify results, but it can also slow down requests when working with big documents.  |

## Notifications settings

The following table describes settings for the **Notifications** application:

Setting | Description
:--- | :---


 

