<!-- spec_insert_start
api: indices.put_settings
component: request_body_parameters
-->
## Request body fields

The index settings to be updated.

The request body is __required__. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `lifecycle` | Object |  |
| `mode` | String |  |
| `routing` | Object |  |
| `routing_path` | Array of Strings or String |  |
| `soft_deletes` | Array of Objects |  |
| `soft_deletes.retention_lease.period` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |

<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>lifecycle</code>
  </summary>
  {: .text-delta}

`lifecycle` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String |  |
| `indexing_complete` | _Optional_ | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `origination_date` | _Optional_ | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `parse_origination_date` | _Optional_ | Boolean | Set to `true` to parse the origination date from the index name. This origination date is used to calculate the index age for its phase transitions. The index name must match the pattern `^.*-{date_format}-\\d+`, where the `date_format` is `yyyy.MM.dd` and the trailing digits are optional. An index that was rolled over would normally match the full format, for example `logs-2016.10.31-000002`). If the index name doesn't match the pattern, index creation fails. |
| `rollover_alias` | _Optional_ | String | The index alias to update when the index rolls over. Specify when using a policy that contains a rollover action. When the index rolls over, the alias is updated to reflect that the index is no longer the write index. For more information about rolling indexes, see Rollover. |
| `step` | _Optional_ | Object |  |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>lifecycle</code> > <code>step</code>
  </summary>
  {: .text-delta}

`step` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `wait_time_threshold` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>routing</code>
  </summary>
  {: .text-delta}

`routing` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `allocation` | Object |  |
| `rebalance` | Object |  |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>routing</code> > <code>allocation</code>
  </summary>
  {: .text-delta}

`allocation` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `disk` | Object |  |
| `enable` | String | Valid values are: `all`, `new_primaries`, `none`, and `primaries`. |
| `include` | Object |  |
| `initial_recovery` | Object |  |
| `total_shards_per_node` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>routing</code> > <code>allocation</code> > <code>disk</code>
  </summary>
  {: .text-delta}

`disk` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `threshold_enabled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>routing</code> > <code>allocation</code> > <code>include</code>
  </summary>
  {: .text-delta}

`include` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `_id` | String |  |
| `_tier_preference` | String |  |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>routing</code> > <code>allocation</code> > <code>initial_recovery</code>
  </summary>
  {: .text-delta}

`initial_recovery` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `_id` | String |  |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>routing</code> > <code>rebalance</code>
  </summary>
  {: .text-delta}

`rebalance` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `enable` | **Required** | String | Valid values are: `all`, `none`, `primaries`, and `replicas`. |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>soft_deletes</code>
  </summary>
  {: .text-delta}

`soft_deletes` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `enabled` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `retention` | Object | The retention settings for soft deletes. |
| `retention_lease` | Object |  |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>soft_deletes</code> > <code>retention</code>
  </summary>
  {: .text-delta}

The retention settings for soft deletes.

`retention` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `operations` | Integer or String |  |

</details>
<details markdown="block" name="indices.put_settings::request_body">
  <summary>
    Request body fields: <code>soft_deletes</code> > <code>retention_lease</code>
  </summary>
  {: .text-delta}

`retention_lease` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `period` | **Required** | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |

</details>
<!-- spec_insert_end -->


<!-- spec_insert_start
api: indices.put_settings
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `acknowledged` | **Required** | Boolean | For a successful response, this value is always true. On failure, an exception is returned instead. |

<!-- spec_insert_end -->
