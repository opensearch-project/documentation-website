---
layout: default
title: Remote segment warmer
nav_order: 10
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Remote segment warmer

Introduced 3.4
{: .label .label-purple }

The remote segment warmer performs pre-copying of merged segments to reduce replication lag between primary and replica shards.

## Remote segment warmer settings

The remote segment warmer adds several settings to the standard OpenSearch cluster settings. The settings are dynamic, so you can change the default behavior without restarting your cluster. 

The following table lists the settings used for the remote segment warmer.

|Setting	| Data type	 | Description	                                                                                     |
|:---	|:-----------|:-------------------------------------------------------------------------------------------------|
|`indices.replication.merges.warmer.enabled`	| Boolean    | Enables the remote segment warmer. Default is `false`.                                               |
|`indices.replication.merges.warmer.max_bytes_per_sec`	| Integer    | The individual speed setting for merged segment replication. Default is `-1` (use recovery speed).	 |
|`indices.replication.merges.warmer.timeout`	| Time unit  | Controls the maximum amount of time the system waits while replicating merged segments to a replica. Default is `10`.	  |
|`indices.replication.merges.warmer.min_segment_size_threshold`	| Byte unit	 | Sets a threshold for the minimum size of a merged segment to be warmed. Default is `500MB`.	          |


