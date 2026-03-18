---
layout: default
title: Search bar
parent: Analyzing data with Discover
nav_order: 10
redirect_from: 
  - /dashboards/#discover-and-dashboard-search-bar
---

## Search bar

In the **search bar** in the [Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) and [Dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/) apps, you can search data using either of two languages:

- [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/discover/dql/): A basic query language with nested field queries.

- [Query string query language (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/): A query language based on the [Apache Lucene](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html) query language. _Query string query language_ and _Lucene_ are used interchangeably in the documentation and UI. Query string query language is more flexible than DQL, but does not support nesting.

The following table compares DQL and query string query language features.

Both DQL and query string query language | DQL | Query string query language
:--- | :--- | :---
- Wildcard expressions (DQL supports `*` only)<br> - Ranges<br> - Boolean operations<br> | - Querying nested fields | - Regular expressions<br> - Fuzziness<br> - Proximity queries<br> - Boosting

For a detailed comparison, see [DQL and query string query quick reference]({{site.url}}{{site.baseurl}}/dashboards/dql/#dql-and-query-string-query-quick-reference). 

By default, the query language in the Discover search toolbar is DQL. To switch to query string syntax, select **DQL** and then turn off **OpenSearch Dashboards Query Language**. The query language changes to `Lucene`, as shown in the following image.

![Using query string syntax in OpenSearch Dashboards Discover]({{site.url}}{{site.baseurl}}/images/discover-lucene-syntax.png)
