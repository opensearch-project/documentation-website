---
layout: default
title: Create Data Source API
parent: Data Source APIs
nav_order: 10
---

# Create Data Source API
**Introduced 2.4**
{: .label .label-purple }

The Create Data Source API allows you to register and configure external data sources that can be queried through OpenSearch's query engine. Data sources represent connections to external databases or services, enabling cross-database querying and data federation capabilities.

<!-- spec_insert_start
api: query.datasources_create
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_query/_datasources
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `connector` | **Required** | String | The connector type for the data source such as `s3glue`, `prometheus`, or `mysql`. |
| `name` | **Required** | String | The name of the data source. This must be unique within the cluster. |
| `properties` | **Required** | Object | The configuration properties for the data source, specific to each connector type. |
| `resultIndex` | **Required** | String | The index where query results from this data source are stored. |
| `status` | **Required** | String | The current status of the data source. Set to `ACTIVE` for a new data source. |
| `allowedRoles` | Optional | Array of strings | List of roles that are allowed to access this data source. |
| `configuration` | Optional | Object | Additional configuration settings for the data source connection. |
| `description` | Optional | String | A human-readable description of the data source. |

<details markdown="block">
  <summary>
    Request body fields: <code>configuration</code>
  </summary>
  {: .text-delta }

`configuration` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `credentials` | **Required** | Object | The authentication credentials for the data source. |
| `endpoint` | **Required** | String | The connection endpoint for the data source (such as URL and hostname). |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>configuration</code> > <code>credentials</code>
  </summary>
  {: .text-delta }

`credentials` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `username` | **Required** | String | The username for authentication. |
| `password` | **Required** | String | The password for authentication. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>properties</code>
  </summary>
  {: .text-delta }

The `properties` object contains fields specific to each connector type. Each connector requires different properties for establishing connections and executing queries. Refer to the specific connector documentation for details about required properties.

</details>

## Example request

The following example creates a MySQL data source:

```json
POST /_plugins/_query/_datasources
{
  "name": "mysql-customer-database",
  "description": "Connection to customer database",
  "connector": "mysql",
  "resultIndex": "customer_data_results",
  "status": "ACTIVE",
  "allowedRoles": ["analyst_role", "admin_role"],
  "configuration": {
    "endpoint": "jdbc:mysql://mysql-server:3306/customers",
    "credentials": {
      "username": "db_user",
      "password": "db_password"
    }
  },
  "properties": {
    "database": "customers",
    "port": "3306",
    "host": "mysql-server",
    "encryption": true,
    "connectionTimeout": 30000
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "dataSourceId": "gxUYL4QB-QllXHAp5pF4",
  "name": "mysql-customer-database",
  "status": "ACTIVE",
  "message": "Data source created successfully."
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `dataSourceId` | String | The unique identifier for the created data source. |
| `name` | String | The name of the data source. |
| `status` | String | The status of the data source. |
| `message` | String | A message describing the result of the operation. |

## Usage notes

When creating data sources in OpenSearch, it's important to consider both security and performance implications. Data sources serve as bridges between your OpenSearch cluster and external data systems, enabling powerful cross-database queries and data federation scenarios. However, they also represent potential security boundaries and performance bottlenecks if not configured properly. The following guidelines will help you implement data sources securely and efficiently

- **Security**: Store credentials securely. Consider using a secrets manager or environment variables instead of hardcoding credentials.
  
- **Connection testing**: After creating a data source, use the test connection API to verify connectivity.
  
- **Role-based access**: Use `allowedRoles` to restrict access to the data source to specific user roles.
  
- **Result index**: The `resultIndex` parameter specifies where query results will be stored. Ensure appropriate index permissions are configured.
  
- **Connector types**: Different connector types have specific property requirements. Consult the documentation for your specific connector.
  
- **Status management**: A newly created data source typically has the status "ACTIVE". Other possible statuses include "DISABLED" or "ERROR".
  
- **Permissions**: Users need appropriate permissions to create data sources. Typically, this requires administrative privileges.