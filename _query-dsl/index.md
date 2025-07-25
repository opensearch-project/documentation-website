---
layout: default
title: Query DSL, aggregations, and analyzers
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
canonical_url: https://docs.opensearch.org/latest/query-dsl/
---

# Query DSL, aggregations, and analyzers

[Analyzers]({{site.url}}{{site.baseurl}}/analyzers/text-analyzers/) process text to make it searchable. OpenSearch provides various analyzers that let you customize the way text is split into terms and converted into a structured format. To search documents written in a different language, you can use one of the built-in [language analyzers]({{site.url}}{{site.baseurl}}/query-dsl/analyzers/language-analyzers/) for your language of choice.

The most essential search function is using a query to return relevant documents. OpenSearch provides a search language called _query domain-specific language_ (DSL) that lets you build complex and targeted queries. Explore the [query DSL documentation]({{site.url}}{{site.baseurl}}/query-dsl/) to learn more about the different types of queries OpenSearch supports.

[Aggregations]({{site.url}}{{site.baseurl}}/aggregations/) let you categorize your data and analyze it to extract statistics. Use cases for aggregations include analyzing data in real time and using OpenSearch Dashboards to create visualizations.