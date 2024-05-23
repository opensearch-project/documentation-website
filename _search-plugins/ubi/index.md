---
layout: default
title: User behavior insights
has_children: true
nav_order: 90
redirect_from:
  - /search-plugins/ubi/
---
# Overview

**Introduced 2.15**
{: .label .label-purple }

**References UBI Draft Specification X.Y.Z**
{: .label .label-purple }

User Behavior Insights, or UBI, is a community plugin for capturing client-side events and queries for the purposes of improving search relevance and user experience.
It is a causal system, linking a user's query to all subsequent user interactions with your application until they perform another search.


* An machine readable [schema](https://github.com/o19s/ubi) that faciliates interoperablity of the UBI specification.
* An OpenSearch [plugin](https://github.com/o19s/opensearch-ubi) that facilitates the storage of client-side events and queries.
* A client-side JavaScript library reference implementation that shows how to capture events and send those events to the OpenSearch UBI plugin.

TODO: link a client implementation [here](#TODO-clients-link)
{: .warn }

<!-- vale off -->

| Explanation & Reference | Description
| :--------- | :------- |
| [UBI Request/Response Specification](https://github.com/o19s/ubi/) **References UBI Draft Specification X.Y.Z**  | Schema standard for making UBI requests and responses  |
| [UBI OpenSearch Schema Documentation]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/) | Documentation on the individual Query and Event stores for OpenSearch |
| [`query_id` Data Flow]({{site.url}}{{site.baseurl}}/search-plugins/ubi/query_id/) | How the `query_id` ties the search to results and user events |


| Tutorials & How-to Guides | Description
| :--------- | :------- |
| [UBI Plugin Admin]({{site.url}}{{site.baseurl}}/search-plugins/ubi/documentation/) | How to install and use the UBI Plugin |
| [ JavaScript client structures ]({{site.url}}{{site.baseurl}}/search-plugins/ubi/data-structures/)  | Sample JavaScript structures for populating the Event store |
| [UBI SQL queries ]({{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/)  | How to write analytic queries for UBI data in SQL |
| [UBI Dashboard]({{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-dashboard-tutorial/) | Teaches you how to build an OpenSearch dashboard with UBI data |
| ... | teaches how to do something |

<!-- vale on -->

Documentation adapted using concepts from [Diátaxis](https://diataxis.fr/)
{: .tip }
