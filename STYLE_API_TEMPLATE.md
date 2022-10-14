# API reference style guide

This style guide provides a template with the basic structure for OpenSearch API documentation. It includes the basic headings and helpful suggestions for what information is required in each section.

Depending on the intended purpose of the API, *some sections will be required while others may not be applicable*. For example, only PUT or POST APIs require request and response field descriptions.

### A note on terminology ###

Terminology for API parameters varies in the software industry, where two or even three names may be used to label the same type of parameter. For the sake of consistency, we use the following nomenclature for parameters in our API documentation:
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

The following sections describe the basic API documentation structure. Each section is discussed under its respective heading below. You can include only those elements appropriate to the API. 

Depending on where the documentation appears within a section or subsection, heading levels may be adjusted to fit with other content.

1. Name of API (heading level 2)
1. (Optional) Path parameter usage examples (heading level 3)
1. Path parameters (heading level 3)
1. Query parameters (heading level 3)
1. Request fields (heading level 3)
1. Sample request (heading level 4)
1. Sample response (heading level 4)
1. Response fields (heading level 3)

## {Name of API} API

Provide a paragraph that describes the API functional group, and optionally a description of a top use case. For example, "Alerting API."

If there are important usage tips, deprecated code elements or other pertinent concepts that you want to call out, use a note or tip liquid tag.

#### Examples: Note callouts

If you use the Security plugin, make sure you have the appropriate permissions.
{: .note}

The optional query field `cutoff_frequency` is now deprecated.
{: .note }

If it is a single operation API within an API group, provide a title that describes the API operation. Use sentence capitalization for the heading (for example, "Create or update mappings"). When you refer to the API operation, you can use lowercase with code font.

If there is a corresponding OpenSearch Dashboards feature, provide a “See also” link that references it. 
*Example*: “To learn more about monitor findings, see [Document findings](https://opensearch.org/docs/latest/monitoring-plugins/alerting/monitors/#document-findings)."

### Path parameter usage examples

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

Introduce what the path parameters can do at a high level, and provide a table with parameter names, data types and descriptions.
While the API endpoint states a point of entry to a resource, the path parameter acts on the resource that precedes it. Path parameters come after the resource name in the URL.

```json
GET _search/scroll/<scroll_id>
```
In the example above, the resource is `scroll` and its path parameter is `<scroll_id>`.

Introduce what the path parameters can do at a high level. Provide a table with parameter names and descriptions. Include a table with the following columns:
*Parameter* – Parameter name in plain font.
*Data Type* – Data type capitalized (such as Boolean, String, or Integer).
*Description* – Sentence to describe the parameter function, default values or range of values, and any usage examples.

Parameter | Data Type | Description
:--- | :--- | :---

### Query parameters

In terms of placement, query parameters are always appended to the end of the URL and located to the right of the operator "?". Query parameters serve the purpose of modifying information to be retrieved from the resource.

```json
GET _cat/aliases?v
```

In the example above, the endpoint is `aliases` and its query parameter is `v` (provides verbose output).

Include a paragraph that describes how to use the query parameters with an example in code font. Include the query parameter operator "?" to delineate query parameters from path parameters.

For GET and DELETE APIs: Introduce what you can do with the optional parameters. Include a table with the same columns as the path parameter table.

Parameter | Data Type | Description
:--- | :--- | :---

### Request fields

For PUT and POST APIs: Provide an introductory sentence that summarizes the available request fields that they can provide in the body of the request.

The following table provides the request fields that you can use.

Field | Data Type | Description
:--- | :--- | :---
*Field* – Field name in plain font. | *Data Type* – Data type capitalized (such as Boolean, String, or Integer). | *Description* – Sentence to describe the field’s function, default values or range of values, and any usage examples.

#### Sample request

Provide a sentence that describes what is shown in the example, followed by a cut-and-paste-ready API request in JSON format. Make sure that you test the request yourself in the Dashboards Dev Tools console to make sure it works. See the examples below.

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

#### Sample response

Include a JSON example response to show what the API returns.

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

For PUT and POST APIs: Define all allowable response fields that can be returned in the body of the response, and provide a one-sentence table introduction.

The following table provides descriptions of the response fields returned in the body of the response.

Field | Data Type | Description
:--- | :--- | :---
