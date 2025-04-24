---
layout: default
title: Using snapshots to migrate data
nav_order: 5
canonical_url: https://docs.opensearch.org/docs/latest/upgrade-to/snapshot-migrate/
---

# Using snapshots to migrate data

One popular approach is to take a [snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore) of your Elasticsearch OSS 6.x or 7.x indexes, [create an OpenSearch cluster]({{site.url}}{{site.baseurl}}/opensearch/install/), restore the snapshot on the new cluster, and point your clients to the new host.

The snapshot approach can mean running two clusters in parallel, but lets you validate that the OpenSearch cluster is working in a way that meets your needs prior to modifying the Elasticsearch OSS cluster.

Elasticsearch OSS version | Snapshot migration path
:--- | :--- 
5.x | Upgrade to 5.6, then upgrade to 6.8. Reindex all 5.x indexes, make a snapshot, and restore in OpenSearch 1.x.
6.x | Make a snapshot and restore in OpenSearch 1.x
7.x | Make a snapshot and restore in OpenSearch 1.x or OpenSearch 2.x
