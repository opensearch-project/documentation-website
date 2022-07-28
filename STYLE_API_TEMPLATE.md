# API reference page template

This template provides the basic structure for creating OpenSearch API documentation. It includes the most important elements that should appear in the documentation and helpful suggestions to help support them. Depending on the intended purpose of the API, some sections will be required while others may not be applicable. 

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

See also [Examples](https://alpha-docs-aws.amazon.com/awsstyleguide/latest/styleguide/examples.html) in the AWS Style Guide.

## Basic elements for documentation

The following sections describe the basic API documentation structure. Each section is discussed under its respective heading below. Include those elements appropriate to the API. Depending on where the documentation appears within a section or subsection, heading levels may be adjusted to fit with other content.

1. Name of API (heading level 2)
2. Path parameters (heading level 3)
3. Query parameters (heading level 3)
4. Sample request (heading level 4)
5. Sample response (heading level 4)
6. Request body (heading level 3)
7. Sample request (heading level 4)

## API name

Provide an API name that describes its function, followed by a description of its top use case and any usage recommendations.

*Example function*: "Autocomplete queries"

Use sentence capitalization for the heading (for example, "Create or update mappings"). When you refer to the API operation, you can use lowercase with code font.

If there is a corresponding OpenSearch Dashboards feature, provide a “See also” link that references it. 
*Example*: “To learn more about monitor findings, see [Document findings](https://opensearch.org/docs/latest/monitoring-plugins/alerting/monitors/#document-findings)."

If applicable, provide any caveats to its usage with a note or tip, as in the following example:

"If you use the Security plugin, make sure you have the appropriate permissions."
(To set this point in note-style format, follow the text on the next line with {: .note})

### Path parameters

While the API endpoint states a point of entry to a resource, the path parameter identifies a specific resource within it. Path parameters are located in the path of the endpoint just before the query string and following the resource name in the URL.

```json
GET _search/scroll/<scroll_id>
```
In the example above, the endpoint is `scroll` and its path parameter is `<scroll_id>`.

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

#### Sample request

Provide a sentence that describes what is shown in the example, followed by a cut-and-paste-ready API request in JSON format. Make sure that you test the request yourself in the Dashboards Dev Tools console to make sure it works.

The following request includes the ignore_unavailable query parameter to skip any missing or closed indexes in the response:

```json
PUT /sample-index/_mapping?ignore_unavailable
```

#### Sample response

Include a JSON example response to show what the API returns.

Upon success, the response returns "acknowledged": true

```json
{
"acknowledged": true
}
```

### Request body

For PUT and POST APIs: Introduce what the request fields are allowed to provide in the body of the request.

Include a table with these columns: 
*Field* – Field name in plain font.
*Data Type* – Data type capitalized (such as Boolean, String, or Integer).
*Description* – Sentence to describe the field’s function, default values or range of values, and any usage examples.

Field | Data Type | Description
:--- | :--- | :--- 

#### Sample request

Provide a sentence that describes what is shown in the example, followed by a cut-and-paste-ready API request in JSON format.

The following request creates a new mapping for the sample-index index:
PUT /sample-index/_mapping

```json
{
  "properties": {
    "age": {
      "type": "integer"
    },
    "occupation":{
      "type": "text"
    }
  }
}
```
