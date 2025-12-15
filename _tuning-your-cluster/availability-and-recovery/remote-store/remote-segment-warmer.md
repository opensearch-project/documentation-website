---
layout: default
title: Remote segment backpressure
nav_order: 10
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Remote segment warmer

Introduced 3.4
{: .label .label-purple }

Remote segment warmer does pre-copy of merged segments to decrease the replication lag. 

## Remote segment warmer settings

Remote segment warmer adds several settings to the standard OpenSearch cluster settings. The settings are dynamic, so you can change the default  behavior without restarting your cluster. 

The following table lists the settings used for remote segment warmer.

|Setting	| Data type	 | Description	                                                                                     |
|:---	|:-----------|:-------------------------------------------------------------------------------------------------|
|`indices.replication.merges.warmer.enabled`	| Boolean    | Enables remote segment warmer. Default is `false`.                                               |
|`indices.replication.merges.warmer.max_bytes_per_sec`	| Integer    | Individual speed setting for merged segment replication. Default is `-1` to use recovery speed.	 |
|`indices.replication.merges.warmer.timeout`	| Time unit  | Control the maximum waiting time for replicate merged segment to the replica. Default is `10`.	  |
|`indices.replication.merges.warmer.min_segment_size_threshold`	| Byte unit	 | set a threshold for minimum size of a merged segment to be warmed. Default is `500MB`.	          |


