---
layout: default
title: Upgrading OpenSearch
nav_order: 20
has_children: true
redirect_from:
  - /upgrade-opensearch/index/
---

# Upgrading OpenSearch

The OpenSearch Project releases regular updates that include new features, enhancements, and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To view a list of previous releases or to learn more about how OpenSearch uses versioning, see [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

We recognize that users are excited about upgrading OpenSearch in order to enjoy the latest features, and we will continue to expand on these upgrade and migration documents to cover additional topics, such as upgrading OpenSearch Dashboards and preserving custom configurations, such as for plugins. To see what's coming next or to make a request for future content, leave a comment on the [upgrade and migration documentation meta issue](https://github.com/opensearch-project/documentation-website/issues/2830) in the [OpenSearch Project](https://github.com/opensearch-project) on GitHub.

If you would like a specific process to be added or would like to contribute, [create an issue](https://github.com/opensearch-project/documentation-website/issues) on GitHub. See the [Contributor Guidelines](https://github.com/opensearch-project/documentation-website/blob/main/CONTRIBUTING.md) to learn how you can help.
{: .tip}

## Workflow considerations

Take time to plan the process before making any changes to your cluster. For example, consider the following questions:

- How long will the upgrade process take?
- If your cluster is being used in production, how impactful is downtime?
- Do you have infrastructure in place to stand up the new cluster in a testing or development environment before you move it into production, or do you need to upgrade the production hosts directly?

The answers to questions like these will help you determine which upgrade path will work best in your environment.

At a minimum, you should be:

- [Reviewing breaking changes](#reviewing-breaking-changes).
- [Reviewing the OpenSearch tools compatibility matrices](#reviewing-the-opensearch-tools-compatibility-matrices).
- [Reviewing plugin compatibility](#reviewing-plugin-compatibility).
- [Backing up configuration files](#backing-up-configuration-files).
- [Creating a snapshot](#creating-a-snapshot).

Stop any nonessential indexing before you begin the upgrade procedure to eliminate unnecessary resource demands on the cluster while you perform the upgrade.
{: .tip}

### Reviewing breaking changes

It's important to determine how the new version of OpenSearch will integrate with your environment. Review [Breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/) before beginning any upgrade procedures to determine whether you will need to make adjustments to your workflow. For example, upstream or downstream components might need to be modified to be compatible with an API change (see meta issue [#2589](https://github.com/opensearch-project/OpenSearch/issues/2589)).

### Reviewing the OpenSearch tools compatibility matrices

If your OpenSearch cluster interacts with other services in your environment, like Logstash or Beats, then you should check the [OpenSearch tools compatibility matrices]({{site.url}}{{site.baseurl}}/tools/index/#compatibility-matrices) to determine whether other components will need to be upgraded.

### Reviewing plugin compatibility

Review the plugins you use to determine compatibility with the target version of OpenSearch. Official OpenSearch Project plugins can be found in the [OpenSearch Project](https://github.com/opensearch-project) repository on GitHub. If you use any third-party plugins, then you should check the documentation for those plugins to determine whether they are compatible.

Go to [Available plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#available-plugins) to see a reference table that highlights version compatibility for bundled OpenSearch plugins.

Major, minor, and patch plugin versions must match OpenSearch major, minor, and patch versions in order to be compatible. For example, plugin versions 2.3.0.x work only with OpenSearch 2.3.0.
{: .important}

### Backing up configuration files

Mitigate the risk of data loss by backing up any important files before you start an upgrade. Generally, these files will be located in either of two directories:

- `opensearch/config`
- `opensearch-dashboards/config`

Some examples include `opensearch.yml`, `opensearch_dashboards.yml`, plugin configuration files, and TLS certificates. Once you identify which files you want to back up, copy them to remote storage for safety.

If you use security features, make sure to read [A word of caution]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/#a-word-of-caution) for information about backing up and restoring your security settings.

### Creating a snapshot

We recommend that you back up your cluster state and indexes using [snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/). Snapshots you take before an upgrade can be used as restore points if you need to roll back the cluster to its original version.

You can further reduce the risk of data loss by storing your snapshots on external storage, such as a mounted Network File System (NFS) or a cloud storage solution like those listed in the following table.

| Snapshot repository location | Required OpenSearch plugin |
| :--- | :--- |
| [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) | [repository-s3](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-s3) |
| [Google Cloud Storage (GCS)](https://cloud.google.com/storage) | [repository-gcs](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-gcs) |
| [Apache Hadoop Distributed File System (HDFS)](https://hadoop.apache.org/) | [repository-hdfs](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-hdfs) |
| [Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs) | [repository-azure](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-azure) |

## Upgrade methods

Choose an appropriate method for upgrading your cluster to a new version of OpenSearch based on your requirements:

- A [rolling upgrade](#rolling-upgrade) upgrades nodes one at a time without stopping the cluster.
- A [cluster restart upgrade](#cluster-restart-upgrade) upgrades services while the cluster is stopped.

Upgrades spanning more than a single major version of OpenSearch will require additional effort due to the need for reindexing. For more information, refer to the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API. See the [Index compatibility reference](#index-compatibility-reference) table included later in this guide for help planning your data migration.

### Rolling upgrade

A rolling upgrade is a great option if you want to keep your cluster operational throughout the process. Data may continue to be ingested, analyzed, and queried as nodes are individually stopped, upgraded, and restarted. A variation of the rolling upgrade referred to as "node replacement" follows exactly the same process except that hosts and containers are not reused for the new node. You might perform node replacement if you are upgrading the underlying host(s) as well.

OpenSearch nodes cannot join a cluster if the cluster manager is running a newer version of OpenSearch than the node requesting membership. To avoid this issue, upgrade the cluster-manager-eligible nodes last.


See [Rolling Upgrade]({{site.url}}{{site.baseurl}}/install-and-configure/upgrade-opensearch/rolling-upgrade/) for more information about the process.

### Cluster restart upgrade

OpenSearch administrators might choose to perform a cluster restart upgrade for several reasons, such as if the administrator doesn't want to perform maintenance on a running cluster or if the cluster is being migrated to a different environment.

Unlike a rolling upgrade, where only one node is offline at a time, a cluster restart upgrade requires you to stop OpenSearch and OpenSearch Dashboards on all nodes in the cluster before proceeding. After the nodes are stopped, a new version of OpenSearch is installed. Then OpenSearch is started and the cluster bootstraps to the new version.

## Compatibility

OpenSearch nodes are compatible with other OpenSearch nodes running any other *minor* version within the same *major* version release. For example, 1.1.0 is compatible with 1.3.7 because they are part of the same *major* version (1.x). Additionally, OpenSearch nodes and indexes are backward compatible with the previous major version. That means, for example, that an index created by an OpenSearch node running any 1.x version can be restored from a snapshot to an OpenSearch cluster running any 2.x version.

OpenSearch 1.x nodes are compatible with nodes running Elasticsearch 7.x, but the longevity of a mixed-version environment should not extend beyond cluster upgrade activities.
{: .tip}

Index compatibility is determined by the version of [Apache Lucene](https://lucene.apache.org/) that created the index. If an index was created by an OpenSearch cluster running version 1.0.0, then the index can be used by any other OpenSearch cluster running up to the latest 1.x or 2.x release. See the [Index compatibility reference](#index-compatibility-reference) table for Lucene versions running in OpenSearch 1.0.0 and later and [Elasticsearch](https://www.elastic.co/) 6.8 and later.

If your upgrade path spans more than a single major version and you want to retain any existing indexes, then you can use the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API to make your indexes compatible with the target version of OpenSearch before upgrading. For example, if your cluster is currently running Elasticsearch 6.8 and you want to upgrade to OpenSearch 2.x, then you must first upgrade to OpenSearch 1.x, recreate your indexes using the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API, and finally upgrade to 2.x. One alternative to reindexing is to reingest data from the origin, such as by replaying a data stream or ingesting data from a database.

### Index compatibility reference

If you plan to retain old indexes after the OpenSearch version upgrade, then you might need to reindex or reingest the data. Refer to the following table for Lucene versions across recent OpenSearch and Elasticsearch releases.

<style>
table {
    border-collapse: collapse;
    table-layout: fixed;
}
th {
  background-color: #F5F7F7;
}
th,
td {
  text-align: center;
  padding: 0.5em 1em;
}
</style>
<table>
    <tr>
        <th>Lucene Version</th>
        <th>OpenSearch Version</th>
        <th>Elasticsearch Version</th>
    </tr>
    <tr>
        <td>9.4.2</td>
        <td>2.5.0<br>2.4.1</td>
        <td>8.6</td>
    </tr>
    <tr>
        <td>9.4.1</td>
        <td>2.4.0</td>
        <td>&#8212;</td>
    </tr>
    <tr>
        <td>9.4.0</td>
        <td>&#8212;</td>
        <td>8.5</td>
    </tr>
    <tr>
        <td>9.3.0</td>
        <td>2.3.0<br>2.2.x</td>
        <td>8.4</td>
    </tr>
    <tr>
        <td>9.2.0</td>
        <td>2.1.0</td>
        <td>8.3</td>
    </tr>
    <tr>
        <td>9.1.0</td>
        <td>2.0.x</td>
        <td>8.2</td>
    </tr>
    <tr>
        <td>9.0.0</td>
        <td>&#8212;</td>
        <td>8.1<br>8.0</td>
    </tr>
    <tr>
        <td>8.11.1</td>
        <td>&#8212;</td>
        <td>7.17</td>
    </tr>
    <tr>
        <td>8.10.1</td>
        <td>1.3.x<br>1.2.x</td>
        <td>7.16</td>
    </tr>
    <tr>
        <td>8.9.0</td>
        <td>1.1.0</td>
        <td>7.15<br>7.14</td>
    </tr>
    <tr>
        <td>8.8.2</td>
        <td>1.0.0</td>
        <td>7.13</td>
    </tr>
    <tr>
        <td>8.8.0</td>
        <td>&#8212;</td>
        <td>7.12</td>
    </tr>
    <tr>
        <td>8.7.0</td>
        <td>&#8212;</td>
        <td>7.11<br>7.10</td>
    </tr>
    <tr>
        <td>8.6.2</td>
        <td>&#8212;</td>
        <td>7.9</td>
    </tr>
    <tr>
        <td>8.5.1</td>
        <td>&#8212;</td>
        <td>7.8<br>7.7</td>
    </tr>
    <tr>
        <td>8.4.0</td>
        <td>&#8212;</td>
        <td>7.6</td>
    </tr>
    <tr>
        <td>8.3.0</td>
        <td>&#8212;</td>
        <td>7.5</td>
    </tr>
    <tr>
        <td>8.2.0</td>
        <td>&#8212;</td>
        <td>7.4</td>
    </tr>
    <tr>
        <td>8.1.0</td>
        <td>&#8212;</td>
        <td>7.3</td>
    </tr>
    <tr>
        <td>8.0.0</td>
        <td>&#8212;</td>
        <td>7.2<br>7.1</td>
    </tr>
    <tr>
        <td>7.7.3</td>
        <td>&#8212;</td>
        <td>6.8</td>
    </tr>
</table>
<p style="text-align:right"><sub><em>A dash (&#8212;) indicates that there is no product version containing the specified version of Apache Lucene.</em></sub></p>
