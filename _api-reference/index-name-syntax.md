---
layout: default
title: Index name syntax
nav_order: 155
---

# Index name syntax

Many OpenSearch REST APIs accept one or more index names in the request path. You can target several indexes in one request, select indexes by date using date math, and prevent requests from specifying indexes in the request body.

## Targeting multiple indexes

Most APIs that accept an index name in the path can run on several indexes at once. Specify the target indexes in one of the following ways:

- A comma-separated list of names, for example, `app-logs-2026.10.12,app-logs-2026.10.13`.
- A wildcard pattern, for example, `app-logs-*` or `*-logs-*`.
- `_all` or `*` to target all indexes.
- An exclusion, which removes indexes from the preceding patterns. Prefix the name or pattern with `-`, for example, `app-logs-*,-app-logs-2026.10.11`. An exclusion must follow at least one inclusive name or pattern. A path containing only `-app-logs-2026.10.11` is interpreted as the literal index name `-app-logs-2026.10.11`.

The following request counts the documents in all `app-logs-` indexes created in 2026, except `app-logs-2026.10.11`:

```json
GET /app-logs-2026*,-app-logs-2026.10.11/_count
```
{% include copy-curl.html %}

APIs that operate on a single document or a single index, such as the [Index Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/), do not accept multiple indexes. A comma-separated list in the path of these APIs is rejected as an invalid index name.

APIs that support multiple indexes accept the following query parameters, which control how OpenSearch resolves the target indexes. The default values depend on the API.

Parameter | Data type | Description
:--- | :--- | :---
`ignore_unavailable` | Boolean | If `true`, OpenSearch ignores missing or closed indexes listed by name. If `false`, a request that names a missing or closed index fails.
`allow_no_indices` | Boolean | If `true`, the request succeeds when a wildcard pattern, an alias, or `_all` matches no indexes. If `false`, the request fails. For example, with the default `true`, a Count API request for `nomatch-*` returns a count of `0`.
`expand_wildcards` | String | The types of indexes that wildcard patterns can match. Accepts a comma-separated list of the following values:<br> - `open`: Open indexes. <br> - `closed`: Closed indexes. <br> - `hidden`: Hidden indexes, which have the [`index.hidden`]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/) setting enabled. Must be combined with `open`, `closed`, or both. <br> - `all`: All indexes, including hidden indexes. <br> - `none`: No indexes. Wildcard patterns are not expanded.<br><br>For most APIs, the default is `open`, so wildcard patterns do not match hidden indexes, such as indexes whose names start with `.`. Specify `expand_wildcards=open,hidden` to include them.

## Date math in index names

If you create one index per day or month for time-series data, you can use date math in the request path to select indexes by their date. For example, a request can target only this month's and last month's sales indexes without your client calculating their names, and OpenSearch reads only those indexes. Most APIs that accept an index name in the path support date math. For example, you can use date math to name the indexes created by a rollover. For more information, see [Using date math with index rollovers]({{site.url}}{{site.baseurl}}/api-reference/index-apis/rollover/#using-date-math-with-index-rollovers).

A date math index name has the following format:

```
<static_name{date_math_expression{date_format|time_zone}}>
```

The following table describes the components of a date math index name.

Component | Description
:--- | :---
`static_name` | The fixed part of the name, for example, `app-logs-`.
`date_math_expression` | An expression that calculates a date relative to `now`, for example, `now/d` (today rounded down to the start of the day) or `now/d-1d` (yesterday). For the expression syntax, see [Date math]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/#date-math).
`date_format` | Optional. The format in which the calculated date is written into the index name. Default is `yyyy.MM.dd`. Format patterns are case sensitive: `MM` is the month and `mm` is the minute, while `HH` is the hour on a 24-hour clock and `hh` is the hour on a 12-hour clock. For more information, see [Custom formats]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/#custom-formats).
`time_zone` | Optional. The time zone used to calculate the date, as an offset, such as `+12:00`, or an ID, such as `America/Los_Angeles`. Default is UTC.

The entire expression must be enclosed in angle brackets. To use `{` or `}` in the static part of the name, escape the character using a backslash (`\`).

The following table shows how expressions resolve if the current time is 18:00 UTC on October 13, 2026.

Expression | Resolves to
:--- | :---
`<app-logs-{now/d}>` | `app-logs-2026.10.13`
`<app-logs-{now/d-1d}>` | `app-logs-2026.10.12`
`<app-logs-{now/w}>` | `app-logs-2026.10.12` (weeks start on Monday)
`<app-logs-{now-1h/h{yyyy.MM.dd.HH}}>` | `app-logs-2026.10.13.17`
`<app-logs-{now/d{yyyy.MM.dd\|Asia/Tokyo}}>` | `app-logs-2026.10.14`
`<sales-{now/M{yyyy-MM}}>` | `sales-2026-10`
`<app\{prod\}-{now/M}>` | `app{prod}-2026.10.01`

OpenSearch resolves date math using the Gregorian calendar, regardless of the locale.

In a request URL, you must percent-encode the special characters in a date math expression. OpenSearch rejects a URL that contains these characters without encoding. The following table lists the encoded value of each character.

Character | Encoded value
:--- | :---
`<` | `%3C`
`>` | `%3E`
`/` | `%2F`
`{` | `%7B`
`}` | `%7D`
`\|` | `%7C`
`+` | `%2B`
`:` | `%3A`
`,` | `%2C`

The following request calculates the total `west` region sales from the monthly `sales-` indexes for the current and previous months. Before encoding, the index part of the path is `<sales-{now/M-1M{yyyy-MM}}>,<sales-{now/M{yyyy-MM}}>`:

```json
GET /%3Csales-%7Bnow%2FM-1M%7Byyyy-MM%7D%7D%3E%2C%3Csales-%7Bnow%2FM%7Byyyy-MM%7D%7D%3E/_search
{
  "size": 0,
  "query": {
    "term": {
      "region": "west"
    }
  },
  "aggs": {
    "total_sales": {
      "sum": {
        "field": "amount"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Restricting indexes in request bodies

The Bulk, Multi-get, and Multi-search APIs let each item in the request body specify its own target index, overriding the index in the request path. If you control access to indexes based on the request URL, for example, using a proxy, a user could bypass that control by naming a different index in the request body.

To prevent this, set `rest.action.multi.allow_explicit_index` to `false` in `opensearch.yml` on each node. This is a static setting, so you must restart the node for it to take effect. Default is `true`. When the setting is `false`, these APIs reject any request whose body specifies an index, even if it matches the index in the path. Specify the target index in the request path:

```json
POST /orders/_bulk
{ "index": {} }
{ "product": "Trail running shoes" }
```
{% include copy-curl.html %}

## Related documentation

- [Common REST parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/)
- [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/)
- [Cron expressions]({{site.url}}{{site.baseurl}}/api-reference/cron-expressions/)
