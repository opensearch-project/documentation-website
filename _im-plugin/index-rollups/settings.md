---
layout: default
title: Settings
parent: Index rollups
nav_order: 30
---

# Index rollup settings

We don't recommend changing these settings; the defaults should work well for most use cases.

All settings are available using the OpenSearch `_cluster/settings` operation. None require a restart, and all can be marked `persistent` or `transient`.

Setting | Default | Description
:--- | :--- | :---
`plugins.rollup.search.backoff_millis` | 1000 milliseconds | The backoff time between retries for failed rollup jobs.
`plugins.rollup.search.backoff_count` | 5 | How many retries the plugin should attempt for failed rollup jobs.
`plugins.rollup.search.search_all_jobs` | false | Whether OpenSearch should return all jobs that match the specified search term. If disabled, OpenSearch returns just one of the jobs that matches the term, as opposed to all.
`plugins.rollup.dashboards.enabled` | true | Whether rollups are enabled in OpenSearch Dashboards.
`plugins.rollup.enabled` | true | Whether the rollup plugin is enabled.
`plugins.ingest.backoff_millis` | 1000 milliseconds | The backoff time between data ingestions for rollup jobs.
`plugins.ingest.backoff_count` | 5 | How many retries the plugin should attempt for failed ingestions.
