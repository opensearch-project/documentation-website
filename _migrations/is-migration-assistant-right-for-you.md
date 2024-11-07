---
layout: default
title: Is Migration Assistant right for you?
nav_order: 5
---

# Is Migration Assistant right for you?

Before deciding if Migration Assistant is right for you, it's important to assess your specific needs and understand the available tools for performing an upgrade or migration.

Migration Assistant addresses gaps found in other migration solutions, but in some cases, alternative tools may be a better fit.

For instance, if you need to upgrade more than one major version—such as moving from Elasticsearch 6.8 to OpenSearch 2.3—Migration Assistant allows you to do this in a single hop. In contrast, other options like rolling upgrades or snapshot restore would require multiple steps, as they cannot handle major version jumps without reindexing your data. Additionally, if you need to capture live traffic and perform a zero-downtime migration, Migration Assistant would be the right choice.

There are also tools available for migrating cluster configuration, templates, and aliases, which can be helpful depending on the complexity of your setup. These tools streamline the migration process by preserving critical settings and custom configurations.

## Migration paths

| **Source Version**          | **Target Version**               |
|-----------------------------|----------------------------------|
| Elasticsearch 6.8           | OpenSearch 1.3                   |
| Elasticsearch 6.8           | OpenSearch 2.14                  |
| Elasticsearch 7.10.2        | OpenSearch 1.3                   |
| Elasticsearch 7.10.2        | OpenSearch 2.14                  |
| Elasticsearch 7.17          | OpenSearch 1.3                   |
| Elasticsearch 7.17          | OpenSearch 2.14                  |
| OpenSearch 1.3              | OpenSearch 2.14                  |

 
Minor versions within the specified major versions above (i.e., Elasticsearch 6 and 7 and OpenSearch 1 and 2) at not yet supported, but the versions above are tested.
{: .note}

### Supported Source and Target Platforms
* Self-managed (hosted by cloud provider or on-premises)
* AWS OpenSearch

The tooling is designed to work with other cloud provider platforms, but it is not officially tested with these other platforms. If you would like to add support, please contact one of the maintainers on [GitHub](https://github.com/opensearch-project/opensearch-migrations/blob/main/MAINTAINERS.md).

### Future migration paths

The following table shows planned migration paths:

| **Source Version**          | **Target Version**               | **Tracking Issue** |
|-----------------------------|----------------------------------|--------------------|
| Elasticsearch 8.x           | OpenSearch 2.x                   |[Issue](https://github.com/opensearch-project/opensearch-migrations/issues/1071)|
| Elasticsearch 5.6           | OpenSearch 2.x                   |[Issue](https://github.com/opensearch-project/opensearch-migrations/issues/1067)|
| Elasticsearch 2.3           | OpenSearch 2.x                   |[Issue](https://github.com/opensearch-project/opensearch-migrations/issues/1069)|
| Elasitcsearch 1.5           | OpenSearch 2.x                   |[Issue](https://github.com/opensearch-project/opensearch-migrations/issues/1070)|
| OpenSearch 2.x              | OpenSearch 2.x                   |[Issue](https://github.com/opensearch-project/opensearch-migrations/issues/1038)|

## Supported components

Before starting a migration, consider the scope of the components involved. The table below outlines the components that should be considered for migration, indicates their support by the Migration Assistant, and provides comments and recommendations.

| Component | Supported | Recommendations   |
| :--- |:--- | :--- |
| **Documents**  | Yes  | Migrate existing data with `reindex-from-snapshot` and live traffic with `capture-and-replay`. |
| **Index settings**  | Yes   | Migrate with the metadata migration tool. |
| **Index mappings**  | Yes   | Migrate with metadata migration tool.  |
| **Index templates**   | Yes   | Migrate with metadata migration tool. |
| **Component templates**          | Yes                 | Migrate with Metadata Migration Tool                                                                                                                                                                |
| **Aliases**                      | Yes                 | Migrate with Metadata Migration Tool                                                                                                                                                                |
| **ISM policies**                 | Expected in 2025    | Manually migrate using API                                                                                                                                                                          |
| **Elasticsearch kibana dashboards** | Expected in 2025 | Only needed if tooling is being used to migrate Elasticsearch Kibana Dashboards to OpenSearch Dashboards. Export JSON files from Kibana and import into OpenSearch Dashboards; before importing, use the [dashboardsSanitizer](https://github.com/opensearch-project/opensearch-migrations/tree/main/dashboardsSanitizer) tool on X-Pack visualizations like Canvas and Lens in Kibana Dashboards, as they may require recreation for compatibility with OpenSearch. |
| **Security constructs**          | No                  | Configure roles and permissions based on cloud provider recommendations. For example, if using AWS, leverage IAM for enhanced security management.                                                  |
| **Plugins**                      | No                  | Check plugin compatibility; some Elasticsearch plugins may not have direct equivalents in OpenSearch.                                                                                              |

---

## Migration Assistant - questionnaire

The following questionnaire can help you decide whether migration assistant is right for you?

### High-level / Project management questions:

1. **By when do you expect the migration to be completed?**  
   *Why it’s important:*  
   Understanding the timeline helps set realistic expectations for your migration and allows you to plan resources accordingly.

2. **How much downtime can you afford during the migration?**  
   *Why it’s important:*  
   This defines a migration strategy that helps prevent unexpected service disruptions. Decide whether you can afford zero-downtime or migrate with controlled outages.

3. **What are your primary goals for the migration?**  
   (e.g., Performance improvement, cost reduction, feature enhancement, etc.)  
   *Why it’s important:*  
   Clarifying the objectives helps tailor the migration process to meet the customer’s expectations and success criteria.

4. **What's your level of acceptance for discrepancies during the upgrade?**  
   ( If relevancy is re-ordered because the two clusters aren’t exactly in sync, is this tolerable?)  
   *Why it’s important:*  

   For example, decide whether if relevancy is re-ordered because the two clusters aren’t exactly in sync, is this tolerable?  This will help gauge the flexibility of the customer, especially when dealing with non-deterministic elements like ranking in search results or latency variations.

5. **Are there any SLAs in place for downstream users or services?**  
   *Why it’s important:*  

   Understanding what SLAs are currently in place ensures that any changes to performance or downtime does not violate contractual agreements, maintaining service quality.

6. **Do you foresee any regulatory or compliance constraints that might impact the migration timeline or execution?**  
   *Why it’s important:*  

   Compliance requirements can dictate migration approaches, particularly regarding data handling, encryption, or audit logging.

7. **Are you open to a trusted proxy preceding your source cluster, even if it adds a 10-30ms latency?**  
   *Why it’s important:*  

   A proxy can make certain migrations smoother, like for reindexing or log collection, but it’s crucial to assess the customer’s tolerance for added latency.

8. **Do you possess a dedicated environment for trial upgrades before the production shift?**  
   *Why it’s important:*  
   Outline what you typical upgrade process looks like. Testing in a dedicated environment before production can prevent unexpected issues and allow for smoother transitions.

9. **Do you have a rollback plan in case the migration encounters issues?**  
   *Why it’s important:*  

   Rollback strategies help ensure business continuity in case the migration fails, minimizing risks to the business.

---

### Technical Questions

#### Platform & Architecture:

1. **What are the source and target platforms and their versions?**  
   *Why it’s important:*  
   [Compatibility between versions](#migration-paths) is key for smooth migrations, ensuring the right tools and processes are used.

2. **Provide a breakdown of nodes in the cluster.**  
   (e.g., Total nodes, number of coordinating nodes, and number of data nodes.)  
   *Why it’s important:*  
   Determine the total number of nodes in your cluster, including the number of coordinating nodes and the number of data nodes. The structure of the cluster affects the complexity of the migration and helps in resource planning.

3. **Are retention policies in place?**    
   *Why it’s important:*  
   If retention policies are in place, how long will those policies last and are they relevant to all indexes. Retention policies could influence the size of the data that needs to be migrated and how backups or archiving strategies are handled. They may also impact the recommended migration solution.

4. **How do you currently handle backup and recovery in your cluster?**  
   *Why it’s important:*  

   A solid backup and recovery strategy is essential for minimizing data loss and ensuring a smooth migration.

5. **Are there schematic diagrams showcasing how Elasticsearch/OpenSearch integrates with your entire system?**  
   *Why it’s important:*  

   Understanding the full architecture helps ensure that the migration doesn’t break any dependencies and that integrations continue to work post-migration.

6. **Which authentication and authorization mechanisms are in place?**  
   *Why it’s important:*  
   
   Security configurations need to be migrated and verified to maintain data access controls and compliance post-migration.

---

#### Data & Cluster Metrics:

1. **How much data is stored in the cluster?**  
   *Why it’s important:*  
   Helps estimate the time and resources required for data transfer, and determines the migration method (batch or streaming).

2. **Could you specify the mean and peak throughput of the cluster?**  
   *Why it’s important:*  
   Understanding the performance requirements ensures that the target environment can handle both normal and peak loads.

3. **What are the transactions per second?**  
   (Also, indices per second, queries per second.)  
   *Why it’s important:*  
   This allows for proper sizing and performance tuning of the target cluster.

4. **How many shards do you have and what is the max shard size?**  
   *Why it’s important:*  
   Shard size and distribution affect performance and the ease of migration, especially in large datasets.

5. **What version of the Lucene index are you currently using?**  
   *Why it’s important:*  
   Index compatibility is critical to ensure the integrity of the data when moving between different versions of Elasticsearch or OpenSearch.

6. **Do source documents contain a _source field?**  
   *Why it’s important:*  
   The _source field is essential for data recovery and reindexing; knowing this helps in planning for data replication or migration methods.

---

#### Application & Use:

1. **What's the main application of your cluster?**  
   (e.g., search, logging, analytics, etc.)  
   *Why it’s important:*  
   The use case determines the criticality of different features (e.g., search accuracy vs. logging performance) in the target environment.

2. **How many client applications connect to the cluster?**  
   (Are you aware of any potential upgrade compatibility concerns?)  
   *Why it’s important:*  
   Compatibility with clients is crucial for a smooth migration. Some clients might need reconfiguration or updates.

3. **Are there any specific integrations (e.g., AWS, GCP, third-party services) that need to be tested during the migration?**  
   *Why it’s important:*  
   Identifying critical integrations helps ensure they continue to function post-migration, preventing system-wide issues.

4. **Share any specifics about the requests directed at your cluster that might pose migration challenges.**  
   (e.g., request format, payload size.)  
   *Why it’s important:*  
   Helps identify any request patterns or payloads that might be problematic during the migration process.

5. **Do clients hit source domains directly, or is there a layer of indirection?**  
   (e.g., load balancer)  
   *Why it’s important:*  
   Understanding how traffic flows into the cluster helps in designing a migration plan with minimal client disruption.

---

#### Security & Plugins:

1. **Is inter-node encryption active within the cluster?**  
   *Why it’s important:*  
   Ensures that the migration process adheres to the customer’s security requirements, especially for sensitive data.

2. **Do you have data encryption at rest enabled?**  
   *Why it’s important:*  
   Encryption settings might need reconfiguration post-migration, and this helps avoid compliance or security issues.

3. **List any plugins in use that will require migration.**  
   *Why it’s important:*  
   Some plugins may not be compatible with newer versions of OpenSearch, requiring alternatives or upgrades.

4. **Are you utilizing Kibana or any other visualization tools?**  
   *Why it’s important:*  
   Ensures that dashboards and visualization setups are preserved or replicated post-migration.

5. **Are you aware of any custom scripts or ingest pipelines currently in use?**  
   *Why it’s important:*  
   Custom components may require validation or modification during the migration, preventing post-migration breakage.

---

#### History & Deployment:

1. **Provide the details of the most recent upgrade, including versions involved.**  
   (If available, a history of all upgrade paths would be beneficial.)  
   *Why it’s important:*  
   Helps in assessing potential issues with upgrade compatibility and identifies if any manual fixes were applied during previous upgrades.

2. **How do you install/deploy Elasticsearch/OpenSearch?**  
   *Why it’s important:*  
   Deployment methods (e.g., Docker, Kubernetes, bare metal) will affect the migration process and the setup of the target cluster.

3. **Do you have any custom monitoring or alerting tools set up for the cluster?**  
   (e.g., Datadog, Prometheus, OpenSearch Dashboards.)  
   *Why it’s important:*  
   Monitoring tools may require reconfiguration to work with the new environment, ensuring continued operational visibility.
4. **Can you provide the original version of Elasticsearch/OpenSearch that was used for each of the indices in your cluster?**  
   *Why it’s important:*  
   The version history of indices is critical because older index versions may not be compatible with the current or target platform during the migration. Knowing the original versions helps identify any necessary reindexing steps, ensures compatibility with the target cluster, and prevents potential issues related to index corruption, feature deprecation, or incompatibility with newer versions of OpenSearch. It also aids in planning for adjustments in index mappings and settings that may have changed over different versions.

These same questions are available in 
[OpenSearch Migrations Assessment - Version 5.docx](https://github.com/user-attachments/files/17177220/OpenSearch.Migrations.Assessment.-.Version.5.docx).