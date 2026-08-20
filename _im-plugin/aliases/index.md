---
layout: default
title: Index aliases
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /opensearch/index-alias/
  - im-plugin/index-alias/
---


# Index aliases

An alias is a virtual index name that can point to one or more indexes. If your data is spread across multiple indexes, you can create an alias and query it instead.

Aliases provide the following capabilities:

- Group related indexes under a single logical name for flexible data organization.
- Use routing and filtering to optimize query performance.
- Refer to stable alias names, simplifying application logic.
- Switch between indexes without interrupting client applications, enabling zero-downtime operations.

These capabilities make aliases useful in several scenarios. For example, you can:

- Switch between different data sets for A/B testing.
- Migrate data between index structures without interrupting queries.
- Manage environments with aliases such as `production-data` and `staging-data`.
- Maintain a consistent query endpoint while rotating daily or monthly log indexes.

For example, if you store logs in indexes based on the month and you frequently query the logs for the previous two months, you can create a `last_2_months` alias and update the indexes it points to each month.

When working with aliases, keep in mind these important behaviors:

- All alias changes happen atomically. There's never a moment when an alias points to an unintended set of indexes.
- When using wildcard patterns, aliases capture indexes that match at creation time. They don't automatically include new indexes created later.
- Writing to an alias that points to multiple indexes requires designating a write index.
- Filtered aliases automatically apply their filters to all search, count, and delete by query operations.

To manage aliases with the Alias API, see [Using the Aliases API]({{site.url}}{{site.baseurl}}/im-plugin/aliases/api-aliases/).

To manage aliases using OpenSearch Dashboards, see [Managing aliases with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/).

The following table provides links to instructions using both OpenSearch Dashboards and the OpenSearch APIs.

OpenSource Dashboards | Alias API
:-- | :--
[Clearing an alias cache]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#clearing-an-alias-cache) | [Clear Cache API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache//)
[Creating an alias]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#creating-an-alias) | [Create Or Update Index Alias API]({{site.url}}{{site.baseurl}}/api-reference/alias/create-alias/)
[Deleting an alias]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#deleting-an-alias) | [Delete Index Alias API]({{site.url}}{{site.baseurl}}/api-reference/alias/delete-alias/)
[Editing an alias]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#editing-an-alias) | [Create Or Update Index Alias API]({{site.url}}{{site.baseurl}}/api-reference/alias/create-alias/)
[Flushing aliases]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#flushing-aliases) | [Flush API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/)
[Force merging aliases]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#force-merging-aliases) | [Force merging multiple indexes]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/#force-merging-multiple-indexes)
[Refreshing aliases]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#refreshing-aliases) | [Refresh Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/)
[Rolling over an alias]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/#rolling-over-an-alias) | [Rollover types]({{site.url}}{{site.baseurl}}/api-reference/index-apis/rollover/#rollover-types)

 