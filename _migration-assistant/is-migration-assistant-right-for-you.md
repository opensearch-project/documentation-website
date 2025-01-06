---
layout: default
title: Is Migration Assistant right for you?
nav_order: 5
---

# Is Migration Assistant right for you?

Before deciding if Migration Assistant is right for you, it's important to assess your specific needs and understand the available tools for performing an upgrade or migration.

Migration Assistant addresses gaps found in other migration solutions, but in some cases, alternative tools may be a better fit.

For instance, if you need to upgrade more than one major version, such as moving from Elasticsearch 6.8 to OpenSearch 2.15, Migration Assistant allows you to do this in a single hop. In contrast, other options like rolling upgrades or snapshot restore would require multiple steps because they cannot handle major version jumps without reindexing your data. Additionally, if you need to capture live traffic and perform a zero-downtime migration, Migration Assistant would be the right choice.

There are also tools available for migrating cluster configuration, templates, and aliases, which can be helpful depending on the complexity of your setup. These tools streamline the migration process by preserving critical settings and custom configurations.

## Migration paths

| **Source Version**          | **Target Version**               |
|-----------------------------|----------------------------------|
| Elasticsearch 6.8           | OpenSearch 1.3                   |
| Elasticsearch 6.8           | OpenSearch 2.15                  |
| Elasticsearch 7.10.2        | OpenSearch 1.3                   |
| Elasticsearch 7.10.2        | OpenSearch 2.15                  |
| Elasticsearch 7.17          | OpenSearch 1.3                   |
| Elasticsearch 7.17          | OpenSearch 2.15                  |
| OpenSearch 1.3              | OpenSearch 2.15                  |

 
{: .note}

### Supported source and target platforms

* Self-managed (hosted by cloud provider or on-premises)
* AWS OpenSearch

The tooling is designed to work with other cloud provider platforms, but it is not officially tested with these other platforms. If you would like to add support, please contact one of the maintainers on [GitHub](https://github.com/opensearch-project/opensearch-migrations/blob/main/MAINTAINERS.md).

### Future migration paths

To see the OpenSearch migrations roadmap, go to [OpenSearch Migrations - Roadmap](https://github.com/orgs/opensearch-project/projects/229/views/1).

## Supported components

Before starting a migration, consider the scope of the components involved. The table below outlines the components that should be considered for migration, indicates their support by the Migration Assistant, and provides comments and recommendations.

| Component | Supported | Recommendations   |
| :--- |:--- | :--- |
| **Documents**  | Yes  | Migrate existing data with `reindex-from-snapshot` (RFS) and live traffic with Capture and Replay. |
| **Index settings**  | Yes   | Migrate with the metadata migration tool. |
| **Index mappings**  | Yes   | Migrate with the metadata migration tool.  |
| **Index templates**   | Yes   | Migrate with the metadata migration tool. |
| **Component templates**          | Yes                 | Migrate with the metadata migration tool.                                                                                                                                                                |
| **Aliases**                      | Yes                 | Migrate with the metadata migration tool.                                                                                                                                                                |
| **Index State Management (ISM) policies**                 | Expected in 2025    | Manually migrate using an API.                                                                                                                                                                          |
| **Elasticsearch Kibana dashboards** | Expected in 2025 | This tool is only needed when used to migrate Elasticsearch Kibana Dashboards to OpenSearch Dashboards. To start, export JSON files from Kibana and import them into OpenSearch Dashboards; before importing, use the [`dashboardsSanitizer`](https://github.com/opensearch-project/opensearch-migrations/tree/main/dashboardsSanitizer) tool on X-Pack visualizations like Canvas and Lens in Kibana Dashboards, as they may require recreation for compatibility with OpenSearch. |
| **Security constructs**          | No                  | Configure roles and permissions based on cloud provider recommendations. For example, if using AWS, leverage AWS Identity and Access Management (IAM) for enhanced security management.                                                  |
| **Plugins**                      | No                  | Check plugin compatibility; some Elasticsearch plugins may not have direct equivalents in OpenSearch.                                                                                              |
