---
layout: default
title: Upgrade Overview
parent: Install OpenSearch
nav_order: 999
---

# Upgrade Overview

The OpenSearch Project releases regular updates that include new features, enhancements, and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To see a list of previous releases, or to learn more about how OpenSearch uses versioning, check out the [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

OpenSearch nodes and indexes are backwards-compatible by one major version. That means, for example, that you can restore an index to an OpenSearch 2.4.1 cluster from a snapshot that was taken on an OpenSearch 1.x cluster. Index compatibility is determined by the version of OpenSearch or Lucene that created the index. If an index was created by an OpenSearch cluster running version 1.0, then the index could be used by any other OpenSearch cluster running up to the latest 1.x or 2.x release.

If your upgrade path spans more than a single major version, then you will need to use the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API to make your indexes compatible with the target version of OpenSearch. For example, if your cluster is currently running Elasticsearch 6.8 and you want to upgrade to OpenSearch 2.x, then you must first upgrade to OpenSearch 1.x, recreate your indexes using the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API, and finally upgrade to 2.x.

Reindexing data is a resource-intensive process. We recommend that you only reindex when necessary.
{: .tip}

## Workflow considerations

You should take time to plan the process before making any changes to your cluster. For example, consider how long the upgrade process will take. If your cluster is being used in production, how impactful is downtime? Do you have infrastructure in place to stand up the new cluster in a dev environment before you move it into production, or do you need to upgrade the hosts in-place? The answers to questions like these will help you determine which upgrade path will work best in your environment. At a minimum, you should consider the following:

- [Review breaking changes](#review-breaking-changes)
- [Review the OpenSearch tools compatibility matrices](#review-the-opensearch-tools-compatibility-matrices)
- [Check plugin compatibility](#check-plugin-compatibility)
- [Backup configuration files](#backup-configuration-files)
- [Create a snapshot](#create-a-snapshot)

### Review breaking changes

It's important to determine how the new version of OpenSearch will fit into your production environment. Review the list of [breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/) before beginning any upgrade procedures to determine if you will need to make adjustments in your workflow. For example, upstream or downstream components might need to be adjusted to take an API change into account.

### Review the OpenSearch tools compatibility matrices

Your OpenSearch cluster may interact with other services in your environment, like Logstash or Beats. Check the [OpenSearch tools compatibility matrices]({{site.url}}{{site.baseurl}}/tools/index/#compatibility-matrices) to see if any of your tools will also need to be upgraded.

### Check plugin compatibility

Review the plugins you use to determine whether or not they are compatible with the target version of OpenSearch. Many of the official plugins can be found in the official [OpenSearch Project](https://github.com/opensearch-project) repository on GitHub. If you use any unofficial or third party plugins, then you should check the documentation for those plugins to determine if they will be compatible.

### Backup configuration files

Mitigate the risk of data loss by backing up any important files before you start an upgrade. Generally speaking, these files will be located in `opensearch/config` (OpenSearch) and `opensearch-dashboards/config` (OpenSearch Dashboards). Some examples include `opensearch.yml`, `opensearch_dashboards.yml`, security plugin backups, and TLS certificates. Once you identify which files you need to back up, copy them to remote storage so they can be restored, if necessary.

### Create a snapshot

We recommend that you back up your cluster state and indexes using [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/). If the security plugin is enabled then you will need to take a additional steps, because the `.opendistro_security` index can't be directly restored. See [A word of caution]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/#a-word-of-caution) for details about backing up and restoring your security settings.

## Upgrade methods

Choose an appropriate upgrade method for your situation.

- [Restart upgrade](#restart-upgrade)
- [Rolling upgrade](#rolling-upgrade)

### Restart upgrade



### Rolling upgrade

