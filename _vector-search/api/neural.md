---
layout: default
title: Neural Search API
parent: Vector search API
nav_order: 20
has_children: false
---

# Neural Search API

The Neural Search plugin provides several APIs for monitoring semantic and hybrid search features.

## Stats

The Neural Search Stats API provides information about the current status of the Neural Search plugin. This includes both cluster-level and node-level statistics. Cluster-level statistics have a single value for the entire cluster. Node-level statistics have a single value for each node in the cluster. 

By default, the Neural Search Stats API is disabled through a cluster setting. To enable statistics collection, use the following command:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.neural_search.stats_enabled": true
  }
}
```
{% include copy-curl.html %}

To disable statistics collection, set the cluster setting to `false`. When disabled, all values are reset and new statistics are not collected. 

### Endpoints

```json
GET /_plugins/_neural/stats
GET /_plugins/_neural/stats/<stats>
GET /_plugins/_neural/<nodes>/stats
GET /_plugins/_neural/<nodes>/stats/<stats>
```

### Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `nodes` | String | A node or a list of nodes (comma-separated) to filter statistics by. Default is all nodes. |
| `stats` | String | A statistic name or names (comma-separated) to return. Default is all statistics. |

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `include_metadata` | Boolean | When `true`, includes additional metadata fields for each statistic (see [Available metadata](#available-metadata)). Default is `false`. |
| `flat_stat_paths` | Boolean | When `true`, flattens the JSON response structure for easier parsing. Default is `false`. | 
| `include_individual_nodes` | Boolean | When `true`, includes statistics for individual nodes in the `nodes` category. When `false`, excludes the `nodes` category from the response. Default is `true`. |
| `include_all_nodes` | Boolean | When `true`, includes aggregated statistics across all nodes in the `all_nodes` category. When `false`, excludes the `all_nodes` category from the response. Default is `true`. |
| `include_info` | Boolean | When `true`, includes cluster-wide information in the `info` category. When `false`, excludes the `info` category from the response. Default is `true`. |

#### Example request

```json
GET /_plugins/_neural/node1,node2/stats/stat1,stat2?include_metadata=true,flat_stat_paths=true
```
{% include copy-curl.html %}

#### Example response

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
GET /_plugins/_neural/stats/
{
	"_nodes": {
		"total": 1,
		"successful": 1,
		"failed": 0
	},
	"cluster_name": "integTest",
	"info": {
		"cluster_version": "3.1.0",
		"processors": {
			"search": {
				"hybrid": {
					"comb_geometric_processors": 0,
					"comb_rrf_processors": 0,
					"norm_l2_processors": 0,
					"norm_minmax_processors": 0,
					"comb_harmonic_processors": 0,
					"comb_arithmetic_processors": 0,
					"norm_zscore_processors": 0,
					"rank_based_normalization_processors": 0,
					"normalization_processors": 0
				},
				"rerank_ml_processors": 0,
				"rerank_by_field_processors": 0,
				"neural_sparse_two_phase_processors": 0,
				"neural_query_enricher_processors": 0
			},
			"ingest": {
				"sparse_encoding_processors": 0,
				"skip_existing_processors": 0,
				"text_image_embedding_processors": 0,
				"text_chunking_delimiter_processors": 0,
				"text_embedding_processors_in_pipelines": 0,
				"text_chunking_fixed_token_length_processors": 0,
				"text_chunking_fixed_char_length_processors": 0,
				"text_chunking_processors": 0
			}
		}
	},
	"all_nodes": {
		"query": {
			"hybrid": {
				"hybrid_query_with_pagination_requests": 0,
				"hybrid_query_with_filter_requests": 0,
				"hybrid_query_with_inner_hits_requests": 0,
				"hybrid_query_requests": 0
			},
			"neural": {
				"neural_query_against_semantic_sparse_requests": 0,
				"neural_query_requests": 0,
				"neural_query_against_semantic_dense_requests": 0,
				"neural_query_against_knn_requests": 0
			},
			"neural_sparse": {
				"neural_sparse_query_requests": 0,
                "seismic_query_requests": 0
			}
		},
		"semantic_highlighting": {
			"semantic_highlighting_request_count": 0,
			"semantic_highlighting_batch_request_count": 0
		},
		"processors": {
			"search": {
				"neural_sparse_two_phase_executions": 0,
				"hybrid": {
					"comb_harmonic_executions": 0,
					"norm_zscore_executions": 0,
					"comb_rrf_executions": 0,
					"norm_l2_executions": 0,
					"rank_based_normalization_processor_executions": 0,
					"comb_arithmetic_executions": 0,
					"normalization_processor_executions": 0,
					"comb_geometric_executions": 0,
					"norm_minmax_executions": 0
				},
				"rerank_by_field_executions": 0,
				"neural_query_enricher_executions": 0,
				"rerank_ml_executions": 0
			},
			"ingest": {
				"skip_existing_executions": 0,
				"text_chunking_fixed_token_length_executions": 0,
				"sparse_encoding_executions": 0,
				"text_chunking_fixed_char_length_executions": 0,
				"text_chunking_executions": 0,
				"text_embedding_executions": 0,
				"semantic_field_executions": 0,
				"semantic_field_chunking_executions": 0,
				"text_chunking_delimiter_executions": 0,
				"text_image_embedding_executions": 0
			}
		},
        "memory": {
            "sparse": {
                "sparse_memory_usage": 0.13,
                "clustered_posting_usage": 0.06,
                "forward_index_usage": 0.06
            }
        }
	},
	"nodes": {
		"_cONimhxS6KdedymRZr6xg": {
			"query": {
				"hybrid": {
					"hybrid_query_with_pagination_requests": 0,
					"hybrid_query_with_filter_requests": 0,
					"hybrid_query_with_inner_hits_requests": 0,
					"hybrid_query_requests": 0
				},
				"neural": {
					"neural_query_against_semantic_sparse_requests": 0,
					"neural_query_requests": 0,
					"neural_query_against_semantic_dense_requests": 0,
					"neural_query_against_knn_requests": 0
				},
				"neural_sparse": {
					"neural_sparse_query_requests": 0,
                    "seismic_query_requests": 0
				},
                "memory": {
                    "sparse": {
                        "sparse_memory_usage_percentage": 0,
                        "sparse_memory_usage": 0.13,
                        "clustered_posting_usage": 0.06,
                        "forward_index_usage": 0.06
                    }
                }
			},
			"semantic_highlighting": {
				"semantic_highlighting_request_count": 0,
				"semantic_highlighting_batch_request_count": 0
			},
			"processors": {
				"search": {
					"neural_sparse_two_phase_executions": 0,
					"hybrid": {
						"comb_harmonic_executions": 0,
						"norm_zscore_executions": 0,
						"comb_rrf_executions": 0,
						"norm_l2_executions": 0,
						"rank_based_normalization_processor_executions": 0,
						"comb_arithmetic_executions": 0,
						"normalization_processor_executions": 0,
						"comb_geometric_executions": 0,
						"norm_minmax_executions": 0
					},
					"rerank_by_field_executions": 0,
					"neural_query_enricher_executions": 0,
					"rerank_ml_executions": 0
				},
				"ingest": {
					"skip_existing_executions": 0,
					"text_chunking_fixed_token_length_executions": 0,
					"sparse_encoding_executions": 0,
					"text_chunking_fixed_char_length_executions": 0,
					"text_chunking_executions": 0,
					"text_embedding_executions": 0,
					"semantic_field_executions": 0,
					"semantic_field_chunking_executions": 0,
					"text_chunking_delimiter_executions": 0,
					"text_image_embedding_executions": 0
				}
			}
		}
	}
}
```

</details>

If `include_metadata` is `true`, each stats object contains additional metadata:

```json
{
    ...,
    "text_embedding_executions": {
      "value": 0,
      "stat_type": "timestamped_event_counter",
      "trailing_interval_value": 0,
      "minutes_since_last_event": 29061801
    },
    ...
}
```

For more information, see [Available metadata](#available-metadata).

### Response body fields

The following sections describe response body fields.

#### Categories of statistics

The following table lists all categories of statistics.

| Category | Data type | Description |
| :--- | :--- | :--- |
| `info` | Object | Contains cluster-wide information and statistics that are not specific to individual nodes. |
| `all_nodes` | Object | Provides aggregated statistics across all nodes in the cluster. |
| `nodes` | Object | Contains node-specific statistics, with each node identified by its unique node ID. |

#### Available statistics

The following table lists the available statistics. For statistics with paths prefixed with `nodes.<node_id>`, aggregate cluster-level statistics are also available at the same path prefixed with `all_nodes`.

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `cluster_version` | `info` | `cluster_version` | The version of the cluster. |

**Info statistics: Processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `text_embedding_processors_in_pipelines` | `info` | `processors.ingest.text_embedding_processors_in_pipelines` | The number of `text_embedding` processors in ingest pipelines. |
| `sparse_encoding_processors` | `info` | `processors.ingest.sparse_encoding_processors` | The number of `sparse_encoding` processors in ingest pipelines. |
| `skip_existing_processors` | `info` | `processors.ingest.skip_existing_processors` | The number of processors with `skip_existing` set to `true` in ingest pipelines. |
| `text_image_embedding_processors` | `info` | `processors.ingest.text_image_embedding_processors` | The number of `text_image_embedding` processors in ingest pipelines. |
| `text_chunking_delimiter_processors` | `info` | `processors.ingest.text_chunking_delimiter_processors` | The number of `text_chunking` processors using the `delimiter` algorithm in ingest pipelines. |
| `text_chunking_fixed_token_length_processors` | `info` | `processors.ingest.text_chunking_fixed_token_length_processors` | The number of `text_chunking` processors using the `fixed_token_length` algorithm in ingest pipelines. |
| `text_chunking_fixed_char_length_processors` | `info` | `processors.ingest.text_chunking_fixed_char_length_processors` | The number of `text_chunking` processors using the `fixed_character_length` algorithm in ingest pipelines. |
| `text_chunking_processors` | `info` | `processors.ingest.text_chunking_processors` | The number of `text_chunking` processors in ingest pipelines. |
| `rerank_ml_processors` | `info` | `processors.search.rerank_ml_processors` | The number of `rerank` processors of the `ml_opensearch` type in search pipelines. |
| `rerank_by_field_processors` | `info` | `processors.search.rerank_by_field_processors` | The number of `rerank` processors of the `by_field` type. |
| `neural_sparse_two_phase_processors` | `info` | `processors.search.neural_sparse_two_phase_processors` | The number of `neural_sparse_two_phase_processor` processors in search pipelines. |
| `neural_query_enricher_processors` | `info` | `processors.search.neural_query_enricher_processors` | The number of `neural_query_enricher` processors in search pipelines. |

**Info statistics: Hybrid processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `normalization_processors` | `info` | `processors.search.hybrid.normalization_processors` | The number of `normalization-processor` processors. |
| `norm_minmax_processors` | `info` | `processors.search.hybrid.norm_minmax_processors` | The number of `normalization-processor` processors with `normalization.technique` set to `min_max`. |
| `norm_l2_processors` | `info` | `processors.search.hybrid.norm_l2_processors` | The number of `normalization-processor` processors with `normalization.technique` set to `l2`. |
| `norm_zscore_processors` | `info` | `processors.search.hybrid.norm_zscore_processors` | The number of `normalization-processor` processors with `normalization.technique` set to `z_score`. |
| `comb_arithmetic_processors` | `info` | `processors.search.hybrid.comb_arithmetic_processors` | The number of `normalization-processor` processors with `combination.technique` set to `arithmetic_mean`. |
| `comb_geometric_processors` | `info` | `processors.search.hybrid.comb_geometric_processors` | The number of `normalization-processor` processors with `combination.technique` set to `geometric_mean`. |
| `comb_harmonic_processors` | `info` | `processors.search.hybrid.comb_harmonic_processors` | The number of `normalization-processor` processors with `combination.technique` set to `harmonic_mean`. |
| `rank_based_normalization_processors` | `info` | `processors.search.hybrid.rank_based_normalization_processors` | The number of `score-ranker-processor` processors. |
| `comb_rrf_processors` | `info` | `processors.search.hybrid.comb_rrf_processors` | The number of `score-ranker-processor` processors with `combination.technique` set to `rrf`. |

**Node-level statistics: Processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `text_embedding_executions` | `nodes`, `all_nodes` | `processors.ingest.text_embedding_executions` | The number of `text_embedding` processor executions. |
| `skip_existing_executions` | `nodes`, `all_nodes` | `processors.ingest.skip_existing_executions` | The number of processor executions that have `skip_existing` set to `true`. |
| `text_chunking_fixed_token_length_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_fixed_token_length_executions` | The number of `text_chunking` processor executions with the `fixed_token_length` algorithm. |
| `sparse_encoding_executions` | `nodes`, `all_nodes` | `processors.ingest.sparse_encoding_executions` | The number of `sparse_encoding` processor executions. |
| `text_chunking_fixed_char_length_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_fixed_char_length_executions` | The number of `text_chunking` processor executions with the `fixed_character_length` algorithm. |
| `text_chunking_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_executions` | The number of `text_chunking` processor executions. |
| `semantic_field_executions` | `nodes`, `all_nodes` | `processors.ingest.semantic_field_executions` | The number of `semantic` field system processor executions. |
| `semantic_field_chunking_executions` | `nodes`, `all_nodes` | `processors.ingest.semantic_field_chunking_executions` | The number of `semantic` field system chunking processor executions. |
| `text_chunking_delimiter_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_delimiter_executions` | The number of `text_chunking` processor executions with the `delimiter` algorithm. |
| `text_image_embedding_executions` | `nodes`, `all_nodes` | `processors.ingest.text_image_embedding_executions` | The number of `text_image_embedding` processor executions. |
| `neural_sparse_two_phase_executions` | `nodes`, `all_nodes` | `processors.search.neural_sparse_two_phase_executions` | The number of `neural_sparse_two_phase_processor` processor executions. |
| `rerank_by_field_executions` | `nodes`, `all_nodes` | `processors.search.rerank_by_field_executions` | The number of `rerank` processor executions of the `by_field` type. |
| `neural_query_enricher_executions` | `nodes`, `all_nodes` | `processors.search.neural_query_enricher_executions` | The number of `neural_query_enricher` processor executions. |
| `rerank_ml_executions` | `nodes`, `all_nodes` | `processors.search.rerank_ml_executions` | The number of `rerank` processor executions of the `ml_opensearch` type. |

**Node-level statistics: Hybrid processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `normalization_processor_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.normalization_processor_executions` | The number of `normalization-processor` processor executions. |
| `rank_based_normalization_processor_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.rank_based_normalization_processor_executions` | The number of `score-ranker-processor` processor executions. |
| `comb_harmonic_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_harmonic_executions` | The number of `normalization-processor` processor executions with `combination.technique` set to `harmonic_mean`. |
| `norm_zscore_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.norm_zscore_executions` | The number of `normalization-processor` processor executions with `normalization.technique` set to `z_score`. |
| `comb_rrf_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_rrf_executions` | The number of `score-ranker-processor` processor executions with `combination.technique` set to `rrf`. |
| `norm_l2_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.norm_l2_executions` | The number of `normalization-processor` processor executions with `normalization.technique` set to `l2`. |
| `comb_arithmetic_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_arithmetic_executions` | The number of `normalization-processor` processor executions with `combination.technique` set to `arithmetic_mean`. |
| `comb_geometric_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_geometric_executions` | The number of `normalization-processor` processor executions with `combination.technique` set to `geometric_mean`. |
| `norm_minmax_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.norm_minmax_executions` | The number of `normalization-processor` processor executions with `normalization.technique` set to `min_max`. |

**Node-level statistics: Query**

| Statistic name | Category | Statistic path within category | Description                                                                                                                                |
| :--- | :--- | :--- |:-------------------------------------------------------------------------------------------------------------------------------------------|
| `hybrid_query_with_pagination_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_with_pagination_requests` | The number of `hybrid` query requests with pagination.                                                                                     |
| `hybrid_query_with_filter_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_with_filter_requests` | The number of `hybrid` query requests with filters.                                                                                        |
| `hybrid_query_with_inner_hits_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_with_inner_hits_requests` | The number of `hybrid` query requests with inner hits.                                                                                     |
| `hybrid_query_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_requests` | The total number of `hybrid` query requests.                                                                                               |
| `neural_query_against_semantic_sparse_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_against_semantic_sparse_requests` | The number of `neural` query requests against semantic sparse fields.                                                                      |
| `neural_query_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_requests` | The total number of `neural` query requests.                                                                                               |
| `neural_query_against_semantic_dense_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_against_semantic_dense_requests` | The number of `neural` query requests against semantic dense fields.                                                                       |
| `neural_query_against_knn_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_against_knn_requests` | The number of `neural` query requests against k-NN fields.                                                                                 |
| `neural_sparse_query_requests` | `nodes`, `all_nodes` | `query.neural_sparse.neural_sparse_query_requests` | The number of `neural_sparse` query requests against `rank_features` fields (traditional neural sparse search).                                                                                              |
| `seismic_query_requests` | `nodes`, `all_nodes` | `query.neural_sparse.seismic_query_requests` | The number of `neural_sparse` query requests against `sparse_vector` fields (neural sparse approximate nearest neighbor (ANN) search using the SEISMIC algorithm). |

**Node-level statistics: Memory**

| Statistic name | Category             | Statistic path within category                                  | Description                                                                                                 |
| :--- |:---------------------|:----------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------|
| `sparse_memory_usage_percentage` | `nodes`              | `memory.sparse.sparse_memory_usage_percentage`                  | The percentage of JVM heap memory used to store sparse data on the node relative to the maximum JVM memory. |
| `sparse_memory_usage` | `nodes`, `all_nodes` | `memory.sparse.sparse_memory_usage`                             | The amount of JVM heap memory used to store sparse data on the node, in kilobytes.                           |
| `clustered_posting_usage` | `nodes`, `all_nodes` | `memory.sparse.clustered_posting_usage`                         | The amount of JVM heap memory used to store clustered posting on the node, in kilobytes.                     |
| `forward_index_usage` | `nodes`, `all_nodes` | `memory.sparse.forward_index_usage`                            | The amount of JVM heap memory used to store the forward index on the node, in kilobytes.                         |

**Node-level statistics: Semantic highlighting**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `semantic_highlighting_request_count` | `nodes`, `all_nodes` | `semantic_highlighting.semantic_highlighting_request_count` | The number of single inference `semantic` highlighting requests (one inference call per document). See [Single inference mode]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/#basic-usage-single-inference-mode). |
| `semantic_highlighting_batch_request_count` | `nodes`, `all_nodes` | `semantic_highlighting.semantic_highlighting_batch_request_count` | The number of batch inference `semantic` highlighting requests (multiple documents processed in a single inference call). See [Batch inference mode]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/#batch-inference-mode). |

#### Available metadata

When `include_metadata` is `true`, the field values in the response are replaced by their respective metadata objects, which include additional information about the statistic types, as described in the following table. 

| Statistic type | Description |
| :--- | :--- |
| `info_string` | A basic string value that provides informational content, such as versions or names. See [`info_string`](#info-string).|
| `info_counter` | A numerical counter that represents static or slowly changing values. See [`info_counter`](#info-counter).|
| `timestamped_event_counter` | A counter that tracks events over time, including information about recent activity. See [`timestamped_event_counter`](#timestamped-event-counter).|

<p id="info-string"></p>

The `info_string` object contains the following metadata fields.

| Metadata field | Data type | Description |
| :--- | :--- | :--- |
| `value` | String | The actual string value of the statistic. |
| `stat_type` | String | Always set to `info_string`. |

<p id="info-counter"></p>

The `info_counter` object contains the following metadata fields.

| Metadata field | Data type | Description |
| :--- | :--- | :--- |
| `value` | Integer | The current count value. |
| `stat_type` | String | Always set to `info_counter`. |

<p id="timestamped-event-counter"></p>

The `timestamped_event_counter` object contains the following metadata fields.

| Metadata field | Data type | Description |
| :--- | :--- | :--- |
| `value` | Integer | The total number of events that occurred since the node started. |
| `stat_type` | String | Always set to `timestamped_event_counter`. |
| `trailing_interval_value` | Integer | The number of events that occurred in the past 5 minutes. |
| `minutes_since_last_event` | Integer | The amount of time (in minutes) since the last recorded event. |

## Warm up
**Introduced 3.3**
{: .label .label-purple }

Sparse indexes support [neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/). To maximize search efficiency, OpenSearch caches sparse data in JVM memory.

To avoid high latency during initial searches, you can run random queries during a warmup period. After the warmup period, sparse data is stored in JVM memory, and you can start production workloads. However, this approach is indirect and requires additional effort.

As an alternative, you can use the warm up API operation to avoid latency during initial searches. This operation loads all sparse data for the primary and replica shards of the specified indexes into JVM memory. The warm up API operation is idempotent: if a segment's sparse data is already loaded into memory, this operation has no effect. It only loads files not currently stored in memory.

This API operation only works with sparse indexes (indexes created with `index.sparse` set to `true`).
{: .note}

### Endpoints

```json
POST /_plugins/_neural/warmup/<index>
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<index>` | String | An index name or names (comma-separated) to warm up. Supports wildcards (`*`). Required. |

#### Example request

The following request performs a warm up operation on three indexes:

```json
POST /_plugins/_neural/warmup/index1,index2,index3
```
{% include copy-curl.html %}

You can use the warm up API operation with index patterns to clear one or more indexes that match a specified pattern from the cache:

```json
POST /_plugins/_neural/warmup/index*
```
{% include copy-curl.html %}

#### Example response

The API call returns results only after the warm up operation finishes or the request times out:

```json
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```

If the request times out, then the operation continues on the cluster. 

To monitor the warm up operation, use the OpenSearch Tasks API:

```json
GET /_tasks
```
{% include copy-curl.html %}

After the operation has finished, use the [neural stats API operation](#stats) to monitor the updated memory usage.

### Response body fields

The following table lists all response body fields.

| Field                | Data type | Description                                                      |
| :------------------- | :-------- | :--------------------------------------------------------------- |
| `_shards.total`      | Integer   | The total number of shards that OpenSearch attempted to warm up. |
| `_shards.successful` | Integer   | The number of shards that were successfully warmed up.           |
| `_shards.failed`     | Integer   | The number of shards that failed to warm up.                     |

### Best practices

To ensure that the warm up operation works properly, follow these best practices:

* Avoid running merge operations on indexes you plan to warm up: During a merge operation, OpenSearch creates new segments and may delete old ones. For example, if the warm up API operation loads sparse indexes A and B into native memory, but a merge creates a new segment C from A and B, then A and B are removed from memory but C is not yet loaded. In this case, the initial loading delay for sparse index C still occurs.

* Verify that all sparse indexes you plan to warm up can fit into JVM memory. For more information about memory limits, see [neural_search.circuit_breaker.limit]({{site.url}}{{site.baseurl}}/vector-search/settings#neural-search-plugin-settings).

## Clear cache
**Introduced 3.3**
{: .label .label-purple }

During [neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/) or warm up operations, sparse data is loaded into JVM memory. You can remove this data by deleting the corresponding index.

In contrast, decreasing the [neural search circuit breaker limit]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann#memory-and-caching-settings) does not immediately evict cached sparse data. To manually clear cached data, use the neural search clear cache API operation. This operation removes all in-memory sparse data for all shards (primaries and replicas) of the indexes specified in the request.

Similar to the [warm up operation](#warm-up), the clear cache operation is idempotent: if you attempt to clear the cache for an index that has already been evicted, the operation has no additional effect.

This API operation only works with sparse indexes (indexes created with `index.sparse` set to `true`).
{: .note}

### Endpoints

```json
POST /_plugins/_neural/clear_cache/<index>
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description                                                                                  |
| :-------- | :-------- | :------------------------------------------------------------------------------------------- |
| `<index>` | String    | An index name or names (comma-separated) for which to clear cache. Supports wildcards (`*`). Required. |

#### Example request

The following request clears the sparse data of three specified indexes from JVM memory:

```json
POST /_plugins/_neural/clear_cache/index1,index2,index3
```

{% include copy-curl.html %}

You can also use index patterns to clear one or more indexes that match a pattern:

```json
POST /_plugins/_neural/clear_cache/index*
```

{% include copy-curl.html %}

#### Example response

The API call returns results only after the clear cache operation finishes or the request times out:

```json
{
  "_shards" : {
    "total" : 6,
    "successful" : 6,
    "failed" : 0
  }
}
```

If the request times out, the operation continues running in the cluster.

To monitor the progress of the clear cache operation, use the OpenSearch Tasks API:

```json
GET /_tasks
```

{% include copy-curl.html %}

After the operation finishes, use the [neural stats API operation](#stats) to check updated memory usage.

### Response body fields

The following table lists all response body fields.

| Field                | Data type | Description                                                      |
| :------------------- | :-------- | :--------------------------------------------------------------- |
| `_shards.total`      | Integer   | The total number of shards for which OpenSearch attempted to clear cache. |
| `_shards.successful` | Integer   | The number of shards for which cache was successfully cleared.           |
| `_shards.failed`     | Integer   | The number of shards for which cache failed to clear.                     |