---
layout: default
title: Command reference
nav_order: 2
parent: Migration console
grand_parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/migration-console/migration-console-command-reference/
redirect_from:
  - /migration-console/migration-console-commands-references/
  - /migration-assistant/migration-console/migration-console-commands-references/
---

# Migration console command reference

Migration console commands follow this syntax: `console [component] [action]`. The components include `clusters`, `backfill`, `snapshot`, `metadata`, and `replay`. The console is configured with a registry of the deployed services and the source and target cluster, generated from the `cdk.context.json` values.

## Commonly used commands

The exact commands used will depend heavily on use-case and goals, but the following are a series of common commands with a quick description of what they do.

### Check connection

Reports whether both the source and target clusters can be reached and provides their versions.

```sh
console clusters connection-check
```
{% include copy.html %}

### Run `cat-indices`

Runs the `cat-indices` API on the cluster.

```sh
console clusters cat-indices
```
{% include copy.html %}

### Execute HTTP requests against clusters

To run OpenSearch or Elasticsearch APIs directly against the configured source or target cluster, use a `curl`-like interface. Authentication, TLS, and endpoints are obtained from your console configuration.

```sh
console clusters curl <source_cluster|target_cluster> <path> [OPTIONS]
```
{% include copy.html %}

#### Arguments

* `<source_cluster|target_cluster>` — Specify `source_cluster` or `target_cluster` to call.
* `<path>` — The API endpoint to call on the cluster (for example, `/_cat/indices` or `/my-index/_search`).

#### Options

* `--json <JSON_DATA>` — Send a JSON body and automatically set `Content-Type: application/json`.
* `-X, --request <METHOD>` — The HTTP method (`GET`, `POST`, `PUT`, `DELETE`, or `HEAD`). Default is `GET`.
* `-H, --header <HEADER>` — A custom header, for example, `-H 'Accept: application/json'`. You can specify multiple headers, for example, `-H 'Accept: application/json' -H 'Authorization: Bearer TOKEN'`.
* `-d, --data <DATA>` — The raw request body.

#### Examples

*Get cluster health*:

```sh
console clusters curl source_cluster /_cluster/health
```
{% include copy.html %}

*List indexes as JSON*:

```sh
console clusters curl source_cluster "/_cat/indices?format=json&v=true"
```
{% include copy.html %}

*Create an index*:

```sh
console clusters curl target_cluster /my-new-index --json '{"settings":{"number_of_shards":3,"number_of_replicas":1}}'
```
{% include copy.html %}

*Run a query containing a body*:

```sh
console clusters curl source_cluster /_search --json '{"query":{"match_all":{}}}'
```
{% include copy.html %}


### Create a snapshot

Creates a snapshot of the source cluster and stores it in a preconfigured Amazon Simple Storage Service (Amazon S3) bucket.

```sh
console snapshot create
```
{% include copy.html %}

### Check snapshot status

Runs a detailed check on the snapshot creation status, including estimated completion time:

```sh
console snapshot status --deep-check
```

{% include copy.html %}

### Evaluate metadata

Performs a dry run of metadata migration, showing which indexes, templates, and other objects will be migrated to the target cluster.

```sh
console metadata evaluate
```

{% include copy.html %}

### Migrate metadata

Migrates the metadata from the source cluster to the target cluster.

```sh
console metadata migrate
```

{% include copy.html %}

### Start a backfill

If `Reindex-From-Snapshot` (RFS) is enabled, this command starts an instance of the service to begin moving documents to the target cluster:

There are similar `scale UNITS` and `stop` commands to change the number of active instances for RFS.


```sh
console backfill start
```
{% include copy.html %}

### Check backfill status

Gets the current status of the backfill migration, including the number of operating instances and the progress of the shards.

```sh
console backfill status
```
{% include copy.html %}

### Start Traffic Replayer

If Traffic Replayer is enabled, this command starts an instance of Traffic Replayer to begin replaying traffic against the target cluster.
The `stop` command stops all active instances.

```sh
console replay start
```
{% include copy.html %}

### Read logs

Reads any logs that exist when running Traffic Replayer. Use tab completion on the path to fill in the available `NODE_IDs` and, if applicable, log file names. The tuple logs roll over at a certain size threshold, so there may be many files named with timestamps. The `jq` command pretty-prints each line of the tuple output before writing it to file.

```sh
console tuples show --in /shared-logs-output/traffic-replayer-default/[NODE_ID]/tuples/console.log | jq > readable_tuples.json
```
{% include copy.html %}

### Show version

Displays the version of the currently installed Migration Assistant.

```sh
console --version
```
{% include copy.html %}

### Help option

All commands and options can be explored within the tool itself by using the `--help` option, either for the entire `console` application or for individual components (for example, `console backfill --help`). For example:

```sh
$ console --help
Usage: console [OPTIONS] COMMAND [ARGS]...

Options:
  --config-file TEXT  Path to config file
  --json
  -v, --verbose       Verbosity level. Default is warn, -v is info, -vv is
                      debug.
  --version           Show the Migration Assistant version.
  --help              Show this message and exit.

Commands:
  backfill    Commands related to controlling the configured backfill...
  clusters    Commands to interact with source and target clusters
  completion  Generate shell completion script and instructions for setup.
  kafka       All actions related to Kafka operations
  metadata    Commands related to migrating metadata to the target cluster.
  metrics     Commands related to checking metrics emitted by the capture...
  replay      Commands related to controlling the replayer.
  snapshot    Commands to create and check status of snapshots of the...
  tuples      All commands related to tuples.
```
