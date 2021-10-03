---
layout: default
title: Settings
parent: Anomaly detection
nav_order: 4
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
`plugins.anomaly_detection.ad_result_history_max_docs` | 250,000,000 | The maximum number of documents in one result index. The plugin only counts refreshed documents in the primary shards.
`plugins.anomaly_detection.ad_result_history_max_docs_per_shard` | 1,350,000,000 | The maximum number of documents in a single shard of the result index. The anomaly detection plugin only counts the refreshed documents in the primary shards.
`plugins.anomaly_detection.max_entities_per_query` | 1,000,000 | The maximum unique values per detection interval for high cardinality detectors. By default, if the category field has more than 1,000 unique values in a detector interval, the plugin selects the top 1,000 values and orders them by `doc_count`.
`plugins.anomaly_detection.max_entities_for_preview` | 5 | The maximum unique category field values displayed with the preview operation for high cardinality detectors. If the category field has more than 30 unique values, the plugin selects the top 30 values and orders them by `doc_count`.
`plugins.anomaly_detection.max_primary_shards` | 10 | The maximum number of primary shards an anomaly detection index can have.
`plugins.anomaly_detection.filter_by_backend_roles` | False | When you enable the security plugin and set this to `true`, the plugin filters results based on the user's backend role(s).
`plugins.anomaly_detection.max_batch_task_per_node` | 10 | Starting a historical detector triggers a batch task. This setting is the number of batch tasks that you can run per data node. You can tune this setting from 1 to 1000. If the data nodes can't support all batch tasks and you're not sure if the data nodes are capable of running more historical detectors, add more data nodes instead of changing this setting to a higher value.
`plugins.anomaly_detection.max_old_ad_task_docs_per_detector` | 1 | You can run the same historical detector many times. For each run, the anomaly detection plugin creates a new task. This setting is the number of previous tasks the plugin keeps. Set this value to at least 1 to track its last run. You can keep a maximum of 1,000 old tasks to avoid overwhelming the cluster.
`plugins.anomaly_detection.batch_task_piece_size` | 1,000 | The date range for a historical task is split into smaller pieces and the anomaly detection plugin runs the task piece by piece. Each piece contains 1,000 detection intervals by default. For example, if detector interval is 1 minute and one piece is 1000 minutes, the feature data is queried every 1,000 minutes. You can change this setting from 1 to 10,000.
`plugins.anomaly_detection.batch_task_piece_interval_seconds` | 5 | Add a time interval between historical detector tasks. This interval prevents the task from consuming too much of the available resources and starving other operations like search and bulk index. You can change this setting from 1 to 600 seconds.
`plugins.anomaly_detection.max_top_entities_for_historical_analysis` | 1,000 | The maximum number of top entities that you run for a high-cardinality detector historical analysis.
`plugins.anomaly_detection.max_running_entities_per_detector_for_historical_analysis` | 10 | How many entity tasks you can run in parallel for one HC detector. The cluster availble task slots will impact how many entities can run in parallel as well. For example, the cluster has 3 data nodes, each data node has 10 task slots by default. But if we have already started 2 HC detectors and each HC running 10 entities, and start a single-flow detector which takes 1 task slot,  then the availabe task slots will be 10 * 3 - 10 * 2 - 1 = 9. Then, if we start a new HC detector, it can only run 9 entities in parallel, not 10.
