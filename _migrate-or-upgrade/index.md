---
layout: default
title: Migrate or upgrade
has_children: true
has_toc: false
permalink: /upgrade-or-migrate/
redirect_from:
  - /migrate-or-upgrade/index/
  - /upgrade-opensearch/index/
  - /migrate-or-upgrade/
  - /upgrade-to/index/
  - /upgrade-to/
  - /upgrade-to/upgrade-to/
nav_exclude: true
---
# Migrate or upgrade OpenSearch

The OpenSearch Project releases regular updates that include new features, enhancements, and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/206) on GitHub. To view a list of previous releases or to learn more about how OpenSearch uses versioning, see [Release schedule and maintenance policy]({{site.url}}/releases.html).

Upgrading or migrating OpenSearch is essential for maintaining optimal performance, security, and access to the latest features. Whether you're upgrading an existing OpenSearch deployment or migrating from another system such as Elasticsearch OSS, choosing the right approach is critical to a successful transition.

This page outlines upgrade planning guidance and four supported methods: rolling upgrades, snapshot and restore, remote reindexing, and using Migration Assistant.

---

## Before you begin

Take time to plan the process before making any changes to your cluster:

- How long will the upgrade process take?
- Can your system tolerate downtime?
- Do you have the ability to test in a staging environment?

Make sure to:

- Review [breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/).
- Check [plugin compatibility]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#available-plugins).
- Review the [OpenSearch tools compatibility matrices]({{site.url}}{{site.baseurl}}/tools/index/#compatibility-matrices).
- Back up [configuration files](#backing-up-configuration-files).
- Take a [snapshot](#creating-a-snapshot).

Stop nonessential indexing before upgrading.
{: .tip}

---

## Migration and upgrade methods

### Rolling upgrade

Upgrade one node at a time while keeping the cluster operational.

**Pros**:
- Minimal downtime
- No new infrastructure needed

**Cons**:
- Supports only adjacent major versions.
- Multiple upgrade cycles for larger version gaps.
- Reindexing may be required.
- Manual reindex may be required for full feature compatibility.

[Perform a rolling upgrade]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/).

---

### Snapshot and restore

Take a snapshot of your current cluster and restore to a new OpenSearch version.

**Pros**:
- Supports large datasets and cold storage.
- Reversion possible since original cluster is untouched. However, there may be a loss of data if no change data capture (CDC) solution is in place. 

**Cons**:
- Requires downtime or a CDC solution.
- Requires provisioning a new cluster.
- Manual reindexing may be required for full feature compatibility.

[Get started with snapshot and restore](https://docs.aws.amazon.com/solutions/latest/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/).

---

### Migration Assistant

Migration Assistant provides the most automated and resilient upgrade path.

**Pros**:
- Handles multi-version hops, allowing for seamless upgrades across multiple versions.
- Live data capture allows for little to zero downtime, ensuring data consistency during migrations.
- Ability to revert changes if issues arise during or after the upgrade

**Cons**:
- Requires additional setup
- Requires additional infrastructure

[Get started with Migration Assistant]({{site.url}}{{site.baseurl}}/migration-assistant/).

---

### Remote reindexing

Reindex data from the old cluster into the new OpenSearch cluster.

**Pros**:
- No downtime
- Supports large version jumps

**Cons**:
- Slower and more resource intensive
- Can degrade source cluster performance

Learn more in the [Reindex API documentation]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/).

---

## Additional considerations

Before proceeding with your chosen migration or upgrade method, review the following compatibility requirements.

### Reviewing the OpenSearch tools compatibility matrices

If your OpenSearch cluster interacts with other services in your environment, like Logstash or Beats, then you should check the [OpenSearch tools compatibility matrices]({{site.url}}{{site.baseurl}}/tools/index/#compatibility-matrices) to determine whether other components will need to be upgraded.

### Reviewing plugin compatibility

Review your plugins to determine compatibility with the target version of OpenSearch. Official OpenSearch Project plugins can be found in the [OpenSearch Project](https://github.com/opensearch-project) repository on GitHub. If you use any third-party plugins, then you should check the documentation for those plugins to determine whether they are compatible.

Go to [Available plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#available-plugins) to see a reference table that highlights version compatibility for bundled OpenSearch plugins.

Major, minor, and patch plugin versions must match OpenSearch major, minor, and patch versions in order to be compatible. For example, plugin versions 2.3.0.x work only with OpenSearch 2.3.0.
{: .important}

---

## Backing up configuration files

Back up important files such as `opensearch.yml`, plugin configurations, and TLS certifications from these paths:

- `opensearch/config`
- `opensearch-dashboards/config`

See [this security configuration guidance]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/#a-word-of-caution).

---

## Creating a snapshot

We recommend that you back up your cluster state and indexes using [snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/). Snapshots you take before an upgrade can be used as restore points if you need to roll back the cluster to its original version.

You can further reduce the risk of data loss by storing your snapshots in external storage, such as a mounted Network File System (NFS) or a cloud storage solution like those listed in the following table.

| Repository | Plugin |
| --- | --- |
| [Amazon S3](https://aws.amazon.com/s3/) | [repository-s3](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-s3) |
| [Google Cloud Storage](https://cloud.google.com/storage) | [repository-gcs](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-gcs) |
| [HDFS](https://hadoop.apache.org/) | [repository-hdfs](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-hdfs) |
| [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs) | [repository-azure](https://github.com/opensearch-project/OpenSearch/tree/{{site.opensearch_version}}/plugins/repository-azure) |

---

## Index compatibility reference

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
  <tr><th>Lucene version</th><th>OpenSearch version</th><th>Elasticsearch version</th></tr>
  <tr><td>9.10.0</td><td>2.14.0<br>2.13.0</td><td>8.13</td></tr>
  <tr><td>9.9.2</td><td>2.12.0</td><td>&#8212;</td></tr>
  <tr><td>9.7.0</td><td>2.11.1<br>2.9.0</td><td>8.9.0</td></tr>
  <tr><td>9.6.0</td><td>2.8.0</td><td>8.8.0</td></tr>
  <tr><td>9.5.0</td><td>2.7.0<br>2.6.0</td><td>8.7.0</td></tr>
  <tr><td>9.4.2</td><td>2.5.0<br>2.4.1</td><td>8.6</td></tr>
  <tr><td>9.4.1</td><td>2.4.0</td><td>&#8212;</td></tr>
  <tr><td>9.4.0</td><td>&#8212;</td><td>8.5</td></tr>
  <tr><td>9.3.0</td><td>2.3.0<br>2.2.x</td><td>8.4</td></tr>
  <tr><td>9.2.0</td><td>2.1.0</td><td>8.3</td></tr>
  <tr><td>9.1.0</td><td>2.0.x</td><td>8.2</td></tr>
  <tr><td>9.0.0</td><td>&#8212;</td><td>8.1<br>8.0</td></tr>
  <tr><td>8.11.1</td><td>&#8212;</td><td>7.17</td></tr>
  <tr><td>8.10.1</td><td>1.3.x<br>1.2.x</td><td>7.16</td></tr>
  <tr><td>8.9.0</td><td>1.1.0</td><td>7.15<br>7.14</td></tr>
  <tr><td>8.8.2</td><td>1.0.0</td><td>7.13</td></tr>
  <tr><td>8.8.0</td><td>&#8212;</td><td>7.12</td></tr>
  <tr><td>8.7.0</td><td>&#8212;</td><td>7.11<br>7.10</td></tr>
  <tr><td>8.6.2</td><td>&#8212;</td><td>7.9</td></tr>
  <tr><td>8.5.1</td><td>&#8212;</td><td>7.8<br>7.7</td></tr>
  <tr><td>8.4.0</td><td>&#8212;</td><td>7.6</td></tr>
  <tr><td>8.3.0</td><td>&#8212;</td><td>7.5</td></tr>
  <tr><td>8.2.0</td><td>&#8212;</td><td>7.4</td></tr>
  <tr><td>8.1.0</td><td>&#8212;</td><td>7.3</td></tr>
  <tr><td>8.0.0</td><td>&#8212;</td><td>7.2<br>7.1</td></tr>
  <tr><td>7.7.3</td><td>&#8212;</td><td>6.8</td></tr>
</table>
<p style="text-align:right"><sub><em>A dash (&#8212;) indicates that no version contains the listed Lucene version.</em></sub></p>
