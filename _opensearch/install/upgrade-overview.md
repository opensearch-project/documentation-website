---
layout: default
title: Upgrade Overview
parent: Install OpenSearch
nav_order: 999
---

# Upgrade Overview

The OpenSearch Project releases regular updates that include new features, enhancements, and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To see a list of previous releases, or to learn more about how OpenSearch uses versioning, check out the [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

OpenSearch nodes and indexes are backwards-compatible by one major version. That means, for example, that you can restore an index to an OpenSearch 2.4.1 cluster from a snapshot that was taken on an OpenSearch 1.x cluster. Index compatibility is determined by the version of OpenSearch or Lucene that created the index. If an index was created by an OpenSearch cluster running version 1.0, then the index could be used by any other OpenSearch cluster running up to the latest 1.x or 2.x release.

If your upgrade path spans more than a single major version, then you will need to use the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API to make your indexes compatible with the target version of OpenSearch. For example, if your cluster is currently running Elasticsearch 6.8 and you want to upgrade to OpenSearch 2.x, then you must first upgrade to OpenSearch 1.x, recreate your indexes using the reindex API, and finally upgrade to 2.x.

Reindexing is a resource-intensive process. We recommend that you only reindex when necessary.
{: .tip}

As with any upgrade, you should take time to plan the process before upgrading your OpenSearch cluster. For example, consider how long the upgrade process will take. If your cluster is being used in production, how impactful is downtime? Do you have infrastructure in place to stand up the new cluster in a dev environment before you move it into production, or do you need to upgrade the hosts in place? The answers to questions like these will help you determine which upgrade path will work best in your environment.

## Workflow considerations

An important part of the upgrade process is understanding how the new version of OpenSearch fits into your workflow. At a minimum, you should consider the following:

- Review [breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/).
- Review the [OpenSearch tools compatibility matrices]({{site.url}}{{site.baseurl}}/tools/index/#compatibility-matrices).
- Confirm that any plugins you use are compatible with the new version of OpenSearch.
- Backup configuration files to remote storage.

### Review breaking changes

It's important to determine how the new version of OpenSearch will fit into your production environment. Review the list of [breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/) before beginning any upgrade procedures to determine if you will need to make any adjustments to your upstream or downstream components or any custom tooling your workflow uses.

## Upgrade methods

Choose an appropriate upgrade method for your situation.

- [Restart upgrade](#restart-upgrade)
- [Rolling upgrade](#rolling-upgrade)
- [Node replacement](#node-replacement)


Compatibility matrix relative url for use later:
