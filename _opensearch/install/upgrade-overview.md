---
layout: default
title: Upgrade Overview
parent: Install OpenSearch
nav_order: 999
---

# Upgrade Overview

The OpenSearch Project releases regular updates that include new features and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. All minor versions in a major release are backwards-compatible. That means that you can upgrade nodes from one minor version to a newer minor version, but you can't downgrade to an older version.

To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To see a list of previous releases, or to learn more about how OpenSearch uses versioning, check out the [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

Take time to plan the process before upgrading your OpenSearch cluster. For example, consider how long the upgrade process will take. If your cluster is being used in production, how impactful is downtime? Do you have infrastructure in place to stand up the new cluster in a dev environment before you move it into production, or do you need to upgrade the hosts in place? The answers to questions like these will help you determine which upgrade path will work best in your environment.

## Workflow considerations

An important part of the upgrade process is understanding how the new version of OpenSearch fits into your workflow. In general, consider the following:

- Review any [breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/).
- Confirm that any plugins you use are compatible with the new version of OpenSearch.
- Document any files (like TLS certificates) that must be manually backed up.

## Upgrade methods

There are a few methods you can leverage to upgrade your OpenSearch cluster.

- [Restart upgrade](#restart-upgrade)
- [Rolling upgrade](#rolling-upgrade)
- [Node replacement](#node-replacement)







Writer notes-

Security settings can be backed up by dumping them into YAML files, then importing them into the new version and reinitializing the `.opendistro_security` index from the directory containing those YAML files.

Backup:
```bash
./securityadmin.sh -backup my-backup-directory \
  -icl \
  -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem
```

Restore:
```bash
./securityadmin.sh -cd /usr/share/opensearch/security-backups/ -icl -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem
```


Certificates must be manually backed up. (Awaiting confirmation)

Indexes can be backed up using Snapshots or they can be streamed to the new cluster with remote reindexing. (Awaiting confirmation)

Specific config files (opensearch.yml, opensearch_dashboards.yml, jvm.options, log4j2.properties) (Awaiting confirmation)