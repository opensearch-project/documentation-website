---
layout: default
title: Clear cache
parent: Index operations
grand_parent: Index APIs
nav_order: 10
---

# Clear Cache API
**Introduced 1.0**
{: .label .label-purple }

The clear cache API operation clears the caches of one or more indexes. For data streams, the API clears the caches of the stream’s backing indexes.

## Endpoints

```json
POST /_cache/clear
POST /{target}/_cache/clear
```

## Path parameters

| Parameter | Data type | Description |
:--- | :--- | :---
| `target` | String | Comma-delimited list of data streams, indexes, and index aliases to which cache clearing is applied. Wildcard expressions (`*`) are supported. To target all data streams and indexes in a cluster, omit this parameter or use `_all` or `*`. Optional. |


## Query parameters

All query parameters are optional.

| Parameter | Data type | Description |
:--- | :--- | :---
| `allow_no_indices` | Boolean | Whether to ignore wildcards, index aliases, or `_all` target (`target` path parameter) values that don’t match any indexes. If `false`, the request returns an error if any wildcard expression, index alias, or `_all` target value doesn't match any indexes. This behavior also applies if the request targets include other open indexes. For example, a request where the target is `fig*,app*` returns an error if an index starts with `fig` but no index starts with `app`. Default is `true`. |
| `expand_wildcards` | String | Determines the index types that wildcard expressions can expand to. Accepts multiple values separated by a comma, such as  `open,hidden`. Valid values are: <br /><br /> `all` -- Expand to open, closed, and hidden indexes.<br /><br />`open` -- Expand only to open indexes.<br /><br />`closed` -- Expand only to closed indexes<br /><br />`hidden` -- Expand to include hidden indexes. Must be combined with `open` or `closed`.<br /><br />`none` -- Expansions are not accepted.<br /><br /> Default is `open`. Caches of closed indexes cannot be cleared, so a request using `closed` or `all` fails if a wildcard expression matches a closed index, unless `ignore_unavailable` is `true`. |
| `fielddata` | Boolean | If `true`, clears the fields cache. Use the `fields` parameter to clear specific fields' caches. Default is `false`. |
| `fields` | String | Comma-delimited list of field names whose fielddata is cleared from the cache. If specified without other cache parameters, clears only the fielddata of the listed fields. Does not support objects or field aliases. Default is all fields. |
| `file` | Boolean | If `true`, clears the unused entries from the file cache on nodes with the Search role. Unless `query` or `fielddata` is also `true` or `fields` is specified, setting `file` to `true` also clears all index caches. Default is `false`. |
| `index` | String | Comma-delimited list of indexes whose caches are cleared. An alternative to the `target` path parameter for the `POST /_cache/clear` endpoint. |
| `ignore_unavailable` | Boolean | If `true`, OpenSearch ignores missing or closed indexes. Default is `false`. |
| `query` | Boolean | If `true`, clears the query cache. Default is `false`. |
| `request` | Boolean | If `true`, clears the request cache. Default is `false`. |

If none of the `fielddata`, `query`, `request`, or `fields` parameters is specified, all caches are cleared. Setting `fielddata` or `query` to `true` clears only that cache. If `request` is the only cache parameter set to `true` and `fields` is not specified, all caches are cleared.

Field data entries are removed during the next cache cleanup, which runs at the interval specified by the `indices.cache.cleanup_interval` setting (default `1m`). Until then, fielddata statistics can show the size before the cache was cleared.
{: .note}

## Example requests

The following example requests show multiple clear cache API uses.

### Clear a specific cache

The following request clears the fields cache only:

<!-- spec_insert_start
component: example_code
rest: POST /my-index/_cache/clear?fielddata=true
-->
{% capture step1_rest %}
POST /my-index/_cache/clear?fielddata=true
{% endcapture %}

{% capture step1_python %}


response = client.indices.clear_cache(
  index = "my-index",
  params = { "fielddata": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<hr />

The following request clears the query cache only:

<!-- spec_insert_start
component: example_code
rest: POST /my-index/_cache/clear?query=true
-->
{% capture step1_rest %}
POST /my-index/_cache/clear?query=true
{% endcapture %}

{% capture step1_python %}


response = client.indices.clear_cache(
  index = "my-index",
  params = { "query": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<hr />

The following request clears the request cache only:

<!-- spec_insert_start
component: example_code
rest: POST /my-index/_cache/clear?request=true
-->
{% capture step1_rest %}
POST /my-index/_cache/clear?request=true
{% endcapture %}

{% capture step1_python %}


response = client.indices.clear_cache(
  index = "my-index",
  params = { "request": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Clear the cache for specific fields

The following request clears the fields caches of `product_name` and `category`:

<!-- spec_insert_start
component: example_code
rest: POST /my-index/_cache/clear?fields=product_name,category
-->
{% capture step1_rest %}
POST /my-index/_cache/clear?fields=product_name,category
{% endcapture %}

{% capture step1_python %}


response = client.indices.clear_cache(
  index = "my-index",
  params = { "fields": "product_name,category" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Clear caches for specific data streams or indexes

The following request clears the cache for two specific indexes:

<!-- spec_insert_start
component: example_code
rest: POST /my-index,my-index2/_cache/clear
-->
{% capture step1_rest %}
POST /my-index,my-index2/_cache/clear
{% endcapture %}

{% capture step1_python %}


response = client.indices.clear_cache(
  index = "my-index,my-index2"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Clear caches for all data streams and indexes

The following request clears the cache for all data streams and indexes:

<!-- spec_insert_start
component: example_code
rest: POST /_cache/clear
-->
{% capture step1_rest %}
POST /_cache/clear
{% endcapture %}

{% capture step1_python %}

response = client.indices.clear_cache()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


### Clear unused entries from the cache on search-capable nodes

The following request clears unused entries from the file cache on nodes with the Search role:

<!-- spec_insert_start
component: example_code
rest: POST /*/_cache/clear?file=true
-->
{% capture step1_rest %}
POST /*/_cache/clear?file=true
{% endcapture %}

{% capture step1_python %}


response = client.indices.clear_cache(
  index = "*",
  params = { "file": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The `POST /books,hockey/_cache/clear` request returns the following fields:

```json
{
  "_shards" : {
    "total" : 4,
    "successful" : 2,
    "failed" : 0
  }
}
```

## Response body fields

The `POST /books,hockey/_cache/clear` request returns the following response fields:

| Field | Data type | Description | 
:--- | :--- | :---
| `_shards` | Object | Shard information. |

The `_shards` object contains the following fields.

| Field | Data type | Description |
:--- | :--- | :---
| `total` | Integer | Total number of shards. |
| `successful` | Integer | Number of index shards with caches successfully cleared. |
| `failed` | Integer | Number of index shards with caches that failed to clear. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/cache/clear`.
