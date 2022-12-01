---
layout: default
title: Upgrade OpenSearch - Docker
parent: Install OpenSearch
nav_order: 1000
---

# Upgrade OpenSearch - Docker

The OpenSearch Project continually releases updates that include new features and bug fixes. OpenSearch uses [Semantic Versioning](https://semver.org/), which means that breaking changes are only introduced between major version releases. All minor versions that are part of the same major release are backwards-compatible. That means that you can upgrade nodes from one minor version to a newer minor version, but you can't downgrade to an older one.

Before upgrading, you should create a backup of your cluster's current state using [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/) so you can restore the cluster to its original state if a rollback is necessary.
{:.note}

To learn about upcoming features and fixes, review the [OpenSearch Project Roadmap](https://github.com/orgs/opensearch-project/projects/1) on GitHub. To see a list of previous releases, or to learn more about how OpenSearch uses versioning, check out the [Release Schedule and Maintenance Policy]({{site.url}}/releases.html).

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. For help with [Docker](https://www.docker.com/) or [Docker Compose](https://github.com/docker/compose), refer to the official documentation on their websites.
{:.note}

The Docker Compose commands used in this guide are written with a hyphen (for example, `docker-compose`). If you installed Docker Desktop on your machine, which automatically installs a bundled version of Docker Compose, then you should remove the hyphen. For example, change `docker-compose` to `docker compose`.
{:.note}

## Minor version upgrade

Upgrading your OpenSearch cluster to a newer minor version is a straightforward process. Because minor versions are backwards-compatible within a cluster, you only need to update the image in your Docker Compose file.

Before you begin, make sure that you've backed-up any important data. Store the snapshot in a secure, external repository so that it isn't overwritten by mistake during the upgrade.

1. Stop the cluster.
```bash
docker-compose down
```

## Major version upgrade

Details about major version upgrade process.