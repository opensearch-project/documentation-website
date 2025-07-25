---
layout: default
title: Default action groups
parent: Access control
nav_order: 115
canonical_url: https://docs.opensearch.org/latest/security/access-control/default-action-groups/
---

# Default action groups

This page catalogs all default action groups. Often, the most coherent way to create new action groups is to use a combination of these default groups and [individual permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/).


## General

| Action group | Description | Permissions |
| :--- | :--- | :--- |
| unlimited | Grants complete access to action groups. Can be used on an `cluster-` or `index-` level. Equates to "*". | `*` |



## Cluster-level

| Action group | Description | Permissions |
| :--- | :--- | :--- |
| cluster_all | Grants all cluster permissions. Equates to `cluster:*`. | `cluster:*` |
| cluster_monitor | Grants all cluster monitoring permissions. Equates to `cluster:monitor/*`. | `cluster:monitor/*` |
| cluster_composite_ops_ro | Grants read-only permissions to execute requests like `mget`, `msearch`, or `mtv`, as well as permissions to query for aliases. | `indices:data/read/mget` `indices:data/read/msearch` `indices:data/read/mtv` `indices:admin/aliases/exists*` `indices:admin/aliases/get*` `indices:data/read/scroll` `indices:admin/resolve/index` |
| cluster_composite_ops | Same as `CLUSTER_COMPOSITE_OPS_RO`, but also grants bulk permissions and all aliases permissions. | `indices:data/write/bulk` `indices:admin/aliases*` `indices:data/write/reindex` `indices:data/read/mget` `indices:data/read/msearch` `indices:data/read/mtv` `indices:admin/aliases/exists*` `indices:admin/aliases/get*` `indices:data/read/scroll` `indices:admin/resolve/index` |
| manage_snapshots | Grants permissions to manage snapshots and repositories. | `cluster:admin/snapshot/*` `cluster:admin/repository/*` |
| cluster_manage_pipelines | Grants permissions to manage ingest pipelines. | `cluster:admin/ingest/pipeline/*` |
| cluster_manage_index_templates | Grants permissions to manage index templates. | `indices:admin/template/*` `indices:admin/index_template/*` `cluster:admin/component_template/*` |


## Index-level

| Action group | Description | Permissions |
| :--- | :--- | :--- |
| indices_all | Grants all permissions on the index. Equates to `indices:*`. | `indices:*` |
| get | Grants permissions to use `get` and `mget` actions. | `indices:data/read/get*` `indices:data/read/mget*` |
| read | Grants read permissions on the index such as `search`, `get` field mappings, `get`, and `mget`. | `indices:data/read*` `indices:admin/mappings/fields/get*` `indices:admin/resolve/index` |
| write | Grants permissions to create and update documents within existing indexes. | `indices:data/write*` `indices:admin/mapping/put` |
| delete | Grants permissions to delete documents. | `indices:data/write/delete*` |
| crud | Combines the read, write, and delete action groups. Included in the `data_access` action group. | `indices:data/read*` `indices:admin/mappings/fields/get*` `indices:admin/resolve/index` `indices:data/write*` `indices:admin/mapping/put` |
| search | Grants permissions to search documents, including the Suggest API. | `indices:data/read/search*` `indices:data/read/msearch*` `indices:admin/resolve/index` `indices:data/read/suggest*` |
| suggest | Grants permissions to use the Suggest API. Included in the `read` action group. | `indices:data/read/suggest*` |
| create_index | Grants permissions to create indexes and mappings. | `indices:admin/create` `indices:admin/mapping/put` |
| indices_monitor | Grants permissions to run all index monitoring actions, such as `recovery`, `segments_info`, `index_stats`, and `status`). | `indices:monitor/*` |
| index | A more limited version of the write action group. | `indices:data/write/index*` `indices:data/write/update*` `indices:admin/mapping/put` `indices:data/write/bulk*` |
| data_access | Combines the CRUD action group with `indices:data/*`. | `indices:data/*` `indices:data/read*` `indices:admin/mappings/fields/get*` `indices:admin/resolve/index` `indices:data/write*` `indices:admin/mapping/put` |
| manage_aliases | Grants permissions to manage aliases. | `indices:admin/aliases*` |
| manage | Grants all monitoring and administration permissions for indexes. | `indices:monitor/*` `indices:admin/*` |
