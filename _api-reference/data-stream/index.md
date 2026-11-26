---
layout: default
title: Data stream APIs
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /api-reference/data-stream/
---

# Data stream APIs

Use the data stream APIs to create and delete [data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/), modify their backing indexes, and retrieve information and statistics about them.

## Available APIs

OpenSearch supports the following data stream APIs.

| API | Description |
|-----|-------------|
| [Create data stream]({{site.url}}{{site.baseurl}}/api-reference/data-stream/create-data-stream/) | Creates a data stream. |
| [Get data stream]({{site.url}}{{site.baseurl}}/api-reference/data-stream/data-stream-info/) | Returns information about one or more data streams. |
| [Get data stream stats]({{site.url}}{{site.baseurl}}/api-reference/data-stream/data-stream-stats/) | Returns statistics for one or more data streams. |
| [Modify data stream]({{site.url}}{{site.baseurl}}/api-reference/data-stream/modify-data-stream/) | Adds or removes the backing indexes of a data stream. |
| [Delete data stream]({{site.url}}{{site.baseurl}}/api-reference/data-stream/delete-data-stream/) | Deletes a data stream and its backing indexes. |

## Related documentation

- For more information about data streams, including when to use them, see [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/).
