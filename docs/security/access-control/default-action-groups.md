---
layout: default
title: Default Action Groups
parent: Access Control
grand_parent: Security
nav_order: 51
---

# Default action groups

This page catalogs all default action groups. Often, the most coherent way to create new action groups is to use a combination of these default groups and [individual permissions](../permissions).


## General

Name | Description
:--- | :---
unlimited | Grants complete access. Can be used on an cluster- or index-level. Equates to `"*"`.


## Cluster-level

Name | Description
:---| :---
cluster_all | Grants all cluster permissions. Equates to `cluster:*`.
cluster_monitor | Grants all cluster monitoring permissions. Equates to `cluster:monitor/*`.
cluster_composite_ops_ro | Grants read-only permissions to execute requests like `mget`, `msearch`, or `mtv`, plus permissions to query for aliases.
cluster_composite_ops | Same as `CLUSTER_COMPOSITE_OPS_RO`, but also grants `bulk` permissions and all aliases permissions.
manage_snapshots | Grants permissions to manage snapshots and repositories.


## Index-level

Name | Description
:--- | :---
indices_all | Grants all permissions on the index. Equates to `indices:*`.
get | Grants permissions to use `get` and `mget` actions only.
read | Grants read permissions such as search, get field mappings, `get`, and `mget`.
write | Grants permissions to create and update documents within *existing indices*. To create new indices, see `CREATE_INDEX`.
delete | Grants permissions to delete documents.
crud | Combines the READ, WRITE and DELETE action groups.
search | Grants permissions to search documents. Includes SUGGEST.
suggest | Grants permissions to use the suggest API. Included in the READ action group.
create_index | Grants permissions to create indices and mappings.
indices_monitor | Grants permissions to execute all index monitoring actions (e.g. recovery, segments info, index stats, and status).
manage_aliases | Grants permissions to manage aliases.
manage | Grants all monitoring and administration permissions for indices.
