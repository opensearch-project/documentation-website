---
layout: default
title: Core index APIs
parent: Index APIs
nav_order: 20
has_children: true
---

# Core index APIs

Core index APIs provide fundamental operations for managing the lifecycle of indexes in your OpenSearch cluster. These APIs allow you to create, delete, and perform basic operations on indexes.

## Available APIs

OpenSearch supports the following core index APIs.

| API | Description |
|-----|-------------|
| [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/) | Creates a new index. |
| [Delete index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index/) | Deletes an existing index. |
| [Get index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index/) | Returns information about one or more indexes. |
| [Index exists]({{site.url}}{{site.baseurl}}/api-reference/index-apis/exists/) | Checks if an index exists. |
| [Open index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/open-index/) | Opens a closed index. |
| [Close index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index/) | Closes an open index. |
| [Resolve index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/resolve-index/) | Resolves index names and aliases to their concrete indexes. |