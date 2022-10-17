---
layout: default
title: Running queries in Console
nav_order: 110
---

# Running queries in Console

You can use the OpenSearch DevTools Console to send queries to OpenSearch. 

## Navigating to Console

To open Console, select **Dev Tools** on the main OpenSearch Dashboards page:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-main.png" alt="Dev Tools Console from main page">{: .img-fluid }

You can open Console from any other page by navigating to the main menu and selecting **Management** > **Dev Tools**.

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-left.png" width=200 alt="Dev Tools Console from all pages">

## Writing queries 

Write your queries in the editor pane on the left side of the Console:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-request.png" alt="Request pane">{: .img-fluid }

You can collapse and expand parts of your query by selecting the small triangles next to the line numbers.
{: .tip}

To learn more about writing queries in OpenSearch domain-specific language, see [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl).

### Comments

Use `#` in the beginning of a line to write single line comments.

### Autocomplete

OpenSearch provides autocomplete suggestions for fields, indexes and their aliases, and templates. To configure autocomplete preferences, update them in [Console Settings](#updating-console-settings).

## Sending the request 

To send a query to OpenSearch, select the query by placing the cursor anywhere in the query text. Then choose the triangle on the top right of the request or press `Ctrl/Cmd+Enter`:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-send.png" alt="Send request">

OpenSearch displays the response in the response pane on the right side of the Console:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-response.png" alt="Response pane">{: .img-fluid }

## Working in cURL and Console formats

Console uses an easier syntax to format REST requests than the `curl` command. 

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

The same query has a simpler syntax in Console format:

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

If you paste a `curl` command directly into the Console, the command is automatically converted into Console format. 

To import a query in cURL format, select the query, then select the wrench icon and choose **Copy as cURL**:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-tools.png" alt="Console tools">

## Viewing documentation

To view OpenSearch documentation, select the wrench icon, and choose **Open documentation**.

## Auto indenting

To use auto indent, select the queries that you want to format, select the wrench icon, and choose **Auto indent**.

Auto indenting a collapsed query expands it.

Auto indenting a well-formatted query puts the request body on a single line. This is useful for working with [bulk APIs]({{site.url}}{{site.baseurl}}/opensearch/rest-api/document-apis/bulk/).
{: .tip}

## Viewing your request history

You can view up to 500 most recent requests that OpenSearch executed successfully. To view request history, select **History** from the top menu. If you select the request you want to view from the left pane, the query is shown in the right pane. 

To copy the query into the editor pane, select the query text and then select **Apply**. 

To clear the history, select **Clear**.

## Updating Console settings

To update your preferences, select **Settings** from the top menu:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-settings.png" width=400 alt="Settings">

## Using keyboard shortcuts

To view all available keyboard shortcuts, select **Help** from the top menu.