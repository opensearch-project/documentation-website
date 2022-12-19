---
layout: default
title: Upgrade Overview
parent: Install OpenSearch
nav_order: 999
---

# Upgrade Overview

The OpenSearch Project releases regular updates that include new features, enhancements, and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. OpenSearch nodes and indexes are backwards-compatible by one major version. That means, for example, that you can restore an index to an OpenSearch 2.4.1 cluster from a snapshot that was taken on an OpenSearch 1.x cluster.

If your upgrade path spans more than a single major version, you will need to reindex your data before it can be read by the target version. For example, if your cluster is currently running Elasticsearch 6.8 and you want to upgrade to OpenSearch 2.x, you must first upgrade to OpenSearch 1.x, reindex your data, and then upgrade to 2.x. 

WORKING ON THIS PART HERE

Upgrades spanning more than a single major version will require reindexing, s

If your upgrade 
Keep in mind that index versions reflect the Lucene version used to create th
{: .note}

All minor versions in a major release are backwards-compatible. That means that you can upgrade nodes from one minor version to a newer minor version, but you can't downgrade to an older version.

To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To see a list of previous releases, or to learn more about how OpenSearch uses versioning, check out the [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

As with any upgrade, you should take time to plan the process before upgrading your OpenSearch cluster. For example, consider how long the upgrade process will take. If your cluster is being used in production, how impactful is downtime? Do you have infrastructure in place to stand up the new cluster in a dev environment before you move it into production, or do you need to upgrade the hosts in place? The answers to questions like these will help you determine which upgrade path will work best in your environment.

## Workflow considerations

An important part of the upgrade process is understanding how the new version of OpenSearch fits into your workflow. At a minimum, you should consider the following:

- Review [breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/).
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
/tools/index/#compatibility-matrices