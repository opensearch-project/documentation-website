---
layout: default
title: Data Source APIs
has_children: true
nav_order: 20
---

# Data Source APIs
**Introduced 2.4**
{: .label .label-purple }

The Data Source APIs enable you to create, manage, and interact with external data sources in OpenSearch. Data sources represent connections to external databases or services, allowing you to query data that lives outside your OpenSearch cluster. This query capability powers cross-database analytics, dashboards, and reporting.

## What are data sources?

Data sources in OpenSearch establish connections to external data repositories, such as:

- Relational databases (MySQL, PostgreSQL, SQL Server)
- Cloud data stores (Amazon S3, Google BigQuery, Snowflake)
- Time-series databases (Prometheus, InfluxDB)
- Document databases (MongoDB)

These connections enable OpenSearch to execute queries against external data and integrate the results with data stored in OpenSearch indexes, all within a unified query interface. This capability is particularly valuable for organizations with data distributed across multiple systems.

## Use cases for data sources

Data sources support numerous analytical and operational scenarios:

- **Cross-database analytics**: Join data from multiple sources to create comprehensive reports.
- **Historical data analysis**: Query archived data stored in cost-effective object storage.
- **Real-time dashboards**: Combine streaming data in OpenSearch with reference data in external systems.
- **Hybrid search**: Leverage specialized capabilities of different database engines.

## Available APIs

The Data Source APIs include:

- [Create Data Source API]({{site.url}}{{site.baseurl}}/api-reference/data-source-apis/create-data-source/): Register a new external data source connection.
- [List Data Sources API]({{site.url}}{{site.baseurl}}/api-reference/data-source-apis/list-data-source/): Retrieve information about all configured data sources.
- [Get Data Source API]({{site.url}}{{site.baseurl}}/api-reference/data-source-apis/get-data-source/): Retrieve details about a specific data source.
- [Update Data Source API]({{site.url}}{{site.baseurl}}/api-reference/data-source-apis/update-data-source/): Modify an existing data source configuration.
- [Delete Data Source API]({{site.url}}{{site.baseurl}}/api-reference/data-source-apis/delete-data-source/): Remove a data source that is no longer needed.

## Security considerations

Data sources represent connections to external systems and often contain sensitive information such as credentials. Consider the following security best practices:

- Implement proper access controls to restrict who can create, modify, and use data sources.
- Use the `allowedRoles` parameter to limit which users can access specific data sources.
- Store credentials securely and rotate them regularly.
- Audit data source access and changes using OpenSearch audit logs.

## Data source lifecycle

Managing data sources typically follows this workflow:

1. **Create**: Register a new data source with connection details and credentials.
2. **Configure**: Set appropriate access controls and properties.
3. **Test**: Verify the connection works properly.
4. **Use**: Query the data source through SQL or PPL queries.
5. **Monitor**: Track usage and performance.
6. **Update**: Modify configurations as needed.
7. **Delete**: Remove data sources that are no longer required.

## Best practices

For optimal data source management, remember the following best practices:

- **Connection pooling**: Configure appropriate connection pool settings for high-concurrency scenarios.
- **Result caching**: Use result indexes effectively to cache query results and reduce load on source systems.
- **Credentials management**: Implement a secure process for rotating credentials.
- **Documentation**: Maintain documentation about available data sources and their intended use cases.
- **Testing**: Validate data source configurations in lower environments before deploying to production.
- **Monitoring**: Set up alerts for data source connectivity issues.
