---
layout: default
title: Memory APIs
parent: ML Commons APIs
has_children: true
has_toc: false
nav_order: 28
redirect_from: /ml-commons-plugin/api/memory-apis/
---

# Memory APIs
**Introduced 2.12**
{: .label .label-purple }

Memory APIs provide operations needed to implement [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). A memory keeps conversation history for the current conversation. A message is one question/answer interaction between the user and a large language model. Messages are organized into memories.


ML Commons supports the following memory-level APIs:

- [Create or update memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-memory/)
- [Get memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-memory/)
- [Delete memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/delete-memory/)

ML Commons supports the following message-level APIs:

- [Create or update message]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-message/)
- [Get message information]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-message/)

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}