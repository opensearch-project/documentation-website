---
layout: default
title: Asynchronous search APIs
nav_order: 8
has_children: true
---

# Asynchronous search
**Introduced in 1.0**
{: .label .label-purple }

Asynchronous search in OpenSearch lets you run search operations in the background and retrieve results later. This approach is useful for long-running or resource-intensive searches that may time out in a synchronous context.

## Available APIs

The following APIs support asynchronous search operations:

| API | Description |
| :--- | :--- |
| [Create asynchronous search]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/create-async-search/) | Submits a background search request. |
| [Get asynchronous search]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/get-async-search/) | Retrieves the status and results of a submitted search. |
| [Delete asynchronous search]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/delete-async-search/) | Deletes a stored asynchronous search. |
| [Asynchronous search stats]({{site.url}}{{site.baseurl}}/api-reference/asynchronous-search/async-search-stats/) | Returns statistics about asynchronous search usage. |

## Performance considerations

Asynchronous searches use cluster resources. To optimize performance, consider the following:

- Set a reasonable `keep_alive` value to avoid unnecessary storage.
- Use `keep_on_completion=false` if you plan to retrieve results immediately.
- Monitor asynchronous search statistics to understand usage patterns.
- Delete searches when they are no longer needed.
- Adjust the search thread pool size if running many concurrent searches.

## Security

If the Security plugin is enabled, users must have either the `asynchronous_search_full_access` or `asynchronous_search_read_access` permission to manage or view asynchronous searches. You can also configure more granular permissions. For details, see [Asynchronous search security]({{site.url}}{{site.baseurl}}/search-plugins/async/security/).
