---
layout: default
title: Running queries in the Dev Tools console
parent: Dev Tools
nav_order: 10
redirect_from:
  - /dashboards/run-queries/
---

# Running queries in the Dev Tools console

The Dev Tools console can be used to send queries to OpenSearch. To access the console, go to the OpenSearch Dashboards main menu and select **Management** > **Dev Tools**.
## Writing queries

To write your queries, use the editor pane on the left side of the console. To send a query to OpenSearch, select the query by placing the cursor anywhere in the query text and then choose the play icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/play-icon.png" class="inline-icon" alt="play icon"/>{:/}) on the upper right of the request or press `Ctrl/Cmd+Enter`. The response from OpenSearch is displayed in the response pane on the right side of the console. 

An example of the query and response panes is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-request-ui.png" alt="Console UI with query and request">

### Query options 

When writing queries using the console, there are common features that can help you write queries more efficiently and accurately. The following table describes these features and how you can use them.

Feature | Description | How to use |
--------|-------------|------------|
**Collapsing or expanding a query** | Helpful to use when you have a long query or only want to focus on a specific part of the query. | To hide or show details of your query, select the expander arrow ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="arrow down icon"/>{:/}) next to the line number. |
**OpenSearch search language** | Helpful to use when you need flexibility in writing complex queries. | To learn how to use the OpenSearch query domain-specific language (DSL), see [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl). |
**Single-line comments** | Helpful to use when you want to explain what the query does or to exclude parts of a query. | To add notes that are not interpreted by OpenSearch to your queries, use a hash (`#`) to start the single-line comment. |
**Autocomplete** | Helpful to use when for suggestions for correct syntax and keywords, avoiding typos and errors, and reducing the amount of typing you do. | To define your preferences for autocomplete suggestions, configure them in **Settings**. |
**Auto indenting** | Helpful to use to put the request body on a single line, which is useful for working with [bulk APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/). Auto indenting a collapsed query expands it. | To use auto indent, select the queries that you want to format, then select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}), and choose **Auto indent**. |
**Request history** | Helpful for displaying up to the 500 most recent requests that OpenSearch ran successfully. | To view request history, select **History** from the top menu. If you select the request you want to view from the left pane, the query is shown in the right pane. To copy the query into the editor pane, select the query text and then select **Apply**. To clear the history, select **Clear**. |
**Keyboard shortcuts** | Helpful for saving time, improving efficiency, and avoiding typos and errors. | To view all available keyboard shortcuts, select **Help** from the top menu. |
**Documentation access from the console** | Helpful for improving documentation discoverability. | To access OpenSearch documentation from the console, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}) and choose **Open documentation**. |

## Working in the cURL and console formats

The console uses a simplified syntax to format REST requests in place of the `curl` command. If you paste a `curl` command directly into the console, the command is automatically converted into the format that the console uses. To import a query in cURL format, select the query, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}), and choose **Copy as cURL**. 

For example, the following `curl` command runs a search query:

```bash
curl -XGET http://localhost:9200/shakespeare/_search?pretty -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "text_entry": "To be, or not to be"
    }
  }
}'
```
{% include copy.html %}

The same query has a simplified syntax in the console format, as shown in the following example:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "To be, or not to be"
    }
  }
}
```
{% include copy-curl.html %}
