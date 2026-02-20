---
layout: default
title: Dev Tools
nav_order: 110
redirect_from:
  - /dashboards/run-queries/
  - /dashboards/dev-tools/run-queries/
  - /dashboards/dev-tools/index-dev/
---

# Running queries in the Dev Tools console

You can use the OpenSearch Dev Tools console to send queries to OpenSearch. 

## Navigating to the console

To open the console, select **Dev Tools** on the main OpenSearch Dashboards page:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-main.png" alt="Dev Tools console from main page">{: .img-fluid }

You can open the console from any other page by navigating to the main menu and selecting **Management** > **Dev Tools**.

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-left.png" width=200 alt="Dev Tools console from all pages">

## Writing queries

Write your queries in the editor pane on the left side of the console:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-request.png" alt="Request pane">{: .img-fluid }

You can collapse and expand parts of your query by selecting the small triangles next to the line numbers.
{: .tip}

The Dev Tools console supports all OpenSearch REST API operations, including search queries, index management, and cluster operations. You can use [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/) to build queries that:

- **Search for documents**: Use `match`, `term`, `range`, and other query types to search your data.
- **Get all results**: Use `match_all` queries to retrieve all documents from an index.
- **Count results**: Use the `_count` endpoint to get the total number of matching documents without retrieving them.
- **Aggregate data**: Use aggregations to compute metrics, statistics, and summaries of your data.
- **Filter results**: Combine queries with filters to narrow down search results.

For example, to count all documents in an index, send the following request:

```json
GET my-index/_count
```
{% include copy-curl.html %}

To retrieve all documents, send the following request:

```json
GET my-index/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

For a complete list of query types and capabilities, see [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/).

You can import or export queries by selecting **Import** or **Export** from the top menu. 

### Comments

Use `#` at the beginning of a line to write single-line comments.

### Autocomplete

OpenSearch provides autocomplete suggestions for fields, indexes and their aliases, and templates. To configure autocomplete preferences, update them in [Console Settings](#updating-the-console-settings).

## Sending the request 

To send a query to OpenSearch, select the query by placing the cursor anywhere in the query text. Then choose the play icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/play-icon.png" class="inline-icon" alt="play icon"/>{:/}) on the upper right of the request or press `Ctrl/Cmd+Enter`:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-send.png" alt="Send request">

OpenSearch displays the response in the response pane on the right side of the console:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-response.png" alt="Response pane">{: .img-fluid }

## Working in the cURL and console formats

The console uses an easier syntax to format REST requests than the `curl` command. 

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

The same query has a simpler syntax in the console format:

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

If you paste a `curl` command directly into the console, the command is automatically converted into the format the console uses. 

To import a query in cURL format, select the query, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}), and choose **Copy as cURL**:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-tools.png" alt="Console tools">

## Using triple quotation marks in queries

When writing queries containing quotation marks (`"`) and backslash (`\`) characters, you can use triple quotation marks (`"""`) to avoid escaping the characters. This format improves readability and helps avoid escape characters when writing large or complex strings, especially when working with deeply nested JSON strings. 

You can index a document containing special characters by escaping each special character with a backslash:

```json
PUT /testindex/_doc/1
{
  "test_query": "{ \"query\": { \"query_string\": { \"query\": \"host:\\\"127.0.0.1\\\"\" } } }"
}
```
{% include copy-curl.html %}

Alternatively, you can use triple quotation marks for a simpler format:

```json
PUT /testindex/_doc/1
{
  "test_query": """{ "query": { "query_string": { "query": "host:\"127.0.0.1\"" } } }"""
}
```
{% include copy-curl.html %}

Triple quotation marks are only supported in the Dev Tools console---not in `curl` or other HTTP clients. To import a query with triple quotation marks in cURL format, use **Copy as cURL**.
{: .tip}

If a response contains the `\n`, `\t`, `\`, or `"` special characters, the console formats the response using triple quotation marks. To turn off this behavior, select **Settings** from the top menu and toggle **JSON syntax**.
{: .tip}

## Viewing documentation

To view the OpenSearch documentation, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}) and choose **Open documentation**.

## Auto indenting

To use auto indent, select the queries that you want to format, select the wrench icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/wrench-icon.png" class="inline-icon" alt="wrench icon"/>{:/}), and choose **Auto indent**.

Auto indenting a collapsed query expands it.

Auto indenting a well-formatted query puts the request body on a single line. This is useful for working with [bulk APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/).
{: .tip}

## Viewing your request history

You can view up to the 500 most recent requests that OpenSearch ran successfully. To view request history, select **History** from the top menu. If you select the request you want to view from the left pane, the query is shown in the right pane. 

To copy the query into the editor pane, select the query text and then select **Apply**. 

To clear the history, select **Clear**.

## Updating the console settings

To update your preferences, select **Settings** from the top menu:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-settings.png" width=400 alt="Settings">

## Using keyboard shortcuts

To view all available keyboard shortcuts, select **Help** from the top menu.