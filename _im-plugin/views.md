---
layout: default
title: Views
nav_order: 14
---

# Views

In OpenSearch, managing and querying data across multiple indices can be complex, especially when dealing with large datasets or when you want to abstract the complexity of underlying data structures. Views in OpenSearch introduce a powerful way to simplify data access and manipulation by providing a virtual layer over one or more indices. This feature is akin to SQL views and is designed to offer flexibility, improve security, and reduce the maintenance overhead of OpenSearch indices.

## Get started with Views

A View in OpenSearch is a virtual index that allows you to define a projection over one or more physical indices. It enables you to perform search operations across multiple indices as if they were a single index. Views can be used hide index schema, dynamically reshape from its indexed format, and limit data exposure.

### Step 1: Create a View

To create a View, you define its structure in the cluster metadata, specifying the indices it should cover and any transformations or filters you want to apply. This step involves standard CRUD operations, and the View definition is stored persistently in the cluster.

#### Example Request

```json
POST /_views
{
  "name": "my-view",
  "description": "A view combining multiple http log indices",
  "targets": [
    {
      "indexPattern": "http-logs-*"
    }
  ]
}
```

This example creates a View named `my_view` that targets all indices matching the pattern `http-logs-*`.

### Step 2: Query a View

After creating a View, you can search it just like any other index. However, the search query is internally transformed to operate over the physical indices defined in the View.

#### Example Search Request

```json
GET /_views/my_view/_search
{
  "query": {
    "match": {
      "status": "200"
    }
  }
}
```

This search request queries the `my_view` View for documents with a `status` of `200`.

### Step 3: Update a View

Views can be updated to change their target indices, add or remove filters, or modify other aspects of their configuration.

#### Example Update Request

```json
PUT /_views/my_view
{
  "description": "View including error logs",
  "targets": [
    {
      "indexPattern": "http-logs-*",
    },
    {
      "indexPattern": "error-http-logs-*",
    }
  ]
}
```

This request updates the `my_view` configuration to include both the original HTTP logs and the error HTTP logs. By doing so, searches performed against `my_view` will now encompass a broader range of data, ensuring comprehensive access to all relevant log information.

### Step 4: Delete a View

When a View is no longer needed, it can be deleted. Deleting a View does not affect the physical indices it covers.

#### Example Delete Request

```json
DELETE /_views/my_view
```

This request deletes the `my_view`.

### Use Cases and Best Practices

- **Flexibility**: Change the searched by OpenSearch queries without updating any clients.
- **Security**: Limit query access to specific data by defining Views that expose only necessary information.
- **Simplification**: Abstract away the complexity of underlying index patterns, making it easier for users to query data.

### Managing Views in OpenSearch Dashboards

Currently, Views management is primarily through the OpenSearch API. Future updates may introduce graphical management and visualization of Views within OpenSearch Dashboards.

### Conclusion

Views in OpenSearch offer a flexible and powerful way to work with data across multiple indices. By abstracting the physical storage details, they allow for simpler queries, better security, and easier data management.

For further details and advanced configurations, refer to the OpenSearch documentation on Views.
