---
layout: default
title: Get Data Source API
parent: Data Source APIs
nav_order: 30
---

# Get Data Source API
**Introduced 2.4**
{: .label .label-purple }

The Get Data Source API retrieves detailed information about a specific data source by name. This API is useful when you need to inspect the configuration, connection details, or status of an individual data source in your OpenSearch environment.

<!-- spec_insert_start
api: query.datasource_retrieve
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_query/_datasources/{datasource_name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: query.datasource_retrieve
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `datasource_name` | **Required** | String | The name of the data source to retrieve. |

<!-- spec_insert_end -->

## Example request

```bash
GET /_plugins/_query/_datasources/mysql-customer-database
```
{% include copy-curl.html %}

## Example response

```json
{
  "id": "gxUYL4QB-QllXHAp5pF4",
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
      "password": "******"
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

## Response body fields

The response body is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `connector` | **Required** | String | The connector type for the data source. |
| `name` | **Required** | String | The name of the data source. |
| `properties` | **Required** | Object | The configuration properties for the data source. |
| `resultIndex` | **Required** | String | The index where query results are stored. |
| `status` | **Required** | String | The current status of the data source. |
| `allowedRoles` | Optional | Array of Strings | The roles allowed to access this data source. |
| `configuration` | Optional | Object | Additional configuration settings for the data source connection. |
| `description` | Optional | String | The description of the data source. |
| `id` | **Required** | String | The unique identifier for the data source. |

<details markdown="block">
  <summary>
    Response body fields: <code>configuration</code>
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
    Response body fields: <code>configuration</code> > <code>credentials</code>
  </summary>
  {: .text-delta }

`credentials` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `username` | **Required** | String | The username for authentication. |
| `password` | **Required** | String | The password for authentication (masked in the response). |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>properties</code>
  </summary>
  {: .text-delta }

The `properties` object contains fields specific to each connector type. Each connector includes different properties depending on its type and configuration.

</details>

## Usage notes

The Get Data Source API is particularly useful in these scenarios:

- **Configuration verification**: Confirm that a data source is configured correctly before attempting to query it.

- **Troubleshooting**: When experiencing issues with a specific data source, retrieve its configuration to diagnose the problem.

- **Documentation**: Generate detailed documentation for a specific data source.

- **Auditing**: Review the configuration of a specific data source for security or compliance purposes.

If the specified data source doesn't exist, the API returns a `404 Not Found error`. For security reasons, sensitive information such as passwords is masked in the response. Access to this API should be restricted to users who need to view data source configurations.