---
layout: default
title: Install OpenSearch
nav_order: 2
redirect_from:
  - /opensearch/install/
has_children: true
---

# Install and configure OpenSearch

OpenSearch has two installation options at this time: Docker images and tarballs.

OpenSearch does not support direct version downgrades. If your environment must be downgraded, we recommend using snapshots to create a restore point, then restoring the snapshot to a cluster built with the target version. To learn more about restore points, see [Restore snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#restore-snapshots).
{: .note }

<! A comment to the OpenSearch page to test DCO from an external contributors perspective >
