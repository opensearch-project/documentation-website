---
layout: default
title: Asynchronous Search APIs
nav_order: 8
has_children: true
---

# Asynchronous search
**Introduced 1.0**
{: .label .label-purple }

Asynchronous search in OpenSearch allows you to execute search operations in the background and retrieve results at a later time. This is particularly valuable for resource-intensive or long-running search operations that might otherwise time out in a synchronous context.


## Available APIs

OpenSearch provides the following APIs for working with asynchronous searches.

| API | Description |
| :--- | :--- |
| [Create asynchronous search]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/create-async-search/) | Submits a search that runs in the background |
| [Get asynchronous search]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/get-async-search/) | Retrieves status and results of a previously submitted search |
| [Delete asynchronous search]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/delete-async-search/) | Removes a stored asynchronous search |
| [Asynchronous search stats]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/async-search-stats/) | Provides statistics about asynchronous search operations |


## Performance considerations

Asynchronous searches consume resources on the cluster. To optimize performance, remember the following considerations:

- Set appropriate `keep_alive` values to prevent unnecessary storage.
- Use `keep_on_completion=false` if you want to retrieve results immediately.
- Monitor statistics to understand usage patterns.
- Delete searches when no longer needed.
- Consider increasing search thread pools if running many concurrent searches.

## Security

If you use the Security plugin, users need the `asynchronous_search_full_access` or  `asynchronous_search_read_access` permission to use or view asynchronous searches. You can also define more granular permissions for specific actions. For more information, see [Asynchronous search security]({{site.url}}{{site.baseurl}}/search-plugins/async/security/).