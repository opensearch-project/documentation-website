---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 30
has_children: true
has_toc: false
nav_exclude: true
permalink: /classic/migration-assistant/
redirect_from:
  - /migration-assistant/index/
 
items:
  - heading: "Is Migration Assistant right for you?"
    description: "Evaluate whether Migration Assistant is right for your use case."
    link: "/classic/migration-assistant/is-migration-assistant-right-for-you/"
  - heading: "Key components"
    description: "Get familiar with the key components of Migration Assistant."
    link: "/classic/migration-assistant/key-components/"
  - heading: "Architecture"
    description: "Understand how Migration Assistant integrates into your infrastructure."
    link: "/classic/migration-assistant/architecture/"
  - heading: "Execute your migration in phases"
    description: "A step-by-step guide for performing a migration."
    link: "/classic/migration-assistant/migration-phases/"
---
<p class="classic-version-warning">You're viewing the <strong>classic</strong> version of Migration Assistant documentation (ECS/CDK-based). For the latest Kubernetes-based version, see the <a href="/latest/migration-assistant/">current documentation</a>.</p>

# ![Migration Assistant icon]({{site.url}}{{site.baseurl}}/images/icons/MigrationUpgrade_Color_Icon.svg){: .heading-icon} Migration Assistant for OpenSearch

Migration Assistant for OpenSearch helps you successfully perform an end-to-end, zero-downtime upgrade and migration to OpenSearch. There are three aspects of a migration that must be understood:

- **Metadata migration**: Migrate cluster metadata, such as index settings, aliases, and templates.
- **Backfill migration**: Migrate existing or historical data from a source to a target cluster.
- **Live traffic migration**: Replicate live ongoing traffic from a source to a target cluster.

This user guide focuses on conducting a comprehensive migration.

{% include list.html list_items=page.items%}
