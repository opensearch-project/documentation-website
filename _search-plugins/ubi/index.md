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

**References UBI Specification 1.3.0**
{: .label .label-purple }

User Behavior Insights (UBI) is a schema for capturing user search behavior. Search behavior consists of the queries that the user submits, the results that are presented to them, and the actions they take on those results. The UBI schema links all user interactions (events) to the search result they were performed on. That is, it not only captures the chronological sequence of events but also captures the causal links between events. Analysis of this behavior is used for improving the quality of search results.

Client applications such as web pages or apps capture user behavior and send UBI data to a UBI endpoint. For web pages, this is typically handled by JavaScript code.

In principle, queries sent to the server and results returned by the server can be sent to the UBI endpoint from the client. But as an optimization, they can instead be sent directly to the UBI endpoint from the server, without incurring a round-trip to the client. That is the function of the UBI plugin and is not a requirement to adopt UBI.


> "how our users are using our product, whether search results were useful for them and whether they clicked on top-n results we gave and all related stuff" -- Data scientist working on search.

UBI includes the following elements:
* A machine-readable [schema](https://github.com/o19s/ubi) that facilitates interoperability of the UBI specification.
* [ubi.js](https://github.com/opensearch-project/user-behavior-insights/tree/main/ubi-javascript-collector/ubi.js): An (optional) client-side JavaScript library for capturing searches and events.
* An (optional) OpenSearch [plugin](https://github.com/opensearch-project/user-behavior-insights) that streamlines the recording of query data.

Advanced features in OpenSearch, such as the [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/) and the [Hybrid Search Optimizer]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/), build on the data collected according to the UBI specification.

<!-- vale off -->

<table>
  <tr style="vertical-align: top;">
    <td>
      <h2>Tutorials</h2>
      <ul>    
        <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-aws-managed-services-tutorial/">Learn to use Amazon OpenSearch Ingestion</a> pipelines for gathering UBI-formatted data in Amazon OpenSearch Service.</li>        
        <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-dashboard-tutorial/">Learn to create custom dashboards</a> for visualizing UBI data.</li>    
        <li> Based on <a href="https://github.com/o19s/chorus-opensearch-edition">Chorus for OpenSearch</a> demo:
          <ul>
            <li><a href="https://github.com/o19s/chorus-opensearch-edition/blob/main/katas/002_derive_interaction_data.md">Derive Interaction Data from User Clicks.</a></li>
            <li><a href="https://github.com/o19s/chorus-opensearch-edition/blob/main/katas/006_protecting_sensitive_information.md">Protecting sensistive information when using UBI.</a></li>
            <li><a href="https://github.com/o19s/chorus-opensearch-edition/blob/main/katas/007_configure_AB_with_TDI.md">Configuring an AB test with Team Draft Interleaving</a></li>    
          </ul>
        </li>
      </ul>
    </td>
    <td>
      <h2>How To Guides</h2>
      <ul>        
        <li>How to <a href="https://github.com/opensearch-project/user-behavior-insights?tab=readme-ov-file#user-quick-start">install and use the UBI plugin</a> in OpenSearch.</li>          
        <li>How to use <a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/ubi-javascript-collector/">ubi.js</a>, a client-side JavaScript library for capturing events.</li>
        <li>How to <a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/dsl-queries/">write queries for UBI data using OpenSearch query DSL.</a></li>
        <li>How to <a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/">write analytic queries for UBI data using SQL.</a></li>          
      </ul>
    </td>
  </tr>
  <tr style="vertical-align: top;">
    <td>
      <h2>Explanation</h2>
      <ul>
        <li><a href="https://docs.google.com/presentation/d/e/2PACX-1vTJ9wYhhRG2sHxB-pm2Pfcqv0AzwRzSgTn-VyKTV6bL4PyXQC9C9kE6Oyrkag2_Olb6Ugevs_kbflId/pub?start=true&loop=false&delayms=3000">Why UBI?</a> presentation.</li>
        <li>Learn more about this standard via <a href="https://www.UBISearch.dev">https://www.UBISearch.dev</a>, the community clearinghouse.</li>                
        <li>Watch <a href="https://youtu.be/0chun264PRQ">Leveraging UBI to enhance Search Relevance</a> talk to understand how to use this data to improve search quality.</li>
        <li>Go deeper with UBI.  Watch <a href="https://www.youtube.com/watch?v=xi261oUamXc">You’ve Deployed User Behavior Insights. Now What?</a> to see what else you can do.</li>
      </ul>
    </td>
    <td>
        <h2>Reference</h2>
        <ul>
            <li><a href="https://github.com/opensearch-project/user-behavior-insights">UBI Plugin for OpenSearch</a></li>
              <li><a href="{{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/">UBI Schema in OpenSearch</a></li>
            <li>Repository for the <a href="https://github.com/o19s/ubi">UBI Schema</a>.</li>                
            <li><a href="https://o19s.github.io/ubi/docs/html/1.3.0/query.request.schema.html">Query Tracking Specification</a></li>
            <li><a href="https://o19s.github.io/ubi/docs/html/1.3.0/event.schema.html">Event Tracking Specification</a></li>                
            
        </ul>
    </td>
  </tr>
</table>

<!-- vale on -->
The documentation categories were adapted using concepts based on [Diátaxis](https://diataxis.fr/).
{: .tip }
