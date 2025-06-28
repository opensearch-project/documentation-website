---
layout: default
title: Delete Data Source API
parent: Data Source APIs
nav_order: 50
---

# Delete Data Source API
**Introduced 2.4**
{: .label .label-purple }

The Delete Data Source API allows you to remove an existing data source from your OpenSearch cluster. This API is useful when you need to decommission a data source that is no longer needed, remove a misconfigured data source, or clean up unused resources.

<!-- spec_insert_start
api: query.datasource_delete
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_query/_datasources/{datasource_name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: query.datasource_delete
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `datasource_name` | **Required** | String | The name of the data source to delete. |

<!-- spec_insert_end -->

## Example request

```bash
DELETE /_plugins/_query/_datasources/mysql-customer-database
```
{% include copy-curl.html %}

## Example response

```json
{
  "dataSourceId": "gxUYL4QB-QllXHAp5pF4",
  "name": "mysql-customer-database",
  "message": "Data source deleted successfully."
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `dataSourceId` | String | The unique identifier of the deleted data source. |
| `name` | String | The name of the deleted data source. |
| `message` | String | A message describing the result of the operation. |

## Usage notes

When deleting data sources, consider these important implications:

- **Permanent operation**: Deleting a data source is a permanent operation and cannot be undone. If you need the data source again in the future, you will need to recreate it.

- **Active queries**: Deletion of a data source will fail if there are active queries using the data source. It's recommended to ensure no active queries are running against the data source before attempting to delete it.

- **Result index**: The `resultIndex` associated with the data source is not automatically deleted. If you want to remove the stored query results, you'll need to delete that index separately.

- **Dependent objects**: Any saved queries, visualizations, or dashboards that reference the deleted data source may stop functioning. Ensure that you update or remove any dependent objects before or after deleting a data source.

- **Permissions**: Deleting data sources typically requires administrative privileges.

- **Cleanup considerations**: Consider backing up the data source configuration before deletion if there's a possibility you might need to recreate it in the future.