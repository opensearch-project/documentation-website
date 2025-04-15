---
layout: default
title: Restore Snapshot
parent: Snapshot APIs

nav_order: 9
---

# Restore Snapshot
**Introduced 1.0**
{: .label .label-purple }

Restores a snapshot of a cluster or specified data streams and indices. 

* For information about indices and clusters, see [Introduction to OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/index).

* For information about data streams, see [Data streams]({{site.url}}{{site.baseurl}}/opensearch/data-streams).

If open indexes with the same name that you want to restore already exist in the cluster, you must close, delete, or rename the indexes. See [Example request](#example-request) for information about renaming an index. See [Close index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index) for information about closing an index.
{: .note}

<!-- spec_insert_start
api: snapshot.restore
component: endpoints
-->
## Endpoints
```json
POST /_snapshot/{repository}/{snapshot}/_restore
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.restore
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository containing the snapshot |
| `snapshot` | **Required** | String | The name of the snapshot to restore. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.restore
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `wait_for_completion` | Boolean | -\| Whether to return a response after the restore operation has completed. When `false`, the request returns a response when the restore operation initializes. When `true`, the request returns a response when the restore operation completes. _(Default: `false`)_ |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Explicit operation timeout for connection to cluster-manager node |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.restore
component: request_body_parameters
-->
## Request body fields

Determines which settings and indexes to restore when restoring a snapshot

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `ignore_index_settings` | Array of Strings | A comma-delimited list of index settings to ignore when restoring indexes from a snapshot. | N/A |
| `ignore_unavailable` | Boolean | How to handle data streams or indexes that are missing or closed.  When `false`, the request returns an error for any data stream or index that is missing or closed.  When `true`, the request ignores data streams and indexes in indexes that are missing or closed. | `false` |
| `include_aliases` | Boolean | How to handle index aliases from the original snapshot.  When `true`, index aliases from the original snapshot are restored.  When `false`, aliases along with associated indexes are not restored. | `true` |
| `include_global_state` | Boolean | Whether to restore the current cluster state. When `false`, the cluster state is not restored.  When `true`, the current cluster state is restored. | `false` |
| `index_settings` | Object | The index settings to be updated. | N/A |
| `indices` | Array of Strings or String | A comma-separated list of data streams, indexes, and aliases used to limit the request. Supports wildcards (`*`). To target all data streams and indexes, omit this parameter or use `*` or `_all`. | N/A |
| `partial` | Boolean | How the restore operation will behave if indexes in the snapshot do not have all primary shards available. When `false`, the entire restore operation fails if any indexes in the snapshot do not have all primary shards available. When `true`, allows the restoration of a partial snapshot of indexes with unavailable shards. Only shards that were successfully included in the snapshot are restored.  All missing shards are recreated as empty. By default, the entire restore operation fails if one or more indexes included in the snapshot do not have all primary shards available. To change this behavior, set `partial` to `true`. | `false` |
| `rename_alias_pattern` | String | The pattern to apply to the restored aliases. Aliases matching the rename pattern will be renamed according to the `rename_alias_replacement` setting. The rename pattern is applied as defined by the regular expression that supports referencing the original text. If two or more aliases are renamed into the same name, these aliases will be merged into one. | N/A |
| `rename_alias_replacement` | String | The rename replacement string for aliases. | N/A |
| `rename_pattern` | String | The pattern to apply to the restored data streams and indexes. Data streams and indexes matching the rename pattern will be renamed according to the `rename_replacement` setting. The rename pattern is applied as defined by the regular expression that supports referencing the original text. The request fails if two or more data streams or indexes are renamed into the same name. If you rename a restored data stream, its backing indexes are also renamed. For example, if you rename the logs data stream to `recovered-logs`, the backing index `.ds-logs-1` is renamed to `.ds-recovered-logs-1`. If you rename a restored stream, ensure an index template matches the new stream name. If there are no matching index template names, the stream cannot roll over and new backing indexes are not created. | N/A |
| `rename_replacement` | String | The rename replacement string. | N/A |
| `source_remote_store_repository` | String | The name of the remote store repository of the source index being restored. If not provided, the Snapshot Restore API will use the repository that was registered when the snapshot was created. | N/A |
| `storage_type` | String | Where will be the authoritative store of the restored indexes' data. A value of `local` indicates that all snapshot metadata and index data will be downloaded to local storage. A value of `remote_snapshot` indicates that snapshot metadata will be downloaded to the cluster, but the remote repository will remain the authoritative store of the index data. Data will be downloaded and cached as necessary to service queries. At least one node in the cluster must be configured with the search role in order to restore a snapshot using the type `remote_snapshot`. | `local` |

<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code>
  </summary>
  {: .text-delta}

The index settings to be updated.

`index_settings` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |
| `analysis` | Object |  |
| `analyze` | Object |  |
| `analyze.max_token_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `auto_expand_replicas` | String |  |
| `blocks` | Object |  |
| `blocks.metadata` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only_allow_delete` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.write` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `check_on_startup` | String | Valid values are: `checksum`, `false`, and `true`. |
| `codec` | String |  |
| `composite_index.star_tree` | Object |  |
| `creation_date` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `creation_date_string` | Object or String | A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation. |
| `default_pipeline` | String |  |
| `final_pipeline` | String |  |
| `format` | Float or String |  |
| `gc_deletes` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `hidden` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `highlight` | Object |  |
| `highlight.max_analyzed_offset` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `index` | Object | The index settings to be updated. |
| `indexing` | Object |  |
| `indexing_pressure` | Object |  |
| `knn` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `knn.algo_param.ef_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `lifecycle` | Object |  |
| `lifecycle.name` | String | The name of a resource or configuration element. |
| `load_fixed_bitset_filters_eagerly` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mapping` | Object |  |
| `max_docvalue_fields_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_inner_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_ngram_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_refresh_listeners` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_regex_length` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_rescore_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_script_fields` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_shingle_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_slices_per_scroll` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_terms_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `merge` | Object |  |
| `merge.scheduler.max_thread_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mode` | String |  |
| `number_of_replicas` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_routing_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `priority` | Float or String |  |
| `provided_name` | String | The name of a resource or configuration element. |
| `queries` | Object |  |
| `query_string` | Object |  |
| `query_string.lenient` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `refresh_interval` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `routing` | Object |  |
| `routing_partition_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `routing_path` | Array of Strings or String |  |
| `search` | Object |  |
| `search.idle.after` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `settings` | Object | The index settings to be updated. |
| `similarity` | Object |  |
| `soft_deletes` | Object |  |
| `soft_deletes.retention_lease.period` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `sort` | Object |  |
| `store` | Object |  |
| `top_metrics_max_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `translog` | Object |  |
| `translog.durability` | String | Valid values are: `ASYNC`, `REQUEST`, `async`, and `request`. |
| `translog.flush_threshold_size` | String | The unique identifier of a node. |
| `uuid` | String | The universally unique identifier. |
| `verified_before_close` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code>
  </summary>
  {: .text-delta}

`analysis` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `analyzer` | Object |  |
| `char_filter` | Object |  |
| `filter` | Object |  |
| `normalizer` | Object |  |
| `tokenizer` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code>
  </summary>
  {: .text-delta}

`analyzer` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `tokenizer` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `custom`. |
| `char_filter` | _Optional_ | Array of Strings |  |
| `filter` | _Optional_ | Array of Strings |  |
| `position_increment_gap` | _Optional_ | Integer |  |
| `position_offset_gap` | _Optional_ | Integer |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_output_size` | **Required** | Integer |  |
| `preserve_original` | **Required** | Boolean |  |
| `separator` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `fingerprint`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keyword`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `language` | **Required** | String | Valid values are: `Arabic`, `Armenian`, `Basque`, `Brazilian`, `Bulgarian`, `Catalan`, `Chinese`, `Cjk`, `Czech`, `Danish`, `Dutch`, `English`, `Estonian`, `Finnish`, `French`, `Galician`, `German`, `Greek`, `Hindi`, `Hungarian`, `Indonesian`, `Irish`, `Italian`, `Latvian`, `Norwegian`, `Persian`, `Portuguese`, `Romanian`, `Russian`, `Sorani`, `Spanish`, `Swedish`, `Thai`, and `Turkish`. |
| `stem_exclusion` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `language`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori`. |
| `decompound_mode` | _Optional_ | String | Valid values are: `discard`, `mixed`, and `none`. |
| `stoptags` | _Optional_ | Array of Strings |  |
| `user_dictionary` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern`. |
| `flags` | _Optional_ | String |  |
| `lowercase` | _Optional_ | Boolean |  |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `standard`. |
| `max_token_length` | _Optional_ | Integer |  |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stop`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `whitespace`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `method` | **Required** | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `mode` | **Required** | String | Valid values are: `compose`, and `decompose`. |
| `type` | **Required** | String | Valid values are: `icu_analyzer`. |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `mode` | **Required** | String | Valid values are: `extended`, `normal`, and `search`. |
| `type` | **Required** | String | Valid values are: `kuromoji`. |
| `user_dictionary` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `language` | **Required** | String | Valid values are: `Armenian`, `Basque`, `Catalan`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `German2`, `Hungarian`, `Italian`, `Kp`, `Lovins`, `Norwegian`, `Porter`, `Portuguese`, `Romanian`, `Russian`, `Spanish`, `Swedish`, and `Turkish`. |
| `type` | **Required** | String | Valid values are: `snowball`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `dutch`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |

| Property | Data type | Description |
| :--- | :--- | :--- |
| `type` | String | Valid values are: `smartcn`. |

| Property | Data type | Description |
| :--- | :--- | :--- |
| `stopwords` | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | String |  |
| `type` | String | Valid values are: `cjk`. |

| Property | Data type | Description |
| :--- | :--- | :--- |
| `phone-region` | String | Optional ISO 3166 country code, defaults to "ZZ" (unknown region). |
| `type` | String | Valid values are: `phone`, and `phone-search`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `tokenizer` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `custom`. |
| `char_filter` | _Optional_ | Array of Strings |  |
| `filter` | _Optional_ | Array of Strings |  |
| `position_increment_gap` | _Optional_ | Integer |  |
| `position_offset_gap` | _Optional_ | Integer |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_output_size` | **Required** | Integer |  |
| `preserve_original` | **Required** | Boolean |  |
| `separator` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `fingerprint`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keyword`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `language` | **Required** | String | Valid values are: `Arabic`, `Armenian`, `Basque`, `Brazilian`, `Bulgarian`, `Catalan`, `Chinese`, `Cjk`, `Czech`, `Danish`, `Dutch`, `English`, `Estonian`, `Finnish`, `French`, `Galician`, `German`, `Greek`, `Hindi`, `Hungarian`, `Indonesian`, `Irish`, `Italian`, `Latvian`, `Norwegian`, `Persian`, `Portuguese`, `Romanian`, `Russian`, `Sorani`, `Spanish`, `Swedish`, `Thai`, and `Turkish`. |
| `stem_exclusion` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `language`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori`. |
| `decompound_mode` | _Optional_ | String | Valid values are: `discard`, `mixed`, and `none`. |
| `stoptags` | _Optional_ | Array of Strings |  |
| `user_dictionary` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern`. |
| `flags` | _Optional_ | String |  |
| `lowercase` | _Optional_ | Boolean |  |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `standard`. |
| `max_token_length` | _Optional_ | Integer |  |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stop`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `whitespace`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `method` | **Required** | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `mode` | **Required** | String | Valid values are: `compose`, and `decompose`. |
| `type` | **Required** | String | Valid values are: `icu_analyzer`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `mode` | **Required** | String | Valid values are: `extended`, `normal`, and `search`. |
| `type` | **Required** | String | Valid values are: `kuromoji`. |
| `user_dictionary` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `language` | **Required** | String | Valid values are: `Armenian`, `Basque`, `Catalan`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `German2`, `Hungarian`, `Italian`, `Kp`, `Lovins`, `Norwegian`, `Porter`, `Portuguese`, `Romanian`, `Russian`, `Spanish`, `Swedish`, and `Turkish`. |
| `type` | **Required** | String | Valid values are: `snowball`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `dutch`. |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `type` | String | Valid values are: `smartcn`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `stopwords` | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | String |  |
| `type` | String | Valid values are: `cjk`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>analyzer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `phone-region` | String | Optional ISO 3166 country code, defaults to "ZZ" (unknown region). |
| `type` | String | Valid values are: `phone`, and `phone-search`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code>
  </summary>
  {: .text-delta}

`char_filter` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object or String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `html_strip`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `mapping`. |
| `mappings` | _Optional_ | Array of Strings |  |
| `mappings_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern_replace`. |
| `flags` | _Optional_ | String |  |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_normalizer`. |
| `mode` | _Optional_ | String | Valid values are: `compose`, and `decompose`. |
| `name` | _Optional_ | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `normalize_kana` | **Required** | Boolean |  |
| `normalize_kanji` | **Required** | Boolean |  |
| `type` | **Required** | String | Valid values are: `kuromoji_iteration_mark`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `html_strip`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `mapping`. |
| `mappings` | _Optional_ | Array of Strings |  |
| `mappings_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern_replace`. |
| `flags` | _Optional_ | String |  |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_normalizer`. |
| `mode` | _Optional_ | String | Valid values are: `compose`, and `decompose`. |
| `name` | _Optional_ | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `normalize_kana` | **Required** | Boolean |  |
| `normalize_kanji` | **Required** | Boolean |  |
| `type` | **Required** | String | Valid values are: `kuromoji_iteration_mark`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `html_strip`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `mapping`. |
| `mappings` | _Optional_ | Array of Strings |  |
| `mappings_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern_replace`. |
| `flags` | _Optional_ | String |  |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_normalizer`. |
| `mode` | _Optional_ | String | Valid values are: `compose`, and `decompose`. |
| `name` | _Optional_ | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>char_filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `normalize_kana` | **Required** | Boolean |  |
| `normalize_kanji` | **Required** | Boolean |  |
| `type` | **Required** | String | Valid values are: `kuromoji_iteration_mark`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code>
  </summary>
  {: .text-delta}

`filter` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object or String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `asciifolding`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `common_grams`. |
| `common_words` | _Optional_ | Array of Strings |  |
| `common_words_path` | _Optional_ | String |  |
| `ignore_case` | _Optional_ | Boolean |  |
| `query_mode` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filter` | **Required** | Array of Strings |  |
| `script` | **Required** | Object or Object or String |  |
| `type` | **Required** | String | Valid values are: `condition`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `delimited_payload`. |
| `delimiter` | _Optional_ | String |  |
| `encoding` | _Optional_ | String | Valid values are: `float`, `identity`, and `int`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `edge_ngram`. |
| `max_gram` | _Optional_ | Integer |  |
| `min_gram` | _Optional_ | Integer |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `side` | _Optional_ | String | Valid values are: `back`, and `front`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `elision`. |
| `articles` | _Optional_ | Array of Strings |  |
| `articles_case` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `articles_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `fingerprint`. |
| `max_output_size` | _Optional_ | Integer |  |
| `separator` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `locale` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `hunspell`. |
| `dedup` | _Optional_ | Boolean |  |
| `dictionary` | _Optional_ | String |  |
| `longest_only` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `hyphenation_decompounder`. |
| `hyphenation_patterns_path` | _Optional_ | String |  |
| `max_subword_size` | _Optional_ | Integer |  |
| `min_subword_size` | _Optional_ | Integer |  |
| `min_word_size` | _Optional_ | Integer |  |
| `only_longest_match` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |
| `word_list` | _Optional_ | Array of Strings |  |
| `word_list_path` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keep_types`. |
| `mode` | _Optional_ | String | Valid values are: `exclude`, and `include`. |
| `types` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keep`. |
| `keep_words` | _Optional_ | Array of Strings |  |
| `keep_words_case` | _Optional_ | Boolean |  |
| `keep_words_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keyword_marker`. |
| `ignore_case` | _Optional_ | Boolean |  |
| `keywords` | _Optional_ | Array of Strings |  |
| `keywords_path` | _Optional_ | String |  |
| `keywords_pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `kstem`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `length`. |
| `max` | _Optional_ | Integer |  |
| `min` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `limit`. |
| `consume_all_tokens` | _Optional_ | Boolean |  |
| `max_token_count` | _Optional_ | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |
| `language` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filters` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `multiplexer`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `ngram`. |
| `max_gram` | _Optional_ | Integer |  |
| `min_gram` | _Optional_ | Integer |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori_part_of_speech`. |
| `stoptags` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `patterns` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `pattern_capture`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern_replace`. |
| `all` | _Optional_ | Boolean |  |
| `flags` | _Optional_ | String |  |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `persian_stem`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `porter_stem`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `script` | **Required** | Object or Object or String |  |
| `type` | **Required** | String | Valid values are: `predicate_token_filter`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `remove_duplicates`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `reverse`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `shingle`. |
| `filler_token` | _Optional_ | String |  |
| `max_shingle_size` | _Optional_ | Float or String |  |
| `min_shingle_size` | _Optional_ | Float or String |  |
| `output_unigrams` | _Optional_ | Boolean |  |
| `output_unigrams_if_no_shingles` | _Optional_ | Boolean |  |
| `token_separator` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `language` | **Required** | String | Valid values are: `Armenian`, `Basque`, `Catalan`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `German2`, `Hungarian`, `Italian`, `Kp`, `Lovins`, `Norwegian`, `Porter`, `Portuguese`, `Romanian`, `Russian`, `Spanish`, `Swedish`, and `Turkish`. |
| `type` | **Required** | String | Valid values are: `snowball`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stemmer_override`. |
| `rules` | _Optional_ | Array of Strings |  |
| `rules_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stemmer`. |
| `language` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stop`. |
| `ignore_case` | _Optional_ | Boolean |  |
| `remove_trailing` | _Optional_ | Boolean |  |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `synonym_graph`. |
| `expand` | _Optional_ | Boolean |  |
| `format` | _Optional_ | String | Valid values are: `solr`, and `wordnet`. |
| `lenient` | _Optional_ | Boolean |  |
| `synonyms` | _Optional_ | Array of Strings |  |
| `synonyms_path` | _Optional_ | String |  |
| `tokenizer` | _Optional_ | String |  |
| `updateable` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `synonym`. |
| `expand` | _Optional_ | Boolean |  |
| `format` | _Optional_ | String | Valid values are: `solr`, and `wordnet`. |
| `lenient` | _Optional_ | Boolean |  |
| `synonyms` | _Optional_ | Array of Strings |  |
| `synonyms_path` | _Optional_ | String |  |
| `tokenizer` | _Optional_ | String |  |
| `updateable` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `trim`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `truncate`. |
| `length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `unique`. |
| `only_on_same_position` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `uppercase`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `word_delimiter_graph`. |
| `adjust_offsets` | _Optional_ | Boolean |  |
| `catenate_all` | _Optional_ | Boolean |  |
| `catenate_numbers` | _Optional_ | Boolean |  |
| `catenate_words` | _Optional_ | Boolean |  |
| `generate_number_parts` | _Optional_ | Boolean |  |
| `generate_word_parts` | _Optional_ | Boolean |  |
| `ignore_keywords` | _Optional_ | Boolean |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `protected_words` | _Optional_ | Array of Strings |  |
| `protected_words_path` | _Optional_ | String |  |
| `split_on_case_change` | _Optional_ | Boolean |  |
| `split_on_numerics` | _Optional_ | Boolean |  |
| `stem_english_possessive` | _Optional_ | Boolean |  |
| `type_table` | _Optional_ | Array of Strings |  |
| `type_table_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `word_delimiter`. |
| `catenate_all` | _Optional_ | Boolean |  |
| `catenate_numbers` | _Optional_ | Boolean |  |
| `catenate_words` | _Optional_ | Boolean |  |
| `generate_number_parts` | _Optional_ | Boolean |  |
| `generate_word_parts` | _Optional_ | Boolean |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `protected_words` | _Optional_ | Array of Strings |  |
| `protected_words_path` | _Optional_ | String |  |
| `split_on_case_change` | _Optional_ | Boolean |  |
| `split_on_numerics` | _Optional_ | Boolean |  |
| `stem_english_possessive` | _Optional_ | Boolean |  |
| `type_table` | _Optional_ | Array of Strings |  |
| `type_table_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `minimum_length` | **Required** | Integer |  |
| `type` | **Required** | String | Valid values are: `kuromoji_stemmer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `kuromoji_readingform`. |
| `use_romaji` | **Required** | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `stoptags` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `kuromoji_part_of_speech`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `rule_files` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_tokenizer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_collation`. |
| `alternate` | _Optional_ | String | Valid values are: `non-ignorable`, and `shifted`. |
| `caseFirst` | _Optional_ | String | Valid values are: `lower`, and `upper`. |
| `caseLevel` | _Optional_ | Boolean |  |
| `country` | _Optional_ | String |  |
| `decomposition` | _Optional_ | String | Valid values are: `canonical`, and `no`. |
| `hiraganaQuaternaryMode` | _Optional_ | Boolean |  |
| `language` | _Optional_ | String |  |
| `numeric` | _Optional_ | Boolean |  |
| `rules` | _Optional_ | String |  |
| `strength` | _Optional_ | String | Valid values are: `identical`, `primary`, `quaternary`, `secondary`, and `tertiary`. |
| `variableTop` | _Optional_ | String |  |
| `variant` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_folding`. |
| `unicode_set_filter` | **Required** | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `type` | **Required** | String | Valid values are: `icu_normalizer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_transform`. |
| `dir` | _Optional_ | String | Valid values are: `forward`, and `reverse`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `encoder` | **Required** | String | Valid values are: `beider_morse`, `caverphone1`, `caverphone2`, `cologne`, `daitch_mokotoff`, `double_metaphone`, `haasephonetik`, `koelnerphonetik`, `metaphone`, `nysiis`, `refined_soundex`, and `soundex`. |
| `languageset` | **Required** | Array of Strings |  |
| `name_type` | **Required** | String | Valid values are: `ashkenazi`, `generic`, and `sephardic`. |
| `rule_type` | **Required** | String | Valid values are: `approx`, and `exact`. |
| `type` | **Required** | String | Valid values are: `phonetic`. |
| `max_code_len` | _Optional_ | Integer |  |
| `replace` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `dictionary_decompounder`. |
| `hyphenation_patterns_path` | _Optional_ | String |  |
| `max_subword_size` | _Optional_ | Integer |  |
| `min_subword_size` | _Optional_ | Integer |  |
| `min_word_size` | _Optional_ | Integer |  |
| `only_longest_match` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |
| `word_list` | _Optional_ | Array of Strings |  |
| `word_list_path` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `smartcn_stop`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `asciifolding`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `common_grams`. |
| `common_words` | _Optional_ | Array of Strings |  |
| `common_words_path` | _Optional_ | String |  |
| `ignore_case` | _Optional_ | Boolean |  |
| `query_mode` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filter` | **Required** | Array of Strings |  |
| `script` | **Required** | Object or Object or String |  |
| `type` | **Required** | String | Valid values are: `condition`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `delimited_payload`. |
| `delimiter` | _Optional_ | String |  |
| `encoding` | _Optional_ | String | Valid values are: `float`, `identity`, and `int`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `edge_ngram`. |
| `max_gram` | _Optional_ | Integer |  |
| `min_gram` | _Optional_ | Integer |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `side` | _Optional_ | String | Valid values are: `back`, and `front`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `elision`. |
| `articles` | _Optional_ | Array of Strings |  |
| `articles_case` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `articles_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `fingerprint`. |
| `max_output_size` | _Optional_ | Integer |  |
| `separator` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `locale` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `hunspell`. |
| `dedup` | _Optional_ | Boolean |  |
| `dictionary` | _Optional_ | String |  |
| `longest_only` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `hyphenation_decompounder`. |
| `hyphenation_patterns_path` | _Optional_ | String |  |
| `max_subword_size` | _Optional_ | Integer |  |
| `min_subword_size` | _Optional_ | Integer |  |
| `min_word_size` | _Optional_ | Integer |  |
| `only_longest_match` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |
| `word_list` | _Optional_ | Array of Strings |  |
| `word_list_path` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keep_types`. |
| `mode` | _Optional_ | String | Valid values are: `exclude`, and `include`. |
| `types` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keep`. |
| `keep_words` | _Optional_ | Array of Strings |  |
| `keep_words_case` | _Optional_ | Boolean |  |
| `keep_words_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keyword_marker`. |
| `ignore_case` | _Optional_ | Boolean |  |
| `keywords` | _Optional_ | Array of Strings |  |
| `keywords_path` | _Optional_ | String |  |
| `keywords_pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `kstem`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `length`. |
| `max` | _Optional_ | Integer |  |
| `min` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `limit`. |
| `consume_all_tokens` | _Optional_ | Boolean |  |
| `max_token_count` | _Optional_ | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |
| `language` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filters` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `multiplexer`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `ngram`. |
| `max_gram` | _Optional_ | Integer |  |
| `min_gram` | _Optional_ | Integer |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori_part_of_speech`. |
| `stoptags` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `patterns` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `pattern_capture`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern_replace`. |
| `all` | _Optional_ | Boolean |  |
| `flags` | _Optional_ | String |  |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `persian_stem`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `porter_stem`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `script` | **Required** | Object or Object or String |  |
| `type` | **Required** | String | Valid values are: `predicate_token_filter`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `remove_duplicates`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `reverse`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `shingle`. |
| `filler_token` | _Optional_ | String |  |
| `max_shingle_size` | _Optional_ | Float or String |  |
| `min_shingle_size` | _Optional_ | Float or String |  |
| `output_unigrams` | _Optional_ | Boolean |  |
| `output_unigrams_if_no_shingles` | _Optional_ | Boolean |  |
| `token_separator` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `language` | **Required** | String | Valid values are: `Armenian`, `Basque`, `Catalan`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `German2`, `Hungarian`, `Italian`, `Kp`, `Lovins`, `Norwegian`, `Porter`, `Portuguese`, `Romanian`, `Russian`, `Spanish`, `Swedish`, and `Turkish`. |
| `type` | **Required** | String | Valid values are: `snowball`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stemmer_override`. |
| `rules` | _Optional_ | Array of Strings |  |
| `rules_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stemmer`. |
| `language` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stop`. |
| `ignore_case` | _Optional_ | Boolean |  |
| `remove_trailing` | _Optional_ | Boolean |  |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `synonym_graph`. |
| `expand` | _Optional_ | Boolean |  |
| `format` | _Optional_ | String | Valid values are: `solr`, and `wordnet`. |
| `lenient` | _Optional_ | Boolean |  |
| `synonyms` | _Optional_ | Array of Strings |  |
| `synonyms_path` | _Optional_ | String |  |
| `tokenizer` | _Optional_ | String |  |
| `updateable` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `synonym`. |
| `expand` | _Optional_ | Boolean |  |
| `format` | _Optional_ | String | Valid values are: `solr`, and `wordnet`. |
| `lenient` | _Optional_ | Boolean |  |
| `synonyms` | _Optional_ | Array of Strings |  |
| `synonyms_path` | _Optional_ | String |  |
| `tokenizer` | _Optional_ | String |  |
| `updateable` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `trim`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `truncate`. |
| `length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `unique`. |
| `only_on_same_position` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `uppercase`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `word_delimiter_graph`. |
| `adjust_offsets` | _Optional_ | Boolean |  |
| `catenate_all` | _Optional_ | Boolean |  |
| `catenate_numbers` | _Optional_ | Boolean |  |
| `catenate_words` | _Optional_ | Boolean |  |
| `generate_number_parts` | _Optional_ | Boolean |  |
| `generate_word_parts` | _Optional_ | Boolean |  |
| `ignore_keywords` | _Optional_ | Boolean |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `protected_words` | _Optional_ | Array of Strings |  |
| `protected_words_path` | _Optional_ | String |  |
| `split_on_case_change` | _Optional_ | Boolean |  |
| `split_on_numerics` | _Optional_ | Boolean |  |
| `stem_english_possessive` | _Optional_ | Boolean |  |
| `type_table` | _Optional_ | Array of Strings |  |
| `type_table_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `word_delimiter`. |
| `catenate_all` | _Optional_ | Boolean |  |
| `catenate_numbers` | _Optional_ | Boolean |  |
| `catenate_words` | _Optional_ | Boolean |  |
| `generate_number_parts` | _Optional_ | Boolean |  |
| `generate_word_parts` | _Optional_ | Boolean |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `protected_words` | _Optional_ | Array of Strings |  |
| `protected_words_path` | _Optional_ | String |  |
| `split_on_case_change` | _Optional_ | Boolean |  |
| `split_on_numerics` | _Optional_ | Boolean |  |
| `stem_english_possessive` | _Optional_ | Boolean |  |
| `type_table` | _Optional_ | Array of Strings |  |
| `type_table_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `minimum_length` | **Required** | Integer |  |
| `type` | **Required** | String | Valid values are: `kuromoji_stemmer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `kuromoji_readingform`. |
| `use_romaji` | **Required** | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `stoptags` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `kuromoji_part_of_speech`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `rule_files` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_tokenizer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_collation`. |
| `alternate` | _Optional_ | String | Valid values are: `non-ignorable`, and `shifted`. |
| `caseFirst` | _Optional_ | String | Valid values are: `lower`, and `upper`. |
| `caseLevel` | _Optional_ | Boolean |  |
| `country` | _Optional_ | String |  |
| `decomposition` | _Optional_ | String | Valid values are: `canonical`, and `no`. |
| `hiraganaQuaternaryMode` | _Optional_ | Boolean |  |
| `language` | _Optional_ | String |  |
| `numeric` | _Optional_ | Boolean |  |
| `rules` | _Optional_ | String |  |
| `strength` | _Optional_ | String | Valid values are: `identical`, `primary`, `quaternary`, `secondary`, and `tertiary`. |
| `variableTop` | _Optional_ | String |  |
| `variant` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_folding`. |
| `unicode_set_filter` | **Required** | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `type` | **Required** | String | Valid values are: `icu_normalizer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_transform`. |
| `dir` | _Optional_ | String | Valid values are: `forward`, and `reverse`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `encoder` | **Required** | String | Valid values are: `beider_morse`, `caverphone1`, `caverphone2`, `cologne`, `daitch_mokotoff`, `double_metaphone`, `haasephonetik`, `koelnerphonetik`, `metaphone`, `nysiis`, `refined_soundex`, and `soundex`. |
| `languageset` | **Required** | Array of Strings |  |
| `name_type` | **Required** | String | Valid values are: `ashkenazi`, `generic`, and `sephardic`. |
| `rule_type` | **Required** | String | Valid values are: `approx`, and `exact`. |
| `type` | **Required** | String | Valid values are: `phonetic`. |
| `max_code_len` | _Optional_ | Integer |  |
| `replace` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `dictionary_decompounder`. |
| `hyphenation_patterns_path` | _Optional_ | String |  |
| `max_subword_size` | _Optional_ | Integer |  |
| `min_subword_size` | _Optional_ | Integer |  |
| `min_word_size` | _Optional_ | Integer |  |
| `only_longest_match` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |
| `word_list` | _Optional_ | Array of Strings |  |
| `word_list_path` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `smartcn_stop`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `asciifolding`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `common_grams`. |
| `common_words` | _Optional_ | Array of Strings |  |
| `common_words_path` | _Optional_ | String |  |
| `ignore_case` | _Optional_ | Boolean |  |
| `query_mode` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filter` | **Required** | Array of Strings |  |
| `script` | **Required** | Object or Object or String |  |
| `type` | **Required** | String | Valid values are: `condition`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `source` | **Required** | String | The script source. |
| `lang` | _Optional_ | String |  |
| `options` | _Optional_ | Object |  |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier for a resource. |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `source` | **Required** | String | The script source. |
| `lang` | _Optional_ | String |  |
| `options` | _Optional_ | Object |  |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `source` | **Required** | String | The script source. |
| `lang` | _Optional_ | String |  |
| `options` | _Optional_ | Object |  |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code> > <code>options</code>
  </summary>
  {: .text-delta}

`options` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code> > <code>params</code>
  </summary>
  {: .text-delta}

Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. 

`params` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code> > <code>params</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier for a resource. |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `delimited_payload`. |
| `delimiter` | _Optional_ | String |  |
| `encoding` | _Optional_ | String | Valid values are: `float`, `identity`, and `int`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `edge_ngram`. |
| `max_gram` | _Optional_ | Integer |  |
| `min_gram` | _Optional_ | Integer |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `side` | _Optional_ | String | Valid values are: `back`, and `front`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `elision`. |
| `articles` | _Optional_ | Array of Strings |  |
| `articles_case` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `articles_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `fingerprint`. |
| `max_output_size` | _Optional_ | Integer |  |
| `separator` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `locale` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `hunspell`. |
| `dedup` | _Optional_ | Boolean |  |
| `dictionary` | _Optional_ | String |  |
| `longest_only` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `hyphenation_decompounder`. |
| `hyphenation_patterns_path` | _Optional_ | String |  |
| `max_subword_size` | _Optional_ | Integer |  |
| `min_subword_size` | _Optional_ | Integer |  |
| `min_word_size` | _Optional_ | Integer |  |
| `only_longest_match` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |
| `word_list` | _Optional_ | Array of Strings |  |
| `word_list_path` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keep_types`. |
| `mode` | _Optional_ | String | Valid values are: `exclude`, and `include`. |
| `types` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keep`. |
| `keep_words` | _Optional_ | Array of Strings |  |
| `keep_words_case` | _Optional_ | Boolean |  |
| `keep_words_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `keyword_marker`. |
| `ignore_case` | _Optional_ | Boolean |  |
| `keywords` | _Optional_ | Array of Strings |  |
| `keywords_path` | _Optional_ | String |  |
| `keywords_pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `kstem`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `length`. |
| `max` | _Optional_ | Integer |  |
| `min` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `limit`. |
| `consume_all_tokens` | _Optional_ | Boolean |  |
| `max_token_count` | _Optional_ | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |
| `language` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filters` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `multiplexer`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `ngram`. |
| `max_gram` | _Optional_ | Integer |  |
| `min_gram` | _Optional_ | Integer |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori_part_of_speech`. |
| `stoptags` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `patterns` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `pattern_capture`. |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `pattern` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `pattern_replace`. |
| `all` | _Optional_ | Boolean |  |
| `flags` | _Optional_ | String |  |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `persian_stem`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `porter_stem`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `script` | **Required** | Object or Object or String |  |
| `type` | **Required** | String | Valid values are: `predicate_token_filter`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `source` | **Required** | String | The script source. |
| `lang` | _Optional_ | String |  |
| `options` | _Optional_ | Object |  |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier for a resource. |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier for a resource. |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `remove_duplicates`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `reverse`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `shingle`. |
| `filler_token` | _Optional_ | String |  |
| `max_shingle_size` | _Optional_ | Float or String |  |
| `min_shingle_size` | _Optional_ | Float or String |  |
| `output_unigrams` | _Optional_ | Boolean |  |
| `output_unigrams_if_no_shingles` | _Optional_ | Boolean |  |
| `token_separator` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `language` | **Required** | String | Valid values are: `Armenian`, `Basque`, `Catalan`, `Danish`, `Dutch`, `English`, `Finnish`, `French`, `German`, `German2`, `Hungarian`, `Italian`, `Kp`, `Lovins`, `Norwegian`, `Porter`, `Portuguese`, `Romanian`, `Russian`, `Spanish`, `Swedish`, and `Turkish`. |
| `type` | **Required** | String | Valid values are: `snowball`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stemmer_override`. |
| `rules` | _Optional_ | Array of Strings |  |
| `rules_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stemmer`. |
| `language` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `stop`. |
| `ignore_case` | _Optional_ | Boolean |  |
| `remove_trailing` | _Optional_ | Boolean |  |
| `stopwords` | _Optional_ | Object | Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words. |
| `stopwords_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code> > <code>stopwords</code>
  </summary>
  {: .text-delta}

Language value, such as `arabic` or `thai`. Defaults to `english`. Each language value corresponds to a predefined list of stop words in Lucene. See Stop words by language for supported language values and their stop words. Also accepts an array of stop words.

`stopwords` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `synonym_graph`. |
| `expand` | _Optional_ | Boolean |  |
| `format` | _Optional_ | String | Valid values are: `solr`, and `wordnet`. |
| `lenient` | _Optional_ | Boolean |  |
| `synonyms` | _Optional_ | Array of Strings |  |
| `synonyms_path` | _Optional_ | String |  |
| `tokenizer` | _Optional_ | String |  |
| `updateable` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `synonym`. |
| `expand` | _Optional_ | Boolean |  |
| `format` | _Optional_ | String | Valid values are: `solr`, and `wordnet`. |
| `lenient` | _Optional_ | Boolean |  |
| `synonyms` | _Optional_ | Array of Strings |  |
| `synonyms_path` | _Optional_ | String |  |
| `tokenizer` | _Optional_ | String |  |
| `updateable` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `trim`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `truncate`. |
| `length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `unique`. |
| `only_on_same_position` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `uppercase`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `word_delimiter_graph`. |
| `adjust_offsets` | _Optional_ | Boolean |  |
| `catenate_all` | _Optional_ | Boolean |  |
| `catenate_numbers` | _Optional_ | Boolean |  |
| `catenate_words` | _Optional_ | Boolean |  |
| `generate_number_parts` | _Optional_ | Boolean |  |
| `generate_word_parts` | _Optional_ | Boolean |  |
| `ignore_keywords` | _Optional_ | Boolean |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `protected_words` | _Optional_ | Array of Strings |  |
| `protected_words_path` | _Optional_ | String |  |
| `split_on_case_change` | _Optional_ | Boolean |  |
| `split_on_numerics` | _Optional_ | Boolean |  |
| `stem_english_possessive` | _Optional_ | Boolean |  |
| `type_table` | _Optional_ | Array of Strings |  |
| `type_table_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `word_delimiter`. |
| `catenate_all` | _Optional_ | Boolean |  |
| `catenate_numbers` | _Optional_ | Boolean |  |
| `catenate_words` | _Optional_ | Boolean |  |
| `generate_number_parts` | _Optional_ | Boolean |  |
| `generate_word_parts` | _Optional_ | Boolean |  |
| `preserve_original` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `protected_words` | _Optional_ | Array of Strings |  |
| `protected_words_path` | _Optional_ | String |  |
| `split_on_case_change` | _Optional_ | Boolean |  |
| `split_on_numerics` | _Optional_ | Boolean |  |
| `stem_english_possessive` | _Optional_ | Boolean |  |
| `type_table` | _Optional_ | Array of Strings |  |
| `type_table_path` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `minimum_length` | **Required** | Integer |  |
| `type` | **Required** | String | Valid values are: `kuromoji_stemmer`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `kuromoji_readingform`. |
| `use_romaji` | **Required** | Boolean |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `stoptags` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `kuromoji_part_of_speech`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `rule_files` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_tokenizer`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_collation`. |
| `alternate` | _Optional_ | String | Valid values are: `non-ignorable`, and `shifted`. |
| `caseFirst` | _Optional_ | String | Valid values are: `lower`, and `upper`. |
| `caseLevel` | _Optional_ | Boolean |  |
| `country` | _Optional_ | String |  |
| `decomposition` | _Optional_ | String | Valid values are: `canonical`, and `no`. |
| `hiraganaQuaternaryMode` | _Optional_ | Boolean |  |
| `language` | _Optional_ | String |  |
| `numeric` | _Optional_ | Boolean |  |
| `rules` | _Optional_ | String |  |
| `strength` | _Optional_ | String | Valid values are: `identical`, `primary`, `quaternary`, `secondary`, and `tertiary`. |
| `variableTop` | _Optional_ | String |  |
| `variant` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `icu_folding`. |
| `unicode_set_filter` | **Required** | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | Valid values are: `nfc`, `nfkc`, and `nfkc_cf`. |
| `type` | **Required** | String | Valid values are: `icu_normalizer`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_transform`. |
| `dir` | _Optional_ | String | Valid values are: `forward`, and `reverse`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `encoder` | **Required** | String | Valid values are: `beider_morse`, `caverphone1`, `caverphone2`, `cologne`, `daitch_mokotoff`, `double_metaphone`, `haasephonetik`, `koelnerphonetik`, `metaphone`, `nysiis`, `refined_soundex`, and `soundex`. |
| `languageset` | **Required** | Array of Strings |  |
| `name_type` | **Required** | String | Valid values are: `ashkenazi`, `generic`, and `sephardic`. |
| `rule_type` | **Required** | String | Valid values are: `approx`, and `exact`. |
| `type` | **Required** | String | Valid values are: `phonetic`. |
| `max_code_len` | _Optional_ | Integer |  |
| `replace` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `dictionary_decompounder`. |
| `hyphenation_patterns_path` | _Optional_ | String |  |
| `max_subword_size` | _Optional_ | Integer |  |
| `min_subword_size` | _Optional_ | Integer |  |
| `min_word_size` | _Optional_ | Integer |  |
| `only_longest_match` | _Optional_ | Boolean |  |
| `version` | _Optional_ | String |  |
| `word_list` | _Optional_ | Array of Strings |  |
| `word_list_path` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>filter</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `smartcn_stop`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>normalizer</code>
  </summary>
  {: .text-delta}

`normalizer` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>normalizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `custom`. |
| `char_filter` | _Optional_ | Array of Strings |  |
| `filter` | _Optional_ | Array of Strings |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>normalizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>normalizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `custom`. |
| `char_filter` | _Optional_ | Array of Strings |  |
| `filter` | _Optional_ | Array of Strings |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code>
  </summary>
  {: .text-delta}

`tokenizer` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object or String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `tokenize_on_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `char_group`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_gram` | **Required** | Integer |  |
| `min_gram` | **Required** | Integer |  |
| `token_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `edge_ngram`. |
| `custom_token_chars` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `buffer_size` | **Required** | Integer |  |
| `type` | **Required** | String | Valid values are: `keyword`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `letter`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_gram` | **Required** | Integer |  |
| `min_gram` | **Required** | Integer |  |
| `token_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `ngram`. |
| `custom_token_chars` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori_tokenizer`. |
| `decompound_mode` | _Optional_ | String | Valid values are: `discard`, `mixed`, and `none`. |
| `discard_punctuation` | _Optional_ | Boolean |  |
| `user_dictionary` | _Optional_ | String |  |
| `user_dictionary_rules` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `buffer_size` | **Required** | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `delimiter` | **Required** | String |  |
| `reverse` | **Required** | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `skip` | **Required** | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `type` | **Required** | String | Valid values are: `path_hierarchy`. |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `standard`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `uax_url_email`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `whitespace`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `mode` | **Required** | String | Valid values are: `extended`, `normal`, and `search`. |
| `type` | **Required** | String | Valid values are: `kuromoji_tokenizer`. |
| `discard_compound_token` | _Optional_ | Boolean |  |
| `discard_punctuation` | _Optional_ | Boolean |  |
| `nbest_cost` | _Optional_ | Integer |  |
| `nbest_examples` | _Optional_ | String |  |
| `user_dictionary` | _Optional_ | String |  |
| `user_dictionary_rules` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `pattern`. |
| `flags` | _Optional_ | String |  |
| `group` | _Optional_ | Integer |  |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple_pattern`. |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple_pattern_split`. |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `rule_files` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_tokenizer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `smartcn_tokenizer`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `tokenize_on_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `char_group`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_gram` | **Required** | Integer |  |
| `min_gram` | **Required** | Integer |  |
| `token_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `edge_ngram`. |
| `custom_token_chars` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `buffer_size` | **Required** | Integer |  |
| `type` | **Required** | String | Valid values are: `keyword`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `letter`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_gram` | **Required** | Integer |  |
| `min_gram` | **Required** | Integer |  |
| `token_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `ngram`. |
| `custom_token_chars` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori_tokenizer`. |
| `decompound_mode` | _Optional_ | String | Valid values are: `discard`, `mixed`, and `none`. |
| `discard_punctuation` | _Optional_ | Boolean |  |
| `user_dictionary` | _Optional_ | String |  |
| `user_dictionary_rules` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `buffer_size` | **Required** | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `delimiter` | **Required** | String |  |
| `reverse` | **Required** | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `skip` | **Required** | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `type` | **Required** | String | Valid values are: `path_hierarchy`. |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `standard`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `uax_url_email`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `whitespace`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `mode` | **Required** | String | Valid values are: `extended`, `normal`, and `search`. |
| `type` | **Required** | String | Valid values are: `kuromoji_tokenizer`. |
| `discard_compound_token` | _Optional_ | Boolean |  |
| `discard_punctuation` | _Optional_ | Boolean |  |
| `nbest_cost` | _Optional_ | Integer |  |
| `nbest_examples` | _Optional_ | String |  |
| `user_dictionary` | _Optional_ | String |  |
| `user_dictionary_rules` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `pattern`. |
| `flags` | _Optional_ | String |  |
| `group` | _Optional_ | Integer |  |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple_pattern`. |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple_pattern_split`. |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `rule_files` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_tokenizer`. |
| `version` | _Optional_ | String |  |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `smartcn_tokenizer`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `tokenize_on_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `char_group`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_gram` | **Required** | Integer |  |
| `min_gram` | **Required** | Integer |  |
| `token_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `edge_ngram`. |
| `custom_token_chars` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `buffer_size` | **Required** | Integer |  |
| `type` | **Required** | String | Valid values are: `keyword`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `letter`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `lowercase`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `max_gram` | **Required** | Integer |  |
| `min_gram` | **Required** | Integer |  |
| `token_chars` | **Required** | Array of Strings |  |
| `type` | **Required** | String | Valid values are: `ngram`. |
| `custom_token_chars` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `nori_tokenizer`. |
| `decompound_mode` | _Optional_ | String | Valid values are: `discard`, `mixed`, and `none`. |
| `discard_punctuation` | _Optional_ | Boolean |  |
| `user_dictionary` | _Optional_ | String |  |
| `user_dictionary_rules` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `buffer_size` | **Required** | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `delimiter` | **Required** | String |  |
| `reverse` | **Required** | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `skip` | **Required** | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `type` | **Required** | String | Valid values are: `path_hierarchy`. |
| `replacement` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `standard`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `uax_url_email`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `whitespace`. |
| `max_token_length` | _Optional_ | Integer |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `mode` | **Required** | String | Valid values are: `extended`, `normal`, and `search`. |
| `type` | **Required** | String | Valid values are: `kuromoji_tokenizer`. |
| `discard_compound_token` | _Optional_ | Boolean |  |
| `discard_punctuation` | _Optional_ | Boolean |  |
| `nbest_cost` | _Optional_ | Integer |  |
| `nbest_examples` | _Optional_ | String |  |
| `user_dictionary` | _Optional_ | String |  |
| `user_dictionary_rules` | _Optional_ | Array of Strings |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `pattern`. |
| `flags` | _Optional_ | String |  |
| `group` | _Optional_ | Integer |  |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple_pattern`. |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `simple_pattern_split`. |
| `pattern` | _Optional_ | String |  |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `rule_files` | **Required** | String |  |
| `type` | **Required** | String | Valid values are: `icu_tokenizer`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analysis</code> > <code>tokenizer</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | Valid values are: `smartcn_tokenizer`. |
| `version` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>analyze</code>
  </summary>
  {: .text-delta}

`analyze` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_token_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>blocks</code>
  </summary>
  {: .text-delta}

`blocks` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `metadata` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `read` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `read_only` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `read_only_allow_delete` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `write` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>composite_index.star_tree</code>
  </summary>
  {: .text-delta}

`composite_index.star_tree` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `default` | Object |  |
| `field` | Object |  |
| `max_fields` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>composite_index.star_tree</code> > <code>default</code>
  </summary>
  {: .text-delta}

`default` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_leaf_docs` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>composite_index.star_tree</code> > <code>field</code>
  </summary>
  {: .text-delta}

`field` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `default` | Object |  |
| `max_base_metrics` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_date_intervals` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_dimensions` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>composite_index.star_tree</code> > <code>field</code> > <code>default</code>
  </summary>
  {: .text-delta}

`default` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `date_intervals` | Array of Strings |  |
| `metrics` | Array of Strings |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>creation_date_string</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`creation_date_string` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>creation_date_string</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`creation_date_string` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>creation_date_string</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`creation_date_string` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>highlight</code>
  </summary>
  {: .text-delta}

`highlight` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_analyzed_offset` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code>
  </summary>
  {: .text-delta}

The index settings to be updated.

`index` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |
| `analysis` | Object |  |
| `analyze` | Object |  |
| `analyze.max_token_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `auto_expand_replicas` | String |  |
| `blocks` | Object |  |
| `blocks.metadata` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only_allow_delete` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.write` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `check_on_startup` | String | Valid values are: `checksum`, `false`, and `true`. |
| `codec` | String |  |
| `composite_index.star_tree` | Object |  |
| `creation_date` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `creation_date_string` | Object or String | A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation. |
| `default_pipeline` | String |  |
| `final_pipeline` | String |  |
| `format` | Float or String |  |
| `gc_deletes` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `hidden` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `highlight` | Object |  |
| `highlight.max_analyzed_offset` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `index` | Object | The index settings to be updated. |
| `indexing` | Object |  |
| `indexing_pressure` | Object |  |
| `knn` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `knn.algo_param.ef_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `lifecycle` | Object |  |
| `lifecycle.name` | String | The name of a resource or configuration element. |
| `load_fixed_bitset_filters_eagerly` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mapping` | Object |  |
| `max_docvalue_fields_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_inner_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_ngram_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_refresh_listeners` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_regex_length` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_rescore_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_script_fields` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_shingle_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_slices_per_scroll` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_terms_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `merge` | Object |  |
| `merge.scheduler.max_thread_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mode` | String |  |
| `number_of_replicas` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_routing_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `priority` | Float or String |  |
| `provided_name` | String | The name of a resource or configuration element. |
| `queries` | Object |  |
| `query_string` | Object |  |
| `query_string.lenient` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `refresh_interval` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `routing` | Object |  |
| `routing_partition_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `routing_path` | Array of Strings or String |  |
| `search` | Object |  |
| `search.idle.after` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `settings` | Object | The index settings to be updated. |
| `similarity` | Object |  |
| `soft_deletes` | Object |  |
| `soft_deletes.retention_lease.period` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `sort` | Object |  |
| `store` | Object |  |
| `top_metrics_max_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `translog` | Object |  |
| `translog.durability` | String | Valid values are: `ASYNC`, `REQUEST`, `async`, and `request`. |
| `translog.flush_threshold_size` | String | The unique identifier of a node. |
| `uuid` | String | The universally unique identifier. |
| `verified_before_close` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>indexing</code>
  </summary>
  {: .text-delta}

`indexing` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `slowlog` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>indexing</code> > <code>slowlog</code>
  </summary>
  {: .text-delta}

`slowlog` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `level` | String |  |
| `reformat` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `source` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `threshold` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>indexing</code> > <code>slowlog</code> > <code>threshold</code>
  </summary>
  {: .text-delta}

`threshold` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `index` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>indexing</code> > <code>slowlog</code> > <code>threshold</code> > <code>index</code>
  </summary>
  {: .text-delta}

`index` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `debug` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `info` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `trace` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `warn` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>indexing_pressure</code>
  </summary>
  {: .text-delta}

`indexing_pressure` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `memory` | **Required** | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>indexing_pressure</code> > <code>memory</code>
  </summary>
  {: .text-delta}

`memory` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `limit` | Integer or String | Number of outstanding bytes that may be consumed by indexing requests. When this limit is reached or exceeded, the node will reject new coordinating and primary operations. When replica operations consume 1.5x this limit, the node will reject new replica operations. Defaults to 10% of the heap. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>lifecycle</code>
  </summary>
  {: .text-delta}

`lifecycle` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | The name of a resource or configuration element. |
| `indexing_complete` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `origination_date` | _Optional_ | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `parse_origination_date` | _Optional_ | Boolean | Set to `true` to parse the origination date from the index name. This origination date is used to calculate the index age for its phase transitions. The index name must match the pattern `^.*-{date_format}-\\d+`, where the `date_format` is `yyyy.MM.dd` and the trailing digits are optional. An index that was rolled over would normally match the full format, for example `logs-2016.10.31-000002`). If the index name doesn't match the pattern, index creation fails. |
| `rollover_alias` | _Optional_ | String | The index alias to update when the index rolls over. Specify when using a policy that contains a rollover action. When the index rolls over, the alias is updated to reflect that the index is no longer the write index. For more information about rolling indexes, see Rollover. |
| `step` | _Optional_ | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>lifecycle</code> > <code>step</code>
  </summary>
  {: .text-delta}

`step` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `wait_time_threshold` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>mapping</code>
  </summary>
  {: .text-delta}

`mapping` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `coerce` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `depth` | Object |  |
| `dimension_fields` | Object |  |
| `field_name_length` | Object |  |
| `ignore_malformed` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `nested_fields` | Object |  |
| `nested_objects` | Object |  |
| `total_fields` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>mapping</code> > <code>depth</code>
  </summary>
  {: .text-delta}

`depth` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `limit` | Integer or String | The maximum depth for a field, which is measured as the number of inner objects. For instance, if all fields are defined at the root object level, then the depth is `1`. If there is one object mapping, then the depth is `2`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>mapping</code> > <code>dimension_fields</code>
  </summary>
  {: .text-delta}

`dimension_fields` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `limit` | Integer or String | [preview] This functionality is in technical preview and may be changed or removed in a future release. OpenSearch will work to fix any issues, but features in technical preview are not subject to the support SLA of official GA features. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>mapping</code> > <code>field_name_length</code>
  </summary>
  {: .text-delta}

`field_name_length` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `limit` | Integer or String | Setting for the maximum length of a field name. This setting isn't really something that addresses mappings explosion but might still be useful if you want to limit the field length. It usually shouldn't be necessary to set this setting. The default is okay unless a user starts to add a huge number of fields with really long names. Default is `Long.MAX_VALUE` (no limit). |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>mapping</code> > <code>nested_fields</code>
  </summary>
  {: .text-delta}

`nested_fields` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `limit` | Integer or String | The maximum number of distinct nested mappings in an index. The nested type should only be used in special cases, when arrays of objects need to be queried independently of each other. To safeguard against poorly designed mappings, this setting limits the number of unique nested types per index. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>mapping</code> > <code>nested_objects</code>
  </summary>
  {: .text-delta}

`nested_objects` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `limit` | Integer or String | The maximum number of nested JSON objects that a single document can contain across all nested types. This limit helps to prevent out of memory errors when a document contains too many nested objects. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>mapping</code> > <code>total_fields</code>
  </summary>
  {: .text-delta}

`total_fields` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `limit` | Integer or String | The maximum number of fields in an index. Field and object mappings, as well as field aliases count towards this limit. The limit is in place to prevent mappings and searches from becoming too large. Higher values can lead to performance degradations and memory issues, especially in clusters with a high load or few resources. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>merge</code>
  </summary>
  {: .text-delta}

`merge` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `log_byte_size_policy` | Object |  |
| `policy` | Object or String | Valid values are: `default`, `log_byte_size`, and `tiered`. |
| `policy.deletes_pct_allowed` | Float or String |  |
| `policy.expunge_deletes_allowed` | Float or String |  |
| `policy.floor_segment` | String | The unique identifier of a node. |
| `policy.max_merge_at_once` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `policy.max_merged_segment` | String | The unique identifier of a node. |
| `policy.reclaim_deletes_weight` | Float or String |  |
| `policy.segments_per_tier` | Float or String |  |
| `scheduler` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>merge</code> > <code>log_byte_size_policy</code>
  </summary>
  {: .text-delta}

`log_byte_size_policy` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_merge_segment` | String | The unique identifier of a node. |
| `max_merge_segment_forced_merge` | String | The unique identifier of a node. |
| `max_merged_docs` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `merge_factor` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `min_merge` | String | The unique identifier of a node. |
| `no_cfs_ratio` | Float or String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>merge</code> > <code>policy</code>
  </summary>
  {: .text-delta}

`policy` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Data type | Description |
| :--- | :--- | :--- |
| `deletes_pct_allowed` | Float or String |  |
| `expunge_deletes_allowed` | Float or String |  |
| `floor_segment` | String | The unique identifier of a node. |
| `max_merge_at_once` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_merge_at_once_explicit` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_merged_segment` | String | The unique identifier of a node. |
| `reclaim_deletes_weight` | Float or String |  |
| `segments_per_tier` | Float or String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>merge</code> > <code>policy</code>
  </summary>
  {: .text-delta}

`policy` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>merge</code> > <code>policy</code>
  </summary>
  {: .text-delta}

`policy` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `deletes_pct_allowed` | Float or String |  |
| `expunge_deletes_allowed` | Float or String |  |
| `floor_segment` | String | The unique identifier of a node. |
| `max_merge_at_once` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_merge_at_once_explicit` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_merged_segment` | String | The unique identifier of a node. |
| `reclaim_deletes_weight` | Float or String |  |
| `segments_per_tier` | Float or String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>merge</code> > <code>scheduler</code>
  </summary>
  {: .text-delta}

`scheduler` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `auto_throttle` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_merge_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_thread_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>queries</code>
  </summary>
  {: .text-delta}

`queries` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `cache` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>queries</code> > <code>cache</code>
  </summary>
  {: .text-delta}

`cache` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `enabled` | **Required** | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>query_string</code>
  </summary>
  {: .text-delta}

`query_string` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `lenient` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>routing</code>
  </summary>
  {: .text-delta}

`routing` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `allocation` | Object |  |
| `rebalance` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>routing</code> > <code>allocation</code>
  </summary>
  {: .text-delta}

`allocation` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `disk` | Object |  |
| `enable` | String | Valid values are: `all`, `new_primaries`, `none`, and `primaries`. |
| `include` | Object |  |
| `initial_recovery` | Object |  |
| `total_primary_shards_per_node` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `total_shards_per_node` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>routing</code> > <code>allocation</code> > <code>disk</code>
  </summary>
  {: .text-delta}

`disk` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `threshold_enabled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>routing</code> > <code>allocation</code> > <code>include</code>
  </summary>
  {: .text-delta}

`include` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `_id` | String | The unique identifier for a resource. |
| `_tier_preference` | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>routing</code> > <code>allocation</code> > <code>initial_recovery</code>
  </summary>
  {: .text-delta}

`initial_recovery` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `_id` | String | The unique identifier for a resource. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>routing</code> > <code>rebalance</code>
  </summary>
  {: .text-delta}

`rebalance` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `enable` | **Required** | String | Valid values are: `all`, `none`, `primaries`, and `replicas`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code>
  </summary>
  {: .text-delta}

`search` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `concurrent` | Object |  |
| `concurrent_segment_search` | Object |  |
| `default_pipeline` | String |  |
| `idle` | Object |  |
| `slowlog` | Object |  |
| `throttled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code> > <code>concurrent</code>
  </summary>
  {: .text-delta}

`concurrent` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_slice_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code> > <code>concurrent_segment_search</code>
  </summary>
  {: .text-delta}

`concurrent_segment_search` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `enabled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mode` | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code> > <code>idle</code>
  </summary>
  {: .text-delta}

`idle` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `after` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code> > <code>slowlog</code>
  </summary>
  {: .text-delta}

`slowlog` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `level` | String |  |
| `reformat` | Boolean |  |
| `threshold` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code> > <code>slowlog</code> > <code>threshold</code>
  </summary>
  {: .text-delta}

`threshold` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `fetch` | Object |  |
| `query` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code> > <code>slowlog</code> > <code>threshold</code> > <code>fetch</code>
  </summary>
  {: .text-delta}

`fetch` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `debug` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `info` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `trace` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `warn` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>search</code> > <code>slowlog</code> > <code>threshold</code> > <code>query</code>
  </summary>
  {: .text-delta}

`query` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `debug` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `info` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `trace` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `warn` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code>
  </summary>
  {: .text-delta}

The index settings to be updated.

`settings` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |
| `analysis` | Object |  |
| `analyze` | Object |  |
| `analyze.max_token_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `auto_expand_replicas` | String |  |
| `blocks` | Object |  |
| `blocks.metadata` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only_allow_delete` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.write` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `check_on_startup` | String | Valid values are: `checksum`, `false`, and `true`. |
| `codec` | String |  |
| `composite_index.star_tree` | Object |  |
| `creation_date` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `creation_date_string` | Object or String | A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation. |
| `default_pipeline` | String |  |
| `final_pipeline` | String |  |
| `format` | Float or String |  |
| `gc_deletes` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `hidden` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `highlight` | Object |  |
| `highlight.max_analyzed_offset` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `index` | Object | The index settings to be updated. |
| `indexing` | Object |  |
| `indexing_pressure` | Object |  |
| `knn` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `knn.algo_param.ef_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `lifecycle` | Object |  |
| `lifecycle.name` | String | The name of a resource or configuration element. |
| `load_fixed_bitset_filters_eagerly` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mapping` | Object |  |
| `max_docvalue_fields_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_inner_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_ngram_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_refresh_listeners` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_regex_length` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_rescore_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_script_fields` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_shingle_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_slices_per_scroll` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_terms_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `merge` | Object |  |
| `merge.scheduler.max_thread_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mode` | String |  |
| `number_of_replicas` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_routing_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `priority` | Float or String |  |
| `provided_name` | String | The name of a resource or configuration element. |
| `queries` | Object |  |
| `query_string` | Object |  |
| `query_string.lenient` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `refresh_interval` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `routing` | Object |  |
| `routing_partition_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `routing_path` | Array of Strings or String |  |
| `search` | Object |  |
| `search.idle.after` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `settings` | Object | The index settings to be updated. |
| `similarity` | Object |  |
| `soft_deletes` | Object |  |
| `soft_deletes.retention_lease.period` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `sort` | Object |  |
| `store` | Object |  |
| `top_metrics_max_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `translog` | Object |  |
| `translog.durability` | String | Valid values are: `ASYNC`, `REQUEST`, `async`, and `request`. |
| `translog.flush_threshold_size` | String | The unique identifier of a node. |
| `uuid` | String | The universally unique identifier. |
| `verified_before_close` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code>
  </summary>
  {: .text-delta}

`similarity` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `bm25` | Object |  |
| `dfi` | Object |  |
| `dfr` | Object |  |
| `ib` | Object |  |
| `lmd` | Object |  |
| `lmj` | Object |  |
| `scripted_tfidf` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>bm25</code>
  </summary>
  {: .text-delta}

`bm25` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `b` | **Required** | Float |  |
| `discount_overlaps` | **Required** | Boolean |  |
| `k1` | **Required** | Float |  |
| `type` | **Required** | String | Valid values are: `BM25`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>dfi</code>
  </summary>
  {: .text-delta}

`dfi` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `independence_measure` | **Required** | String | Valid values are: <br> - `chisquared`: The chi-squared measure of independence. <br> - `saturated`: The saturated measure of independence. <br> - `standardized`: The standardized measure of independence. |
| `type` | **Required** | String | Valid values are: `DFI`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>dfr</code>
  </summary>
  {: .text-delta}

`dfr` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `after_effect` | **Required** | String | Valid values are: <br> - `b`: The basic after effect. <br> - `l`: The Laplace after effect. <br> - `no`: No after effect. |
| `basic_model` | **Required** | String | Valid values are: <br> - `be`: The Bose-Einstein model. <br> - `d`: The divergence from independence model. <br> - `g`: The geometric model. <br> - `if`: The inverse frequency model. <br> - `in`: The inverse document frequency model. <br> - `ine`: The inverse expected document frequency model. <br> - `p`: The Poisson model. |
| `normalization` | **Required** | String | Valid values are: <br> - `h1`: The first normalization of Hazm. <br> - `h2`: The second normalization of Hazm. <br> - `h3`: The third normalization of Hazm. <br> - `no`: No normalization. <br> - `z`: The Zipfian normalization. |
| `type` | **Required** | String | Valid values are: `DFR`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>ib</code>
  </summary>
  {: .text-delta}

`ib` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `distribution` | **Required** | String | Valid values are: <br> - `ll`: The log-logistic distribution. <br> - `spl`: The smoothed power-law distribution. |
| `lambda` | **Required** | String | Valid values are: <br> - `df`: The document frequency Lambda. <br> - `ttf`: The total term frequency Lambda. |
| `normalization` | **Required** | String | Valid values are: <br> - `h1`: The first normalization of Hazm. <br> - `h2`: The second normalization of Hazm. <br> - `h3`: The third normalization of Hazm. <br> - `no`: No normalization. <br> - `z`: The Zipfian normalization. |
| `type` | **Required** | String | Valid values are: `IB`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>lmd</code>
  </summary>
  {: .text-delta}

`lmd` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `mu` | **Required** | Float |  |
| `type` | **Required** | String | Valid values are: `LMDirichlet`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>lmj</code>
  </summary>
  {: .text-delta}

`lmj` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `lambda` | **Required** | Float |  |
| `type` | **Required** | String | Valid values are: `LMJelinekMercer`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>scripted_tfidf</code>
  </summary>
  {: .text-delta}

`scripted_tfidf` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `script` | **Required** | Object or Object or String |  |
| `type` | **Required** | String | Valid values are: `scripted`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>scripted_tfidf</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `source` | **Required** | String | The script source. |
| `lang` | _Optional_ | String |  |
| `options` | _Optional_ | Object |  |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier for a resource. |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>similarity</code> > <code>scripted_tfidf</code> > <code>script</code>
  </summary>
  {: .text-delta}

`script` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier for a resource. |
| `params` | _Optional_ | Object | Specifies any named parameters that are passed into the script as variables.  Use parameters instead of hard-coded values to decrease compilation time. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>soft_deletes</code>
  </summary>
  {: .text-delta}

`soft_deletes` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `enabled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `retention` | Object |  |
| `retention_lease` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>soft_deletes</code> > <code>retention</code>
  </summary>
  {: .text-delta}

`retention` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `operations` | Integer or String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>soft_deletes</code> > <code>retention_lease</code>
  </summary>
  {: .text-delta}

`retention_lease` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `period` | **Required** | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>sort</code>
  </summary>
  {: .text-delta}

`sort` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `field` | Array of Strings or String |  |
| `missing` | Array of Strings or String | Valid values are: `_first`, and `_last`. |
| `mode` | Array of Strings or String | Valid values are: `max`, and `min`. |
| `order` | Array of Strings or String | Valid values are: `asc`, and `desc`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>store</code>
  </summary>
  {: .text-delta}

`store` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String |  |
| `allow_mmap` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `fs` | _Optional_ | Object |  |
| `hybrid` | _Optional_ | Object |  |
| `preload` | _Optional_ | Array of Strings |  |
| `stats_refresh_interval` | _Optional_ | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>store</code> > <code>fs</code>
  </summary>
  {: .text-delta}

`fs` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `fs_lock` | String | Valid values are: `native`, and `simple`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>store</code> > <code>hybrid</code>
  </summary>
  {: .text-delta}

`hybrid` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `mmap` | Object |  |
| `nio` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>store</code> > <code>hybrid</code> > <code>mmap</code>
  </summary>
  {: .text-delta}

`mmap` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `extensions` | Array of Strings |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>store</code> > <code>hybrid</code> > <code>nio</code>
  </summary>
  {: .text-delta}

`nio` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `extensions` | Array of Strings |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>translog</code>
  </summary>
  {: .text-delta}

`translog` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `durability` | String | Valid values are: `ASYNC`, `REQUEST`, `async`, and `request`. |
| `flush_threshold_size` | String | The unique identifier of a node. |
| `generation_threshold_size` | String | The unique identifier of a node. |
| `retention` | Object |  |
| `sync_interval` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>translog</code> > <code>retention</code>
  </summary>
  {: .text-delta}

`retention` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `age` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `size` | String | The unique identifier of a node. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>version</code>
  </summary>
  {: .text-delta}

`version` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `created` | String |  |
| `created_string` | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>settings</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>similarity</code>
  </summary>
  {: .text-delta}

`similarity` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `bm25` | Object |  |
| `dfi` | Object |  |
| `dfr` | Object |  |
| `ib` | Object |  |
| `lmd` | Object |  |
| `lmj` | Object |  |
| `scripted_tfidf` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>soft_deletes</code>
  </summary>
  {: .text-delta}

`soft_deletes` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `enabled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `retention` | Object |  |
| `retention_lease` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>sort</code>
  </summary>
  {: .text-delta}

`sort` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `field` | Array of Strings or String |  |
| `missing` | Array of Strings or String | Valid values are: `_first`, and `_last`. |
| `mode` | Array of Strings or String | Valid values are: `max`, and `min`. |
| `order` | Array of Strings or String | Valid values are: `asc`, and `desc`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>store</code>
  </summary>
  {: .text-delta}

`store` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String |  |
| `allow_mmap` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `fs` | _Optional_ | Object |  |
| `hybrid` | _Optional_ | Object |  |
| `preload` | _Optional_ | Array of Strings |  |
| `stats_refresh_interval` | _Optional_ | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>translog</code>
  </summary>
  {: .text-delta}

`translog` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `durability` | String | Valid values are: `ASYNC`, `REQUEST`, `async`, and `request`. |
| `flush_threshold_size` | String | The unique identifier of a node. |
| `generation_threshold_size` | String | The unique identifier of a node. |
| `retention` | Object |  |
| `sync_interval` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>version</code>
  </summary>
  {: .text-delta}

`version` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `created` | String |  |
| `created_string` | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>index</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>indexing</code>
  </summary>
  {: .text-delta}

`indexing` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `slowlog` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>indexing_pressure</code>
  </summary>
  {: .text-delta}

`indexing_pressure` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `memory` | **Required** | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>lifecycle</code>
  </summary>
  {: .text-delta}

`lifecycle` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | The name of a resource or configuration element. |
| `indexing_complete` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `origination_date` | _Optional_ | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `parse_origination_date` | _Optional_ | Boolean | Set to `true` to parse the origination date from the index name. This origination date is used to calculate the index age for its phase transitions. The index name must match the pattern `^.*-{date_format}-\\d+`, where the `date_format` is `yyyy.MM.dd` and the trailing digits are optional. An index that was rolled over would normally match the full format, for example `logs-2016.10.31-000002`). If the index name doesn't match the pattern, index creation fails. |
| `rollover_alias` | _Optional_ | String | The index alias to update when the index rolls over. Specify when using a policy that contains a rollover action. When the index rolls over, the alias is updated to reflect that the index is no longer the write index. For more information about rolling indexes, see Rollover. |
| `step` | _Optional_ | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>mapping</code>
  </summary>
  {: .text-delta}

`mapping` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `coerce` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `depth` | Object |  |
| `dimension_fields` | Object |  |
| `field_name_length` | Object |  |
| `ignore_malformed` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `nested_fields` | Object |  |
| `nested_objects` | Object |  |
| `total_fields` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>merge</code>
  </summary>
  {: .text-delta}

`merge` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `log_byte_size_policy` | Object |  |
| `policy` | Object or String | Valid values are: `default`, `log_byte_size`, and `tiered`. |
| `policy.deletes_pct_allowed` | Float or String |  |
| `policy.expunge_deletes_allowed` | Float or String |  |
| `policy.floor_segment` | String | The unique identifier of a node. |
| `policy.max_merge_at_once` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `policy.max_merged_segment` | String | The unique identifier of a node. |
| `policy.reclaim_deletes_weight` | Float or String |  |
| `policy.segments_per_tier` | Float or String |  |
| `scheduler` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>queries</code>
  </summary>
  {: .text-delta}

`queries` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `cache` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>query_string</code>
  </summary>
  {: .text-delta}

`query_string` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `lenient` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>routing</code>
  </summary>
  {: .text-delta}

`routing` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `allocation` | Object |  |
| `rebalance` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>search</code>
  </summary>
  {: .text-delta}

`search` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `concurrent` | Object |  |
| `concurrent_segment_search` | Object |  |
| `default_pipeline` | String |  |
| `idle` | Object |  |
| `slowlog` | Object |  |
| `throttled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>settings</code>
  </summary>
  {: .text-delta}

The index settings to be updated.

`settings` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |
| `analysis` | Object |  |
| `analyze` | Object |  |
| `analyze.max_token_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `auto_expand_replicas` | String |  |
| `blocks` | Object |  |
| `blocks.metadata` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.read_only_allow_delete` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `blocks.write` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `check_on_startup` | String | Valid values are: `checksum`, `false`, and `true`. |
| `codec` | String |  |
| `composite_index.star_tree` | Object |  |
| `creation_date` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `creation_date_string` | Object or String | A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation. |
| `default_pipeline` | String |  |
| `final_pipeline` | String |  |
| `format` | Float or String |  |
| `gc_deletes` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `hidden` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `highlight` | Object |  |
| `highlight.max_analyzed_offset` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `index` | Object | The index settings to be updated. |
| `indexing` | Object |  |
| `indexing_pressure` | Object |  |
| `knn` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `knn.algo_param.ef_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `lifecycle` | Object |  |
| `lifecycle.name` | String | The name of a resource or configuration element. |
| `load_fixed_bitset_filters_eagerly` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mapping` | Object |  |
| `max_docvalue_fields_search` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_inner_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_ngram_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_refresh_listeners` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_regex_length` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_rescore_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_result_window` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_script_fields` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_shingle_diff` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_slices_per_scroll` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `max_terms_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `merge` | Object |  |
| `merge.scheduler.max_thread_count` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `mode` | String |  |
| `number_of_replicas` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_routing_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `number_of_shards` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `priority` | Float or String |  |
| `provided_name` | String | The name of a resource or configuration element. |
| `queries` | Object |  |
| `query_string` | Object |  |
| `query_string.lenient` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `refresh_interval` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `routing` | Object |  |
| `routing_partition_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `routing_path` | Array of Strings or String |  |
| `search` | Object |  |
| `search.idle.after` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `settings` | Object | The index settings to be updated. |
| `similarity` | Object |  |
| `soft_deletes` | Object |  |
| `soft_deletes.retention_lease.period` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `sort` | Object |  |
| `store` | Object |  |
| `top_metrics_max_size` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `translog` | Object |  |
| `translog.durability` | String | Valid values are: `ASYNC`, `REQUEST`, `async`, and `request`. |
| `translog.flush_threshold_size` | String | The unique identifier of a node. |
| `uuid` | String | The universally unique identifier. |
| `verified_before_close` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `version` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>similarity</code>
  </summary>
  {: .text-delta}

`similarity` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `bm25` | Object |  |
| `dfi` | Object |  |
| `dfr` | Object |  |
| `ib` | Object |  |
| `lmd` | Object |  |
| `lmj` | Object |  |
| `scripted_tfidf` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>soft_deletes</code>
  </summary>
  {: .text-delta}

`soft_deletes` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `enabled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `retention` | Object |  |
| `retention_lease` | Object |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>sort</code>
  </summary>
  {: .text-delta}

`sort` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `field` | Array of Strings or String |  |
| `missing` | Array of Strings or String | Valid values are: `_first`, and `_last`. |
| `mode` | Array of Strings or String | Valid values are: `max`, and `min`. |
| `order` | Array of Strings or String | Valid values are: `asc`, and `desc`. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>store</code>
  </summary>
  {: .text-delta}

`store` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String |  |
| `allow_mmap` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `fs` | _Optional_ | Object |  |
| `hybrid` | _Optional_ | Object |  |
| `preload` | _Optional_ | Array of Strings |  |
| `stats_refresh_interval` | _Optional_ | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>translog</code>
  </summary>
  {: .text-delta}

`translog` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `durability` | String | Valid values are: `ASYNC`, `REQUEST`, `async`, and `request`. |
| `flush_threshold_size` | String | The unique identifier of a node. |
| `generation_threshold_size` | String | The unique identifier of a node. |
| `retention` | Object |  |
| `sync_interval` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>version</code>
  </summary>
  {: .text-delta}

`version` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `created` | String |  |
| `created_string` | String |  |

</details>
<details markdown="block" name="snapshot.restore::request_body">
  <summary>
    Request body fields: <code>index_settings</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.restore
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `accepted` | Boolean | Returns `true` if the restore was accepted. Present when the request had `wait_for_completion` set to `false`. |
| `snapshot` | Object |  |

<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code>
  </summary>
  {: .text-delta}

`snapshot` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `indices` | **Required** | Array of Strings | The list of indexes that were restored. |
| `shards` | **Required** | Object | Any statistics about the restored shards. |
| `snapshot` | **Required** | String | The name of the snapshot that was restored. |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code>
  </summary>
  {: .text-delta}

Any statistics about the restored shards.

`shards` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `failed` | **Required** | Integer |  |
| `successful` | **Required** | Integer |  |
| `total` | **Required** | Integer |  |
| `failures` | _Optional_ | Array of Objects |  |
| `skipped` | _Optional_ | Integer |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code>
  </summary>
  {: .text-delta}

`failures` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `reason` | **Required** | Object |  |
| `shard` | **Required** | Integer |  |
| `index` | _Optional_ | String |  |
| `node` | _Optional_ | String |  |
| `status` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code>
  </summary>
  {: .text-delta}

`reason` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code>
  </summary>
  {: .text-delta}

`caused_by` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code>
  </summary>
  {: .text-delta}

`root_cause` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>suppressed</code>
  </summary>
  {: .text-delta}

`suppressed` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>suppressed</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>suppressed</code>
  </summary>
  {: .text-delta}

`suppressed` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>root_cause</code>
  </summary>
  {: .text-delta}

`root_cause` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>suppressed</code>
  </summary>
  {: .text-delta}

`suppressed` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.restore::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<!-- spec_insert_end -->

## Endpoints

```json
POST _snapshot/<repository>/<snapshot>/_restore
```

## Path parameters

| Parameter | Data type | Description |
:--- | :--- | :---
| repository | String | Repository containing the snapshot to restore. |
| snapshot | String | Snapshot to restore. |

## Query parameters

Parameter | Data type | Description
:--- | :--- | :---
wait_for_completion | Boolean |  Whether to wait for snapshot restoration to complete before continuing. |

## Request body fields

All request body parameters are optional.

| Parameter | Data type | Description |
:--- | :--- | :--- 
| ignore_unavailable | Boolean | How to handle data streams or indices that are missing or closed. If `false`, the request returns an error for any data stream or index that is missing or closed. If `true`, the request ignores data streams and indices in indices that are missing or closed. Defaults to `false`. |
| ignore_index_settings | Boolean | A comma-delimited list of index settings that you don't want to restore from a snapshot. |
| include_aliases | Boolean | How to handle index aliases from the original snapshot. If `true`, index aliases from the original snapshot are restored. If `false`, aliases along with associated indices are not restored. Defaults to `true`. |
| include_global_state | Boolean | Whether to restore the current cluster state<sup>1</sup>. If `false`, the cluster state is not restored. If true, the current cluster state is restored. Defaults to `false`.|
| index_settings | String | A comma-delimited list of settings to add or change in all restored indices. Use this parameter to override index settings during snapshot restoration. For data streams, these index settings are applied to the restored backing indices. |
| indices | String | A comma-delimited list of data streams and indices to restore from the snapshot. Multi-index syntax is supported. By default, a restore operation includes all data streams and indices in the snapshot. If this argument is provided, the restore operation only includes the data streams and indices that you specify. |
| partial | Boolean | How the restore operation will behave if indices in the snapshot do not have all primary shards available. If `false`, the entire restore operation fails if any indices in the snapshot do not have all primary shards available. <br /> <br />If `true`, allows the restoration of a partial snapshot of indices with unavailable shards. Only shards that were successfully included in the snapshot are restored. All missing shards are recreated as empty. By default, the entire restore operation fails if one or more indices included in the snapshot do not have all primary shards available. To change this behavior, set `partial` to `true`. Defaults to `false`. |
| rename_pattern | String | The pattern to apply to the restored data streams and indexes. Data streams and indexes matching the rename pattern will be renamed according to the `rename_replacement` setting. <br /><br /> The rename pattern is applied as defined by the regular expression that supports referencing the original text. <br /> <br /> The request fails if two or more data streams or indexes are renamed to the same name. If you rename a restored data stream, its backing indexes are also renamed. For example, if you rename the logs data stream to `recovered-logs`, the backing index `.ds-logs-1` is renamed to `.ds-recovered-logs-1`. <br /> <br /> If you rename a restored stream, ensure an index template matches the new stream name. If there are no matching index template names, the stream cannot roll over, and new backing indexes are not created.|
| rename_replacement | String | The rename replacement string.|
| rename_alias_pattern | String | The pattern to apply to the restored aliases. Aliases matching the rename pattern will be renamed according to the `rename_alias_replacement` setting. <br /><br /> The rename pattern is applied as defined by the regular expression that supports referencing the original text. <br /> <br /> If two or more aliases are renamed to the same name, these aliases will be merged into one.|
| rename_alias_replacement | String | The rename replacement string for aliases.|
| source_remote_store_repository | String | The name of the remote store repository of the source index being restored. If not provided, the Snapshot Restore API will use the repository that was registered when the snapshot was created.
| wait_for_completion | Boolean | Whether to return a response after the restore operation has completed.  If `false`, the request returns a response when the restore operation initializes.  If `true`, the request returns a response when the restore operation completes. Defaults to `false`. |

<sup>1</sup>The cluster state includes:
* Persistent cluster settings
* Index templates
* Legacy index templates
* Ingest pipelines
* Index lifecycle policies

## Example request

The following request restores the `opendistro-reports-definitions` index from `my-first-snapshot`. The `rename_pattern` and `rename_replacement` combination causes the index to be renamed to `opendistro-reports-definitions_restored` because duplicate open index names in a cluster are not allowed.

````json
POST /_snapshot/my-opensearch-repo/my-first-snapshot/_restore
{
  "indices": "opendistro-reports-definitions",
  "ignore_unavailable": true,
  "include_global_state": false,              
  "rename_pattern": "(.+)",
  "rename_replacement": "$1_restored",
  "include_aliases": false
}
````

## Example response

Upon success, the response returns the following JSON object:

````json
{
  "snapshot" : {
    "snapshot" : "my-first-snapshot",
    "indices" : [ ],
    "shards" : {
      "total" : 0,
      "failed" : 0,
      "successful" : 0
    }
  }
}
````
Except for the snapshot name, all properties are empty or `0`. This is because any changes made to the volume after the snapshot was generated are lost. However, if you invoke the [Get snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot) API to examine the snapshot, a fully populated snapshot object is returned. 

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- | 
| snapshot | string | Snapshot name. |
| indices | array | Indices in the snapshot. |
| shards | object | Total number of shards created along with number of successful and failed shards. |

If open indices in a snapshot already exist in a cluster, and you don't delete, close, or rename them, the API returns an error like the following:
{: .note}

````json
{
  "error" : {
    "root_cause" : [
      {
        "type" : "snapshot_restore_exception",
        "reason" : "[my-opensearch-repo:my-first-snapshot/dCK4Qth-TymRQ7Tu7Iga0g] cannot restore index [.opendistro-reports-definitions] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
      }
    ],
    "type" : "snapshot_restore_exception",
    "reason" : "[my-opensearch-repo:my-first-snapshot/dCK4Qth-TymRQ7Tu7Iga0g] cannot restore index [.opendistro-reports-definitions] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
  },
  "status" : 500
}
````
