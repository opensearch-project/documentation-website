---
layout: default
title: Index blocks and allocation
parent: Index APIs
nav_order: 70
has_children: true
---

# Index blocks and allocation

Index blocks and allocation APIs provide control over index access restrictions and shard allocation policies. These APIs help you manage cluster resources and control how indexes are distributed across your cluster nodes.

## Available APIs

OpenSearch supports the following index blocks and allocation APIs.

| API | Description |
|-----|-------------|
| [Blocks]({{site.url}}{{site.baseurl}}/api-reference/index-apis/blocks/) | Adds or removes index blocks that restrict operations on indexes. |
| [Shard allocation]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shard-allocation/) | Controls shard allocation and routing for indexes. |