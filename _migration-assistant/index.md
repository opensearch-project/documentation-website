---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 1
has_children: false
nav_exclude: true
has_toc: false
permalink: /migration-assistant/
redirect_from:
  - /migration-assistant/index/
  - /upgrade-to/index/
  - /upgrade-to/
  - /upgrade-to/upgrade-to/
tutorial_cards:
  - heading: "Overview"
    description: "Get familiar with the key components of Migration Assistant and evaluate your use case."
    link: "/migration-assistant/overview/"
  - heading: "Migration phases"
    description: "Execute your migration in phases—metadata, backfill, and traffic replay—for a controlled and validated transition."
    link: "/migration-assistant/migration-phases/"
---

# Migration Assistant for OpenSearch

Migration Assistant for OpenSearch aids you in successfully performing an end-to-end, zero-downtime migration to OpenSearch from other search providers. It helps with the following scenarios:

- **Metadata migration**: Migrating cluster metadata, such as index settings, aliases, and templates.
- **Backfill migration**: Migrating existing or historical data from a source to a target cluster.
- **Live traffic migration**: Replicating live ongoing traffic from a source to a target cluster.
- **Comparative tooling**: Comparing the performance and behaviors of an existing cluster with a prospective new one.

This user guide focuses on conducting a comprehensive migration involving both existing and live data with zero downtime and the option to back out of a migration.

{% include cards.html cards=page.tutorial_cards %}

