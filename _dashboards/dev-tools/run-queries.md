---
layout: default
title: Running queries in the Dev Tools console
parent: Dev Tools
nav_order: 10
redirect_from:
  - /dashboards/run-queries/
---

# Running queries in the Dev Tools console

Use the Dev Tools console to send queries to OpenSearch. To access the Dev Tools console, select **Dev Tools** under the **Management** menu on the OpenSearch Dashboards home page. An example query and response are shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-request-ui.png" alt="Console UI with query and request">

## Writing queries 

Write your queries in the editor pane on the left side of the console. To write single-line comments, use `#` at the beginning of a line to write single-line comments. To collapse or expand your query, select the expander arrow ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-down-icon.png" class="inline-icon" alt="arrow down icon"/>{:/}) next to the line number.

OpenSearch provides autocomplete suggestions for fields, indexes and their aliases, and templates. To configure autocomplete preferences, update them in [Console Settings](#updating-the-console-settings).

To learn about writing queries in OpenSearch domain-specific language (DSL), see [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl).

## Sending the request 

To send a query to OpenSearch, select the query by placing the cursor anywhere in the query text. Then choose the play icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/play-icon.png" class="inline-icon" alt="play icon"/>{:/}) on the upper right of the request or press `Ctrl/Cmd+Enter`. OpenSearch displays the response in the response pane on the right side of the console. 

## Working in the cURL and console formats

The console uses an easier syntax to format REST requests than the `curl` command. 

For example, the following `curl` command runs a search query:

````
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
````

The same query has a simpler syntax in the console format:

````
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
````

If you paste a `curl` command directly into the console, the command is automatically converted into the format the console uses. 

To import a query in cURL format, select the query, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}), and choose **Copy as cURL**.

## Auto indenting

To use auto indent, select the queries that you want to format, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}), and choose **Auto indent**.

Auto indenting a well-formatted query puts the request body on a single line. This is useful for working with [bulk APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/). Auto indenting a collapsed query expands it.

## Viewing your request history

You can view up to the 500 most recent requests that OpenSearch ran successfully. To view request history, select **History** from the top menu. If you select the request you want to view from the left pane, the query is shown in the right pane. To copy the query into the editor pane, select the query text and then select **Apply**. To clear the history, select **Clear**.

## Updating the console settings

To update your preferences, select **Settings** from the top menu.
## Using keyboard shortcuts

To view all available keyboard shortcuts, select **Help** from the top menu.

## Accessing documentation from the console

To access OpenSearch documentation from the console, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}) and choose **Open documentation**.