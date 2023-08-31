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
`timepicker:quickRanges`  | Defines the quick-select time ranges to display in the time filter.  |
`timepicker:refreshIntervalDefaults` | Defines the time filter's default refresh interval in milliseconds. Default is `0`.  |
`timepicker:timeDefaults`  | Defines the default time period to analyze data. Default is `Last 15 minutes`.  |
`truncate:maxHeight`  | Defines the maximum height of a table cell. Default is `115` pixels.

## Appearance settings
Introduced 2.10
{: .label .label-purple }

The following table describes the **Appearance** settings:

Setting | Description
:--- | :---
`accessibility:disableAnimations`  | Enables or disables animations. Default is `Off`.  |
`pageNavigation`  | Defines the navigation pane style. Default is `Modern`.  |
`theme:darkMode` | Enables or disables dark mode. Default is `Off`. Dark mode is available only in OpenSearch Dashboards version 2.10 or later. |
`theme:version`  | Defines the theme to use for the current and subsequent versions of OpenSearch Dashboards. Default is `v7`.  |

## Discover settings

The following table describes the **Discover** settings:

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

The following table describes the **Notifications** settings:

Setting | Description
:--- | :---
`notifications:banner`  | Defines the custom banner for temporary notices to users. Supports [Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).  |
`notifications:lifetime:banner`  | Defines the duration for which banner notifications are displayed. Default is `3000000` milliseconds. Set field to `Infinity` to disable notifications.  |
`notifications:lifetime:error`  | Defines the duration for which error notifications are displayed. Default is `300000` milliseconds. Set field to `Infinity` to disable notifications.  |
`notifications:lifetime:info`  | Defines the duration for which information notifications are displayed. Default is `5000` milliseconds.Set field to `Infinity` to disable notifications.  |
`notifications:lifetime:warning`  | Defines the duration for which warning notifications are displayed. Default is `10000` milliseconds.Set field to `Infinity` to disable notifications.

## Search settings

The following table describes the **Search** settings:

Setting | Description
:--- | :--- 
`courier:batchSearches`  | Enables or disables how dashboard panels load. When disabled, panels load individually, and search requests end when users navigate away or update the query. When enabled, all panels load together when all data is loaded, and searches do not end. Default is `Off`.  |
`courier:customRequestPreference`  | Enables or disables whether to use the [request preference]({{site.url}}{{site.baseurl}}//api-reference/popular-api/) when setting is set to `custom`. Default is `_local`.  |
`courier:ignoreFilterIfFieldNotInIndex`  | Enables or disables support for dashboards that contain visualizations using different indexes. When disabled, all filters are applied to all visualizations. When enabled, filters are ignored for a visualization if the visualization's index does not contain the field being filtered. Default is `Off`.  |
`courier:maxConcurrentShardRequests`  | Defines the maximum number of concurrent shard requests that can be made for `_msearch` requests sent by OpenSearch Dashboards. Set it to `0` to disable the setting and to use the default value set by OpenSearch. Default is `0`.  |
`courier:setRequestPreference`  | Defines which shards handle your search requests. Options include **Session ID**, **Custom**, and **None**. **Session ID** restricts operations to run all search requests on the same shard and reuses shard caches across requests, which can improve performance. **Custom** is used to define your own preference. Use `courier:customRequestPreference` to customize your preference value. **None** means that no preference is set. This option can provide better performance because requests can be spread across all shard copies. However, results might be inconsistent because different shards might be in different refresh states. Default is `Session ID`.  |
`search:includeFrozen`  | Enables or disables whether to include frozen indexes in search results. If enabled, frozen indexes are included in search results. Searching through frozen indexes can increase the search time. Default is `Off`.  |

## Timeline settings

The following table describes the **Timeline** settings:

Setting | Description
:--- | :--- 
`timeline:es.default_index`  | Defines the default OpenSearch index to search with the `.opensearch()` function. If this setting is not set, the `.opensearch()` function will search all indexes. Default is `_all`.  | 
`timeline:es.timefield`  | Defines the default field that contains a timestamp when using the `.opensearch()` function. If this setting is not set, the `.opensearch()` function will be used in the `@timestmap` field. Default is `@timestmap`.  |
`timeline:graphite.url`  | (Experimental) Defines the graphite host URL.  |
`timeline:max_buckets`   | Defines the maximum number of buckets that a single data source can return. Default is `2000`.  |
`timeline:min_interval`  | Defines the minimum interval to calculate when using the `auto` interval. Default is `1ms`.  |
`timeline:quandl.key`  | (Experimental) Defines your unique identifier (API key) that allows you to access Quandl's data.  |
`timeline:target_buckets`  | Defines the number of buckets that OpenSearch Dashboards attempts to use when calculating automatic intervals in visualizations. Default is `200`.  |

## Visualize settings

The following table describes the **Visualize** settings:

Setting | Description
:--- | :--- 
`visualization:colorMapping`  | Assigns colors to values within visualizations. Default is `#00A69B`.  |
`visualization:dimmingOpacity`  | Defines the opacity of chart items that are dimmed when another chart element is highlighted. The lower the value, the more the highlighted element will stand out. The value must be between `0` and `1`. Default is `0.5`.  |
`visualization:enablePluginAugmentation`  | Enables or disables access to plugin functionality through line chart visualizations. Default is `On`.  |
` line chart visualizations`  | Defines the maximum number of associated augmentations per visualization. Default is `10`. Associating more than 10 plugin resources per visualization can cause performance issues.  |
`visualization:heatmap:maxBuckets`  | Defines the maximum number of buckets that a single data source can return in a heatmap visualization. A higher number of buckets can negatively impact browser rendering performance. Default is `50`. |
`visualization:regionmap:customVectorMapMaxSize`  | Defines the maximum number of features that can be loaded from a custom vector map. Default is `1000`.  |
`visualization:regionmap:showWarnings`  | Enables or disables whether a warning is shown when terms cannot be joined to a shape on a region map. Default is `On`.  |
`visualization:tileMap:WMSdefaults`  | Defines the default [properties](https://leafletjs.com/reference.html#tilelayer-wms) for the WMS map server in coordinate maps. Default is `enabled: false`.  |
`visualization:tileMap:maxPrecision`  | Defines the maximum geohash precision that can be displayed on maps, with 7 being high, 10 being very high, and 12 being the maximum. Default is `7`.  |
`visualize:disableBucketAgg`  | Deactivates specific becket aggregations from visualizations. The setting takes a comma-separated list of bucket aggregation names, such as `significant_terms` amd `terms`.  |
`visualize:enableLabs`  | Enables or disables experimental visualizations. If enabled, you can create, view, and edit experimental visualizations. If disabled, you can only use production-ready visualizations. Default is `On`.  |
