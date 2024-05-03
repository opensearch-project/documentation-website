---
layout: default
title: Clear cache
parent: Index APIs
nav_order: 10
---

# Clear cache
**Introduced 1.0**
{: .label .label-purple }

The clear cache API operation clears the caches of one or more indexes. For data streams, the API clears the caches of the stream’s backing indexes.


If you use the Security plugin, you must have the `manage index` privileges.
{: .note}

## Path parameters

| Parameter | Data type | Description |
:--- | :--- | :---
| target | String | Comma-delimited list of data streams, indexes, and index aliases to which cache clearing is applied. Wildcard expressions (`*`) are supported. To target all data streams and indexes in a cluster, omit this parameter or use `_all` or `*`. Optional. |


## Query parameters

All query parameters are optional.

| Parameter | Data type | Description |
:--- | :--- | :---
| allow_no_indices | Boolean | Whether to ignore wildcards, index aliases, or `_all` target (`target` path parameter) values that don’t match any indexes. If `false`, the request returns an error if any wildcard expression, index alias, or `_all` target value doesn't match any indexes. This behavior also applies if the request targets include other open indexes. For example, a request where the target is `fig*,app*` returns an error if an index starts with `fig` but no index starts with `app`. Defaults to `true`. |
| expand_wildcards | String | Determines the index types that wildcard expressions can expand to. Accepts multiple values separated by a comma, such as  `open,hidden`. Valid values are: <br /><br /> `all` -- Expand to open, closed, and hidden indexes.<br /><br />`open` -- Expand only to open indexes.<br /><br />`closed` -- Expand only to closed indexes<br /><br />`hidden` -- Expand to include hidden indexes. Must be combined with `open`, `closed`, or `both`.<br /><br />`none` -- Expansions are not accepted.<br /><br /> Defaults to `open`. |
| fielddata | Boolean | If `true`, clears the fields cache. Use the `fields` parameter to clear specific fields' caches.  Defaults to `true`. |
| fields | String | Used in conjunction with the `fielddata` parameter. Comma-delimited list of field names that are cleared out of the cache. Does not support objects or field aliases. Defaults to all fields. |
| file | Boolean | If `true`, clears the unused entries from the file cache on nodes with the Search role. Defaults to `false`. |
| index | String | Comma-delimited list of index names that are cleared out of the cache. |
| ignore_unavailable | Boolean | If `true`, OpenSearch ignores missing or closed indexes. Defaults to `false`. |
| query | Boolean | If `true`, clears the query cache. Defaults to `true`. |
| request | Boolean | If `true`, clears the request cache. Defaults to `true`. |

#### Example requests

The following example requests show multiple clear cache API uses.

##### Clear a specific cache

The following request clears the fields cache only:

```json
POST /my-index/_cache/clear?fielddata=true
```
{% include copy-curl.html %}

<hr />

The following request clears the query cache only:

```json
POST /my-index/_cache/clear?query=true
```
{% include copy-curl.html %}

<hr />

The following request clears the request cache only:

```json
POST /my-index/_cache/clear?request=true
```
{% include copy-curl.html %}

#### Clear the cache for specific fields

The following request clears the fields caches of `fielda` and `fieldb`:

```json
POST /my-index/_cache/clear?fields=fielda,fieldb
```
{% include copy-curl.html %}

#### Clear caches for specific data streams or indexes

The following request clears the cache for two specific indexes:

```json
POST /my-index,my-index2/_cache/clear
```
{% include copy-curl.html %}

#### Clear caches for all data streams and indexes

The following request clears the cache for all data streams and indexes:

```json
POST /_cache/clear
```
{% include copy-curl.html %}

#### Clear unused entries from the cache on search-capable nodes

```json
POST /*/_cache/clear?file=true 
```
{% include copy-curl.html %}

#### Example response

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

## Response fields

The `POST /books,hockey/_cache/clear` request returns the following response fields:

| Field | Data type | Description | 
:--- | :--- | :---
| _shards | Object | Shard information. |
| total | Integer | Total number of shards. |
| successful | Integer | Number of index shards with caches successfully cleared. |
| failed | Integer | Number of index shards with caches that failed to clear. |
