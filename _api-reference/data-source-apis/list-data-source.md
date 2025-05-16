---
layout: default
title: List Data Sources API
parent: Data Source APIs
nav_order: 20
---

# List Data Sources API
**Introduced 2.4**
{: .label .label-purple }

The List Data Sources API returns information about all registered data sources in your OpenSearch cluster. This API allows you to view all available data sources, their configurations, and their current status, helping you monitor and manage your data federation setup.

<!-- spec_insert_start
api: query.datasources_list
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_query/_datasources
```
<!-- spec_insert_end -->

## Example request

```bash
GET /_plugins/_query/_datasources
```
{% include copy-curl.html %}

## Example response

```json
[
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
  },
  {
    "id": "hxUYM5QB-QllXHAp7qG9",
    "name": "prometheus-metrics",
    "description": "Prometheus time-series database",
    "connector": "prometheus",
    "resultIndex": "metrics_results",
    "status": "ACTIVE",
    "allowedRoles": ["monitoring_role"],
    "configuration": {
      "endpoint": "http://prometheus-server:9090",
      "credentials": {
        "username": "prom_user",
        "password": "******"
      }
    },
    "properties": {
      "timeout": 60000,
      "maxDataPoints": 1000
    }
  }
]
```

## Response body fields

The response body is an **array of JSON objects**. Each object represents a data source and has the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `connector` | **Required** | String | The connector type for the data source such as `s3glue`, `prometheus`, or `mysql`.  |
| `name` | **Required** | String | The name of the data source. |
| `properties` | **Required** | Object | The configuration properties for the data source. |
| `resultIndex` | **Required** | String | The index where query results are stored. |
| `status` | **Required** | String | The current status of the data source, either `ACTIVE`, `DISABLED`, or `ERROR`. |
| `allowedRoles` | Optional | Array of Strings | List of roles that are allowed to access this data source. |
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

The List Data Sources API is useful for several administrative and operational tasks:

- **Inventory management**: Maintain an inventory of all configured data sources in your environment.

- **Status monitoring**: Check the status of all data sources to identify any that might be experiencing issues.

- **Configuration auditing**: Review data source configurations to ensure they follow security best practices and organizational policies.

- **Access control verification**: Inspect `allowedRoles` to confirm that data sources are accessible only to appropriate user roles.

- **Troubleshooting**: When query federation issues occur, check the data source configurations to identify potential problems.

- **Documentation**: Generate documentation about available data sources for users who may need to query them.

Note that sensitive information such as passwords is masked in the response for security reasons. For security best practices, restrict access to this API to administrative users only, as it provides detailed information about your data sources and their connection details.