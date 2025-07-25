---
layout: default
title: Settings
parent: Anomaly detection
nav_order: 4
canonical_url: https://docs.opensearch.org/latest/observing-your-data/ad/settings/
---

# Settings

The anomaly detection plugin adds several settings to the standard OpenSearch cluster settings.
The settings are dynamic, so you can change the default behavior of the plugin without restarting your cluster.
You can mark settings as `persistent` or `transient`.

For example, to update the retention period of the result index:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.anomaly_detection.ad_result_history_retention_period": "5m"
  }
}
```

Setting | Default | Description
:--- | :--- | :---
`plugins.anomaly_detection.enabled` | True | Whether the anomaly detection plugin is enabled or not. If disabled, all detectors immediately stop running.
`plugins.anomaly_detection.max_anomaly_detectors` | 1,000 | The maximum number of non-high cardinality detectors (no category field) users can create.
`plugins.anomaly_detection.max_multi_entity_anomaly_detectors` | 10 | The maximum number of high cardinality detectors (with category field) in a cluster.
`plugins.anomaly_detection.max_anomaly_features` | 5 | The maximum number of features for a detector.
`plugins.anomaly_detection.ad_result_history_rollover_period` | 12h | How often the rollover condition is checked. If `true`, the plugin rolls over the result index to a new index.
`plugins.anomaly_detection.ad_result_history_max_docs` | 250000000 | The maximum number of documents in one result index. The plugin only counts refreshed documents in the primary shards.
`plugins.anomaly_detection.ad_result_history_retention_period` | 30d | The maximum age of the result index.  If its age exceeds the threshold, the plugin deletes the rolled over result index. If the cluster has only one result index, the plugin keeps the index even if it's older than its configured retention period.
`plugins.anomaly_detection.max_entities_per_query` | 1,000 | The maximum unique values per detection interval for high cardinality detectors. By default, if the category field has more than 1,000 unique values in a detector interval, the plugin selects the top 1,000 values and orders them by `doc_count`.
`plugins.anomaly_detection.max_entities_for_preview` | 30 | The maximum unique category field values displayed with the preview operation for high cardinality detectors. If the category field has more than 30 unique values, the plugin selects the top 30 values and orders them by `doc_count`.
`plugins.anomaly_detection.max_primary_shards` | 10 | The maximum number of primary shards an anomaly detection index can have.
`plugins.anomaly_detection.filter_by_backend_roles` | False | When you enable the security plugin and set this to `true`, the plugin filters results based on the user's backend role(s).
`plugins.anomaly_detection.max_cache_miss_handling_per_second` | 100 | High cardinality detectors use a cache to store active models. In the event of a cache miss, the cache gets the models from the model checkpoint index. Use this setting to limit the rate of fetching models. Because the thread pool for a GET operation has a queue of 1,000, we recommend setting this value below 1,000.
`plugins.anomaly_detection.max_batch_task_per_node` | 2 | Starting a historical detector triggers a batch task. This setting is the number of batch tasks that you can run per data node. You can tune this setting from 1 to 1000. If the data nodes can't support all batch tasks and you're not sure if the data nodes are capable of running more historical detectors, add more data nodes instead of changing this setting to a higher value.
`plugins.anomaly_detection.max_old_ad_task_docs_per_detector` | 10 | You can run the same historical detector many times. For each run, the anomaly detection plugin creates a new task. This setting is the number of previous tasks the plugin keeps. Set this value to at least 1 to track its last run. You can keep a maximum of 1,000 old tasks to avoid overwhelming the cluster.
`plugins.anomaly_detection.batch_task_piece_size` | 1000 | The date range for a historical task is split into smaller pieces and the anomaly detection plugin runs the task piece by piece. Each piece contains 1,000 detection intervals by default. For example, if detector interval is 1 minute and one piece is 1000 minutes, the feature data is queried every 1,000 minutes. You can change this setting from 1 to 10,000.
`plugins.anomaly_detection.batch_task_piece_interval_seconds` | 5 | Add a time interval between historical detector tasks. This interval prevents the task from consuming too much of the available resources and starving other operations like search and bulk index. You can change this setting from 1 to 600 seconds.
