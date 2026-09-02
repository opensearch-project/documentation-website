---
layout: default
title: Managing indexes
nav_order: 10
has_children: false
nav_exclude: true
permalink: /im-plugin/
redirect_from:
  - /opensearch/index-data/
  - /opensearch/rest-api/index-apis/index/
  - /im-plugin/index/
---

# Managing indexes

Indexes are the data structure at the heart of OpenSearch. If you're unfamiliar with OpenSearch data structures, see [Introduction to OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/intro/).

This section describes how to use the features of the Index plugin to manage indexes. The topics are organized in a manner roughly similar to their organization in the OpenSearch [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/).

Although the documentation roughly follows the API, most functionality is available in OpenSearch Dashboards, a web-based interface. In general, the API provides more fine-grained control and more options, but requires you to understand and write JSON-based queries. The OpenSearch Dashboards interface is more convenient, but in some cases is less flexible.

Index management does not include _[indexing]({{site.url}}{{site.baseurl}}/getting-started/index-data/)_, the process of populating indexes with data. It also does not include other data operations such as updating and querying documents.
{: .note}

## Index management concepts

The following table provides links to conceptual information about index management.

To learn more about | Go to
:-- | :--
Index operations | [Index operations]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/index/)
Index state management | [Index state management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/)
Index management concepts | Concepts: [Index management]({{site.url}}{{site.baseurl}}/getting-started/concepts/#index-management)

## Index management in OpenSearch Dashboards

The following table provides links to information about using OpenSearch Dashboards to manage indexes.

To learn more about | Go to
:-- | :--
The OpenSearch Dashboards index management interface | [Index Management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/)
Core index operations: View, Create, Delete, Open, and Close indexes | [Core index operations in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/)
Index management operations: Refresh, Flush, Clear cache, Force merge, Shrink, Split | [Managing indexes in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-manage/)
Index state management (ISM) | [Index state management with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/ism/dash-ism/)
Adding data to indexes (_not an index management function_) | [Indexing documents]({{site.url}}{{site.baseurl}}/getting-started/communicate/#indexing-documents)
Index aliases: View, Create, Edit, Delete, Refresh, Flush, Clear cache, Rollover, and Force merge aliases | [Managing aliases with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/)
Index data streams: View, Create, Delete, Rollover, Refresh, Flush, and Clear cache of data streams | [Working with data streams with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/)


## Index management using APIs

The following table provides links to information about using OpenSearch APIs to manage indexes.

To learn more about | Go to
:-- | :--
The OpenSearch index APIs | [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/)
Core index operations such as creating, opening, and closing indexes | [Core index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/core-index-apis/)
Index management operations, including rollovers, transforms, and reindexing | [Index operation APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-operation-apis/)
Index state management (ISM) | [Index state management with the API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api-ism/)
Adding data to indexes (indexing — _not an index management function_) | [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/)
Index aliases: List, Add, Remove, Create, Update, Delete, and Check for aliases | [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/)
Index alias examples | [Using the Aliases API]({{site.url}}{{site.baseurl}}/im-plugin/aliases/api-aliases/)
Index data streams: List, Add, Remove, Create, Update, Delete, and Check for aliases | [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/)
Index data stream examples | [Using the Aliases API]({{site.url}}{{site.baseurl}}/im-plugin/aliases/api-aliases/)


## Other index features

The following table provides links to information about other features that support index management.

To learn more about | Go to
:-| :--
Index codecs | [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-other/index-codecs/)
Index context | [Index context]({{site.url}}{{site.baseurl}}/im-plugin/index-other/index-context/)
Index sorting | [Index sorting]({{site.url}}{{site.baseurl}}/im-plugin/index-other/index-sorting/)
Refreshing the search analyzer | [Refresh search analyzer]({{site.url}}{{site.baseurl}}/im-plugin/index-other/refresh-analyzer/)
Index security | [Index management security]({{site.url}}{{site.baseurl}}/im-plugin/index-other/security/)
Document similarity | [Similarity]({{site.url}}{{site.baseurl}}/im-plugin/index-other/similarity/)


## Next steps

For instructions on how to add data to indexes, see [Ingest your data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/).

For information about the various ways to query data, including using Query DSL, SQL, or web-based graphical tools, see [Exploring Data]({{site.url}}{{site.baseurl}}/dashboards/#exploring-data).

For an introduction to the index management interface in OpenSearch Dashboards, see [Index Management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/).
