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

User Behavior Insights (UBI) is a standard for capturing client-side events and queries for the purposes of improving search relevance and the user experience.
It is a *causal* system, linking a user's query to all of their subsequent interactions with your application until they perform another search.
This differs from many systems that infer the linking of search to events through *chronological* sequence.


> “how our users are using our product, whether search results were useful for them and whether they clicked on top-n results we gave and all related stuff” - Data Scientist

UBI includes the following elements:
* [ubi.js](https://github.com/opensearch-project/user-behavior-insights/tree/main/ubi-javascript-collector/ubi.js): a client-side JavaScript library that captures searches and events.
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
                <li><a href="#">Link 3</a></li>
            </ul>
        </td>
        <td>
            <h2>How To Guides</h2>
            <ul>
                <li><a href="https://github.com/opensearch-project/user-behavior-insights">How to install and use the UBI plugin</a><b>do we keep this</b></li>
                <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-dashboard-tutorial/">How to build a custom dashboard with UBI data.</a></li>
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
