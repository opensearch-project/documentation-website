---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 2
has_toc: false
has_children: true
permalink: /migration-assistant/
redirect_from:
  - /upgrade-or-migrate/migration-assistant/
  - /migration-assistant/index/
  - /migrate-or-upgrade/migration-assistant/index/
  - /upgrade-to/snapshot-migrate/
items:
  - heading: "Is Migration Assistant right for you?"
    description: "Evaluate whether Migration Assistant is right for your use case."
    link: "/migration-assistant/is-migration-assistant-right-for-you/"
  - heading: "Key components"
    description: "Get familiar with the key components of Migration Assistant."
    link: "/migration-assistant/key-components/"
  - heading: "Architecture"
    description: "Understand how Migration Assistant integrates into your infrastructure."
    link: "/migration-assistant/architecture/"
  - heading: "Execute your migration in phases"
    description: "A step-by-step guide for performing a migration."
    link: "/migration-assistant/migration-phases/"
---

# Migration Assistant for OpenSearch

Migration Assistant for OpenSearch aids you in successfully performing an end-to-end, zero-downtime migration to OpenSearch from other search providers. It helps with the following scenarios:

- **Metadata migration**: Migrating cluster metadata, such as index settings, aliases, and templates.
- **Backfill migration**: Migrating existing or historical data from a source to a target cluster.
- **Live traffic migration**: Replicating live ongoing traffic from a source to a target cluster.
- **Comparative tooling**: Comparing the performance and behaviors of an existing cluster with a prospective new one.

This user guide focuses on conducting a comprehensive migration involving both existing and live data with zero downtime and the option to back out of a migration.

{% include list.html list_items=page.items%}
