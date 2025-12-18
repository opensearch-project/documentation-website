---
layout: default
title: Index settings and mappings
parent: Index APIs
nav_order: 40
has_children: true
has_toc: false
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/index-settings-mappings/
---

# Index settings and mappings

Index settings and mappings APIs allow you to configure and modify the behavior and structure of your indexes. These APIs provide control over index-level settings and field mappings that determine how your data is stored and indexed.

## Available APIs

OpenSearch supports the following index settings and mappings APIs.

| API | Description |
|-----|-------------|
| [Get settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-settings/) | Returns settings information for one or more indexes. |
| [Update settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/) | Updates settings for one or more indexes. |
| [Put mapping]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/) | Adds new fields or updates existing field mappings. |