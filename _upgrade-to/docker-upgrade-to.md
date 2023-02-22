---
layout: default
title: Migrating Docker clusters to OpenSearch
nav_order: 25
---

# Migrating Docker clusters to OpenSearch

If you use a container orchestration system like Kubernetes (or manage your containers manually) and want to avoid downtime, think of the process not as an upgrade of each node, but as a decommissioning and replacement of each node. One by one, add OpenSearch nodes to the cluster and remove Elasticsearch OSS nodes, pointing to existing data volumes as necessary and allowing time for all indexes to return to a green status prior to proceeding.

If you use Docker Compose, we highly recommend that you perform what amounts to a [cluster restart upgrade]({{site.url}}{{site.baseurl}}/upgrade-to/upgrade-to/). Update your cluster configuration with new images, new settings, and new environment variables, and test it. Then stop and start the cluster. This process requires downtime, but takes very few steps and lets you continue to treat the cluster as a single entity that you can reliably deploy and redeploy.

The most important step is to leave your data volumes intact. **Don't** run `docker-compose down -v`.
