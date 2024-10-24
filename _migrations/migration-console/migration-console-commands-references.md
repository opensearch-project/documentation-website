


The Migration Assistant Console is a command line interface to interact with the deployed components of the solution.

The commands are in the form of `console [component] [action]`. The components include `clusters`, `backfill` (e.g the Reindex from Snapshot service), `snapshot`, `metadata`, `replay`, etc. The console is configured with a registry of the deployed services and the source and target cluster, generated from the `cdk.context.json` values.

## Commonly Used Commands

The exact commands used will depend heavily on use-case and goals, but the following are a series of common commands with a quick description of what they do.

```sh
console clusters connection-check
```
Reports whether both the source and target clusters can be reached and their versions.


```sh
console clusters cat-indices
```
Runs the `_cat/indices` command on each cluster and prints the results.

***

```sh
console snapshot create
```
Initiates creating a snapshot on the source cluster, into a pre-configured S3 bucket.

```sh
console snapshot status --deep-check
```
Runs a detailed check on the status of the snapshot creation, including estimated completion time.

***

```sh
console metadata evaluate
```
Perform a dry run of metadata migration, showing which indices, templates, and other objects will be migrated to the target cluster.

```sh
console metadata migrate
```
Perform an actual metadata migration.

***

```sh
console backfill start
```
If the Reindex From Snapshot service is enabled, start an instance of the service to begin moving documents to the target cluster.

There are similar `scale UNITS` and `stop` commands to change the number of active instances for RFS.

```sh
console backfill status --deep-check
```
See the current status of the backfill migration, with the number of instances operating and the progress of the shards.

***

```sh
console replay start
```
If the Traffic Replayer service is enabled, start an instance of the service to begin replaying traffic against the target cluster.
The `stop` command stops all active instances.

***

```sh
console tuples show --in /shared-logs-output/traffic-replayer-default/[NODE_ID]/tuples/console.log | jq > readable_tuples.json
```
Use tab completion on the path to fill in the available node ids and, if applicable, log file names. The tuples logs roll over at a certain size threshold, so there may be many files named with timestamps. The `jq` command pretty-prints each line of the tuple output before writing it to file.


## Command Reference
All commands and options can be explored within the tool itself by using the `--help` option, either for the entire `console` application or for individual components (e.g. `console backfill --help`). The console also has command autocomplete set up to assist with usage.

```
$ console --help
Usage: console [OPTIONS] COMMAND [ARGS]...

Options:
  --config-file TEXT  Path to config file
  --json
  -v, --verbose       Verbosity level. Default is warn, -v is info, -vv is
                      debug.
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