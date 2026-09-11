---
layout: default
title: Saved Objects APIs
parent: Saved objects
grand_parent: Dashboards management
nav_order: 15
---

# Saved Objects APIs

Use the Saved Objects APIs to list, retrieve, create, update, export, and import saved objects, for example to copy a set of visualizations between clusters or to inventory the visualizations that a cluster contains.

These endpoints are served by OpenSearch Dashboards rather than by OpenSearch, so send them to the OpenSearch Dashboards host and port (`5601` by default) instead of the OpenSearch REST port. Requests that use `POST`, `PUT`, or `DELETE` require the `osd-xsrf: true` header.

Send these requests using `curl`, as shown in the examples on this page. To run a `GET` endpoint without `curl`, enter its full URL in the address bar of a browser in which you are signed in to OpenSearch Dashboards.

The Dev Tools console cannot call these endpoints because it forwards every request to the OpenSearch REST port, where the saved objects paths do not exist.
{: .note}

If the Security plugin is enabled, pass credentials using the `-u` option and add `-k` if the cluster uses a self-signed certificate:

```bash
curl -k -u admin:<password> "https://localhost:5601/api/saved_objects/_find?type=visualization"
```
{% include copy.html %}

If OpenSearch Dashboards is served from a base path, such as when it runs behind a proxy or on a managed service, include that base path in the request, for example, `https://<host>/_dashboards/api/saved_objects/_find`.

These APIs return the definition of a visualization, such as its aggregations and its index pattern reference. They do not run the visualization or return the data it displays. To export the underlying rows of a saved search as a CSV or Excel file, see [Reporting API]({{site.url}}{{site.baseurl}}/reporting/api/).
{: .note}

To export and import the same objects from OpenSearch Dashboards instead, see [Exporting and importing saved objects]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects/).

## Selecting a tenant

When multi-tenancy is enabled, each tenant has its own set of saved objects. Send the tenant name in the `securitytenant` header to work with the saved objects of a specific tenant:

```bash
curl -k -u admin:<password> -H 'securitytenant: global' "https://localhost:5601/api/saved_objects/_find?type=dashboard&fields=title"
```
{% include copy.html %}

Use `global` for the global tenant and `__user__` for the requesting user's private tenant.

A request that omits the header is served by the first of the following tenants that applies:

1. The tenant recorded in the request's session cookie.
2. The default tenant configured for the cluster.
3. The first tenant in the preferred tenant list that the user can access.
4. The global tenant.
5. The requesting user's private tenant.

A `curl` request carries no session cookie, so under the default configuration it is served by the global tenant.

Passing the tenant as a query parameter does not work, because the saved objects endpoints do not define one: a `securitytenant` or `security_tenant` query parameter is rejected with a `400` error. For more information about tenants, see [OpenSearch Dashboards multi-tenancy]({{site.url}}{{site.baseurl}}/security/multi-tenancy/tenant-index/).

## Find saved objects

The Find Saved Objects API searches for saved objects of one or more types.

### Endpoint

```json
GET {osd_host}:{port}/api/saved_objects/_find
```

### Query parameters

The following table lists the available query parameters. All query parameters except `type` are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `type` | String | The type of saved object to search for, such as `visualization`, `dashboard`, `search`, or `index-pattern`. Repeat the parameter to search multiple types. Required. |
| `search` | String | A query string used to filter results, such as `Sales*`. |
| `search_fields` | String | The fields to match the `search` value against, such as `title`. |
| `fields` | String | The object attributes to include in the response. Repeat the parameter to return multiple attributes. Returning only `title` keeps the response small. |
| `per_page` | Integer | The number of results per page. Default is `20`. |
| `page` | Integer | The page of results to return. Default is `1`. |
| `sort_field` | String | The field to sort results by, such as `updated_at`. |

### Example request

The following request lists the visualizations in the cluster and returns only their titles:

```bash
curl "http://localhost:5601/api/saved_objects/_find?type=visualization&fields=title&per_page=5"
```
{% include copy.html %}

### Example response

```json
{
  "page": 1,
  "per_page": 5,
  "total": 1,
  "saved_objects": [
    {
      "type": "visualization",
      "id": "test-viz",
      "attributes": {
        "title": "Sales by customer"
      },
      "references": [
        {
          "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
          "id": "ecommerce-test-pattern",
          "type": "index-pattern"
        }
      ],
      "migrationVersion": {
        "visualization": "7.10.0"
      },
      "updated_at": "2026-09-02T19:35:47.635Z",
      "version": "WzI5LDdd",
      "namespaces": ["default"],
      "score": null
    }
  ]
}
```

### Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `total` | Integer | The number of saved objects that matched the search. |
| `saved_objects` | Array | The matching saved objects. |
| `saved_objects.id` | String | The ID of the saved object. Use this ID as the report source ID when you create a report definition. |
| `saved_objects.type` | String | The type of the saved object. |
| `saved_objects.attributes` | Object | The definition of the saved object, filtered by the `fields` parameter. |
| `saved_objects.references` | Array | The other saved objects that this object depends on, such as its index pattern. |
| `saved_objects.updated_at` | String | The time at which the saved object was last updated. |

## Get saved object

The Get Saved Object API retrieves a single saved object by type and ID.

### Endpoint

```json
GET {osd_host}:{port}/api/saved_objects/{type}/{id}
```

### Example request

```bash
curl "http://localhost:5601/api/saved_objects/visualization/test-viz"
```
{% include copy.html %}

To retrieve several saved objects in one request, send their types and IDs to the `_bulk_get` endpoint:

```bash
curl -X POST "http://localhost:5601/api/saved_objects/_bulk_get" \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '[{"type": "visualization", "id": "test-viz", "fields": ["title"]}]'
```
{% include copy.html %}

## Create saved object

The Create Saved Object API creates a saved object. Provide an ID to control the object's ID, or omit it to have one generated.

Creating an object with this API requires the same attributes that the application that owns the type expects, and those attributes are not part of a public contract. Export objects from a working instance and import them elsewhere rather than composing visualizations or dashboards by hand.
{: .note}

### Endpoints

```json
POST {osd_host}:{port}/api/saved_objects/{type}
POST {osd_host}:{port}/api/saved_objects/{type}/{id}
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `overwrite` | Boolean | Whether to replace an object that already has the specified ID. Default is `false`, which returns a `409` error when the ID is in use. |

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `attributes` | Object | The definition of the object, in the format that the object's type expects. Required. |
| `references` | Array | The other saved objects that this object depends on, each with a `name`, a `type`, and an `id`. Optional. |

### Example request

```bash
curl -X POST "http://localhost:5601/api/saved_objects/visualization/sales-by-region" \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '{
    "attributes": {
      "title": "Sales by region",
      "visState": "{\"type\":\"pie\"}",
      "kibanaSavedObjectMeta": {"searchSourceJSON": "{}"}
    },
    "references": [
      {
        "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
        "type": "index-pattern",
        "id": "ecommerce-test-pattern"
      }
    ]
  }'
```
{% include copy.html %}

### Example response

```json
{
  "type": "visualization",
  "id": "sales-by-region",
  "attributes": {
    "title": "Sales by region",
    "visState": "{\"type\":\"pie\"}",
    "kibanaSavedObjectMeta": {
      "searchSourceJSON": "{}"
    }
  },
  "references": [
    {
      "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
      "type": "index-pattern",
      "id": "ecommerce-test-pattern"
    }
  ],
  "migrationVersion": {
    "visualization": "7.10.0"
  },
  "updated_at": "2026-09-08T20:30:46.728Z",
  "version": "WzcxLDhd",
  "namespaces": ["default"]
}
```

To create several objects in one request, send them to the `_bulk_create` endpoint, which accepts the same `overwrite` parameter:

```bash
curl -X POST "http://localhost:5601/api/saved_objects/_bulk_create" \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '[{"type": "visualization", "id": "sales-by-day", "attributes": {"title": "Sales by day", "visState": "{}", "kibanaSavedObjectMeta": {"searchSourceJSON": "{}"}}}]'
```
{% include copy.html %}

The response contains the created objects in a `saved_objects` array.

## Update saved object

The Update Saved Object API updates the attributes of an existing saved object. The fields that you send replace the corresponding fields of the object, and the fields that you omit are left unchanged.

### Endpoint

```json
PUT {osd_host}:{port}/api/saved_objects/{type}/{id}
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `attributes` | Object | The fields of the object to update. Required. |
| `references` | Array | The references to replace. Sending this field replaces the object's entire reference list. Optional. |

### Example request

```bash
curl -X PUT "http://localhost:5601/api/saved_objects/visualization/sales-by-region" \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '{"attributes": {"title": "Sales by region and month"}}'
```
{% include copy.html %}

### Example response

The response contains the updated fields rather than the full object:

```json
{
  "id": "sales-by-region",
  "type": "visualization",
  "updated_at": "2026-09-08T20:30:47.950Z",
  "version": "WzczLDhd",
  "namespaces": ["default"],
  "attributes": {
    "title": "Sales by region and month"
  }
}
```

## Delete saved object

The Delete Saved Object API deletes a saved object. Deleting an object that others reference, such as an index pattern used by a visualization, leaves those objects with a missing reference. Use the **Relationships** action in **Dashboards Management** > **Saved objects**, or the `references` field returned by the [Find Saved Objects API](#find-saved-objects), to check what depends on an object before you delete it.

### Endpoint

```json
DELETE {osd_host}:{port}/api/saved_objects/{type}/{id}
```

### Example request

```bash
curl -X DELETE "http://localhost:5601/api/saved_objects/visualization/sales-by-day" \
  -H 'osd-xsrf: true'
```
{% include copy.html %}

### Example response

```json
{}
```

## Export saved objects

The Export Saved Objects API exports saved objects as newline-delimited JSON (NDJSON). Each line is one saved object, and the final line summarizes the export.

An export contains only the objects of the tenant that serves the request, so a backup of every tenant requires one request per tenant. For more information, see [Selecting a tenant](#selecting-a-tenant).

### Endpoint

```json
POST {osd_host}:{port}/api/saved_objects/_export
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `type` | String or Array | The types of saved object to export, such as `visualization`. Provide either `type` or `objects`. |
| `objects` | Array | The specific saved objects to export, each with a `type` and an `id`. Provide either `type` or `objects`. |
| `includeReferencesDeep` | Boolean | Whether to also export the objects that the exported objects depend on, such as their index patterns. Set to `true` so that the export can be imported into a cluster that does not already contain those references. Optional. Default is `false`. |
| `search` | String | A query string that limits the export to matching objects, such as `Sales*`. Use with `type`. Optional. |
| `excludeExportDetails` | Boolean | Whether to omit the summary line at the end of the output. Optional. Default is `false`. |
| `workspaces` | Array | The workspaces to export objects from. Use with `type`. Optional. |

A request sent to a workspace path is limited to that workspace even when the request body omits `workspaces`:

```json
POST {osd_host}:{port}/w/{workspace_id}/api/saved_objects/_export
```
{% include copy.html %}

The same path prefix associates imported objects with a workspace, so you can use it in place of the `workspaces` query parameter of the [Import Saved Objects API](#import-saved-objects).

### Example request

The following request exports one visualization along with the index pattern it references:

```bash
curl -X POST "http://localhost:5601/api/saved_objects/_export" \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '{"objects": [{"type": "visualization", "id": "test-viz"}], "includeReferencesDeep": true}' \
  -o export.ndjson
```
{% include copy.html %}

To export every visualization instead of a specific one, replace `objects` with `"type": "visualization"`.

### Example response

The last line of the NDJSON output summarizes the export:

```json
{"exportedCount": 2, "missingRefCount": 0, "missingReferences": []}
```

### Exporting all saved objects

To back up an entire OpenSearch Dashboards instance, list the types to export:

```bash
curl -X POST "http://localhost:5601/api/saved_objects/_export" \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -d '{"type": ["config", "index-pattern", "search", "visualization", "dashboard", "url", "query"], "includeReferencesDeep": true}' \
  -o backup.ndjson
```
{% include copy.html %}

When multi-tenancy is enabled, repeat the request for each tenant, as described in [Selecting a tenant](#selecting-a-tenant).

Installed plugins register additional types, so the types available in one instance can differ from those in another. To see the types that an instance contains, review the **Type** filter in **Dashboards Management** > **Saved objects**. Requesting a type that cannot be exported returns the following error:

```json
{"statusCode": 400, "error": "Bad Request", "message": "Trying to export non-exportable type(s): bogus-type"}
```

## Import saved objects

The Import Saved Objects API imports saved objects from an NDJSON file produced by the [Export Saved Objects API](#export-saved-objects) or by an export from **Dashboards Management** > **Saved objects**. Send the file as multipart form data in a `file` field. The file must use the `.ndjson` extension.

### Endpoint

```json
POST {osd_host}:{port}/api/saved_objects/_import
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `overwrite` | Boolean | Whether to replace saved objects that already exist. Default is `false`, which causes conflicting objects to be reported as errors instead of imported. Cannot be combined with `createNewCopies`. |
| `createNewCopies` | Boolean | Whether to import the objects under new IDs, preserving the existing objects. Cannot be combined with `overwrite`. |
| `dataSourceId` | String | The ID of the data source to attach the imported objects to when multiple data sources are enabled. |
| `workspaces` | String or Array | The workspaces to import the objects into. |

### Example request

```bash
curl -X POST "http://localhost:5601/api/saved_objects/_import?overwrite=true" \
  -H 'osd-xsrf: true' \
  --form file=@export.ndjson
```
{% include copy.html %}

### Example response

```json
{
  "successCount": 2,
  "success": true,
  "successResults": [
    {
      "type": "index-pattern",
      "id": "ecommerce-test-pattern",
      "meta": {
        "title": "ecommerce-test",
        "icon": "indexPatternApp"
      },
      "overwrite": true
    },
    {
      "type": "visualization",
      "id": "test-viz",
      "meta": {
        "title": "Sales by customer",
        "icon": "visualizeApp"
      },
      "overwrite": true
    }
  ]
}
```

### Import errors

An import can fail for some objects and succeed for others. When any object fails, `success` is `false` and each failure appears in `errors` with an `error.type` field that identifies the cause:

```json
{
  "successCount": 0,
  "success": false,
  "errors": [
    {
      "id": "orphan-viz",
      "type": "visualization",
      "title": "Orphan",
      "meta": {
        "title": "Orphan",
        "icon": "visualizeApp"
      },
      "error": {
        "type": "missing_references",
        "references": [
          {
            "type": "index-pattern",
            "id": "does-not-exist"
          }
        ]
      }
    }
  ]
}
```

The following table lists the most common error types.

| Error type | Cause | Resolution |
| :--- | :--- | :--- |
| `missing_references` | The object refers to an object that the import does not contain and the target instance does not have, such as an index pattern. | Export the source objects again with `includeReferencesDeep` set to `true`, create the missing object, or ignore the reference using the [Resolve Import Errors API](#resolve-import-errors). |
| `conflict` | An object with the same type and ID already exists. | Retry with `overwrite=true` or `createNewCopies=true`. |
| `unsupported_type` | No installed plugin registers the object's type. | Install the plugin that provides the type or remove the object from the file. |

Because the response returns a `200` status code even when objects fail to import, check the `success` field rather than the status code when you script an import.
{: .note}

## Resolve import errors

The Resolve Import Errors API retries a failed import with per-object instructions, such as overwriting a specific object or ignoring a missing reference. Send the same NDJSON file that the import used, along with a `retries` field that lists the objects to retry.

### Endpoint

```json
POST {osd_host}:{port}/api/saved_objects/_resolve_import_errors
```

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `createNewCopies` | Boolean | Whether to import the retried objects under new IDs. Default is `false`. |
| `dataSourceId` | String | The ID of the data source to attach the imported objects to. |
| `workspaces` | String or Array | The workspaces to import the objects into. |

### Request body fields

Send the following fields as multipart form data.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `file` | File | The NDJSON file that the failed import used. Required. |
| `retries` | Array | The objects to retry. Required. |
| `retries.type` | String | The type of the object to retry. Required. |
| `retries.id` | String | The ID of the object to retry. Required. |
| `retries.overwrite` | Boolean | Whether to replace the existing object. Default is `false`. |
| `retries.destinationId` | String | The ID to assign to the imported object. |
| `retries.replaceReferences` | Array | The references to repoint, each with a `type`, a `from` ID, and a `to` ID. |
| `retries.ignoreMissingReferences` | Boolean | Whether to import the object even though a reference is missing. |

### Example request

The following request retries a visualization whose index pattern is missing, importing it without the reference:

```bash
curl -X POST "http://localhost:5601/api/saved_objects/_resolve_import_errors" \
  -H 'osd-xsrf: true' \
  --form file=@export.ndjson \
  --form 'retries=[{"type": "visualization", "id": "orphan-viz", "ignoreMissingReferences": true}]'
```
{% include copy.html %}

### Example response

```json
{
  "successCount": 1,
  "success": true,
  "successResults": [
    {
      "type": "visualization",
      "id": "orphan-viz",
      "meta": {
        "title": "Orphan",
        "icon": "visualizeApp"
      }
    }
  ]
}
```

## Limitations

The following limits and caveats apply to the Saved Objects APIs.

### File format

The import endpoints accept only files with the `.ndjson` extension. A file with any other extension returns `{"statusCode": 400, "error": "Bad Request", "message": "Invalid file extension .json"}`. The legacy `/api/opensearch-dashboards/dashboards/export` endpoint produces a single JSON document instead of NDJSON, so its output cannot be imported with `_import`. Export the objects with `_export`, or from **Dashboards Management** > **Saved objects**, and import the resulting NDJSON file.

### Request size

The import endpoints are bounded by the `savedObjects.maxImportPayloadBytes` setting, which is `26214400` (25 MB) by default. The `server.maxPayloadBytes` setting, which is `1048576` (1 MB) by default, applies to other OpenSearch Dashboards routes and does not raise or lower the import limit.

A `413 Request Entity Too Large` response for a file smaller than 25 MB usually comes from a proxy in front of OpenSearch Dashboards rather than from OpenSearch Dashboards itself. Raise the body size limit of the proxy, such as `client_max_body_size` in NGINX or `proxy-body-size` in an NGINX Ingress controller.

### Object count

A single export or import is limited to `10000` objects by the `savedObjects.maxImportExportSize` setting. Split larger transfers by type or by search term.

### Conflicting parameters

The `overwrite` and `createNewCopies` parameters cannot be used together. Sending both returns the following error:

```json
{"statusCode": 400, "error": "Bad Request", "message": "[request query]: cannot use [overwrite] with [createNewCopies]"}
```

### Version compatibility

Import an NDJSON file into an instance running the same version of OpenSearch Dashboards as the instance that exported it, or a later one. Objects are migrated forward as they are imported, but they cannot be migrated backward. An object exported from a later version fails with an error similar to the following:

```
Document "test-viz" has property "visualization" which belongs to a more recent version of OpenSearch Dashboards [7.10.0]. The last known version is [7.9.3]
```

## Related documentation

- [Exporting and importing saved objects]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects/)
- [Reporting API]({{site.url}}{{site.baseurl}}/reporting/api/)
- [Access control lists for saved objects]({{site.url}}{{site.baseurl}}/dashboards/management/acl/)
- [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/)
