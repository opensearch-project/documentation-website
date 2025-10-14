---
layout: default
title: Memory APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 50
redirect_from: /ml-commons-plugin/api/memory-apis/
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/memory-apis/index/
---

# Memory APIs
**Introduced 2.12**
{: .label .label-purple }

Memory APIs provide operations needed to implement [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). A memory stores conversation history for the current conversation. A message represents one question/answer interaction between the user and a large language model. Messages are organized into memories.

ML Commons supports the following memory-level APIs:

- [Create or update memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-memory/)
- [Get memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-memory/)
- [Search memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/search-memory/)
- [Delete memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/delete-memory/)

ML Commons supports the following message-level APIs:

- [Create or update message]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-message/)
- [Get message]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-message/)
- [Search message]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/search-message/)
- [Get message traces]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-message-traces/)

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}