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

User Behavior Insights (UBI) is a plugin that captures client-side events and queries for the purposes of improving search relevance and the user experience.
It is a causal system, linking a user's query to all of their subsequent interactions with your application until they perform another search.

UBI includes the following elements:
* A machine-readable [schema](https://github.com/o19s/ubi) that faciliates interoperablity of the UBI specification.
* An OpenSearch [plugin](https://github.com/opensearch-project/user-behavior-insights) that facilitates the storage of client-side events and queries.
* A client-side JavaScript [example reference implementation]({{site.url}}{{site.baseurl}}/search-plugins/ubi/data-structures/) that shows how to capture events and send them to the OpenSearch UBI plugin.

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
