---
layout: default
title: Upgrade Process
parent: Install OpenSearch
nav_order: 999
---

# Upgrade Process

Before upgrading your OpenSearch cluster, you should take time to plan the process. For example, consider how long the upgrade process might take. If your cluster is being used in production, how impactful is downtime? Do you have infrastructure in place to stand up the new cluster in a dev environment for testing before you move it into production, or do you need to turn down your cluster while performing the upgrade? The answers to questions like these will help you determine which upgrade path will work best in your environment.

There are a few methods you can leverage to upgrade your OpenSearch cluster.

- Restart upgrade
- Rolling upgrade
- Node replacement

Additionally, you can restore your indexed data.

- Snapshots
- Remote reindexing

