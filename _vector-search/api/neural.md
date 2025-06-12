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
    "plugins.neural_search.stats_enabled": "true"
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
| `include_individual_nodes` | Boolean | When `true` includes statistics for individual nodes in the `nodes` category. When `false`, excludes the `nodes` category from the response. Default is `true`. |
| `include_all_nodes` | Boolean | When `true` includes aggregated statistics across all nodes in the `all_nodes` category. When `false`, excludes the `all_nodes` category from the response. Default is `true`. |
| `include_info` | Boolean | When `true` includes cluster-wide information in the `info` category. When `false`, excludes the `info` category from the response. Default is `true`. |

#### Parameter interactions


#### Example request

```json
GET /_plugins/_neural/node1,node2/stats/stat1,stat2?include_metadata=true,flat_stat_paths=true
```
{% include copy-curl.html %}

#### Example response

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
				"neural_sparse_query_requests": 0
			}
		},
		"semantic_highlighting": {
			"semantic_highlighting_request_count": 0
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
					"neural_sparse_query_requests": 0
				}
			},
			"semantic_highlighting": {
				"semantic_highlighting_request_count": 0
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

If `include_metadata` is `true`, each stat will have additional metadata like the following

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

See Metadata section for more details

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

**Info Statistics - Processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `text_embedding_processors_in_pipelines` | `info` | `processors.ingest.text_embedding_processors_in_pipelines` | Count of text embedding processors in ingest pipelines. |
| `sparse_encoding_processors` | `info` | `processors.ingest.sparse_encoding_processors` | Count of sparse encoding processors in ingest pipelines. |
| `skip_existing_processors` | `info` | `processors.ingest.skip_existing_processors` | Count of skip existing processors in ingest pipelines. |
| `text_image_embedding_processors` | `info` | `processors.ingest.text_image_embedding_processors` | Count of text image embedding processors in ingest pipelines. |
| `text_chunking_delimiter_processors` | `info` | `processors.ingest.text_chunking_delimiter_processors` | Count of text chunking delimiter processors in ingest pipelines. |
| `text_chunking_fixed_token_length_processors` | `info` | `processors.ingest.text_chunking_fixed_token_length_processors` | Count of text chunking using fixed token length processors in ingest pipelines. |
| `text_chunking_fixed_char_length_processors` | `info` | `processors.ingest.text_chunking_fixed_char_length_processors` | Count of text chunking using fixed character length processors in ingest pipelines. |
| `text_chunking_processors` | `info` | `processors.ingest.text_chunking_processors` | Count of text chunking processors in ingest pipelines. |
| `rerank_ml_processors` | `info` | `processors.search.rerank_ml_processors` | Count of ML reranking processors. |
| `rerank_by_field_processors` | `info` | `processors.search.rerank_by_field_processors` | Count of rerank by field processors. |
| `neural_sparse_two_phase_processors` | `info` | `processors.search.neural_sparse_two_phase_processors` | Count of neural sparse two-phase processors. |
| `neural_query_enricher_processors` | `info` | `processors.search.neural_query_enricher_processors` | Count of neural query enricher processors. |

**Info Statistics - Hybrid Processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `comb_geometric_processors` | `info` | `processors.search.hybrid.comb_geometric_processors` | Count of geometric combination processors. |
| `comb_rrf_processors` | `info` | `processors.search.hybrid.comb_rrf_processors` | Count of reciprocal rank fusion (RRF) combination processors. |
| `norm_l2_processors` | `info` | `processors.search.hybrid.norm_l2_processors` | Count of L2 normalization processors. |
| `norm_minmax_processors` | `info` | `processors.search.hybrid.norm_minmax_processors` | Count of min-max normalization processors. |
| `comb_harmonic_processors` | `info` | `processors.search.hybrid.comb_harmonic_processors` | Count of harmonic combination processors. |
| `comb_arithmetic_processors` | `info` | `processors.search.hybrid.comb_arithmetic_processors` | Count of arithmetic combination processors. |
| `norm_zscore_processors` | `info` | `processors.search.hybrid.norm_zscore_processors` | Count of z-score normalization processors. |
| `rank_based_normalization_processors` | `info` | `processors.search.hybrid.rank_based_normalization_processors` | Count of rank-based normalization processors. |
| `normalization_processors` | `info` | `processors.search.hybrid.normalization_processors` | Count of normalization processors. |

**Node-level Statistics - Processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `text_embedding_executions` | `nodes`, `all_nodes` | `processors.ingest.text_embedding_executions` | Text embedding processor execution count. |
| `skip_existing_executions` | `nodes`, `all_nodes` | `processors.ingest.skip_existing_executions` | Skip existing processor execution count. |
| `text_chunking_fixed_token_length_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_fixed_token_length_executions` | Text chunking fixed token length processor execution count. |
| `sparse_encoding_executions` | `nodes`, `all_nodes` | `processors.ingest.sparse_encoding_executions` | Sparse encoding processor execution count. |
| `text_chunking_fixed_char_length_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_fixed_char_length_executions` | Text chunking fixed character length processor execution count. |
| `text_chunking_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_executions` | Text chunking processor execution count. |
| `semantic_field_executions` | `nodes`, `all_nodes` | `processors.ingest.semantic_field_executions` | Semantic field processor execution count. |
| `semantic_field_chunking_executions` | `nodes`, `all_nodes` | `processors.ingest.semantic_field_chunking_executions` | Semantic field chunking processor execution count. |
| `text_chunking_delimiter_executions` | `nodes`, `all_nodes` | `processors.ingest.text_chunking_delimiter_executions` | Text chunking delimiter processor execution count. |
| `text_image_embedding_executions` | `nodes`, `all_nodes` | `processors.ingest.text_image_embedding_executions` | Text image embedding processor execution count. |
| `neural_sparse_two_phase_executions` | `nodes`, `all_nodes` | `processors.search.neural_sparse_two_phase_executions` | Neural sparse two-phase processor execution count. |
| `rerank_by_field_executions` | `nodes`, `all_nodes` | `processors.search.rerank_by_field_executions` | Rerank by field processor execution count. |
| `neural_query_enricher_executions` | `nodes`, `all_nodes` | `processors.search.neural_query_enricher_executions` | Neural query enricher processor execution count. |
| `rerank_ml_executions` | `nodes`, `all_nodes` | `processors.search.rerank_ml_executions` | ML reranking processor execution count. |

**Node-level Statistics - Hybrid Processors**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `normalization_processor_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.normalization_processor_executions` | Normalization processor execution count. |
| `rank_based_normalization_processor_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.rank_based_normalization_processor_executions` | Rank-based normalization processor execution count. |
| `comb_harmonic_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_harmonic_executions` | Harmonic combination processor execution count. |
| `norm_zscore_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.norm_zscore_executions` | Z-score normalization processor execution count. |
| `comb_rrf_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_rrf_executions` | Reciprocal rank fusion (RRF) combination processor execution count. |
| `norm_l2_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.norm_l2_executions` | L2 normalization processor execution count. |
| `comb_arithmetic_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_arithmetic_executions` | Arithmetic combination processor execution count. |
| `comb_geometric_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.comb_geometric_executions` | Geometric combination processor execution count. |
| `norm_minmax_executions` | `nodes`, `all_nodes` | `processors.search.hybrid.norm_minmax_executions` | Min-max normalization processor execution count. |

**Node-level Statistics - Query**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `hybrid_query_with_pagination_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_with_pagination_requests` | Hybrid query requests with pagination count. |
| `hybrid_query_with_filter_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_with_filter_requests` | Hybrid query requests with filters count. |
| `hybrid_query_with_inner_hits_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_with_inner_hits_requests` | Hybrid query requests with inner hits count. |
| `hybrid_query_requests` | `nodes`, `all_nodes` | `query.hybrid.hybrid_query_requests` | Total hybrid query requests count. |
| `neural_query_against_semantic_sparse_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_against_semantic_sparse_requests` | Neural query requests against semantic sparse fields count. |
| `neural_query_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_requests` | Total neural query requests count. |
| `neural_query_against_semantic_dense_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_against_semantic_dense_requests` | Neural query requests against semantic dense fields count. |
| `neural_query_against_knn_requests` | `nodes`, `all_nodes` | `query.neural.neural_query_against_knn_requests` | Neural query requests against k-NN fields count. |
| `neural_sparse_query_requests` | `nodes`, `all_nodes` | `query.neural_sparse.neural_sparse_query_requests` | Neural sparse query requests count. |

**Node-level Statistics - Semantic Highlighting**

| Statistic name | Category | Statistic path within category | Description |
| :--- | :--- | :--- | :--- |
| `semantic_highlighting_request_count` | `nodes`, `all_nodes` | `semantic_highlighting.semantic_highlighting_request_count` | Semantic highlighting requests count. |

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
