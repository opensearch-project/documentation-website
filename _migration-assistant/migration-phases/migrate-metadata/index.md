---
layout: default
title: Migrate metadata
nav_order: 5
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
has_children: true
has_toc: false
permalink: /migration-assistant/migration-phases/migrate-metadata/
redirect_from:
  - /migration-assistant/migration-phases/migrating-metadata/
  - /migration-phases/migrating-metadata/
---

# Migrate metadata

Metadata migration involves creating a snapshot of your cluster and then migrating the metadata from the snapshot using the migration console.

This tool gathers information from a source cluster through a snapshot or through HTTP requests against the source cluster. These snapshots are fully compatible with the backfill process for `Reindex-From-Snapshot` (RFS) scenarios.

After collecting information on the source cluster, comparisons are made against the target cluster. If running a migration, any metadata items that do not already exist will be created on the target cluster.

## Command arguments

For the following commands, to identify all valid arguments, please run with `--help`.

```shell
console metadata evaluate --help
```
{% include copy.html %}

```shell
console metadata migrate --help
```
{% include copy.html %}

Based on the migration console deployment options, a number of commands will be pre-populated. To view them, run console with verbosity:

```shell
console -v metadata migrate --help
```
{% include copy.html %}

You should receive a response similar to the following:

```shell
(.venv) bash-5.2# console -v metadata migrate --help
INFO:console_link.cli:Logging set to INFO
.
.
.
INFO:console_link.models.metadata:Migrating metadata with command: /root/metadataMigration/bin/MetadataMigration --otel-collector-endpoint http://otel-collector:4317 migrate --snapshot-name snapshot_2023_01_01 --target-host https://opensearchtarget:9200 --min-replicas 0 --file-system-repo-path /snapshot/test-console --target-username admin --target-password ******** --target-insecure --help
.
.
.
```


## Using the `evaluate`  command

By scanning the contents of the source cluster, applying filtering, and applying modifications a list of all items that will be migrated will be created.  Any items not seen in this output will not be migrated onto the target cluster if the migrate command was to be run.  This is a safety check before making modifications on the target cluster.

```shell
console metadata evaluate [...]
```
{% include copy.html %}

You should receive a response similar to the following:

```bash
Starting Metadata Evaluation
Clusters:
   Source:
      Remote Cluster: OpenSearch 1.3.16 ConnectionContext(uri=http://localhost:33039, protocol=HTTP, insecure=false, compressionSupported=false)

   Target:
      Remote Cluster: OpenSearch 2.14.0 ConnectionContext(uri=http://localhost:33037, protocol=HTTP, insecure=false, compressionSupported=false)


Migration Candidates:
   Index Templates:
      simple_index_template

   Component Templates:
      simple_component_template

   Indexes:
      blog_2023, movies_2023

   Aliases:
      alias1, movies-alias


Results:
   0 issue(s) detected
```


## Using the migrate command

Running through the same data as the evaluate command all of the migrated items will be applied onto the target cluster.  If re-run multiple times items that were previously migrated will not be recreated.  If any items do need to be re-migrated, please delete them from the target cluster and then rerun the evaluate then migrate commands to ensure the desired changes are made.

```shell
console metadata migrate [...]
```
{% include copy.html %}

You should receive a response similar to the following:

```shell
Starting Metadata Migration

Clusters:
   Source:
      Snapshot: OpenSearch 1.3.16 FileSystemRepo(repoRootDir=/tmp/junit10626813752669559861)

   Target:
      Remote Cluster: OpenSearch 2.14.0 ConnectionContext(uri=http://localhost:33042, protocol=HTTP, insecure=false, compressionSupported=false)


Migrated Items:
   Index Templates:
      simple_index_template

   Component Templates:
      simple_component_template

   Indexes:
      blog_2023, movies_2023

   Aliases:
      alias1, movies-alias


Results:
   0 issue(s) detected
```


## Metadata verification process

Before moving on to additional migration steps, we recommend confirming details of your cluster.  Depending on your configuration, this could be checking the sharding strategy or making sure index mappings are correctly defined by ingesting a test document.

## Troubleshooting

Use these instructions to help troubleshoot the following issues.

### Accessing detailed logs

Metadata migration creates a detailed log file that includes low level tracing information for troubleshooting. For each execution of the program a log file is created inside a shared volume on the migration console named `shared-logs-output` the following command will list all log files, one for each run of the command.

```shell
ls -al /shared-logs-output/migration-console-default/*/metadata/
```
{% include copy.html %}

To inspect the file within the console `cat`, `tail` and `grep` commands line tools.  By looking for warnings, errors and exceptions in this log file can help understand the source of failures, or at the very least be useful for creating issues in this project.

```shell
tail /shared-logs-output/migration-console-default/*/metadata/*.log
```
{% include copy.html %}

### Warnings and errors

When encountering `WARN` or `ERROR` elements in the response, they will be accompanied by a short message, such as `WARN - my_index already exists`. More information can be found in the detailed logs associated with the warning or error.

### OpenSearch running in compatibility mode

There might be an error about being unable to update an ES 7.10.2 cluster, this can occur when compatibility mode has been enabled on an OpenSearch cluster disable it to continue, see [Enable compatibility mode](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-upgrade).


### Breaking change compatibility

Metadata migration requires modifying data from the source to the target versions to recreate items. Sometimes these features are no longer supported and have been removed from the target version. Sometimes these features are not available in the target version, which is especially true when downgrading. While this tool is meant to make this process easier, it is not exhaustive in its support. When encountering a compatibility issue or an important feature gap for your migration, [search the issues and comment on the existing issue](https://github.com/opensearch-project/opensearch-migrations/issues) or [create a new](https://github.com/opensearch-project/opensearch-migrations/issues/new/choose) issue if one cannot be found.

For information about handling specific field type compatibility issues, see:
- [Transform type mappings]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-type-mapping-deprecation/) -- Handle deprecated mapping types from Elasticsearch 6.x.
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) - Configure custom field type transformations
- [Transform `flattened` to `flat_object` fields]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-flattened-flat-object/) -- Automatically transform `flattened` to `flat_object` fields.
- [Transform `string` to `text`/`keyword` fields]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/) -- Automatically transform `string` to `text`/`keyword` fields.
- [Transform dense_vector to knn_vector]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/transform-dense-vector-knn-vector/) - Automatic transformation of dense_vector to knn_vector

#### Deprecation of Mapping Types

In Elasticsearch 6.8 the mapping types feature was discontinued in Elasticsearch 7.0+ which has created complexity in migrating to newer versions of Elasticsearch and OpenSearch, [learn more](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/removal-of-types.html) ↗.

As Metadata migration supports migrating from ES 6.8 on to the latest versions of OpenSearch this scenario is handled by removing the type mapping types and restructuring the template or index properties.  Note that, at the time of this writing multiple type mappings are not supported, [tracking task](https://opensearch.atlassian.net/browse/MIGRATIONS-1778) ↗.


**Example starting state with mapping type foo (ES 6):**

```json
{
  "mappings": [
    {
      "foo": {
        "properties": {
          "field1": { "type": "text" },
          "field2": { "type": "keyword" }
        }
      }
    }
  ]
}
```
{% include copy.html %}

**Example ending state with foo removed (ES 7):**

```json
{
  "mappings": {
    "properties": {
      "field1": { "type": "text" },
      "field2": { "type": "keyword" },
    }
  }
}
```
{% include copy.html %}

For additional technical details, [view the mapping type removal source code](https://github.com/opensearch-project/opensearch-migrations/blob/main/transformation/src/main/java/org/opensearch/migrations/transformation/rules/IndexMappingTypeRemoval.java).
