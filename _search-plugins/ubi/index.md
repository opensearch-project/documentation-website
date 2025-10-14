---
layout: default
title: User Behavior Insights
has_children: true
nav_order: 90
redirect_from:
  - /search-plugins/ubi/
canonical_url: https://docs.opensearch.org/latest/search-plugins/ubi/index/
---
# User Behavior Insights

**Introduced 2.15**
{: .label .label-purple }

**References UBI Specification 1.0.0**
{: .label .label-purple }

User Behavior Insights (UBI) is a schema for capturing user search behavior. Search behavior consists of the queries that the user submits, the results that are presented to them, and the actions they take on those results. The UBI schema links all user interactions (events) to the search result they were performed on. That is, it not only captures the chronological sequence of events but also captures the causal links between events. Analysis of this behavior is used for improving the quality of search results.

Client applications such as web pages or apps capture user behavior and send UBI data to a UBI endpoint. For web pages, this is typically handled by JavaScript code.

In principle, queries sent to the server and results returned by the server can be sent to the UBI endpoint from the client. But as an optimization, they can instead be sent directly to the UBI endpoint from the server, without incurring a round-trip to the client. That is the function of the UBI plugin and is not a requirement to adopt UBI.

UBI includes the following elements:
* A machine-readable [schema](https://github.com/o19s/ubi) that faciliates interoperablity of the UBI specification.
* A client-side JavaScript [example reference implementation]({{site.url}}{{site.baseurl}}/search-plugins/ubi/data-structures/) that shows how to capture events and send them to the OpenSearch UBI plugin.
* An OpenSearch [plugin](https://github.com/opensearch-project/user-behavior-insights) that captures server-side behavior.

<!-- vale off -->

The UBI documentation is organized into two categories: *Explanation and reference* and *Tutorials and how-to guides*:   

*Explanation and reference*

| Link | Description |
| :--------- | :------- |
| [UBI Request/Response Specification](https://github.com/o19s/ubi/) | The industry-standard schema for UBI requests and responses. The current version references UBI Specification 1.0.0.  |
| [UBI index schema]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/) | Documentation on the individual OpenSearch query and event stores. |


*Tutorials and how-to guides*

| Link | Description |
| :--------- | :------- |
| [UBI plugin](https://github.com/opensearch-project/user-behavior-insights) | How to install and use the UBI plugin. |
| [UBI client data structures]({{site.url}}{{site.baseurl}}/search-plugins/ubi/data-structures/)  | Sample JavaScript structures for populating the event store. |
| [Example UBI query DSL queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/dsl-queries/)  | How to write queries for UBI data in OpenSearch query DSL. |
| [Example UBI SQL queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/)  | How to write analytic queries for UBI data in SQL. |
| [UBI dashboard tutorial]({{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-dashboard-tutorial/) | How to build a dashboard containing UBI data. |
| [Chorus Opensearch Edition](https://github.com/o19s/chorus-opensearch-edition/?tab=readme-ov-file#structured-learning-using-chorus-opensearch-edition) katas | A series of structured tutorials that teach you how to use UBI with OpenSearch through a demo e-commerce store. |

<!-- vale on -->
The documentation categories were adapted using concepts based on [Diátaxis](https://diataxis.fr/).
{: .tip }
