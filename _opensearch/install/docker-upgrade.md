---
layout: default
title: Upgrade OpenSearch - Docker
parent: Install OpenSearch
nav_order: 1000
---

# Upgrade OpenSearch - Docker

The OpenSearch Project continually releases updates that include new features and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. All minor versions that are part of the same major release are backwards-compatible. That means that you can upgrade nodes from one minor version to a newer minor version, but you can't downgrade to an older one.

Before upgrading, you should create a backup of your cluster state using [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/) so you can restore the cluster to its original state if a rollback is necessary.
{: .note}

To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To see a list of previous releases, or to learn more about how OpenSearch uses versioning, check out the [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

## Minor version upgrade

Details about major version upgrade process.

## Major version upgrade

Details about major version upgrade process.