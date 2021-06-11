---
layout: default
title: Snapshot migration
nav_order: 5
---

# Snapshot migration

One popular approach is to take a [snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshot-restore/) of your Elasticsearch OSS 6.x or 7.x indices, [create an OpenSearch cluster]({{site.url}}{{site.baseurl}}/opensearch/install/), restore the snapshot on the new cluster, and point your clients to the new host.

The snapshot approach can mean running two clusters in parallel, but lets you validate that the OpenSearch cluster is working in a way that meets your needs prior to modifying the Elasticsearch OSS cluster.
