---
layout: default
title: Upgrading OpenSearch
nav_order: 1
has_children: true
redirect_from:
  - /upgrade-opensearch/index/
---

# Upgrade OpenSearch

The OpenSearch Project releases regular updates that include new features, enhancements, and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To see a list of previous releases, or to learn more about how OpenSearch uses versioning, check out the [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

OpenSearch nodes and indexes are backwards-compatible by one major version. That means, for example, that you can restore an index to an OpenSearch 2.4.1 cluster from a snapshot that was taken on an OpenSearch 1.x cluster. Index compatibility is determined by the version of OpenSearch or Lucene that created the index. If an index was created by an OpenSearch cluster running version 1.0, then the index could be used by any other OpenSearch cluster running up to the latest 1.x or 2.x release.

The following table can be used as a reference for Lucene versions running in OpenSearch 1.0 and later and [Elasticsearch](https://www.elastic.co/) 6.8 and later.

If your upgrade path spans more than a single major version, and you want to maintain existing indexes, then you will need to use the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API to make your indexes compatible with the target version of OpenSearch before upgrading. For example, if your cluster is currently running Elasticsearch 6.8 and you want to upgrade to OpenSearch 2.x, then you must first upgrade to OpenSearch 1.x, recreate your indexes using the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API, and finally upgrade to 2.x.

## Workflow considerations

You should take time to plan the process before making any changes to your cluster. For example, consider how long the upgrade process will take. If your cluster is being used in production, how impactful is downtime? Do you have infrastructure in place to stand up the new cluster in a dev environment before you move it into production, or do you need to upgrade the hosts in-place? The answers to questions like these will help you determine which upgrade path will work best in your environment. At a minimum, you should:

- [Review breaking changes](#review-breaking-changes)
- [Review the OpenSearch tools compatibility matrices](#review-the-opensearch-tools-compatibility-matrices)
- [Check plugin compatibility](#check-plugin-compatibility)
- [Back up configuration files](#back-up-configuration-files)
- [Create a snapshot](#create-a-snapshot)

Before upgrading your production cluster, test the new version of OpenSearch in a development environment to validate functionality and compatibility with components in your production workflow.
{: .tip}

Stop any non-essential indexing before you begin the upgrade procedure.
{: .tip}

### Review breaking changes

It's important to determine how the new version of OpenSearch will fit into your production environment. Review the list of [breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/) before beginning any upgrade procedures to determine if you will need to make adjustments in your workflow. For example, upstream or downstream components might need to be adjusted to take an API change into account.

### Review the OpenSearch tools compatibility matrices

Your OpenSearch cluster may interact with other services in your environment, like Logstash or Beats. Check the [OpenSearch tools compatibility matrices]({{site.url}}{{site.baseurl}}/tools/index/#compatibility-matrices) to see if any of your tools will also need to be upgraded.

### Check plugin compatibility

Review the plugins you use to determine whether or not they are compatible with the target version of OpenSearch. Many of the official plugins can be found in the official [OpenSearch Project](https://github.com/opensearch-project) repository on GitHub. If you use any unofficial or third party plugins, then you should check the documentation for those plugins to determine if they will be compatible.

### Back up configuration files

Mitigate the risk of data loss by backing up any important files before you start an upgrade. Generally speaking, these files will be located in `opensearch/config` (OpenSearch) and `opensearch-dashboards/config` (OpenSearch Dashboards). Some examples include `opensearch.yml`, `opensearch_dashboards.yml`, security plugin backups, and TLS certificates. Once you identify which files you need to back up, copy them to remote storage so they can be restored, if necessary.

### Create a snapshot

We recommend that you back up your cluster state and indexes using [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/). If the security plugin is enabled then you will need to take a additional steps, because the `.opendistro_security` index can't be directly restored. See [A word of caution]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/#a-word-of-caution) for details about backing up and restoring your security settings.

## Upgrade methods

Choose an appropriate method for upgrading your cluster to a new version of OpenSearch based on your requirements.

- [Rolling upgrade](#rolling-upgrade) allows you to upgrade nodes individually without stopping the cluster.
- [Cluster restart upgrade](#cluster-restart-upgrade) allows the upgrade to be performed while the cluster is stopped.

Upgrades spanning more than a single major version of OpenSearch will require additional effort due to the need for reindexing. You should upgrade in steps, one major version at a time. After each upgrade you should reindex because OpenSearch is not compatible with indexes that are more than a single major version behind your cluster's OpenSearch/Lucene version. For more information, refer to the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API.

### Rolling upgrade

Rolling upgrades are a great option if you want to keep your cluster operational throughout the process. Shard replication is stopped temporarily, then nodes are upgraded one at a time. A variation of the rolling upgrade, often referred to as "node replacement," is exactly the same process except hosts or containers are not reused for the new node.

OpenSearch nodes cannot join a cluster if the cluster manager is running a newer version of OpenSearch than the node requesting membership. To avoid this issue, you upgrade cluster manager-eligible nodes last.

### Cluster restart upgrade

OpenSearch administrators might choose a restart upgrade if they aren't comfortable performing maintenance on a running cluster, if the cluster is being migrated to different infrastructure, or if they manage their cluster with [Docker Compose](https://github.com/docker/compose). During a rolling upgrade, only a single node is offline at any point in time. The cluster restart upgrade, however, involves stopping all nodes in the cluster, performing the upgrade, and starting the cluster back up.

## Compatibility

ADD TO ME! Here I'll add some commentary about what version compatibility considerations can be taken into account. Maybe another table or external link references would be good.

### Lucene version reference

If you plan to retain old indexes after the OpenSearch version upgrade, then you might need to reindex or reingest the data. Refer to the table below for Lucene versions across recent OpenSearch and Elasticsearch releases.

<style>
table {
    border-collapse: collapse;
}
th {
  background-color: #F5F7F7;
}
th,
td {
  text-align: left;
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
        <td>-</td>
    </tr>
    <tr>
        <td>9.4.0</td>
        <td>-</td>
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
        <td>-</td>
        <td>8.1<br>8.0</td>
    </tr>
    <tr>
        <td>8.11.1</td>
        <td>-</td>
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
        <td>-</td>
        <td>7.12</td>
    </tr>
    <tr>
        <td>8.7.0</td>
        <td>-</td>
        <td>7.11<br>7.10</td>
    </tr>
<!-- Commenting this section of the table out - is this valuable to readers or should we only go back to 1.0.0 / 7.10.2?
    <tr>
        <td>8.6.2</td>
        <td>-</td>
        <td>7.9</td>
    </tr>
    <tr>
        <td>8.5.1</td>
        <td>-</td>
        <td>7.8<br>7.7</td>
    </tr>
    <tr>
        <td>8.4.0</td>
        <td>-</td>
        <td>7.6</td>
    </tr>
    <tr>
        <td>8.3.0</td>
        <td>-</td>
        <td>7.5</td>
    </tr>
    <tr>
        <td>8.2.0</td>
        <td>-</td>
        <td>7.4</td>
    </tr>
    <tr>
        <td>8.1.0</td>
        <td>-</td>
        <td>7.3</td>
    </tr>
    <tr>
        <td>8.0.0</td>
        <td>-</td>
        <td>7.2X7.1</td>
    </tr>
    <tr>
        <td>7.7.3</td>
        <td>-</td>
        <td>6.8</td>
    </tr>
End of the trimmed section -->
</table>