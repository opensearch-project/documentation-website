---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 30
has_children: true
has_toc: false
nav_exclude: true
permalink: /migration-assistant/
redirect_from:
  - /migration-assistant/overview/
  - /migration-assistant/index/
 
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

# ![Migration Assistant icon]({{site.url}}{{site.baseurl}}/images/icons/MigrationUpgrade_Color_Icon.svg){: .heading-icon} Migration Assistant for OpenSearch

**New: [Migration Companion]({{site.url}}{{site.baseurl}}/migration-assistant/migration-companion/)** — an AI-guided experience that handles assessment, deployment, and execution for you. Start a conversation in your IDE, AWS CloudShell, or Docker and the companion walks you through your entire migration. Or follow the manual guides below if you prefer to operate directly.
{: .tip }

Migration Assistant for OpenSearch helps you successfully perform an end-to-end, zero-downtime upgrade and migration to OpenSearch. There are three aspects of a migration that must be understood:

- **Metadata migration**: Migrate cluster metadata, such as index settings, aliases, and templates.
- **Backfill migration**: Migrate existing or historical data from a source to a target cluster.
- **Live traffic migration**: Replicate live ongoing traffic from a source to a target cluster.

This user guide focuses on conducting a comprehensive migration.

{% include list.html list_items=page.items%}
