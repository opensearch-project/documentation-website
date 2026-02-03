---
layout: default
title: Index templates
parent: Index APIs
nav_order: 50
has_children: true
has_toc: false
---

# Index templates

Index template APIs allow you to create and manage templates that automatically apply settings, mappings, and aliases to new indexes that match specific patterns. Templates provide a powerful way to ensure consistency across your indexes.

## Available APIs

OpenSearch supports the following index template APIs.

| API | Description |
|-----|-------------|
| [Create index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index-template/) | Creates or updates an index template. |
| [Delete index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index-template/) | Deletes an index template. |
| [Get index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index-template/) | Returns information about one or more index templates. |
| [Index template exists]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-template-exists/) | Checks if an index template exists. |
| [Simulate index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/simulate-index-template/) | Simulates the application of index templates. |
| [Component template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/component-template/) | Manages component templates that can be reused across index templates. |

## Legacy template APIs

OpenSearch also supports the following legacy template APIs for backward compatibility. These APIs use the older template format and are deprecated in favor of the index template APIs above.

| API | Description |
|-----|-------------|
| [Post template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/post-template-legacy/) | Creates or updates a legacy index template using POST. |
| [Put template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-template-legacy/) | Creates or updates a legacy index template using PUT. |
| [Get template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-template-legacy/) | Returns information about one or more legacy index templates. |
| [Template exists (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/template-exists-legacy/) | Checks if a legacy index template exists. |
| [Delete template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-template-legacy/) | Deletes a legacy index template. |