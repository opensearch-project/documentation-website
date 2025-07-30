---
layout: default
parent: Migration Assistant for OpenSearch
title: Key components
nav_order: 20
permalink: /migration-assistant/key-components/
redirect_from:
  - /migration-assistant/overview/key-components/
---

# Key components 

The following are the key components of Migration Assistant.

## Elasticsearch/OpenSearch source

In this solution, your source cluster operates on either Elasticsearch or OpenSearch and is hosted on Amazon Elastic Compute Cloud (Amazon EC2) instances or in a similar computing environment. Traffic is rerouted from the source cluster to a Traffic Capture Proxy and replayed to a target typically on a later version of OpenSearch.

## Migration console

The migration console provides a migration-specific CLI and offers a variety of tools for streamlining the migration process. You can perform everything necessary for completing a migration, other than cleaning up the migration resources, through this console.

## Traffic Capture Proxy

This component is designed for HTTP RESTful traffic. It forwards traffic to the source cluster and also splits and channels this traffic to a stream processing service for later playback.

## Traffic Replayer

Acting as a traffic simulation tool, [Traffic Replayer]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/) replays recorded request traffic to a target cluster, mirroring source traffic patterns. It links original requests and their responses to those directed at the target cluster, facilitating comparative analysis.

## Metadata Migration Tool

The metadata migration tool integrated into the Migration CLI can be used independently to migrate cluster metadata, including index mappings, index configuration settings, templates, component templates, and aliases.

## Reindex-from-Snapshot

`Reindex-from-Snapshot` (RFS) reindexes data from an existing snapshot. Amazon Elastic Container Service (Amazon ECS) workers coordinate the migration of documents from an existing snapshot, reindexing the documents in parallel to a target cluster.

## Target cluster

The target cluster is the destination cluster for migration or comparison cluster in an A/B test.
