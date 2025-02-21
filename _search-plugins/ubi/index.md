---
layout: default
title: User Behavior Insights
has_children: true
nav_order: 90
redirect_from:
  - /search-plugins/ubi/
---
# User Behavior Insights

**Introduced 2.15**
{: .label .label-purple }

**References UBI Specification 1.2.0**
{: .label .label-purple }

User Behavior Insights (UBI) is a schema for capturing user search behavior. Search behavior consists of the queries that the user submits, the results that are presented to them, and the actions they take on those results. The UBI schema links all user interactions (events) to the search result they were performed on. That is, it not only captures the chronological sequence of events but also captures the causal links between events. Analysis of this behavior is used for improving the quality of search results.

Client applications such as web pages or apps capture user behavior and send UBI data to a UBI endpoint. For web pages, this is typically handled by JavaScript code.

In principle, queries sent to the server and results returned by the server can be sent to the UBI endpoint from the client. But as an optimization, they can instead be sent directly to the UBI endpoint from the server, without incurring a round-trip to the client. That is the function of the UBI plugin and is not a requirement to adopt UBI.


> “how our users are using our product, whether search results were useful for them and whether they clicked on top-n results we gave and all related stuff” - Data Scientist

UBI includes the following elements:
* A client-side JavaScript [example reference implementation]({{site.url}}{{site.baseurl}}/search-plugins/ubi/data-structures/) that shows how to capture events and send them to the OpenSearch UBI plugin.
* A machine-readable [schema](https://github.com/o19s/ubi) that faciliates interoperablity of the UBI specification.
* An (optional!) OpenSearch [plugin](https://github.com/opensearch-project/user-behavior-insights) that streamlines the recording of query data.

Advanced features in OpenSearch, such as the Search Quality Evaluation Framework, and the Hybrid Search Optimizer all build on the UBI specification.

<!-- vale off -->

<table>
    <tr style="vertical-align: top;">
        <td>
            <h2>Tutorials</h2>
            <ul>
                <li><a href="#">Learn to use <code>ubi.js</code></a></li>
                <li><a href="#">Using OpenSearch Ingestion from AWS with UBI</a></li>
                <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-dashboard-tutorial/">Learn to create custom dashboards with UBI data.</a></li>                
            </ul>
        </td>
        <td>
            <h2>How To Guides</h2>
            <ul>                
                <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/dsl-queries/">How to write queries for UBI data in OpenSearch query DSL.</a></li>
                <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/">How to write analytic queries for UBI data in SQL.</a></li>
                <li><a href="https://github.com/o19s/chorus-opensearch-edition/blob/main/katas/006_protecting_sensitive_information.md">How to protect sensistive information when using UBI.</a> <small>Part of Chorus series.</small></li>
            </ul>
        </td>
    </tr>
    <tr style="vertical-align: top;">
        <td>
            <h2>Explanation</h2>
            <ul>
                <li><a href="https://UBISearch.dev">Why UBI?</a></li>
                <li><a href="https://github.com/opensearch-project/user-behavior-insights">How to install and use the UBI plugin</a><b>do we keep this</b></li>
                <li><a href="">How should I integrate UBI tracking?</a></li>
                <li><a href="https://UBISearch.dev">UBISearch.dev</a> is the community website.</li>
                <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-javascript-collector/">UBI.js</a> JavaScript collector</li>
            </ul>
        </td>
        <td>
            <h2>Reference</h2>
            <ul>
                <li><a href="https://o19s.github.io/ubi/docs/html/1.2.0/query.request.schema.html">Query Tracking Specification</a></li>
                <li><a href="https://o19s.github.io/ubi/docs/html/1.2.0/event.schema.html">Event Tracking Specification</a></li>                
                <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/">UBI Plugin Schema</a><b>DO WE KEEP THIS</b></li>
            </ul>
        </td>
    </tr>
</table>

<!-- vale on -->
The documentation categories were adapted using concepts based on [Diátaxis](https://diataxis.fr/).
{: .tip }
