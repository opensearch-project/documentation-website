---
layout: default
title: User behavior insights
parent: Search relevance
has_children: false
nav_order: 1
redirect_from:
  - /search-plugins/ubi/
---
# Overview
User Behavior Insights, or UBI, is a community plugin for capturing client-side events and queries for the purposes of improving search relevance and user experience.
It is a causal system, linking a user's query to all subsequent user interactions with your application until they perform another search.



* An OpenSearch [plugin](https://github.com/o19s/opensearch-ubi) that facilitates the storage of client-side events and queries.
* A client-side JavaScript library reference implementation that shows how to capture events and send those events to the OpenSearch UBI plugin.
TODO: link a client implementation
{: .warn }

| Explanation & Reference | Description
| :--------- | :------- |
| [Ubi Plugin Admin]({{site.url}}{{site.baseurl}}/search-plugins/ubi/documentation) | How to install and use the UBI Plugin |
| [Ubi Request/Response Specification](https://github.com/o19s/ubi) | Schema standard for making Ubi requests and responses  |
| [Ubi OpenSearch Schema Documentation]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas) | Documentation on the individual Query and Event stores for OpenSearch |
| [`query_id` Data Flow]({{site.url}}{{site.baseurl}}/search-plugins/ubi/query_id) | How the `query_id` ties the search to results and user events |


| Tutorials & How-to Guides | Description
| :--------- | :------- |
| [ javascript client structures ]({{site.url}}{{site.baseurl}}/search-plugins/ubi/data_structures)  | Sample javascript structures for populating the Event store |
| [Ubi Sql queries ]({{site.url}}{{site.baseurl}}/search-plugins/ubi/sql_queries)  | How to write analytic queries for Ubi data |
| [Ubi Dashboard]({{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi_dashboard_tutorial) | Teaches you how to build an OpenSearch dashboard with UBI data |
| ... | teaches how to do something |

Documentation adapted using concepts from (Diátaxis)[https://diataxis.fr/]