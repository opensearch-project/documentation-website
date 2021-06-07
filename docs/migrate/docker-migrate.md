---
layout: default
title: Docker migration
parent: Migrate to OpenSearch
nav_order: 25
---

# Docker migration

If you use Docker Compose, we highly recommend that you perform what amounts to a [cluster restart upgrade](../upgrade-migrate/). Update your cluster configuration with new images, new settings, and new environment variables.  Then stop and start the cluster. This process requires downtime, but takes very few steps and lets you continue to treat the cluster as a single entity that you can reliably deploy and redeploy.

The most important step is to leave your data volumes intact. **Don't** run `docker-compose down -v`.

If you use a container orchestration system like Kubernetes (or manage your containers manually) and want to avoid downtime, think of the process not as an upgrade of each node, but as a decommissioning and replacement of each node. Gradually add OpenSearch nodes to the cluster while removing Elasticsearch OSS nodes.
