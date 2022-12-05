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

Upgrading your OpenSearch cluster to a newer **minor** version is straightforward because a minor version upgrade will inherit the configuration and data that already exist in your cluster. You should still create and store a backup of your cluster on a remote host to mitigate any risk of data loss. See [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/) for more information.

1. Stop the cluster. Don't use the `-v` option, which deletes the cluster's Docker volumes.
    ```bash
    docker-compose down
    ```
1. Modify your Docker Compose file by changing the specified `image` to the target upgrade version. You might also want to modify settings or environment variables to enable a newly released feature. See the documentation for that feature for details about enabling it.
1. Start the cluster with the updated Docker Compose file.
    ```bash
    docker-compose up
    ```
1. Wait for the containers to start, then query the [Cluster stats]({{site.url}}{{site.baseurl}}/api-reference/cluster-stats/) API to confirm that the version upgrade was successful. OpenSearch will return a response body that includes versions for all installed components, including OpenSearch, JDK, and plugins.
    ```bash
    # This sample response is from a cluster that was upgraded from 2.3.0 to 2.4.0.
    $ curl "https://localhost:9200/_cat/nodes?v&h=name,version&format=json&pretty=true" -ku admin:admin
    [
    {
        "name" : "opensearch-node2",
        "version" : "2.4.0"
    },
    {
        "name" : "opensearch-node1",
        "version" : "2.4.0"
    }
    ]
    ```

## Major version upgrade

There are several methods available for upgrading across major versions with OpenSearch. Which method you choose depends on how your infrastructure is deployed.

- Snapshot and restore
- Restart Upgrade
- Rolling Upgrade
- Node replacement
- Remote reindexing
    - Reindexing is the option to “replay” all of the original source documents into the new cluster. Reindexing needs to be used in conjunction with some of the other approaches in some contexts (e.g. if you are doing a rolling upgrade across multiple major versions, you currently need to reindex within the cluster between major versions), but it can also be used as a standalone method.

