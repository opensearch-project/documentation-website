---
layout: default
title: Update Data Source API
parent: Data Source APIs
nav_order: 40
---

# Update Data Source API
**Introduced 2.4**
{: .label .label-purple }

The Update Data Source API allows you to modify the configuration of an existing data source. This API is useful when you need to update connection details, credentials, properties, or access controls for a data source that has already been created.

<!-- spec_insert_start
api: query.datasources_update
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_query/_datasources
```
<!-- spec_insert_end -->

## Request body fields

The request body is required. It is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `connector` | **Required** | String | The connector type for the data source. |
| `name` | **Required** | String | The name of the data source to update. This must match an existing data source. |
| `properties` | **Required** | Object | The configuration properties for the data source. |
| `resultIndex` | **Required** | String | The index where query results from this data source are stored. |
| `status` | **Required** | String | The current status of the data source. |
| `allowedRoles` | Optional | Array of Strings | List of roles that are allowed to access this data source. |
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
| `credentials` | **Required** | Object | Authentication credentials for the data source. |
| `endpoint` | **Required** | String | The connection endpoint for the data source. |

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

The following example updates a MySQL data source to change its description, allowed roles, and connection timeout:

```json
PUT /_plugins/_query/_datasources
{
  "name": "mysql-customer-database",
  "description": "Updated connection to customer database - Production",
  "connector": "mysql",
  "resultIndex": "customer_data_results",
  "status": "ACTIVE",
  "allowedRoles": ["analyst_role", "admin_role", "reporting_role"],
  "configuration": {
    "endpoint": "jdbc:mysql://mysql-server:3306/customers",
    "credentials": {
      "username": "db_user",
      "password": "new_db_password"
    }
  },
  "properties": {
    "database": "customers",
    "port": "3306",
    "host": "mysql-server",
    "encryption": true,
    "connectionTimeout": 60000
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
  "message": "Data source updated successfully."
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `dataSourceId` | String | The unique identifier for the updated data source. |
| `name` | String | The name of the data source. |
| `status` | String | The status of the data source. |
| `message` | String | A message describing the result of the operation. |

## Usage notes

When updating data sources, consider these important points:

- **Complete configuration**: You must provide a complete data source configuration in the update request. The update operation replaces the entire data source configuration.

- **Existing name**: The `name` parameter must match an existing data source. If no data source with the specified name exists, the update operation will fail.

- **Credential management**: If you need to update only non-sensitive information and want to preserve existing credentials, you still need to include the credentials in the update request. Consider retrieving the current configuration first, then modifying only the necessary fields.

- **Test after update**: After updating a data source, especially when changing connection details or credentials, test the connection to ensure it is still functioning properly.

- **Role changes**: When modifying the `allowedRoles` array, include all roles that should have access after the update, as the previous role assignments will be replaced.

- **Status management**: You can update the `status` field to enable or disable a data source (for example, changing from `ACTIVE` to `DISABLED`).

- **Permissions**: Users need appropriate permissions to update data sources. Typically, this requires administrative privileges.