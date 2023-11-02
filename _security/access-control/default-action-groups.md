---
layout: default
title: Default action groups
parent: Access control
nav_order: 115
redirect_from:
 - /security/access-control/default-action-groups/
 - /security-plugin/access-control/default-action-groups/
---

# Default action groups

This page catalogs all default action groups. Often, the most coherent way to create new action groups is to use a combination of these default groups and [individual permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/).


## General

Name | Description
:--- | :---
unlimited | Grants complete access. Can be used on an cluster- or index-level. Equates to `"*"`.
{% comment %}kibana_all_read | asdf
kibana_all_write | asdf{% endcomment %}



## Cluster-level

Name | Description
:---| :---
cluster_all | Grants all cluster permissions. Equates to `cluster:*`.
cluster_monitor | Grants all cluster monitoring permissions. Equates to `cluster:monitor/*`.
cluster_composite_ops_ro | Grants read-only permissions to execute requests like `mget`, `msearch`, or `mtv`, plus permissions to query for aliases.
cluster_composite_ops | Same as `CLUSTER_COMPOSITE_OPS_RO`, but also grants `bulk` permissions and all aliases permissions.
manage_snapshots | Grants permissions to manage snapshots and repositories.
cluster_manage_pipelines | Grants permissions to manage ingest pipelines.
cluster_manage_index_templates | Grants permissions to manage index templates.


## Index-level

Name | Description
:--- | :---
indices_all | Grants all permissions on the index. Equates to `indices:*`.
get | Grants permissions to use `get` and `mget` actions only.
read | Grants read permissions such as search, get field mappings, `get`, and `mget`.
write | Grants permissions to create and update documents within *existing indices*. To create new indexes, see `create_index`.
delete | Grants permissions to delete documents.
crud | Combines the `read`, `write`, and `delete` action groups. Included in the `data_access` action group.
search | Grants permissions to search documents. Includes `suggest`.
suggest | Grants permissions to use the suggest API. Included in the `read` action group.
create_index | Grants permissions to create indexes and mappings.
indices_monitor | Grants permissions to execute all index monitoring actions (e.g. recovery, segments info, index stats, and status).
index | A more limited version of the `write` action group.
data_access | Combines the `crud` action group with `indices:data/*`.
manage_aliases | Grants permissions to manage aliases.
manage | Grants all monitoring and administration permissions for indexes.
