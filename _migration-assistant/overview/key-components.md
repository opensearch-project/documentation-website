---
layout: default
title: Key components
nav_order: 10
parent: Overview
---

# Key components 

The following are the key components of Migration Assistant.

## Elasticsearch/OpenSearch source

In this solution, your source cluster operates on either Elasticsearch or OpenSearch and is hosted on Amazon Elastic Compute Cloud (Amazon EC2) instances or in a similar computing environment. A proxy is set up to interact with this source cluster, either positioned in front of or directly on the coordinating nodes of the cluster.

## Migration console

The migration console provides a migration-specific CLI and offers a variety of tools for streamlining the migration process. Everything necessary for completing a migration, other than cleaning up the migration resources, can be performed through this console.

## Traffic capture proxy

This component is designed for HTTP RESTful traffic. It forwards traffic to the source cluster and also splits and channels this traffic to a stream processing service for later playback.

## Traffic Replayer

Acting as a traffic simulation tool, [Traffic Replayer](https://docs.opensearch.org/docs/latest/migration-assistant/migration-phases/live-traffic-migration/using-traffic-replayer/) replays recorded request traffic to a target cluster, mirroring source traffic patterns. It links original requests and their responses to those directed at the target cluster, facilitating comparative analysis.

## Metadata migration tool

The metadata migration tool integrated into the Migration CLI can be used independently to migrate cluster metadata, including index mappings, index configuration settings, templates, component templates, and aliases.

## Reindex-from-Snapshot

`Reindex-from-Snapshot` (RFS) reindexes data from an existing snapshot. Amazon Elastic Container Service (Amazon ECS) workers coordinate the migration of documents from an existing snapshot, reindexing the documents in parallel to a target cluster.

## Target cluster

The target cluster is the destination cluster for migration or comparison in an A/B test.