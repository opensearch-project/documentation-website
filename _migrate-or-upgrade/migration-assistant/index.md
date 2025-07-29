---
layout: default
title: Migration Assistant
nav_order: 70
has_children: false
has_toc: true
permalink: /migrate-or-upgrade/migration-assistant/
---

# Migration Assistant

Migration Assistant for OpenSearch assists you in migrating or upgrading your Elasticsearch and OpenSearch workloads to OpenSearch managed clusters. This solution automates manual tasks with a low-risk and prescriptive migration path for existing and live data. It also includes advanced features, such as a metadata migration tool and capture and replay comparison tooling to help you identify potential migration and upgrade issues earlier. The migration process is streamlined, performance and behavioral comparisons based on real customer workloads are enabled, and the pre-migration, migration, and validation phases are accelerated.

This solution prescribes a systematic migration workflow to upgrade, migrate, recover, and modify an OpenSearch cluster. The workflow includes a migration console command line interface (CLI) for management, a dedicated scaling group for existing data backfill, and a replayer to synchronize live traffic between source and target clusters. Users can pause or abort the migration without affecting production traffic, thereby reducing risk. Additionally, the backfill functionality minimizes further risk by retrieving data from a snapshot, leaving the source cluster unaffected, and supporting multi-hop migrations, which decreases the overall number of migrations required.

Migration Assistant offers several key advantages for your migration and upgrade needs:

## Benefits

### Simplified management experience

Transfer data from an originating (source) cluster to a designated target (OpenSearch cluster).

### Adaptable, low-risk migration

Safely capture and replay traffic on source and target clusters to identify optimal performance while reducing migration risk through abort capabilities, comparison tools, source preservation, and multi-hop support.

### Centralized location for data analysis

Record requests and responses between the source and destination clusters for comparison, then forward the latency metrics and response codes to an analytics hub. You can analyze the data essential for transitioning your traffic from a legacy system to a new OpenSearch destination.

## Getting started

To find out more, refer to the [Migration Assistant documentation]({{site.url}}{{site.baseurl}}/migration-assistant/).
