---
layout: default
title: CAT API
nav_order:  20
---

# cat API

You can get essential statistics about your cluster in an easy-to-understand, tabular format using the compact and aligned text (CAT) API. The cat API is a human-readable interface that returns plain text instead of traditional JSON.

Using the cat API, you can answer questions like which node is the elected master, what state is the cluster in, how many documents are in each index, and so on.

To see the available operations in the cat API, use the following command:

```
GET _cat
```

You can also use the following string parameters with your query.

Parameter | Description
:--- | :--- |
`?v` |  Makes the output more verbose by adding headers to the columns. It also adds some formatting to help align each of the columns together. All examples on this page include the `v` parameter.
`?help` | Lists the default and other available headers for a given operation.
`?h`  |  Limits the output to specific headers.
`?format` |  Outputs the result in JSON, YAML, or CBOR formats.
`?sort` | Sorts the output by the specified columns.

To see what each column represents, use the `?v` parameter:

```
GET _cat/<operation_name>?v
```

To see all the available headers, use the `?help` parameter:

```
GET _cat/<operation_name>?help
```

To limit the output to a subset of headers, use the `?h` parameter:

```
GET _cat/<operation_name>?h=<header_name_1>,<header_name_2>&v
```

Typically, for any operation you can find out what headers are available using the `?help` parameter, and then use the `?h` parameter to limit the output to only the headers that you care about.

---

#### Table of contents
1. TOC
{:toc}

---
## Aliases

Lists the mapping of aliases to indices, plus routing and filtering information.

```
GET _cat/aliases?v
```

To limit the information to a specific alias, add the alias name after your query.

```
GET _cat/aliases/<alias>?v
```

## Allocation

Lists the allocation of disk space for indices and the number of shards on each node.
Default request:
```
GET _cat/allocation?v
```

## Count

Lists the number of documents in your cluster.

```
GET _cat/count?v
```

To see the number of documents in a specific index, add the index name after your query.

```
GET _cat/count/<index>?v
```

## Field data

Lists the memory size used by each field per node.

```
GET _cat/fielddata?v
```

To limit the information to a specific field, add the field name after your query.

```
GET _cat/fielddata/<fields>?v
```

## Health

Lists the status of the cluster, how long the cluster has been up, the number of nodes, and other useful information that helps you analyze the health of your cluster.

```
GET _cat/health?v
```

## Indices

Lists information related to indices⁠—how much disk space they are using, how many shards they have, their health status, and so on.

```
GET _cat/indices?v
```

To limit the information to a specific index, add the index name after your query.

```
GET _cat/indices/<index>?v
```

## Master

Lists information that helps identify the elected master node.

```
GET _cat/master?v
```

## Node attributes

Lists the attributes of custom nodes.

```
GET _cat/nodeattrs?v
```

## Nodes

Lists node-level information, including node roles and load metrics.

A few important node metrics are `pid`, `name`, `master`, `ip`, `port`, `version`, `build`, `jdk`, along with `disk`, `heap`, `ram`, and `file_desc`.

```
GET _cat/nodes?v
```

## Pending tasks

Lists the progress of all pending tasks, including task priority and time in queue.

```
GET _cat/pending_tasks?v
```

## Plugins

Lists the names, components, and versions of the installed plugins.

```
GET _cat/plugins?v
```

## Recovery

Lists all completed and ongoing index and shard recoveries.

```
GET _cat/recovery?v
```

To see only the recoveries of a specific index, add the index name after your query.

```
GET _cat/recovery/<index>?v
```

## Repositories

Lists all snapshot repositories and their types.

```
GET _cat/repositories?v
```

## Segments

Lists Lucene segment-level information for each index.

```
GET _cat/segments?v
```

To see only the information about segments of a specific index, add the index name after your query.

```
GET _cat/segments/<index>?v
```

## Shards

Lists the state of all primary and replica shards and how they are distributed.

```
GET _cat/shards?v
```

To see only the information about shards of a specific index, add the index name after your query.

```
GET _cat/shards/<index>?v
```

## Snapshots

Lists all snapshots for a repository.

```
GET _cat/snapshots/<repository>?v
```

## Tasks

Lists the progress of all tasks currently running on your cluster.

```
GET _cat/tasks?v
```

## Templates

Lists the names, patterns, order numbers, and version numbers of index templates.

```
GET _cat/templates?v
```

## Thread pool

Lists the active, queued, and rejected threads of different thread pools on each node.

```
GET _cat/thread_pool?v
```

To limit the information to a specific thread pool, add the thread pool name after your query.

```
GET _cat/thread_pool/<thread_pool>?v
```
