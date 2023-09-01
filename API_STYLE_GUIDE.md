# API Style Guide

This guide provides the basic structure for creating OpenSearch API documentation. It includes the various elements that we feel are most important to creating complete and useful API documentation, as well as description and examples where appropriate.

Depending on the intended purpose of the API, *some sections will be required while others may not be applicable*.

Use the [API_TEMPLATE](templates/API_TEMPLATE.md) to create an API documentation page.

### A note on terminology ###

Terminology for API parameters varies in the software industry, where two or even three names may be used to label the same type of parameter. For consistency, we use the following nomenclature for parameters in our API documentation:
* *Path parameter* – "path parameter" and "URL parameter" are sometimes used synonymously. To avoid confusion, we use "path parameter" in this documentation.
* *Query parameter* – This parameter name is often used synonymously with "request parameter." We use "query parameter" to be consistent.

### General usage for code elements

When you describe any code element in a sentence, such as an API, a parameter, or a field, you can use the noun name. 
  *Example usage*:
  The time field provides a timestamp for job completion.

When you provide an exact example with a value, you can use the code element in code font. 
  *Example usage*: 
  The response provides a value for `time_field`, such as “timestamp.” 

Provide a REST API call example in `json` format. Optionally, also include the `curl` command if the call can only be executed in a command line.

## Basic elements for documentation

The following sections describe the basic API documentation structure. Each section is discussed under its respective heading. Include only those elements appropriate to the API. 

Depending on where the documentation appears within a section or subsection, heading levels may be adjusted to fit with other content.

1. Name of API (heading level 2)
1. (Optional) Path and HTTP methods (heading level 3)
1. Path parameters (heading level 3)
1. Query parameters (heading level 3)
1. Request fields (heading level 3)
1. Example request (heading level 4)
1. Example response (heading level 4)
1. Response fields (heading level 3)

## API name

Provide an API name that describes its function, followed by a description of its top use case and any usage recommendations.

*Example function*: "Autocomplete queries"

Use sentence capitalization for the heading (for example, "Create or update mappings"). When you refer to the API operation, you can use lowercase with code font.

If there is a corresponding OpenSearch Dashboards feature, provide a “See also” link that references it. 
*Example*: “To learn more about monitor findings, see [Document findings](https://opensearch.org/docs/latest/monitoring-plugins/alerting/monitors/#document-findings)."

If applicable, provide any caveats to its usage with a note or tip, as in the following example:

"If you use the Security plugin, make sure you have the appropriate permissions."
(To set this point in note-style format, follow the text on the next line with {: .note})

### Path and HTTP methods

For relatively complex API calls that include path parameters, it's sometimes a good idea to provide an example so that users can visualize how the request is properly formed. This section is optional and includes examples that illustrate how the endpoint and path parameters fit together in the request. The following is an example of this section for the nodes stats API:

```json
GET /_nodes/stats
GET /_nodes/<node_id>/stats
GET /_nodes/stats/<metric>
GET /_nodes/<node_id>/stats/<metric>
GET /_nodes/stats/<metric>/<index_metric>
GET /_nodes/<node_id>/stats/<metric>/<index_metric>
```

### Path parameters

While the API endpoint states a point of entry to a resource, the path parameter acts on the resource that precedes it. Path parameters come after the resource name in the URL.

In the following example, the resource is `scroll` and its path parameter is `<scroll_id>`:

```json
GET _search/scroll/<scroll_id>
```

Introduce what the path parameters can do at a high level. Provide a table with parameter names and descriptions. Include a table with the following columns:
*Parameter* – Parameter name in plain font.
*Data type* – Data type capitalized (such as Boolean, String, or Integer).
*Description* – Sentence to describe the parameter function, default values or range of values, and any usage examples.

Parameter | Data type | Description
:--- | :--- | :---

### Query parameters

In terms of placement, query parameters are always appended to the end of the URL and located to the right of the operator "?". Query parameters serve the purpose of modifying information to be retrieved from the resource.

In the following example, the endpoint is `aliases` and its query parameter is `v` (provides verbose output):

```json
GET _cat/aliases?v
```

Include a paragraph that describes how to use the query parameters with an example in code font. Include the query parameter operator "?" to delineate query parameters from path parameters.

For GET and DELETE APIs: Introduce what you can do with the optional parameters. Include a table with the same columns as the path parameter table.

Parameter | Data type | Description
:--- | :--- | :---

### Request fields

For PUT and POST APIs: Introduce what the request fields are allowed to provide in the body of the request.

Include a table with these columns: 
*Field* – Field name in plain font.
*Data type* – Data type capitalized (such as Boolean, String, or Integer).
*Description* – Sentence to describe the field’s function, default values or range of values, and any usage examples.

Field | Data type | Description
:--- | :--- | :--- 

#### Example request

Provide a sentence that describes what is shown in the example, followed by a cut-and-paste-ready API request in JSON format. Make sure that you test the request yourself in the Dashboards Dev Tools console to make sure it works. See the following examples.

The following request gets all the settings in your index:

```json
GET /sample-index1/_settings
```

The following request copies all of your field mappings and settings from a source index to a destination index:

```json
POST _reindex
{
   "source":{
      "index":"sample-index-1"
   },
   "dest":{
      "index":"sample-index-2"
   }
}
```

#### Example response

Include a JSON example response to show what the API returns. See the following examples.

The `GET /sample-index1/_settings` request returns the following response fields: 

```json
{
  "sample-index1": {
    "settings": {
      "index": {
        "creation_date": "1622672553417",
        "number_of_shards": "1",
        "number_of_replicas": "1",
        "uuid": "GMEA0_TkSaamrnJSzNLzwg",
        "version": {
          "created": "135217827",
          "upgraded": "135238227"
        },
        "provided_name": "sample-index1"
      }
    }
  }
}
```

The `POST _reindex` request returns the following response fields: 

```json
{
  "took" : 4,
  "timed_out" : false,
  "total" : 0,
  "updated" : 0,
  "created" : 0,
  "deleted" : 0,
  "batches" : 0,
  "version_conflicts" : 0,
  "noops" : 0,
  "retries" : {
    "bulk" : 0,
    "search" : 0
  },
  "throttled_millis" : 0,
  "requests_per_second" : -1.0,
  "throttled_until_millis" : 0,
  "failures" : [ ]
}
```

### Response fields

For PUT and POST APIs: Define all allowable response fields that can be returned in the body of the response.

Field | Data type | Description
:--- | :--- | :---
